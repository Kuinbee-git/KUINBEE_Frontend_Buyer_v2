import assert from "node:assert/strict";
import { createServer } from "node:http";
import { build } from "esbuild";
import { chromium } from "playwright";

// Bundle the real components; only network/framework boundaries are fixtures.
const mocks = {
  "@/shared/components/ui/notch-navigation": `export const NotchNavigation = () => null;`,
  "@/shared/components/ui/institutional-background": `export const InstitutionalBackground = () => null;`,
  "@/core/providers/AuthProvider": `export const useAuth = () => ({user:{email:'buyer@example.test'}});`,
  "@/hooks/api/usePayments": `
    export const useCreateCheckout = () => ({mutateAsync: async body => {window.calls.push(['checkout',body]);return {checkout:{orderId:window.fixture.paymentId,orderNumber:'TEST-ORDER',paymentAttemptId:'attempt',amountPaise:100,currency:'INR',razorpay:{keyId:'fixture',orderId:'rzp-fixture'}}};}});
    export const useConfirmPayment = () => ({mutateAsync: async body => window.calls.push(['confirm',body])});
    export const usePaymentOrder = (id,enabled) => {window.paymentPolling={id,enabled};return {data:window.fixture.orderData};};`,
  "next/link": `import React from 'react'; export default function Link({href,...props}) {return React.createElement('a',{href,...props});}`,
  "next/navigation": `export const useRouter = () => ({push: value => window.calls.push(['navigate', value])}); export const useSearchParams = () => new URLSearchParams(window.fixture.search);`,
  "@/components/router/Link": `export { default as Link } from 'next/link';`,
  "@/core/providers/ModalProvider": `export const useModal = () => ({openModal: name => window.calls.push(['modal', name])});`,
  "@/core/api": `export const API_BASE_URL = 'http://127.0.0.1';`,
  "@/hooks/api/useAuth": `
    const mutation = name => ({isPending: false, mutateAsync: async value => { window.calls.push([name, value]); if(window.fixture.failure) throw window.fixture.failure; }});
    export const useConfirmPasswordReset = () => mutation('reset');
    export const useSendEmailVerification = () => mutation('verify');
    export const useChangePassword = () => mutation('password');
    export const useUnlinkProvider = () => mutation('unlink');
    export const useLinkProvider = () => mutation('link');
    export const useSecurityOverview = () => ({data: {security: {providers: []}}, isLoading: false});`,
  "@/hooks/api/useProfile": `export const useProfile = () => ({data: window.fixture.profile ? {profile: window.fixture.profile} : undefined, isLoading: !window.fixture.profile}); export const useUpdateProfile = () => ({isPending: false, mutateAsync: async value => window.calls.push(['profile', value])}); export const useDeleteAccount = () => ({isPending: false});`,
  "@/hooks/api/usePreferences": `export const usePreferences = () => ({data: window.fixture.preferences ? {preferences: window.fixture.preferences} : undefined, isLoading: !window.fixture.preferences}); export const useUpdatePreferences = () => ({isPending: false, mutateAsync: async value => window.calls.push(['preferences', value])});`,
  "@/services/kdts.service": `export const getDatasetKdts = id => new Promise(resolve => {window.scoreResolvers[id] = resolve;});`,
  "@/hooks/api/useLibrary": `export const useLibrary = ({page}) => {window.requestedPage = page; return {data: window.fixture.pages?.[page], isLoading: !window.fixture.pages?.[page], refetch: () => {}};};`,
  "./owned-dataset-card": `export const OwnedDatasetCard = ({dataset}) => <div>{dataset.title}</div>;`,
};
const entry = `
  import React from 'react'; import { createRoot } from 'react-dom/client'; import {flushSync} from 'react-dom';
 import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
 import {RazorpayCheckoutFlow} from './src/features/datasets/components/razorpay-checkout-flow';
  import { AuthModal } from './src/features/auth/components/auth-modal';
  import { WebsiteFeedbackModal } from './src/app/datasets/[id]/_components/website-feedback-modal';
  import { ResetPasswordModalContent } from './src/features/auth/components/reset-password-modal-content';
  import { VerifyEmailModalContent } from './src/features/auth/components/verify-email-modal-content';
  import { ProfileTab } from './src/features/account/tabs/profile-tab';
  import { PreferencesTab } from './src/features/account/tabs/preferences-tab';
  import { DatasetKdtsBadge } from './src/features/datasets/components/DatasetKdtsBadge';
  import { MyDatasetsPage } from './src/features/library/components/my-datasets-page';
  window.calls = []; window.scoreResolvers = {}; window.fixture = {view:'reset',search:'email=first@example.test&token=first'};
  const root = createRoot(document.getElementById('root'));
  const queryClient = new QueryClient(); window.queryClient=queryClient;
  window.Razorpay=class { constructor(options){window.paymentOptions=options;} on(){} open(){window.calls.push(['sdk-open']);} };

  function App() {
    const closeTag = window.fixture.closeTag;
    switch(window.fixture.view) {
      case 'checkout': return <RazorpayCheckoutFlow key={window.fixture.paymentId} datasetId="dataset-fixture" datasetTitle="Fixture dataset" amount={1} open={true} onOpenChange={()=>{}} onComplete={id=>window.calls.push(['payment-complete',id])}/>;
      case 'modal': return <AuthModal onClose={() => window.calls.push(['closed',closeTag])}>Modal fixture</AuthModal>;
      case 'feedback': return <WebsiteFeedbackModal open={window.fixture.open} loading={false} onOpenChange={open => window.renderFixture({open})} onSubmit={async value => window.calls.push(['feedback',value])}/>;
      case 'reset': return <ResetPasswordModalContent/>;
      case 'verify': return <VerifyEmailModalContent/>;
      case 'profile': return <ProfileTab/>;
      case 'preferences': return <PreferencesTab/>;
      case 'score': return <DatasetKdtsBadge datasetId={window.fixture.datasetId}/>;
      case 'library': return <MyDatasetsPage/>;
    }
  }
  window.renderFixture = patch => { Object.assign(window.fixture,patch); flushSync(()=>root.render(<QueryClientProvider client={queryClient}><App/></QueryClientProvider>)); }; window.renderFixture({});
`;
const result = await build({
  stdin: { contents: entry, loader: "jsx", resolveDir: process.cwd() },
  bundle: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  outdir: "/tmp/kuinbee-component-browser-bundle",
  define: {
    "process.env": JSON.stringify({
      NODE_ENV: "development",
      NEXT_PUBLIC_APP_ENV: "production",
      NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1",
    }),
  },
  plugins: [
    {
      name: "fixture-boundaries",
      setup(builder) {
        builder.onResolve({ filter: /.*/ }, (args) =>
          Object.hasOwn(mocks, args.path)
            ? { path: args.path, namespace: "fixture" }
            : null
        );
        builder.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({
          contents: mocks[args.path],
          loader: "jsx",
          resolveDir: process.cwd(),
        }));
      },
    },
  ],
});
const server = createServer((req, res) => {
  res.setHeader(
    "Content-Type",
    req.url === "/bundle.js" ? "text/javascript" : "text/html"
  );
  res.end(
    req.url === "/bundle.js"
      ? result.outputFiles[0].text
      : '<div id="root"></div><script src="/bundle.js"></script>'
  );
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  const external = [];
  page.on("pageerror", (error) => {
    errors.push(error.message);
    console.error("Component browser error:", error.message);
  });
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).origin !== origin) {
      external.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto(origin);
  await page.locator("#new-password").fill("Strong-password-123");
  await page.locator("#confirm-password").fill("Strong-password-123");
  await page.evaluate(() =>
    window.renderFixture({ search: "email=next@example.test&token=next" })
  );
  await page
    .getByRole("button", { name: "Reset Password", exact: true })
    .click();
  await page.waitForFunction(() => window.calls.some((c) => c[0] === "reset"));
  assert.deepEqual(
    await page.evaluate(() => window.calls.find((c) => c[0] === "reset")[1]),
    {
      email: "next@example.test",
      token: "next",
      newPassword: "Strong-password-123",
    }
  );
  console.log(
    "PASS password reset uses current URL token and retains edited password"
  );

  await page.evaluate(() => {
    sessionStorage.setItem("pending_verification_email", "verify@example.test");
    window.renderFixture({ view: "verify" });
  });
  await page.getByRole("button", { name: "Resend Email" }).click();
  assert.deepEqual(
    await page.evaluate(() => window.calls.find((c) => c[0] === "verify")[1]),
    { email: "verify@example.test" }
  );
  console.log(
    "PASS verification reads browser storage and resends to the intended address"
  );

  await page.evaluate(() => window.renderFixture({ view: "profile" }));
  await page.evaluate(() =>
    window.renderFixture({
      profile: {
        user: { email: "person@example.test", phone: "123" },
        personalInfo: { firstName: "Initial", lastName: "Name" },
        organization: "Org",
      },
    })
  );
  await page.locator("#firstName").fill("Edited");
  await page.evaluate(() => window.renderFixture({}));
  assert.equal(await page.locator("#firstName").inputValue(), "Edited");
  await page.getByRole("button", { name: "Save Changes", exact: true }).click();
  assert.equal(
    (await page.evaluate(() => window.calls.find((c) => c[0] === "profile")[1]))
      .personalInfo.firstName,
    "Edited"
  );
  await page.evaluate(() =>
    window.renderFixture({
      profile: {
        ...window.fixture.profile,
        personalInfo: { firstName: "Refreshed", lastName: "Name" },
      },
    })
  );
  await page.waitForFunction(
    () => document.querySelector("#firstName")?.value === "Refreshed"
  );
  console.log(
    "PASS profile loads asynchronously, preserves edits on rerender, and refreshes from new data"
  );

  await page.evaluate(() =>
    window.renderFixture({
      view: "preferences",
      preferences: {
        currency: "USD",
        marketingEmails: false,
        productEmails: true,
      },
    })
  );
  const switches = page.getByRole("switch");
  await switches.nth(1).click();
  await page.evaluate(() => window.renderFixture({}));
  assert.equal(await switches.nth(1).getAttribute("aria-checked"), "true");
  await page
    .getByRole("button", { name: "Save Preferences", exact: true })
    .click();
  assert.equal(
    (
      await page.evaluate(
        () => window.calls.find((c) => c[0] === "preferences")[1]
      )
    ).marketingEmails,
    true
  );
  console.log("PASS preference edits survive rerenders and submit correctly");

  await page.evaluate(() =>
    window.renderFixture({ view: "score", datasetId: "first" })
  );
  await page.waitForFunction(() => window.scoreResolvers.first);
  await page.evaluate(() => window.renderFixture({ datasetId: "second" }));
  await page.waitForFunction(() => window.scoreResolvers.second);
  await page.evaluate(() =>
    window.scoreResolvers.first({ currentScore: "99" })
  );
  assert.equal(await page.locator("body").innerText(), "");
  await page.evaluate(() =>
    window.scoreResolvers.second({ currentScore: "81" })
  );
  await page.getByText(/KDTS.*81.0/).waitFor();
  console.log(
    "PASS late dataset score responses cannot leak into the next dataset"
  );

  await page.evaluate(() =>
    window.renderFixture({
      view: "library",
      pages: { 1: { items: [], total: 40 } },
    })
  );
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.waitForFunction(() => window.requestedPage === 2);
  await page.evaluate(() => window.renderFixture({}));
  assert.equal(await page.evaluate(() => window.requestedPage), 2);
  await page.evaluate(() =>
    window.renderFixture({
      pages: { ...window.fixture.pages, 2: { items: [], total: 40 } },
    })
  );
  await page.getByText("Page 2 of 2").waitFor();
  console.log(
    "PASS library pagination retains the requested page while loading"
  );
  await page.evaluate(() =>
    window.renderFixture({ view: "modal", closeTag: "old" })
  );
  await page.getByText("Modal fixture").waitFor();
  await page.evaluate(() => window.renderFixture({ closeTag: "new" }));
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => window.calls.some((c) => c[0] === "closed"));
  assert.deepEqual(
    await page.evaluate(() => window.calls.filter((c) => c[0] === "closed")),
    [["closed", "new"]]
  );
  await page.evaluate(() =>
    window.renderFixture({ view: "feedback", open: true })
  );
  await page.getByRole("button", { name: "Rate 4 stars", exact: true }).click();
  await page.locator("textarea").fill("First draft");
  await page.getByRole("button", { name: "Skip", exact: true }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.evaluate(() => window.renderFixture({ open: true }));
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.locator("textarea").inputValue(), "");
  assert.equal(
    await page
      .getByRole("button", { name: "Submit Review", exact: true })
      .isDisabled(),
    true
  );
  console.log(
    "PASS Escape uses the current callback and feedback is reset between openings"
  );
  for (const status of ["COMPLETED", "FAILED", "REFUNDED", "TIMEOUT"]) {
    if (status === "TIMEOUT") await page.clock.install();
    const paymentId = `fixture-${status.toLowerCase()}`;
    await page.evaluate(
      ({ paymentId }) =>
        window.renderFixture({
          view: "checkout",
          paymentId,
          orderData: undefined,
        }),
      { paymentId }
    );
    await page.evaluate(() =>
      window.queryClient.setQueryData(
        ["entitlements", "dataset-fixture", "check"],
        { entitled: false }
      )
    );
    await page.getByRole("button", { name: "Pay ₹1", exact: true }).click();
    await page.waitForFunction(() => window.paymentOptions);
    await page.evaluate(() =>
      window.paymentOptions.handler({
        razorpay_order_id: "rzp-fixture",
        razorpay_payment_id: "pay-fixture",
        razorpay_signature: "fixture-signature",
      })
    );
    await page.waitForFunction(() => window.paymentPolling.enabled);
    await page.evaluate(
      ({ paymentId }) =>
        window.renderFixture({
          orderData: {
            order: { id: paymentId, status: "PENDING" },
            paymentAttempts: [{ status: "CLIENT_CONFIRMED" }],
          },
        }),
      { paymentId }
    );
    assert.equal(
      await page.getByText("Payment Complete", { exact: true }).count(),
      0
    );
    assert.equal(
      await page.evaluate(
        () =>
          window.queryClient.getQueryData([
            "entitlements",
            "dataset-fixture",
            "check",
          ]).entitled
      ),
      false
    );
    assert.equal(
      await page.evaluate(() => window.paymentPolling.enabled),
      true
    );
    if (status === "TIMEOUT") {
      await page.clock.fastForward(46_000);
      await page
        .getByText("Payment confirmation pending", { exact: true })
        .waitFor();
      assert.equal(
        await page.getByText("Payment Received", { exact: true }).count(),
        0
      );
      assert.equal(
        await page.getByText("Payment Complete", { exact: true }).count(),
        0
      );
      assert.equal(
        await page.evaluate(() => window.paymentPolling.enabled),
        false
      );
      assert.equal(
        await page.evaluate(
          (id) =>
            window.calls.filter(
              (c) => c[0] === "payment-complete" && c[1] === id
            ).length,
          paymentId
        ),
        0
      );
      continue;
    }
    // Ignore stale data for a different order.
    await page.evaluate(() =>
      window.renderFixture({
        orderData: {
          order: { id: "previous-order", status: "COMPLETED" },
          paymentAttempts: [],
        },
      })
    );
    assert.equal(
      await page.getByText("Payment Complete", { exact: true }).count(),
      0
    );
    await page.evaluate(
      ({ paymentId, status }) =>
        window.renderFixture({
          orderData: { order: { id: paymentId, status }, paymentAttempts: [] },
        }),
      { paymentId, status }
    );
    if (status === "COMPLETED") {
      await page.getByText("Payment Complete", { exact: true }).waitFor();
      await page.waitForFunction(() =>
        window.calls.some((c) => c[0] === "payment-complete")
      );
      await page.evaluate(() =>
        window.renderFixture({ orderData: { ...window.fixture.orderData } })
      );
      assert.equal(
        await page.evaluate(
          (id) =>
            window.calls.filter(
              (c) => c[0] === "payment-complete" && c[1] === id
            ).length,
          paymentId
        ),
        1
      );
      assert.equal(
        await page.evaluate(
          () =>
            window.queryClient.getQueryData([
              "entitlements",
              "dataset-fixture",
              "check",
            ]).entitled
        ),
        false
      );
    } else {
      await page
        .getByText(
          status === "REFUNDED"
            ? "Payment was refunded."
            : "Payment failed. Please try again.",
          { exact: true }
        )
        .waitFor();
      assert.equal(
        await page.evaluate(
          (id) =>
            window.calls.filter(
              (c) => c[0] === "payment-complete" && c[1] === id
            ).length,
          paymentId
        ),
        0
      );
    }
    assert.equal(
      await page.evaluate(() => window.paymentPolling.enabled),
      false
    );
  }
  console.log(
    "PASS checkout ignores stale orders and client-only confirmation, completes once, invalidates recorded access without fabricating entitlement, and displays failed/refunded outcomes without real payments"
  );
  assert.deepEqual(external, [], "No external API or provider calls permitted");
  assert.deepEqual(errors, [], "No browser exceptions permitted");
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

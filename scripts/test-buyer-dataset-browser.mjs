import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
import {
  tableMetadataFixture,
  captureTableMetadataViews,
} from "./table-metadata-fixtures.mjs";
import {
  DatasetContentFreeClaimBodySchema,
  DatasetFileAccessPageQuerySchema,
  DatasetFileDownloadBodySchema,
  DatasetFileDownloadResponseSchema,
  DatasetFileObservationQuerySchema,
  DatasetFileObservationResponseSchema,
  DatasetPrivateTableMetadataQuerySchema,
  DatasetPrivateTableMetadataResponseSchema,
  DatasetPublicTableMetadataQuerySchema,
  DatasetPublicTableMetadataResponseSchema,
} from "@kuinbee/dataset-preparation-contracts";
import {
  dataset,
  offer,
  grant,
  fileContext,
  fileMember,
  actorId,
  otherActorId,
  id,
  now,
  modalitySets,
} from "./buyer-dataset-fixtures.mjs";

// Real buyer components, protocols, cookies, native sessionStorage and existing
// Razorpay orchestration. Auth/shell/provider/backend are explicit test fixtures.
const require = createRequire(import.meta.url),
  postcss = require(
    require.resolve("postcss", {
      paths: [require.resolve("@tailwindcss/postcss")],
    })
  );
const css = (
  await postcss([
    require("@tailwindcss/postcss")({ base: process.cwd() }),
  ]).process(await readFile("src/app/globals.css", "utf8"), {
    from: resolve("src/app/globals.css"),
  })
).css;
let bundle;
const withdrawn = new Set();
const models = new Map(),
  grants = new Map(),
  members = new Map(),
  orders = new Map(),
  fileCounts = new Map(),
  requests = [],
  errors = [],
  browserErrors = [];
let wishIds = [];
const flags = {
  lostClaim: false,
  denyFiles: false,
  denyLibrary: false,
  finishPayment: false,
  checkoutDrift: false,
  staleOffer: false,
};
const clone = (value) => structuredClone(value);
const ownedKey = (actor, datasetId) => actor + ":" + datasetId;
const add = (choice, modalities, paid) => {
  const value = dataset(choice, modalities, paid);
  models.set(value.item.id, value);
  return value;
};
const ok = (res, data) => {
  res.writeHead(200, {
    "content-type": "application/json",
    "cache-control": "private, no-store",
  });
  res.end(JSON.stringify({ success: true, data }));
};
const deny = (res, code, status = 409) => {
  res.writeHead(status, {
    "content-type": "application/json",
    "cache-control": "private, no-store",
  });
  res.end(
    JSON.stringify({
      success: false,
      error: { code, message: code + ": synthetic refusal" },
    })
  );
};
function inventory(context, count = 1) {
  const key = context.contentId + ":" + context.component;
  if (!members.has(key))
    members.set(
      key,
      Array.from({ length: count }, (_, index) =>
        fileMember(
          context,
          (context.component === "FULL" ? "full-" : "sample-") +
            (index + 1) +
            ".wav"
        )
      )
    );
  return members.get(key);
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://fixture.test");
    if (url.pathname === "/bundle.js") {
      res.writeHead(200, { "content-type": "text/javascript" });
      res.end(bundle.outputFiles[0].contents);
      return;
    }
    if (url.pathname === "/style.css") {
      res.writeHead(200, { "content-type": "text/css" });
      res.end(css);
      return;
    }
    if (!url.pathname.startsWith("/api/")) {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(
        '<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>'
      );
      return;
    }
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      assert(Buffer.byteLength(raw) <= 32768);
    }
    const body = raw ? JSON.parse(raw) : null,
      cookie = req.headers.cookie ?? "",
      actor = /fixtureActor=([^;]+)/.exec(cookie)?.[1];
    requests.push({
      path: url.pathname,
      method: req.method,
      body,
      query: Object.fromEntries(url.searchParams),
      actor: actor ?? null,
    });
    if (url.pathname.startsWith("/api/v2/marketplace/datasets/")) {
      assert.equal(actor, undefined, "Public metadata omits session cookies");
      if (url.pathname.endsWith("/tables")) {
        const data = models.get(url.pathname.split("/").at(-2));
        if (!data || withdrawn.has(data.item.id))
          return deny(res, "NOT_FOUND", 404);
        const query = DatasetPublicTableMetadataQuerySchema.parse(
          Object.fromEntries(url.searchParams)
        );
        if (
          query.publicationId !== data.item.publication.id ||
          query.contentId !== data.item.publication.contentId
        )
          return deny(res, "PUBLICATION_CHANGED");
        const context = {
          ...fileContext(data, "SAMPLE"),
          component: query.component ?? "FULL",
        };
        const metadata = tableMetadataFixture(
          context,
          undefined,
          Boolean(query.tableId)
        );
        metadata.page.component = query.component ?? null;
        return ok(
          res,
          DatasetPublicTableMetadataResponseSchema.parse({
            datasetId: data.item.id,
            publicationId: data.item.publication.id,
            page: metadata.page,
          })
        );
      }
      const metadata = url.pathname.match(
        /^\/api\/v2\/marketplace\/datasets\/([^/]+)\/metadata$/
      );
      const data = metadata ? models.get(metadata[1]) : undefined;
      return data && !withdrawn.has(data.item.id)
        ? ok(res, data)
        : deny(res, "NOT_FOUND", 404);
    }
    if (url.pathname === "/api/v2/marketplace/datasets") {
      assert.equal(actor, undefined);
      const page = Number(url.searchParams.get("page") ?? 1),
        pageSize = Number(url.searchParams.get("pageSize") ?? 20);
      const items = [...models.values()].map((value) => ({
        representation: "CONTENT",
        item: value.item,
      }));
      return ok(res, {
        items: items.slice((page - 1) * pageSize, page * pageSize),
        page,
        pageSize,
        total: items.length,
      });
    }
    if (!actor) return deny(res, "UNAUTHORIZED", 401);
    if (url.pathname === "/api/v2/user/library") {
      const page = Number(url.searchParams.get("page") ?? 1),
        pageSize = Number(url.searchParams.get("pageSize") ?? 20),
        items = [...grants.entries()]
          .filter(([key]) => key.startsWith(actor + ":"))
          .map(([, value]) => value);
      return ok(res, {
        items: items.slice((page - 1) * pageSize, page * pageSize),
        page,
        pageSize,
        total: items.length,
      });
    }
    if (url.pathname.startsWith("/api/v2/user/library/")) {
      if (flags.denyLibrary) return deny(res, "FORBIDDEN", 403);
      const item = grants.get(ownedKey(actor, url.pathname.split("/").at(-1)));
      return item ? ok(res, { item }) : deny(res, "NOT_FOUND", 404);
    }
    const acquisition = url.pathname.match(
      /^\/api\/v2\/user\/dataset-access\/([^/]+)\/(offer|claim)$/
    );
    if (acquisition) {
      const [, datasetId, action] = acquisition,
        data = models.get(datasetId);
      assert(data);
      assert.notEqual(
        data.item.uploadChoice,
        "SAMPLE_ONLY",
        "Display-only samples never reach acquisition"
      );
      const quote = offer(data);
      if (action === "offer") return ok(res, quote);
      DatasetContentFreeClaimBodySchema.parse(body);
      if (
        flags.staleOffer ||
        JSON.stringify(body.expectedTarget) !== JSON.stringify(quote.target)
      )
        return deny(res, "ACQUISITION_CHANGED");
      const key = ownedKey(actor, datasetId);
      if (grants.has(key)) return deny(res, "ALREADY_OWNED");
      const item = grant(data);
      grants.set(key, item);
      if (flags.lostClaim) return deny(res, "ACK_UNAVAILABLE", 503);
      return ok(res, {
        success: true,
        grantId: item.grantId,
        material: item.material,
      });
    }
    const files = url.pathname.match(
      /^\/api\/v2\/(marketplace\/dataset-samples|user\/library-files)\/([^/]+)\/(context|inventory|observations|tables|download-url)$/
    );
    if (files) {
      const [, kind, datasetId, action] = files,
        audience = kind.startsWith("marketplace") ? "SAMPLE" : "LIBRARY";
      const data = models.get(datasetId),
        item = grants.get(ownedKey(actor, datasetId));
      assert(data);
      let context;
      if (audience === "SAMPLE") {
        assert.notEqual(data.item.uploadChoice, "FULL_ONLY");
        context = fileContext(data, audience);
      } else {
        if (!item?.material || item.recordedAccess !== "RECORDED")
          return deny(res, "FORBIDDEN", 403);
        context = {
          ...fileContext(data, audience),
          contentId: item.material.contentId,
        };
      }
      if (action === "context") return ok(res, context);
      const parsed =
        action === "inventory"
          ? DatasetFileAccessPageQuerySchema.parse(
              Object.fromEntries(url.searchParams)
            )
          : action === "observations"
            ? DatasetFileObservationQuerySchema.parse(
                Object.fromEntries(url.searchParams)
              )
            : action === "tables"
              ? DatasetPrivateTableMetadataQuerySchema.parse(
                  Object.fromEntries(url.searchParams)
                )
              : DatasetFileDownloadBodySchema.parse(body);
      if (
        parsed.contentId !== context.contentId ||
        (parsed.expectedWorkflowRevision ?? null) !== context.workflowRevision
      )
        return deny(res, "DRAFT_CHANGED");
      assert.equal(parsed.component, context.component);
      assert.equal(parsed.scope, context.scope);
      const items = inventory(context, fileCounts.get(datasetId) ?? 1);
      if (action === "tables") {
        assert(items.some((member) => member.id === parsed.memberId));
        return ok(
          res,
          DatasetPrivateTableMetadataResponseSchema.parse(
            tableMetadataFixture(
              context,
              parsed.memberId,
              Boolean(parsed.tableId)
            )
          )
        );
      }
      if (action === "inventory") {
        const remaining = items.filter(
            (member) => !parsed.afterId || member.id > parsed.afterId
          ),
          shown = remaining.slice(0, parsed.limit);
        return ok(res, {
          context,
          total: items.length,
          items: shown,
          nextCursor:
            remaining.length > shown.length
              ? { ...parsed, afterId: shown.at(-1).id }
              : null,
        });
      }
      const member = items.find((value) => value.id === parsed.memberId);
      assert(member);
      if (flags.denyFiles) return deny(res, "OBJECT_NOT_ACCEPTED");
      if (action === "observations")
        return ok(
          res,
          DatasetFileObservationResponseSchema.parse({
            context,
            memberId: member.id,
            evidenceId: parsed.evidenceId,
            evidenceRelationship: "CURRENT_AND_CAPTURED",
            total: 1,
            items: [
              {
                id: id(99999),
                evidenceId: parsed.evidenceId,
                profileId: "WAV_PCM",
                result: "COMPLETE",
                source: {
                  kind: "PHYSICAL_OBJECT",
                  uploadObjectId: member.uploadObjectId,
                },
                measuredSizeBytes: member.measuredSizeBytes,
                checksumSha256: "a".repeat(64),
                origin: "BACKEND_OBSERVED",
                scope: "EXACT_UPLOADED_OBJECT",
                facts: { codec: "PCM", sampleRateHz: 48000 },
              },
            ],
            nextCursor: null,
          })
        );
      return ok(
        res,
        DatasetFileDownloadResponseSchema.parse({
          context,
          memberId: member.id,
          downloadIntentId: parsed.downloadIntentId,
          fileName: member.originalFileName,
          measuredSizeBytes: member.measuredSizeBytes,
          url:
            "https://private-storage.example.test/attachment?intent=" +
            parsed.downloadIntentId,
          expiresAt: new Date(Date.now() + 60000).toISOString(),
          expiresInSeconds: 60,
          disposition: "ATTACHMENT",
        })
      );
    }
    if (url.pathname.endsWith("/payments/razorpay/checkout")) {
      const input = body.items[0],
        data = models.get(input.datasetId);
      assert(data);
      assert.deepEqual(input.expectedTarget, offer(data).target);
      const orderId = id(99001),
        snapshot = clone(data);
      orders.set(orderId, { actor, snapshot, confirmed: false });
      return ok(res, {
        checkout: {
          orderId,
          orderNumber: "TEST-001",
          currency: flags.checkoutDrift ? "USD" : "INR",
          amount: "12.5",
          amountPaise: 1250,
          paymentAttemptId: id(99002),
          razorpay: { keyId: "fixture-key", orderId: "fixture-order" },
        },
      });
    }
    if (url.pathname.endsWith("/payments/razorpay/confirm")) {
      const order = orders.get(id(99001));
      assert.equal(order.actor, actor);
      order.confirmed = true;
      return ok(res, { ok: true, order: { id: id(99001), status: "PENDING" } });
    }
    if (url.pathname.includes("/payments/orders/")) {
      const orderId = url.pathname.split("/").at(-1),
        order = orders.get(orderId);
      assert(order);
      assert.equal(order.actor, actor);
      if (
        flags.finishPayment &&
        !grants.has(ownedKey(actor, order.snapshot.item.id))
      )
        grants.set(
          ownedKey(actor, order.snapshot.item.id),
          grant(order.snapshot, { accessType: "PURCHASE" })
        );
      return ok(res, {
        order: {
          id: orderId,
          orderNumber: "TEST-001",
          status: flags.finishPayment ? "COMPLETED" : "PENDING",
          paymentMethod: "RAZORPAY",
          totalAmount: "12.5",
          currency: "INR",
          createdAt: now,
          completedAt: flags.finishPayment ? now : null,
        },
        items: [],
        paymentAttempts: [
          {
            id: id(99002),
            provider: "RAZORPAY",
            status: flags.finishPayment ? "CAPTURED" : "CLIENT_CONFIRMED",
            providerOrderId: "fixture-order",
            providerPaymentId: "fixture-payment",
            createdAt: now,
            capturedAt: flags.finishPayment ? now : null,
            failedAt: null,
            refundedAt: null,
          },
        ],
      });
    }
    if (
      url.pathname.includes("/library/") &&
      url.pathname.endsWith("/download-url")
    )
      return deny(res, "MATERIAL_TARGET_UNRESOLVED");
    if (url.pathname.includes("/wishlist")) {
      if (req.method === "DELETE")
        wishIds = wishIds.filter(
          (selected) => selected !== url.pathname.split("/").at(-1)
        );
      return ok(res, {
        items: wishIds.map((datasetId) => ({ datasetId, createdAt: now })),
      });
    }
    throw new Error(
      "Unexpected fixture API " + req.method + " " + url.pathname
    );
  } catch (error) {
    errors.push(error.stack);
    deny(res, "FIXTURE_ERROR", 500);
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
bundle = await build({
  stdin: {
    contents: `import React from 'react';import{createRoot}from'react-dom/client';import{QueryClient,QueryClientProvider}from'@tanstack/react-query';import{DatasetDetailPageContent}from'./src/app/datasets/[id]/_components/DatasetDetailPageContent';import{ContentLibraryAccess,ContentMyDatasets}from'./src/features/library/components/ContentLibrary';import{WishlistPage}from'./src/features/account/wishlist-page';import{WishlistTab}from'./src/features/library/tabs/wishlist-tab';const root=createRoot(document.getElementById('root'));let generation=0;window.navigations=[];window.rzpOpened=0;window.setActor=actor=>{window.fixtureActor=actor?{id:actor,email:'fixture@example.test',emailVerified:true}:null;document.cookie='fixtureActor='+(actor??'')+';path=/';window.dispatchEvent(new Event('fixture-auth'))};window.setActor(new URLSearchParams(location.search).has('anonymous')?null:${JSON.stringify(actorId)});window.Razorpay=class{constructor(options){window.rzpOptions=options}open(){window.rzpOpened++}close(){window.rzpClosed=(window.rzpClosed??0)+1}on(){}};window.mount=(id,mode='detail')=>{history.replaceState({},'',(mode==='library'?'/library/access/':'/datasets/')+id);const client=new QueryClient({defaultOptions:{queries:{retry:false,refetchOnWindowFocus:false},mutations:{retry:false}}});window.fixtureClient=client;root.render(<React.StrictMode><QueryClientProvider key={++generation} client={client}>{mode==='library'?<ContentLibraryAccess datasetId={id}/>:mode==='list'?<ContentMyDatasets/>:mode==='wishlist'?<WishlistPage/>:mode==='wishlist-tab'?<WishlistTab/>:<DatasetDetailPageContent/>}</QueryClientProvider></React.StrictMode>)};window.navigate=path=>{window.navigations.push(path);if(path.startsWith('/library/access/'))window.mount(path.split('/').at(-1),'library')};window.mount(location.pathname.split('/').at(-1));`,
    loader: "jsx",
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  define: {
    "process.env": JSON.stringify({
      NODE_ENV: "development",
      NEXT_PUBLIC_APP_ENV: "local",
      NEXT_PUBLIC_API_BASE_URL: origin,
      NEXT_PUBLIC_SITE_URL: origin,
    }),
  },
  plugins: [
    {
      name: "explicit-fixture-shell-auth-navigation",
      setup(builder) {
        builder.onResolve({ filter: /^next\/navigation$/ }, (args) => ({
          path: args.path,
          namespace: "fixture",
        }));
        builder.onResolve(
          { filter: /^@\/core\/providers(\/AuthProvider)?$/ },
          () => ({ path: "auth", namespace: "fixture" })
        );
        builder.onResolve(
          {
            filter:
              /^@\/shared\/components\/ui\/(notch-navigation|institutional-background)$/,
          },
          (args) => ({
            path: args.path.endsWith("notch-navigation")
              ? "navigation-shell"
              : "background-shell",
            namespace: "fixture",
          })
        );
        builder.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({
          resolveDir: process.cwd(),
          loader: "jsx",
          contents:
            args.path === "next/navigation"
              ? "export function useParams(){return{id:location.pathname.split('/').at(-1)}}export function useRouter(){return{push:window.navigate,replace:window.navigate,refresh(){}}}export function usePathname(){return location.pathname}export function useSearchParams(){return new URLSearchParams(location.search)}"
              : args.path === "auth"
                ? "import{useSyncExternalStore}from'react';const subscribe=fn=>{window.addEventListener('fixture-auth',fn);return()=>window.removeEventListener('fixture-auth',fn)};export function useAuth(){const value=useSyncExternalStore(subscribe,()=>JSON.stringify(window.fixtureActor));const user=JSON.parse(value);return{user,isAuthenticated:!!user,isLoading:false}}export function useModal(){return{openModal:name=>{window.openedModal=name}}}"
                : args.path === "navigation-shell"
                  ? "export function NotchNavigation(){return null}"
                  : "export function InstitutionalBackground(){return null}",
        }));
      },
    },
  ],
});
const artifacts =
  process.env.DATASET_BUYER_ARTIFACTS ??
  "/tmp/kuinbee-buyer-content-browser-20261016";
await mkdir(artifacts, { recursive: true });
const button = (page, name) => page.getByRole("button", { name, exact: true });
async function wait(check) {
  const until = Date.now() + 15000;
  while (Date.now() < until) {
    if (await check()) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.fail("Condition did not become true");
}
async function ready(locator) {
  await locator.waitFor();
  await wait(() => locator.isEnabled());
}
async function open(page, data, anonymous = false) {
  await page.goto(
    origin + "/datasets/" + data.item.id + (anonymous ? "?anonymous=1" : ""),
    { waitUntil: "domcontentloaded" }
  );
  await page
    .getByRole("heading", { name: data.item.title, exact: true })
    .waitFor();
}
let browser, page;
try {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 1366, height: 1000 } });
  page.setDefaultTimeout(15000);
  page.on("pageerror", (error) => browserErrors.push(error.message));
  const downloads = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    if (url.hostname === "private-storage.example.test") {
      downloads.push(url.toString());
      return route.fulfill({
        status: 200,
        headers: {
          "content-type": "audio/wav",
          "content-disposition": "attachment; filename=selected.wav",
        },
        body: Buffer.alloc(48),
      });
    }
    errors.push("Unexpected external request " + url.origin + url.pathname);
    return route.abort();
  });
  for (const modalities of modalitySets)
    for (const choice of ["SAMPLE_ONLY", "FULL_ONLY", "FULL_AND_SAMPLE"]) {
      const data = add(choice, modalities);
      await open(page, data);
      await page
        .getByText("Unknown rows", { exact: true })
        .count()
        .then((count) => assert.equal(count, 0));
      if (choice === "SAMPLE_ONLY") {
        assert.equal(
          await button(page, "Review full dataset access").count(),
          0
        );
        assert.equal(
          requests.filter(
            (request) =>
              request.path.includes(data.item.id + "/offer") ||
              request.path.includes(data.item.id + "/claim")
          ).length,
          0
        );
      } else await ready(button(page, "Review full dataset access"));
    }
  console.log(
    "PASS all 21 modality/composition-by-choice details render scoped descriptions and unknown values; sample-only has no claim, checkout or inquiry"
  );
  for (const choice of ["SAMPLE_ONLY", "FULL_ONLY", "FULL_AND_SAMPLE"]) {
    const tableCollection = add(choice, ["TABULAR"]);
    await open(page, tableCollection, true);
    await button(page, "View table definitions").click();
    await button(page, "View columns").click();
    await page.getByText("Column 1: No header", { exact: true }).waitFor();
    await page.getByText("Column 2: Blank header", { exact: true }).waitFor();
    if (choice === "FULL_AND_SAMPLE")
      await captureTableMetadataViews(
        page,
        artifacts,
        "public-table",
        page.getByText("Column 1: No header", { exact: true })
      );
    assert.equal(
      await page
        .getByText("In this file: private-session/events.csv", { exact: true })
        .count(),
      0
    );
    assert(
      requests.some(
        (request) =>
          request.path.endsWith(tableCollection.item.id + "/tables") &&
          request.actor === null
      )
    );
  }
  console.log(
    "PASS anonymous approved table schema for all choices displays literal headers without raw cells, private paths or file authorization"
  );
  const scopedProfiles = add("FULL_AND_SAMPLE", [
    "AUDIO",
    "VIDEO",
    "TEXT",
    "SENSOR",
  ]);
  scopedProfiles.description.profiles = {
    audio: {
      content: "NON_SPEECH",
      languages: ["Retained speech language"],
      transcriptAvailability: "ABSENT",
      transcriptMeaning: "Retained transcript meaning",
      transcriptTiming: "TIMED",
      alignmentNotes: "Retained transcript alignment",
    },
    video: {
      content: "Silent activity clips",
      annotationAvailability: "PRESENT",
      annotationMeaning: "Whole-clip labels",
      annotationReferences: "WHOLE_ITEM",
      timingConvention: "Retained frame claim",
    },
    text: {
      recordUnit: "One code record",
      languageContent: "NON_LANGUAGE",
      languages: ["Retained text language"],
      annotationAvailability: "ABSENT",
      recordConvention: "Retained offset claim",
    },
    sensors: {
      channelNotes: "Untimed readings",
      synchronization: "NO_CLAIM",
      synchronizationNotes: "Retained synchronized claim",
      calibrationAvailability: "ABSENT",
      calibrationMeaning: "Retained calibration claim",
    },
  };
  await open(page, scopedProfiles);
  for (const name of [
    "Audio details · supplier declared",
    "Video details · supplier declared",
    "Text details · supplier declared",
    "Sensors details · supplier declared",
  ])
    await page.getByText(name, { exact: true }).click();
  await page.getByText("Whole clips or items", { exact: true }).waitFor();
  await page
    .getByText("Other content, such as codes or numbers", { exact: true })
    .waitFor();
  for (const value of [
    "Retained speech language",
    "Retained transcript meaning",
    "Retained transcript alignment",
    "Retained frame claim",
    "Retained text language",
    "Retained offset claim",
    "Retained synchronized claim",
    "Retained calibration claim",
  ])
    assert.equal(await page.getByText(value, { exact: true }).count(), 0);
  scopedProfiles.description.profiles.audio = {
    content: "SPEECH",
    languages: ["Marathi"],
    transcriptAvailability: "PRESENT",
    transcriptTiming: "UNKNOWN",
    alignmentNotes: "Retained unassessed audio time claim",
  };
  scopedProfiles.description.profiles.video.annotationReferences = "UNKNOWN";
  await open(page, scopedProfiles);
  for (const name of [
    "Audio details · supplier declared",
    "Video details · supplier declared",
  ])
    await page.getByText(name, { exact: true }).click();
  await page.getByText("Timing not assessed", { exact: true }).waitFor();
  await page.getByText("References not assessed", { exact: true }).waitFor();
  assert.equal(
    await page
      .getByText("Retained unassessed audio time claim", { exact: true })
      .count(),
    0
  );
  assert.equal(
    await page.getByText("Retained frame claim", { exact: true }).count(),
    0
  );
  console.log(
    "PASS applicable frozen profile display hides retained speech, annotation, timing and calibration claims without inventing languages or timing for non-language, whole-clip or unassessed material"
  );
  const sample = add("SAMPLE_ONLY", ["AUDIO"]);
  await open(page, sample, true);
  await button(page, "Sign in to view sample files").click();
  assert.equal(await page.evaluate(() => window.openedModal), "login");
  assert.equal(
    requests.filter((request) =>
      request.path.includes("dataset-samples/" + sample.item.id)
    ).length,
    0
  );
  await page.evaluate((actor) => window.setActor(actor), actorId);
  await page
    .getByRole("heading", { name: "sample-1.wav", exact: true })
    .waitFor();
  assert.equal(
    await page
      .getByText("Format observations and file checks", { exact: true })
      .count(),
    0
  );
  assert.equal(await button(page, "Recorded format observations").count(), 0);
  assert.equal(
    requests.filter((request) => request.path.endsWith("/observations")).length,
    0
  );
  flags.denyFiles = true;
  await button(page, "Download sample").click();
  await page
    .getByRole("alert")
    .filter({ hasText: "OBJECT_NOT_ACCEPTED" })
    .waitFor();
  assert.equal(downloads.length, 0);
  flags.denyFiles = false;
  await button(page, "Download sample").click();
  await wait(() => downloads.length === 1);
  await button(page, "Download sample").click();
  await wait(() => downloads.length === 2);
  assert.notEqual(downloads[0], downloads[1]);
  console.log(
    "PASS anonymous samples require sign-in; admin-only inspection details, access refusal and fresh 60-second download intents stay separate"
  );
  const free = add("FULL_ONLY", ["AUDIO"]);
  free.description.geographicCoverage = {
    state: "KNOWN",
    description: "Grant A declared region",
  };
  free.description.collectionPeriod = {
    state: "KNOWN",
    start: { precision: "YEAR", value: "2019" },
    end: { precision: "MONTH", value: "2020-04" },
  };
  free.description.profiles.audio = {
    content: "SPEECH",
    languages: ["Marathi"],
    transcriptAvailability: "PRESENT",
    transcriptTiming: "UNTIMED",
    transcriptMeaning: "Grant A punctuation conventions",
  };
  await open(page, free);
  await ready(button(page, "Review full dataset access"));
  await button(page, "Review full dataset access").click();
  await ready(button(page, "Confirm free full dataset claim"));
  flags.lostClaim = true;
  await button(page, "Confirm free full dataset claim").click();
  await ready(button(page, "Check previous claim"));
  const grantedA = clone(grants.get(ownedKey(actorId, free.item.id)));
  assert(grantedA);
  const oldContent = free.item.publication.contentId;
  const newer = dataset("FULL_ONLY", ["AUDIO"]);
  newer.item.id = free.item.id;
  newer.item.datasetUniqueId = free.item.datasetUniqueId;
  newer.item.title = "Current publication B";
  newer.description.title = newer.item.title;
  newer.item.license = "CC0-1.0";
  newer.description.license = "CC0-1.0";
  newer.description.geographicCoverage = {
    state: "KNOWN",
    description: "Current B declared region",
  };
  newer.description.collectionPeriod = { state: "UNKNOWN" };
  newer.description.profiles.audio = {
    content: "NON_SPEECH",
    transcriptAvailability: "ABSENT",
  };
  models.set(free.item.id, newer);
  flags.lostClaim = false;
  await page.reload({ waitUntil: "domcontentloaded" });
  await ready(button(page, "Check previous claim"));
  const claimCount = requests.filter((request) =>
    request.path.endsWith(free.item.id + "/claim")
  ).length;
  await button(page, "Check previous claim").click();
  await page
    .getByRole("heading", {
      name: "Description captured for your access",
      exact: true,
    })
    .waitFor();
  const historicalDescription = page.locator("[data-content-description]");
  await historicalDescription
    .getByText("Grant A declared region", { exact: true })
    .waitFor();
  await historicalDescription
    .getByText("2019 (year) to 2020-04 (month)", { exact: true })
    .waitFor();
  assert.equal(
    await historicalDescription
      .getByText("Current B declared region", { exact: true })
      .count(),
    0
  );
  await historicalDescription
    .getByText("Audio details · supplier declared", { exact: true })
    .click();
  await historicalDescription.getByText("Marathi", { exact: true }).waitFor();
  await historicalDescription
    .getByText("Untimed transcripts", { exact: true })
    .waitFor();
  await historicalDescription
    .getByText("Grant A punctuation conventions", { exact: true })
    .waitFor();
  assert.equal(
    requests.filter((request) => request.path.endsWith(free.item.id + "/claim"))
      .length,
    claimCount
  );
  assert.equal(
    grants.get(ownedKey(actorId, free.item.id)).material.contentId,
    oldContent
  );
  const grantFileReads = requests.filter(
    (request) =>
      request.path.includes("library-files/" + free.item.id) &&
      request.path.endsWith("/inventory")
  );
  await wait(() =>
    requests.some(
      (request) =>
        request.path.includes("library-files/" + free.item.id) &&
        request.query.contentId === oldContent
    )
  );
  assert(
    grantFileReads.every((request) => request.query.contentId === oldContent)
  );
  console.log(
    "PASS lost free-claim ACK survives reload and publication B; explicit reconciliation opens frozen grant A without a second claim or current-public metadata"
  );
  await page.evaluate((actor) => window.setActor(actor), otherActorId);
  await page.getByRole("alert").waitFor();
  assert.equal(await button(page, "Download file").count(), 0);
  await page.evaluate((actor) => window.setActor(actor), actorId);
  await page
    .getByRole("heading", { name: "Granted full material", exact: true })
    .waitFor();
  await button(page, "View table definitions").click();
  await button(page, "View columns").click();
  await page.getByText("Column 1: No header", { exact: true }).waitFor();
  await page
    .getByText("In this file: private-session/events.csv", { exact: true })
    .waitFor();
  const historicalTables = requests.findLast(
    (request) =>
      request.path.includes("library-files/" + free.item.id) &&
      request.path.endsWith("/tables")
  );
  assert.equal(historicalTables.query.contentId, oldContent);
  assert.equal(historicalTables.query.scope, "GRANTED");
  assert.equal(historicalTables.query.expectedWorkflowRevision, undefined);
  console.log(
    "PASS changing the signed-in actor removes private grant files and cannot restore another actor's recorded access"
  );
  const stale = add("FULL_ONLY", ["VIDEO"]);
  await open(page, stale);
  await ready(button(page, "Review full dataset access"));
  await button(page, "Review full dataset access").click();
  await ready(button(page, "Confirm free full dataset claim"));
  flags.staleOffer = true;
  await button(page, "Confirm free full dataset claim").click();
  await ready(button(page, "Check previous claim"));
  assert.equal(grants.has(ownedKey(actorId, stale.item.id)), false);
  const refusedWrites = requests.filter((request) =>
    request.path.endsWith(stale.item.id + "/claim")
  ).length;
  flags.staleOffer = false;
  await button(page, "Check library and review current offer").click();
  await ready(button(page, "Confirm free full dataset claim"));
  assert.equal(
    requests.filter((request) =>
      request.path.endsWith(stale.item.id + "/claim")
    ).length,
    refusedWrites
  );
  await button(page, "Confirm free full dataset claim").click();
  await page
    .getByRole("heading", { name: "Granted full material", exact: true })
    .waitFor();
  console.log(
    "PASS a stale offer grants nothing; replacing an unconfirmed selection requires explicit library check, fresh review and separate confirmation"
  );

  const paged = add("SAMPLE_ONLY", ["AUDIO"]);
  fileCounts.set(paged.item.id, 21);
  paged.item.materials[0].fileCount = 21;
  paged.item.materials[0].sizeBytes = String(21 * 48044);
  await open(page, paged);
  await page
    .getByRole("heading", { name: "sample-1.wav", exact: true })
    .waitFor();
  await button(page, "Next file page").click();
  await page
    .getByRole("heading", { name: "sample-21.wav", exact: true })
    .waitFor();
  assert.equal(
    await page
      .getByRole("heading", { name: "sample-1.wav", exact: true })
      .count(),
    0
  );
  const oldSampleContent = paged.item.publication.contentId;
  const changedSample = dataset("SAMPLE_ONLY", ["AUDIO"]);
  changedSample.item.id = paged.item.id;
  changedSample.item.datasetUniqueId = paged.item.datasetUniqueId;
  fileCounts.set(paged.item.id, 1);
  models.set(paged.item.id, changedSample);
  const downloadsBeforeChange = downloads.length;
  await button(page, "Download sample").click();
  await page.getByRole("alert").filter({ hasText: "DRAFT_CHANGED" }).waitFor();
  assert.equal(downloads.length, downloadsBeforeChange);
  await button(page, "Refresh listing").click();
  await page
    .getByRole("heading", { name: "sample-1.wav", exact: true })
    .waitFor();
  assert.notEqual(changedSample.item.publication.contentId, oldSampleContent);
  console.log(
    "PASS exact sample pages replace their own display; a changed publication cannot sign an old page and explicit refresh starts its own inventory"
  );

  const readsBeforeWithdrawal = requests.filter((request) =>
    request.path.startsWith("/api/v2/marketplace/datasets/")
  ).length;
  withdrawn.add(free.item.id);
  await page.evaluate(
    (selected) => window.mount(selected, "library"),
    free.item.id
  );
  await page
    .getByRole("heading", { name: "Granted full material", exact: true })
    .waitFor();
  assert.equal(await page.getByText("CC0-1.0", { exact: true }).count(), 0);
  await ready(button(page, "Download file"));
  const beforeHistoricalDownload = downloads.length;
  await button(page, "Download file").click();
  await wait(() => downloads.length === beforeHistoricalDownload + 1);
  const historicalRequest = requests.findLast(
    (request) =>
      request.path.includes("library-files/" + free.item.id) &&
      request.path.endsWith("/download-url")
  );
  assert.equal(historicalRequest.body.contentId, oldContent);
  assert.equal(historicalRequest.body.scope, "GRANTED");
  assert.equal(historicalRequest.body.expectedWorkflowRevision, undefined);
  assert.equal(
    requests.filter((request) =>
      request.path.startsWith("/api/v2/marketplace/datasets/")
    ).length,
    readsBeforeWithdrawal
  );
  console.log(
    "PASS withdrawal and newer license metadata do not replace frozen grant A or its exact fresh full-file signing context"
  );

  const paid = add("FULL_ONLY", ["AUDIO"], true);
  await open(page, paid);
  await ready(button(page, "Review full dataset access"));
  await button(page, "Review full dataset access").click();
  await ready(button(page, "Purchase selected full dataset"));
  await button(page, "Purchase selected full dataset").click();
  await page.getByRole("button", { name: /^Pay / }).click();
  await wait(() => page.evaluate(() => window.rzpOpened > 0));
  const checkout = requests.findLast((request) =>
    request.path.endsWith("/payments/razorpay/checkout")
  );
  assert.deepEqual(checkout.body.items[0].expectedTarget, offer(paid).target);
  await page.evaluate(() =>
    window.rzpOptions.handler({
      razorpay_order_id: "fixture-order",
      razorpay_payment_id: "fixture-payment",
      razorpay_signature: "fixture-signature",
    })
  );
  await wait(() =>
    requests.some((request) =>
      request.path.endsWith("/payments/orders/" + id(99001))
    )
  );
  assert.equal(
    await page.getByText("Payment Complete", { exact: true }).count(),
    0
  );
  assert.equal(grants.has(ownedKey(actorId, paid.item.id)), false);
  const premature = await page.evaluate(() =>
    window.fixtureClient.getQueryData([
      "entitlements",
      location.pathname.split("/").at(-1),
      "check",
    ])
  );
  assert.notEqual(premature?.entitled, true);
  const paidPublicationB = dataset("FULL_ONLY", ["AUDIO"], true);
  paidPublicationB.item.id = paid.item.id;
  paidPublicationB.item.datasetUniqueId = paid.item.datasetUniqueId;
  models.set(paid.item.id, paidPublicationB);
  flags.finishPayment = true;
  await page
    .getByRole("heading", {
      name: "Description captured for your access",
      exact: true,
    })
    .waitFor();
  assert.equal(
    grants.get(ownedKey(actorId, paid.item.id)).material.contentId,
    paid.item.publication.contentId
  );
  console.log(
    "PASS existing Razorpay flow carries the exact reviewed target, accepts equivalent decimal formatting and waits for completed server order before reporting access"
  );
  const switchedPayment = add("FULL_ONLY", ["AUDIO"], true);
  flags.finishPayment = false;
  await open(page, switchedPayment);
  await ready(button(page, "Review full dataset access"));
  await button(page, "Review full dataset access").click();
  await ready(button(page, "Purchase selected full dataset"));
  await button(page, "Purchase selected full dataset").click();
  const beforeSdk = await page.evaluate(() => window.rzpOpened);
  await page.getByRole("button", { name: /^Pay / }).click();
  await wait(() =>
    page.evaluate((before) => window.rzpOpened > before, beforeSdk)
  );
  const beforeConfirm = requests.filter((request) =>
    request.path.endsWith("/payments/razorpay/confirm")
  ).length;
  await page.evaluate((actor) => window.setActor(actor), otherActorId);
  await page.evaluate(() =>
    window.rzpOptions.handler({
      razorpay_order_id: "fixture-order",
      razorpay_payment_id: "fixture-payment",
      razorpay_signature: "fixture-signature",
    })
  );
  assert.equal(
    requests.filter((request) =>
      request.path.endsWith("/payments/razorpay/confirm")
    ).length,
    beforeConfirm
  );
  assert(await page.evaluate(() => window.rzpClosed > 0));
  await page.evaluate((actor) => window.setActor(actor), actorId);
  console.log(
    "PASS switching accounts closes the content checkout UI and prevents a former SDK callback from confirming with another actor's session"
  );

  for (const recordedAccess of ["EXPIRED", "REVOKED"]) {
    const unavailable = add("FULL_ONLY", ["AUDIO"]);
    grants.set(
      ownedKey(actorId, unavailable.item.id),
      grant(unavailable, {
        recordedAccess,
        expiresAt:
          recordedAccess === "EXPIRED" ? "2026-01-01T00:00:00.000Z" : null,
      })
    );
    await page.evaluate(
      (selected) => window.mount(selected, "library"),
      unavailable.item.id
    );
    await page
      .getByRole("heading", {
        name: "Description captured for your access",
        exact: true,
      })
      .waitFor();
    assert.equal(await button(page, "Download file").count(), 0);
    assert.equal(
      requests.filter((request) =>
        request.path.includes("library-files/" + unavailable.item.id)
      ).length,
      0
    );
  }
  console.log(
    "PASS expired and revoked records retain historical metadata while exposing no active grant files or fabricated active/verified status"
  );

  const unresolved = add("FULL_ONLY", ["IMAGE"]);
  grants.set(
    ownedKey(actorId, unresolved.item.id),
    grant(unresolved, {
      title: null,
      description: null,
      metadataProvenance: "UNRESOLVED",
      recordedAccess: "UNRESOLVED",
      material: null,
      grantId: null,
    })
  );
  const publicReadsBefore = requests.filter((request) =>
    request.path.startsWith("/api/v2/marketplace/datasets/")
  ).length;
  await page.evaluate(
    (selected) => window.mount(selected, "library"),
    unresolved.item.id
  );
  await page
    .getByRole("heading", { name: "Historical title unavailable", exact: true })
    .waitFor();
  assert.equal(await button(page, "Download file").count(), 0);
  assert.equal(
    requests.filter((request) =>
      request.path.startsWith("/api/v2/marketplace/datasets/")
    ).length,
    publicReadsBefore
  );
  console.log(
    "PASS unresolved historical records show unknown metadata and unavailable delivery without enriching from today's public listing"
  );
  const legacy = add("FULL_ONLY", ["TABULAR"]);
  grants.set(ownedKey(actorId, legacy.item.id), {
    datasetId: legacy.item.id,
    datasetUniqueId: legacy.item.datasetUniqueId,
    title: "Retained legacy upload on converted Dataset",
    accessType: "PURCHASE",
    grantedAt: now,
    expiresAt: null,
    representation: "LEGACY",
    recordedAccess: "RECORDED",
    metadataProvenance: "CURRENT_LEGACY_RECORD",
    historicalMetadata: null,
    recordedUploadId: id(88000),
  });
  await page.evaluate(
    (selected) => window.mount(selected, "library"),
    legacy.item.id
  );
  await button(page, "Download original file").click();
  await page
    .getByRole("alert")
    .filter({ hasText: "MATERIAL_TARGET_UNRESOLVED" })
    .waitFor();
  assert.equal(
    requests.filter((request) =>
      request.path.includes("library-files/" + legacy.item.id)
    ).length,
    0
  );
  console.log(
    "PASS retained legacy records use only their existing legacy delivery route; conversion cannot invent a canonical/current content grant"
  );
  for (let index = 0; index < 20; index++) {
    const value = add("FULL_ONLY", ["TEXT"]);
    grants.set(ownedKey(actorId, value.item.id), grant(value));
  }
  await page.evaluate(() => window.mount("list", "list"));
  await page
    .getByRole("heading", { name: "My datasets", exact: true })
    .waitFor();
  await ready(button(page, "Next library page"));
  await button(page, "Next library page").click();
  await page.getByText(/Page 2 of/).waitFor();
  assert(
    requests.some(
      (request) =>
        request.path === "/api/v2/user/library" && request.query.page === "2"
    )
  );
  console.log(
    "PASS mixed historical library records use exact actor-scoped global counts and next-page requests without public enrichment"
  );

  for (const mode of ["wishlist", "wishlist-tab"]) {
    wishIds = [sample.item.id];
    await page.evaluate((mode) => window.mount("wishlist", mode), mode);
    await page.locator(`[data-content-card="${sample.item.id}"]`).waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Claim Free", exact: true })
        .count(),
      0
    );
    await page
      .locator(`[data-content-card="${sample.item.id}"]`)
      .getByRole("button", { name: "Remove from wishlist", exact: true })
      .click();
    await wait(() => wishIds.length === 0);
  }
  console.log(
    "PASS both existing wishlist consumers render sample-only cards as display-only and retain exact Dataset identity for removal"
  );

  await open(page, sample);
  await page
    .getByRole("heading", { name: "sample-1.wav", exact: true })
    .waitFor();
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (value) =>
        document.documentElement.classList.toggle("dark", value === "dark"),
      theme
    );
    await page.screenshot({
      path: resolve(artifacts, `buyer-content-${theme}.png`),
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth
    ),
    false
  );
  await page.screenshot({
    path: resolve(artifacts, "buyer-content-mobile.png"),
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(browserErrors, []);
  console.log(
    "PASS light/dark/narrow component layouts preserve existing colors and tokens; no external or hosted services contacted"
  );
} catch (error) {
  console.error(
    "Fixture errors:",
    errors,
    "Browser errors:",
    browserErrors,
    "Recent requests:",
    requests.slice(-8)
  );
  if (page) {
    await writeFile(resolve(artifacts, "failure.html"), await page.content());
    await page.screenshot({ path: resolve(artifacts, "failure.png") });
  }
  throw error;
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

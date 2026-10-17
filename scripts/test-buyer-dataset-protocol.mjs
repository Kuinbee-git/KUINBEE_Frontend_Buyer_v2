import assert from "node:assert/strict";
import { tableMetadataFixture } from "./table-metadata-fixtures.mjs";
import { after, test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import {
  dataset,
  offer,
  grant,
  fileContext,
  fileMember,
  id,
  actorId,
  otherActorId,
  now,
  modalitySets,
} from "./buyer-dataset-fixtures.mjs";
const directory = await mkdtemp(join(tmpdir(), "kuinbee-buyer-contracts-"));
const originalFetch = globalThis.fetch,
  originalStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    "sessionStorage"
  );
after(async () => {
  globalThis.fetch = originalFetch;
  if (originalStorage)
    Object.defineProperty(globalThis, "sessionStorage", originalStorage);
  else delete globalThis.sessionStorage;
  await rm(directory, { recursive: true, force: true });
});
async function load(environment) {
  const output = join(directory, environment + ".mjs");
  await build({
    stdin: {
      contents:
        "export * from './src/services/dataset-content.service';export * from './src/lib/content-claim-intent';export * from './src/features/datasets/content/content-description';",
      resolveDir: process.cwd(),
    },
    bundle: true,
    outfile: output,
    platform: "node",
    format: "esm",
    define: {
      "process.env.NEXT_PUBLIC_APP_ENV": JSON.stringify(environment),
      "process.env.NODE_ENV": '"test"',
      "process.env.NEXT_PUBLIC_API_BASE_URL": '"https://api.example.test"',
    },
  });
  return import(pathToFileURL(output).href);
}
const mod = await load("local"),
  production = await load("production"),
  api = mod.buyerDatasetApi;
const requests = [];
let answer,
  status = 200;
globalThis.fetch = async (url, options) => {
  requests.push({
    url: new URL(url),
    ...options,
    body: options.body ? JSON.parse(options.body) : null,
  });
  return new Response(
    JSON.stringify(
      status === 200
        ? { success: true, data: answer }
        : {
            success: false,
            error: { code: "FORBIDDEN", message: "Fixture access refused" },
          }
    ),
    { status, headers: { "content-type": "application/json" } }
  );
};
const matches = (code) => (error) => error.code === code;
const bad = matches("INCOMPATIBLE_DATASET_RESPONSE");
test("production does not dispatch canonical catalogue, claim, library or files", async () => {
  const before = requests.length;
  for (const action of [
    () => production.buyerDatasetApi.catalogue(),
    () => production.buyerDatasetApi.detail(id(20)),
    () => production.buyerDatasetApi.library(),
  ])
    await assert.rejects(action, matches("NOT_ENABLED"));
  assert.equal(requests.length, before);
});
test("all 21 modality/composition-by-choice descriptions remain scoped without invented tabular or study fields", async () => {
  for (const modalities of modalitySets)
    for (const choice of ["SAMPLE_ONLY", "FULL_ONLY", "FULL_AND_SAMPLE"]) {
      answer = dataset(choice, modalities);
      const result = await api.detail(answer.item.id);
      assert.equal(result.description.studyStructure, null);
      assert.equal(result.description.rows, undefined);
      assert.equal(result.item.uploadChoice, choice);
      assert.equal(
        mod.contentModalityLabels(result.item.modalities).length,
        modalities.length
      );
      if (choice === "SAMPLE_ONLY")
        assert.equal(mod.contentPriceLabel(result.item), "Sample on display");
      assert.equal(requests.at(-1).credentials, "omit");
      assert.equal(requests.at(-1).cache, "no-store");
    }
});
test("declared quantities preserve unknown, estimated, unit and collection/sample scope", () => {
  assert.equal(
    mod.declaredMeasurement({
      metric: "AUDIO_DURATION",
      state: "UNKNOWN",
      unit: "HOUR",
    }),
    "audio duration unknown"
  );
  assert.equal(
    mod.declaredMeasurement({
      metric: "AUDIO_DURATION",
      state: "ESTIMATED",
      unit: "HOUR",
      value: "200",
    }),
    "Estimated 200 hours (audio duration)"
  );
  assert.equal(
    mod.declaredMeasurement({
      metric: "IMAGE_COUNT",
      state: "KNOWN",
      unit: "COUNT",
      value: "200",
    }),
    "200 images"
  );
  assert.equal(mod.physicalBytes("5000000000"), "5 GB");
});
test("mixed catalogue paging is global, bounded and uses repeated array query parameters", async () => {
  const data = dataset();
  answer = {
    items: [{ representation: "CONTENT", item: data.item }],
    page: 2,
    pageSize: 20,
    total: 25,
  };
  await api.catalogue({
    page: 2,
    pageSize: 20,
    modalities: ["AUDIO", "VIDEO"],
    categoryIds: ["a", "b"],
  });
  assert.deepEqual(requests.at(-1).url.searchParams.getAll("modalities"), [
    "AUDIO",
    "VIDEO",
  ]);
  assert.deepEqual(requests.at(-1).url.searchParams.getAll("categoryIds"), [
    "a",
    "b",
  ]);
  answer.page = 1;
  await assert.rejects(api.catalogue({ page: 2, pageSize: 20 }), bad);
  const before = requests.length;
  await assert.rejects(api.catalogue({ pageSize: 51 }));
  assert.equal(requests.length, before);
});
test("detail rejects a foreign identity, mixed captured description, impossible material roles and extra canonical fields", async () => {
  const original = dataset();
  for (const mutate of [
    (value) => {
      value.item.id = id(9999);
    },
    (value) => {
      value.description.uploadChoice = "FULL_ONLY";
    },
    (value) => {
      value.description.title = "Another collection";
    },
    (value) => {
      value.item.materials[0].component = "SAMPLE";
    },
    (value) => {
      value.item.certified = true;
    },
  ]) {
    answer = structuredClone(original);
    mutate(answer);
    await assert.rejects(api.detail(original.item.id), bad);
  }
});
test("opaque Dataset dot segments cannot escape the owned endpoint", async () => {
  const before = requests.length;
  for (const selected of [".", ".."])
    await assert.rejects(api.detail(selected), matches("INVALID_DATASET_ID"));
  assert.equal(requests.length, before);
});
test("library grant A retains its frozen description when today's publication is B or unavailable", async () => {
  const a = dataset("FULL_ONLY"),
    recorded = grant(a),
    b = dataset("FULL_ONLY");
  b.item.id = a.item.id;
  answer = { item: recorded };
  const result = await api.libraryItem(a.item.id);
  assert.equal(result.item.material.contentId, a.item.publication.contentId);
  assert.notEqual(result.item.material.contentId, b.item.publication.contentId);
  assert.equal(requests.at(-1).credentials, "include");
  assert(requests.at(-1).url.pathname.startsWith("/api/v2/user/library/"));
});
test("unresolved historical descriptions stay unknown while a known exact material can remain recorded", async () => {
  const data = dataset("FULL_ONLY");
  answer = {
    item: grant(data, {
      title: null,
      description: null,
      metadataProvenance: "UNRESOLVED",
    }),
  };
  const result = await api.libraryItem(data.item.id);
  assert.equal(result.item.description, null);
  assert.equal(result.item.material.contentId, data.item.publication.contentId);
  answer.item.material.datasetId = id(999);
  await assert.rejects(api.libraryItem(data.item.id), bad);
});
test("new free claims send the reviewed exact target and verify the granted material", async () => {
  const data = dataset("FULL_ONLY"),
    quote = offer(data);
  answer = quote;
  await api.offer(data.item.id);
  answer = {
    success: true,
    grantId: id(900),
    material: {
      datasetId: data.item.id,
      contentId: data.item.publication.contentId,
      component: "FULL",
    },
  };
  await api.claim(data.item.id, quote.target);
  assert.equal(requests.at(-1).method, "POST");
  assert.deepEqual(requests.at(-1).body, { expectedTarget: quote.target });
  answer.material.contentId = id(999);
  await assert.rejects(api.claim(data.item.id, quote.target), bad);
});
test("free/paid, discount and Dataset identity mismatches never become an accepted offer", async () => {
  const data = dataset("FULL_ONLY", ["AUDIO"], true),
    quote = offer(data);
  for (const mutate of [
    (value) => {
      value.target.datasetId = id(999);
    },
    (value) => {
      value.accessFlow = "FREE_CLAIM";
    },
    (value) => {
      value.baseAmount = "1.00";
    },
    (value) => {
      value.discountAmount = "1.00";
    },
  ]) {
    answer = structuredClone(quote);
    mutate(answer);
    await assert.rejects(api.offer(data.item.id), bad);
  }
});
test("existing checkout receives the exact full target and tolerates equivalent decimal formatting without tolerating value/currency drift", () => {
  const data = dataset("FULL_ONLY", ["AUDIO"], true),
    target = offer(data).target;
  assert.deepEqual(mod.contentCheckoutItem(data.item.id, target), {
    datasetId: data.item.id,
    expectedTarget: target,
  });
  mod.assertContentCheckout(target, {
    amount: "12.5",
    currency: "INR",
    amountPaise: 1250,
  });
  for (const response of [
    { amount: "12.51", currency: "INR", amountPaise: 1251 },
    { amount: "12.50", currency: "USD", amountPaise: 1250 },
    { amount: "12.50", currency: "INR", amountPaise: 1249 },
    { amount: "12.500", currency: "INR", amountPaise: 1250 },
  ])
    assert.throws(
      () => mod.assertContentCheckout(target, response),
      matches("INCOMPATIBLE_CHECKOUT_RESPONSE")
    );
  assert.throws(
    () => mod.contentCheckoutItem(id(999), target),
    matches("INVALID_ACQUISITION_TARGET")
  );
});
test("sample and granted file context cannot cross scope, component, actor path or current workflow requirements", async () => {
  const data = dataset();
  answer = fileContext(data, "SAMPLE");
  await api.fileContext("SAMPLE", data.item.id, {
    scope: "PUBLISHED",
    component: "SAMPLE",
  });
  assert(
    requests.at(-1).url.pathname.includes("/marketplace/dataset-samples/")
  );
  const before = requests.length;
  for (const [audience, input] of [
    ["SAMPLE", { scope: "PUBLISHED", component: "FULL" }],
    ["LIBRARY", { scope: "PUBLISHED", component: "FULL" }],
    ["LIBRARY", { scope: "GRANTED", component: "SAMPLE" }],
  ])
    await assert.rejects(
      api.fileContext(audience, data.item.id, input),
      matches("INVALID_FILE_SCOPE")
    );
  assert.equal(requests.length, before);
});
test("sample pagination pins workflow and publication; granted pagination remains independent of today's workflow", async () => {
  const data = dataset();
  for (const audience of ["SAMPLE", "LIBRARY"]) {
    const context = fileContext(data, audience),
      member = fileMember(context),
      query = {
        scope: context.scope,
        component: context.component,
        contentId: context.contentId,
        contentGeneration: 1,
        ...(context.workflowRevision === null
          ? {}
          : { expectedWorkflowRevision: context.workflowRevision }),
        limit: 20,
      };
    answer = { context, items: [member], total: 1, nextCursor: null };
    await api.files(audience, data.item.id, query);
    answer.context.contentId = id(999);
    await assert.rejects(api.files(audience, data.item.id, query), bad);
  }
});
test("every download is an explicit new POST; an archive locator never becomes a separately downloadable entitlement", async () => {
  const data = dataset(),
    context = fileContext(data, "SAMPLE"),
    member = fileMember(context);
  const body = {
    scope: context.scope,
    component: context.component,
    contentId: context.contentId,
    contentGeneration: 1,
    expectedWorkflowRevision: 1,
    memberId: member.id,
    downloadIntentId: "6ecc2724-5baf-43c0-9f73-7243c57efaa2",
  };
  answer = {
    context,
    memberId: member.id,
    downloadIntentId: body.downloadIntentId,
    fileName: "sample.wav",
    measuredSizeBytes: "48044",
    url: "https://private.example.test/file",
    expiresAt: now,
    expiresInSeconds: 60,
    disposition: "ATTACHMENT",
  };
  await api.download("SAMPLE", data.item.id, body);
  assert.equal(requests.at(-1).method, "POST");
  assert.equal(requests.at(-1).cache, "no-store");
  const before = requests.length;
  await assert.rejects(
    api.download("SAMPLE", data.item.id, { ...body, logicalEntryId: id(999) })
  );
  assert.equal(requests.length, before);
  answer.context.component = "FULL";
  await assert.rejects(api.download("SAMPLE", data.item.id, body), bad);
});
test("forbidden private reads never retry or fall back to a current/public/legacy file", async () => {
  const before = requests.length;
  status = 403;
  await assert.rejects(api.libraryItem(id(500)), matches("FORBIDDEN"));
  status = 200;
  assert.equal(requests.length, before + 1);
});
const storage = new Map();
Object.defineProperty(globalThis, "sessionStorage", {
  configurable: true,
  value: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});
test("free-claim intent survives reload under its exact actor and target without credentials or signed URLs", () => {
  const data = dataset("FULL_ONLY"),
    intent = {
      actorId,
      datasetId: data.item.id,
      expectedTarget: offer(data).target,
    };
  mod.storeContentClaim(intent);
  assert.deepEqual(mod.readContentClaim(actorId, data.item.id), intent);
  assert.equal(mod.readContentClaim(otherActorId, data.item.id), null);
  assert.throws(() =>
    mod.storeContentClaim({
      ...intent,
      expectedTarget: { ...intent.expectedTarget, contentId: id(999) },
    })
  );
  mod.clearContentClaim(intent);
  assert.equal(mod.readContentClaim(actorId, data.item.id), null);
});

test("public table listing rejects private targets, raw cells, inactive claims and a changed publication", async () => {
  const data = dataset("FULL_AND_SAMPLE"),
    context = fileContext(data, "SAMPLE"),
    privateValue = tableMetadataFixture(context);
  const value = {
    datasetId: data.item.id,
    publicationId: data.item.publication.id,
    page: privateValue.page,
  };
  const query = {
    publicationId: value.publicationId,
    contentId: context.contentId,
    contentGeneration: context.contentGeneration,
    component: "SAMPLE",
    limit: 20,
  };
  answer = value;
  await api.publicTables(value.datasetId, query);
  assert.equal(requests.at(-1).credentials, "omit");
  assert.equal(requests.at(-1).cache, "no-store");
  for (const mutate of [
    (v) => (v.targets = privateValue.targets),
    (v) => (v.page.items[0].rawCells = ["private"]),
    (v) => (v.page.items[0].missingValues.value = "inactive claim"),
    (v) => (v.publicationId = id(999)),
    (v) => v.page.contentGeneration++,
    (v) => (v.page.frozen = false),
  ]) {
    answer = structuredClone(value);
    mutate(answer);
    await assert.rejects(api.publicTables(value.datasetId, query), bad);
  }
});
test("sample and historical grant table reads preserve exact targets and literal column headers", async () => {
  for (const audience of ["SAMPLE", "LIBRARY"]) {
    const data = dataset("FULL_AND_SAMPLE"),
      context = fileContext(data, audience);
    if (audience === "LIBRARY") context.contentId = id(7999);
    const value = tableMetadataFixture(context, undefined, true),
      query = {
        scope: context.scope,
        component: context.component,
        contentId: context.contentId,
        contentGeneration: context.contentGeneration,
        ...(context.workflowRevision === null
          ? {}
          : { expectedWorkflowRevision: context.workflowRevision }),
        memberId: value.memberId,
        tableId: value.page.tableId,
        limit: 20,
      };
    answer = value;
    const received = await api.tableMetadata(audience, data.item.id, query);
    assert.deepEqual(
      received.page.items.map((row) => row.observedName),
      [null, "", "value"]
    );
    assert.equal(requests.at(-1).credentials, "include");
    for (const mutate of [
      (v) => (v.context.contentId = data.item.publication.contentId),
      (v) => v.page.items.reverse(),
      (v) => (v.memberId = id(999)),
      (v) => (v.targets[0].memberId = id(999)),
      (v) => (v.page.items[0].meaning.value = "inactive private claim"),
    ]) {
      answer = structuredClone(value);
      mutate(answer);
      if (JSON.stringify(answer) === JSON.stringify(value)) continue;
      await assert.rejects(
        api.tableMetadata(audience, data.item.id, query),
        bad
      );
    }
  }
});
test("table metadata cannot bypass sample/full scope, workflow fences or production gates", async () => {
  const data = dataset("FULL_ONLY"),
    context = fileContext(data, "LIBRARY"),
    query = {
      scope: "GRANTED",
      component: "FULL",
      contentId: context.contentId,
      contentGeneration: 1,
      limit: 20,
    };
  const before = requests.length;
  await assert.rejects(
    api.tableMetadata("SAMPLE", data.item.id, query),
    matches("INVALID_FILE_SCOPE")
  );
  await assert.rejects(
    api.tableMetadata("LIBRARY", data.item.id, {
      ...query,
      expectedWorkflowRevision: 1,
    }),
    matches("INVALID_FILE_SCOPE")
  );
  await assert.rejects(
    production.buyerDatasetApi.publicTables(data.item.id, {
      publicationId: data.item.publication.id,
      contentId: context.contentId,
      limit: 20,
    }),
    matches("NOT_ENABLED")
  );
  assert.equal(requests.length, before);
});

import assert from "node:assert/strict";

const base = process.argv[2] || "http://localhost:3107";
const canonicalBase = "https://www.kuinbee.com";
// Existing dataset detail GETs record analytics views. Opt in explicitly when
// exercising uncached live detail pages; default checks avoid those requests.
const allowViewTracking = process.argv.includes("--allow-view-tracking");
const api = process.env.NEXT_PUBLIC_API_BASE_URL || "https://marketplace.backend.staging.kuinbee.com";
const get = path => fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(20000) });
const read = async path => {
  const response = await get(path);
  return { response, html: await response.text() };
};
const parseCanonical = html => [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g)].map(match => match[1].replace(/&amp;/g, "&"));
const visible = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "").replace(/<[^>]*>/g, " ");

const { html: xml, response: sitemapResponse } = await read("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URLs");
assert(urls.every(url => url.startsWith(canonicalBase + "/") || url === canonicalBase));
assert(!urls.some(url => /\/(pricing|analytics)(?:\/|$)/.test(url)));
assert(!xml.includes("/datasets/D000"), "Sitemap must use the identifiers the public API accepts");

const catalogue = await fetch(api + "/api/v1/marketplace/datasets?page=1&pageSize=20").then(response => response.json());
const services = await fetch(api + "/api/v1/marketplace/custom-collection-services?page=1&pageSize=100").then(response => response.json());
const requirements = await fetch(api + "/api/v1/marketplace/data-requirements?page=1&pageSize=48").then(response => response.json());
const datasetUrls = urls.filter(url => /\/datasets\/[^/]+$/.test(url) && !url.endsWith("/categories"));
assert.equal(datasetUrls.length, catalogue.data.total, "Every published dataset must be included");
assert.equal(urls.filter(url => url.includes("/data-request/services/")).length, services.data.total);
assert.equal(urls.filter(url => url.includes("/data-request/active-requirements/")).length, requirements.data.total);

for (const path of ["/datasets", "/data-request/services", "/datasets/categories"]) {
  const { response, html } = await read(path);
  assert.equal(response.status, 200, path);
  assert.deepEqual(parseCanonical(html), [canonicalBase + path]);
  assert(/<h1\b/.test(html), path + " lacks a rendered heading");
  assert(visible(html).trim().length > 500, path + " is a client-only shell");
}
const samples = [
  ...(allowViewTracking ? catalogue.data.items.slice(0, 5).map(item => ({ path: "/datasets/" + item.id, title: item.title, schema: true })) : []),
  ...services.data.items.map(item => ({ path: "/data-request/services/" + item.slug, title: item.publishedRevision.title })),
  ...requirements.data.items.map(item => ({ path: "/data-request/active-requirements/" + item.slug, title: item.title })),
];
for (const sample of samples) {
  const { response, html } = await read(sample.path);
  assert.equal(response.status, 200, sample.path);
  assert.deepEqual(parseCanonical(html), [canonicalBase + sample.path]);
  assert(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html));
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
  assert(heading && !heading.includes("Dataset Details"), sample.path + " has generic or missing content");
  if (sample.schema) {
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const datasetSchema = schemas.find(schema => schema["@type"] === "Dataset");
    assert.equal(datasetSchema?.name, sample.title);
    assert.equal(datasetSchema?.url, canonicalBase + sample.path);
    assert(datasetSchema.description.length > 20);
  }
}
const categories = urls.filter(url => url.includes("/datasets/categories/"));
for (const url of categories) {
  const path = new URL(url).pathname;
  const { response, html } = await read(path);
  assert.equal(response.status, 200, path);
  assert.deepEqual(parseCanonical(html), [url]);
  assert(/href="\/datasets\/c[a-z0-9]+"/.test(html), path + " lacks crawlable dataset links");
}
for (const path of ["/pricing", "/datasets/no-such-dataset", "/datasets/categories/no-such-category", "/data-request/services/no-such-service"]) {
  const { response, html } = await read(path);
  assert.equal(response.status, 404, path + " must return a real 404");
  assert(html.includes("noindex"), path + " must not be indexed");
}
const redirect = await get("/analytics");
assert.equal(redirect.status, 308);
assert.equal(redirect.headers.get("location"), "/strotas");
const { html: home } = await read("/");
assert(home.includes('placeholder="Search datasets and services"'));
assert(home.includes('href="/datasets/categories/finance"'));
assert(!/href="\/pricing"/.test(home));
console.log(JSON.stringify({ passed: true, sitemapUrls: urls.length, datasets: datasetUrls.length, services: services.data.total, requirements: requirements.data.total, categories: categories.length, sampleDetailPagesChecked: samples.length, datasetDetailAnalyticsReads: allowViewTracking }));

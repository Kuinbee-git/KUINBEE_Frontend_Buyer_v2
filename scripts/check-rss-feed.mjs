import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const nodeRequire = createRequire(import.meta.url);
const plain = (value) => JSON.parse(JSON.stringify(value));

// Match the existing category-discovery checks: no test-runner dependency,
// application server, credentials, real fetches, or social-publishing writes.
function loadHelper(file, globals = {}) {
  const commonJS = { exports: {} };
  const result = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  vm.runInNewContext(result.outputText, {
    exports: commonJS.exports,
    module: commonJS,
    URL,
    URLSearchParams,
    Date,
    AbortController,
    AbortSignal,
    Response,
    Headers,
    console,
    ...globals,
  });
  return commonJS.exports;
}

const { buildRssFeed } = loadHelper("src/features/rss/feed.ts");
assert.equal(typeof buildRssFeed, "function");

const site = {
  name: "Kuinbee",
  url: "https://www.kuinbee.com",
  description: "Public data updates & buyer guides.",
};
const post = {
  slug: "unchanged-blog-slug",
  title: "An existing article",
  description: "An existing public description.",
  category: "Buyer Guides",
  publishedAt: "2026-10-01",
};
const requirement = {
  referenceCode: "REQ-000017",
  slug: "construction-data",
  title: "Construction data needed",
  summary: "A published, public requirement summary.",
  publishedAt: "2026-10-03T09:00:00.000Z",
};

function decodeXml(value) {
  return value.replace(
    /&(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi,
    (_, entity) => {
      const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
      if (Object.hasOwn(entities, entity)) return entities[entity];
      return String.fromCodePoint(
        entity.startsWith("#x")
          ? Number.parseInt(entity.slice(2), 16)
          : Number.parseInt(entity.slice(1), 10)
      );
    }
  );
}

// Preserve CDATA as opaque text before extracting known RSS fields. Exact
// escaping assertions below are mandatory even without a Python installation.
function parseItems(xml) {
  const cdata = [];
  const masked = xml.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, content) => {
    const index = cdata.push(content) - 1;
    return `RSS_TEST_CDATA_${index}_END`;
  });
  assert.match(masked, /<rss\b[^>]*version="2\.0"/);
  assert.match(masked, /<\/rss>\s*$/);
  assert.doesNotMatch(
    masked,
    /\]\]>/,
    "CDATA terminators cannot escape a block"
  );
  assert.doesNotMatch(
    masked,
    /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/i,
    "Non-CDATA XML text must escape ampersands"
  );
  assert.doesNotMatch(
    xml,
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/u,
    "Invalid XML characters must be removed"
  );
  const restore = (raw) =>
    decodeXml(raw).replace(
      /RSS_TEST_CDATA_(\d+)_END/g,
      (_, index) => cdata[index]
    );
  return [...masked.matchAll(/<item>\s*([\s\S]*?)\s*<\/item>/g)].map(
    (match) => {
      const content = match[1];
      const element = (name) => {
        const field = content.match(
          new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`)
        );
        assert.ok(field, `Each item needs ${name}`);
        return restore(field[1]);
      };
      const guidTag = content.match(/<guid\b([^>]*)>/);
      return {
        title: element("title"),
        link: element("link"),
        guid: element("guid"),
        guidAttributes: guidTag[1],
        category: element("category"),
        pubDate: element("pubDate"),
        description: element("description"),
      };
    }
  );
}

const examples = [];
function build(posts = [], requirements = [], customSite = site) {
  const xml = buildRssFeed({ site: customSite, posts, requirements });
  assert.equal(typeof xml, "string");
  examples.push(xml);
  return { xml, items: parseItems(xml) };
}

const blogOnly = build([post]);
assert.equal(blogOnly.items.length, 1);
assert.equal(blogOnly.items[0].guid, `${site.url}/blog/${post.slug}`);
assert.equal(blogOnly.items[0].link, blogOnly.items[0].guid);
assert.match(blogOnly.items[0].guidAttributes, /isPermaLink="true"/);
assert.equal(
  blogOnly.items[0].pubDate,
  new Date(post.publishedAt).toUTCString()
);
assert.equal(blogOnly.items[0].description, post.description);

const combined = build([post], [requirement]);
assert.equal(combined.items.length, 2);
assert.equal(combined.items[0].guid, "urn:kuinbee:requirement:REQ-000017");
assert.match(combined.items[0].guidAttributes, /isPermaLink="false"/);
assert.equal(combined.items[0].category, "Active Data Requirement");
assert.equal(
  combined.items[0].link,
  `${site.url}/data-request/active-requirements/${requirement.slug}`
);
assert.equal(
  combined.items[0].pubDate,
  new Date(requirement.publishedAt).toUTCString()
);
assert.equal(combined.items[1].guid, blogOnly.items[0].guid);

const updated = build(
  [],
  [
    {
      ...requirement,
      title: "Edited title",
      summary: "Edited public summary",
      slug: "new-public-slug",
    },
  ]
);
assert.equal(
  updated.items[0].guid,
  combined.items[0].guid,
  "Edits cannot create a new social-post identity"
);
assert.equal(updated.items[0].pubDate, combined.items[0].pubDate);
const republished = build(
  [],
  [{ ...requirement, publishedAt: "2026-10-04T09:00:00.000Z" }]
);
assert.equal(
  republished.items[0].guid,
  combined.items[0].guid,
  "Republishing retains identity despite the API's new publication date"
);
const offsetDate = build(
  [],
  [{ ...requirement, publishedAt: "2026-10-03T14:30:00+05:30" }]
);
assert.equal(offsetDate.items[0].pubDate, combined.items[0].pubDate);

const duplicate = build([], [requirement, { ...requirement }]);
assert.equal(
  duplicate.items.length,
  1,
  "Requirement reference codes are deduplicated"
);
const historical = build(
  [],
  [{ ...requirement, publishedAt: "2020-01-01T00:00:00.000Z" }]
);
assert.equal(
  historical.items.length,
  1,
  "No implicit cutover cutoff removes active published requirements"
);

const date = "2026-10-03T09:00:00.000Z";
const ties = build(
  [{ ...post, publishedAt: date }],
  [
    { ...requirement, referenceCode: "REQ-000020", publishedAt: date },
    { ...requirement, referenceCode: "REQ-000001", publishedAt: date },
    requirement,
  ]
);
assert.equal(ties.items.length, 4);
const tiedGuids = ties.items.map((item) => item.guid);
assert.deepEqual(
  tiedGuids,
  [...tiedGuids].sort((left, right) => left.localeCompare(right)),
  "Equal publication dates use a deterministic GUID tie-break"
);

const hostileText =
  "A & B <test> \"quotes\" 'apostrophes' ]]> </item><item>\u0000\u000B\uFFFE\uFFFF lone-high:\uD800 lone-low:\uDFFF 😀\t\nend";
const safeText = hostileText.replace(
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/gu,
  ""
);
const hostileSlug = 'room & hall/<east> "one"';
const escaped = build(
  [
    {
      ...post,
      title: hostileText,
      category: hostileText,
      description: hostileText,
    },
  ],
  [
    {
      ...requirement,
      slug: hostileSlug,
      title: hostileText,
      summary: hostileText,
    },
  ],
  { ...site, name: hostileText, description: hostileText }
);
assert.equal(escaped.items.length, 2, "CDATA text cannot inject an item");
for (const item of escaped.items) {
  assert.equal(item.title, safeText);
  assert.equal(item.description, safeText);
  assert.match(item.description, /😀/u, "Valid non-BMP Unicode remains intact");
}
assert.equal(escaped.items[1].category, safeText);
assert.equal(
  escaped.items[0].link,
  `${site.url}/data-request/active-requirements/${encodeURIComponent(hostileSlug)}`
);
assert.match(escaped.xml, /&amp;/, "Channel text uses XML escaping");
assert.match(
  escaped.xml,
  /\]\]\]\]><!\[CDATA\[>/,
  "Embedded CDATA terminators are safely split"
);

for (const invalidDate of ["not-a-date", ""]) {
  assert.throws(() =>
    buildRssFeed({
      site,
      posts: [{ ...post, publishedAt: invalidDate }],
      requirements: [],
    })
  );
  assert.throws(() =>
    buildRssFeed({
      site,
      posts: [],
      requirements: [{ ...requirement, publishedAt: invalidDate }],
    })
  );
}
assert.equal(build().items.length, 0);

const publicApiRoot = "https://backend.example.invalid";
function loadService(fetchImplementation) {
  const calls = [];
  const timeoutCalls = [];
  const { listRssDataRequirements } = loadHelper(
    "src/services/rss-feed.service.ts",
    {
      require(name) {
        if (name === "server-only") return {};
        if (name === "zod") return nodeRequire("zod");
        if (name === "@/core/api/endpoints")
          return { API_BASE_URL: publicApiRoot };
        throw new Error(`Unexpected RSS service import: ${name}`);
      },
      AbortSignal: {
        timeout(milliseconds) {
          timeoutCalls.push(milliseconds);
          return new AbortController().signal;
        },
      },
      fetch: async (url, options) => {
        calls.push({ url: String(url), options });
        return fetchImplementation(new URL(url), options);
      },
    }
  );
  return { listRssDataRequirements, calls, timeoutCalls };
}
const response = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => ({ success: status < 300, data }),
});
const page = (items, number = 1, total = items.length) => ({
  items,
  page: number,
  pageSize: 48,
  total,
});
const rows = Array.from({ length: 50 }, (_, index) => ({
  ...requirement,
  referenceCode: `REQ-${String(index + 1).padStart(6, "0")}`,
  slug: `requirement-${index + 1}`,
  contactEmailSnapshot: "private-only-test-marker",
  contactNameSnapshot: "private-only-test-marker",
  organizationSnapshot: "private-only-test-marker",
  originalSubmission: { secret: "private-only-test-marker" },
  adminNotes: "private-only-test-marker",
}));
const paginated = loadService((url) => {
  const number = Number(url.searchParams.get("page"));
  return response(page(rows.slice((number - 1) * 48, number * 48), number, 50));
});
const published = await paginated.listRssDataRequirements();
assert.equal(
  published.length,
  50,
  "All authoritative pages are fetched, not just the first 48"
);
assert.equal(new Set(published.map((item) => item.referenceCode)).size, 50);
assert.equal(paginated.calls.length, 2);
for (const [index, call] of paginated.calls.entries()) {
  const url = new URL(call.url);
  assert.equal(url.origin, publicApiRoot);
  assert.equal(url.pathname, "/api/v1/marketplace/data-requirements");
  assert.equal(url.searchParams.get("pageSize"), "48");
  assert.equal(url.searchParams.get("sort"), "NEWEST");
  assert.equal(url.searchParams.get("page"), String(index + 1));
  assert.equal(call.options.cache, "no-store");
  assert.equal(
    call.options.next,
    undefined,
    "Announcements cannot reuse a stale Next API list"
  );
  assert.ok(call.options.signal);
  assert.ok(!call.options.method || call.options.method === "GET");
  assert.equal(new Headers(call.options.headers).has("authorization"), false);
}
assert.deepEqual(
  paginated.timeoutCalls,
  [5000],
  "One deadline bounds the entire pagination operation"
);
assert.equal(
  paginated.calls[0].options.signal,
  paginated.calls[1].options.signal
);
const allowed = ["publishedAt", "referenceCode", "slug", "summary", "title"];
for (const item of published) {
  assert.deepEqual(Object.keys(item).sort(), allowed);
}
assert.doesNotMatch(JSON.stringify(published), /private-only-test-marker/);
const allPublishedFeed = build([], published);
assert.equal(
  allPublishedFeed.items.length,
  50,
  "Equal-dated requirements each retain their own GUID"
);

const empty = loadService(() => response(page([], 1, 0)));
assert.deepEqual(plain(await empty.listRssDataRequirements()), []);
assert.equal(empty.calls.length, 1);
const offsetSource = loadService(() =>
  response(page([{ ...requirement, publishedAt: "2026-10-03T14:30:00+05:30" }]))
);
assert.equal((await offsetSource.listRssDataRequirements()).length, 1);

for (const status of [404, 401, 500]) {
  const unavailable = loadService(() => response(null, status));
  await assert.rejects(unavailable.listRssDataRequirements());
  assert.equal(
    unavailable.calls.length,
    1,
    "Failures cannot select legacy demo requirements"
  );
}
const networkFailure = loadService(() => {
  throw new Error("Synthetic network failure");
});
await assert.rejects(networkFailure.listRssDataRequirements());
const missingData = loadService(() => ({
  ok: true,
  status: 200,
  json: async () => ({ success: true }),
}));
await assert.rejects(missingData.listRssDataRequirements());
const invalidJson = loadService(() => ({
  ok: true,
  status: 200,
  json: async () => {
    throw new SyntaxError("Invalid JSON");
  },
}));
await assert.rejects(invalidJson.listRssDataRequirements());
for (const invalid of [
  { ...requirement, referenceCode: "not-a-public-reference" },
  { ...requirement, publishedAt: "not-a-date" },
  { ...requirement, publishedAt: null },
  { ...requirement, slug: "" },
  { ...requirement, summary: null },
]) {
  const malformed = loadService(() => response(page([invalid])));
  await assert.rejects(malformed.listRssDataRequirements());
}
const wrongPage = loadService(() => response(page([requirement], 2, 1)));
await assert.rejects(
  wrongPage.listRssDataRequirements(),
  "Mismatched pagination cannot loop"
);
const wrongPageSize = loadService(() =>
  response({ ...page([requirement]), pageSize: 12 })
);
await assert.rejects(
  wrongPageSize.listRssDataRequirements(),
  "The API must honor the requested pagination size"
);
const emptyBeforeTotal = loadService(() => response(page([], 1, 1)));
await assert.rejects(
  emptyBeforeTotal.listRssDataRequirements(),
  "Empty pages before the declared total must fail"
);
const repeatedPage = loadService((url) => {
  const requested = Number(url.searchParams.get("page"));
  return response(
    page(requested === 1 ? rows.slice(0, 48) : [requirement], 1, 49)
  );
});
await assert.rejects(
  repeatedPage.listRssDataRequirements(),
  "Repeated page metadata cannot produce an endless pagination loop"
);
assert.equal(repeatedPage.calls.length, 2);

const changedTotal = loadService((url) => {
  const number = Number(url.searchParams.get("page"));
  return response(
    page(
      rows.slice((number - 1) * 48, number * 48),
      number,
      number === 1 ? 50 : 51
    )
  );
});
await assert.rejects(
  changedTotal.listRssDataRequirements(),
  "A changing source snapshot cannot silently produce a partial feed"
);
const truncated = loadService((url) => {
  const number = Number(url.searchParams.get("page"));
  return response(
    page(number === 1 ? rows.slice(0, 47) : rows.slice(48), number, 50)
  );
});
await assert.rejects(
  truncated.listRssDataRequirements(),
  "A truncated page cannot skip rows between offset-based pages"
);
const duplicatedSource = loadService((url) => {
  const number = Number(url.searchParams.get("page"));
  return response(
    page(number === 1 ? rows.slice(0, 48) : rows.slice(0, 2), number, 50)
  );
});
await assert.rejects(
  duplicatedSource.listRssDataRequirements(),
  "Duplicate references across API pages cannot masquerade as complete coverage"
);
const tooManyPages = loadService((url) => {
  const number = Number(url.searchParams.get("page"));
  const items = Array.from({ length: 48 }, (_, index) => ({
    ...requirement,
    referenceCode: `REQ-${String((number - 1) * 48 + index + 1).padStart(6, "0")}`,
  }));
  return response(page(items, number, 4801));
});
await assert.rejects(
  tooManyPages.listRssDataRequirements(),
  "The pagination safety ceiling is bounded instead of looping indefinitely"
);
assert.equal(tooManyPages.calls.length, 100);

function loadRoute(list) {
  const logErrors = [];
  const { GET } = loadHelper("src/app/feed.xml/route.ts", {
    console: { error: (...args) => logErrors.push(args) },
    require(name) {
      if (name === "next/server") return { NextResponse: Response };
      if (name === "@/features/blog/blog-posts")
        return { blogPostsMeta: [post] };
      if (name === "@/core/config/seo.config") return { siteConfig: site };
      if (name === "@/features/rss/feed") return { buildRssFeed };
      if (name === "@/services/rss-feed.service")
        return { listRssDataRequirements: list };
      throw new Error(`Unexpected RSS route import: ${name}`);
    },
  });
  return { GET, logErrors };
}
const successRoute = loadRoute(async () => [requirement]);
const success = await successRoute.GET();
assert.equal(success.status, 200);
assert.match(success.headers.get("content-type"), /application\/rss\+xml/i);
assert.match(success.headers.get("cache-control"), /s-maxage=60\b/);
assert.match(success.headers.get("cache-control"), /(?:^|,\s*)max-age=0\b/);
assert.match(success.headers.get("cache-control"), /must-revalidate/);
assert.doesNotMatch(
  success.headers.get("cache-control"),
  /stale-while-revalidate|stale-if-error/
);
assert.equal(parseItems(await success.text()).length, 2);
const failureRoute = loadRoute(async () => {
  throw new Error("Synthetic source outage");
});
const failure = await failureRoute.GET();
assert.equal(
  failure.status,
  503,
  "The feed cannot silently succeed with partial or fallback announcements"
);
assert.match(failure.headers.get("cache-control"), /no-store/);
assert.equal(failure.headers.get("retry-after"), "60");
assert.doesNotMatch(await failure.text(), /<rss\b|<item>/);

// Optional independent standards parser, using stdin only. The mandatory
// Node assertions above still run when Python is not available.
const xmlCheck = spawnSync(
  "python3",
  [
    "-c",
    "import sys, xml.etree.ElementTree as ET; ET.fromstring(sys.stdin.read())",
  ],
  { input: escaped.xml, encoding: "utf8" }
);
if (xmlCheck.error?.code === "ENOENT") {
  console.log("Optional Python XML parse skipped: python3 is not installed.");
} else {
  assert.ifError(xmlCheck.error);
  assert.equal(
    xmlCheck.status,
    0,
    xmlCheck.stderr || "Independent XML parsing failed"
  );
  for (const xml of examples) {
    const result = spawnSync(
      "python3",
      [
        "-c",
        "import sys, xml.etree.ElementTree as ET; ET.fromstring(sys.stdin.read())",
      ],
      { input: xml, encoding: "utf8" }
    );
    assert.equal(
      result.status,
      0,
      result.stderr || "Independent XML parsing failed"
    );
  }
  console.log(
    "Optional Python ElementTree validation passed for all generated XML fixtures."
  );
}
console.log(
  "RSS identity, chronology, XML escaping, strict public pagination/privacy, failure handling, and route checks passed."
);

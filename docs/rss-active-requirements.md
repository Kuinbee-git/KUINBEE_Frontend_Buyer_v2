# RSS: blog posts and active data requirements

The existing `/feed.xml` now combines blog posts and authoritative, published data requirements. The public URL remains `https://www.kuinbee.com/feed.xml`; the channel is named **Kuinbee Updates**. Blog titles, descriptions, categories, publication dates, links, and permalink GUIDs are preserved. The combined feed is sorted newest first, with a stable GUID tie-breaker.

## Requirement items

- Source: `GET /api/v1/marketplace/data-requirements?page=N&pageSize=48&sort=NEWEST`. The public backend only returns published, active records.
- Serialized fields: approved public title, summary, publication date, canonical active-requirement link, and reference-code identity. No requester, contact, organization, budget, submission, or admin fields are copied.
- Category: `Active Data Requirement`.
- Stable non-permalink GUID: `urn:kuinbee:requirement:REQ-000017`. Editing content, changing a slug, or republishing does not create a new GUID. Consumer deduplication must use GUIDs rather than content changes.
- XML text and CDATA terminators are escaped safely; illegal XML characters are removed.

The feed-specific loader does not use the UI helper's legacy/static 404 fallback. It validates the API response, strips extra fields, fetches every page, and rejects changed totals, repeated references, malformed responses, and incomplete pages rather than returning partial successful XML. A shared five-second deadline bounds the complete load. A 100-page safety limit currently supports up to 4,800 active requirements; exceeding it returns an error instead of silently truncating.

## Freshness and failure behavior

API reads use `cache: "no-store"`, so they cannot silently fall back to previously cached requirements after unpublication, closure, or an upstream error. Successful feed responses permit a CDN cache of 60 seconds with no long stale-while-revalidate window; clients receive `max-age=0`. The authenticated requirement revalidation callback also invalidates `/feed.xml` without changing its existing authorization or page invalidations.

If authoritative loading fails, the route returns a generic HTTP 503 with `Cache-Control: no-store` and `Retry-After: 60`. It does not leak upstream errors, invent announcements, or return a misleading blog-only partial feed. This intentionally makes the combined feed temporarily unavailable during an API outage. A previously successful CDN response may still be served during its 60-second lifetime; neither the callback nor this change promises immediate LinkedIn posting.

## Automation cutover

This change does not configure, enable, or publish through LinkedIn. It makes requirement items available to the existing RSS consumer after deployment. Check any blog-only URL/category filter or fixed blog-specific post template in that automation.

All currently published requirements are included, not only requirements created after this code change. Before enabling the updated production feed, baseline their GUIDs or configure the consumer to start from the cutover time; otherwise old requirements can be interpreted as new and posted in a batch. There is no arbitrary server-side publication cutoff. Closed/unpublished requirements leave the feed, but an existing LinkedIn post is not automatically retracted. A requirement published and closed between consumer polls can be missed; RSS is not a durable, exactly-once publication outbox.

## Verification

Run `node scripts/check-rss-feed.mjs` from `frontend/user`. It uses installed TypeScript and Node assertions without installing a test runner. If Python 3 is available, it additionally validates fixture XML with the standard-library XML parser through stdin; mandatory Node checks still run without Python.

Tests cover blog identity, stable requirement identities after edits/republication, mixed chronological ordering, deduplication, special-character/CDATA/control handling, timezone dates, authoritative pagination beyond 48 entries, private-field stripping, malformed/upstream failure behavior, and success/error response headers.

Local acceptance used the existing running development server and staging's public API without database changes. The served XML was parsed and checked against all active API references; existing blog fields and GUIDs were compared with the production blog feed. TypeScript, scoped ESLint, scoped formatting, and tracked diff whitespace checks passed. No dependencies, user browsers, servers, credentials, LinkedIn posts, or deployment state were changed.

Framework reference: [Next.js route handlers](https://nextjs.org/docs/app/getting-started/route-handlers) and [cache invalidation](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).

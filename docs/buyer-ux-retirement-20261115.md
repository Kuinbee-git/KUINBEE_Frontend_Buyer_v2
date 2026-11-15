# Buyer UX retirement: 15 November 2026

The buyer site had two supplier entry paths: current application links and an obsolete email-only enquiry form. The latter did not create supplier applications. This cleanup removes the old form and sends every supplier application CTA to the supplier portal's `/apply` screen, preserving source and requirement references and selecting the matching staging or production portal.

Other confirmed obsolete UI removed:

- The unreachable old data-request page and its six-component flow, including the Gmail-compose submission path superseded by current requirement submission.
- Unreferenced Strotas story scenes and their CSS, the retired registry-access CTA and an unused dataset detail loading screen.

- The footer newsletter email field and Subscribe button had no form or submit handler.
- Unavailable Discord and YouTube community cards, including a generic YouTube homepage URL.
- Duplicate footer community links advertised distinct audiences but led to the same page.
- The duplicate `/analytics` Strotas implementation and public animation study gallery, including gallery-only components. Old URLs redirect to `/strotas`.
- The duplicate `/verify-email` implementation. Old links redirect to `/auth/verify-email` with the exact query values retained.
- The unused sidebar renderer. Its still-used account link configuration moves to the shared account constants and replaces nonexistent preference and activity destinations. Historical `?tab=` URLs select the correct current account screen.
- Voice industry CTA URLs supplied the obsolete category label `voice`, causing a production 500. These links now use voice search, and the old filter URL normalizes to search while preserving other filters.

Audit coverage: 24 public entry pages, 103 linked internal URLs, source-level route/link reference checks, and homepage fragment targets. The only linked HTTP failure in the pre-change audit was `/datasets?category=voice`. This is a bounded audit, not a claim that every authenticated or payment journey was exercised against production.

General contact, support tickets, requirement submission, published datasets and services, authentication, orders, library and the current Strotas waitlist remain functional workflows. No enquiry import, supplier approvals, outbound email, database deletion or backend contact API retirement is part of this frontend change.

Validation: lint; runtime dependency audit; contract and environment suites; browser component suites; compiled release browser suite; service sample browser suite. The release suite additionally checks retired entry redirects, requirement reference preservation, email token preservation, voice URL normalization, current supplier application CTAs, absent subscription controls and unavailable community cards, and historical account tab routing. Hosted acceptance is recorded separately after deployment.

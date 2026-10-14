# Delivery and launch gates

## Preview available for review

- Responsive white/navy/blue/copper design.
- Searchable sample directory and dedicated EBP society filter.
- Country of organisation, geographical coverage and content-language filters.
- English, French and Spanish interface drafts.
- Source registration questionnaire with multi-selection, research languages and optional society affiliation.
- Browser-only saved sources and recommendation demonstration.
- RS and WA demonstration areas, editable local profiles, society management and draft communications.
- Mission and preview privacy page; full production privacy draft.

## Required before live accounts

- Select the dedicated Supabase organisation; confirm project cost and provision it.
- Generate actual migrations from the draft schema; apply locally/staging and verify row-level permissions as anonymous, member, RS and WA actors.
- Implement authentication and all authorised server endpoints; connect the UI to real state. The preview is not a substitute for this work.
- Configure transactional email and authorised redirect URLs. Test confirmation expiry/resend, password reset, duplicate claims, ownership conflicts and account deletion.
- Invite Nathan; require new password and MFA before granting active WA access.
- Implement state transitions, audit records, invitations, administrative edits and last-admin protection.
- Confirm source representatives and content languages; source-provided metadata must not be confused with interface translation.
- Connect editorial-process/orientation fields; add staff repeaters, logo/banner service and contact-publication controls.
- Implement recommendation eligibility, server-side aggregation, rate limits and independent-reference checks.
- Review public input handling, cross-account access, SSRF protection, image handling and backup restoration.

## Required before public launch

- Confirm ownership of `idebp.org` or chosen alternative and set canonical/www redirects.
- Configure production hosting, caching, error monitoring and recoverable deployments.
- Connect GitHub build triggers; use a separate preview deployment from production.
- Replace hash routes with indexable source/society URLs, metadata, sitemap and language alternatives.
- Finalise privacy/terms, processor contracts, retention, transfers and opt-in consent.
- Review translations with fluent editors and test the completed site with keyboard/screen reader and mobile devices.
- Provide report/correction route, ownership appeals and periodic link checks.

## Required before communications

- Connect the intended LinkedIn and X identities to the selected scheduling service.
- Configure drafts, approval, scheduling, retries and idempotency. Obtain publishing authority for exact accounts/workflows.
- Select email service, configure domain authentication and test subscription confirmation/unsubscribe.
- Keep newsletter opt-in distinct from account registration.

Company ownership, payments and monetisation remain a later decision. No incorporation or payment service is created by the preview.

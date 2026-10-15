# Database setup and verification

Status: **15 October 2026**. Member, source-manager and admin implementation is complete and locally tested; hosted activation is pending. The live frontend contains 115 sources across 35 organisation countries and regions, with English, French and Spanish interfaces and editorial descriptions. It does not enable account submissions while the service is disconnected.

## Actual hosted state

Dedicated ID-EBP Supabase project: `hvwmystbqlocjixvwgfl`, in idorunning’s Org. Use this project only; never apply ID-EBP migrations to TAP, SEBP or another website.

| Component | Verified state |
| --- | --- |
| `20261014000100_directory_foundation.sql` | Applied to the dedicated project |
| `20261014000200_directory_guards.sql` | Applied to the dedicated project |
| `20261014231125_member_collaboration.sql` | **Not applied**; read-only inspection confirmed absence |
| `directory-api` Edge Function | Version 2 deployed, gated by the shared proxy secret |
| Cloudflare `DIRECTORY_PROXY_SECRET` | Saved; secret value is never recorded in the repository |
| Cloudflare `DIRECTORY_API_URL` | Unset, so the public frontend does not connect to the hosted service |
| Numeric email-code sign-in and SMTP | Not configured; email remains disabled |

The community migration attempt failed because the connector returned invalid/expired `requestState`. A fresh attempt was interrupted; a subsequent read-only check confirmed that the migration had not been applied. Do not infer success from an attempted tool call. Re-read migration versions and relevant schema objects before retrying.

## Migration and seed contents

Apply missing migrations in filename order, each in a transaction:

1. The foundation creates public source profiles, links, translations, saved sources and ranking aggregates. The private schema holds contacts, managers, claims, proposed changes, verification evidence, admin roles, audit events and communication records.
2. The guards maintain edit times, validate language-code shape and protect the final enabled administrator.
3. The community migration adds member profiles, 0–5-star ratings, moderated searchable tags, source suggestions, private admin invitations, claim-review evidence, rate limits, accepted AI-assisted metadata translations and protected workflow functions.

After the community migration is confirmed, apply the current `supabase/seed.sql`. Regenerate it with `npm run catalogue` and `npm run db:seed` when editorial data changes. It adds the 115 public source records and EN/FR/ES metadata where available; repeat runs preserve existing public edits. It invents no members, private source contacts, ownership approvals, ratings or confirmed ranking signals. Current seed statements depend on the community migration, so they must not be run against the foundation alone.

Countries use ISO-style two-letter codes; coverage and source research languages remain separate fields. Interface or description translation never changes the language in which the original research is available. SQL validates token shape, while application validation controls accepted catalogue values.

## Access and ownership model

| Caller | Access |
| --- | --- |
| Anonymous visitor | Published profiles, public links, eligible translations, approved tags and public rating aggregates |
| Confirmed member | Public reads and their own contributions through the protected same-origin API |
| Source manager | Member access plus proposed changes to explicitly authorised source blocks |
| Administrator | Review queues and privileged decisions after database-managed role checks and MFA |
| Server service role | Privileged records and append-only audit operations; no browser exposure |

Application tables use row-level security. Keep `private` outside PostgREST’s exposed schemas and deny direct client grants to private tables. The API validates the live Supabase Auth user and session, confirmed email, suspension and permissions; editable user metadata never grants a role. Browser credentials stay in encrypted Secure, HttpOnly, SameSite cookies. Mutations require same-origin and CSRF checks.

A source claim can be accepted automatically only when the confirmed member email matches the **exact source contact mailbox preapproved in private records**, with no existing owner. All other claims and further representatives require documented admin review. Institutional domain matching alone grants neither management access nor ranking credit. No preapproved private contact is fabricated from an editor-added listing.

The first admin requires a deliberate private invitation and verified email, followed by MFA. Matching `ntracey@gmail.com` does not automatically confer authority. No password or privileged role is seeded.

## Verification completed

The local automated checks pass. Run:

```sh
npm ci
npm test
```

The database suite executes real PostgreSQL statements through in-memory PGlite with disposable Auth identities and Supabase-style roles. It checks public/private visibility, cross-user denial, restricted profile/ranking/role writes, append-only audit records, last-admin protection, rate limits, exact-mailbox claims, moderation, genuine zero-star ratings, owner-rating exclusion, translations and repeatable seeds. API tests cover account/session and proxy trust boundaries using isolated fixtures. These tests send no emails and do not modify the hosted project.

Hosted Supabase Auth, real inbox delivery, PostgREST/session behaviour and concurrent database sessions still require acceptance checks. Local test success does not establish live account availability.

## Remaining activation steps

1. Restore a working migration connector/session, inspect the existing project versions, apply only the missing community migration and verify its committed schema objects. Apply the regenerated editorial seed afterwards.
2. Run hosted security advisors, check exposed schemas and repeat permission tests with dedicated test accounts. Confirm exact-mailbox claims, denied domain-only claims, ownership conflicts, reviewed changes/tags, ratings and admin MFA.
3. Configure an authorised SMTP sender, numeric-code template containing `{{ .Token }}`, Auth site/redirect settings and delivery limits. Verify sign-in, expiry/resend, typo handling and inbox delivery before enabling email.
4. Confirm Edge secrets and the shared Cloudflare proxy secret, then set `DIRECTORY_API_URL` to the dedicated `/functions/v1/directory-api` endpoint only when the hosted checks are ready. Enable `IDEBP_AUTH_EMAIL_ENABLED` deliberately after SMTP acceptance.
5. Verify the full deployed browser workflow and recovery/support arrangements. Keep public registration inactive until the account service reports the genuine ready state. Record backup and restore checks before production launch.

See `../backend/README.md` for routes and deployment bindings, `release-verification-2026-10-15.md` for the current frontend review, and `supabase-handover.md` for the later organisation transfer.

## References

- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database functions](https://supabase.com/docs/guides/database/functions)
- [PGlite](https://pglite.dev/docs/)

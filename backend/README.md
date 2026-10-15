# Database implementation

## Deployment status · 15 October 2026

Member, source-manager and admin implementation is complete and locally tested; automated checks pass. Dedicated Supabase project `hvwmystbqlocjixvwgfl` has the foundation and guard migrations only. The community migration is not applied: invalid/expired connector `requestState`, then an interrupted fresh attempt; a read-only check confirmed absence. Secret-gated `directory-api` Edge version 2 is deployed and the Cloudflare proxy secret is saved. `DIRECTORY_API_URL` is unset; numeric-code SMTP/template delivery is not configured and email remains disabled. Hosted account activation and end-to-end email acceptance are outstanding.

See [database activation steps](../docs/database-setup.md) and [release verification](../docs/release-verification-2026-10-15.md).

The former `schema.sql` design draft has been replaced by ordered SQL files in
`supabase/migrations`. The seed is `supabase/seed.sql`.

Run `npm ci` and `npm run test:database` for the isolated PostgreSQL checks. They
use PGlite in memory with a small Supabase-role/Auth fixture; they never connect
to a hosted database. See `docs/database-setup.md` for the remaining hosted gates.

`api.mjs` is the web-standard member API. `supabase/functions/directory-api/index.ts`
hosts it in the dedicated project's Edge Function; `verify_jwt` must be false
because public browsing and email-code endpoints authenticate differently. The
API verifies every member through Supabase Auth, then SQL checks the live Auth
session, confirmed email, suspension and database-managed roles. It never trusts
an editable metadata role. All `/api` responses are private and uncacheable.

Use the existing dedicated ID-EBP project, not TAP or SEBP. Inspect its applied
versions, apply only the missing community migration in filename order, verify
its committed objects, then apply the regenerated seed. Seed inserts never overwrite public edits or invent claims,
ratings or ownership. `source_claim_domains` records exact institution domains as
review evidence. A domain alone does not authorise control of a source. Only a
confirmed exact mailbox already preapproved in private `source_contacts` can gain
automatic access; all other claims need an administrator's review. Pending claims
never gain public verification badges or ranking signals.

The runtime needs `SUPABASE_URL`, a publishable/anon key and a server secret/service
role key. Edge Functions supply the legacy environment automatically. A separate
`SESSION_SECRET` (at least 32 random characters) is recommended; if absent, the
server service key derives a domain-separated AES-GCM key. Only encrypted,
Secure, HttpOnly, SameSite cookies reach the browser. CSRF tokens protect member
writes; origin checks protect all mutations. Persisted limits cap email requests,
verification attempts, member writes, tag suggestions and source submissions.

Email remains closed until `IDEBP_AUTH_EMAIL_ENABLED=true` is deliberately set.
Configure SMTP and change Supabase's passwordless email template to include
`{{ .Token }}`; the UI accepts a numeric code, not a magic-link callback. Check
provider delivery, authorised sender, rate limits and Auth site URL before opening
registrations. Deploying the database does not establish email delivery.

Create the first deliberate admin invitation with a privileged database operation:

```sql
insert into private.admin_invitations(email)
values ('the-approved-admin-address@example.org') on conflict do nothing;
```

This does not send email or create a password. The invited person signs in with
their confirmed mailbox, then enrols an authenticator. The role becomes active
only against that pending private invitation; review endpoints also require MFA
`aal2`. The last enabled admin cannot be deleted or suspended. No address is
hardcoded as an administrator in application code.

The Cloudflare Worker should forward `/api/*` to the Edge Function, preserving
Origin, cookies, content type, CSRF and the HTTP method, and returning every
`Set-Cookie` separately. It must not cache API responses. The Edge wrapper fixes
its canonical origin and accepts only the explicit ID-EBP origins. Never forward
an arbitrary host header into URL construction.

The Edge Function also requires the shared `X-IDEBP-Proxy-Key`. Set
`IDEBP_PROXY_SECRET` in its environment and `DIRECTORY_PROXY_SECRET` on the Worker,
or replace `__IDEBP_PROXY_SECRET_DEPLOYMENT__` only in the deployed server source.
The committed placeholder is deliberately rejected. Never commit the generated
secret. The Worker must overwrite caller-supplied proxy and `X-IDEBP-Client-IP`
headers with its server secret and Cloudflare's actual connecting address. This
keeps direct Edge callers from forging the origin/IP trust boundary.

| Route | Behaviour |
| --- | --- |
| `GET /api/status` | Honest connection, account and email availability |
| `POST /api/auth/request` | Request numeric email code; `{email,createAccount,displayName?}` |
| `POST /api/auth/verify` | Verify `{email,token}` against this browser's request |
| `GET /api/session` | Member details, CSRF token, managed sources and own contributions |
| `POST /api/auth/logout` | Revoke local Auth session and clear cookie |
| `GET /api/auth/mfa` | Own authenticator factors |
| `POST /api/auth/mfa/enrol` | Create own TOTP factor |
| `POST /api/auth/mfa/verify` | Verify `{factorId,code}` and refresh session |
| `GET /api/community` | Authoritative published profiles, approved searchable tags and ranking aggregates |
| `GET /api/sources/:slug/community` | Public rating summary, own rating, tags and verification |
| `GET /api/sources/:slug/profile` | Persisted public editable profile fields |
| `PUT /api/sources/:slug/rating` | One confirmed member's whole-star `{stars:0..5}`; owners excluded |
| `DELETE /api/sources/:slug/rating` | Remove own rating; absence is distinct from zero |
| `POST /api/sources/:slug/tags` | Suggest `{label}` for moderation |
| `POST /api/sources/:slug/claim` | Confirm an exact preapproved contact or request ownership review |
| `PATCH /api/sources/:slug/profile` | Owner proposes name, about, publisher, topics, methods, contentTypes |
| `POST /api/sources` | Member submits `{name,url,about,country,languages,types,contentTypes?,topics?}` for review |
| `GET /api/admin/review` | Admin with MFA receives private review queue |
| `POST /api/admin/review` | Review `{kind,id,decision,reason}` for tag, claim, revision or submission |

Every authenticated mutation sends `X-CSRF-Token`. Ratings aggregate atomically,
including a genuine zero. Deleting a member or making them a source manager
removes their rating. New sources and edits are reviewed; ownership and ranking
fields cannot be submitted as profile edits. Approved changes immediately appear
through `/api/community`; description changes invalidate stale translations.

Accepted AI-assisted directory descriptions use `public.source_ai_translations`,
with fixed `ai_translation` provenance and their exact original English text.
Only descriptions still matching the published source are public. This leaves
the separate source/human/draft translation schema and its validation untouched;
reviewed source or human translations take precedence for the same language.

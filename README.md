# IDEBP

**International Directory of Evidence-Based Policing**

Created and operated by Nathan Tracey. Repository: `idorunning/international_ebp-directory`.

## Mission

To bring together sources of policing research, learning and practice from around the world, making them easier to find and supporting better policing.

IDEBP helps people locate external sources. It does not interpret research, rate scientific quality or certify interventions. EBP societies have directory profiles alongside research websites.

## Run and validate

Member accounts use email verification codes or passwords. Source owners require independent administrator approval; profile changes are reviewed before publication. Administrators must replace the starter password and enable an authenticator before accessing moderation.

```sh
npm ci
npm run dev
npm test
```

The build creates a self-contained Cloudflare Worker. Public files contain no service keys or account tokens. Browser sessions use encrypted, HttpOnly cookies.

## Project guide

| Location | Purpose |
| --- | --- |
| `public/app.js` | Directory and source/society profiles |
| `public/i18n.js` | Interface translations and taxonomy labels |
| `public/data.js` | Initial factual source records, countries and language options |
| `public/ranking.js` | Relevance-first search and capped source signals |
| `public/styles.css` | Responsive design, accessibility and print rules |
| `src/worker.mjs` | Static serving, security headers and authenticated API proxy |
| `docs/build-specification.md` | Roles, workflows, scope, ranking and integrations |
| `docs/privacy-notice-draft.md` | Proposed production notice and publication gates |
| `supabase/migrations/` | Ordered database migrations, tested locally and not yet applied to Supabase |
| `supabase/seed.sql` | Repeatable public editorial seed, with no accounts or claimed ownership |
| `tests/database/` | Isolated PostgreSQL access-control and integrity tests |
| `docs/database-setup.md` | Database privileges, deployment order and hosted acceptance gates |
| `docs/launch-checklist.md` | Remaining work and acceptance gates |
| `docs/supabase-handover.md` | Temporary build organisation, cost decision and later ownership transfer |

## Hosting and domains

Preview Worker: `idebp-preview`, under Nathan's Cloudflare account. Published preview: https://idebp-preview.ntracey.workers.dev.

Nathan registered `id-ebp.org` on 14 October 2026. Cloudflare custom domains attach `id-ebp.org` and `www.id-ebp.org` to the preview Worker. The Worker redirects the www hostname and plain HTTP to `https://id-ebp.org`, preserving paths and queries. TLS certificates are active. Public HTTPS checks on 14 October returned 200 for the main address and 308 to the main address for www. The workers.dev preview address also remains available.

The GitHub repository is the source of truth. A production Cloudflare build connection should run the build and tests before deployment. Configure deployment secrets in Cloudflare/GitHub, never in this repository.

## Account service

The dedicated Supabase project is `hvwmystbqlocjixvwgfl`, with server-only account operations in `backend/api.mjs` and `supabase/functions/directory-api/index.ts`. The website Worker authenticates to this service using a rotated secret binding; only its hash is stored in the private database. Cloudflare Email Service sends sign-in codes from `sign-in@auth.id-ebp.org` with SPF, DKIM and DMARC configured.

The initial administrator invitation belongs to `contact@id-ebp.org`. The one-use starter credential is never committed. First use requires email verification, a new password and an authenticator.

Published sources in the database are authoritative. Source suggestions require administrator approval and confer no ownership. Home counters derive from unique published listings and countries, refresh on return to the page and every minute, and update after moderation. Static records provide a browseable fallback during an account-service outage.

See `docs/source-ownership-process.md` for access rules and operational checks. Migrations are versioned in `supabase/migrations`; local PostgreSQL tests and API tests run through `npm test`.

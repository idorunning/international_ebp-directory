# ID-EBP

**International Directorate of Evidence-Based Policing**

Created and operated by Nathan Tracey. Repository: `idorunning/international_ebp-directory`.

## Current status · 15 October 2026

The live [source catalogue](https://id-ebp.org/) contains **115 sources across 35 organisation countries and regions**. It brings together sources of evidence-based policing, research, best practice and ideas. Search indexes source metadata rather than every article published by an external website. Listings do not certify research quality or establish partnerships.

The interface and editorial source descriptions support English, French and Spanish. Original names, links and research languages are retained; the research itself is not translated. Three refinements of the selected uppercase ID-EBP option B are available at `/logo-options.html`, with a compact comparison at `/logo-options.html?view=compare`. Option B1 is selected, with the approved Blue & Burgundy palette. The internationally recruited board and its source-assessment role are in development; no board appointments or assessments are implied. The canonical design standard is `docs/id-ebp-design-standard.md`; the implementation plan is `docs/id-ebp-redesign-plan.md`.

Member, source-manager and admin implementation is complete and locally tested, including email-code sign-in, moderated searchable tags, 0–5-star ratings, source claims, proposed profile changes and administrative review. **Hosted account activation remains pending.** The live frontend explains the inactive service state and does not submit account forms while it is disconnected. Browser-only saved sources remain available.

Dedicated Supabase project `hvwmystbqlocjixvwgfl` exists in idorunning’s Org. The foundation and guard migrations are applied. The community migration is **not applied**: the connector returned invalid/expired `requestState`; a fresh attempt was interrupted and a subsequent read-only check confirmed the migration absent. The secret-gated `directory-api` Edge Function version 2 is deployed and the Cloudflare proxy secret is saved. The `DIRECTORY_API_URL` binding is unset and email remains disabled pending the community migration, seed, SMTP configuration and hosted acceptance checks. See `docs/database-setup.md` and `docs/supabase-handover.md`.

## Development

Use Node.js 22 or later:

```sh
npm ci
npm run dev
npm run catalogue
npm run db:seed
node scripts/build-brand-assets.mjs
npm run build
npm test
```

`npm run dev` serves http://localhost:4173. The build creates `dist/worker.mjs`, a self-contained Cloudflare Worker. Browser assets, fonts and labelled AI-generated community photographs are served locally. There are no tracking scripts or runtime package dependencies. The preview carries `noindex` directives.

## Project guide

| Location | Purpose |
| --- | --- |
| `public/app.js` | Directory, source profiles, discovery categories and country browsing |
| `public/members.js` | Member, source-manager and admin interface |
| `backend/api.mjs` | Same-origin session, authentication and community API |
| `supabase/functions/directory-api/index.ts` | Secret-gated hosted API adapter |
| `public/brand.js`, `public/brand-system.css` | Shared logo shapes and canonical design tokens |
| `public/logo-options.html` | Four identity alternatives, with comparison and detailed views |
| `public/i18n.js`, `public/source-translations.js` | Interface and editorial metadata translations |
| `research/catalogue.json` | Editable catalogue of 115 profiles with provenance and retrieval limits |
| `scripts/build-catalogue.mjs` | Generated browser records and searchable metadata index |
| `public/ranking.js` | Relevance-first search, capped source signals and sample-adjusted star ratings |
| `public/reach.js` | Animated real source/country totals with reduced-motion support |
| `src/worker.mjs` | Static serving, security headers and account-service proxy |
| `supabase/migrations/`, `supabase/seed.sql` | Ordered schema changes and repeatable public editorial data |
| `tests/` | Directory, translation, account/API and PostgreSQL permission/integrity checks |
| `docs/id-ebp-design-standard.md` | Identity, palette, icons, motion, trust and translation standard |
| `docs/build-specification.md` | Roles, workflows, scope, ranking and integrations |
| `docs/database-setup.md`, `docs/supabase-handover.md` | Actual hosted state, remaining activation checks and later ownership transfer |
| `docs/launch-checklist.md` | Wider production acceptance gates |

## Hosting and access

Cloudflare Worker `idebp-preview` serves `https://id-ebp.org` and remains available at `https://idebp-preview.ntracey.workers.dev`. The Worker redirects `www.id-ebp.org` and plain HTTP to the canonical HTTPS address, preserving paths and queries. The GitHub repository remains the source of truth. Keep secrets in deployment bindings, never in GitHub or browser JavaScript.

Founding administrator: `ntracey@gmail.com`. Administrator access requires a deliberate private invitation and MFA; matching an email address never promotes someone automatically. Source ownership requires the exact privately preapproved contact mailbox or documented admin review. An institutional domain alone gives no ownership or ranking credit. No accounts, private contacts or verified ownership are invented by the editorial seed.

Production registration, hosted email delivery and complete end-to-end account acceptance are not yet claimed. Logo import, outreach, social scheduling and newsletters remain separate work. The project can later move to an ID-EBP-owned Supabase organisation without reusing another website’s database.

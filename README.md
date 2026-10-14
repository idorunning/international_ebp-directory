# IDEBP

**International Directory of Evidence-Based Policing**

Created and operated by Nathan Tracey. Repository: `idorunning/international_ebp-directory`.

## Mission

To bring together sources of policing research, learning and practice from around the world, making them easier to find and supporting better policing.

IDEBP helps people locate external sources. It does not interpret research, rate scientific quality or certify interventions. EBP societies have directory profiles alongside research websites.

## Preview

This is a working **design preview**, not the production account service. Search, filters, English/French/Spanish interface translations, browser-only saved sources, local registration previews and illustrative administration work. No emails, real accounts, public votes or social posts are submitted. Twelve real websites are editor-added examples; their inclusion does not imply registration, endorsement or ownership verification.

Run with Node.js 22 or later:

```sh
npm run dev
npm run build
npm test
```

`npm run dev` serves http://localhost:4173. The build creates `dist/worker.mjs`, a self-contained Cloudflare Worker. There are no runtime package dependencies, remote fonts, tracking scripts or third-party page assets. The preview carries `noindex` directives.

## Project guide

| Location | Purpose |
| --- | --- |
| `public/app.js` | Directory, source/society profile, registration, member and admin demonstrations |
| `public/i18n.js` | Interface translations and taxonomy labels |
| `public/data.js` | Initial factual source records, countries and language options |
| `public/ranking.js` | Relevance-first search and capped source signals |
| `public/styles.css` | Responsive design, accessibility and print rules |
| `src/worker.mjs` | Static serving and security headers; rejects account API writes |
| `docs/build-specification.md` | Roles, workflows, scope, ranking and integrations |
| `docs/privacy-notice-draft.md` | Proposed production notice and publication gates |
| `backend/schema.sql` | Unapplied Supabase schema draft; not a migration |
| `docs/launch-checklist.md` | Remaining work and acceptance gates |
| `docs/supabase-handover.md` | Temporary build organisation, cost decision and later ownership transfer |

## Hosting and domains

Preview Worker: `idebp-preview`, under Nathan's Cloudflare account. Published preview: https://idebp-preview.ntracey.workers.dev.

Nathan registered `id-ebp.org` on 14 October 2026. Cloudflare custom domains attach `id-ebp.org` and `www.id-ebp.org` to the preview Worker. The Worker redirects the www hostname and plain HTTP to `https://id-ebp.org`, preserving paths and queries. TLS certificates are active. Public HTTPS checks on 14 October returned 200 for the main address and 308 to the main address for www. The workers.dev preview address also remains available.

The GitHub repository is the source of truth. A production Cloudflare build connection should run the build and tests before deployment. Configure deployment secrets in Cloudflare/GitHub, never in this repository.

## Production status

Nathan has approved a dedicated project in **idorunning’s Org** for the build phase, with a later move to IDEBP's own Supabase organisation. Its current subscription is Pro. The Supabase connector’s `get_cost` endpoint reports `UNAVAILABLE`; organisation reads work. Nathan approved dashboard fallback on 14 October, but dashboard authentication has not completed. Obtain the organisation-specific quote and cost approval before provisioning. No existing project has been modified or selected for deletion. See `docs/supabase-handover.md` for the transfer plan. Authentication, verification mail, admin invitation, public voting, logo import, social scheduling and newsletters remain to be implemented and connected.

The founding administrator is Nathan, at `ntracey@gmail.com`. Use a single-use invitation requiring a new password and MFA before admin access. No shared temporary password is published in code or deployed to a public login.

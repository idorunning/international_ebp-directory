# ID-EBP — design and build specification

15 October 2026 · Draft 0.6 · Project 1410-03

## Purpose and identity

**International Directory of Evidence-Based Practice (ID-EBP)** is an international directory of websites and organisations that publish policing research, learning, practical experience and ideas. Visitors follow links to the original publisher. The directory does not host a duplicate research library or interpret findings.

**Mission:** To bring together sources of policing research, learning and practice from around the world, making them easier to find and supporting better policing.

**Domain:** `id-ebp.org`, registered by Nathan. The public brand is uppercase ID-EBP, with the complete Practice descriptor underneath. Both hostnames are attached to Cloudflare; the Worker redirects `www.id-ebp.org` to `https://id-ebp.org`. TLS certificates are active and public HTTPS responses were verified on 14 October 2026.

**Public description:** A directory of sources of evidence-based policing, research, best practice and ideas. Members help others find useful sources through searchable tags and 0–5-star ratings.

**Boundary:** Directory only. Listings do not certify research quality or endorse an intervention.

**Owner and credit:** Designed and built by Nathan Tracey. Whether the service will later be owned by a company is a separate decision. Do not present IDEBP as an incorporated organisation or registered charity before that exists. Decide ownership of the domain, code, accounts, data-controller responsibilities and future income together before a commercial launch; no company formation is undertaken in this phase.

## Design system

Canonical identity and colour rules are recorded in `id-ebp-design-standard.md` and implemented in `public/brand-system.css`.

| Role | Colour |
| --- | --- |
| Page background | White `#FFFFFF` |
| Body text | Ink `#243B4B` |
| Wordmark, headings and primary actions | Navy `#17324D` |
| Globe and main accent | Teal `#087F8C` |
| Celebration and category accents | Gold `#E6AF2E`, coral `#D45A42`, violet `#7357A6` |
| Supporting surfaces | Pale `#EEF5F7` |

Public Sans is self-hosted in variable WOFF2 format with its SIL Open Font License. All lettering in the integrated uppercase ID-EBP wordmark uses one navy colour; the recognisable globe may use teal. Four native SVG alternatives are retained at `/logo-options.html`; option B is provisional pending Nathan’s choice. Use the shared `logoMarkup()` implementation rather than recreating coloured text. The full descriptor is **International Directory of Evidence-Based Practice**. Source cards may use genuine publisher logos, which do not imply affiliation or ownership verification.

The homepage has six categories with colourful labelled icons, country flags and an animated celebration of the real source/country totals. The reduced-motion path displays the final totals immediately. Community photographs remain labelled, have no slogan bubbles, and exclude operational or public-order scenes.

Target WCAG 2.2 AA. Include keyboard operation, visible focus, semantic labels, useful error messages, reduced-motion support and tested contrast. Colour must not be the sole status cue. Test at 320–1440px and 200% zoom, with screen-reader checks before launch. The current preview has semantic controls and responsive layouts; production accessibility certification is not claimed.

## Roles and permissions

| Role | Permissions |
| --- | --- |
| Anonymous directory user (DU) | Browse, search, filter, view profiles and follow source links without an account |
| Member DU | Browse, suggest searchable tags, submit one editable 0–5-star rating per source, suggest sources and request source access; collection sync, private notes, export and account deletion remain separately scoped launch work |
| Research Source (RS) | Register or claim a website/society; maintain only authorised profiles, contacts, branding, languages, links and verification evidence |
| Website Admin (WA) | Review claims, amend and hide profiles, manage taxonomy/translations, resolve reports, review ranking signals, invite admins, approve communications and inspect audit events |

An RS is also a DU; roles are additive. A person may represent more than one source. A source may have several authorised managers. Admin privileges are granted only through a protected server-side process. Hiding a page or checking a frontend role is never authorisation.

## Information architecture

Home; directory results; EBP societies; source/society profile; register or claim a source; account confirmation/recovery; optional member collection; source management; admin; mission/about; ranking explanation; privacy; terms and report-a-problem.

Societies are a first-class organisation category. They use the same registration, ownership confirmation and editorial management workflow. This phase manages society **directory profiles and authorised representatives**, not the society's own membership fees, elections or private membership database.

## Profile questionnaire

Required: source name, canonical website URL, private account email, factual description (600 characters), organisation country, at least one organisation type, at least one content type, content languages and authority-to-manage declaration.

Optional: publisher/legal name, coverage countries and regions, logo and banner, public contact name/role/email, separate staff profiles, public contact website, social links, related sources, affiliation to an EBP society with supporting URL, access conditions, topics, research methods, publication formats, update frequency, source language, translation availability and accessibility information. Public staff details require the representative's permission to publish them. Private account and verification addresses are never automatically made public.

Multiple selections are permitted:

- Organisation: EBP society, professional association, police/government, academic institution, charity, company, independent publication, blog, research collection, practice collection, learning provider.
- Material: original research, systematic/evidence reviews, research summaries, practice examples, implementation guidance, learning resources, commentary, datasets, practitioner stories.
- Methods represented: randomised controlled trials, quasi-experimental studies, qualitative research, observational studies, mixed methods, process/economic evaluation, systematic reviews, not specified.
- Editorial process: peer-reviewed material, internal professional review, external review, editorial review, self-published or mixed. This describes material carried by the site, not a blanket quality designation. Link to the source's stated review policy when available.
- Orientation: academic, operational/practitioner, policy, education or mixed.

The preview implements these classification fields. Staff repeaters and separate banner upload are in the production backlog.

## Translation and country/language discovery

Interface language and research language are independent fields. The live interface and editorial source descriptions support English, French and Spanish, with a dictionary structure for expansion. Editorial descriptions are labelled AI-assisted translations; native-language review remains a production gate. Store interface locale as a preference. Preserve original names and research languages, and never imply that linked research papers have been translated.

Registrants select all languages in which their actual research or learning resources are available. The preview provides 36 options plus additional-language entry. Production stores BCP 47 codes, supports multilingual descriptions with provenance and distinguishes full-text language, summary-only language and machine-translated availability. A French interface must not cause English-only resources to match a French-content filter.

Countries are split into organisation base (ISO country code) and geographical coverage. The directory supports all countries rather than requiring UK-style email domains. Society status, country, coverage and content language can be combined. A profile declaring affiliation is not automatically marked confirmed; the society relationship must be verified. Do not infer affiliation from a hyperlink.

## Registration and confirmation

1. A member requests an expiring email sign-in code and explicitly submits it for verification. Use generic responses, resend limits, expiry handling and same-origin session protection. The implemented account API remains inactive publicly until hosted activation checks pass.
2. A signed-in member can suggest a source or request access to an existing source. Input validation, duplicate checks, rate limits and a private review record protect the workflow. A submission does not immediately publish unchecked content.
3. Automatic source management requires the member’s confirmed email to match the exact contact mailbox preapproved for that source in private records. An institutional email domain alone proves neither ownership nor entitlement to ranking credit. Other claims, further representatives and ambiguous cases require documented administrator review.
4. Source managers can propose factual changes only to their authorised source blocks. Proposed changes, tags and new sources pass through the admin review queue before publication. Record the actor, time and decision; preserve previous public content.
5. Ownership badges and ranking signals reflect actual accepted verification evidence. Never infer authority from registration, a matching institutional domain or inclusion in the editorial catalogue.

Changes to verified domains, ownership and public contact permissions require re-verification. Ordinary factual edits are versioned. Admins can hide/reinstate entries with reasons; deleted-account handling does not silently remove legitimate public organisational records.

## Ranking

Apply hard filters first. Default ordering places query relevance ahead of capped source signals. Visitors may explicitly select alphabetical, country or rating order. Publish the weights and change history.

| Signal | Maximum | Conditions |
| --- | ---: | --- |
| Confirmed organisational identity | 12 | Exact privately approved source contact or documented administrator verification |
| Website control | 8 | Accepted verification evidence; an institutional domain alone does not grant the signal |
| Linked social presence | 5 | 2.5 each, at most two independently confirmed profiles; no follower-count boost |
| References from other RS | 8 | Two each, at most four independent organisations; verify the live referring page |
| Member star ratings | 7 | A 0–5-star mean adjusted by five neutral prior ratings at 2.5 stars |

Zero is a valid rating; an unrated source has no displayed average. Show the average and rating count. One confirmed member can maintain one rating per source, and source managers cannot rate their own source. The small-sample adjustment prevents one new rating dominating order. Shared ratings become available only after account activation; browser-only preview votes are not shared ranking evidence.

These product weights do not measure scientific quality, reliability or proven effectiveness. Cross-links from commonly owned sites, circular exchanges and duplicate domains must not count independently. No paid ranking advantage. Nathan’s source receives no special ownership or placement credit. Maintain a reasoned, audited correction and appeal route.

## Branding import

After website ownership confirmation, an RS can ask the server to suggest a favicon, Open Graph image or declared logo from its own website. Preview choices, permit upload/replacement and require rights confirmation. Do not scrape staff lists or publish contacts automatically.

Fetch through a bounded server-side service: HTTPS, size/time limits, public IP validation before every redirect, restricted MIME types, no credentials, no loopback/private/link-local or metadata endpoints, and no arbitrary SVG/script execution. Decode/re-encode images and store approved copies in object storage rather than hotlinking. Provide a neutral placeholder when no suitable logo exists.

## Administration

Dashboard for new/changed/flagged sources, society directory, pending claims, failed links, verification evidence, duplicate merges, user invitations, content taxonomy, translations and communications. Each privileged change records actor, target, timestamp and reason in an append-only audit log. Audit entries exclude passwords, tokens and unnecessary private data.

Founding admin: `ntracey@gmail.com`. A deliberate private invitation grants eligibility; matching an email address never promotes someone automatically. Sign-in uses an expiring email code, with enrolled MFA and a current privileged session required for administrative operations. Invitations for additional WA accounts require an authorised WA. Prevent removal of the last active administrator. No shared temporary password is published or activated.

## Technical build

| Service | Intended role | Current position |
| --- | --- | --- |
| Cloudflare | Preview/production Workers hosting, domain/DNS, TLS, abuse protection and scheduled background work | Preview published on Cloudflare Workers |
| GitHub | Source control, review, build/test workflow and releases | `idorunning/international_ebp-directory`, write access confirmed |
| Supabase | Dedicated PostgreSQL project, authentication, row-level permissions and source assets | Dedicated project `hvwmystbqlocjixvwgfl` exists in idorunning’s Org. Foundation and guards applied; community migration absent after a connector `requestState` failure. Later transfer remains planned. |
| Canva | Editable visual specification and future social templates | Design board created; updated naming/content revisions are an unsaved Canva editing draft |
| Wix | Existing account examined for site/domain tools | No duplicate Wix-hosted site; custom Cloudflare application remains the agreed architecture |
| Metricool | Candidate connector for LinkedIn/X scheduling | Suggested; connection/channel approval required |
| Email provider | Transactional confirmation/recovery mail and optional separately consented newsletter | SMTP and email-code delivery remain unconfigured; email sign-in is disabled pending hosted acceptance |

The preview is a small dependency-free browser application deployed as a Worker with static assets. Production should use crawlable source/society URLs, server-rendered metadata, a sitemap, language alternate URLs, caching and structured directory/organisation data. The preview's hash routes and noindex policy are deliberate and are not the final search-engine implementation.

Use Supabase Auth for identity. Use user-scoped database access for public reads and private saved collections. Server-side workflow endpoints use a service role only after validating the user's JWT and database permissions. Never trust editable user metadata for admin status. Keep service keys and provider tokens in secret bindings. Apply rate limiting and Turnstile to signup/claim/report routes as appropriate.

Member, source-manager and admin implementation is complete and locally tested. Three ordered migrations, a repeatable editorial seed, server API and permission/integrity tests are implemented. The hosted foundation and guard migrations are applied, but `20261014231125_member_collaboration.sql` is not: the connector returned invalid/expired `requestState`, a fresh attempt was interrupted and a read-only check confirmed absence. Secret-gated `directory-api` Edge Function version 2 is deployed and the Cloudflare proxy secret is saved. The `DIRECTORY_API_URL` binding remains unset and email is disabled pending the community migration, seed, SMTP and hosted checks. See `database-setup.md`; implementation readiness does not establish live account availability.

## Communication workflow

On first publication of a source, prepare a factual LinkedIn post, an X post within the connected account's limit, and a newsletter entry. Include name, country, content languages, categories and a canonical IDEBP profile link. Avoid automatic claims about research success or quality.

Queue states: draft → approved → scheduled → sent, with rejected/failed/cancelled alternatives. A WA previews and approves exact text, destination account and schedule. Automated preparation is permitted; public posting requires the configured publishing authorisation. Do not publish profile edits repeatedly. Use one idempotency key per source/channel/publication event; store provider IDs and retry only known transient failures.

Newsletter suggestion: monthly new-source digest. Separate unticked opt-in; confirm subscription before inclusion; unsubscribe from every message; maintain a minimal suppression record. Registering an RS or DU must not subscribe them automatically. Transactional account mail and newsletters use separate templates and preferences. The preview displays drafts only and collects no subscribers.

## Delivery phases and acceptance

1. **Directory preview:** live source/category/country discovery, three interface languages, translated editorial metadata, local collections, consistent identity and account screens that accurately disclose pending activation.
2. **Private functional beta:** dedicated Supabase project, migrated schema and seeded sources, email confirmation, ownership proofs, role/row-level tests, real member/RS/admin accounts, image import and admin audit trail. Verify inbox delivery and recovery before opening registrations.
3. **Public directory launch:** domain, DNS/TLS, reviewed privacy/terms, reviewed translations, anti-abuse controls, crawlable routes, approved initial content, backup/restore exercise, accessibility review and monitoring.
4. **Outreach:** connected LinkedIn/X channels, approval queue, tested opt-in newsletter and documented posting authority.

No production completion is claimed by delivering a design preview. Company formation, payments, study appraisal, automatic study appraisal, society membership billing and a full social network are outside this build phase.

## Current directory and identity revision · 15 October 2026

The live frontend contains **115 source profiles across 35 organisation countries and regions**, with six discovery categories, a labelled flag grid, generated searchable metadata and 18-result pagination. The EN/FR/ES interface and translated directory descriptions retain source-language names and original research links. Four integrated uppercase logos are available for Nathan to choose; B is provisional. The global-reach feature uses warm accents and upward count animation, while category icons use the recorded accent palette.

Public contact: `hello@thinkingaboutpolicing.org`. Credit: Nathan Tracey, 2026. Source-discovery provenance and access limitations are recorded in the dated international-source and source-expansion reviews. Current member/source/admin code is complete and locally tested; hosted migration, email and end-to-end activation remain outstanding as described above. Earlier 85/25 and 94/30 reviews record historical catalogue revisions, not the current totals.

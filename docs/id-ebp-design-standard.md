# ID-EBP design standard

Version 1.0 · 15 October 2026 · Nathan Tracey

This standard applies to the International Directory of Evidence-Based Practice at id-ebp.org. It is separate from Thinking About Policing and SEBP brand standards.

## Identity

- Write **ID-EBP** in capitals, with a horizontal hyphen. Never use a slash or a lowercase production wordmark.
- The complete descriptor is **International Directory of Evidence-Based Practice**, underneath the wordmark. Keep these words together as the English brand name when the interface is translated.
- Use one navy colour for all lettering. The integrated globe can use the single teal accent. Monochrome and reversed versions must remain recognisable.
- The globe must read immediately as a globe. Use a circular silhouette and restrained meridians or a simplified continental silhouette. Do not trail connections into a single line.
- Four alternatives are retained in `public/logo-options.html` and `public/assets/brand`. Option B is provisional in the preview; Nathan’s choice will determine the production identity. Alternatives are not interchangeable production logos. Regenerate the eight portable SVG exports with `node scripts/build-brand-assets.mjs`.
- Reuse `logoMarkup()` from `public/brand.js`. Never recreate the logo with miscellaneous coloured HTML text.
- Preserve the SVG proportions and descriptor. Minimum full lock-up width: 195 CSS px. Smaller contexts use the symbol-only favicon or a wordmark-only variant, with the full accessible name provided separately.

## Colour

Canonical tokens live in `public/brand-system.css`. Do not add near-duplicate greens, navy blues or unrecorded accent colours.

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Identity and structure | `--navy` | `#17324D` | All wordmark lettering, headings, navigation, primary buttons |
| Main accent | `--teal` | `#087F8C` | Globe, collaboration, EBP societies |
| Warm accent | `--coral` | `#D45A42` | Global-reach decoration, blog category |
| Celebration | `--gold` | `#E6AF2E` | Counter accent and decoration; use a darker tone for small text |
| Academic accent | `--violet` | `#7357A6` | Academic icon and category details |
| Body copy | `--ink` | `#243B4B` | Main paragraphs |
| Secondary copy | `--muted` | `#526877` | Supporting information |
| Light surface | `--pale` | `#EEF5F7` | Tinted sections and supporting panels |

Accent colour supports meaning; it must not be the only way to distinguish categories, verification or ratings. Text always carries the label. Keep body text and interactive labels legible against their surface; bright gold and pale coral are decorative or large-number colours, not small white-background text colours.

## Type and layout

Use the self-hosted upright Public Sans family. Headings and the wordmark are bold. Avoid italic headings, novelty type, ornamental effects and excessive capitalisation in body copy. British English throughout.

Keep pages formal, readable and direct. State that the site is a directory of sources of evidence-based policing, research, practice and ideas. Explain that members contribute tags and ratings. Avoid repeated vague phrases about finding knowledge.

Cards and panels use consistent 6–16px corner radii, clear spacing and light borders. Source names can wrap; never truncate critical identity or access information.

## Category icons

Use the same 24px SVG stroke system inside a 48px tinted rounded square. Icons have one category colour and a pale matching surface. Pair every icon with its category name.

| Category | Symbol | Accent |
| --- | --- | --- |
| Academic research | Graduation cap | Violet |
| Universities | University columns | Blue `#286D9E` |
| EBP societies | People | Teal |
| Blogs and practitioner voices | Writing pen | Dark coral `#BD503B` |
| Researchers who write | Research flask | Dark gold `#946709` |
| Independent institutes | Globe | Green teal `#377E71` |

## Global reach

Treat real source and country totals as a celebration. Use a navy feature with warm gold and coral details, restrained confetti shapes and a recognisable globe. Totals come from visible source records, never invented promotional figures.

Animate numbers upwards once when the feature enters view. Keep the final values available to assistive technology and display them immediately when reduced motion is requested. Provide a replay control. No flashing, autoplay sound or motion that blocks reading. The country total means organisation countries and regions represented, not every place covered by every source.

## Community and source trust

Member ratings run from **0 to 5 stars**. Zero is a valid rating; an unrated source has no average. Show both the average and the number of ratings. Ratings describe the usefulness of a source to members and do not certify the scientific quality of its papers.

Search relevance remains primary. A verified owner and community ratings can influence ordering. Display how ranking works. A small rating sample must not dominate results.

Members may propose searchable tags for any source. Tags preserve their wording; moderation and provenance support removal or correction. Never imply that user tags have been translated or scientifically verified.

A source owner can manage their source block after confirming the exact contact email address preapproved for that source in private records, or after documented administrator review. An institutional domain alone grants neither ownership nor ranking credit. Further representatives, shared hosting and ambiguous claims require review. Ownership badges must reflect real checked state, never editor-added assumptions. Administrative controls require authentication and server-side permission checks.

## Language

Translate the interface and editorial source descriptions. Preserve original institution names and links, and clearly distinguish translated directory metadata from original research. The directory does not translate or republish research papers.

Search includes original names, native-language aliases, translated descriptions and approved community tags. An owner’s edited description must not inherit an outdated translation; fall back to labelled original text until updated.

## Photography

Use community engagement, collaboration and learning scenes. No public-order or operational imagery. Keep generated scenes labelled. The hero photograph can fade at its left edge. Do not add slogan bubbles or text badges over the photograph.

## Release checks

Verify logo consistency in header, footer, favicon and logo gallery; real totals and count animation; reduced-motion code path; category contrast; source and country filtering; source translation and native-name search; distinct zero/unrated ratings; claim ownership and admin permissions; and errors that explain the real service state. Record what was actually tested, including any unavailable viewport or email-delivery verification.

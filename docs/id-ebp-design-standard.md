# ID-EBP design standard

15 October 2026 · version 3.1 · Nathan Tracey

The public name is **International Directory of Evidence-Based Policing**, abbreviated **ID-EBP**. This is an independent collection of source organisations, researchers and professional publications. It connects readers with original publishers. Inclusion and community ratings do not certify research quality.

## Identity and colour

Use the selected B1 globe-as-hyphen logo. Keep equal visible spacing between the D, globe and E, and centre the two-line descriptor beneath the lettering. The logo retains blue; text throughout the website must be visibly darker.

| Role | Colour |
| --- | --- |
| Logo | `#254AA5` |
| Headings and body text | `#20242B` |
| Navigation, links and primary controls | `#263244` |
| Burgundy accent and selected stars | `#8C293E` |
| White surface | `#FFFFFF` |
| Secondary surface | `#F5F4F2` |
| Shaded international research panel | `#F1EFED` |
| Dividers | `#DBD9D6` |

Use no teal or pale-blue interface backgrounds. Source providers retain their authentic logos and brand colours. Text links need underlining or an unambiguous layout cue, not colour alone. Public Sans remains the typeface, with upright, bold headings and readable paragraph spacing.

## Homepage

1. Blue identity, concise navigation, language selector, sign-in and Add a source.
2. Search-led introduction with charcoal heading, original-source description and collaboration photograph with a faded left edge.
3. Research sources by category: academic research, universities and research centres, societies, professional commentary, researcher publications and independent research institutes.
4. Evidence reviews, databases and practice guidance.
5. Research from across the globe: shaded neutral panel, true catalogue totals, subtle collaboration image, reduced-motion support and replay.
6. View evidence-based policing societies, with proportionate logos and consistent cards.
7. Browse by country.
8. Subject links and a subdued community collaboration banner.
9. Add a source.

Use white cards, neutral boundaries and restrained burgundy accents. Avoid repeated decorative numbering, oversized empty logo panels, clipped headings and uneven card footers. Five society cards share one row on wide screens, with sensible wrapping on tablets and mobiles.

## Ratings and accounts

Show stars and the number of ratings; do not duplicate the star display with a visible numeric score. Use five accessible radio controls, rendered as stars with screen-reader labels and keyboard support. Historical zero values remain valid data and must not be silently changed. Unrated sources remain explicitly unrated. Ranking and moderation retain their existing behaviour.

Apply the same neutral palette to source profiles, member forms, account notices and the design reference. This design update does not activate account services or claim successful registrations.

## Images, accessibility and translations

Use only collaboration, community engagement and shared learning scenes. Restore the left-edge fade in the hero and retain imagery on small screens in a compact treatment. Label generated scenes as fictional illustrations. Keep text legible over subdued backgrounds and preserve genuine provider logos.

Use consistent stroke icons, clear keyboard focus, labelled controls, responsive layouts and reduced-motion support. Keep English, French and Spanish copy aligned. The English registered-style project name remains consistent across locales; explanatory copy is translated.

## Delivery

The GitHub repository is the source of truth. Build and verify the existing Cloudflare Worker, retain its bindings, inspect rendered desktop, tablet and mobile layouts, and confirm the public deployment. Record actual checks and any limits in the release note.

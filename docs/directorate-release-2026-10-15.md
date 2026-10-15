# Directorate redesign · 15 October 2026

The approved public identity is **International Directorate of Evidence-Based Policing**. The redesign applies Option 1, Blue & Burgundy, to the existing source catalogue and retains the selected B1 globe-as-hyphen logo.

The canonical plan is `docs/id-ebp-redesign-plan.md`, with the ongoing standard in `docs/id-ebp-design-standard.md`. White category cards, clear boundaries, royal-blue controls, charcoal text and restrained burgundy replace the prior multicolour fields. Third-party organisations retain their authentic branding. The source and country totals remain based on catalogue records, with existing animation and reduced-motion support.

The About page describes the planned international board and its proposed source-assessment and participation roles. It explicitly says that the board and assessment process are not yet established. An email link allows visitors to express interest through the existing published contact address. The redesign does not appoint directors, create approvals or send outreach messages.

## Verification

- All 64 existing automated checks passed, including catalogue/search, translation, account/API and PostgreSQL permission tests.
- Canonical identity and governance copy checked in English, French and Spanish.
- Two-line SVG descriptor verified; fixed letter paths and 14-unit D/globe/E gaps preserved.
- Text contrast on white: main blue 8.07:1, supporting blue 5.43:1, burgundy 8.39:1, charcoal 14.75:1. Muted blue remains decorative.
- Portable SVGs regenerated; obsolete unselected assets removed.
- No supported browser-control capability was available in this managed session. Screenshots, rendered responsive layouts and interactive browser acceptance have not been re-verified in this release.

## Service boundaries

The existing account-service activation state is unchanged. No database migration, SMTP activation, provider verification or board-review service is part of this release. Preserve the existing Cloudflare Worker proxy secret and any current bindings during publication.

# ID-EBP release verification · 15 October 2026

The updated frontend is live at [id-ebp.org](https://id-ebp.org/) with **115 sources across 35 organisation countries and regions**. Four integrated uppercase ID-EBP logos share the exact descriptor, navy lettering and optional teal symbol. Option B is provisional; Nathan can compare the alternatives at [/logo-options.html?view=compare](https://id-ebp.org/logo-options.html?view=compare).

## Recorded checks

- All **64 automated checks pass**, covering directory/search, translations, membership/API, proxy boundaries and PostgreSQL permissions/integrity.
- Live desktop review at **1348px** found no horizontal overflow. The updated homepage and all four primary logos were visually inspected.
- Searching the Chinese name fragment `中央警察` found the Taiwan source, confirming native-name discovery.
- Switching to French displayed translated editorial source metadata. EN/FR/ES descriptions concern directory profiles, not translated research papers.
- All 115 profiles have French and Spanish descriptions and supporting notes. Research-language labels are localised; native names and research links remain intact.
- Replaying the global-reach feature visibly counted from intermediate values **6 sources / 2 countries** to the real totals **115 / 35**.
- The live member screens accurately show pending activation. Supabase foundation/guards are applied, but the community migration is absent; Edge v2 is secret-gated, the Cloudflare proxy secret is saved, the endpoint binding is unset and email is disabled pending migration, SMTP and hosted checks.

These records establish the tested desktop frontend behaviour and local implementation checks. They do not establish mobile-browser coverage, hosted member workflows, successful SMTP delivery or completed account activation.

Final frontend deployment: `667b2abfeae241a6bf5f33bec1f35be9`; Worker SHA-256 `0794c9c1d40bd6323ce99776d0676661aa57ba1bf7f165ccb62326da059fba72`.

## Visual evidence

- [Four logo comparison](id-ebp-logo-comparison-2026-10-15.jpg)
- [Updated homepage](id-ebp-homepage-2026-10-15.jpg)

See [the design standard](id-ebp-design-standard.md), [database setup](database-setup.md) and [backend routes/status](../backend/README.md) for the implementation and remaining activation steps.

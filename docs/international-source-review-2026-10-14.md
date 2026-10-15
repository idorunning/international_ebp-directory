# International source expansion and community design

14 October 2026 · Nathan Tracey · Design 0.3

The catalogue now contains 85 source profiles across 25 organisation countries, including five EBP societies. Sixty-five profiles were added to the original twenty. These are source destinations, not 85 individual studies. Organisation country is distinct from geographical coverage and the language of a publication.

## Discovery and checking

This was a targeted international source scan. It began with the agreed TAP research directory, the existing twenty records, SEBP's global collaboration page and Police Science Dr's public resource links. Searches then covered universities, police research institutions, professional networks, charities, independent research organisations, journals and practitioner accounts.

Official pages were inspected using web retrieval or direct HTTP text retrieval. The public catalogue retains supporting URLs, dates, descriptions, language/access notes and retrieval limitations. A successful HTTP response alone was not treated as verification: relevant page content was read. Where full retrieval failed, the affected profile states when classification relies on search-indexed official information. No passwords were obtained or protected pages accessed.

The original three research manifests remain as the provenance of the initial collection. `research/catalogue.json` is now the consolidated editable catalogue. `npm run catalogue` builds the browser records and metadata index; `npm run db:seed` generates the portable database seed. The hosted database has not been changed.

New destinations include SIPR, UCL, the Open University, Cardiff, Portsmouth, Liverpool John Moores, Cambridge University, Durham's Contextual Safeguarding team, the Vulnerability & Policing Futures centre, CREST, the Police Foundation, SafeLives, NSPCC Learning, the CSA Centre and the Children's Society toolkit.

Beyond the UK, the collection includes NSCR, the German and Norwegian police universities, Finland's Police University College, Brå, Malmö, VIVE, CESDIP, EUCPN, Efus, Griffith, Simon Fraser, Public Safety Canada, ISS Crime Hub, APCOF, CSVR, CHRIPS, Igarapé, the Brazilian Forum on Public Safety, Paz Ciudadana, Fundación Ideas para la Paz, INSYDE, HKU, UNAFEI, DCAF, UNICRI and UNODC. US resources complement the existing Matrix and society records. Broad academic discovery services are explicitly labelled as such.

## Society relationships

SEBP's current global-collaboration page describes societies in the UK, Australia and New Zealand, Canada, the Netherlands and the USA, and their coalition. These five directory profiles are linked from the homepage. This does not claim an IDEBP partnership, membership or endorsement.

A 2024 SEBP conference report mentions Sweden. A current official Swedish society website was not established in this bounded search. A guessed Swedish domain was not published. The Swedish research institutions that could be checked are included separately.

References:

- https://www.sebp.police.uk/global-collaboration
- https://www.sebp.police.uk/post/sebp2024-recap
- https://www.anzsebp.com/global-collaboration-societies-of-evidence-based-policing/

## Police Science Dr's research routes

The public homepage explains that weekly Snippets include links to original articles and that the archive/transcripts require a password supplied through a free mailing list. The resources page links EBP societies, the independent Cambridge Centre, College of Policing, Matrix and iIIRG. The academic-research introduction explains the structure and use of academic papers.

The defensible conclusion is that Police Science Dr translates published research and provides routes back to originals. Its public pages do not establish a single exclusive discovery database or a reproducible search protocol behind every selection. We have not reviewed the protected archive and do not attribute an undisclosed workflow to its editor. The website's source guide explains this distinction and links the public originals.

- https://www.policesciencedr.com/
- https://www.policesciencedr.com/resources
- https://www.policesciencedr.com/how-to-read-academic-research
- https://iiirg.org/resources/

## Corrections and limitations

- Springer Nature says the Cambridge Journal of Evidence-Based Policing ceased publication with it from 1 January 2026. Its existing papers remain accessible; new work is directed to the Cambridge Collection in the Journal of Experimental Criminology. The directory labels the earlier journal an archive.
- John Sutherland's old WordPress address returned HTTP 410. His current author-site journal is used instead and described as practitioner experience, not an intervention evidence collection.
- Malmö's current research-centre address replaces an outdated candidate URL.
- The POLIS platform could not be retrieved. The listing instead points to the OSCE's current community-policing resources and records that limitation.
- Finland's Polamk research pages and National Police Library information had direct-retrieval restrictions. Their profiles identify search-index-only checks. The library's restricted membership/full-text arrangements are stated explicitly.
- Several other candidate destinations were excluded when a suitable current page could not be established. See `research/discovery-exclusions.json`.
- Coverage is uneven and English-led. It is not a systematic review, exhaustive country census, affiliation audit or independent assessment of research quality. Original publication languages are recorded conservatively; an English landing page does not imply every linked paper is in English.

## Search and user experience

The generated metadata index includes names, publishers, acronyms, descriptions, topics, organisation country, coverage, languages and content types. Search normalises accents and selected equivalent terminology, including hot spots/hotspot and community/neighbourhood policing. Short acronyms match complete tokens, avoiding matches such as ISS within an unrelated word. Explicit filters are never silently relaxed.

Results identify matching metadata fields and paginate eighteen profiles at a time. Query parameters retain filters and the results page when a URL is shared or the browser's back/forward controls are used. The source guide distinguishes original research, reviews/maps, translation and practitioner experience. This remains source discovery: it does not crawl or search the full text of every external article.

The heavier ID/EBP wordmark is paired with a restrained globe arc. The homepage uses clearer introductory wording, international source examples and a society section. Both photographs are AI-generated illustrations of fictional people and places. They show only community engagement and collaboration. No operational, public-order, tactical, arrest or confrontational imagery is used. Captions disclose the generated scenes. WebP derivatives total about 227 KB, with a smaller responsive hero and lazy loading below the fold.

Public contact is hello@thinkingaboutpolicing.org. The footer credits Nathan Tracey, 2026. The founding administrator's separate account address remains unchanged.

## Verification

The automated suite covers catalogue/index consistency, accent and acronym handling, terminology equivalents, geographical search, strict filters, changes to demonstration records, routing, security headers, binary assets and database access/integrity. Tests are local and do not establish hosted account behaviour. The local browser download failed, so the deployed site was inspected through the connected cloud browser at 1363px. The homepage rendered without horizontal overflow. Live checks confirmed acronym search, 18-result pagination, Canada filtering, combined society/country filtering and French interface switching. Saved-source persistence after reload, the source-guide route and the corrected Hong Kong filter were also confirmed. The test bookmark was removed afterwards. Mobile viewport emulation was unavailable in that browser; this is a verification limit, not a claim of a completed mobile browser test. A country-label difference between Node and browser ICU was corrected by stabilising the Hong Kong label and testing that every source country appears in the filter.

Accounts, owner claims, submissions, email and public recommendations remain demonstrations. No provisioning, new subscription, outreach or message sending was undertaken.

The complete homepage, including the lazy-loaded community image and footer, was visually inspected after scrolling. Image assets and generation prompts are documented in `community-image-provenance.md`. Deployment on 14 October 2026: `05a2dfa35d754b6db81458728333837b`; compiled Worker SHA-256 `6a6d79f99072a0be1bd220b3d28b4a0661c350f293d98e57299960101be89dda`.

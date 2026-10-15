# Source layout recovery — 15 October 2026

Recovered uncommitted work from the interrupted source-layout session and applied it to the D3a logo branch with a clean three-way merge.

Each homepage category now has a horizontally scrollable source row, touch scrolling, labelled arrow controls, keyboard navigation and a View all link. Separate subdued background illustrations distinguish the rows. Country flags are enlarged and section spacing reduced. Only the overall rating is shown initially; members can expand the rating editor.

Logo workflow: `npm run build` checks new or changed editorial source URLs using `scripts/sync-source-logos.py --missing`. Downloaded assets are stored locally and recorded with origin and checksum in `research/source-logo-audit.json`. New candidates remain unpublished until visually reviewed; rejected partner/accreditation marks keep the text identity. Previously unavailable sources can be retried with `python3 scripts/sync-source-logos.py --retry-unavailable`. Existing verified assets are retained. Python 3, curl and Pillow are required for the branding stage. No third-party logo hotlinks are used.

The resource collection's View all filter was completed during recovery. The existing backend and account configuration are unchanged.

Verification: 65 automated checks passed. Published to the existing Worker (deployment `beede6c0f96544a59965555e85bffa17`). Live browser check confirmed seven collections, working arrows, no document overflow and no failed loaded images. All 115 source logos were audited; 57 are present, 58 retain text identities. Local browser installation was unavailable, so mobile emulation was not rechecked in this session.

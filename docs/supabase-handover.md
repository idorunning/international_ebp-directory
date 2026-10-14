# Supabase build setup and later handover

Status: 14 October 2026. No IDEBP Supabase project has been created. The existing schema is a draft and has not been applied to any hosted project.

## Agreed approach

Use a dedicated project named `international_ebp-directory` in **idorunning’s Org** for the build phase. Proposed region: London (`eu-west-2`), subject to availability at creation. Keep all IDEBP data, users and storage separate from Nathan's other websites. Move the project into an IDEBP-owned organisation when that account and its billing are ready.

Nathan is willing to remove an unused project if necessary. This does not identify a project to delete. Record its exact name and reference, check dependencies and backups, and obtain specific confirmation before permanent deletion. Do not reuse another site's database.

## Cost decision still required

The approved organisation is on Pro. The connector's cost endpoint is unavailable, and the approved dashboard fallback currently needs sign-in. No account-specific quote has been obtained and no new charge has been approved.

Supabase's published guidance says all projects in an organisation share its plan. Additional default-size projects on a paid organisation start at roughly US$10 per month, billed hourly; this is indicative, not this account's quote. Paused projects incur no compute charges, so deleting an already paused project will not save active compute costs. A Free organisation is a separate option, subject to the account's free-project allowance. Recheck the actual dashboard estimate, credits, taxes and add-ons before creation.

Do not change plans, remove projects or add paid services merely to resolve the connector failure.

## Keep the build portable

- Commit ordered schema migrations and public editorial seed records to GitHub once validated. Never commit private account data, passwords, connection strings or tokens.
- Keep project URLs and public keys in configuration; keep privileged keys in deployment secrets. Avoid project references embedded in application logic.
- Record Auth redirect URLs, confirmation requirements, SMTP configuration, buckets, file limits, edge functions, scheduled jobs and webhook dependencies alongside the implementation.
- Maintain a permissions test covering anonymous visitors, members, source managers and administrators. Include cross-account denial and last-admin protection.
- Separate demonstration data from real registrations. Before launch, decide explicitly which development records should be retained.

## Preferred handover: transfer the existing project

Supabase supports organisation-to-organisation project transfer. Current prerequisites include ownership of the source organisation, membership of the destination and removal of transfer-blocking GitHub integrations, project-scoped roles or log drains. A transfer does not change the project's region. Plan changes can affect features and availability; a paid-to-Free transfer may cause brief downtime.

When the destination is ready:

1. Confirm its owner, plan, billing and administrators. Record the project reference and take a recoverable backup appropriate to the implemented services.
2. Check transfer eligibility in the dashboard and review any plan differences. Schedule a maintenance window if needed.
3. Transfer the named IDEBP project only after approval of the concrete destination and any new charges.
4. Verify database records, Auth sign-in/confirmation/reset, storage assets, source management, saved sources, ranking and administrative audit events through the deployed site.
5. Review access and deployment integrations. Rotate secrets where a new project or changed access requires it, then verify old access is removed only after the new access works.

If a transfer is unsuitable, prepare a tested migration into a new project. Treat database records, Auth identities, storage files and configuration as separate migration items. Preserve the original until the restored service has passed acceptance checks; do not promise that copying schema alone moves user accounts or assets.

## References

Official documentation checked 14 October 2026:

- [Supabase project transfers](https://supabase.com/docs/guides/platform/project-transfer)
- [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)

This is an implementation and handover plan, not evidence that provisioning, backup or transfer has occurred.

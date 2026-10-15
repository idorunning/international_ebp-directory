# Supabase build setup and later handover

Status: **15 October 2026**. Dedicated ID-EBP project `hvwmystbqlocjixvwgfl` exists in **idorunning’s Org**. The foundation and guard migrations are applied. Member/source/admin implementation is complete and locally tested, but hosted account activation remains pending. This replaces the earlier pre-provisioning status.

## Current build state

- `20261014231125_member_collaboration.sql` is **not applied**. The migration connector returned invalid/expired `requestState`; a fresh attempt was interrupted and subsequent read-only inspection confirmed absence.
- Secret-gated `directory-api` Edge Function version 2 is deployed. The matching Cloudflare proxy secret is saved.
- `DIRECTORY_API_URL` remains unset. Numeric-code SMTP/template configuration is outstanding and email is disabled. No successful account email delivery or public registration is claimed.
- The frontend is live with 115 sources across 35 organisation countries and regions, EN/FR/ES interfaces/descriptions and four integrated uppercase logo alternatives. Option B remains provisional pending Nathan’s choice.

Use the existing dedicated project to finish activation; do not create a replacement merely to work around the connector failure. Read migration versions before retrying, apply the missing community migration transactionally, verify it, then apply the current editorial seed. Complete hosted security and email acceptance before connecting the public frontend. See `database-setup.md` for the exact remaining steps.

## Ownership and billing

The agreed build organisation is idorunning’s Org, with a later move to an ID-EBP-owned organisation when its ownership and billing are ready. Keep this project’s data, Auth identities and storage separate from Nathan’s other websites. No other project is selected for deletion, reuse or migration.

The project now exists, so earlier requests to obtain a quote before initial creation are historical. No new plan change, add-on, deletion or transfer is implied by this status update. Confirm actual dashboard billing and destination requirements when a future paid change or transfer is proposed.

## Keep the build portable

- Keep ordered migrations, the repeatable public editorial seed and permission tests in GitHub. Never commit private contacts, account data, passwords, connection strings or secret values.
- Keep project URLs and public keys in deployment configuration; privileged keys remain in server secrets. The browser talks to the same-origin Cloudflare API, not a service-role endpoint.
- Record the dedicated project reference, deployed Edge version, Auth configuration, SMTP sender/template, backup settings and the Cloudflare proxy/endpoint binding names. Transfer secret values through an authorised secret store.
- Preserve exact-mailbox or documented admin-review ownership rules. An institutional email domain alone grants no source control or ranking credit. Keep admin invitations private and require MFA.
- Maintain cross-account, owner, admin and last-admin tests. Separate editor-added public listings from genuine registrations and approved claims.

## Preferred handover: transfer the dedicated project

When the destination organisation is ready:

1. Confirm its owner, administrators, plan and billing. Identify project `hvwmystbqlocjixvwgfl` explicitly and take a recoverable backup appropriate to the services actually in use.
2. Check current transfer eligibility in the Supabase dashboard, including integrations and destination plan limits. Reconfirm official requirements at that time; do not assume a transfer changes region or preserves every plan feature.
3. Transfer only the named ID-EBP project after approval of the concrete destination and any new charges. Schedule a maintenance window if required.
4. Verify database records, sign-in/email codes, MFA, stored assets, source management, tags, ratings and administrative audit events through the deployed site.
5. Review Cloudflare endpoint/proxy bindings, Auth/SMTP and deployment access. Rotate secrets where access changes require it, and remove old access only after the transferred service passes verification.

If transfer is unsuitable, prepare a tested migration into a separate project. Database records, Auth identities, storage and deployment configuration are separate migration items. Preserve the original until the restored service passes acceptance; copying schema alone does not migrate users or assets.

## References

Official documentation reference set checked 14 October 2026; recheck before a future transfer or billing change:

- [Supabase project transfers](https://supabase.com/docs/guides/platform/project-transfer)
- [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)

Provisioning and the first two migrations are recorded above. Community migration, account activation, backup verification and organisation transfer are not claimed complete.

# Database setup and verification

14 October 2026. The migration files pass isolated PostgreSQL tests. They have not
been applied to a hosted Supabase project. The public site still serves the design
preview; these files do not enable accounts or collect registration data.

## What is ready

Apply migrations in filename order:

1. `supabase/migrations/20261014000100_directory_foundation.sql` creates public
   profiles, source links, reviewed descriptions, saved sources and ranking
   aggregates. The private schema holds contacts, managers, claims, proposed
   revisions, verification evidence, recommendations, admin roles, audit events,
   communication drafts and newsletter consent records.
2. `supabase/migrations/20261014000200_directory_guards.sql` maintains edit times,
   checks language-code shape and prevents removal of the final enabled admin.

The runner must apply each migration in a transaction. Never apply these files to
TAP, SEBP or another existing site's project. There is no destructive reset script.

`supabase/seed.sql` adds the 20 editor-selected public source records. It can be
repeated without duplicating records or replacing edited profiles. It creates no
accounts, private contacts, recommendations, ownership approvals or confirmed
ranking signals. Regenerate it with `npm run db:seed` when the public editorial
data changes and review the diff before applying it.

Countries use ISO-style two-letter codes, coverage uses country codes or explicit
region values, and research languages use language codes. Full-text, summary-only
and machine-translation language fields remain separate. The interface locale is
not a research-language filter. The application must validate codes against its
catalogue; SQL checks the token shape, not the full international registries.

## Access model

| Caller | Direct database access |
| --- | --- |
| Anonymous visitor | Published source profiles and their public links, reviewed translations and ranking aggregates |
| Signed-in member | Public reads; read, add and remove only their own saved sources |
| RS or WA browser session | Same direct privileges as a member; privileged work requires the protected server API |
| Server service role | Manage application records; append/read audit records, but no audit updates, deletion or table truncation |

All application tables enable row-level security. Private tables have no client
grants. Do not add `private` to PostgREST's exposed schemas. Machine translation
drafts stay private even if someone mistakenly adds a review timestamp. Links to
unpublished directory targets are not included in public results.

The service role is powerful and bypasses RLS. Before using it for any request, the
future server API must validate the user's token and check database-managed
ownership or admin permission. For WA operations it must enforce MFA and password
setup. A claimed role in editable user metadata is not authority. Access to the
private schema requires a server database connection or narrowly scoped server
functions; a normal REST client cannot query an unexposed schema.

## Tests that have run

```sh
npm ci
npm test
```

The database suite runs real PostgreSQL statements through PGlite in memory, with
disposable Auth identities and Supabase-style roles/default grants. It checks
public/private visibility, cross-user saved-source denial, prevention of direct
profile/ranking/role writes, append-only service audit access, final-admin
protection, constrained fields, RLS coverage, restricted helper execution and
repeatable seeds. No test calls Supabase, sends email or modifies a hosted project.

This does not test Supabase Auth, PostgREST token validation, email delivery,
storage, network policies or simultaneous database sessions. Those remain hosted
acceptance gates, including a concurrent last-admin removal test.

## Next hosted steps

1. Create the dedicated project after reviewing its account-specific price. The
   plugin reconnection restores reads but its `get_cost` function is still absent
   from the server's tool list. No additional IDEBP project appears in project
   listings as of this check.
2. Confirm the new reference and region; inspect its empty application schema.
   Apply the two migrations through the Supabase migration tool and record their
   versions. Load the editorial seed with a privileged database operation.
3. Run database security advisors, check exposed schemas and repeat permissions
   tests against the hosted API using dedicated test accounts and signed tokens.
4. Implement and connect authentication and the RS/WA workflow endpoints. Test
   email confirmation, claims, ownership proof, source changes, recommendation
   eligibility, invitations, MFA, recovery and account deletion.
5. Configure transactional email, redirect allowlists, secret storage and backups.
   Keep registrations closed until the functional beta gates pass.

The first admin must be deliberately invited and verified. A matching email
address alone must never cause automatic admin promotion. No password is seeded.

## References

- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database functions](https://supabase.com/docs/guides/database/functions)
- [PGlite](https://pglite.dev/docs/)

See `supabase-handover.md` for the later move to IDEBP's own organisation.

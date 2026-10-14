# Database implementation

The former `schema.sql` design draft has been replaced by ordered SQL files in
`supabase/migrations`. The seed is `supabase/seed.sql`.

Run `npm ci` and `npm run test:database` for the isolated PostgreSQL checks. They
use PGlite in memory with a small Supabase-role/Auth fixture; they never connect
to a hosted database. See `docs/database-setup.md` for the remaining hosted gates.

The live site still runs in design-preview mode. No real registrations, admin
accounts, email delivery or database connections are enabled by these files.

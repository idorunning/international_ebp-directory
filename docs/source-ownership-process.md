# Member, source and administrator access

Members verify their email with a one-time code. Their email is private and does not confer control over any listing. Confirmed members can rate sources, suggest tags and submit missing sources. Tags and listings enter an administrator review queue. Source managers cannot rate their own listing.

## First source owner

1. The applicant signs in using a verified email and selects a source.
2. They explain their role and provide a public staff, organisation or contact page. The server records their verified email with the request.
3. An administrator checks the source’s official website independently, finds a published contact without relying solely on the applicant’s links, and confirms the applicant’s authority where necessary. Domain matches and published email matches are supporting evidence, never automatic approval.
4. The administrator records a verification reference, an independent-check confirmation and a decision note. They cannot approve their own request. A source with an existing owner cannot be claimed again without the existing access being resolved.
5. Approval grants ownership for that one source, bound to the email that was checked. The role is checked live on every action. A change of email removes management access until reviewed again.

## Colleagues and publication

An owner can invite editors for their own source using an exact email address. The colleague signs in, verifies that mailbox and explicitly accepts the invitation in their member workspace. Invitations expire after seven days and remain valid only while the inviting owner retains access. Editors cannot invite others, become owners or act as website administrators. Owners can remove editor access and cancel invitations. The interface tells owners to share the sign-in address with their colleague; invitation-notification emails are not currently sent.

All profile edits remain proposals until an administrator approves them. Revisions retain the previous profile and its timestamp. Publication refuses stale revisions and revisions from a representative whose access has since been removed. Published URLs cannot be duplicated by using a trailing slash.

Administrators use a password change gate and TOTP authentication before moderation. They can review submissions, claims, profile edits and tags; inspect members, source access and recent audit decisions; suspend members, revoke source roles and invite another administrator. Suspended members cannot contribute, their source roles are removed and their ratings are removed. The database protects the last enabled administrator.

## Deployment and verification

The database is the authoritative catalogue. Counters count the same unique published sources used by the homepage. Hidden or unapproved sources are excluded. The browser reloads the catalogue after moderation, every minute while visible, and on return to the page.

The Worker consumes internal email-code delivery payloads and removes them before browser responses. Codes and credentials are not logged. The Edge Function accepts only the trusted website proxy; its secret is checked against a private stored hash. All privileged RPC functions are service-role-only, use explicit identity/session checks and are unavailable to browser database roles. Private tables have RLS with no client access policies by design.

Local tests cover email/session verification, CSRF and tampered cookies, denied role escalation, mandatory claim review, editor scope, email changes, public vote integrity, review gates and the public catalogue. First-login email receipt and authenticator enrolment require the administrator’s mailbox and device.

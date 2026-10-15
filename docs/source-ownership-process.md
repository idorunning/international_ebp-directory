# Member, source and administrator access

Members verify their email with a one-time code. Their email is private and does not confer control over any listing. Confirmed members can rate sources, suggest tags and submit missing sources. Tags and listings enter an administrator review queue. Source managers cannot rate their own listing.

## First source owner

1. Open Claim this source. Enter an email used to represent the source and request a code. Existing signed-in members can prove a different contact mailbox without switching their account; new claimants create their member account through this verification.
2. The email screen changes to code entry after delivery. Return to that same form, enter the code and send the claim. A role description and public reference link are suggestions only: neither is mandatory and there is no minimum word or character count. Drafts remain in tab session storage when switching apps, changing tabs or reloading. Codes expire after ten minutes; requesting another keeps the draft. Codes are never saved in session storage.
3. Email access proves control of a mailbox, not ownership of a source. Every public claim enters administrator review. An administrator checks authority, records a reference and confirms that check before approval. Decision notes are optional, with an auditable default. Existing ownership conflicts must be resolved first.
4. Administrators may approve their own source claims. The administrator identity, time, source mailbox, reference and decision remain recorded. This is an administrator declaration, not a claim of independent review.
5. Pending claims show Awaiting review instead of another claim form. Approved representatives see You manage this source and a direct editing link. A Check claim status button refreshes the recorded result. Approval grants source-specific ownership bound to the member account email. The separately proved source contact mailbox is retained privately. Changing the account email blocks access and removes the live public verification signal until reviewed again. A public verified-owner badge and ranking contribution follow an active approved owner; they do not certify research quality.

## Colleagues and publication

An owner can invite editors for their own source using an exact email address. The colleague signs in, verifies that mailbox and explicitly accepts the invitation in their member workspace. Invitations expire after seven days and remain valid only while the inviting owner retains access. Editors cannot invite others, become owners or act as website administrators. Owners can remove editor access and cancel invitations. The interface tells owners to share the sign-in address with their colleague; invitation-notification emails are not currently sent.

All profile edits remain proposals until an administrator approves them. Revisions retain the previous profile and its timestamp. Publication refuses stale revisions and revisions from a representative whose access has since been removed. Published URLs cannot be duplicated by using a trailing slash.

Administrators use a password change gate and email verification before moderation. They can review submissions, claims, profile edits and tags; inspect members, source access and recent audit decisions; suspend members, revoke source roles and invite another administrator. Suspended members cannot contribute, their source roles are removed and their ratings are removed. The database protects the last enabled administrator.

## Deployment and verification

The database is the authoritative catalogue. Counters count the same unique published sources used by the homepage. Hidden or unapproved sources are excluded. The browser reloads the catalogue after moderation, every minute while visible, and on return to the page.

The Worker consumes internal email-code delivery payloads and removes them before browser responses. Codes and credentials are not logged. The Edge Function accepts only the trusted website proxy; its secret is checked against a private stored hash. All privileged RPC functions are service-role-only, use explicit identity/session checks and are unavailable to browser database roles. Private tables have RLS with no client access policies by design.

Local tests cover email/session verification, CSRF and tampered cookies, denied role escalation, mailbox proof, optional supporting details, administrator self-review, private reports, mandatory public-claim review, editor scope, email changes, public vote integrity, review gates and the public catalogue. Password recovery sends a short-lived, single-use code to the registered email address. The user verifies the code before choosing a new password. No authenticator application is required.


## Saved collections and submission results

Signed-out visitors save sources in their browser. On sign-in, those existing saves are added to the verified member’s collection without replacing saves from another device. The server uses the authenticated session as the owner and requires a matching account header and CSRF token for changes. Saved-source rows retain their existing RLS ownership policies; private account collections never appear in the public catalogue.

Pending save/remove operations are kept separately for each account. They are idempotent and retried on return to the page, reconnection or Retry sync. The latest click wins if the user changes a save while a previous request is pending. Signing out clears the displayed account collection; a different member cannot import those queued operations. A successful import clears the guest list only after acknowledgement.

A successful mutation and a subsequent screen refresh have separate outcomes. A recorded claim still returns success if its additional session read fails. Failed dashboard reads leave recorded decisions successful and identify the refresh problem separately. Lost claim, review or rating responses trigger a read of the current recorded state before displaying an uncertain result. Permission messages distinguish administrator access, source-management access, suspended membership and ownership conflicts.

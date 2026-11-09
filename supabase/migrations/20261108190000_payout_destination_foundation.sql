-- LegitLoot payout destination foundation
-- Prepared on the isolated build branch only. NOT applied to Supabase.
-- Recipient data must be encrypted by a trusted server before insertion.
-- Never store raw PayPal email addresses or Venmo handles in this table.

alter table private.payout_requests
  add column if not exists destination_type text,
  add column if not exists recipient_ciphertext text,
  add column if not exists recipient_key_version text,
  add column if not exists recipient_hint text,
  add column if not exists reviewed_by uuid references auth.users(id) on delete restrict,
  add column if not exists reviewed_at timestamptz,
  add column if not exists decision_reason text;

alter table private.payout_requests
  add constraint payout_requests_destination_type_check
  check (destination_type is null or destination_type in ('paypal', 'venmo'));

alter table private.payout_requests
  add constraint payout_requests_recipient_encryption_check
  check (
    (recipient_ciphertext is null and recipient_key_version is null and recipient_hint is null)
    or
    (recipient_ciphertext is not null
      and length(recipient_ciphertext) >= 32
      and recipient_key_version is not null
      and length(recipient_key_version) between 1 and 32
      and recipient_hint is not null
      and length(recipient_hint) between 3 and 32)
  );

alter table private.payout_requests
  add constraint payout_requests_destination_bundle_check
  check (
    (destination_type is null and recipient_ciphertext is null
      and recipient_key_version is null and recipient_hint is null)
    or
    (destination_type is not null and recipient_ciphertext is not null
      and recipient_key_version is not null and recipient_hint is not null)
  );

alter table private.payout_requests
  add constraint payout_requests_review_metadata_check
  check (
    (reviewed_by is null and reviewed_at is null)
    or
    (reviewed_by is not null and reviewed_at is not null)
  );

create index if not exists payout_requests_review_queue_idx
  on private.payout_requests(status, requested_at)
  where status in ('requested', 'under_review');

comment on column private.payout_requests.destination_type is
  'Payout rail requested by the player: PayPal or Venmo. Does not imply provider approval.';
comment on column private.payout_requests.recipient_ciphertext is
  'Authenticated-encryption ciphertext only. Raw recipient data must never be stored here.';
comment on column private.payout_requests.recipient_key_version is
  'Identifier for the server-side encryption key version; never store the key itself.';
comment on column private.payout_requests.recipient_hint is
  'Non-sensitive masked destination hint for admin review, e.g. ***@example.com or @***name.';
comment on column private.payout_requests.reviewed_by is
  'Authenticated admin user who made the manual review decision.';

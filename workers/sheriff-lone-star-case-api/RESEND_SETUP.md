# Sheriff Resend Email Setup

Sheriff case-update email is already wired in the Worker through `POST /cases/:id/updates`. It stays disabled until these Worker secrets exist:

- `RESEND_API_KEY`
- `FROM_EMAIL`

## Configure Secrets

From `workers/sheriff-lone-star-case-api`:

```sh
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put FROM_EMAIL
```

Use a verified Resend sender for `FROM_EMAIL`, such as an address on a verified domain.

## Verify

Check Worker health:

```sh
curl https://sheriff-lone-star-case-api.ilanajill.workers.dev/health
```

Expected provider status after both secrets are set:

```json
{
  "providers": {
    "email": true
  }
}
```

## Smoke Test

1. Open a Sheriff case with email updates enabled and consent checked.
2. Unlock the Sheriff admin console on the case board.
3. Record an admin update.
4. Confirm the page reports `Email notification sent.`

The Worker redacts the case contact field for public reads unless the admin token is supplied. Emails are only sent from admin-triggered updates and only when the case includes opt-in consent.

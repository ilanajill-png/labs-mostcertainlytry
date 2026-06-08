# Sheriff R2 Evidence Setup

The Sheriff Lone Star evidence archive uses Cloudflare R2 as private, temporary case storage.

## Bucket

- Bucket name: `sheriff-lone-star-evidence`
- Worker binding: `EVIDENCE`
- Wrangler config: `wrangler.toml`

Create the bucket from this directory:

```sh
npx wrangler r2 bucket create sheriff-lone-star-evidence
```

Deploy the Worker after the bucket exists:

```sh
npx wrangler deploy
```

## Upload Policy

- Object path: `private/cases/{caseId}/evidence/{timestamp}-{safeFilename}`
- Access: private R2 only
- Public URLs: disabled
- Per-file limit: 25 MB
- Per-request limit: 6 files
- Accepted types: images and videos
- Retention: temporary until admin case closeout

Closing a case through `POST /cases/:id/close` requires `X-Sheriff-Admin-Token`. The closeout flow deletes stored R2 objects listed on the case and clears attachment records from the D1 payload.

## Smoke Test

After deploy:

```sh
curl https://sheriff-lone-star-case-api.ilanajill.workers.dev/health
```

Expected evidence status:

```json
{
  "r2Bound": true,
  "bucketName": "sheriff-lone-star-evidence"
}
```

Then file one Sheriff case from the public issue desk with a small image. The receipt should say the evidence uploaded to Cloudflare R2.

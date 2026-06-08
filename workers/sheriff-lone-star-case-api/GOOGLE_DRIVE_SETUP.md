# Google Drive Evidence Setup

Sheriff evidence uploads can use Google Drive while Cloudflare R2 is blocked. The Worker code is already deployed; it only needs Google service account credentials and a Drive folder id.

## Google Cloud

1. Open Google Cloud Console.
2. Create or select a project.
3. Enable **Google Drive API** for that project.
4. Create a service account, for example `sheriff-evidence-uploader`.
5. Create a JSON key for the service account and download it.

## Google Drive

1. Create a folder named `Sheriff Lone Star Evidence`.
2. Share the folder with the service account email from the JSON key.
3. Give the service account **Editor** access.
4. Copy the folder id from the folder URL.

Example folder URL:

```text
https://drive.google.com/drive/folders/FOLDER_ID_HERE
```

## Worker Secrets

Run these from `workers/sheriff-lone-star-case-api`.

```bash
npx wrangler secret put GOOGLE_CLIENT_EMAIL
npx wrangler secret put GOOGLE_PRIVATE_KEY
npx wrangler secret put GOOGLE_DRIVE_FOLDER_ID
```

Use values from the downloaded JSON key:

- `GOOGLE_CLIENT_EMAIL`: `client_email`
- `GOOGLE_PRIVATE_KEY`: `private_key`
- `GOOGLE_DRIVE_FOLDER_ID`: the Drive folder id

Then deploy:

```bash
npx wrangler deploy
```

Verify:

```bash
curl https://sheriff-lone-star-case-api.ilanajill.workers.dev/health
```

Expected evidence status after setup:

```json
{
  "r2Bound": false,
  "googleDriveConfigured": true
}
```

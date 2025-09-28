# CORS Error Fix

## Problem
```
Access-Control-Allow-Origin header is present on the requested resource
```

Your S3 bucket `catalog-studio-ui` doesn't allow uploads from `localhost:3000`.

## Solution

### 1. Go to S3 Bucket CORS Settings
1. AWS Console → S3 → `catalog-studio-ui`
2. **Permissions** tab → **CORS** section
3. Click **"Edit"**

### 2. Add This CORS Configuration

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "PUT",
      "POST",
      "GET",
      "HEAD"
    ],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-meta-custom-header"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

### 3. Save Changes
Click **"Save changes"**

### 4. Update Your Environment
Since your bucket is in `eu-central-1`, update your `.env.local`:

```bash
AWS_REGION=eu-central-1
AWS_S3_BUCKET=catalog-studio-ui
NEXT_PUBLIC_S3_DOMAIN=https://catalog-studio-ui.s3.eu-central-1.amazonaws.com
```

### 5. Test Again
- Restart your dev server: `npm run dev`  
- Try uploading again at `/dashboard/image-upload-demo`

✅ **This will fix the CORS error!**

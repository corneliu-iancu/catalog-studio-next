# AWS S3 Setup Guide

## 1. Create S3 Bucket

1. Log in to AWS Console → S3
2. Click "Create bucket"
3. Bucket name: `catalog-studio-images` (or your preferred name)
4. Region: `us-east-1` (or your preferred region)
5. **Block Public Access**: Uncheck "Block all public access" (for public image serving)
6. Click "Create bucket"

## 2. Configure CORS

1. Go to your bucket → Permissions → CORS
2. Add this CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": []
  }
]
```

## 3. Create IAM User

1. Go to IAM → Users → Create user
2. Username: `catalog-studio-s3-user`
3. Attach policy directly → Create policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::catalog-studio-images/*"
    }
  ]
}
```

4. Create access key → Copy credentials

## 4. Environment Variables

Add to your `.env.local`:

```bash
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET=catalog-studio-images
NEXT_PUBLIC_S3_DOMAIN=https://catalog-studio-images.s3.amazonaws.com
```

## 5. Test Upload

1. Go to `/dashboard/image-upload-demo`
2. Upload an image
3. Check your S3 bucket for the uploaded file
4. Verify the public URL works

## 6. Optional: CloudFront CDN

For production, set up CloudFront distribution:
1. Create CloudFront distribution
2. Origin: Your S3 bucket
3. Update `NEXT_PUBLIC_S3_DOMAIN` to CloudFront URL

## Folder Structure

Images will be organized as:
```
catalog-studio-images/
├── menu-items/
│   ├── uuid-1.jpg
│   └── uuid-2.png
├── restaurants/
│   └── logo-uuid.jpg
└── uploads/
    └── temp-files.jpg
```

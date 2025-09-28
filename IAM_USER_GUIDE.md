# IAM User Setup Guide

## Create IAM User with S3 Permissions

### Step 1: Create User
1. Go to **AWS Console** → **IAM** → **Users**
2. Click **"Create user"**
3. **User name**: `catalog-studio-s3-user`
4. Click **"Next"**

### Step 2: Create S3 Policy
1. Select **"Attach policies directly"**
2. Click **"Create policy"**
3. Choose **JSON** tab
4. Paste this policy (replace `your-bucket-name`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3BucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::catalog-studio-images/*"
    }
  ]
}
```

5. Click **"Next"**
6. **Policy name**: `catalog-studio-s3-policy`
7. Click **"Create policy"**

### Step 3: Attach Policy to User
1. Go back to user creation
2. Search for `catalog-studio-s3-policy`
3. Check the policy
4. Click **"Next"** → **"Create user"**

### Step 4: Generate Access Keys
1. Click on the created user
2. Go to **"Security credentials"** tab
3. Click **"Create access key"**
4. Choose **"Application running outside AWS"**
5. Click **"Next"** → **"Create access key"**
6. **Copy both keys** (Access Key ID & Secret Access Key)

### Step 5: Add to Environment
Add to your `.env.local`:
```bash
AWS_ACCESS_KEY_ID=AKIA...your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=catalog-studio-images
```

⚠️ **Important**: 
- Never commit these keys to version control
- Store them securely
- The Secret Access Key is only shown once

✅ **Done!** Your app can now upload to S3.

// app/api/images/display/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/aws/s3-client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const s3Key = searchParams.get('key');

    if (!s3Key) {
      return NextResponse.json({ error: 'S3 key is required' }, { status: 400 });
    }

    // Generate presigned URL for viewing (expires in 1 hour)
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
    });

    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 86400, // 24 hours to handle time sync issues
    });

    return NextResponse.json({ url: presignedUrl });
  } catch (error) {
    console.error('Error generating display URL:', error);
    return NextResponse.json({ error: 'Failed to generate display URL' }, { status: 500 });
  }
}

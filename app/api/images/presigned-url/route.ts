import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from '@/lib/aws/s3-client';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, folder = 'uploads' } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Generate unique file key
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const s3Key = `${folder}/${uniqueFileName}`;

    // Create S3 put command
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      ContentType: fileType,
      // Optional: Add metadata
      Metadata: {
        'original-name': fileName,
        'uploaded-at': new Date().toISOString(),
      },
    });

    // Generate presigned URL (expires in 5 minutes)
    const presignedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 300 
    });

    // Public URL for accessing the uploaded file
    const publicUrl = `${process.env.NEXT_PUBLIC_S3_DOMAIN}/${s3Key}`;

    return NextResponse.json({
      presignedUrl,
      s3Key,
      publicUrl,
      fileName: uniqueFileName,
    });

  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}

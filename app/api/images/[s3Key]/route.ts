import { NextRequest, NextResponse } from 'next/server';
import { s3Client, S3_BUCKET } from '@/lib/aws/s3-client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ s3Key: string }> }
) {
  try {
    // Await params before accessing properties (Next.js 15+ requirement)
    const { s3Key: rawS3Key } = await params;
    const s3Key = decodeURIComponent(rawS3Key);

    if (!s3Key) {
      return NextResponse.json({ error: 'S3 key is required' }, { status: 400 });
    }

    // Delete object from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    return NextResponse.json(
      { error: 'Failed to delete image from S3' },
      { status: 500 }
    );
  }
}

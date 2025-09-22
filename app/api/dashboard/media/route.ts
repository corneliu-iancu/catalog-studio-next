import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch media files
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // TODO: Replace with actual database query

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const fileType = searchParams.get('fileType');
    const usage = searchParams.get('usage');

    // Mock media files data for development
    const allFiles = [
      {
        id: 1,
        filename: 'margherita-pizza.jpg',
        originalName: 'Margherita Pizza Photo.jpg',
        size: 2457600, // bytes
        sizeFormatted: '2.4 MB',
        dimensions: { width: 1200, height: 1200 },
        dimensionsFormatted: '1200x1200',
        mimeType: 'image/jpeg',
        type: 'image',
        url: '/uploads/margherita-pizza.jpg',
        thumbnailUrl: '/uploads/thumbs/margherita-pizza.jpg',
        folder: 'menu-items',
        usedIn: [
          { type: 'menu-item', id: 3, name: 'Margherita Pizza' }
        ],
        uploadedAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 2,
        filename: 'caesar-salad.jpg',
        originalName: 'Caesar Salad.jpg',
        size: 1887436, // bytes
        sizeFormatted: '1.8 MB',
        dimensions: { width: 800, height: 800 },
        dimensionsFormatted: '800x800',
        mimeType: 'image/jpeg',
        type: 'image',
        url: '/uploads/caesar-salad.jpg',
        thumbnailUrl: '/uploads/thumbs/caesar-salad.jpg',
        folder: 'menu-items',
        usedIn: [
          { type: 'menu-item', id: 1, name: 'Caesar Salad' }
        ],
        uploadedAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-16T00:00:00Z'
      },
      {
        id: 3,
        filename: 'restaurant-logo.png',
        originalName: 'Tony\'s Pizza Logo.png',
        size: 159744, // bytes
        sizeFormatted: '156 KB',
        dimensions: { width: 400, height: 400 },
        dimensionsFormatted: '400x400',
        mimeType: 'image/png',
        type: 'image',
        url: '/uploads/restaurant-logo.png',
        thumbnailUrl: '/uploads/thumbs/restaurant-logo.png',
        folder: 'restaurant',
        usedIn: [
          { type: 'restaurant-profile', id: 1, name: 'Restaurant Profile' }
        ],
        uploadedAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      },
      {
        id: 4,
        filename: 'appetizers-category.jpg',
        originalName: 'Appetizers Banner.jpg',
        size: 3251200, // bytes
        sizeFormatted: '3.1 MB',
        dimensions: { width: 1600, height: 900 },
        dimensionsFormatted: '1600x900',
        mimeType: 'image/jpeg',
        type: 'image',
        url: '/uploads/appetizers-category.jpg',
        thumbnailUrl: '/uploads/thumbs/appetizers-category.jpg',
        folder: 'categories',
        usedIn: [
          { type: 'category', id: 1, name: 'Appetizers Category' }
        ],
        uploadedAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-12T00:00:00Z'
      },
      {
        id: 5,
        filename: 'unused-photo.jpg',
        originalName: 'Unused Photo.jpg',
        size: 1024000, // bytes
        sizeFormatted: '1.0 MB',
        dimensions: { width: 800, height: 600 },
        dimensionsFormatted: '800x600',
        mimeType: 'image/jpeg',
        type: 'image',
        url: '/uploads/unused-photo.jpg',
        thumbnailUrl: '/uploads/thumbs/unused-photo.jpg',
        folder: 'general',
        usedIn: [],
        uploadedAt: '2024-01-18T00:00:00Z',
        updatedAt: '2024-01-18T00:00:00Z'
      }
    ];

    // Apply filters
    let filteredFiles = allFiles;

    if (search) {
      filteredFiles = filteredFiles.filter(file =>
        file.originalName.toLowerCase().includes(search.toLowerCase()) ||
        file.filename.toLowerCase().includes(search.toLowerCase()) ||
        file.usedIn.some(usage => usage.name.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (fileType && fileType !== 'all') {
      filteredFiles = filteredFiles.filter(file => file.type === fileType);
    }

    if (usage) {
      switch (usage) {
        case 'used':
          filteredFiles = filteredFiles.filter(file => file.usedIn.length > 0);
          break;
        case 'unused':
          filteredFiles = filteredFiles.filter(file => file.usedIn.length === 0);
          break;
      }
    }

    // Calculate storage stats
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
    const usedFiles = allFiles.filter(file => file.usedIn.length > 0).length;
    const unusedFiles = allFiles.filter(file => file.usedIn.length === 0).length;

    return NextResponse.json({
      success: true,
      data: {
        files: filteredFiles,
        totalFiles: allFiles.length,
        filteredCount: filteredFiles.length,
        stats: {
          totalSize,
          totalSizeFormatted: formatBytes(totalSize),
          usedFiles,
          unusedFiles,
          storageLimit: 1073741824, // 1GB in bytes
          storageUsedPercent: (totalSize / 1073741824) * 100
        }
      }
    });

  } catch (error) {
    console.error('Error fetching media files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Upload new media files
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'general';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // TODO: Validate file types and sizes
    // TODO: Process and save files
    // TODO: Generate thumbnails
    // TODO: Save metadata to database

    // Mock upload response
    const uploadedFiles = files.map((file, index) => ({
      id: Date.now() + index, // Mock ID
      filename: `${Date.now()}-${file.name}`,
      originalName: file.name,
      size: file.size,
      sizeFormatted: formatBytes(file.size),
      dimensions: { width: 800, height: 600 }, // Mock dimensions
      dimensionsFormatted: '800x600',
      mimeType: file.type,
      type: file.type.startsWith('image/') ? 'image' : 'other',
      url: `/uploads/${Date.now()}-${file.name}`,
      thumbnailUrl: `/uploads/thumbs/${Date.now()}-${file.name}`,
      folder,
      usedIn: [],
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

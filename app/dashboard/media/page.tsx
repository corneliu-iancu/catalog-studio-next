import Link from 'next/link';

export default function MediaLibraryPage() {
  // TODO: Fetch media files data
  const mediaFiles = [
    {
      id: 1,
      filename: 'margherita-pizza.jpg',
      originalName: 'Margherita Pizza Photo.jpg',
      size: '2.4 MB',
      dimensions: '1200x1200',
      uploadedAt: '2024-01-15',
      usedIn: ['Margherita Pizza'],
      url: '/uploads/margherita-pizza.jpg',
      type: 'image'
    },
    {
      id: 2,
      filename: 'caesar-salad.jpg',
      originalName: 'Caesar Salad.jpg',
      size: '1.8 MB',
      dimensions: '800x800',
      uploadedAt: '2024-01-16',
      usedIn: ['Caesar Salad'],
      url: '/uploads/caesar-salad.jpg',
      type: 'image'
    },
    {
      id: 3,
      filename: 'restaurant-logo.png',
      originalName: 'Tony\'s Pizza Logo.png',
      size: '156 KB',
      dimensions: '400x400',
      uploadedAt: '2024-01-10',
      usedIn: ['Restaurant Profile'],
      url: '/uploads/restaurant-logo.png',
      type: 'image'
    },
    {
      id: 4,
      filename: 'appetizers-category.jpg',
      originalName: 'Appetizers Banner.jpg',
      size: '3.1 MB',
      dimensions: '1600x900',
      uploadedAt: '2024-01-12',
      usedIn: ['Appetizers Category'],
      url: '/uploads/appetizers-category.jpg',
      type: 'image'
    }
  ];

  return (
    <div>
      <header>
        <h1>Media Library</h1>
        <p>Manage your restaurant images and media files</p>
      </header>

      <nav>
        <Link href="/dashboard">← Back to Dashboard</Link>
      </nav>

      <section>
        <h2>Upload New Media</h2>
        <form>
          <div>
            <label htmlFor="mediaFiles">Select Files</label>
            <input 
              type="file" 
              id="mediaFiles" 
              name="mediaFiles" 
              multiple 
              accept="image/*"
            />
            <small>Supported formats: JPG, PNG, WebP. Max size: 10MB per file.</small>
          </div>

          <div>
            <label htmlFor="uploadFolder">Upload to Folder</label>
            <select id="uploadFolder" name="uploadFolder">
              <option value="general">General</option>
              <option value="menu-items">Menu Items</option>
              <option value="categories">Categories</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>

          <button type="submit">Upload Files</button>
        </form>
      </section>

      <section>
        <h2>Filter & Search</h2>
        <form>
          <div>
            <label htmlFor="search">Search Files</label>
            <input 
              type="text" 
              id="search" 
              name="search" 
              placeholder="Search by filename or usage"
            />
          </div>

          <div>
            <label htmlFor="fileType">File Type</label>
            <select id="fileType" name="fileType">
              <option value="">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>

          <div>
            <label htmlFor="usage">Usage</label>
            <select id="usage" name="usage">
              <option value="">All Files</option>
              <option value="used">Used in Menu</option>
              <option value="unused">Unused Files</option>
            </select>
          </div>

          <button type="submit">Apply Filters</button>
          <button type="button">Clear Filters</button>
        </form>
      </section>

      <section>
        <h2>Media Files ({mediaFiles.length})</h2>
        
        <div>
          <div>View:</div>
          <button type="button">Grid</button>
          <button type="button">List</button>
        </div>

        <div>
          {mediaFiles.map((file) => (
            <div key={file.id}>
              <div>
                <img src={file.url} alt={file.originalName} width="150" height="150" />
              </div>
              
              <div>
                <h3>{file.originalName}</h3>
                <p><strong>Filename:</strong> {file.filename}</p>
                <p><strong>Size:</strong> {file.size}</p>
                <p><strong>Dimensions:</strong> {file.dimensions}</p>
                <p><strong>Uploaded:</strong> {file.uploadedAt}</p>
                
                <div>
                  <strong>Used in:</strong>
                  {file.usedIn.length > 0 ? (
                    <ul>
                      {file.usedIn.map((usage, index) => (
                        <li key={index}>{usage}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>Not used</span>
                  )}
                </div>
                
                <div>
                  <button type="button">Copy URL</button>
                  <button type="button">Edit</button>
                  <button type="button">Download</button>
                  <button type="button">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Bulk Actions</h2>
        <div>
          <button type="button">Select All</button>
          <button type="button">Delete Selected</button>
          <button type="button">Download Selected</button>
          <button type="button">Move to Folder</button>
        </div>
      </section>

      <section>
        <h2>Storage Information</h2>
        <div>
          <div>
            <h3>Storage Used</h3>
            <p>45.2 MB of 1 GB</p>
            <div>
              <div style={{width: '4.5%', backgroundColor: '#ccc', height: '20px'}}></div>
            </div>
          </div>
          
          <div>
            <h3>File Statistics</h3>
            <p><strong>Total Files:</strong> {mediaFiles.length}</p>
            <p><strong>Images:</strong> {mediaFiles.filter(f => f.type === 'image').length}</p>
            <p><strong>Used Files:</strong> {mediaFiles.filter(f => f.usedIn.length > 0).length}</p>
            <p><strong>Unused Files:</strong> {mediaFiles.filter(f => f.usedIn.length === 0).length}</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Media Guidelines</h2>
        <div>
          <h3>Image Recommendations</h3>
          <ul>
            <li><strong>Menu Items:</strong> 800x800px minimum, square aspect ratio</li>
            <li><strong>Categories:</strong> 1200x600px, 2:1 aspect ratio</li>
            <li><strong>Restaurant Logo:</strong> 400x400px, transparent background (PNG)</li>
            <li><strong>File Size:</strong> Keep under 2MB for faster loading</li>
            <li><strong>Format:</strong> JPG for photos, PNG for logos/graphics</li>
          </ul>
          
          <h3>SEO Tips</h3>
          <ul>
            <li>Use descriptive filenames (e.g., "margherita-pizza.jpg")</li>
            <li>Always add alt text for accessibility</li>
            <li>Optimize images before uploading</li>
            <li>Use consistent naming conventions</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Media Library - Dashboard',
  description: 'Manage your restaurant images and media files.',
};

# Image Upload Integration Plan

## 🎯 Goal
Add image upload to product pages using our independent upload component.

## 📂 S3 Folder Structure Options

### Option A: Menu-based Structure (Recommended)
```
bucket/
├── menus/
│   ├── {menu_id}/
│   │   ├── items/
│   │   │   ├── {item_id}.jpg
│   │   │   └── {item_id}-thumb.jpg
│   │   └── categories/
│   │       └── {category_id}.jpg
│   └── logos/
│       └── {restaurant_id}.jpg
└── uploads/
    └── temp-files...
```

### Option B: Simple Structure
```
bucket/
├── menu-items/
│   ├── {item_id}.jpg
│   └── {item_id}-thumb.jpg
├── categories/
│   └── {category_id}.jpg
└── restaurants/
    └── {restaurant_id}.jpg
```

## 🔗 Integration Points

### 1. New Menu Item Page
**File**: `app/dashboard/menu/items/new/page.tsx`
- Add image upload field
- Save image reference on creation

### 2. Edit Menu Item Page  
**File**: `app/dashboard/menu/items/[id]/edit/page.tsx`
- Show current image
- Allow replacing image
- Update image reference

### 3. Database Integration
- Run migration: `database/migrations/add_image_fields.sql`
- Save `image_s3_key` and `image_url` to menu_items table

## 🛠️ Implementation Steps

### Phase 1: Component Integration
1. Create `ImageUploadField` component
2. Add to new/edit item forms
3. Handle form submission with image data

### Phase 2: Database Integration
1. Run database migration
2. Update API endpoints to handle image fields
3. Update menu display to show images

### Phase 3: Image Management
1. Add image deletion functionality
2. Handle image updates (delete old, upload new)
3. Add thumbnail generation

## 🎨 Component Usage Example

```tsx
import { ImageUploadField } from '@/components/ui/image-upload-field';

// In menu item form
const [itemData, setItemData] = useState({
  name: '',
  price: 0,
  image_s3_key: '',
  image_url: ''
});

<ImageUploadField
  currentImageUrl={itemData.image_url}
  onImageUploaded={(s3Key, publicUrl) => {
    setItemData(prev => ({
      ...prev,
      image_s3_key: s3Key,
      image_url: publicUrl
    }));
  }}
  folder={`menus/${menuId}/items`}
/>
```

## 📁 Folder Structure Decision

**Recommendation**: Option B (Simple Structure)
- Simpler to implement
- Most items have only one image
- Easy to understand and maintain
- Matches your requirement: "Most items will have only one picture"

**Folder Pattern**: `menu-items/{item_id}.jpg`

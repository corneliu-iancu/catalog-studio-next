import { 
  csvMenuItemSchema,
  type CsvMenuItemRow,
  type ProcessedCategory,
  type ProcessedMenuItem,
  type ProcessedImportData,
  type ValidationError,
  type ImportValidationResult,
  REQUIRED_CSV_HEADERS,
  ALL_CSV_HEADERS,
  VALID_ALLERGENS,
  VALID_SPICE_LEVELS
} from '@/lib/types/csv-import';

export class CsvImportService {
  /**
   * Parse CSV content and validate it
   */
  static async validateCsvContent(csvContent: string): Promise<ImportValidationResult> {
    try {
      const lines = csvContent.trim().split('\n');
      
      if (lines.length < 2) {
        return {
          isValid: false,
          errors: [{ row: 0, field: 'file', message: 'CSV must contain at least a header row and one data row', value: '' }],
          warnings: []
        };
      }

      // Parse headers
      const headers = this.parseCSVLine(lines[0]);
      const headerValidation = this.validateHeaders(headers);
      
      if (!headerValidation.isValid) {
        return {
          isValid: false,
          errors: headerValidation.errors,
          warnings: headerValidation.warnings
        };
      }

      // Parse and validate data rows
      const errors: ValidationError[] = [];
      const warnings: string[] = [];
      const validRows: (CsvMenuItemRow & { rowIndex: number })[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const values = this.parseCSVLine(line);
        const rowData = this.createRowObject(headers, values);
        
        // Validate row schema
        const validation = csvMenuItemSchema.safeParse(rowData);
        
        if (!validation.success) {
          validation.error.issues.forEach(error => {
            errors.push({
              row: i + 1,
              field: error.path.join('.'),
              message: error.message,
              value: String(rowData[error.path[0] as keyof CsvMenuItemRow] || '')
            });
          });
        } else {
          // Additional custom validations
          const customValidation = this.performCustomValidations(validation.data, i + 1);
          errors.push(...customValidation.errors);
          warnings.push(...customValidation.warnings);
          
          if (customValidation.errors.length === 0) {
            validRows.push({ ...validation.data, rowIndex: i + 1 });
          }
        }
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          errors,
          warnings
        };
      }

      // Process valid data
      const processedData = this.processValidData(validRows);
      
      return {
        isValid: true,
        errors: [],
        warnings,
        data: processedData
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [{ row: 0, field: 'file', message: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`, value: '' }],
        warnings: []
      };
    }
  }

  /**
   * Parse a CSV line handling quoted values and commas
   * Preserves whitespace within quoted values
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field - only trim if not quoted
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    
    // Trim values that weren't quoted (only trim outer quotes and whitespace)
    return result.map(value => {
      // Remove leading/trailing whitespace outside quotes
      const trimmed = value.trim();
      // If the value is wrapped in quotes from the original field, it's already unquoted
      return trimmed;
    });
  }

  /**
   * Validate CSV headers
   */
  private static validateHeaders(headers: string[]): { isValid: boolean; errors: ValidationError[]; warnings: string[] } {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];
    
    // Check for required headers
    for (const requiredHeader of REQUIRED_CSV_HEADERS) {
      if (!headers.includes(requiredHeader)) {
        errors.push({
          row: 1,
          field: 'headers',
          message: `Required header '${requiredHeader}' is missing`,
          value: headers.join(', ')
        });
      }
    }
    
    // Check for unknown headers
    for (const header of headers) {
      if (!ALL_CSV_HEADERS.includes(header as any)) {
        warnings.push(`Unknown header '${header}' will be ignored`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Create row object from headers and values
   */
  private static createRowObject(headers: string[], values: string[]): Record<string, string> {
    const obj: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    return obj;
  }

  /**
   * Perform custom validations beyond schema
   */
  private static performCustomValidations(
    data: CsvMenuItemRow, 
    rowIndex: number
  ): { errors: ValidationError[]; warnings: string[] } {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Validate allergens
    if (data.allergens) {
      const allergens = data.allergens.split(',').map(a => a.trim().toLowerCase());
      const invalidAllergens = allergens.filter(a => a && !VALID_ALLERGENS.includes(a as any));
      
      if (invalidAllergens.length > 0) {
        errors.push({
          row: rowIndex,
          field: 'allergens',
          message: `Invalid allergens: ${invalidAllergens.join(', ')}. Valid options: ${VALID_ALLERGENS.join(', ')}`,
          value: data.allergens
        });
      }
    }

    // Validate spice level
    if (data.spice_level) {
      const spiceLevel = data.spice_level as string;
      if (spiceLevel !== '' && !VALID_SPICE_LEVELS.includes(spiceLevel as any)) {
        errors.push({
          row: rowIndex,
          field: 'spice_level',
          message: `Invalid spice level: "${spiceLevel}". Valid options: ${VALID_SPICE_LEVELS.join(', ')}`,
          value: spiceLevel
        });
      }
    }

    // Validate price vs discount_price
    if (data.discount_price && data.discount_price !== '') {
      const price = parseFloat(data.price);
      const discountPrice = parseFloat(data.discount_price);
      
      if (discountPrice >= price) {
        warnings.push(`Row ${rowIndex}: Discount price ($${discountPrice}) should be less than regular price ($${price}) for "${data.item_name}"`);
      }
      
      if (discountPrice <= 0) {
        errors.push({
          row: rowIndex,
          field: 'discount_price',
          message: 'Discount price must be greater than 0',
          value: data.discount_price
        });
      }
    }

    // Validate price is positive
    const price = parseFloat(data.price);
    if (price <= 0) {
      errors.push({
        row: rowIndex,
        field: 'price',
        message: 'Price must be greater than 0',
        value: data.price
      });
    }

    // Validate description length
    if (data.description.length < 10) {
      warnings.push(`Row ${rowIndex}: Description for "${data.item_name}" is very short (${data.description.length} chars). Consider adding more details.`);
    }

    // Validate category name consistency
    if (data.category_name.trim() !== data.category_name) {
      warnings.push(`Row ${rowIndex}: Category name has leading/trailing whitespace. This will be trimmed.`);
    }

    return { errors, warnings };
  }

  /**
   * Process valid data into categories and menu items
   */
  private static processValidData(validRows: (CsvMenuItemRow & { rowIndex: number })[]): ProcessedImportData {
    const categoryMap = new Map<string, ProcessedCategory & { items: ProcessedMenuItem[] }>();
    
    validRows.forEach(row => {
      const categoryName = row.category_name.trim();
      const categoryKey = categoryName.toLowerCase();
      
      // Get or create category
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          name: categoryName,
          slug: this.generateSlug(categoryName),
          description: row.category_description || undefined,
          sort_order: row.sort_order ? parseInt(row.sort_order) : 0,
          is_active: true,
          is_featured: false,
          items: []
        });
      }
      
      const category = categoryMap.get(categoryKey)!;
      
      // Process allergens
      const allergens = row.allergens 
        ? row.allergens.split(',').map(a => a.trim().toLowerCase()).filter(a => a)
        : [];
      
      // Process featured flag
      const isFeatured = row.is_featured 
        ? ['true', 'TRUE', '1'].includes(row.is_featured.trim())
        : false;
      
      // Create menu item
      const menuItem: ProcessedMenuItem = {
        name: row.item_name.trim(),
        slug: this.generateSlug(row.item_name),
        description: row.description.trim(),
        long_description: row.long_description?.trim() || undefined,
        price: parseFloat(row.price),
        discount_price: row.discount_price && row.discount_price !== '' ? parseFloat(row.discount_price) : undefined,
        ingredients: row.ingredients?.trim() || undefined,
        allergens,
        spice_level: row.spice_level || undefined,
        preparation_time: row.preparation_time?.trim() || undefined,
        serving_size: row.serving_size?.trim() || undefined,
        is_active: true,
        is_featured: isFeatured
      };
      
      category.items.push(menuItem);
    });
    
    const categories = Array.from(categoryMap.values());
    const totalItems = validRows.length;
    const totalCategories = categories.length;
    
    return {
      categories,
      totalItems,
      totalCategories
    };
  }

  /**
   * Generate URL-friendly slug from text
   */
  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Generate sample CSV content for download
   */
  static generateSampleCsv(): string {
    const headers = [
      'category_name',
      'item_name', 
      'description',
      'price',
      'long_description',
      'discount_price',
      'ingredients',
      'allergens',
      'spice_level',
      'preparation_time',
      'serving_size',
      'is_featured',
      'category_description',
      'sort_order'
    ];
    
    const sampleRows = [
      [
        'Appetizers',
        'Bruschetta',
        'Fresh tomatoes with basil on toasted bread',
        '12.50',
        'Our signature bruschetta made with vine-ripened tomatoes',
        '',
        'Tomatoes, basil, garlic, olive oil',
        'gluten',
        'mild',
        '10 minutes',
        '2 pieces',
        'true',
        'Start your meal with our delicious appetizers',
        '1'
      ],
      [
        'Main Courses',
        'Margherita Pizza',
        'Classic pizza with tomato and mozzarella',
        '18.50',
        'Traditional Neapolitan-style pizza',
        '16.50',
        'Tomato sauce, mozzarella, basil',
        'dairy',
        '',
        '20 minutes',
        '1 pizza',
        'true',
        'Our carefully crafted main dishes',
        '1'
      ]
    ];
    
    return [headers.join(','), ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
  }

  /**
   * Get validation rules and help text for users
   */
  static getValidationInfo(): {
    requiredFields: string[];
    optionalFields: string[];
    validAllergens: readonly string[];
    validSpiceLevels: readonly string[];
    notes: string[];
  } {
    return {
      requiredFields: ['category_name', 'item_name', 'description', 'price'],
      optionalFields: [
        'long_description',
        'discount_price',
        'ingredients',
        'allergens',
        'spice_level',
        'preparation_time',
        'serving_size',
        'is_featured',
        'category_description',
        'sort_order'
      ],
      validAllergens: VALID_ALLERGENS,
      validSpiceLevels: VALID_SPICE_LEVELS,
      notes: [
        'Prices must be positive decimal numbers (e.g., 15.50)',
        'Discount price must be less than regular price',
        'Allergens should be comma-separated from the valid list',
        'Spice level must be one of: mild, medium, hot, very-hot',
        'is_featured accepts: true, false, 1, 0',
        'Items will be ordered by their appearance in the CSV within each category',
        'Categories with the same name will be merged together'
      ]
    };
  }
}

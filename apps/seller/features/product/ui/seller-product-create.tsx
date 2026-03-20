'use client';

import { useRouter } from 'next/navigation';
import { EntityForm, type FormSchema } from '@homebase/ui';
import { productsApi } from '@homebase/api-client';
import { toast } from 'sonner';

// Product creation schema — in production this comes from cconfig API
const productSchema: FormSchema = {
  fields: [
    { kind: 'simple', name: 'name', label: 'Product Name', type: 'text', required: true, placeholder: 'e.g., Wireless Bluetooth Headphones' },
    { kind: 'simple', name: 'sku', label: 'SKU', type: 'text', required: true, placeholder: 'e.g., WBH-001' },
    { kind: 'simple', name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your product...', colSpan: 2 },
    { kind: 'simple', name: 'categoryId', label: 'Category', type: 'select', required: true, options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Home & Kitchen', value: 'home-kitchen' },
      { label: 'Books', value: 'books' },
      { label: 'Sports', value: 'sports' },
    ]},
    { kind: 'simple', name: 'brandName', label: 'Brand', type: 'text', placeholder: 'e.g., Sony, Samsung' },
    { kind: 'simple', name: 'basePrice', label: 'Selling Price', type: 'number', required: true, validation: { min: 1 }, placeholder: '1299' },
    { kind: 'simple', name: 'mrp', label: 'MRP', type: 'number', required: true, validation: { min: 1 }, placeholder: '1999' },
    { kind: 'simple', name: 'hsnCode', label: 'HSN Code', type: 'text', placeholder: '8518', helpText: 'Required for GST compliance' },
    {
      kind: 'array',
      name: 'variants',
      label: 'Variants',
      addLabel: 'Add Variant',
      itemFields: [
        { kind: 'simple', name: 'name', label: 'Variant Name', type: 'text', required: true, placeholder: 'e.g., Black / 64GB' },
        { kind: 'simple', name: 'sku', label: 'Variant SKU', type: 'text', required: true, placeholder: 'e.g., WBH-001-BLK' },
        { kind: 'simple', name: 'price', label: 'Price', type: 'number', required: true },
        { kind: 'simple', name: 'stockQuantity', label: 'Stock', type: 'number', required: true },
      ],
    },
    { kind: 'simple', name: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'wireless, bluetooth, headphones', colSpan: 2 },
  ],
};

export function SellerProductCreate() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500">List a new product on HomeBase marketplace</p>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-6">
        <EntityForm
          schema={productSchema}
          submitLabel="Submit for Review"
          sections={[
            { title: 'Basic Information', fieldNames: ['name', 'sku', 'description'] },
            { title: 'Category & Brand', fieldNames: ['categoryId', 'brandName'] },
            { title: 'Pricing', description: 'Set your selling price and MRP', fieldNames: ['basePrice', 'mrp', 'hsnCode'] },
            { title: 'Variants', description: 'Add size, color, or other variations', fieldNames: ['variants'] },
            { title: 'Additional', fieldNames: ['tags'] },
          ]}
          onSubmit={async (data) => {
            try {
              const result = await productsApi.create(data as Record<string, unknown>);
              toast.success('Product created! It will be reviewed before going live.');
              router.push(`/products/${result.mutatedEntity.id}`);
            } catch {
              toast.error('Failed to create product');
            }
          }}
        />
      </div>
    </div>
  );
}

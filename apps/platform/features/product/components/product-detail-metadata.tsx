import { formatNumber } from '@homebase/shared';
import type { ProductDetailData } from '../types';

interface ProductDetailMetadataProps {
  product: ProductDetailData;
}

export function ProductDetailMetadata({ product }: ProductDetailMetadataProps) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5" aria-label="Product metadata">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Metadata</h3>
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Product ID</dt><dd className="rounded bg-gray-50 px-2 py-0.5 font-mono text-xs">{product.productId}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd className="font-medium text-green-600">{product.status}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Created</dt><dd>{product.createdDate}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Last Updated</dt><dd>{product.lastUpdated}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Views</dt><dd>{formatNumber(product.views)}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Orders</dt><dd>{product.orders}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Returns</dt><dd>{product.returns} ({product.returnRate})</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">GST</dt><dd>{product.gstPercent}%</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">HSN Code</dt><dd className="font-mono text-xs">{product.hsnCode}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Weight</dt><dd>{product.weight}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Dimensions</dt><dd>{product.dimensions}</dd></div>
      </dl>
    </section>
  );
}

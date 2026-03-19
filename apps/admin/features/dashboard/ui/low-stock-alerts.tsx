'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { AlertTriangle } from 'lucide-react';
import { useLowStockAlerts } from '../api/queries';

export function LowStockAlerts() {
  const { data: lowStock } = useLowStockAlerts();

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" />Low Stock Alerts</CardTitle></CardHeader>
      <CardContent>
        {lowStock?.length ? (
          <div className="space-y-3">
            {lowStock.slice(0, 5).map((item) => (
              <div key={item.productId} className="flex items-center justify-between rounded p-2 text-sm">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
                <span className={`font-bold ${item.currentStock === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                  {item.currentStock} left
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No low stock alerts</p>
        )}
      </CardContent>
    </Card>
  );
}

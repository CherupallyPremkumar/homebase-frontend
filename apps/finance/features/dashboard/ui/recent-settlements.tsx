'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { StateBadge, formatPriceRupees, formatDate } from '@homebase/shared';
import { useRecentSettlements } from '../api/queries';

export function RecentSettlements() {
  const { data: settlements } = useRecentSettlements(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Settlements
          <Link href="/settlements" className="text-sm font-normal text-primary hover:underline">
            View all
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {settlements?.length ? (
          <div className="space-y-3">
            {settlements.map((settlement) => (
              <Link
                key={settlement.id}
                href={`/settlements/${settlement.id}`}
                className="flex items-center justify-between rounded p-2 text-sm hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{settlement.supplierName || settlement.supplierId}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(settlement.periodStart)} &mdash; {formatDate(settlement.periodEnd)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatPriceRupees(settlement.netPayout)}</span>
                  <StateBadge state={settlement.stateId} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent settlements</p>
        )}
      </CardContent>
    </Card>
  );
}

import { UserCircle } from 'lucide-react';
import { mockReviewerInfo } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'Reviewer Assignment',
  assignedAt: 'Assigned',
  queuePosition: 'Queue Position',
  avgReviewTime: 'Avg. Review Time',
  reassign: 'Reassign Reviewer',
} as const;

export function ReviewAssignment() {
  const reviewer = mockReviewerInfo;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <UserCircle className="h-5 w-5 text-blue-500" />
        <h4 className="text-sm font-semibold text-gray-900">{TEXT.title}</h4>
      </div>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {reviewer.avatar}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{reviewer.name}</p>
          <p className="text-xs text-gray-400">{reviewer.title}</p>
        </div>
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">{TEXT.assignedAt}</dt><dd className="text-xs">{new Date(reviewer.assignedAt).toLocaleString('en-IN')}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">{TEXT.queuePosition}</dt><dd>#{reviewer.queuePosition}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">{TEXT.avgReviewTime}</dt><dd>{reviewer.avgReviewTime}</dd></div>
      </dl>
      <button className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
        {TEXT.reassign}
      </button>
    </div>
  );
}

import { RefreshCw, AlertTriangle } from 'lucide-react';
import { mockSubmissionInfo } from '../services/product-detail-state-mock';

const TEXT = {
  title: 'Submission History',
  attempt: 'Submission',
  previousRejection: 'Previous Rejection',
  threeRejectionsWarning: '3+ rejections will trigger seller performance review',
} as const;

export function ReviewSubmissionHistory() {
  const info = mockSubmissionInfo;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <RefreshCw className="h-5 w-5 text-gray-500" />
        <h4 className="text-sm font-semibold text-gray-900">{TEXT.title}</h4>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        #{info.attemptNumber} <span className="text-sm font-medium text-gray-400">{TEXT.attempt}</span>
      </p>
      {info.previousRejection && (
        <div className="mt-3 rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-500">{TEXT.previousRejection}</p>
          <p className="mt-1 text-xs text-gray-600">{info.previousRejection.reason}</p>
          <p className="mt-1 text-[10px] text-gray-400">{info.previousRejection.date}</p>
        </div>
      )}
      {info.attemptNumber >= 2 && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <p className="text-[10px] text-amber-700">{TEXT.threeRejectionsWarning}</p>
        </div>
      )}
    </div>
  );
}

import { cn } from '../lib/utils';
import { formatDate } from './format';

interface Activity {
  name: string;
  comment?: string;
  timestamp: string;
  performedBy?: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
  className?: string;
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  if (!activities.length) {
    return <p className="text-sm text-gray-400">No activity yet</p>;
  }

  return (
    <ol className={cn('space-y-4', className)} role="list">
      {activities.map((activity, i) => (
        <li key={i} className="flex gap-3">
          <div className="relative flex flex-col items-center">
            <div className={cn(
              'h-2.5 w-2.5 rounded-full',
              i === 0 ? 'bg-primary-500' : 'bg-gray-300',
            )} />
            {i < activities.length - 1 && (
              <div className="w-px flex-1 bg-gray-200" />
            )}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-gray-900">{activity.name}</p>
            {activity.comment && <p className="mt-0.5 text-sm text-gray-500">{activity.comment}</p>}
            <p className="mt-0.5 text-xs text-gray-400">
              {formatDate(activity.timestamp)}
              {activity.performedBy && ` \u00b7 ${activity.performedBy}`}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

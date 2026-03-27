import { SectionSkeleton } from '@homebase/shared';

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <SectionSkeleton variant="card" rows={3} />
      <SectionSkeleton variant="list" rows={4} />
    </div>
  );
}

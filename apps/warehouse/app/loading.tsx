import { SectionSkeleton } from '@homebase/shared';

export default function Loading() {
  return (
    <div className="space-y-4">
      <SectionSkeleton variant="card" rows={2} />
      <SectionSkeleton variant="list" rows={4} />
    </div>
  );
}

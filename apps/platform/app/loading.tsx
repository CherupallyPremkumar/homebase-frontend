import { SectionSkeleton } from '@homebase/shared';

export default function Loading() {
  return (
    <div className="space-y-6">
      <SectionSkeleton variant="list" rows={1} />
      <SectionSkeleton variant="table" rows={5} />
    </div>
  );
}

import { SectionSkeleton } from '@homebase/shared';

export default function Loading() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <SectionSkeleton variant="card" rows={4} />
      <SectionSkeleton variant="list" rows={3} />
    </div>
  );
}

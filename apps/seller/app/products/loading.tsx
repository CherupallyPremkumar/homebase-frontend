export default function Loading() {
  return (
    <div className="animate-pulse p-6">
      {/* Title */}
      <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-xl" />)}
      </div>
      {/* Chart placeholder */}
      <div className="h-64 bg-gray-100 rounded-xl mb-8" />
      {/* Table skeleton */}
      <div className="bg-gray-100 rounded-xl h-96" />
    </div>
  );
}

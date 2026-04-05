export default function OrdersLoading() {
  return (
    <div className="animate-pulse space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 rounded bg-gray-100" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 rounded-lg bg-gray-100" />
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>
      </div>
      {/* Related pills */}
      <div className="h-6 w-40 rounded bg-gray-100" />
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[120px] rounded-xl bg-gray-100" />
        ))}
      </div>
      {/* Filter tabs + search */}
      <div className="h-[120px] rounded-xl bg-gray-100" />
      {/* Table */}
      <div className="rounded-xl bg-gray-100">
        <div className="h-12 border-b border-gray-200/50" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-200/30 px-6 py-4">
            <div className="h-4 w-4 rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="h-4 w-28 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <div className="animate-pulse space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-72 rounded bg-gray-100" />
        </div>
        <div className="h-10 w-24 rounded-lg bg-gray-100" />
      </div>
      {/* Related pills */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 w-24 rounded-full bg-gray-100" />
        ))}
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[120px] rounded-xl bg-gray-100" />
        ))}
      </div>
      {/* Table card with tabs */}
      <div className="rounded-xl bg-gray-100">
        {/* Tab row */}
        <div className="flex items-center justify-between border-b border-gray-200/50 px-6 py-4">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-20 rounded bg-gray-200" />
            ))}
          </div>
          <div className="h-9 w-56 rounded-lg bg-gray-200" />
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-200/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div>
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="mt-1 h-3 w-24 rounded bg-gray-200" />
              </div>
            </div>
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <div className="max-w-screen-lg mx-auto px-margin-page py-gap-section min-h-screen">
      {/* Search & Filter Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="w-full md:max-w-md h-[48px] bg-surface-variant animate-pulse rounded-full border border-outline-variant"></div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="w-[120px] h-[40px] bg-surface-variant animate-pulse rounded border border-outline-variant"></div>
          <div className="w-[120px] h-[40px] bg-surface-variant animate-pulse rounded border border-outline-variant"></div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="mb-gap-section">
        <div className="h-10 bg-surface-variant animate-pulse rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-surface-variant animate-pulse rounded w-1/4"></div>
      </div>

      {/* Article List Skeleton */}
      <div className="flex flex-col">
        {[1, 2, 3, 4, 5].map((i) => (
          <article key={i} className="py-gap-component border-b border-outline-variant flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2 w-full pr-4">
                <div className="h-4 bg-surface-variant animate-pulse rounded w-1/4 mb-1"></div>
                <div className="h-8 bg-surface-variant animate-pulse rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-surface-variant animate-pulse rounded w-full"></div>
                <div className="h-4 bg-surface-variant animate-pulse rounded w-5/6"></div>
              </div>
              <div className="hidden sm:block w-[180px] h-[120px] bg-surface-variant animate-pulse rounded-lg flex-shrink-0"></div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="h-4 bg-surface-variant animate-pulse rounded w-16"></div>
              <div className="h-4 bg-surface-variant animate-pulse rounded w-16"></div>
              <div className="h-4 bg-surface-variant animate-pulse rounded w-16"></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

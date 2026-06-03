export default function AdminLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center w-full px-margin-page py-4 border-b border-outline-variant bg-surface sticky top-0 z-20">
        <div className="h-6 w-48 bg-surface-variant animate-pulse rounded"></div>
        <div className="h-10 w-32 bg-surface-variant animate-pulse rounded"></div>
      </header>

      <main className="flex flex-col w-full max-w-admin-max mx-auto px-margin-page py-gap-section gap-gap-section flex-grow">
        {/* Stats Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-outline-variant bg-surface rounded-xl p-4 flex flex-col gap-2">
              <div className="h-4 w-24 bg-surface-variant animate-pulse rounded"></div>
              <div className="h-8 w-16 bg-surface-variant animate-pulse rounded"></div>
            </div>
          ))}
        </section>

        {/* Main Content Area Skeleton */}
        <section className="border border-outline-variant bg-surface rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-32 bg-surface-variant animate-pulse rounded"></div>
            <div className="h-8 w-24 bg-surface-variant animate-pulse rounded"></div>
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full bg-surface-variant/50 animate-pulse rounded border border-outline-variant/50"></div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

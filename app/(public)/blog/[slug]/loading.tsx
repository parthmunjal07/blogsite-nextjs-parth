export default function BlogPostLoading() {
  return (
    <>
      {/* Progress Bar Skeleton */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-surface-variant"></div>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page py-gap-section mt-8 min-h-screen">
        <header className="mb-gap-section flex flex-col gap-gap-component">
          <div className="flex flex-col gap-4">
            {/* Category */}
            <div className="h-4 w-24 bg-surface-variant animate-pulse rounded"></div>
            
            {/* Title */}
            <div className="flex flex-col gap-2">
              <div className="h-10 md:h-12 w-full md:w-3/4 bg-surface-variant animate-pulse rounded"></div>
              <div className="h-10 md:h-12 w-3/4 md:w-1/2 bg-surface-variant animate-pulse rounded"></div>
            </div>

            {/* Excerpt */}
            <div className="h-6 w-full md:w-5/6 bg-surface-variant animate-pulse rounded mt-2"></div>
            
            {/* Font Size Control */}
            <div className="h-8 w-32 bg-surface-variant animate-pulse rounded mt-2"></div>
          </div>
          
          <hr className="border-t border-outline-variant w-full" />
          
          {/* Author Info */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-variant animate-pulse"></div>
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-surface-variant animate-pulse rounded"></div>
              <div className="h-3 w-48 bg-surface-variant animate-pulse rounded"></div>
            </div>
          </div>
        </header>

        {/* Article Body Skeletons */}
        <article className="flex flex-col gap-4 mt-12">
          {/* Paragraphs */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="h-5 w-full bg-surface-variant animate-pulse rounded max-w-[65ch] mx-auto"></div>
            <div className="h-5 w-full bg-surface-variant animate-pulse rounded max-w-[65ch] mx-auto"></div>
            <div className="h-5 w-11/12 bg-surface-variant animate-pulse rounded max-w-[65ch] mx-auto"></div>
            <div className="h-5 w-4/5 bg-surface-variant animate-pulse rounded max-w-[65ch] mx-auto"></div>
          </div>
          
          {/* Image/Blockquote Placeholder */}
          <div className="h-64 w-full bg-surface-variant animate-pulse rounded-xl mb-6 max-w-[65ch] mx-auto"></div>

          <div className="flex flex-col gap-2">
            <div className="h-5 w-full bg-surface-variant animate-pulse rounded max-w-[65ch] mx-auto"></div>
            <div className="h-5 w-10/12 bg-surface-variant animate-pulse rounded max-w-[65ch] mx-auto"></div>
            <div className="h-5 w-full bg-surface-variant animate-pulse rounded max-w-[65ch] mx-auto"></div>
          </div>
        </article>
      </main>
    </>
  );
}

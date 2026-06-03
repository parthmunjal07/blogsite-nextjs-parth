import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page py-gap-section">
      {/* Header */}
      <header className="mb-gap-component">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-gutter">All posts</h1>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-1.5 rounded-full font-label-md text-label-md bg-primary-container text-on-primary-container border border-primary-container transition-colors">All</button>
          <button className="px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">Design</button>
          <button className="px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">Code</button>
          <button className="px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">Culture</button>
          <button className="px-4 py-1.5 rounded-full font-label-md text-label-md bg-surface border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors">Personal</button>
        </div>
      </header>

      {/* Article List */}
      <div className="flex flex-col">
        {/* Article Item 1 */}
        <article className="py-gap-component border-b border-outline-variant flex flex-col gap-3 group">
          <Link href="/blog/architecture-of-intentional-spaces" className="font-body-lg text-body-lg font-medium text-on-surface group-hover:text-primary group-hover:underline decoration-1 underline-offset-4 transition-all">
            The Architecture of Intentional Spaces
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
            Exploring how physical environments shape our cognitive load and why applying architectural principles to digital product design yields more serene, focused user experiences.
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center font-caption text-caption text-on-surface-variant">EA</div>
            <span className="font-label-md text-label-md text-on-surface">Elena Althaus</span>
            <span className="text-outline-variant text-caption">•</span>
            <time className="font-label-md text-label-md text-on-surface-variant">Oct 24, 2023</time>
            <span className="text-outline-variant text-caption">•</span>
            <span className="font-label-md text-label-md text-on-surface-variant">6 min read</span>
            <div className="flex-grow"></div>
            <span className="bg-primary-container text-on-primary-container font-caption text-caption px-2 py-0.5 rounded-full">Design</span>
          </div>
        </article>

        {/* Article Item 2 */}
        <article className="py-gap-component border-b border-outline-variant flex flex-col gap-3 group">
          <Link href="/blog/refactoring-for-clarity" className="font-body-lg text-body-lg font-medium text-on-surface group-hover:text-primary group-hover:underline decoration-1 underline-offset-4 transition-all">
            Refactoring for Clarity, Not Just Speed
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
            A deep dive into why code readability often supersedes raw performance in large-scale applications, and strategies for maintaining semantic integrity over time.
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center font-caption text-caption text-on-surface-variant">MR</div>
            <span className="font-label-md text-label-md text-on-surface">Marcus Reed</span>
            <span className="text-outline-variant text-caption">•</span>
            <time className="font-label-md text-label-md text-on-surface-variant">Oct 18, 2023</time>
            <span className="text-outline-variant text-caption">•</span>
            <span className="font-label-md text-label-md text-on-surface-variant">8 min read</span>
            <div className="flex-grow"></div>
            <span className="bg-primary-container text-on-primary-container font-caption text-caption px-2 py-0.5 rounded-full">Code</span>
          </div>
        </article>

        {/* Article Item 3 */}
        <article className="py-gap-component border-b border-outline-variant flex flex-col gap-3 group">
          <Link href="/blog/silent-erosion-digital-empathy" className="font-body-lg text-body-lg font-medium text-on-surface group-hover:text-primary group-hover:underline decoration-1 underline-offset-4 transition-all">
            The Silent Erosion of Digital Empathy
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
            As platforms optimize for engagement metrics, we risk losing the nuanced human connections that initially made the internet a profound tool for cultural exchange.
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center font-caption text-caption text-on-surface-variant">SJ</div>
            <span className="font-label-md text-label-md text-on-surface">Sarah Jenkins</span>
            <span className="text-outline-variant text-caption">•</span>
            <time className="font-label-md text-label-md text-on-surface-variant">Oct 12, 2023</time>
            <span className="text-outline-variant text-caption">•</span>
            <span className="font-label-md text-label-md text-on-surface-variant">5 min read</span>
            <div className="flex-grow"></div>
            <span className="bg-primary-container text-on-primary-container font-caption text-caption px-2 py-0.5 rounded-full">Culture</span>
          </div>
        </article>

        {/* Article Item 4 */}
        <article className="py-gap-component flex flex-col gap-3 group">
          <Link href="/blog/notes-year-reading-slowly" className="font-body-lg text-body-lg font-medium text-on-surface group-hover:text-primary group-hover:underline decoration-1 underline-offset-4 transition-all">
            Notes on a Year of Reading Slowly
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
            Abandoning speed reading techniques in favor of deep, contemplative engagement with texts changed not only my retention but my fundamental relationship with literature.
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center font-caption text-caption text-on-surface-variant">DW</div>
            <span className="font-label-md text-label-md text-on-surface">David Wei</span>
            <span className="text-outline-variant text-caption">•</span>
            <time className="font-label-md text-label-md text-on-surface-variant">Oct 05, 2023</time>
            <span className="text-outline-variant text-caption">•</span>
            <span className="font-label-md text-label-md text-on-surface-variant">12 min read</span>
            <div className="flex-grow"></div>
            <span className="bg-primary-container text-on-primary-container font-caption text-caption px-2 py-0.5 rounded-full">Personal</span>
          </div>
        </article>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-gap-section pt-gap-component border-t border-outline-variant">
        <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group">
          <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform" data-icon="arrow_left">arrow_left</span>
          Previous
        </button>
        <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group">
          Next
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform" data-icon="arrow_right">arrow_right</span>
        </button>
      </div>
    </main>
  );
}

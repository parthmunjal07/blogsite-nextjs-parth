import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page pt-[120px] pb-gap-section flex flex-col gap-gap-section">
      {/* Hero Section */}
      <section className="text-center flex flex-col gap-4">
        <h1 className="font-display text-display md:font-display md:text-display font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Writing worth reading.</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">A quiet place for deep thoughts, essays, and stories away from the noise.</p>
      </section>

      {/* Category Links */}
      <section className="flex justify-center gap-6 overflow-x-auto py-2 border-b border-outline-variant">
        <Link href="/blog?category=design" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap pb-2">Design</Link>
        <Link href="/blog?category=code" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap pb-2">Code</Link>
        <Link href="/blog?category=culture" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap pb-2">Culture</Link>
        <Link href="/blog?category=personal" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap pb-2">Personal</Link>
      </section>

      {/* Featured Posts */}
      <section className="flex flex-col">
        {/* Post 1 */}
        <article className="py-gap-component border-b border-outline-variant flex flex-col gap-2 group cursor-pointer">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-caption text-caption">Design</span>
            <span className="text-on-surface-variant font-caption text-caption">5 min read</span>
          </div>
          <Link href="/blog/philosophy-of-quiet-interfaces">
            <h2 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">The Philosophy of Quiet Interfaces</h2>
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">Exploring how intentional whitespace and muted palettes can reduce cognitive load and create a more focused reading experience in modern digital products.</p>
        </article>

        {/* Post 2 */}
        <article className="py-gap-component border-b border-outline-variant flex flex-col gap-2 group cursor-pointer">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-caption text-caption">Culture</span>
            <span className="text-on-surface-variant font-caption text-caption">8 min read</span>
          </div>
          <Link href="/blog/digital-minimalism-2024">
            <h2 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Digital Minimalism in 2024</h2>
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">Why stepping away from algorithmic feeds and returning to curated, long-form content is becoming the new luxury in our hyper-connected world.</p>
        </article>

        {/* Post 3 */}
        <article className="py-gap-component border-b border-outline-variant flex flex-col gap-2 group cursor-pointer">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-caption text-caption">Code</span>
            <span className="text-on-surface-variant font-caption text-caption">4 min read</span>
          </div>
          <Link href="/blog/structuring-semantic-html">
            <h2 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Structuring Semantic HTML for Readers</h2>
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">A technical dive into building web pages that prioritize accessibility and screen readers, ensuring that content remains king across all devices.</p>
        </article>
      </section>
    </main>
  );
}

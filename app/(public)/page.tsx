import Link from "next/link";
import { prisma } from "@/lib/prisma";

// SSG for Home page. Next.js App Router defaults to SSG unless dynamic functions are used.
export const revalidate = 3600; // revalidate every hour or keep static

export default async function HomePage() {
  // Fetch real categories and posts at build time (or during revalidation)
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: { posts: { _count: 'desc' } }
  });

  const featuredPosts = await prisma.post.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page pt-[120px] pb-gap-section flex flex-col gap-gap-section">
      {/* Hero Section */}
      <section className="text-center flex flex-col gap-4">
        <h1 className="font-display text-display md:font-display md:text-display font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Writing worth reading.</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">A quiet place for deep thoughts, essays, and stories away from the noise.</p>
      </section>

      {/* Category Links */}
      <section className="flex justify-center gap-6 overflow-x-auto py-2 border-b border-outline-variant">
        {categories.map((cat: any) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap pb-2">
            {cat.name}
          </Link>
        ))}
        {categories.length === 0 && (
          <span className="font-label-md text-label-md text-on-surface-variant pb-2">No categories yet.</span>
        )}
      </section>

      {/* Featured Posts */}
      <section className="flex flex-col">
        {featuredPosts.map((post: any) => (
          <article key={post.id} className="py-gap-component border-b border-outline-variant flex flex-col gap-2 group cursor-pointer">
            <div className="flex items-center gap-3 mb-1">
              {post.category && (
                <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-caption text-caption">
                  {post.category.name}
                </span>
              )}
              {/* Calculating read time roughly based on 200 words per minute */}
              <span className="text-on-surface-variant font-caption text-caption">
                {Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read
              </span>
            </div>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
              {post.excerpt || post.content.substring(0, 150) + "..."}
            </p>
          </article>
        ))}
        {featuredPosts.length === 0 && (
          <div className="py-gap-component text-center text-on-surface-variant">
            No posts published yet.
          </div>
        )}
      </section>
    </main>
  );
}

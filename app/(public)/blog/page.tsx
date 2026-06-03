import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR for blog listing

export default async function BlogPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = typeof searchParams?.page === "string" ? searchParams.page : "1";
  const page = parseInt(pageStr, 10) || 1;
  const categorySlug = typeof searchParams?.category === "string" ? searchParams.category : undefined;

  const take = 10;
  const skip = (page - 1) * take;

  const where = {
    published: true,
    ...(categorySlug && { category: { slug: categorySlug } }),
  };

  const [posts, totalCount, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: { 
        author: true, 
        category: true,
        _count: { select: { comments: true } }
      },
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page py-gap-section">
      {/* Header */}
      <header className="mb-gap-component">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-gutter">All posts</h1>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/blog" 
            className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${!categorySlug ? 'bg-primary-container text-on-primary-container border border-primary-container' : 'bg-surface border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
          >
            All
          </Link>
          {categories.map((cat: any) => (
            <Link 
              key={cat.id}
              href={`/blog?category=${cat.slug}`} 
              className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors ${categorySlug === cat.slug ? 'bg-primary-container text-on-primary-container border border-primary-container' : 'bg-surface border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </header>

      {/* Article List */}
      <div className="flex flex-col">
        {posts.map((post: any) => (
          <article key={post.id} className="py-gap-component border-b border-outline-variant flex flex-col gap-3 group">
            <Link href={`/blog/${post.slug}`} className="font-body-lg text-body-lg font-medium text-on-surface group-hover:text-primary group-hover:underline decoration-1 underline-offset-4 transition-all">
              {post.title}
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
              {post.excerpt || post.content.substring(0, 150) + "..."}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center font-caption text-caption text-on-surface-variant">
                {post.author.username ? post.author.username.substring(0, 2).toUpperCase() : "U"}
              </div>
              <span className="font-label-md text-label-md text-on-surface">{post.author.username || 'Unknown'}</span>
              <span className="text-outline-variant text-caption">•</span>
              <time className="font-label-md text-label-md text-on-surface-variant">
                {post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
              <span className="text-outline-variant text-caption">•</span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                {Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read
              </span>
              
              {/* Engagement Metrics */}
              <div className="flex items-center gap-4 ml-4 text-on-surface-variant font-caption text-caption">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">favorite</span> {post.likeCount}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">chat_bubble</span> {post._count?.comments || 0}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">visibility</span> {post.viewCount}</span>
              </div>
              
              <div className="flex-grow"></div>
              {post.category && (
                <span className="bg-primary-container text-on-primary-container font-caption text-caption px-2 py-0.5 rounded-full">
                  {post.category.name}
                </span>
              )}
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <div className="py-gap-component text-center text-on-surface-variant">
            No posts found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-gap-section pt-gap-component border-t border-outline-variant">
          {page > 1 ? (
            <Link 
              href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group"
            >
              <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform" data-icon="arrow_left">arrow_left</span>
              Previous
            </Link>
          ) : (
            <div /> // Placeholder to push Next to the right
          )}
          
          {page < totalPages && (
            <Link 
              href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group"
            >
              Next
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform" data-icon="arrow_right">arrow_right</span>
            </Link>
          )}
        </div>
      )}
    </main>
  );
}

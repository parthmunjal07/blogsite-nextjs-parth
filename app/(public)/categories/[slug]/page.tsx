import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Metadata } from "next";

// SSG with generateStaticParams
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((cat: any) => ({ slug: cat.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  
  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} Posts - Blogify`,
    description: `Read all posts categorized under ${category.name} on Blogify.`,
  };
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: { author: true }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page py-gap-section">
      <header className="mb-gap-section border-b border-outline-variant pb-gap-component text-center">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-2 capitalize">{category.name}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Posts categorized under {category.name}</p>
      </header>

      <div className="flex flex-col">
        {category.posts.map((post: any) => (
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
            </div>
          </article>
        ))}
        {category.posts.length === 0 && (
          <div className="py-gap-component text-center text-on-surface-variant">
            No posts found in this category.
          </div>
        )}
      </div>
    </main>
  );
}

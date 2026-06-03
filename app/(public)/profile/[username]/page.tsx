import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/lib/auth";

export const revalidate = 60; // ISR

export async function generateStaticParams() {
  const users = await prisma.user.findMany({
    where: { role: { in: ["BLOG_CREATOR", "SUPER_ADMIN"] }, username: { not: null } },
    select: { username: true }
  });
  return users.map((user: any) => ({ username: user.username as string }));
}

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const params = await props.params;
  const user = await prisma.user.findUnique({ where: { username: params.username } });
  
  if (!user) {
    return { title: 'User Not Found' };
  }

  return {
    title: `${user.username} - Blogify Profile`,
    description: user.bio || `Read posts by ${user.username} on Blogify.`,
  };
}

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      },
      _count: {
        select: { posts: { where: { published: true } } }
      }
    }
  });

  if (!user) {
    notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.id === user.id;

  let draftPosts = [];
  let draftCount = 0;

  if (isOwner) {
    draftPosts = await prisma.post.findMany({ 
      where: { authorId: user.id, published: false },
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });
    draftCount = draftPosts.length;
  }

  return (
    <main className="flex-grow w-full px-margin-page py-gap-section max-w-container-max mx-auto mt-8">
      {/* Profile Header */}
      <header className="flex flex-col items-center text-center space-y-gap-component mb-gap-section">
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md font-bold">
          {user.username ? user.username.substring(0, 2).toUpperCase() : "U"}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-headline-md text-headline-md font-normal text-on-surface">{user.username}</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary-container text-on-primary-container text-[11px] font-medium leading-none">
              {user.role === 'SUPER_ADMIN' ? 'Admin' : 'Blog Creator'}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            {user.bio || "Writing about life, tech, and the spaces between."}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 font-caption text-caption text-on-surface-variant">
          <span>{user._count.posts} Posts</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span>Joined {user.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
      </header>

      {/* Action Row - Only for Owner */}
      {isOwner && (
        <div className="flex items-center justify-between border-y border-outline-variant py-4 mb-gap-section">
          <Link href="/admin/posts/new" className="flex items-center gap-2 font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>edit_square</span>
            Write a new post
          </Link>
          <span className="font-label-md text-label-md text-on-surface-variant">Drafts ({draftCount})</span>
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-gap-section">
        {/* Published Section */}
        <section>
          <h2 className="font-label-md text-label-md text-on-surface mb-6 border-b border-outline-variant pb-2">Published</h2>
          <div className="space-y-8">
            {user.posts.map((post: any) => (
              <article key={post.id} className="flex flex-col sm:flex-row gap-6 group cursor-pointer">
                <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-surface-variant border border-outline-variant rounded overflow-hidden relative">
                  {/* Fallback image logic can go here. We'll leave it out since the DB might not have images natively unless in content */}
                  <div className="w-full h-full flex items-center justify-center bg-surface-container text-on-surface-variant font-caption text-caption absolute inset-0">
                    No Cover
                  </div>
                </div>
                <div className="w-full sm:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    {post.category && (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption">
                        {post.category.name}
                      </span>
                    )}
                    <span className="font-caption text-caption text-on-surface-variant">
                      {post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </p>
                </div>
              </article>
            ))}
            {user.posts.length === 0 && (
              <p className="text-on-surface-variant">No published posts yet.</p>
            )}
          </div>
        </section>

        {/* Drafts Section - Only for Owner */}
        {isOwner && draftPosts.length > 0 && (
          <section className="mt-gap-section pt-gap-section border-t border-outline-variant">
            <h2 className="font-label-md text-label-md text-on-surface mb-6 border-b border-outline-variant pb-2">Drafts</h2>
            <div className="space-y-8">
              {draftPosts.map((post: any) => (
                <article key={post.id} className="flex flex-col sm:flex-row gap-6 group">
                  <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-surface-variant border border-outline-variant rounded overflow-hidden relative">
                    <div className="w-full h-full flex items-center justify-center bg-surface-container text-on-surface-variant font-caption text-caption absolute inset-0">
                      Draft
                    </div>
                  </div>
                  <div className="w-full sm:w-2/3 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {post.category && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption">
                            {post.category.name}
                          </span>
                        )}
                        <span className="font-caption text-caption text-on-surface-variant">
                          Last edited: {post.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/posts/${post.id}/edit`} className="font-label-md text-label-md text-primary hover:text-primary-fixed-variant transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                        </Link>
                      </div>
                    </div>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

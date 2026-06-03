import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProgressBar from "@/app/components/ProgressBar";
import EngagementBar from "@/app/components/EngagementBar";
import CommentSection from "@/app/components/CommentSection";
import FontSizeControl from "@/app/components/FontSizeControl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { auth } from "@/lib/auth";

export const revalidate = 30; // ISR

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  });
  return posts.map((post: any) => ({ slug: post.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} - inklog`,
    description: post.excerpt || post.content.substring(0, 160),
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const session = await auth();
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      author: true,
      category: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!post) {
    notFound();
  }

  // Markdown rendering configuration can be customized via ReactMarkdown components mapping
  return (
    <>
      <ProgressBar />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page py-gap-section mt-8">
        {/* Article Header */}
        <header className="mb-gap-section flex flex-col gap-gap-component">
          <div className="flex flex-col gap-4">
            {post.category && (
              <span className="text-primary font-caption text-caption uppercase tracking-wider">{post.category.name}</span>
            )}
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="font-body-lg text-body-lg text-on-surface-variant italic">{post.excerpt}</p>
            )}
            <FontSizeControl />
          </div>
          <hr className="border-t border-outline-variant w-full" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-label-md text-label-md text-on-surface">
              {post.author.username ? post.author.username.substring(0, 2).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface">{post.author.username || 'Unknown'}</span>
              <span className="font-caption text-caption text-on-surface-variant">
                {post.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read
              </span>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article 
          className="font-body-lg text-body-lg text-on-surface flex flex-col gap-gap-component transition-all duration-200" 
          id="post-content-container"
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="font-family-body line-height-reading max-w-[65ch] mx-auto w-full" {...props} />,
              h1: ({node, ...props}) => <h1 className="font-headline-md text-headline-md mt-6 mb-4 max-w-[65ch] mx-auto w-full" {...props} />,
              h2: ({node, ...props}) => <h2 className="font-headline-md text-headline-md mt-6 mb-4 max-w-[65ch] mx-auto w-full" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-primary pl-6 my-4 italic text-on-surface-variant max-w-[65ch] mx-auto w-full" {...props} />,
              code: ({node, inline, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline ? (
                  <div className="bg-surface border-l-4 border-primary p-6 my-4 rounded-r-DEFAULT overflow-x-auto text-sm font-mono text-on-surface-variant border border-y-outline-variant border-r-outline-variant max-w-[65ch] mx-auto w-full">
                    <pre><code className={className} {...props}>{children}</code></pre>
                  </div>
                ) : (
                  <code className="bg-surface-variant px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                )
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        <hr className="border-t border-outline-variant w-full my-gap-section" />

        <EngagementBar postId={post.id} initialLikeCount={post.likeCount} initialViewCount={post.viewCount} />

        <CommentSection 
          postId={post.id} 
          comments={post.comments} 
          isLoggedIn={!!session?.user} 
          isAdmin={session?.user?.role === 'SUPER_ADMIN'} 
        />
      </main>
    </>
  );
}

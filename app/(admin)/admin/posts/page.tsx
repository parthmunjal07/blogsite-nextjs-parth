import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageResource } from "@/lib/rbac";
import { Role } from "@/lib/rbac";
import { redirect } from "next/navigation";

export default async function AdminPostsPage() {
  const session = await auth();
  const role = session?.user?.role as Role | undefined;
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const isCreatorOrAdmin = role === "SUPER_ADMIN" || role === "BLOG_CREATOR";

  if (!isCreatorOrAdmin) {
    return (
      <div className="w-full max-w-admin-max bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 min-h-[calc(100vh-64px)]">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Unauthorized</h1>
        <p className="text-on-surface-variant">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Fetch posts from database
  // Admins see all posts, creators see only their own
  const posts = await prisma.post.findMany({
    where: role === "SUPER_ADMIN" ? {} : { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
    }
  });

  return (
    <div className="w-full max-w-admin-max bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 min-h-[calc(100vh-64px)]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-gap-section gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Posts</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage your blog posts here.</p>
        </div>
        <Link href="/admin/posts/new" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-lg hover:bg-on-primary-container transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          New Post
        </Link>
      </header>

      <section>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant/50">
                <th className="font-label-md text-label-md text-on-surface-variant py-3 pr-4 font-normal w-2/5">Title</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4 font-normal">Status</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4 font-normal text-right">Views</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4 font-normal text-right">Likes</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4 font-normal">Date</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 pl-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md">
              {posts.map((post: any) => (
                <tr key={post.id} className="border-b border-outline-variant/30 hover:bg-surface/50 transition-colors group">
                  <td className="py-4 pr-4 text-on-surface truncate pr-8">
                    {post.title}
                    {role === "SUPER_ADMIN" && (
                      <div className="text-on-surface-variant font-caption text-caption mt-1">
                        By {post.author?.username}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {post.published ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-primary font-caption text-caption bg-primary/10">Published</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-on-surface-variant font-caption text-caption bg-surface-container-high">Draft</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">{post.viewCount}</td>
                  <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">{post.likeCount}</td>
                  <td className="py-4 px-4 text-on-surface-variant whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 pl-4 text-right">
                    {canManageResource(role, userId, post.authorId) && (
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/posts/${post.id}/edit`} className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </Link>
                        <button className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                    No posts found. Create your first post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

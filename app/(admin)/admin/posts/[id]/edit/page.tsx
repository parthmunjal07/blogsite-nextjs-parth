import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PostEditorForm from "@/app/components/admin/PostEditorForm";

export const metadata = {
  title: "Edit Post - Admin Dashboard",
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthenticatedUser();

  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "BLOG_CREATOR")) {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      categoryId: true,
      published: true,
      authorId: true,
    },
  });

  if (!post) {
    redirect("/admin/posts");
  }

  if (post.authorId !== user.id && user.role !== "SUPER_ADMIN") {
    redirect("/admin/posts");
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const initialData = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || "",
    categoryId: post.categoryId || "",
    published: post.published,
  };

  return <PostEditorForm postId={post.id} initialData={initialData} categories={categories} />;
}

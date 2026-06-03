import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PostEditorForm from "@/app/components/admin/PostEditorForm";

export const metadata = {
  title: "New Post - Admin Dashboard",
};

export default async function NewPostPage() {
  const user = await getAuthenticatedUser();

  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "BLOG_CREATOR")) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <PostEditorForm categories={categories} />;
}

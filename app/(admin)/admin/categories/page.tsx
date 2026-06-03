import { prisma } from "@/lib/prisma";
import CategoryManager from "@/app/components/admin/CategoryManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Categories | Admin",
  description: "Create and manage blog categories.",
};

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true }
      }
    }
  });

  return (
    <CategoryManager initialCategories={categories} />
  );
}

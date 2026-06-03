import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories - Blogify",
  description: "Browse all topics and categories on Blogify.",
};

export const revalidate = 60; // ISR every 60 seconds

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          posts: {
            where: { published: true }
          }
        }
      }
    }
  });

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page py-gap-section mt-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
          Categories
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Explore our collection of articles by topic. Find exactly what you're looking for or discover something new.
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            No categories found. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.slug}`}
              className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-surface-container-low border border-outline-variant hover:border-primary hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-[24px]">tag</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold text-center mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h2>
              <p className="font-label-md text-label-md text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full">
                {category._count.posts} {category._count.posts === 1 ? 'article' : 'articles'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

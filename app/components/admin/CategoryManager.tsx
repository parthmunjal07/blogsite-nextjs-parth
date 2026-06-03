"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
};

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    // Auto-generate slug
    setSlug(
      newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!name || !slug) {
      setError("Name and slug are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setSuccess("Category created successfully!");
      setName("");
      setSlug("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">
          Manage Categories
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Create and organize categories for blog posts.
        </p>
      </div>

      {/* Form Section */}
      <section className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">add_circle</span>
          Create New Category
        </h2>

        <form onSubmit={handleCreateCategory} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1 w-full">
            <label htmlFor="name" className="block font-label-md text-label-md text-on-surface mb-1">
              Category Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Technology"
              className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="flex-1 w-full">
            <label htmlFor="slug" className="block font-label-md text-label-md text-on-surface mb-1">
              URL Slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. technology"
              className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface-variant text-on-surface focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-opacity disabled:opacity-50 min-w-[120px] h-[42px] flex items-center justify-center"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : "Create"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-error font-body-md text-body-md bg-error/10 px-4 py-2 rounded-lg border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 text-primary font-body-md text-body-md bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {success}
          </div>
        )}
      </section>

      {/* List Section */}
      <section className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">list</span>
          Existing Categories
        </h2>

        {categories.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant italic py-4">
            No categories found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="flex items-center justify-between p-4 bg-surface border border-outline-variant rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface truncate">
                    {category.name}
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant truncate">
                    /blog/categories/{category.slug}
                  </span>
                </div>
                {category._count !== undefined && (
                  <div className="flex-shrink-0 ml-3 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full">
                    {category._count.posts} posts
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

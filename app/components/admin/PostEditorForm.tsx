"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PostEditorProps = {
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    categoryId?: string;
    published?: boolean;
  };
  categories: { id: string; name: string }[];
};

export default function PostEditorForm({ postId, initialData, categories }: PostEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    categoryId: initialData?.categoryId || "",
    published: initialData?.published || false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlugify = () => {
    if (!formData.slug && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSave = async (published: boolean) => {
    setLoading(true);
    setError(null);
    
    const payload = { ...formData, published };
    if (!payload.categoryId) delete (payload as any).categoryId;

    const url = postId ? `/api/posts/${postId}` : `/api/posts`;
    const method = postId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Task-Focused Editor Header */}
      <header className="flex justify-between items-center w-full px-margin-page py-4 border-b border-outline-variant bg-surface sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center justify-center rounded-full p-1 hover:bg-surface-variant">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Editor Mode</span>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-error text-caption mr-4">{error}</span>}
          <button 
            onClick={() => handleSave(false)}
            disabled={loading}
            className="px-4 py-2 border border-outline-variant rounded text-on-surface hover:bg-surface-variant transition-colors duration-200 font-label-md text-label-md bg-surface disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save draft"}
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-5 py-2 bg-primary text-on-primary rounded hover:bg-surface-tint transition-colors duration-200 font-label-md text-label-md flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span> Publish
          </button>
        </div>
      </header>

      {/* Main Editor Layout */}
      <main className="flex flex-col md:flex-row w-full max-w-admin-max mx-auto px-margin-page py-gap-section gap-gap-section flex-grow">
        
        {/* Left Panel */}
        <section className="w-full md:w-[65%] flex flex-col gap-6 flex-grow shrink-0">
          <div className="relative group">
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleSlugify}
              className="w-full bg-transparent border-0 border-b border-transparent group-hover:border-outline-variant focus:border-primary focus:ring-0 text-headline-lg-mobile font-headline-lg-mobile text-on-surface placeholder:text-on-surface-variant/40 outline-none pb-2 transition-all duration-300" 
              placeholder="Post Title" 
              type="text" 
            />
          </div>
          
          <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption bg-surface-container-low px-3 py-1.5 rounded w-fit border border-outline-variant/30">
            <span className="material-symbols-outlined text-[14px] opacity-70">link</span>
            <span>inklog.com/blog/</span>
            <input 
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="bg-transparent border-0 focus:ring-0 outline-none font-mono text-[13px] p-0 m-0 w-48 text-on-surface placeholder:text-on-surface-variant/40" 
              placeholder="post-title-slug" 
              type="text" 
            />
          </div>

          <div className="flex flex-col flex-grow border border-outline-variant rounded bg-surface-container-lowest overflow-hidden shadow-sm shadow-black/[0.02]">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-2 py-1.5">
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors" title="Formatting not implemented yet">
                  <span className="material-symbols-outlined text-[18px]">format_bold</span>
                </button>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors">
                  <span className="material-symbols-outlined text-[18px]">format_italic</span>
                </button>
                <div className="w-px h-4 bg-outline-variant/50 mx-1"></div>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </button>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors">
                  <span className="material-symbols-outlined text-[18px]">format_quote</span>
                </button>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors">
                  <span className="material-symbols-outlined text-[18px]">code</span>
                </button>
                <div className="w-px h-4 bg-outline-variant/50 mx-1"></div>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors">
                  <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                </button>
              </div>
              
              <div className="flex items-center bg-surface-variant/50 rounded p-0.5 border border-outline-variant/30">
                <button className="px-3 py-1 bg-surface rounded-[2px] shadow-sm text-on-surface font-label-md text-label-md">Write</button>
                <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface rounded-[2px] font-label-md text-label-md transition-colors">Preview</button>
              </div>
            </div>
            
            <textarea 
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full flex-grow min-h-[500px] bg-transparent border-0 focus:ring-0 outline-none p-6 font-body-lg text-body-lg text-on-surface resize-y placeholder:text-on-surface-variant/30" 
              placeholder="Begin writing your next piece (Markdown supported)..."
            ></textarea>
          </div>
        </section>

        {/* Right Panel */}
        <aside className="w-full md:w-[35%] flex flex-col gap-6 shrink-0">
          
          <div className="border border-outline-variant rounded p-5 bg-surface-container-lowest">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/50 pb-2">Publication Status</h3>
            <div 
              onClick={() => setFormData({ ...formData, published: false })}
              className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${!formData.published ? 'bg-surface border-primary' : 'bg-surface border-outline-variant hover:border-primary/50'} group`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full transition-colors ${!formData.published ? 'bg-primary' : 'bg-outline-variant group-hover:bg-primary/50'}`}></div>
                <span className="font-body-md text-body-md text-on-surface">Draft</span>
              </div>
              <span className={`material-symbols-outlined transition-colors ${!formData.published ? 'text-primary' : 'text-outline-variant group-hover:text-primary/50'}`}>
                {!formData.published ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
            </div>
            <div 
              onClick={() => setFormData({ ...formData, published: true })}
              className={`flex items-center justify-between p-3 border rounded mt-2 cursor-pointer transition-colors ${formData.published ? 'bg-surface border-primary' : 'bg-surface border-outline-variant hover:border-primary/50'} group`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full transition-colors ${formData.published ? 'bg-primary' : 'bg-outline-variant group-hover:bg-primary/50'}`}></div>
                <span className="font-body-md text-body-md text-on-surface">Published</span>
              </div>
              <span className={`material-symbols-outlined transition-colors ${formData.published ? 'text-primary' : 'text-outline-variant group-hover:text-primary/50'}`}>
                {formData.published ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
            </div>
          </div>
          
          <div className="border border-outline-variant rounded p-5 bg-surface-container-lowest">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/50 pb-2">Categorization</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-caption text-caption text-on-surface-variant mb-1.5">Primary Category</label>
                <div className="relative">
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full appearance-none bg-surface border border-outline-variant rounded px-3 py-2 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors"
                  >
                    <option value="">Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-outline-variant rounded p-5 bg-surface-container-lowest">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/50 pb-2">Meta &amp; Excerpt</h3>
            <label className="flex justify-between font-caption text-caption text-on-surface-variant mb-1.5">
              <span>Excerpt</span>
              <span className="opacity-50">{formData.excerpt.length}/150</span>
            </label>
            <textarea 
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              maxLength={150}
              className="w-full bg-surface border border-outline-variant rounded p-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-0 outline-none resize-none transition-colors placeholder:text-on-surface-variant/40" 
              placeholder="A brief summary of the post for list views and SEO..." 
              rows={4}
            ></textarea>
          </div>
          
        </aside>
      </main>
    </div>
  );
}

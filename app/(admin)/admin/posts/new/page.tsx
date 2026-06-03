import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Task-Focused Editor Header (Suppresses standard nav) */}
      <header className="flex justify-between items-center w-full px-margin-page py-4 border-b border-outline-variant bg-surface sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center justify-center rounded-full p-1 hover:bg-surface-variant">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Editor Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-caption text-caption text-outline mr-4 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">cloud_done</span> Saved just now
          </span>
          <button className="px-4 py-2 border border-outline-variant rounded text-on-surface hover:bg-surface-variant transition-colors duration-200 font-label-md text-label-md bg-surface">
            Save draft
          </button>
          <button className="px-5 py-2 bg-primary text-on-primary rounded hover:bg-surface-tint transition-colors duration-200 font-label-md text-label-md flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">publish</span> Publish
          </button>
        </div>
      </header>

      {/* Main Editor Layout */}
      <main className="flex flex-col md:flex-row w-full max-w-admin-max mx-auto px-margin-page py-gap-section gap-gap-section flex-grow">
        
        {/* Left Panel: Writing Environment (65%) */}
        <section className="w-full md:w-[65%] flex flex-col gap-6 flex-grow shrink-0">
          {/* Title Input */}
          <div className="relative group">
            <input 
              className="w-full bg-transparent border-0 border-b border-transparent group-hover:border-outline-variant focus:border-primary focus:ring-0 text-headline-lg-mobile font-headline-lg-mobile text-on-surface placeholder:text-on-surface-variant/40 outline-none pb-2 transition-all duration-300" 
              placeholder="Post Title" 
              type="text" 
            />
          </div>
          
          {/* Permalink / Slug */}
          <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption bg-surface-container-low px-3 py-1.5 rounded w-fit border border-outline-variant/30">
            <span className="material-symbols-outlined text-[14px] opacity-70">link</span>
            <span>inklog.com/posts/</span>
            <input 
              className="bg-transparent border-0 focus:ring-0 outline-none font-mono text-[13px] p-0 m-0 w-48 text-on-surface placeholder:text-on-surface-variant/40" 
              placeholder="post-title-slug" 
              type="text" 
            />
          </div>

          {/* Editor Core */}
          <div className="flex flex-col flex-grow border border-outline-variant rounded bg-surface-container-lowest overflow-hidden shadow-sm shadow-black/[0.02]">
            {/* Toolbar & Tabs */}
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-2 py-1.5">
              {/* Formatting Tools */}
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors" title="Bold">
                  <span className="material-symbols-outlined text-[18px]">format_bold</span>
                </button>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors" title="Italic">
                  <span className="material-symbols-outlined text-[18px]">format_italic</span>
                </button>
                <div className="w-px h-4 bg-outline-variant/50 mx-1"></div>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors" title="Link">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </button>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors" title="Quote">
                  <span className="material-symbols-outlined text-[18px]">format_quote</span>
                </button>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors" title="Code">
                  <span className="material-symbols-outlined text-[18px]">code</span>
                </button>
                <div className="w-px h-4 bg-outline-variant/50 mx-1"></div>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded transition-colors" title="List">
                  <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex items-center bg-surface-variant/50 rounded p-0.5 border border-outline-variant/30">
                <button className="px-3 py-1 bg-surface rounded-[2px] shadow-sm text-on-surface font-label-md text-label-md">Write</button>
                <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface rounded-[2px] font-label-md text-label-md transition-colors">Preview</button>
              </div>
            </div>
            
            {/* Textarea */}
            <textarea 
              className="w-full flex-grow min-h-[500px] bg-transparent border-0 focus:ring-0 outline-none p-6 font-body-lg text-body-lg text-on-surface resize-y placeholder:text-on-surface-variant/30" 
              placeholder="Begin writing your next piece..."
            ></textarea>
          </div>
        </section>

        {/* Right Panel: Settings Sidebar (35%) */}
        <aside className="w-full md:w-[35%] flex flex-col gap-6 shrink-0">
          
          {/* Status Panel */}
          <div className="border border-outline-variant rounded p-5 bg-surface-container-lowest">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/50 pb-2">Publication Status</h3>
            <div className="flex items-center justify-between p-3 border border-outline-variant rounded bg-surface cursor-pointer hover:border-primary transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-outline-variant group-hover:bg-primary transition-colors"></div>
                <span className="font-body-md text-body-md text-on-surface">Draft</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">radio_button_checked</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-outline-variant rounded bg-surface mt-2 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="font-body-md text-body-md text-on-surface">Published</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant">radio_button_unchecked</span>
            </div>
          </div>
          
          {/* Categorization Panel */}
          <div className="border border-outline-variant rounded p-5 bg-surface-container-lowest">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/50 pb-2">Categorization</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-caption text-caption text-on-surface-variant mb-1.5">Primary Category</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface border border-outline-variant rounded px-3 py-2 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors">
                    <option>Essays</option>
                    <option>Journal</option>
                    <option>Technical Notes</option>
                    <option>Fiction</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div>
                <label className="block font-caption text-caption text-on-surface-variant mb-1.5">Tags</label>
                <div className="flex items-center border border-outline-variant rounded bg-surface px-2 focus-within:border-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-outline-variant ml-1">sell</span>
                  <input className="w-full bg-transparent border-0 focus:ring-0 outline-none font-body-md text-body-md py-2 text-on-surface placeholder:text-on-surface-variant/50" placeholder="Add a tag..." type="text" />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-variant text-on-surface-variant font-caption text-caption rounded">
                    Architecture 
                    <button className="hover:text-error transition-colors"><span className="material-symbols-outlined text-[12px]">close</span></button>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-variant text-on-surface-variant font-caption text-caption rounded">
                    Design 
                    <button className="hover:text-error transition-colors"><span className="material-symbols-outlined text-[12px]">close</span></button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* SEO / Excerpt Panel */}
          <div className="border border-outline-variant rounded p-5 bg-surface-container-lowest">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/50 pb-2">Meta &amp; Excerpt</h3>
            <label className="flex justify-between font-caption text-caption text-on-surface-variant mb-1.5">
              <span>Excerpt</span>
              <span className="opacity-50">0/150</span>
            </label>
            <textarea 
              className="w-full bg-surface border border-outline-variant rounded p-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-0 outline-none resize-none transition-colors placeholder:text-on-surface-variant/40" 
              placeholder="A brief summary of the post for list views and SEO..." 
              rows={4}
            ></textarea>
          </div>
          
          {/* Featured Image Placeholder */}
          <div className="border border-outline-variant rounded p-5 bg-surface-container-lowest border-dashed flex flex-col items-center justify-center text-center gap-2 py-8 hover:bg-surface-variant/30 transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-[32px] text-outline-variant group-hover:text-primary transition-colors">add_photo_alternate</span>
            <span className="font-label-md text-label-md text-on-surface">Set Featured Image</span>
            <span className="font-caption text-caption text-on-surface-variant">Recommended: 1200x630px</span>
          </div>
          
        </aside>
      </main>
    </div>
  );
}

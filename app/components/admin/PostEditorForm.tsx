"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

type Toast = {
  message: string;
  type: "success" | "error";
  id: number;
};

// ─── Markdown helpers ────────────────────────────────────────────
function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);
  const replacement = selected || placeholder;
  const newText = text.substring(0, start) + before + replacement + after + text.substring(end);

  textarea.value = newText;

  // Place cursor around inserted text
  const cursorStart = start + before.length;
  const cursorEnd = cursorStart + replacement.length;
  textarea.setSelectionRange(cursorStart, cursorEnd);
  textarea.focus();

  return { newText, cursorStart, cursorEnd };
}

function insertLinePrefix(
  textarea: HTMLTextAreaElement,
  prefix: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  // Find the start of the current line
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = text.indexOf("\n", end);
  const actualEnd = lineEnd === -1 ? text.length : lineEnd;
  const selectedLines = text.substring(lineStart, actualEnd);

  const prefixed = selectedLines
    .split("\n")
    .map((line) => prefix + line)
    .join("\n");

  const newText = text.substring(0, lineStart) + prefixed + text.substring(actualEnd);
  textarea.value = newText;
  textarea.setSelectionRange(lineStart, lineStart + prefixed.length);
  textarea.focus();

  return newText;
}

// ─── Main Component ──────────────────────────────────────────────
export default function PostEditorForm({ postId, initialData, categories }: PostEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [published, setPublished] = useState(initialData?.published || false);

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [savedPostId, setSavedPostId] = useState<string | undefined>(postId);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // ── Toast system ──────────────────────────────────────────────
  const showToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // ── Slugify ───────────────────────────────────────────────────
  const slugify = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }, []);

  const handleTitleBlur = () => {
    if (!slug && title) {
      setSlug(slugify(title));
    }
  };

  // ── Word count / reading time ─────────────────────────────────
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // ── Mark unsaved on any change ────────────────────────────────
  useEffect(() => {
    setHasUnsaved(true);
  }, [title, slug, content, excerpt, categoryId, published]);

  // ── Auto-save (draft) every 30s ───────────────────────────────
  useEffect(() => {
    if (!hasUnsaved || !title || !content) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(async () => {
      // Only auto-save as draft, never auto-publish
      await handleSave(false, true);
    }, 30000);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, content, excerpt, categoryId, hasUnsaved]);

  // ── Save / Publish ────────────────────────────────────────────
  const handleSave = async (shouldPublish: boolean, silent = false) => {
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      showToast("Content must be at least 10 characters", "error");
      return;
    }

    const finalSlug = slug || slugify(title);
    if (!finalSlug) {
      showToast("Could not generate slug", "error");
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      content,
      excerpt: excerpt.trim() || undefined,
      categoryId: categoryId || undefined,
      published: shouldPublish,
    };

    const url = savedPostId ? `/api/posts/${savedPostId}` : "/api/posts";
    const method = savedPostId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      const data = await res.json();

      // If this was a new post, remember the ID for future auto-saves
      if (!savedPostId && data.id) {
        setSavedPostId(data.id);
      }
      if (!slug) setSlug(finalSlug);

      setHasUnsaved(false);
      setLastSaved(new Date());

      if (shouldPublish) {
        showToast("Post published successfully!", "success");
        setTimeout(() => {
          router.push("/admin/posts");
          router.refresh();
        }, 1200);
      } else if (!silent) {
        showToast("Draft saved", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Toolbar actions ───────────────────────────────────────────
  const toolbarAction = useCallback(
    (action: string) => {
      const ta = textareaRef.current;
      if (!ta) return;

      let newText = "";

      switch (action) {
        case "bold":
          ({ newText } = wrapSelection(ta, "**", "**", "bold text"));
          break;
        case "italic":
          ({ newText } = wrapSelection(ta, "*", "*", "italic text"));
          break;
        case "link": {
          const sel = ta.value.substring(ta.selectionStart, ta.selectionEnd);
          ({ newText } = wrapSelection(ta, "[", "](https://)", sel || "link text"));
          break;
        }
        case "quote":
          newText = insertLinePrefix(ta, "> ");
          break;
        case "code":
          ({ newText } = wrapSelection(ta, "`", "`", "code"));
          break;
        case "codeblock":
          ({ newText } = wrapSelection(ta, "\n```\n", "\n```\n", "code block"));
          break;
        case "ul":
          newText = insertLinePrefix(ta, "- ");
          break;
        case "ol":
          newText = insertLinePrefix(ta, "1. ");
          break;
        case "h2":
          newText = insertLinePrefix(ta, "## ");
          break;
        case "h3":
          newText = insertLinePrefix(ta, "### ");
          break;
        case "hr":
          {
            const pos = ta.selectionStart;
            const text = ta.value;
            newText = text.substring(0, pos) + "\n---\n" + text.substring(pos);
            ta.value = newText;
            ta.setSelectionRange(pos + 5, pos + 5);
            ta.focus();
          }
          break;
        default:
          return;
      }

      setContent(newText || ta.value);
    },
    []
  );

  // ── Keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;

      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          toolbarAction("bold");
          break;
        case "i":
          e.preventDefault();
          toolbarAction("italic");
          break;
        case "k":
          e.preventDefault();
          toolbarAction("link");
          break;
        case "s":
          e.preventDefault();
          handleSave(false);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolbarAction, title, slug, content, excerpt, categoryId]);

  // ── Toolbar button helper ─────────────────────────────────────
  const ToolBtn = ({ icon, action, label }: { icon: string; action: string; label: string }) => (
    <button
      type="button"
      onClick={() => toolbarAction(action)}
      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/8 rounded transition-colors"
      title={label}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );

  const Divider = () => <div className="w-px h-4 bg-outline-variant/50 mx-0.5 shrink-0" />;

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* ── Toast Container ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-[slideUp_0.3s_ease-out] ${
              toast.type === "success"
                ? "bg-primary text-on-primary"
                : "bg-error text-white"
            }`}
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* ── Sticky Header ── */}
      <header className="flex justify-between items-center w-full px-4 md:px-margin-page py-3 border-b border-outline-variant/50 bg-surface/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full p-1.5 hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-on-surface-variant">
            <span className="font-label-md text-label-md uppercase tracking-wider">Editor</span>
            {hasUnsaved ? (
              <span className="text-caption text-on-surface-variant/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                Unsaved
              </span>
            ) : lastSaved ? (
              <span className="text-caption text-on-surface-variant/60 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                Saved
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="px-3 sm:px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-variant transition-colors font-label-md text-label-md bg-surface disabled:opacity-50"
          >
            <span className="hidden sm:inline">{loading ? "Saving…" : "Save draft"}</span>
            <span className="sm:hidden material-symbols-outlined text-[18px]">save</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-3 sm:px-5 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity font-label-md text-label-md flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            <span className="hidden sm:inline">Publish</span>
          </button>

          {/* Mobile settings toggle */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="lg:hidden p-2 text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded-lg transition-colors"
            title="Post settings"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="flex flex-col lg:flex-row w-full max-w-[1200px] mx-auto flex-grow">
        {/* ── Editor Panel ── */}
        <section className="flex-1 flex flex-col min-w-0 px-4 md:px-8 py-6">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full bg-transparent border-0 text-2xl md:text-3xl font-semibold text-on-surface placeholder:text-on-surface-variant/30 outline-none mb-2 leading-tight"
            placeholder="Post title..."
            type="text"
          />

          {/* Slug */}
          <div className="flex items-center gap-1.5 text-on-surface-variant font-caption text-caption mb-6 overflow-hidden">
            <span className="material-symbols-outlined text-[14px] opacity-50 shrink-0">link</span>
            <span className="opacity-50 shrink-0">blog/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-transparent border-0 outline-none font-mono text-[13px] p-0 m-0 text-on-surface-variant min-w-0 flex-1 placeholder:text-on-surface-variant/30"
              placeholder="post-slug"
              type="text"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between border border-outline-variant/60 rounded-t-lg bg-surface-container-lowest px-1.5 py-1 overflow-x-auto gap-1 shrink-0">
            <div className="flex items-center gap-0.5 shrink-0">
              <ToolBtn icon="format_bold" action="bold" label="Bold (Ctrl+B)" />
              <ToolBtn icon="format_italic" action="italic" label="Italic (Ctrl+I)" />
              <Divider />
              <ToolBtn icon="title" action="h2" label="Heading 2" />
              <ToolBtn icon="format_h3" action="h3" label="Heading 3" />
              <Divider />
              <ToolBtn icon="link" action="link" label="Link (Ctrl+K)" />
              <ToolBtn icon="format_quote" action="quote" label="Blockquote" />
              <ToolBtn icon="code" action="code" label="Inline code" />
              <ToolBtn icon="data_object" action="codeblock" label="Code block" />
              <Divider />
              <ToolBtn icon="format_list_bulleted" action="ul" label="Bullet list" />
              <ToolBtn icon="format_list_numbered" action="ol" label="Numbered list" />
              <ToolBtn icon="horizontal_rule" action="hr" label="Horizontal rule" />
            </div>

            {/* Write / Preview toggle */}
            <div className="flex items-center bg-surface-variant/40 rounded-md p-0.5 shrink-0 ml-2">
              <button
                onClick={() => setActiveTab("write")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === "write"
                    ? "bg-surface text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Write
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === "preview"
                    ? "bg-surface text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Editor / Preview area */}
          <div className="flex-1 border border-t-0 border-outline-variant/60 rounded-b-lg bg-surface-container-lowest overflow-hidden flex flex-col min-h-[400px] md:min-h-[500px]">
            {activeTab === "write" ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full flex-1 bg-transparent border-0 outline-none p-4 md:p-6 font-body-lg text-body-lg text-on-surface resize-none placeholder:text-on-surface-variant/30 leading-relaxed"
                placeholder="Start writing your story... (Markdown supported)"
              />
            ) : (
              <div className="p-4 md:p-6 overflow-auto flex-1 prose prose-stone max-w-none text-on-surface">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                ) : (
                  <p className="text-on-surface-variant/40 italic">Nothing to preview yet...</p>
                )}
              </div>
            )}
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-between mt-2 px-1 text-on-surface-variant/60 font-caption text-caption">
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"} · {readingTime} min read
            </span>
            <span className="opacity-60">Markdown supported</span>
          </div>
        </section>

        {/* ── Settings Panel ── */}
        {/* Desktop: always visible. Mobile: slide-in overlay */}
        <aside
          className={`
            lg:w-[320px] lg:border-l lg:border-outline-variant/50 lg:relative lg:translate-x-0 lg:opacity-100 lg:block
            fixed inset-y-0 right-0 w-[300px] bg-surface border-l border-outline-variant shadow-xl z-30
            transition-all duration-300 ease-in-out
            ${settingsOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none lg:pointer-events-auto"}
          `}
        >
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-between items-center px-5 py-4 border-b border-outline-variant/50">
            <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Settings</span>
            <button
              onClick={() => setSettingsOpen(false)}
              className="p-1 text-on-surface-variant hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-5 p-5 overflow-y-auto max-h-[calc(100vh-64px)]">
            {/* Publication Status */}
            <div className="border border-outline-variant/60 rounded-lg p-4 bg-surface-container-lowest">
              <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] opacity-60">visibility</span>
                Status
              </h3>
              <div
                onClick={() => setPublished(false)}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  !published
                    ? "bg-primary/5 border-primary/50"
                    : "bg-surface border-outline-variant/60 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      !published ? "text-primary" : "text-outline-variant"
                    }`}
                  >
                    {!published ? "radio_button_checked" : "radio_button_unchecked"}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">Draft</span>
                </div>
              </div>
              <div
                onClick={() => setPublished(true)}
                className={`flex items-center justify-between p-3 border rounded-lg mt-2 cursor-pointer transition-all ${
                  published
                    ? "bg-primary/5 border-primary/50"
                    : "bg-surface border-outline-variant/60 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      published ? "text-primary" : "text-outline-variant"
                    }`}
                  >
                    {published ? "radio_button_checked" : "radio_button_unchecked"}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">Published</span>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="border border-outline-variant/60 rounded-lg p-4 bg-surface-container-lowest">
              <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] opacity-60">category</span>
                Category
              </h3>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full appearance-none bg-surface border border-outline-variant/60 rounded-lg px-3 py-2.5 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors cursor-pointer"
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Excerpt */}
            <div className="border border-outline-variant/60 rounded-lg p-4 bg-surface-container-lowest">
              <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] opacity-60">short_text</span>
                Excerpt
              </h3>
              <label className="flex justify-between font-caption text-caption text-on-surface-variant mb-1.5">
                <span>Summary for previews &amp; SEO</span>
                <span className={excerpt.length > 140 ? "text-error" : "opacity-40"}>
                  {excerpt.length}/150
                </span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={150}
                className="w-full bg-surface border border-outline-variant/60 rounded-lg p-3 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-0 outline-none resize-none transition-colors placeholder:text-on-surface-variant/30"
                placeholder="A brief summary of the post..."
                rows={3}
              />
            </div>

            {/* Quick tips */}
            <div className="rounded-lg p-4 bg-surface-variant/30 text-on-surface-variant">
              <h4 className="font-label-md text-label-md mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                Shortcuts
              </h4>
              <ul className="text-caption space-y-1 opacity-70">
                <li><kbd className="px-1 py-0.5 bg-surface rounded text-[11px] border border-outline-variant/50">Ctrl+B</kbd> Bold</li>
                <li><kbd className="px-1 py-0.5 bg-surface rounded text-[11px] border border-outline-variant/50">Ctrl+I</kbd> Italic</li>
                <li><kbd className="px-1 py-0.5 bg-surface rounded text-[11px] border border-outline-variant/50">Ctrl+K</kbd> Insert link</li>
                <li><kbd className="px-1 py-0.5 bg-surface rounded text-[11px] border border-outline-variant/50">Ctrl+S</kbd> Save draft</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Mobile overlay backdrop */}
        {settingsOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSettingsOpen(false)}
          />
        )}
      </main>

      {/* Toast animation */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Basic prose styling for markdown preview */
        .prose h1 { font-size: 2em; font-weight: 700; margin: 1em 0 0.5em; }
        .prose h2 { font-size: 1.5em; font-weight: 600; margin: 1em 0 0.5em; border-bottom: 1px solid var(--color-outline-variant, #ddd); padding-bottom: 0.3em; }
        .prose h3 { font-size: 1.25em; font-weight: 600; margin: 1em 0 0.5em; }
        .prose p { margin: 0.75em 0; line-height: 1.75; }
        .prose ul, .prose ol { padding-left: 1.5em; margin: 0.75em 0; }
        .prose li { margin: 0.25em 0; }
        .prose blockquote { border-left: 3px solid var(--color-primary, #8FA96E); padding: 0.5em 1em; margin: 1em 0; color: var(--color-on-surface-variant, #666); background: var(--color-surface-variant, #f5f5f0); border-radius: 0 6px 6px 0; }
        .prose code { background: var(--color-surface-variant, #f0f0e8); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
        .prose pre { background: #1e1e2e; color: #cdd6f4; padding: 1em; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
        .prose pre code { background: none; padding: 0; color: inherit; }
        .prose a { color: var(--color-primary, #8FA96E); text-decoration: underline; }
        .prose hr { border: none; border-top: 1px solid var(--color-outline-variant, #ddd); margin: 2em 0; }
        .prose img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
        .prose table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .prose th, .prose td { border: 1px solid var(--color-outline-variant, #ddd); padding: 0.5em 0.75em; text-align: left; }
        .prose th { background: var(--color-surface-variant, #f5f5f0); font-weight: 600; }
      `}</style>
    </div>
  );
}

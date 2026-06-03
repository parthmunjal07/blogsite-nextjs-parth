"use client";

import { useState } from "react";
import Link from "next/link";
import { createComment, deleteComment } from "@/app/actions/comments";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: { username: string | null } | null;
  name: string | null;
};

export default function CommentSection({ 
  postId, 
  comments: initialComments,
  isLoggedIn,
  isAdmin
}: { 
  postId: string; 
  comments: Comment[];
  isLoggedIn: boolean;
  isAdmin: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !isLoggedIn) return;
    setIsSubmitting(true);

    try {
      const result = await createComment(postId, content);
      
      if (result.success && result.comment) {
        // Optimistic update
        setComments([{...result.comment, createdAt: new Date(result.comment.createdAt)} as Comment, ...comments]);
        setContent("");
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const result = await deleteComment(commentId, postId);
      if (result.success) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert("Failed to delete comment.");
    }
  };

  return (
    <section className="mt-gap-section">
      <h3 className="font-label-md text-label-md text-on-surface mb-6 uppercase tracking-wider">
        Responses ({comments.length})
      </h3>
      
      {/* Comment Input */}
      {isLoggedIn ? (
        <div className="mb-8 border border-outline-variant rounded-lg bg-surface focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 resize-none p-4 font-body-md text-body-md text-on-surface placeholder:text-outline min-h-[100px] outline-none" 
            placeholder="Add a response..."
            disabled={isSubmitting}
          />
          <div className="flex justify-end p-3 border-t border-outline-variant">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="bg-primary hover:bg-on-primary-fixed-variant disabled:opacity-50 text-on-primary px-4 py-1.5 rounded font-label-md text-label-md transition-colors"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-6 border border-outline-variant rounded-lg bg-surface text-center flex flex-col items-center gap-3">
          <p className="font-body-md text-body-md text-on-surface-variant">Join the conversation</p>
          <Link href="/login" className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-label-md px-6 py-2 rounded transition-colors">
            Login to comment
          </Link>
        </div>
      )}

      {/* Comment List */}
      <div className="flex flex-col gap-6">
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center font-label-md text-label-md text-on-secondary-container">
                {comment.user?.username ? comment.user.username.substring(0, 2).toUpperCase() : (comment.name ? comment.name.substring(0, 2).toUpperCase() : "U")}
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-label-md text-label-md text-on-surface">{comment.user?.username || comment.name || "Unknown"}</span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="text-on-surface-variant hover:text-error transition-colors"
                      title="Delete Comment"
                      aria-label="Delete Comment"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
                <p className="font-body-md text-body-md text-on-surface">{comment.content}</p>
              </div>
            </div>

            {index < comments.length - 1 && (
              <hr className="border-t border-outline-variant w-full opacity-50 mt-6" />
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-on-surface-variant font-body-md text-body-md">No responses yet. Be the first!</p>
        )}
      </div>
    </section>
  );
}

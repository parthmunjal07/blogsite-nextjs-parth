"use client";

import { useState, useEffect } from "react";

export default function EngagementBar({ 
  postId, 
  initialLikeCount, 
  initialViewCount 
}: { 
  postId: string; 
  initialLikeCount: number; 
  initialViewCount: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0: small, 1: base, 2: large

  // Sync Initial Like State
  useEffect(() => {
    let isMounted = true;
    const checkLikedState = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/likes`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setLiked(data.liked);
        }
      } catch (err) {}
    };
    checkLikedState();
    return () => { isMounted = false; };
  }, [postId]);

  // Track View on Mount
  useEffect(() => {
    let isMounted = true;
    const trackView = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/view`, { method: "POST" });
        if (res.ok && isMounted) {
          // Optimistically increment view locally if it's the first time
          const data = await res.json();
          if (data.incremented) {
             setViewCount(prev => prev + 1);
          }
        }
      } catch (err) {
        console.error("Failed to track view", err);
      }
    };
    trackView();

    return () => { isMounted = false; };
  }, [postId]);

  // Load Font Size Preference
  useEffect(() => {
    const saved = localStorage.getItem("blog-font-size");
    if (saved) {
      setFontSizeIndex(parseInt(saved, 10));
    }
  }, []);

  // Apply Font Size
  useEffect(() => {
    const container = document.getElementById("post-content-container");
    if (!container) return;

    if (fontSizeIndex === 0) container.style.fontSize = '16px';
    else if (fontSizeIndex === 1) container.style.fontSize = '18px';
    else container.style.fontSize = '20px';

    localStorage.setItem("blog-font-size", fontSizeIndex.toString());
  }, [fontSizeIndex]);

  const handleLike = async () => {
    const newLikedState = !liked;
    // Optimistic Update
    setLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

    try {
      const res = await fetch(`/api/posts/${postId}/likes`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        // Sync actual count from server to prevent drift
        setLikeCount(data.likeCount);
        setLiked(data.liked);
      } else {
        // Revert on failure
        setLiked(!newLikedState);
        setLikeCount(prev => !newLikedState ? prev + 1 : Math.max(0, prev - 1));
      }
    } catch (err) {
      // Revert on failure
      setLiked(!newLikedState);
      setLikeCount(prev => !newLikedState ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  const adjustFontSize = (direction: number) => {
    setFontSizeIndex(prev => {
      const next = prev + direction;
      if (next < 0) return 0;
      if (next > 2) return 2;
      return next;
    });
  };

  return (
    <div className="flex items-center justify-between py-4 mb-gap-section">
      <div className="flex items-center gap-6">
        <button 
          className="flex items-center gap-2 group text-on-surface-variant hover:text-primary transition-colors" 
          onClick={handleLike}
        >
          <span 
            className={`material-symbols-outlined group-hover:scale-110 transition-transform ${liked ? 'text-primary' : ''}`}
            style={{ fontVariationSettings: liked ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
          >
            favorite
          </span>
          <span className={`font-label-md text-label-md ${liked ? 'text-primary' : ''}`}>
            {likeCount}
          </span>
        </button>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined">visibility</span>
          <span className="font-label-md text-label-md">{viewCount} views</span>
        </div>
      </div>
      <div className="flex items-center gap-2 border border-outline-variant rounded p-1 bg-surface">
        <button aria-label="Decrease font size" className="p-1 text-on-surface-variant hover:text-primary transition-colors" onClick={() => adjustFontSize(-1)}>
          <span className="material-symbols-outlined text-sm">text_decrease</span>
        </button>
        <button aria-label="Increase font size" className="p-1 text-on-surface-variant hover:text-primary transition-colors" onClick={() => adjustFontSize(1)}>
          <span className="material-symbols-outlined text-sm">text_increase</span>
        </button>
      </div>
    </div>
  );
}

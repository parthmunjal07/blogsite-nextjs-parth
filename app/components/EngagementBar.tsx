"use client";

import { useState, useEffect } from "react";

export default function EngagementBar({ 
  postId, 
  initialLikeCount, 
  initialViewCount,
  initialLiked
}: { 
  postId: string; 
  initialLikeCount: number; 
  initialViewCount: number;
  initialLiked: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [viewCount, setViewCount] = useState(initialViewCount);
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
    </div>
  );
}

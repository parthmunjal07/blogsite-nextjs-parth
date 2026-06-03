"use client";

import { useEffect, useState } from "react";

export default function FontSizeControl() {
  const [fontSizeIndex, setFontSizeIndex] = useState(1);
  const [mounted, setMounted] = useState(false);
  const fontSizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("blog-font-size");
    if (saved) {
      setFontSizeIndex(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // When the component mounts or index changes, apply the class to the article container
    const container = document.getElementById("post-content-container");
    if (container) {
      // Remove all previous font size classes
      container.classList.remove(...fontSizes);
      // Add the new one
      container.classList.add(fontSizes[fontSizeIndex]);
    }
    
    localStorage.setItem("blog-font-size", fontSizeIndex.toString());
  }, [fontSizeIndex, mounted]);

  const decreaseFontSize = () => {
    setFontSizeIndex((prev) => Math.max(0, prev - 1));
  };

  const increaseFontSize = () => {
    setFontSizeIndex((prev) => Math.min(fontSizes.length - 1, prev + 1));
  };

  return (
    <div className="flex items-center gap-2 bg-surface-variant/30 rounded-full px-3 py-1.5 border border-outline-variant/50 ml-auto">
      <button 
        onClick={decreaseFontSize}
        disabled={fontSizeIndex === 0}
        className="text-on-surface-variant hover:text-primary disabled:opacity-50 transition-colors flex items-center justify-center p-1"
        aria-label="Decrease font size"
      >
        <span className="material-symbols-outlined text-[16px]">text_decrease</span>
      </button>
      
      <span className="font-caption text-caption text-on-surface w-4 text-center">
        {fontSizeIndex + 1}
      </span>
      
      <button 
        onClick={increaseFontSize}
        disabled={fontSizeIndex === fontSizes.length - 1}
        className="text-on-surface-variant hover:text-primary disabled:opacity-50 transition-colors flex items-center justify-center p-1"
        aria-label="Increase font size"
      >
        <span className="material-symbols-outlined text-[16px]">text_increase</span>
      </button>
    </div>
  );
}

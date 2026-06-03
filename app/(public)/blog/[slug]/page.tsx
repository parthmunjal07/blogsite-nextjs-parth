"use client";

import { useEffect, useState } from "react";

export default function BlogPostPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(342);
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0: small, 1: base, 2: large

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
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

  const getFontSizeStyle = () => {
    if (fontSizeIndex === 0) return '16px';
    if (fontSizeIndex === 1) return '18px';
    return '20px';
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60] bg-surface-variant">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-page py-gap-section mt-8">
        {/* Article Header */}
        <header className="mb-gap-section flex flex-col gap-gap-component">
          <div className="flex flex-col gap-4">
            <span className="text-primary font-caption text-caption uppercase tracking-wider">Design Theory</span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">The Architecture of Silence: Designing for Focus in a Noisy Web</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant italic">Why removing elements is often more impactful than adding them, and how quiet luxury principles apply to digital interfaces.</p>
          </div>
          <hr className="border-t border-outline-variant w-full" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-label-md text-label-md text-on-surface">
              EK
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface">Elena Kosta</span>
              <span className="font-caption text-caption text-on-surface-variant">Oct 24, 2024 • 6 min read</span>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article 
          className="font-body-lg text-body-lg text-on-surface flex flex-col gap-gap-component transition-all duration-200" 
          style={{ fontSize: getFontSizeStyle() }}
        >
          <p>
            In contemporary digital product design, we often suffer from horror vacui—the fear of empty space. We fill dashboards with widgets, navigation bars with tertiary links, and sidebars with algorithmic recommendations. The result is a cognitive load that exhausts the user before they have accomplished a single task.
          </p>
          <p>
            The alternative is not minimalism for the sake of an aesthetic, but structural restraint. By treating negative space as a first-class component, we allow the primary content to breathe. This approach is rooted in editorial design, where the margins are just as important as the text block itself.
          </p>
          
          <blockquote className="border-l-2 border-primary pl-6 my-4 italic text-on-surface-variant">
            &quot;Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.&quot; — Antoine de Saint-Exupéry
          </blockquote>
          
          <p>
            Consider the implementation of typographical hierarchy. When designing a reading experience, the contrast between structural elements must be deliberate.
          </p>
          
          <div className="bg-surface border-l-4 border-primary p-6 my-4 rounded-r-DEFAULT overflow-x-auto text-sm font-mono text-on-surface-variant border border-y-outline-variant border-r-outline-variant">
            <pre><code>{`/* A quiet typography configuration */
:root {
  --font-body: 'Inter', sans-serif;
  --line-height-reading: 1.75;
  --measure-optimal: 65ch;
}

article p {
  font-family: var(--font-body);
  line-height: var(--line-height-reading);
  max-width: var(--measure-optimal);
  margin-inline: auto;
}`}</code></pre>
          </div>
          
          <p>
            The code above establishes a boundary. It dictates that text should not span the full width of a large monitor, preventing the eye from losing its place when tracking from the end of one line to the beginning of the next. It is a quiet intervention that significantly improves stamina.
          </p>
          <p>
            Ultimately, our goal as designers of these spaces is to step out of the way. The interface should be a silent frame, allowing the written word to resonate without competition.
          </p>
        </article>

        <hr className="border-t border-outline-variant w-full my-gap-section" />

        {/* Engagement Bar */}
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
              <span className="font-label-md text-label-md">1.2k views</span>
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

        {/* Comments Section */}
        <section className="mt-gap-section">
          <h3 className="font-label-md text-label-md text-on-surface mb-6 uppercase tracking-wider">Responses (2)</h3>
          
          {/* Comment Input */}
          <div className="mb-8 border border-outline-variant rounded-lg bg-surface focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow">
            <textarea className="w-full bg-transparent border-none focus:ring-0 resize-none p-4 font-body-md text-body-md text-on-surface placeholder:text-outline min-h-[100px]" placeholder="Add a response..."></textarea>
            <div className="flex justify-end p-3 border-t border-outline-variant">
              <button className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary px-4 py-1.5 rounded font-label-md text-label-md transition-colors">
                Post
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="flex flex-col gap-6">
            {/* Comment 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center font-label-md text-label-md text-on-secondary-container">
                JD
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-label-md text-label-md text-on-surface">Julianne Doe</span>
                  <span className="font-caption text-caption text-on-surface-variant">2 hours ago</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface">This perfectly articulates the frustration with modern reading experiences. The constant fight against popups and sticky headers just to read a few paragraphs is exhausting.</p>
              </div>
            </div>

            <hr className="border-t border-outline-variant w-full opacity-50" />

            {/* Comment 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-tertiary-container flex-shrink-0 flex items-center justify-center font-label-md text-label-md text-on-tertiary-container">
                MR
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-label-md text-label-md text-on-surface">Marcus R.</span>
                  <span className="font-caption text-caption text-on-surface-variant">5 hours ago</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface">I appreciate the mention of optimal line measures. It&apos;s a fundamental typographic rule that gets thrown out the window in fluid web design unless specifically enforced.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

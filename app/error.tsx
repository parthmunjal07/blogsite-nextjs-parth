"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-page py-gap-section text-center">
      <div className="bg-error-container text-on-error-container p-6 rounded-2xl max-w-[500px] w-full border border-error/20">
        <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
        <h2 className="text-display-sm font-display-sm mb-2 text-on-surface">Something went wrong!</h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant mb-6">
          We encountered an unexpected error while processing your request. Our team has been notified.
        </p>
        <button
          onClick={() => reset()}
          className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg hover:bg-surface-tint transition-colors shadow-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

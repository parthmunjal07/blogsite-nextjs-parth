import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-page py-gap-section text-center">
      <span className="material-symbols-outlined text-[64px] text-outline mb-4">person_off</span>
      <h2 className="text-display-sm font-display-sm mb-2 text-on-surface">Profile Not Found</h2>
      <p className="text-body-lg font-body-lg text-on-surface-variant mb-8 max-w-[500px]">
        We couldn't find a user with this username. They might have changed their username or deleted their account.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/blog"
          className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-lg hover:bg-surface-tint transition-colors shadow-sm"
        >
          Read Articles
        </Link>
        <Link 
          href="/"
          className="bg-surface text-on-surface border border-outline-variant px-6 py-3 rounded-full font-label-lg hover:bg-surface-variant transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

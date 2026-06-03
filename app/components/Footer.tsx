import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface dark:bg-surface border-t border-outline-variant dark:border-outline mt-gap-section full-width">
      <div className="flex flex-col md:flex-row justify-between items-center w-full py-margin-page px-margin-page max-w-container-max mx-auto gap-4">
        <div className="font-label-md text-label-md font-bold text-on-surface">
          inklog © 2024 • built with care
        </div>
        <nav className="flex gap-gutter items-center">
          <Link href="/privacy" className="font-caption text-caption text-secondary dark:text-secondary-fixed hover:text-primary dark:hover:text-primary-fixed transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="font-caption text-caption text-secondary dark:text-secondary-fixed hover:text-primary dark:hover:text-primary-fixed transition-colors">
            Terms
          </Link>
          <Link href="/rss" className="font-caption text-caption text-secondary dark:text-secondary-fixed hover:text-primary dark:hover:text-primary-fixed transition-colors">
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}

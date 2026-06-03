"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-surface dark:bg-surface border-b border-outline-variant dark:border-outline docked full-width top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-page py-4 max-w-admin-max mx-auto">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-on-surface dark:text-on-surface">
          inklog
        </Link>
        <nav className="hidden md:flex gap-gutter items-center">
          <Link 
            href="/blog" 
            className={`font-body-md text-body-md transition-opacity pb-1 ${
              pathname?.startsWith('/blog') 
                ? 'text-primary dark:text-primary-fixed font-bold border-b-2 border-primary opacity-80' 
                : 'text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200'
            }`}
          >
            Blog
          </Link>
          <Link 
            href="/categories" 
            className={`font-body-md text-body-md transition-opacity pb-1 ${
              pathname?.startsWith('/categories') 
                ? 'text-primary dark:text-primary-fixed font-bold border-b-2 border-primary opacity-80' 
                : 'text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200'
            }`}
          >
            Categories
          </Link>
          <Link 
            href="/profile" 
            className={`font-body-md text-body-md transition-opacity pb-1 ${
              pathname?.startsWith('/profile') 
                ? 'text-primary dark:text-primary-fixed font-bold border-b-2 border-primary opacity-80' 
                : 'text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200'
            }`}
          >
            Profile
          </Link>
        </nav>
        <button className="hidden md:flex items-center justify-center bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity">
          Write
        </button>
        {/* Mobile Menu Trigger (Simplified for static view) */}
        <button className="md:hidden text-on-surface">
          <span className="material-symbols-outlined" data-icon="menu">menu</span>
        </button>
      </div>
    </header>
  );
}

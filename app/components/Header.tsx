"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

export function Header({ session }: { session?: Session | null }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isLoggedIn = !!session?.user;
  const role = session?.user?.role || "PUBLIC_VIEWER";
  
  // Extract initial for avatar
  const initial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="bg-surface dark:bg-surface border-b border-outline-variant dark:border-outline docked full-width top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-page py-4 max-w-admin-max mx-auto">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-on-surface dark:text-on-surface">
          Blogify
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
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="font-label-md text-label-md text-primary hover:opacity-80 transition-opacity">
                Login
              </Link>
              <Link href="/register" className="border border-primary text-white bg-on-primary-container px-4 py-2 rounded font-label-md text-label-md hover:bg-primary-fixed-dim hover:border-primary-fixed-dim hover:text-black transition-colors">
                Register
              </Link>
            </>
          ) : (
            <>
              {(role === "BLOG_CREATOR" || role === "SUPER_ADMIN") && (
                <Link href="/admin/posts/new" className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity">
                  Write
                </Link>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container text-on-primary-container font-bold hover:opacity-90 transition-opacity focus:outline-none"
                >
                  {initial}
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface dark:bg-surface border border-outline-variant dark:border-outline rounded shadow-lg flex flex-col py-2 z-50">
                    <Link href="/admin/profile" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-body-md hover:bg-surface-variant dark:hover:bg-surface-variant transition-colors">
                      Profile
                    </Link>
                    
                    {role === "BLOG_CREATOR" && (
                      <Link href="/admin/posts" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-body-md hover:bg-surface-variant dark:hover:bg-surface-variant transition-colors">
                        My Drafts
                      </Link>
                    )}

                    {role === "SUPER_ADMIN" && (
                      <>
                        <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-body-md hover:bg-surface-variant dark:hover:bg-surface-variant transition-colors">
                          Admin Dashboard
                        </Link>
                        <Link href="/admin/users" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 text-body-md hover:bg-surface-variant dark:hover:bg-surface-variant transition-colors">
                          Manage Users
                        </Link>
                      </>
                    )}

                    <button onClick={() => signOut()} className="px-4 py-2 text-body-md text-left text-error hover:bg-surface-variant dark:hover:bg-surface-variant transition-colors w-full">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="md:hidden text-on-surface"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined" data-icon="menu">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant dark:border-outline bg-surface dark:bg-surface px-margin-page py-4 flex flex-col gap-4 shadow-lg">
          <Link 
            href="/blog" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-body-md text-body-md ${
              pathname?.startsWith('/blog') 
                ? 'text-primary dark:text-primary-fixed font-bold' 
                : 'text-on-surface-variant dark:text-on-surface-variant'
            }`}
          >
            Blog
          </Link>
          <Link 
            href="/categories" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-body-md text-body-md ${
              pathname?.startsWith('/categories') 
                ? 'text-primary dark:text-primary-fixed font-bold' 
                : 'text-on-surface-variant dark:text-on-surface-variant'
            }`}
          >
            Categories
          </Link>

          {!isLoggedIn ? (
            <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-outline-variant dark:border-outline">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-label-md text-label-md text-primary">
                Login
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="border border-primary text-primary px-4 py-2 rounded font-label-md text-label-md text-center">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-2 pt-4 border-t border-outline-variant dark:border-outline">
              <Link href="/admin/profile" onClick={() => setIsMobileMenuOpen(false)} className="font-body-md text-body-md text-on-surface-variant">
                Profile
              </Link>
              
              {role === "BLOG_CREATOR" && (
                <Link href="/admin/posts" onClick={() => setIsMobileMenuOpen(false)} className="font-body-md text-body-md text-on-surface-variant">
                  My Drafts
                </Link>
              )}

              {role === "SUPER_ADMIN" && (
                <>
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="font-body-md text-body-md text-on-surface-variant">
                    Admin Dashboard
                  </Link>
                  <Link href="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className="font-body-md text-body-md text-on-surface-variant">
                    Manage Users
                  </Link>
                </>
              )}

              {(role === "BLOG_CREATOR" || role === "SUPER_ADMIN") && (
                <Link href="/admin/posts/new" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md text-center">
                  Write
                </Link>
              )}
              
              <button onClick={() => signOut()} className="font-body-md text-body-md text-left text-error">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

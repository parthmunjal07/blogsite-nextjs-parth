"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/rbac";

export default function AdminLayoutClient({ children, role }: { children: React.ReactNode, role: string }) {
  const pathname = usePathname();
  const isEditor = pathname?.includes('/posts/new');

  if (isEditor) {
    return <>{children}</>;
  }

  const isSuperAdmin = role === "SUPER_ADMIN";
  const isCreatorOrAdmin = role === "SUPER_ADMIN" || role === "BLOG_CREATOR";

  return (
    <div className="bg-surface text-on-surface antialiased flex-grow flex font-body-md text-body-md w-full">
      {/* Left Sidebar */}
      <aside className="w-[200px] bg-surface flex flex-col justify-between py-margin-page px-6 shrink-0 border-r border-outline-variant/30 hidden md:flex min-h-[calc(100vh-64px)]">
        <div>
          {/* Brand */}
          <div className="font-body-lg text-body-lg text-primary tracking-tight mb-10 font-medium">
            inklog
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {isCreatorOrAdmin && (
              <>
                <Link href="/admin" className={`pl-4 py-2 border-l-2 text-on-surface font-label-md text-label-md transition-colors flex items-center gap-3 ${pathname === '/admin' ? 'border-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>grid_view</span>
                  Dashboard
                </Link>
                <Link href="/admin/posts" className={`pl-4 py-2 border-l-2 text-on-surface font-label-md text-label-md transition-colors flex items-center gap-3 ${pathname === '/admin/posts' ? 'border-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>article</span>
                  Posts
                </Link>
              </>
            )}
            <Link href="/admin/profile" className={`pl-4 py-2 border-l-2 text-on-surface font-label-md text-label-md transition-colors flex items-center gap-3 ${pathname === '/admin/profile' ? 'border-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
              Profile
            </Link>
            {isSuperAdmin && (
              <Link href="/admin/users" className={`pl-4 py-2 border-l-2 text-on-surface font-label-md text-label-md transition-colors flex items-center gap-3 ${pathname === '/admin/users' ? 'border-primary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>group</span>
                Users
              </Link>
            )}
          </nav>
        </div>

        {/* Logout */}
        <button className="pl-4 py-2 border-l-2 border-transparent text-on-surface-variant hover:text-error transition-colors font-body-md text-body-md flex items-center gap-3 text-left">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
          Logout
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-4 md:p-8 flex justify-center items-start w-full">
        {children}
      </main>
    </div>
  );
}

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="w-full max-w-admin-max bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-gap-section gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Dashboard</h1>
          <time className="font-caption text-caption text-on-surface-variant" id="current-date">October 26, 2024</time>
        </div>
        <Link href="/admin/posts/new" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-lg hover:bg-on-primary-container transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          New Post
        </Link>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-gap-component mb-gap-section">
        {/* Stat Card 1 */}
        <div className="bg-surface rounded-lg p-5">
          <div className="font-caption text-caption text-on-surface-variant mb-3">Total Views</div>
          <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">42,891</div>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-surface rounded-lg p-5">
          <div className="font-caption text-caption text-on-surface-variant mb-3">Published Posts</div>
          <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">124</div>
        </div>
        {/* Stat Card 3 */}
        <div className="bg-surface rounded-lg p-5">
          <div className="font-caption text-caption text-on-surface-variant mb-3">Total Likes</div>
          <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">8,902</div>
        </div>
        {/* Stat Card 4 */}
        <div className="bg-surface rounded-lg p-5">
          <div className="font-caption text-caption text-on-surface-variant mb-3">Active Drafts</div>
          <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">12</div>
        </div>
      </section>

      {/* Recent Posts Table */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-body-lg text-body-lg text-on-surface">Recent Posts</h2>
          <Link href="/admin/posts" className="font-label-md text-label-md text-primary hover:text-on-primary-container transition-colors">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant/50">
                <th className="font-label-md text-label-md text-on-surface-variant py-3 pr-4 font-normal w-2/5">Title</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4 font-normal">Status</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4 font-normal text-right">Views</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4 font-normal text-right">Likes</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 px-4 font-normal">Date</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-3 pl-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md">
              <tr className="border-b border-outline-variant/30 hover:bg-surface/50 transition-colors group">
                <td className="py-4 pr-4 text-on-surface truncate pr-8">The Architecture of Silence</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-primary font-caption text-caption bg-primary/10">Published</span>
                </td>
                <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">1,245</td>
                <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">84</td>
                <td className="py-4 px-4 text-on-surface-variant whitespace-nowrap">Oct 24, 2024</td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/admin/posts/new" className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </Link>
                    <button className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/30 hover:bg-surface/50 transition-colors group">
                <td className="py-4 pr-4 text-on-surface truncate pr-8">Minimalism in the Digital Age</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-on-surface-variant font-caption text-caption bg-surface-container-high">Draft</span>
                </td>
                <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">—</td>
                <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">—</td>
                <td className="py-4 px-4 text-on-surface-variant whitespace-nowrap">Oct 22, 2024</td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/admin/posts/new" className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </Link>
                    <button className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/30 hover:bg-surface/50 transition-colors group">
                <td className="py-4 pr-4 text-on-surface truncate pr-8">A Study of Typography Contexts</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-primary font-caption text-caption bg-primary/10">Published</span>
                </td>
                <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">8,392</td>
                <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">412</td>
                <td className="py-4 px-4 text-on-surface-variant whitespace-nowrap">Oct 15, 2024</td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/admin/posts/new" className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </Link>
                    <button className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface/50 transition-colors group">
                <td className="py-4 pr-4 text-on-surface truncate pr-8">The Case for Intentional Friction</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-primary font-caption text-caption bg-primary/10">Published</span>
                </td>
                <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">12,041</td>
                <td className="py-4 px-4 text-on-surface-variant text-right tabular-nums">890</td>
                <td className="py-4 px-4 text-on-surface-variant whitespace-nowrap">Oct 10, 2024</td>
                <td className="py-4 pl-4 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href="/admin/posts/new" className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </Link>
                    <button className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

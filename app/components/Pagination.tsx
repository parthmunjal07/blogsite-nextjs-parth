import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center mt-gap-section pt-gap-component border-t border-outline-variant gap-2" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link 
          href={`${baseUrl}page=${currentPage - 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors group"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
        </Link>
      ) : (
        <div className="w-10 h-10" />
      )}

      {startPage > 1 && (
        <>
          <Link href={`${baseUrl}page=1`} className="w-10 h-10 flex items-center justify-center rounded-full font-label-lg text-label-lg text-on-surface hover:bg-surface-variant transition-colors">1</Link>
          {startPage > 2 && <span className="text-on-surface-variant">...</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`${baseUrl}page=${p}`}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-label-lg text-label-lg transition-colors ${
            p === currentPage 
              ? 'bg-primary text-on-primary' 
              : 'text-on-surface hover:bg-surface-variant'
          }`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-on-surface-variant">...</span>}
          <Link href={`${baseUrl}page=${totalPages}`} className="w-10 h-10 flex items-center justify-center rounded-full font-label-lg text-label-lg text-on-surface hover:bg-surface-variant transition-colors">{totalPages}</Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link 
          href={`${baseUrl}page=${currentPage + 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors group"
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">chevron_right</span>
        </Link>
      ) : (
        <div className="w-10 h-10" />
      )}
    </nav>
  );
}

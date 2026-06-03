export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-body-md text-body-md text-on-surface bg-[#F7F6F3]">
      {children}
    </div>
  );
}

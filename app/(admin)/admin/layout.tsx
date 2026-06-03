import { auth } from "@/lib/auth";
import AdminLayoutClient from "@/app/components/AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role || "PUBLIC_VIEWER";

  return (
    <AdminLayoutClient role={role}>
      {children}
    </AdminLayoutClient>
  );
}

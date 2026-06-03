import { auth } from "@/lib/auth";
import AdminLayoutClient from "@/app/components/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role || "PUBLIC_VIEWER";

  return (
    <AdminLayoutClient role={role}>
      {children}
    </AdminLayoutClient>
  );
}

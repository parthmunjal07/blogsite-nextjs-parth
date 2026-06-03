import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserRoleManager from "@/app/components/admin/UserRoleManager";

export const metadata = {
  title: "User Management - Admin Dashboard",
};

export default async function AdminUsersPage() {
  const user = await getAuthenticatedUser();

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center w-full px-margin-page py-4 border-b border-outline-variant bg-surface sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">User Management</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex flex-col w-full max-w-admin-max mx-auto px-margin-page py-gap-section gap-gap-section flex-grow">
        <section className="w-full flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-display-sm font-display-sm text-on-surface mb-2">Users</h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[600px]">
                Manage user access levels. Super Admins can configure the application, Blog Creators can publish posts, and Public Viewers have read-only access.
              </p>
            </div>
            <div className="bg-surface-variant text-on-surface-variant px-4 py-2 rounded-lg font-label-md">
              Total Users: {users.length}
            </div>
          </div>

          <UserRoleManager initialUsers={users} currentUserId={user.id} />
        </section>
      </main>
    </div>
  );
}

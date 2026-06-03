"use client";

import { useState } from "react";
import { Role } from "@prisma/client";

type User = {
  id: string;
  email: string | null;
  username: string | null;
  role: Role;
  createdAt: string | Date;
};

export default function UserRoleManager({ initialUsers, currentUserId }: { initialUsers: User[], currentUserId: string }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    if (userId === currentUserId) {
      setError("You cannot change your own role.");
      return;
    }

    setLoadingId(userId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update role");
      }

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden">
      {error && (
        <div className="bg-error-container text-on-error-container p-4 font-body-md">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-variant text-on-surface-variant font-label-md uppercase tracking-wider">
              <th className="px-6 py-4 font-medium border-b border-outline-variant">User</th>
              <th className="px-6 py-4 font-medium border-b border-outline-variant">Email</th>
              <th className="px-6 py-4 font-medium border-b border-outline-variant">Joined</th>
              <th className="px-6 py-4 font-medium border-b border-outline-variant">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-variant/30 transition-colors">
                <td className="px-6 py-4 font-body-md text-on-surface">
                  {user.username || "Anonymous"}
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface-variant">
                  {user.email || "No Email"}
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface-variant">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    className="bg-surface border border-outline-variant text-on-surface text-body-md rounded-md focus:ring-primary focus:border-primary block w-full p-2.5 disabled:opacity-50"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    disabled={loadingId === user.id || user.id === currentUserId}
                  >
                    <option value="PUBLIC_VIEWER">Public Viewer</option>
                    <option value="BLOG_CREATOR">Blog Creator</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant font-body-md">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/app/components/ProfileEditForm";

export default async function AdminProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, bio: true, avatarUrl: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <header className="mb-gap-section border-b border-outline-variant pb-gap-component">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Your Profile</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage your public profile settings and author details.
        </p>
      </header>

      <ProfileEditForm user={user} />
    </div>
  );
}

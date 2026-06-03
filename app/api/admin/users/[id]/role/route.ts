import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

import { z } from "zod";

type Context = {
  params: Promise<{ id: string }>;
};

const roleSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "BLOG_CREATOR", "PUBLIC_VIEWER"]),
});

export async function PATCH(req: NextRequest, { params }: Context) {
  try {
    const { id: targetUserId } = await params;
    
    const currentUser = await getAuthenticatedUser();

    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Super Admin access required" },
        { status: 403 }
      );
    }

    if (currentUser.id === targetUserId) {
      return NextResponse.json(
        { error: "You cannot modify your own role to prevent lockout." },
        { status: 400 }
      );
    }


    const body = await req.json();
    const validation = roleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { role } = validation.data;

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
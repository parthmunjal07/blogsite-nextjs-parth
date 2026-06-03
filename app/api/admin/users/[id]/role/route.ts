import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { Role } from "@prisma/client";

type Context = {
  params: Promise<{ id: string }>;
};

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
    const { role } = body;

    if (!role || !Object.values(Role).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role provided." },
        { status: 400 }
      );
    }

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
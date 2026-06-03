import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ username: string }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { username } = await params;

    const profile = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        // bio: true, 
        // image: true,
        posts: {
          where: { published: true },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            createdAt: true,
            category: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
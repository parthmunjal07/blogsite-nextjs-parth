import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    
    const post = await prisma.post.findUnique({ 
      where: { id },
      select: { likeCount: true, viewCount: true }
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

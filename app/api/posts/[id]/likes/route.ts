import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    
    let fingerprint: string | null = null;
    try {
      const body = await req.json();
      fingerprint = body?.fingerprint || null;
    } catch (e) {
      // Ignored if body is not JSON or empty
    }

    if (!user && !fingerprint) {
      return NextResponse.json({ error: "Unauthorized or fingerprint required" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let existingLike = null;

    if (user) {
      existingLike = await prisma.like.findFirst({
        where: { postId: id, userIdFingerprint: user.id }
      });
    } else if (fingerprint) {
      existingLike = await prisma.like.findFirst({
        where: { postId: id, fingerprint }
      });
    }

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existingLike.id } }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { decrement: 1 } }
        })
      ]);
      return NextResponse.json({ message: "Unliked", liked: false });
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            postId: id,
            userIdFingerprint: user?.id || null,
            fingerprint: !user ? fingerprint : null,
          }
        }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { increment: 1 } }
        })
      ]);
      return NextResponse.json({ message: "Liked", liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

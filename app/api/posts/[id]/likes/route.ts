import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import rateLimit from "@/lib/rate-limit";
import { getRealIp } from "@/lib/utils";

const likesLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000,
});

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user;
    
    const ip = getRealIp(req);
    const userAgent = req.headers.get("user-agent") || "unknown-ua";
    const fingerprintString = `${ip}-${userAgent}`;
    const fingerprint = crypto.createHash('sha256').update(fingerprintString).digest('hex');

    let existingLike = null;

    if (user) {
      existingLike = await prisma.like.findFirst({
        where: { postId: id, userIdFingerprint: user.id }
      });
    } else {
      existingLike = await prisma.like.findFirst({
        where: { postId: id, fingerprint }
      });
    }

    return NextResponse.json({ liked: !!existingLike });
  } catch (error) {
    return NextResponse.json({ liked: false });
  }
}

export async function POST(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user;
    
    // Extract IP and User-Agent for fingerprinting
    const ip = getRealIp(req);
    
    try {
      await likesLimiter.check(60, ip); // 60 likes per minute per IP
    } catch {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const userAgent = req.headers.get("user-agent") || "unknown-ua";
    const fingerprintString = `${ip}-${userAgent}`;
    const fingerprint = crypto.createHash('sha256').update(fingerprintString).digest('hex');

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let existingLike = null;

    if (user) {
      existingLike = await prisma.like.findFirst({
        where: { postId: id, userIdFingerprint: user.id }
      });
    } else {
      existingLike = await prisma.like.findFirst({
        where: { postId: id, fingerprint }
      });
    }

    let currentLikeCount = post.likeCount;
    let isLiked = false;

    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existingLike.id } }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { decrement: 1 } }
        })
      ]);
      currentLikeCount -= 1;
      isLiked = false;
    } else {
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
      currentLikeCount += 1;
      isLiked = true;
    }

    return NextResponse.json({ liked: isLiked, likeCount: currentLikeCount });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

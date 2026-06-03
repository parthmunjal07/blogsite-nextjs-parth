import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipFingerprint = forwardedFor ? forwardedFor.split(",")[0] : req.headers.get("x-real-ip") || "unknown-ip";

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const existingView = await prisma.postView.findFirst({
      where: { 
        postId: id, 
        ipFingerprint,
        createdAt: {
          gte: yesterday
        }
      }
    });

    if (!existingView) {
      await prisma.$transaction([
        prisma.postView.create({
          data: {
            postId: id,
            ipFingerprint
          }
        }),
        prisma.post.update({
          where: { id },
          data: { viewCount: { increment: 1 } }
        })
      ]);
      return NextResponse.json({ message: "View recorded", newView: true });
    }

    return NextResponse.json({ message: "Already viewed by this IP", newView: false });
  } catch (error) {
    console.error("Error recording view:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

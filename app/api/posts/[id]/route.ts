import { prisma } from "@/lib/prisma";
import dotenv from "dotenv";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

type Context = {
  params: Promise<{ id: string }>;
};

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, encodedSecret);
    const payload = verified.payload as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true },
    });

    return user;
  } catch (err) {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  res: NextResponse,
  { params }: Context,
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, email: true, username: true, role: true },
        },
        category: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const isOwner = existingPost.authorId === user.id;
    const isSuperAdmin = user.role === "SUPER_ADMIN";

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to edit this post" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { title, slug, content, excerpt, published, categoryId } = body;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(published !== undefined && { published }),
        ...(categoryId !== undefined && { categoryId }),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const isOwner = existingPost.authorId === user.id;
    const isSuperAdmin = user.role === "SUPER_ADMIN";

    if (!isOwner && !isSuperAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete this post" },
        { status: 403 },
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 },
    );
  } catch (error) {}
}

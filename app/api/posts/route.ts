import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 50); 

    const skip = (validPage - 1) * validLimit;

    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        where: { 
          published: true
        },
        skip: skip,
        take: validLimit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.post.count({
        where: { published: true },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / validLimit);

    return NextResponse.json({
      data: posts,
      meta: {
        currentPage: validPage,
        limit: validLimit,
        totalPosts: totalCount,
        totalPages: totalPages,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching posts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;

    try {
      const verified = await jwtVerify(token, encodedSecret);
      payload = verified.payload as { userId: String };
    } catch (error) {}

    if (!payload) {
      console.log("No Payload in posts");
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allowedRoles = ["BLOG_CREATOR", "SUPER_ADMIN"];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to create posts." },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 },
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: payload.userId,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred on the server." },
      { status: 500 },
    );
  }
}

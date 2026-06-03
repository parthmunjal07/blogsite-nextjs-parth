import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { postSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
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

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["BLOG_CREATOR", "SUPER_ADMIN"];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to create posts." },
        { status: 403 },
      );
    }

    const body = await req.json();
    const validation = postSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { title, slug, content, excerpt, categoryId, published, coverImage } = validation.data;

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        categoryId: categoryId || null,
        published: published || false,
        authorId: user.id,
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

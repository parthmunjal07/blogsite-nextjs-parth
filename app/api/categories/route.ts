import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user || (user.role !== "BLOG_CREATOR" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to create categories." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Category name and slug are required." },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists." },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
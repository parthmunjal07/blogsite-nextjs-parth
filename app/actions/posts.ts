"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { postSchema } from "@/lib/validations";

export async function createPost(formData: FormData) {
  const user = await getAuthenticatedUser();

  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "BLOG_CREATOR")) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "true",
  };

  const validation = postSchema.safeParse(rawData);

  if (!validation.success) {
    return { 
      success: false, 
      error: "Validation failed", 
      errors: validation.error.flatten().fieldErrors 
    };
  }

  const { title, slug, content, excerpt, categoryId, published } = validation.data;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        categoryId: categoryId || null,
        published: published || false,
        authorId: user.id,
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    return { success: true, post };
  } catch (error: any) {
    console.error("Error creating post:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
       return { success: false, error: "A post with this slug already exists." };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updatePost(id: string, formData: FormData) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    return { success: false, error: "Post not found" };
  }

  if (existingPost.authorId !== user.id && user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" };
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt"),
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "true",
  };

  const validation = postSchema.safeParse(rawData);

  if (!validation.success) {
    return { 
      success: false, 
      error: "Validation failed", 
      errors: validation.error.flatten().fieldErrors 
    };
  }

  const { title, slug, content, excerpt, categoryId, published } = validation.data;

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        categoryId: categoryId || null,
        published: published !== undefined ? published : existingPost.published,
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog");
    return { success: true, post };
  } catch (error: any) {
    console.error("Error updating post:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
       return { success: false, error: "A post with this slug already exists." };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deletePost(id: string) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    return { success: false, error: "Post not found" };
  }

  if (existingPost.authorId !== user.id && user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" };
  }

  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function togglePublish(id: string) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const existingPost = await prisma.post.findUnique({ where: { id } });
  if (!existingPost) {
    return { success: false, error: "Post not found" };
  }

  if (existingPost.authorId !== user.id && user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" };
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published: !existingPost.published },
    });
    
    revalidatePath("/admin/posts");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog");
    
    return { success: true, published: post.published };
  } catch (error) {
    console.error("Error toggling publish state:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

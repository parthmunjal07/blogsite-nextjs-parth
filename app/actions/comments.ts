"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, content: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be logged in to comment");
  }

  if (!content || !content.trim()) {
    throw new Error("Comment content cannot be empty");
  }

  const newComment = await prisma.comment.create({
    data: {
      content: content.trim(),
      postId,
      userId: session.user.id,
      name: session.user.name || null,
      email: session.user.email || null,
    },
    include: {
      user: { select: { username: true } }
    }
  });

  // Revalidate the post page to reflect the new comment count and comment list
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { slug: true }});
  if (post?.slug) {
    revalidatePath(`/blog/${post.slug}`);
  }

  return { success: true, comment: newComment };
}

export async function deleteComment(commentId: string, postId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true }
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  const isCommentOwner = comment.userId === session.user.id;
  const isPostOwner = comment.post.authorId === session.user.id;
  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  if (!isCommentOwner && !isPostOwner && !isSuperAdmin) {
    throw new Error("Forbidden: You don't have permission to delete this comment");
  }

  await prisma.comment.delete({
    where: { id: commentId }
  });

  if (comment.post.slug) {
    revalidatePath(`/blog/${comment.post.slug}`);
  }

  return { success: true };
}

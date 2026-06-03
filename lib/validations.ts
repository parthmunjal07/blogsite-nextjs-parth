import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  excerpt: z.string().optional(),
  coverImage: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  categoryId: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  name: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters long"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().nullable(),
  avatarUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  username: z.string().min(3, "Username must be at least 3 characters long").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

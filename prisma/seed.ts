import "dotenv/config"
import { Role } from '../lib/rbac'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

async function main() {
  console.log('Clearing database...')

  await prisma.postView.deleteMany()
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding data...')
  
  const defaultPassword = 'password123'
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  const superAdmin = await prisma.user.create({
    data: {
      username: 'superadmin',
      email: 'admin@example.com',
      emailVerified: new Date(),
      passwordHash: hashedPassword,
      bio: 'I rule this blog.',
      role: 'SUPER_ADMIN',
    },
  })

  const blogCreator = await prisma.user.create({
    data: {
      username: 'creator1',
      email: 'creator@example.com',
      emailVerified: new Date(),
      passwordHash: hashedPassword,
      bio: 'Writing awesome posts.',
      role: 'BLOG_CREATOR',
    },
  })

  const publicViewer = await prisma.user.create({
    data: {
      username: 'janereads',
      email: 'jane@example.com',
      emailVerified: new Date(),
      passwordHash: hashedPassword,
      bio: 'Just here to read and comment.',
      role: 'PUBLIC_VIEWER',
    },
  })

  const techCategory = await prisma.category.create({
    data: {
      name: 'Technology',
      slug: 'technology',
    },
  })

  const lifestyleCategory = await prisma.category.create({
    data: {
      name: 'Lifestyle',
      slug: 'lifestyle',
    },
  })

  const post1 = await prisma.post.create({
    data: {
      title: 'First Post: Next.js + Prisma',
      slug: 'first-post-nextjs-prisma',
      content: 'This is the content of the first post. It is very informative.',
      excerpt: 'Learn how to use Next.js with Prisma.',
      published: true,
      authorId: superAdmin.id,
      categoryId: techCategory.id,
      viewCount: 10,
      likeCount: 5,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'A Day in the Life',
      slug: 'day-in-the-life',
      content: 'Woke up, drank coffee, wrote some code.',
      excerpt: 'Just another day.',
      published: true,
      authorId: blogCreator.id,
      categoryId: lifestyleCategory.id,
      viewCount: 20,
      likeCount: 12,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'Great post! Very helpful.',
      name: publicViewer.username,
      email: publicViewer.email,
      postId: post1.id,
      userId: publicViewer.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'Anonymous comment here.',
      name: 'Anonymous',
      postId: post1.id,
    },
  })

  await prisma.like.create({
    data: {
      postId: post1.id,
      userIdFingerprint: publicViewer.id,
    },
  })

  await prisma.like.create({
    data: {
      postId: post1.id,
      fingerprint: 'anon_fingerprint_123',
    },
  })

  await prisma.postView.create({
    data: {
      postId: post2.id,
      ipFingerprint: '192.168.1.1',
    },
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

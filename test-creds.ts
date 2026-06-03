import "dotenv/config";
import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function test() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
  console.log('User found:', !!user);
  if (user) {
    console.log('Email verified:', !!user.emailVerified);
    console.log('Hash prefix:', user.passwordHash?.substring(0, 10));
    const match = await bcrypt.compare('password123', user.passwordHash || "");
    console.log('Password match:', match);
  }
  await prisma.$disconnect();
}
test();

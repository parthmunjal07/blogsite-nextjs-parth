import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "If an account with that email exists, we have sent a password reset link." }, { status: 200 });
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ message: "If an account with that email exists, we have sent a password reset link." }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

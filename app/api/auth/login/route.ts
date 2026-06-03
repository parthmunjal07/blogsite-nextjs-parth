import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"
import dotenv from "dotenv";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validations";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: {email: email}
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    } 

    const isPasswordValid = bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = await new SignJWT(sessionPayload)
          .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedSecret);

      (await cookies()).set({
      name: "auth_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",      
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

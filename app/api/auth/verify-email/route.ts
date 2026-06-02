import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const emailVerification = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!emailVerification) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (emailVerification.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }
    
    if (emailVerification.used) {
       return NextResponse.json({ error: "Token already used" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: emailVerification.userId },
      data: { emailVerified: new Date() },
    });

    await prisma.emailVerification.delete({
      where: { id: emailVerification.id },
    });

    // We can return a small HTML string so it's user-friendly in the browser
    return new NextResponse("<html><body><h2>Email verified successfully!</h2><p>You can now close this tab and login.</p></body></html>", { 
      status: 200, 
      headers: { "Content-Type": "text/html" } 
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

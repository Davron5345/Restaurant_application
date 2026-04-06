import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-for-restaurant");

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${proto}://${host}`;

    if (!token) return NextResponse.redirect(new URL("/login", baseUrl));

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN" && payload.role !== "FOUNDER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const logo = formData.get("logo") as string;
    const tgChatId = formData.get("tgChatId") as string;
    const tgBotToken = formData.get("tgBotToken") as string;

    await prisma.branch.update({
      where: { id },
      data: { 
        name: name.trim(),
        logo: logo.trim() || null,
        tgChatId: tgChatId.trim() || null,
        tgBotToken: tgBotToken.trim() || null,
      }
    });

    return NextResponse.redirect(new URL("/admin/branches", baseUrl));
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

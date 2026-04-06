import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-for-restaurant");

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN" && payload.role !== "FOUNDER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;

    if (!name || name.trim() === "") {
        return NextResponse.redirect(new URL("/admin/branches?error=invalid", req.url));
    }

    await prisma.branch.create({
      data: { name: name.trim() }
    });

    return NextResponse.redirect(new URL("/admin/branches", req.url));
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

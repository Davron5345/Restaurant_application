import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-for-restaurant");

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const formData = await req.formData();
    const phoneNum = formData.get("phone") as string;
    const role = formData.get("role") as string;

    if (!phoneNum || phoneNum.length < 4) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    const cleanPhone = phoneNum.replace(/\D/g, "");
    const generatedPassword = cleanPhone.slice(-4);
    const passwordHash = await bcrypt.hash(generatedPassword, 10);

    await prisma.user.upsert({
      where: { phone: cleanPhone },
      update: { password: passwordHash, role },
      create: {
        phone: cleanPhone,
        password: passwordHash,
        role: role || "CASHIER",
      }
    });

    return NextResponse.redirect(new URL("/admin", req.url));
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

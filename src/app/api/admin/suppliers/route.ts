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
    if (payload.role !== "ADMIN" && payload.role !== "FOUNDER" && payload.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const currency = formData.get("currency") as string;

    if (!name || name.trim() === "") {
        const errUrl = new URL("/admin/suppliers", baseUrl);
        errUrl.searchParams.set("error", "invalid");
        return NextResponse.redirect(errUrl);
    }

    await prisma.supplier.create({
      data: { name: name.trim(), currency: currency || "UZS" }
    });

    return NextResponse.redirect(new URL("/admin/suppliers", baseUrl));
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

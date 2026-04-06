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
    
    if (!name || name.trim() === "") {
        const errUrl = new URL("/admin/suppliers", baseUrl);
        errUrl.searchParams.set("error", "invalid");
        return NextResponse.redirect(errUrl);
    }

    const currency = formData.get("currency") as string;
    const inn = formData.get("inn") as string;
    const director = formData.get("director") as string;
    const phone = formData.get("phone") as string;
    const rs = formData.get("rs") as string;
    const mfo = formData.get("mfo") as string;
    const bankAddress = formData.get("bankAddress") as string;
    const bank = formData.get("bank") as string;
    const address = formData.get("address") as string;
    const accountant = formData.get("accountant") as string;
    const accountantPhone = formData.get("accountantPhone") as string;
    const tgChatId = formData.get("tgChatId") as string;

    await prisma.supplier.create({
      data: { 
        name: name.trim(), 
        currency: currency || "UZS",
        inn: inn?.trim() || null,
        director: director?.trim() || null,
        phone: phone?.trim() || null,
        rs: rs?.trim() || null,
        mfo: mfo?.trim() || null,
        bankAddress: bankAddress?.trim() || null,
        bank: bank?.trim() || null,
        address: address?.trim() || null,
        accountant: accountant?.trim() || null,
        accountantPhone: accountantPhone?.trim() || null,
        tgChatId: tgChatId?.trim() || null,
      }
    });

    return NextResponse.redirect(new URL("/admin/suppliers", baseUrl));
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

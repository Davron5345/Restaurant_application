import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const phone = '998901234567';
    
    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Администратор уже существует!", phone: existingAdmin.phone });
    }

    const plainPassword = phone.slice(-4);
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    await prisma.user.create({
      data: {
        phone,
        password: passwordHash,
        role: 'ADMIN',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Первый администратор успешно создан!",
      phone: phone, 
      password: plainPassword 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

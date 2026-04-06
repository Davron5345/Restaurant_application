import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const newPhone = '998993025345';
    const plainPassword = '5345';
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // Create or update the new admin
    await prisma.user.upsert({
      where: { phone: newPhone },
      update: {
        password: passwordHash,
        role: 'ADMIN',
        isActive: true
      },
      create: {
        phone: newPhone,
        password: passwordHash,
        role: 'ADMIN',
        name: "Главный Админ"
      }
    });

    // Optionally disable the old placeholder if it's there
    const oldPhone = '998901234567';
    const oldUser = await prisma.user.findUnique({ where: { phone: oldPhone } });
    if (oldUser) {
      await prisma.user.delete({ where: { phone: oldPhone } });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Администратор обновлен!",
      phone: newPhone, 
      password: plainPassword 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

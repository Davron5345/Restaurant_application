import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { date, incomes, expenses } = data;

    const parsedDate = new Date(date);

    // Save incomes
    for (const inc of incomes) {
      if (!inc.article) continue;
      const amount = parseFloat(inc.amount.replace(/\s/g, '').replace(',', '.')) || 0;
      if (amount === 0) continue;

      await prisma.transaction.create({
        data: {
          date: parsedDate,
          type: "INCOME",
          article: inc.article,
          partner: inc.partner,
          amount: amount,
          comment: inc.comment,
        }
      });
    }

    // Save expenses
    for (const exp of expenses) {
      if (!exp.article) continue;
      const amount = parseFloat(exp.amount.replace(/\s/g, '').replace(',', '.')) || 0;
      if (amount === 0) continue;

      await prisma.transaction.create({
        data: {
          date: parsedDate,
          type: "EXPENSE",
          article: exp.article,
          partner: exp.partner,
          amount: amount,
          comment: exp.comment,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

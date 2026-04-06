import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { date, branchId, incomes, expenses } = data;

    if (!branchId) {
       return NextResponse.json({ error: "Филиал не указан" }, { status: 400 });
    }

    const parsedDate = new Date(date);

    // Fetch all suppliers to link them properly if a match is found
    const allSuppliers = await prisma.supplier.findMany();
    const supplierMap = new Map(allSuppliers.map(s => [s.name, s.id]));

    // Save incomes
    for (const inc of incomes) {
      if (!inc.article) continue;
      const amount = parseFloat(inc.amount.replace(/\s/g, '').replace(',', '.')) || 0;
      if (amount === 0) continue;

      let supplierId = null;
      if ((inc.article === "Поставщики" || inc.article === "Поставщик") && inc.partner) {
         supplierId = supplierMap.get(inc.partner) || null;
      }

      await prisma.transaction.create({
        data: {
          date: parsedDate,
          type: "INCOME",
          article: inc.article,
          partner: inc.partner,
          amount: amount,
          comment: inc.comment,
          branchId,
          supplierId
        }
      });
    }

    // Save expenses
    for (const exp of expenses) {
      if (!exp.article) continue;
      const amount = parseFloat(exp.amount.replace(/\s/g, '').replace(',', '.')) || 0;
      if (amount === 0) continue;

      let supplierId = null;
      if ((exp.article === "Поставщики" || exp.article === "Поставщик") && exp.partner) {
         supplierId = supplierMap.get(exp.partner) || null;
      }

      await prisma.transaction.create({
        data: {
          date: parsedDate,
          type: "EXPENSE",
          article: exp.article,
          partner: exp.partner,
          amount: amount,
          comment: exp.comment,
          branchId,
          supplierId
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import CashRegisterClient from "@/components/CashRegisterClient";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-for-restaurant");
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) {
    redirect("/login");
  }

  let payload;
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    payload = verified.payload;
  } catch (e) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id as string },
    include: { branches: true }
  });

  if (!user) redirect("/login");

  let allowedBranches = user.branches;
  
  // If user has no specifically assigned branches but is ADMIN/FOUNDER/MANAGER, they should have access to ALL active branches
  if (allowedBranches.length === 0 && ["ADMIN", "FOUNDER", "MANAGER"].includes(user.role)) {
     allowedBranches = await prisma.branch.findMany({ 
         where: { isActive: true },
         orderBy: { name: "asc" }
     });
  }

  // Same logic for categories - fetch them dynamically!
  const categories = await prisma.category.findMany({ 
      where: { isActive: true }, 
      orderBy: { name: "asc" } 
  });

  const suppliers = await prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
  });

  return (
    <CashRegisterClient 
       user={user} 
       branches={allowedBranches} 
       categories={categories} 
       suppliers={suppliers} 
    />
  );
}

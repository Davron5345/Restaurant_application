import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import Modal from "@/components/Modal";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div>Доступ запрещен</div>;

  let categories = await prisma.category.findMany({ orderBy: { type: "asc" } });

  if (categories.length === 0) {
    await prisma.category.createMany({
      data: [
        { name: "Излишка", type: "INCOME" },
        { name: "Савдо сотилган овкатдан", type: "INCOME" },
        { name: "Сумма на начало", type: "INCOME" },
        { name: "Прочее", type: "INCOME" },
        { name: "Недостача", type: "EXPENSE" },
        { name: "А.Т. ойлик", type: "EXPENSE" },
        { name: "Терминал", type: "EXPENSE" },
        { name: "Сумма на конец", type: "EXPENSE" },
        { name: "Поставщики", type: "EXPENSE" },
      ]
    });
    categories = await prisma.category.findMany({ orderBy: { type: "asc" } });
  }

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "#1e293b", marginBottom: "24px" }}>Статьи прихода и расхода</h1>
      
      <div style={{ display: "flex", gap: "24px" }}>
        
        <div style={{ flex: 1, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
             <h2 style={{ fontSize: "1.25rem", color: "#1e293b", margin: 0 }}>Список статей</h2>
             
             <Modal title="Добавить статью" triggerText="+ Добавить" triggerStyle="primary">
                  <form action="/api/admin/categories" method="POST" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Тип</label>
                      <select name="type" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}>
                        <option value="INCOME">Приход</option>
                        <option value="EXPENSE">Расход</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Название статьи</label>
                      <input name="name" placeholder="Например: Коммуналка" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} required />
                    </div>
                    <button type="submit" style={{ background: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}>
                      Сохранить
                    </button>
                  </form>
             </Modal>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>

      </div>
    </div>
  );
}

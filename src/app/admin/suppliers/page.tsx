import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AdminSuppliersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div>Доступ запрещен</div>;

  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "#1e293b", marginBottom: "24px" }}>Управление поставщиками</h1>
      
      <div style={{ display: "flex", gap: "24px" }}>
        
        <div style={{ flex: 2, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Название</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Валюта</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", fontWeight: "600" }}>{s.name}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{s.currency}</td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr><td colSpan={2} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Поставщики не добавлены</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ flex: 1, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", alignSelf: "flex-start" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "16px", color: "#1e293b" }}>Добавить</h2>
          <form action="/api/admin/suppliers" method="POST" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Имя поставщика</label>
              <input name="name" placeholder="ООО Мясо" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Валюта расчета</label>
              <select name="currency" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}>
                <option value="UZS">Сум (UZS)</option>
                <option value="USD">Доллар ($)</option>
              </select>
            </div>
            <button type="submit" style={{ background: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Сохранить
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

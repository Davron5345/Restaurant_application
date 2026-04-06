import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AdminBranchesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div>Доступ запрещен</div>;

  const branches = await prisma.branch.findMany({
    include: { _count: { select: { users: true, transactions: true } } }
  });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "#1e293b", marginBottom: "24px" }}>Управление филиалами</h1>
      
      <div style={{ display: "flex", gap: "24px" }}>
        
        {/* Branches List */}
        <div style={{ flex: 2, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Название филиала</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Сотрудников</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Операций по кассе</th>
              </tr>
            </thead>
            <tbody>
              {branches.map(b => (
                <tr key={b.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", fontWeight: "600" }}>{b.name}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{b._count.users} чел.</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{b._count.transactions}</td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr><td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Филиалы не добавлены</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Branch Form */}
        <div style={{ flex: 1, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", alignSelf: "flex-start" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "16px", color: "#1e293b" }}>Добавить филиал</h2>
          <form action="/api/admin/branches" method="POST" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Название</label>
              <input name="name" placeholder="Например: Махалла 90 (Центр)" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} required />
            </div>
            <button type="submit" style={{ background: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Добавить филиал
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

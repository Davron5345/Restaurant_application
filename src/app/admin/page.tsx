import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-for-restaurant");

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div>Доступ запрещен</div>;

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    take: 100, // Последние 100
    include: { branch: true }
  });

  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "2rem", color: "#1e293b", margin: 0 }}>Ежедневные отчёты</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <select style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white" }}>
            <option value="">Все филиалы</option>
            {branches.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <input type="date" style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
          <button style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Показать</button>
        </div>
      </div>

      <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Дата</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Тип</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Статья</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>От кого/Кому</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={{ transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#f8fafc"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{t.date.toISOString().split("T")[0]}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                  <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", background: t.type === "INCOME" ? "#dcfce7" : "#fee2e2", color: t.type === "INCOME" ? "#166534" : "#991b1b" }}>
                    {t.type === "INCOME" ? "Приход" : "Расход"}
                  </span>
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{t.article}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{t.partner}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", fontWeight: "bold", color: t.type === "INCOME" ? "#10b981" : "#ef4444" }}>
                  {t.amount.toLocaleString()} сум
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Операций пока нет</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

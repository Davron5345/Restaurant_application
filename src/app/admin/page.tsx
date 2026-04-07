import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div style={{ padding: "24px" }}>Доступ запрещен. Пожалуйста, войдите в систему.</div>;

  let transactions: any[] = [];
  let branches: any[] = [];

  try {
    transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: 100,
      include: { branch: true }
    });
    branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  } catch (error: any) {
    console.error("Reports page error:", error);
    return (
      <div style={{ padding: "24px", color: "#ef4444" }}>
        <h2>Ошибка загрузки данных</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <h1 style={{ fontSize: "2rem", color: "#1e293b", margin: 0 }}>Ежедневные отчёты</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <select style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "white" }}>
            <option value="">Все филиалы</option>
            {branches.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <input type="date" style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
        </div>
      </div>

      <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Дата</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Филиал</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Тип</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Статья</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>От кого/Кому</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Сумма</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t: any) => (
              <tr key={t.id}>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                  {t.date ? new Date(t.date).toLocaleDateString("ru-RU") : "-"}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                  {t.branch?.name || "—"}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                  <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", background: t.type === "INCOME" ? "#dcfce7" : "#fee2e2", color: t.type === "INCOME" ? "#166534" : "#991b1b" }}>
                    {t.type === "INCOME" ? "Приход" : "Расход"}
                  </span>
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{t.article || "-"}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{t.partner || "-"}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", fontWeight: "bold", color: t.type === "INCOME" ? "#10b981" : "#ef4444" }}>
                  {(t.amount || 0).toLocaleString()} сум
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: "14px" }}>
                  {t.comment || ""}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Операций пока нет</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

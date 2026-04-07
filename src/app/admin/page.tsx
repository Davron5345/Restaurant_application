import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div style={{ padding: "24px" }}>Доступ запрещен</div>;

  let transactions: any[] = [];
  let branches: any[] = [];

  try {
    transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: 200,
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

  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + (t.amount || 0), 0);

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
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
          <thead>
            <tr style={{ background: "#1e40af", textAlign: "left" }}>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600", borderRight: "1px solid #3b82f6", whiteSpace: "nowrap" }}>№</th>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600", borderRight: "1px solid #3b82f6", whiteSpace: "nowrap" }}>Дата</th>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600", borderRight: "1px solid #3b82f6", whiteSpace: "nowrap" }}>Тип операции</th>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600", borderRight: "1px solid #3b82f6" }}>Статья операции</th>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600", borderRight: "1px solid #3b82f6" }}>От кого / Кому</th>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600", borderRight: "1px solid #3b82f6", whiteSpace: "nowrap" }}>Приход сумма</th>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600", borderRight: "1px solid #3b82f6", whiteSpace: "nowrap" }}>Расход сумма</th>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600", borderRight: "1px solid #3b82f6" }}>Комментарии прихода</th>
              <th style={{ padding: "10px 12px", color: "white", fontSize: "13px", fontWeight: "600" }}>Комментарии расхода</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t: any, idx: number) => (
              <tr key={t.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "center", color: "#64748b", fontSize: "13px" }}>{idx + 1}</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap", fontSize: "13px" }}>
                  {t.date ? new Date(t.date).toLocaleDateString("ru-RU") : "-"}
                </td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "13px" }}>
                  {t.type === "INCOME" ? "Приход" : "Расход"}
                </td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "13px", fontWeight: "500" }}>{t.article || "-"}</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "13px" }}>{t.partner || ""}</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "13px", textAlign: "right", fontWeight: "600", color: "#10b981" }}>
                  {t.type === "INCOME" ? (t.amount || 0).toLocaleString("ru-RU") : ""}
                </td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "13px", textAlign: "right", fontWeight: "600", color: "#ef4444" }}>
                  {t.type === "EXPENSE" ? (t.amount || 0).toLocaleString("ru-RU") : ""}
                </td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "13px", color: "#64748b" }}>
                  {t.type === "INCOME" ? (t.comment || "") : ""}
                </td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "13px", color: "#64748b" }}>
                  {t.type === "EXPENSE" ? (t.comment || "") : ""}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Операций пока нет</td>
              </tr>
            )}
          </tbody>
          {transactions.length > 0 && (
            <tfoot>
              <tr style={{ background: "#1e40af" }}>
                <td colSpan={5} style={{ padding: "10px 12px", color: "white", fontWeight: "bold", fontSize: "14px", textAlign: "right" }}>
                  ИТОГО:
                </td>
                <td style={{ padding: "10px 12px", color: "#86efac", fontWeight: "bold", fontSize: "14px", textAlign: "right" }}>
                  {totalIncome.toLocaleString("ru-RU")}
                </td>
                <td style={{ padding: "10px 12px", color: "#fca5a5", fontWeight: "bold", fontSize: "14px", textAlign: "right" }}>
                  {totalExpense.toLocaleString("ru-RU")}
                </td>
                <td colSpan={2} style={{ padding: "10px 12px" }}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

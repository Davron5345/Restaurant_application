import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-for-restaurant");

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Authorization check (Double check server-side)
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div>Доступ запрещен</div>;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN") return <div>Нет прав администратора</div>;
  } catch (e) {
    return <div>Ошибка авторизации</div>;
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    take: 100, // Last 100
  });

  const users = await prisma.user.findMany();

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Панель управления</h1>

      <div style={{ display: "flex", gap: "24px" }}>
        
        {/* TRANSACTIONS SECTION */}
        <div style={{ flex: 2, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Последние операции</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Дата</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Тип</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Статья</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>От кого/Кому</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>Сумма</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                    {t.date.toISOString().split("T")[0]}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                    {t.type === "INCOME" ? "Приход" : "Расход"}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{t.article}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{t.partner}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", fontWeight: "bold", color: t.type === "INCOME" ? "#10b981" : "#ef4444" }}>
                    {t.amount.toLocaleString()} сум
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* USERS/CASHIERS SECTION */}
        <div style={{ flex: 1, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>Кассиры</h2>
          
          <form action="/api/admin/users" method="POST" style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
            <h3 style={{ fontSize: "1rem" }}>Создать нового</h3>
            <input name="phone" placeholder="Номер телефона (например 998901234567)" style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} required />
            <select name="role" style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}>
              <option value="CASHIER">Кассир</option>
              <option value="ADMIN">Администратор</option>
            </select>
            <p style={{ fontSize: "12px", color: "#64748b" }}>Паролем станут последние 4 цифры.</p>
            <button type="submit" style={{ background: "#2563eb", color: "white", padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer" }}>Выдать доступ</button>
          </form>

          <div>
            {users.map(u => (
              <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid #eee" }}>
                <span>{u.phone}</span>
                <span style={{ fontSize: "12px", background: "#e2e8f0", padding: "4px 8px", borderRadius: "12px" }}>{u.role}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

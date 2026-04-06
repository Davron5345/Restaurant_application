import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div>Доступ запрещен</div>;

  const users = await prisma.user.findMany({
    include: { branch: true },
    orderBy: { createdAt: "desc" }
  });

  const branches = await prisma.branch.findMany();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "#1e293b", marginBottom: "24px" }}>Управление пользователями</h1>
      
      <div style={{ display: "flex", gap: "24px" }}>
        
        {/* Users List */}
        <div style={{ flex: 2, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Телефон</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Должность</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Филиал</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Статус</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", fontWeight: "600" }}>{u.phone}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{u.role}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{u.branch?.name || "Все филиалы"}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", background: u.isActive ? "#dcfce7" : "#fee2e2", color: u.isActive ? "#166534" : "#991b1b" }}>
                      {u.isActive ? "Активен" : "Заблокирован"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Form */}
        <div style={{ flex: 1, background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", alignSelf: "flex-start" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "16px", color: "#1e293b" }}>Добавить сотрудника</h2>
          
          <form action="/api/admin/users" method="POST" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Номер телефона</label>
              <input name="phone" defaultValue="+998 " style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} required />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Должность</label>
              <select name="role" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}>
                <option value="ADMIN">Администратор</option>
                <option value="FOUNDER">Учредитель</option>
                <option value="MANAGER">Управляющий</option>
                <option value="CASHIER">Кассир</option>
                <option value="WAITER">Официант</option>
                <option value="FINANCIER">Финансист</option>
                <option value="STOREKEEPER">Складчик</option>
                <option value="SUPPLIER">Снабженец</option>
                <option value="ACCOUNTANT">Бухгалтер</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Закрепление за филиалом</label>
              <select name="branchId" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}>
                <option value="">-- Все филиалы (Доступ ко всему) --</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", fontSize: "13px", color: "#64748b" }}>
              Паролем автоматически станут <b>последние 4 цифры</b> номера телефона.
            </div>

            <button type="submit" style={{ background: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Зарегистрировать
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

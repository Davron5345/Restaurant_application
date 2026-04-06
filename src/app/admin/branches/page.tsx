import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import Modal from "@/components/Modal";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AdminBranchesPage({ searchParams }: { searchParams: { error?: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return <div>Доступ запрещен</div>;

  const branches = await prisma.branch.findMany({
    include: { _count: { select: { users: true, transactions: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "2rem", color: "#1e293b", margin: 0 }}>Управление филиалами</h1>
      </div>

      {searchParams.error === "linked_objects_exist" && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", marginBottom: "24px" }}>
          Невозможно удалить филиал: к нему привязаны сотрудники или операции!
        </div>
      )}
      
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Branches List */}
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
             <h2 style={{ fontSize: "1.25rem", color: "#1e293b", margin: 0 }}>Список филиалов</h2>
             
             <Modal title="Добавить филиал" triggerText="+ Добавить">
                  <form action="/api/admin/branches" method="POST" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Название</label>
                      <input name="name" placeholder="Например: Махалла 90 (Центр)" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} required />
                    </div>
                    <button type="submit" style={{ background: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}>
                      Сохранить
                    </button>
                  </form>
             </Modal>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Название филиала</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Сотрудников</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Операций по кассе</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b", width: "120px" }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b: any) => {
                const canDelete = b._count.users === 0 && b._count.transactions === 0;
                return (
                  <tr key={b.id}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", fontWeight: "600" }}>{b.name}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{b._count.users} чел.</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{b._count.transactions}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: "8px" }}>
                      
                      <Modal title="Настройки филиала" triggerText="Настройки" triggerStyle="secondary">
                          <form action="/api/admin/branches/update" method="POST" style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", minWidth: "250px" }}>
                            <input type="hidden" name="id" value={b.id} />
                            <div>
                              <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Название</label>
                              <input name="name" defaultValue={b.name} required style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Логотип (URL)</label>
                              <input name="logo" defaultValue={b.logo || ""} placeholder="https://..." style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Telegram Chat ID</label>
                              <input name="tgChatId" defaultValue={b.tgChatId || ""} placeholder="-10012345678" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Telegram Bot Token</label>
                              <input name="tgBotToken" defaultValue={b.tgBotToken || ""} placeholder="1234:ABCDEF..." style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                            </div>
                            <button type="submit" style={{ background: "#2563eb", color: "white", padding: "8px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "4px" }}>Сохранить</button>
                          </form>
                      </Modal>

                      <form action="/api/admin/branches/delete" method="POST">
                        <input type="hidden" name="id" value={b.id} />
                        <button type="submit" disabled={!canDelete} style={{ background: canDelete ? "#fee2e2" : "#f1f5f9", color: canDelete ? "#dc2626" : "#cbd5e1", padding: "6px 12px", borderRadius: "6px", cursor: canDelete ? "pointer" : "not-allowed", fontSize: "13px", fontWeight: "bold", border: "none" }}>
                          Удалить
                        </button>
                      </form>

                    </td>
                  </tr>
                );
              })}
              {branches.length === 0 && (
                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Филиалы не добавлены</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

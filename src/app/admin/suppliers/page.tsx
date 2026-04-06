import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import Modal from "@/components/Modal";

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "2rem", color: "#1e293b", margin: 0 }}>Поставщики</h1>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
             <h2 style={{ fontSize: "1.25rem", color: "#1e293b", margin: 0 }}>Список поставщиков</h2>
             
             <Modal title="Добавить поставщика" triggerText="+ Добавить">
               <form action="/api/admin/suppliers" method="POST" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Название фирмы *</label>
                      <input name="name" placeholder="Например: ООО 'Еда'" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} required />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>ИНН</label>
                      <input name="inn" placeholder="123456789" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>ФИО директора</label>
                      <input name="director" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Номер телефона</label>
                      <input name="phone" placeholder="+998" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Telegram Chat ID</label>
                      <input name="tgChatId" placeholder="-100123456789" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Банк</label>
                      <input name="bank" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Расчетный счет (Р/с)</label>
                      <input name="rs" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>МФО</label>
                      <input name="mfo" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Адрес банка</label>
                      <input name="bankAddress" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Юр. Адрес</label>
                      <input name="address" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Бухгалтер (Имя)</label>
                      <input name="accountant" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>Телефон бухгалтера</label>
                      <input name="accountantPhone" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }} />
                    </div>
                  </div>

                  <button type="submit" style={{ background: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "12px" }}>
                    Сохранить поставщика
                  </button>
               </form>
             </Modal>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Поставщик</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>ИНН</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Контакты</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>Добавлен</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", fontWeight: "600" }}>{s.name}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{s.inn || "-"}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{s.phone || "-"}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", background: "#dcfce7", color: "#166534" }}>
                      Активен
                    </span>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Нет добавленных поставщиков</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Отчёты", icon: "📊" },
    { href: "/admin/branches", label: "Филиалы", icon: "🏢" },
    { href: "/admin/users", label: "Пользователи", icon: "👥" },
    { href: "/admin/suppliers", label: "Поставщики", icon: "🚚" },
    { href: "/admin/categories", label: "Статьи прихода/расхода", icon: "🏷️" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px", fontWeight: "bold", fontSize: "1.25rem", borderBottom: "1px solid #e2e8f0", color: "#1e293b" }}>
          Cash Admin
        </div>
        <nav style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  textDecoration: "none",
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "#2563eb" : "#64748b",
                  background: isActive ? "#eff6ff" : "transparent",
                  transition: "all 0.2s"
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div style={{ padding: "16px", borderTop: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#64748b", display: "flex", alignItems: "center", gap: "8px", fontWeight: "500" }}>
            <span>⬅️</span> В кассу
          </Link>
          <form action="/api/auth/logout" method="POST">
             <button type="submit" style={{ width: "100%", background: "#fee2e2", color: "#dc2626", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
               <span>🚪</span> Выйти
             </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}

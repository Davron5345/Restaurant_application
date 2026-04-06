"use client";

import { useState } from "react";

export default function Modal({
  title,
  triggerText,
  children,
  triggerStyle = "primary" // "primary", "secondary", "danger"
}: {
  title: string;
  triggerText: string;
  children: React.ReactNode;
  triggerStyle?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonStyle = () => {
    switch(triggerStyle) {
      case "primary": return { background: "#2563eb", color: "white", padding: "10px 16px", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", boxShadow: "0 2px 4px rgba(37,99,235,0.2)" };
      case "secondary": return { background: "#f1f5f9", color: "#475569", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", border: "none", cursor: "pointer" };
      case "danger": return { background: "#fee2e2", color: "#dc2626", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", border: "none", cursor: "pointer" };
      case "ghost": return { background: "transparent", color: "#2563eb", padding: "8px", borderRadius: "6px", fontWeight: "bold", border: "none", cursor: "pointer" };
    }
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} style={getButtonStyle()}>
        {triggerText}
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          animation: "fadeIn 0.2s ease-out"
        }}
        onClick={() => setIsOpen(false)}>
          <div style={{
            background: "white",
            width: "100%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          onClick={e => e.stopPropagation()}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid #f1f5f9"
            }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>{title}</h2>
              <button onClick={() => setIsOpen(false)} style={{
                background: "transparent", border: "none", fontSize: "1.5rem", color: "#94a3b8", cursor: "pointer", lineHeight: 1
              }}>&times;</button>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Children (usually forms) will go here. We can intercept submits but NextJs Action reloads anyway. */}
              {children}
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
          `}</style>
        </div>
      )}
    </>
  );
}

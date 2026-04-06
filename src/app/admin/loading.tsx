export default function Loading() {
  return (
    <div style={{ padding: "48px", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
      <div style={{ 
        color: "#64748b", 
        fontSize: "1.1rem", 
        display: "flex", 
        alignItems: "center", 
        gap: "12px",
        fontWeight: "500"
      }}>
        <div style={{
          width: "24px",
          height: "24px",
          border: "3px solid #e2e8f0",
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        Загрузка данных...
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

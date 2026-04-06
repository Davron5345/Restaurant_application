"use client";

import { useState, useRef } from "react";

export default function ImageUploader({ defaultImage, name }: { defaultImage: string, name: string }) {
  const [imageStr, setImageStr] = useState<string>(defaultImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
       alert("Пожалуйста, выберите изображение.");
       return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
       setImageStr(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageStr("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>Логотип</label>
      <input type="hidden" name={name} value={imageStr} />
      
      {imageStr ? (
         <div style={{ position: "relative", width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <img src={imageStr} alt="Logo preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button 
              type="button" 
              onClick={removeImage}
              style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(220, 38, 38, 0.9)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold" }}
            >
              &times;
            </button>
         </div>
      ) : (
         <div 
           onClick={() => fileInputRef.current?.click()}
           style={{ width: "100px", height: "100px", border: "2px dashed #cbd5e1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#f8fafc", color: "#94a3b8", fontSize: "24px", transition: "border 0.2s" }}
         >
           +
         </div>
      )}
      
      <input 
         type="file" 
         accept="image/*" 
         ref={fileInputRef} 
         style={{ display: "none" }} 
         onChange={handleImageChange} 
      />
    </div>
  );
}

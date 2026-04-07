"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Branch { id: string; name: string; }
interface Category { id: string; name: string; type: string; }
interface Supplier { id: string; name: string; }

export default function CashRegisterClient({ 
  user, branches, categories, suppliers 
}: { 
  user: any; branches: Branch[]; categories: Category[]; suppliers: Supplier[] 
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [date, setDate] = useState("");
  const [activeBranchId, setActiveBranchId] = useState(branches.length > 0 ? branches[0].id : "");
  const [startBalance, setStartBalance] = useState("0");
  const [endBalance, setEndBalance] = useState("0");
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
  }, []);

  const [incomes, setIncomes] = useState([
    { id: 1, article: "Излишка", partner: "", amount: "", comment: "" },
    { id: 2, article: "Савдо сотилган овкатдан", partner: "", amount: "", comment: "" },
    { id: 3, article: "Сумма на начало", partner: "", amount: "", comment: "" },
    { id: 4, article: "", partner: "", amount: "", comment: "" },
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, article: "Недостача", partner: "", amount: "", comment: "" },
    { id: 2, article: "А.Т. ойлик", partner: "", amount: "", comment: "" },
    { id: 3, article: "Сумма на конец", partner: "", amount: "", comment: "" },
    { id: 4, article: "", partner: "", amount: "", comment: "" },
  ]);

  const isAdmin = ["ADMIN", "FOUNDER", "MANAGER"].includes(user.role);

  const parseNum = (str: string) => {
    if (!str) return 0;
    return parseFloat(str.replace(/\s+/g, '').replace(',', '.')) || 0;
  };

  const formatNum = (val: string | number) => {
    if (!val) return "";
    let str = val.toString().replace(/\s+/g, '').replace('.', ',');
    let parts = str.split(',');
    let intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts[1] ? `${intPart},${parts[1]}` : intPart;
  };

  const totalIncome = incomes.reduce((sum, item) => sum + parseNum(item.amount), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + parseNum(item.amount), 0);

  const handleAmountChange = (arr: any[], setArr: any, idx: number, value: string) => {
    const rawValue = value.replace(/[^\d,]/g, '');
    const newArr = [...arr];
    newArr[idx].amount = formatNum(rawValue);
    setArr(newArr);
  };

  const handlePartnerChange = (arr: any[], setArr: any, idx: number, value: string) => {
    const newArr = [...arr];
    newArr[idx].partner = value;
    setArr(newArr);
  };

  const addIncomeRow = () => setIncomes([...incomes, { id: Date.now(), article: "", partner: "", amount: "", comment: "" }]);
  const addExpenseRow = () => setExpenses([...expenses, { id: Date.now(), article: "", partner: "", amount: "", comment: "" }]);
  const removeIncomeRow = (id: number) => incomes.length > 4 && setIncomes(incomes.filter(inc => inc.id !== id));
  const removeExpenseRow = (id: number) => expenses.length > 4 && setExpenses(expenses.filter(exp => exp.id !== id));

  const handleSave = async () => {
    if (!activeBranchId) {
      alert("Выберите филиал!");
      return;
    }
    
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          branchId: activeBranchId,
          incomes,
          expenses
        })
      });

      if (res.ok) {
        alert("Записано успешно!");
        window.location.reload();
      } else {
        const err = await res.json();
        alert("Ошибка: " + err.error);
      }
    } catch (e) {
      alert("Ошибка соединения");
    }
  };

  const incomeCategories = categories.filter(c => c.type === "INCOME");
  const expenseCategories = categories.filter(c => c.type === "EXPENSE");

  const activeBranch = branches.find(b => b.id === activeBranchId);

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0", padding: "12px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        {/* Row 1: Branch selector + balances + date + admin link */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "12px" }}>
          
          {/* Left: branch selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontSize: "13px", color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>ФИЛИАЛ:</label>
            <select 
              value={activeBranchId} 
              onChange={e => setActiveBranchId(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", fontWeight: "bold", fontSize: "14px", minWidth: "140px" }}
            >
              {branches.length === 0 && <option value="">Нет филиалов</option>}
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Center: balances */}
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>СНН</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>{formatNum(startBalance)} сум</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>СНК</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>{formatNum(endBalance)} сум</div>
            </div>
          </div>

          {/* Right: date + admin button */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }}
            />
            {isAdmin && (
              <Link href="/admin" style={{ background: "#3b82f6", color: "white", padding: "6px 14px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "13px", whiteSpace: "nowrap" }}>
                ⬅ Админка
              </Link>
            )}
          </div>
        </div>

        {/* Row 2: Step tabs + Save */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", padding: "4px", borderRadius: "10px" }}>
            <button 
              onClick={() => setStep(1)}
              style={{
                padding: "8px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px",
                background: step === 1 ? "#2563eb" : "transparent",
                color: step === 1 ? "white" : "#64748b",
                transition: "all 0.2s"
              }}
            >
              ① Приход
            </button>
            <button 
              onClick={() => setStep(2)}
              style={{
                padding: "8px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px",
                background: step === 2 ? "#2563eb" : "transparent",
                color: step === 2 ? "white" : "#64748b",
                transition: "all 0.2s"
              }}
            >
              ② Расход
            </button>
          </div>
          <button 
            onClick={handleSave}
            style={{
              marginLeft: "auto", background: "#10b981", color: "white",
              border: "none", borderRadius: "8px", padding: "8px 24px",
              fontWeight: "bold", cursor: "pointer", fontSize: "14px",
              boxShadow: "0 2px 4px rgba(16,185,129,0.3)"
            }}
          >
            ✓ Записать
          </button>
        </div>
      </div>

      {/* ===== MAIN TABLE ===== */}
      <main style={{ maxWidth: "1100px", margin: "24px auto", padding: "0 24px" }}>
        {step === 1 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>№</th>
                  <th style={{ width: '25%' }}>Статья</th>
                  <th style={{ width: '20%' }}>От кого</th>
                  <th style={{ width: '20%' }}>Сумма</th>
                  <th style={{ width: '25%' }}>Комментарий</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{idx + 1}</td>
                    <td>
                      <select value={item.article} onChange={(e) => {
                          const newArr = [...incomes];
                          newArr[idx].article = e.target.value;
                          setIncomes(newArr);
                      }}>
                        {item.article && !incomeCategories.find(c => c.name === item.article) && <option value={item.article}>{item.article}</option>}
                        <option value="">Выберите статью</option>
                        {incomeCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </td>
                    <td>
                      <input type="text" placeholder="От кого" value={item.partner} onChange={(e) => handlePartnerChange(incomes, setIncomes, idx, e.target.value)} />
                    </td>
                    <td><input type="text" placeholder="0" value={item.amount} onChange={(e) => handleAmountChange(incomes, setIncomes, idx, e.target.value)} /></td>
                    <td><input type="text" placeholder="Комментарий" value={item.comment} onChange={(e) => { const a = [...incomes]; a[idx].comment = e.target.value; setIncomes(a); }} /></td>
                    <td>{idx >= 3 && <button className="btn-icon" onClick={() => removeIncomeRow(item.id)}>✕</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="add-btn-container">
              <button className="btn-primary" onClick={addIncomeRow}><span style={{ fontSize: '18px' }}>+</span> Добавить строку</button>
            </div>
            
            <div className="totals-bar">Итого приход: <span className="totals-value">{formatNum(totalIncome)} сум</span></div>
          </div>
        )}

        {step === 2 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>№</th>
                  <th style={{ width: '25%' }}>Статья</th>
                  <th style={{ width: '20%' }}>Кому / Поставщик</th>
                  <th style={{ width: '20%' }}>Сумма</th>
                  <th style={{ width: '25%' }}>Комментарий</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{idx + 1}</td>
                    <td>
                      <select value={item.article} onChange={(e) => {
                          const newArr = [...expenses];
                          newArr[idx].article = e.target.value;
                          setExpenses(newArr);
                      }}>
                        {item.article && !expenseCategories.find(c => c.name === item.article) && <option value={item.article}>{item.article}</option>}
                        <option value="">Выберите статью</option>
                        {expenseCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </td>
                    <td>
                      {item.article === "Поставщики" || item.article === "Поставщик" ? (
                         <select value={item.partner} onChange={(e) => handlePartnerChange(expenses, setExpenses, idx, e.target.value)}>
                            <option value="">Выберите поставщика...</option>
                            {suppliers.map(sup => <option key={sup.id} value={sup.name}>{sup.name}</option>)}
                         </select>
                      ) : (
                         <input type="text" placeholder="Кому" value={item.partner} onChange={(e) => handlePartnerChange(expenses, setExpenses, idx, e.target.value)} />
                      )}
                    </td>
                    <td><input type="text" placeholder="0" value={item.amount} onChange={(e) => handleAmountChange(expenses, setExpenses, idx, e.target.value)} /></td>
                    <td><input type="text" placeholder="Комментарий" value={item.comment} onChange={(e) => { const a = [...expenses]; a[idx].comment = e.target.value; setExpenses(a); }} /></td>
                    <td>{idx >= 3 && <button className="btn-icon" onClick={() => removeExpenseRow(item.id)}>✕</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="add-btn-container">
              <button className="btn-primary" onClick={addExpenseRow}><span style={{ fontSize: '18px' }}>+</span> Добавить строку</button>
            </div>
            
            <div className="totals-bar">Итого расход: <span className="totals-value">{formatNum(totalExpense)} сум</span></div>
          </div>
        )}
      </main>
    </>
  );
}

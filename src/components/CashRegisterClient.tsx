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
  // Start/End balances are hardcoded for now, real calculation would require fetching from db based on activeBranchId
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

  return (
    <>
      <header className="header" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Касса</h2>
           {isAdmin && (
             <Link href="/admin" style={{ background: "#f87171", color: "white", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
               ⬅ В админку
             </Link>
           )}
        </div>
        <div className="header-balances" style={{ flexWrap: 'wrap' }}>
          <div className="balance-card" style={{ display: 'flex', gap: '8px', minWidth: '200px' }}>
            <span style={{ whiteSpace: 'nowrap' }}>Филиал:</span>
            <select 
              value={activeBranchId} 
              onChange={e => setActiveBranchId(e.target.value)}
              style={{ padding: "4px 8px", borderRadius: "6px", border: "none", outline: "none", background: "#f1f5f9", fontWeight: "bold", width: "100%" }}
            >
              {branches.length === 0 && <option value="">Нет доступных филиалов</option>}
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="balance-card">
            <span>СНН:</span>
            <strong>{formatNum(startBalance)} сум</strong>
          </div>
          <div className="balance-card">
            <span>СНК:</span>
            <strong>{formatNum(endBalance)} сум</strong>
          </div>
          <div>
            <input 
              type="date" 
              className="date-picker" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
            />
          </div>
        </div>

        <div className="stepper" style={{display: 'flex', gap: '8px'}}>
          <button className={`step-btn ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}><span className="num">1</span> Приход</button>
          <button className={`step-btn ${step === 2 ? 'active' : ''}`} onClick={() => setStep(2)}><span className="num">2</span> Расход</button>
          <button className="step-btn" style={{ marginLeft: 'auto', background: '#10b981', color: 'white', fontWeight: 'bold' }} onClick={handleSave}>
            Записать
          </button>
        </div>
      </header>

      <main className="main-container">
        {step === 1 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>№</th>
                  <th style={{ width: '25%' }}>Статья</th>
                  <th style={{ width: '25%' }}>От кого</th>
                  <th style={{ width: '20%' }}>Сумма (сум)</th>
                  <th style={{ width: '25%' }}>Комментарии</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
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
                  <th style={{ width: '25%' }}>Кому (Поставщик)</th>
                  <th style={{ width: '20%' }}>Сумма (сум)</th>
                  <th style={{ width: '25%' }}>Комментарии</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
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

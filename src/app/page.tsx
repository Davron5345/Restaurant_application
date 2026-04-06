"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CashRegisterApp() {
  const [step, setStep] = useState<1 | 2>(1);
  const [date, setDate] = useState("");
  const [startBalance, setStartBalance] = useState("0");
  const [endBalance, setEndBalance] = useState("0");
  const router = useRouter();

  useEffect(() => {
    // Set default date to today
    const today = new Date();
    const formatted = today.toISOString().split("T")[0];
    setDate(formatted);
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
    // Only allow digits and comma
    const rawValue = value.replace(/[^\d,]/g, '');
    const newArr = [...arr];
    newArr[idx].amount = formatNum(rawValue);
    setArr(newArr);
  };

  const addIncomeRow = () => {
    setIncomes([...incomes, { id: Date.now(), article: "", partner: "", amount: "", comment: "" }]);
  };

  const addExpenseRow = () => {
    setExpenses([...expenses, { id: Date.now(), article: "", partner: "", amount: "", comment: "" }]);
  };

  const removeIncomeRow = (id: number) => {
    if (incomes.length > 4) {
      setIncomes(incomes.filter(inc => inc.id !== id));
    }
  };

  const removeExpenseRow = (id: number) => {
    if (expenses.length > 4) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
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

  return (
    <>
      <header className="header">
        <div className="header-balances">
          <div className="balance-card">
            <span>MAHALLA 90 СНН:</span>
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
          <button 
            className={`step-btn ${step === 1 ? 'active' : ''}`}
            onClick={() => setStep(1)}
          >
            <span className="num">1</span> Приход
          </button>
          <button 
            className={`step-btn ${step === 2 ? 'active' : ''}`}
            onClick={() => setStep(2)}
          >
            <span className="num">2</span> Расход
          </button>
          <button 
            className="step-btn"
            style={{ marginLeft: '12px', background: '#10b981', color: 'white', fontWeight: 'bold' }}
            onClick={handleSave}
          >
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
                  <th style={{ width: '20%' }}>Сумма</th>
                  <th style={{ width: '25%' }}>Комментарии</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <select 
                        value={item.article} 
                        onChange={(e) => {
                          const newArr = [...incomes];
                          newArr[idx].article = e.target.value;
                          setIncomes(newArr);
                        }}
                      >
                        {item.article && <option value={item.article}>{item.article}</option>}
                        {!item.article && <option value="">Выберите статью</option>}
                        <option value="Излишка">Излишка</option>
                        <option value="Савдо сотилган овкатдан">Савдо сотилган овкатдан</option>
                        <option value="Сумма на начало">Сумма на начало</option>
                        <option value="Прочее">Прочее</option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        placeholder="От кого"
                        value={item.partner}
                        onChange={(e) => {
                          const newArr = [...incomes];
                          newArr[idx].partner = e.target.value;
                          setIncomes(newArr);
                        }}
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        placeholder="0"
                        value={item.amount}
                        onChange={(e) => handleAmountChange(incomes, setIncomes, idx, e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        placeholder="Комментарии"
                        value={item.comment}
                        onChange={(e) => {
                          const newArr = [...incomes];
                          newArr[idx].comment = e.target.value;
                          setIncomes(newArr);
                        }}
                      />
                    </td>
                    <td>
                      {idx >= 3 && (
                        <button className="btn-icon" onClick={() => removeIncomeRow(item.id)}>
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="add-btn-container">
              <button className="btn-primary" onClick={addIncomeRow}>
                <span style={{ fontSize: '18px' }}>+</span> Добавить строку
              </button>
            </div>
            
            <div className="totals-bar">
              Итого приход: <span className="totals-value">{formatNum(totalIncome)} сум</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>№</th>
                  <th style={{ width: '25%' }}>Статья</th>
                  <th style={{ width: '25%' }}>Кому</th>
                  <th style={{ width: '20%' }}>Сумма</th>
                  <th style={{ width: '25%' }}>Комментарии</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <select 
                        value={item.article} 
                        onChange={(e) => {
                          const newArr = [...expenses];
                          newArr[idx].article = e.target.value;
                          setExpenses(newArr);
                        }}
                      >
                        {item.article && <option value={item.article}>{item.article}</option>}
                        {!item.article && <option value="">Выберите статью</option>}
                        <option value="Недостача">Недостача</option>
                        <option value="А.Т. ойлик">А.Т. ойлик</option>
                        <option value="Терминал">Терминал</option>
                        <option value="Сумма на конец">Сумма на конец</option>
                        <option value="Поставщики">Поставщики</option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        placeholder="Кому"
                        value={item.partner}
                        onChange={(e) => {
                          const newArr = [...expenses];
                          newArr[idx].partner = e.target.value;
                          setExpenses(newArr);
                        }}
                      />
                    </td>
                    <td>
                        <input 
                          type="text" 
                          placeholder="0"
                          value={item.amount}
                          onChange={(e) => handleAmountChange(expenses, setExpenses, idx, e.target.value)}
                        />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        placeholder="Комментарии"
                        value={item.comment}
                        onChange={(e) => {
                          const newArr = [...expenses];
                          newArr[idx].comment = e.target.value;
                          setExpenses(newArr);
                        }}
                      />
                    </td>
                    <td>
                      {idx >= 3 && (
                        <button className="btn-icon" onClick={() => removeExpenseRow(item.id)}>
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="add-btn-container">
              <button className="btn-primary" onClick={addExpenseRow}>
                <span style={{ fontSize: '18px' }}>+</span> Добавить строку
              </button>
            </div>
            
            <div className="totals-bar">
              Итого расход: <span className="totals-value">{formatNum(totalExpense)} сум</span>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

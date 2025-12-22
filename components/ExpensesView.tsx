
import React, { useState } from 'react';
import { Expense, Transaction } from '../types';

interface ExpensesViewProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  transactions: Transaction[];
}

const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, setExpenses, transactions }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: 0,
    category: 'Supplies'
  });

  const categories = ['Supplies', 'Utilities', 'Rent', 'Wages', 'Maintenance', 'Marketing', 'Other'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  // Metrics
  const todayExpenses = expenses.filter(e => {
    const d = new Date(e.timestamp);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).reduce((sum, e) => sum + e.amount, 0);

  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.timestamp);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const monthlyExpenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Monthly breakdown for table
  const dailyBreakdown: Record<string, number> = {};
  monthExpenses.forEach(e => {
    const dateStr = new Date(e.timestamp).toLocaleDateString();
    dailyBreakdown[dateStr] = (dailyBreakdown[dateStr] || 0) + e.amount;
  });

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: Number(newExpense.amount),
        category: newExpense.category,
        timestamp: new Date()
      };
      setExpenses(prev => [expense, ...prev]);
      setNewExpense({ description: '', amount: 0, category: 'Supplies' });
      setIsAdding(false);
    }
  };

  const removeExpense = (id: string) => {
    if (confirm('Delete this expense record?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today);

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Today's Expenses</p>
          <h3 className="text-4xl font-bold text-red-500 font-serif">${todayExpenses.toFixed(2)}</h3>
          <p className="text-xs text-slate-500 mt-2">Daily operational costs</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Monthly Expenses ({monthName})</p>
          <h3 className="text-4xl font-bold text-slate-800 font-serif">${monthlyExpenseTotal.toFixed(2)}</h3>
          <p className="text-xs text-slate-500 mt-2">{monthExpenses.length} expense entries</p>
        </div>

        <div className={`p-6 rounded-2xl shadow-md text-white ${netIncome >= 0 ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <p className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-2">Latest Net Profit</p>
          <h3 className="text-4xl font-bold font-serif">
            ${netIncome.toFixed(2)}
          </h3>
          <p className="text-xs opacity-70 mt-2">All time Revenue - Expenses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily History Table (Monthly Report) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-slate-800">Daily Expense History</h4>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">{monthName} {thisYear}</span>
          </div>
          <div className="max-h-[350px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {Object.entries(dailyBreakdown).length > 0 ? (
                  Object.entries(dailyBreakdown)
                    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                    .map(([date, amount]) => (
                    <tr key={date} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{date}</td>
                      <td className="px-6 py-4 text-sm text-red-600 font-bold text-right">-${amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-10 text-center text-slate-400 text-sm italic">No records found for this month.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Expense Categories (Pie/List view) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h4 className="font-bold text-slate-800">Expenses by Category</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categories.map(cat => {
                const catTotal = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
                const percentage = totalExpenses > 0 ? (catTotal / totalExpenses) * 100 : 0;
                if (catTotal === 0) return null;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-600">{cat}</span>
                      <span className="font-bold text-slate-800">${catTotal.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-red-400 h-full rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {totalExpenses === 0 && (
                <p className="text-center py-10 text-slate-400 text-sm italic">No expense data to display.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expense Management Header */}
      <div className="flex justify-between items-center pt-4">
        <h2 className="text-xl font-semibold text-slate-700">Detailed Expense Logs</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-sm flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add New Expense</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border-2 border-red-100 shadow-xl space-y-4 max-w-2xl mx-auto">
          <h3 className="font-bold text-slate-800 flex items-center space-x-2">
            <span className="text-red-500">💸</span>
            <span>Record Business Cost</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
              <input 
                type="text" 
                placeholder="e.g. Weekly Groceries" 
                className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Amount ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
              <select 
                className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none bg-white"
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-slate-700 px-4 py-2 font-medium">Cancel</button>
            <button 
              onClick={handleAddExpense} 
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-semibold"
            >
              Save Record
            </button>
          </div>
        </div>
      )}

      {/* Individual Expense Records */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Description</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(expense.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">
                  {expense.description}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-red-600 text-right">
                  -${expense.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => removeExpense(expense.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                  No detailed records. Record your first expense to see the logs.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesView;

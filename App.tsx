
import React, { useState, useEffect } from 'react';
import { Table, MenuItem, OrderItem, RestaurantData, OrderItemStatus, Transaction, Expense } from './types';
import TableGrid from './components/TableGrid';
import MenuManager from './components/MenuManager';
import OrderInterface from './components/OrderInterface';
import ReceiptModal from './components/ReceiptModal';
import Sidebar from './components/Sidebar';
import KitchenView from './components/KitchenView';
import RevenueView from './components/RevenueView';
import ExpensesView from './components/ExpensesView';
import OrderHistoryView from './components/OrderHistoryView';

const RESTAURANT_INFO: RestaurantData = {
  name: "DaporKu Bistro",
  address: "123 Culinary Ave, Foodie City",
  phone: "(555) 012-3456"
};

const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  number: (i + 1).toString().padStart(2, '0'),
  status: 'Available'
}));

const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Nasi Goreng Special', price: 12.50, category: 'Food', description: 'Fragrant fried rice with shrimp and sunny side up egg.' },
  { id: '2', name: 'Beef Rendang', price: 15.00, category: 'Food', description: 'Slow-cooked beef in rich coconut milk and spices.' },
  { id: '3', name: 'Iced Teh Tarik', price: 3.50, category: 'Drink', description: 'Frothy pulled tea with condensed milk.' },
  { id: '4', name: 'Es Campur', price: 5.50, category: 'Dessert', description: 'Mixed shaved ice with tropical fruits and jellies.' },
];

const App: React.FC = () => {
  const [view, setView] = useState<'tables' | 'menu' | 'kitchen' | 'revenue' | 'expenses' | 'history'>('tables');

  // Helper to load data from localStorage
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
      const parsed = JSON.parse(stored);
      // Revive dates if it's an array of objects that might contain date strings
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          const revived = { ...item };
          if (revived.orderStartTime) revived.orderStartTime = new Date(revived.orderStartTime);
          if (revived.timestamp) revived.timestamp = new Date(revived.timestamp);
          return revived;
        }) as unknown as T;
      }
      return parsed as T;
    } catch (e) {
      console.error(`Error loading ${key} from storage`, e);
      return defaultValue;
    }
  };

  const [tables, setTables] = useState<Table[]>(() => loadFromStorage('daporku_tables', INITIAL_TABLES));
  const [menu, setMenu] = useState<MenuItem[]>(() => loadFromStorage('daporku_menu', INITIAL_MENU));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage('daporku_transactions', []));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadFromStorage('daporku_expenses', []));

  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [receiptTable, setReceiptTable] = useState<Table | null>(null);

  // Persistence Effects
  useEffect(() => localStorage.setItem('daporku_tables', JSON.stringify(tables)), [tables]);
  useEffect(() => localStorage.setItem('daporku_menu', JSON.stringify(menu)), [menu]);
  useEffect(() => localStorage.setItem('daporku_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('daporku_expenses', JSON.stringify(expenses)), [expenses]);

  const activeTable = tables.find(t => t.id === selectedTableId);

  const handlePlaceOrder = (tableId: number, order: OrderItem[]) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'Occupied',
          currentOrder: order,
          orderStartTime: t.orderStartTime || new Date()
        };
      }
      return t;
    }));
    setSelectedTableId(null);
  };

  const updateOrderItemStatus = (tableId: number, itemId: string, newStatus: OrderItemStatus) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId && t.currentOrder) {
        return {
          ...t,
          currentOrder: t.currentOrder.map(item => 
            item.id === itemId ? { ...item, status: newStatus } : item
          )
        };
      }
      return t;
    }));
  };

  const finalizePayment = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.currentOrder) {
      const subtotal = table.currentOrder.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        tableNumber: table.number,
        items: table.currentOrder,
        subtotal: subtotal,
        tax: 0,
        total: subtotal,
        timestamp: new Date()
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      setTables(prev => prev.map(t => 
        t.id === tableId ? { ...t, status: 'Available', currentOrder: [], orderStartTime: undefined } : t
      ));
    }
    setReceiptTable(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 font-serif">
            {view === 'tables' ? 'Floor Plan' : 
             view === 'menu' ? 'Menu Management' : 
             view === 'kitchen' ? 'Kitchen Dashboard' : 
             view === 'revenue' ? 'Revenue Report' : 
             view === 'history' ? 'Order History' : 'Expense Management'}
          </h1>
          <p className="text-slate-500">
            {view === 'tables' ? 'Manage table occupancy and active orders.' : 
             view === 'menu' ? 'Add or modify items in your digital menu.' :
             view === 'kitchen' ? 'Live order tracking for preparation and service.' : 
             view === 'revenue' ? 'Track your sales performance and monthly earnings.' :
             view === 'history' ? 'Review all past orders and table activities.' :
             'Track operational costs and calculate net income.'}
          </p>
        </header>

        {view === 'tables' && (
          <TableGrid 
            tables={tables} 
            onSelectTable={(id) => setSelectedTableId(id)} 
          />
        )}
        
        {view === 'menu' && (
          <MenuManager 
            menu={menu} 
            setMenu={setMenu} 
          />
        )}

        {view === 'kitchen' && (
          <KitchenView 
            tables={tables}
            onUpdateItemStatus={updateOrderItemStatus}
          />
        )}

        {view === 'revenue' && (
          <RevenueView transactions={transactions} />
        )}

        {view === 'history' && (
          <OrderHistoryView transactions={transactions} />
        )}

        {view === 'expenses' && (
          <ExpensesView 
            expenses={expenses} 
            setExpenses={setExpenses} 
            transactions={transactions}
          />
        )}
      </main>

      {selectedTableId !== null && activeTable && (
        <OrderInterface 
          table={activeTable}
          menu={menu}
          onClose={() => setSelectedTableId(null)}
          onPlaceOrder={(order) => handlePlaceOrder(activeTable.id, order)}
          onCheckout={() => setReceiptTable(activeTable)}
        />
      )}

      {receiptTable && (
        <ReceiptModal 
          table={receiptTable} 
          restaurantInfo={RESTAURANT_INFO}
          onClose={() => setReceiptTable(null)}
          onPaid={() => finalizePayment(receiptTable.id)}
        />
      )}
    </div>
  );
};

export default App;

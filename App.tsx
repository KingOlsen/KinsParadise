
import React, { useState } from 'react';
import { Table, MenuItem, OrderItem, RestaurantData, OrderItemStatus, Transaction, Expense } from './types';
import TableGrid from './components/TableGrid';
import MenuManager from './components/MenuManager';
import OrderInterface from './components/OrderInterface';
import ReceiptModal from './components/ReceiptModal';
import Sidebar from './components/Sidebar';
import KitchenView from './components/KitchenView';
import RevenueView from './components/RevenueView';
import ExpensesView from './components/ExpensesView';

const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  number: `${i + 1}`,
  status: 'Available',
}));

const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Classic Burger', price: 12.99, category: 'Food', description: 'Juicy beef patty with fresh greens.' },
  { id: '2', name: 'Margherita Pizza', price: 14.50, category: 'Food', description: 'Classic tomato, mozzarella, and basil.' },
  { id: '3', name: 'Iced Latte', price: 4.50, category: 'Drink', description: 'Chilled espresso with creamy milk.' },
  { id: '4', name: 'Craft Beer', price: 7.00, category: 'Drink', description: 'Local brewery selection.' },
];

const RESTAURANT_INFO: RestaurantData = {
  name: "DaporKu Bistro",
  address: "123 Culinary Ave, Foodie City",
  phone: "(555) 012-3456"
};

const App: React.FC = () => {
  const [view, setView] = useState<'tables' | 'menu' | 'kitchen' | 'revenue' | 'expenses'>('tables');
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [receiptTable, setReceiptTable] = useState<Table | null>(null);

  const activeTable = tables.find(t => t.id === selectedTableId);

  const updateTableStatus = (tableId: number, status: Table['status'], order?: OrderItem[]) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status, currentOrder: order || t.currentOrder } : t
    ));
  };

  const updateOrderItemStatus = (tableId: number, itemId: string, newStatus: OrderItemStatus) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId && t.currentOrder) {
        const updatedOrder = t.currentOrder.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        return { ...t, currentOrder: updatedOrder };
      }
      return t;
    }));
  };

  const handlePlaceOrder = (tableId: number, order: OrderItem[]) => {
    updateTableStatus(tableId, 'Occupied', order);
    setSelectedTableId(null);
  };

  const handleCheckout = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      setReceiptTable(table);
    }
  };

  const finalizePayment = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.currentOrder) {
      const subtotal = table.currentOrder.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        tableNumber: table.number,
        items: [...table.currentOrder],
        subtotal: subtotal,
        tax: 0,
        total: subtotal,
        timestamp: new Date()
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
    updateTableStatus(tableId, 'Available', []);
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
             view === 'revenue' ? 'Revenue Report' : 'Expense Management'}
          </h1>
          <p className="text-slate-500">
            {view === 'tables' ? 'Manage table occupancy and active orders.' : 
             view === 'menu' ? 'Add or modify items in your digital menu.' :
             view === 'kitchen' ? 'Live order tracking for preparation and service.' : 
             view === 'revenue' ? 'Track your sales performance and monthly earnings.' :
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

        {view === 'expenses' && (
          <ExpensesView 
            expenses={expenses} 
            setExpenses={setExpenses} 
            transactions={transactions}
          />
        )}
      </main>

      {/* Overlays */}
      {selectedTableId !== null && activeTable && (
        <OrderInterface 
          table={activeTable}
          menu={menu}
          onClose={() => setSelectedTableId(null)}
          onPlaceOrder={(order) => handlePlaceOrder(activeTable.id, order)}
          onCheckout={() => handleCheckout(activeTable.id)}
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

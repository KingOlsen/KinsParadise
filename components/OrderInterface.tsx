
import React, { useState } from 'react';
import { Table, MenuItem, OrderItem } from '../types';

interface OrderInterfaceProps {
  table: Table;
  menu: MenuItem[];
  onClose: () => void;
  onPlaceOrder: (order: OrderItem[]) => void;
  onCheckout: () => void;
}

const OrderInterface: React.FC<OrderInterfaceProps> = ({ table, menu, onClose, onPlaceOrder, onCheckout }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>(table.currentOrder || []);
  const [activeTab, setActiveTab] = useState<'Food' | 'Drink' | 'Dessert'>('Food');

  const addToOrder = (item: MenuItem) => {
    setCurrentOrder(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, status: 'Pending' }];
    });
  };

  const removeFromOrder = (id: string) => {
    setCurrentOrder(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col">
        <header className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Table {table.number}</h2>
            <p className="text-slate-400 text-sm">Active Order Management</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Menu Selection */}
          <div className="flex-1 border-r border-slate-100 overflow-y-auto p-4">
            <div className="flex space-x-2 mb-4">
              {(['Food', 'Drink', 'Dessert'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                    activeTab === cat ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menu.filter(item => item.category === activeTab).map(item => (
                <button
                  key={item.id}
                  onClick={() => addToOrder(item)}
                  className="p-3 border border-slate-100 rounded-xl hover:border-orange-200 hover:bg-orange-50 text-left transition group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-orange-600 transition">{item.name}</div>
                  <div className="text-sm text-slate-500">${item.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Basket */}
          <div className="w-80 flex flex-col bg-slate-50">
            <div className="p-4 bg-slate-800 text-white font-semibold">Order Summary</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentOrder.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-60">
                  <span className="text-4xl">🍽️</span>
                  <p className="text-sm">No items selected</p>
                </div>
              ) : (
                currentOrder.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{item.name}</div>
                      <div className="text-xs text-slate-500">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button onClick={() => removeFromOrder(item.id)} className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center">-</button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => addToOrder(item)} className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600 flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 bg-white border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-800">${total.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onPlaceOrder(currentOrder)}
                  disabled={currentOrder.length === 0}
                  className="bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 disabled:opacity-50"
                >
                  Send to Kitchen
                </button>
                <button 
                  onClick={onCheckout}
                  disabled={currentOrder.length === 0}
                  className="bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInterface;

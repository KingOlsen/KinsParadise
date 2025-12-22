
import React, { useState } from 'react';
import { MenuItem, Category } from '../types';
import { generateMenuDescription } from '../services/geminiService';

interface MenuManagerProps {
  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const MenuManager: React.FC<MenuManagerProps> = ({ menu, setMenu }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'Food',
    description: ''
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        price: Number(newItem.price),
        category: newItem.category as Category,
        description: newItem.description
      };
      setMenu(prev => [...prev, item]);
      setNewItem({ name: '', price: 0, category: 'Food', description: '' });
      setIsAdding(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!newItem.name) return;
    setLoadingAI(true);
    const desc = await generateMenuDescription(newItem.name, newItem.category || 'Food');
    setNewItem(prev => ({ ...prev, description: desc }));
    setLoadingAI(false);
  };

  const removeItem = (id: string) => {
    setMenu(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-700">Current Menu</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition shadow-sm flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add New Item</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md space-y-4">
          <h3 className="font-bold text-slate-800">Add New Dish or Drink</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Item Name" 
              className="border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-200 outline-none"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Price ($)" 
              className="border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-200 outline-none"
              value={newItem.price || ''}
              onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
            />
            <select 
              className="border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-200 outline-none"
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value as Category})}
            >
              <option value="Food">Food</option>
              <option value="Drink">Drink</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>
          <div className="relative">
            <textarea 
              placeholder="Description (optional)" 
              className="w-full border border-slate-200 rounded-lg p-2 h-20 focus:ring-2 focus:ring-orange-200 outline-none pr-32"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
            />
            <button 
              onClick={handleGenerateDescription}
              disabled={loadingAI || !newItem.name}
              className="absolute right-2 bottom-2 text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md border border-indigo-100 hover:bg-indigo-100 disabled:opacity-50"
            >
              {loadingAI ? 'Generating...' : '✨ AI Description'}
            </button>
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setIsAdding(false)} className="text-slate-500 px-4 py-2">Cancel</button>
            <button onClick={handleAddItem} className="bg-slate-800 text-white px-6 py-2 rounded-lg">Save Item</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {menu.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-400 line-clamp-1">{item.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.category === 'Food' ? 'bg-amber-100 text-amber-700' : 
                    item.category === 'Drink' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManager;

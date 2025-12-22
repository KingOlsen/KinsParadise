
import React from 'react';

interface SidebarProps {
  currentView: 'tables' | 'menu' | 'kitchen' | 'revenue' | 'expenses';
  setView: (view: 'tables' | 'menu' | 'kitchen' | 'revenue' | 'expenses') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const NavItem = ({ id, label, icon }: { id: 'tables' | 'menu' | 'kitchen' | 'revenue' | 'expenses', label: string, icon: string }) => (
    <button
      onClick={() => setView(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === id 
          ? 'bg-orange-500 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="hidden md:block font-medium">{label}</span>
    </button>
  );

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col p-4 no-print">
      <div className="mb-8 flex items-center space-x-2 px-2">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">D</div>
        <span className="hidden md:block text-xl font-bold text-slate-800 tracking-tight">DaporKu</span>
      </div>
      
      <nav className="space-y-2 flex-1">
        <NavItem id="tables" label="Tables" icon="🪑" />
        <NavItem id="kitchen" label="Kitchen" icon="👨‍🍳" />
        <NavItem id="menu" label="Menu" icon="📖" />
        <NavItem id="revenue" label="Revenue" icon="📊" />
        <NavItem id="expenses" label="Expenses" icon="💸" />
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-100 text-center md:text-left">
        <div className="hidden md:block">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">System Status</p>
          <div className="flex items-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600">Kitchen Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

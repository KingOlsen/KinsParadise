
import React from 'react';
import { Table, OrderItemStatus } from '../types';

interface KitchenViewProps {
  tables: Table[];
  onUpdateItemStatus: (tableId: number, itemId: string, status: OrderItemStatus) => void;
}

const KitchenView: React.FC<KitchenViewProps> = ({ tables, onUpdateItemStatus }) => {
  const tablesWithOrders = tables.filter(t => t.currentOrder && t.currentOrder.length > 0);

  if (tablesWithOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="text-6xl mb-4">💤</div>
        <h3 className="text-xl font-medium">No active orders right now.</h3>
        <p>The kitchen is quiet... for now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tablesWithOrders.map(table => (
        <div key={table.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">Table</span>
              <h3 className="text-2xl font-bold leading-none">{table.number}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase bg-orange-500 px-2 py-0.5 rounded-full">Active</span>
            </div>
          </header>
          
          <div className="flex-1 p-4 space-y-2">
            {table.currentOrder?.map(item => (
              <button
                key={item.id}
                onClick={() => onUpdateItemStatus(table.id, item.id, item.status === 'Pending' ? 'Ready' : 'Pending')}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                  item.status === 'Ready' 
                    ? 'bg-green-50 border-green-200 opacity-60' 
                    : 'bg-white border-slate-100 hover:border-orange-200'
                }`}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">{item.quantity}x</span>
                    <span className={`font-medium truncate ${item.status === 'Ready' ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{item.category}</span>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.status === 'Ready' 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-slate-200 group-hover:border-orange-400'
                }`}>
                  {item.status === 'Ready' && '✓'}
                </div>
              </button>
            ))}
          </div>

          <footer className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
             <span className="text-xs text-slate-400 font-medium">
                {table.currentOrder?.filter(i => i.status === 'Ready').length} / {table.currentOrder?.length} Items Ready
             </span>
             {table.currentOrder?.every(i => i.status === 'Ready') && (
               <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md">Fully Prepared</span>
             )}
          </footer>
        </div>
      ))}
    </div>
  );
};

export default KitchenView;

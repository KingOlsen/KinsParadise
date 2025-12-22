
import React from 'react';
import { Table } from '../types';

interface TableGridProps {
  tables: Table[];
  onSelectTable: (id: number) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onSelectTable }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => onSelectTable(table.id)}
          className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
            table.status === 'Available'
              ? 'bg-white border-slate-200 text-slate-600 hover:border-orange-200 hover:shadow-lg'
              : table.status === 'Occupied'
              ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          <span className="text-sm font-semibold uppercase tracking-widest mb-1">Table</span>
          <span className="text-4xl font-bold mb-2">{table.number}</span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              table.status === 'Available' ? 'bg-slate-300' : table.status === 'Occupied' ? 'bg-orange-500' : 'bg-green-500'
            }`}></div>
            <span className="text-xs font-medium">{table.status}</span>
          </div>
          {table.currentOrder && table.currentOrder.length > 0 && (
            <div className="mt-2 text-[10px] bg-white px-2 py-0.5 rounded-full border border-orange-100 shadow-sm">
              {table.currentOrder.length} items
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TableGrid;

import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  Package,
  X,
  Edit2
} from 'lucide-react';
import { PharmacyItem, UserRole } from '../types';

interface PharmacyViewProps {
  items: PharmacyItem[];
  onAddItem: (item: Partial<PharmacyItem>) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  currentRole: UserRole;
  darkMode: boolean;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  items,
  onAddItem,
  onUpdateStock,
  currentRole,
  darkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Antibiotics',
    stock: 200,
    unitPrice: 15.00,
    expiryDate: '2028-01-01',
    manufacturer: 'PharmaCorp',
    reorderLevel: 50
  });

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddItem(formData);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Pill className="w-6 h-6 text-purple-600" /> Hospital Pharmacy & Medicine Inventory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time drug stock monitoring, reorder alerts, expiry date tracking, and pharmaceutical dispenses
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-md hover:bg-purple-700 transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Drug Stock
          </button>
        )}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drug name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-3 py-2 text-xs rounded-xl border outline-none font-medium ${
            darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`border-b font-semibold uppercase text-[11px] tracking-wider text-slate-400 ${
              darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Drug Code</th>
                <th className="p-4">Medication Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">{item.code}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
                  <td className="p-4 text-slate-500">{item.category}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{item.stock} units</td>
                  <td className="p-4 font-semibold text-emerald-600">${item.unitPrice.toFixed(2)}</td>
                  <td className="p-4 font-mono text-slate-500">{item.expiryDate}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : item.status === 'Low Stock'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    {currentRole === 'admin' && (
                      <button
                        onClick={() => onUpdateStock(item.id, item.stock + 50)}
                        className="px-2 py-1 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-semibold text-[10px] hover:bg-purple-100"
                      >
                        + Restock (+50)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Drug Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-600" /> Add Pharmaceutical Item
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Medication Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="e.g. Ciprofloxacin 500mg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold shadow hover:bg-purple-700"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

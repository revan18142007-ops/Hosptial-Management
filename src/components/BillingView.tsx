import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Printer,
  DollarSign,
  Search,
  CheckCircle,
  Clock,
  X,
  FileText,
  Trash2
} from 'lucide-react';
import { Bill, Patient, UserRole, BillItem } from '../types';

interface BillingViewProps {
  bills: Bill[];
  patients: Patient[];
  onCreateBill: (b: Partial<Bill>) => void;
  onUpdateBillStatus: (id: string, status: 'Paid' | 'Unpaid') => void;
  currentRole: UserRole;
  darkMode: boolean;
}

export const BillingView: React.FC<BillingViewProps> = ({
  bills,
  patients,
  onCreateBill,
  onUpdateBillStatus,
  currentRole,
  darkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState<Bill | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.patientId || '',
    items: [
      { id: 'bi-1', description: 'Specialist Consultation', quantity: 1, price: 150, amount: 150 }
    ] as BillItem[],
    discount: 0,
    paymentMethod: 'Credit Card' as any
  });

  const filtered = bills.filter(b => {
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
    const matchesSearch = b.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { id: `bi-${Date.now()}`, description: 'Laboratory Diagnostic Test', quantity: 1, price: 80, amount: 80 }
      ]
    });
  };

  const handleRemoveItemRow = (idx: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== idx)
    });
  };

  const handleItemChange = (idx: number, field: keyof BillItem, val: any) => {
    const updated = [...formData.items];
    const item = { ...updated[idx], [field]: val };
    if (field === 'quantity' || field === 'price') {
      item.amount = (Number(item.quantity) || 1) * (Number(item.price) || 0);
    }
    updated[idx] = item;
    setFormData({ ...formData, items: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.patientId === formData.patientId || p.id === formData.patientId);

    onCreateBill({
      patientId: pat?.patientId || formData.patientId,
      patientName: pat?.name || 'Inpatient',
      items: formData.items,
      discount: formData.discount,
      status: 'Unpaid',
      paymentMethod: formData.paymentMethod
    });

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" /> Revenue & Patient Billing System
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate hospital billing statements, itemize consultations and pharmacy charges, and issue tax invoices
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md hover:bg-emerald-700 transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Create New Invoice
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
            placeholder="Search invoice no or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
            }`}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={`px-3 py-2 text-xs rounded-xl border outline-none font-medium ${
            darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <option value="All">All Invoices</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      {/* Bills Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`border-b font-semibold uppercase text-[11px] tracking-wider text-slate-400 ${
              darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Invoice No</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Date & Due Date</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filtered.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{bill.invoiceNo}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                    {bill.patientName} <span className="text-[10px] text-slate-400 font-normal">({bill.patientId})</span>
                  </td>
                  <td className="p-4 text-slate-500 font-mono">
                    {bill.date} (Due: {bill.dueDate})
                  </td>
                  <td className="p-4 font-bold text-emerald-600 text-sm">
                    ${bill.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{bill.paymentMethod || 'Insurance'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      bill.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {bill.status === 'Unpaid' && currentRole === 'admin' && (
                      <button
                        onClick={() => onUpdateBillStatus(bill.id, 'Paid')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[10px] hover:bg-emerald-700"
                      >
                        Mark as Paid
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBillForPrint(bill)}
                      className="p-1.5 rounded-lg border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="View & Print Official Receipt"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Create Patient Bill / Tax Invoice
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Patient</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.patientId}>{p.name} ({p.patientId})</option>
                  ))}
                </select>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">Itemized Charges</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-[11px] font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Service Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        className={`flex-1 px-3 py-1.5 rounded-lg border text-xs outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className={`w-16 px-2 py-1.5 rounded-lg border text-xs outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Price $"
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, 'price', Number(e.target.value))}
                        className={`w-24 px-2 py-1.5 rounded-lg border text-xs outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      />
                      <span className="font-bold text-slate-900 dark:text-slate-100 w-20 text-right">${item.amount.toFixed(2)}</span>
                      {formData.items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItemRow(idx)} className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Bill Receipt Modal */}
      {selectedBillForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white text-slate-900 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b-2 border-slate-900 pb-4 mb-4">
              <h2 className="text-xl font-bold text-blue-900">METROPOLITAN HOSPITAL CENTER</h2>
              <p className="text-xs text-slate-500">Official Tax Invoice & Payment Receipt</p>
            </div>

            <div className="flex justify-between text-xs mb-4">
              <div>
                <p className="font-bold text-slate-800">{selectedBillForPrint.patientName}</p>
                <p className="text-slate-500">Patient ID: {selectedBillForPrint.patientId}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-blue-600">{selectedBillForPrint.invoiceNo}</p>
                <p className="text-slate-500">Date: {selectedBillForPrint.date}</p>
              </div>
            </div>

            <table className="w-full text-xs text-left mb-4 border-t border-b py-2">
              <thead>
                <tr className="text-slate-400 font-bold border-b">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedBillForPrint.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 font-medium">{item.description}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right font-mono">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-xs space-y-1 text-right mb-6">
              <p>Subtotal: <span className="font-mono">${selectedBillForPrint.subtotal.toFixed(2)}</span></p>
              <p>Tax (5%): <span className="font-mono">${selectedBillForPrint.tax.toFixed(2)}</span></p>
              <p className="text-base font-bold text-slate-900 border-t pt-1">
                Total Due: <span className="text-emerald-600">${selectedBillForPrint.totalAmount.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                onClick={() => setSelectedBillForPrint(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import {
  BarChart2,
  TrendingUp,
  Download,
  FileSpreadsheet,
  PieChart as PieIcon,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { Bill, Doctor, Patient, Appointment, PharmacyItem } from '../types';

interface ReportsViewProps {
  bills: Bill[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  pharmacyItems: PharmacyItem[];
  darkMode: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  bills,
  doctors,
  patients,
  appointments,
  pharmacyItems,
  darkMode
}) => {
  const totalRevenue = bills.reduce((acc, b) => acc + (b.status === 'Paid' ? b.totalAmount : 0), 0);
  const totalInvoices = bills.length;
  const paidInvoices = bills.filter(b => b.status === 'Paid').length;
  const collectionRate = totalInvoices > 0 ? ((paidInvoices / totalInvoices) * 100).toFixed(1) : '100';

  // Monthly Revenue Data
  const monthlyRevenue = [
    { month: 'Q1 Jan', consultations: 18000, lab: 12000, pharmacy: 8000 },
    { month: 'Q1 Feb', consultations: 21000, lab: 14000, pharmacy: 9500 },
    { month: 'Q1 Mar', consultations: 24000, lab: 16000, pharmacy: 11000 },
    { month: 'Q2 Apr', consultations: 28000, lab: 19000, pharmacy: 12500 },
    { month: 'Q2 May', consultations: 31000, lab: 21000, pharmacy: 14000 },
    { month: 'Q2 Jun', consultations: 35000, lab: 24000, pharmacy: 16000 },
  ];

  const handleExportCSV = () => {
    const headers = 'InvoiceNo,PatientName,TotalAmount,Status,Date\n';
    const rows = bills.map(b => `${b.invoiceNo},"${b.patientName}",${b.totalAmount},${b.status},${b.date}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hospital_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-blue-600" /> Hospital Analytics & Executive Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Financial revenue trends, department occupancy metrics, and operational audit performance
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" /> Export Financial Report (CSV)
        </button>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs font-semibold text-slate-400">Cumulative YTD Collections</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <p className="text-[11px] text-slate-500 mt-1">Verified bank settlements</p>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs font-semibold text-slate-400">Billing Collection Rate</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">{collectionRate}%</div>
          <p className="text-[11px] text-slate-500 mt-1">{paidInvoices} of {totalInvoices} Invoices Settled</p>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs font-semibold text-slate-400">Active Medical Personnel</span>
          <div className="text-2xl font-bold text-indigo-600 mt-2">{doctors.length} Physicians</div>
          <p className="text-[11px] text-slate-500 mt-1">Across 5 Specialty Departments</p>
        </div>
      </div>

      {/* Revenue Breakdown Stacked Bar Chart */}
      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">Service Revenue Streams</h3>
        <p className="text-xs text-slate-400 mb-4">Monthly revenue breakdown across Consultations, Laboratory, and Pharmacy</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="consultations" name="Consultations" fill="#2563eb" stackId="a" />
              <Bar dataKey="lab" name="Laboratory" fill="#10b981" stackId="a" />
              <Bar dataKey="pharmacy" name="Pharmacy" fill="#8b5cf6" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

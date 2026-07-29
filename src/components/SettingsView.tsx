import React, { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Moon,
  Sun,
  Lock,
  Globe,
  Bell,
  CheckCircle,
  FileText
} from 'lucide-react';
import { UserRole } from '../types';

interface SettingsViewProps {
  currentRole: UserRole;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentRole,
  darkMode,
  onToggleDarkMode
}) => {
  const [hospitalInfo, setHospitalInfo] = useState({
    name: 'Metropolitan Hospital & Medical Center',
    code: 'MH-WEST-01',
    address: '742 Cloud Avenue, Tech City, NY 10001',
    phone: '+1 (800) 555-HOSP',
    email: 'contact@metropolitanhealth.org',
    currency: 'USD ($)',
    timezone: 'UTC-5 (Eastern Time)'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const auditLogs = [
    { id: 'log-1', timestamp: '2026-07-28 14:22:10', user: 'Admin User', action: 'Registered Patient PAT-1004 (Sarah Connor)', ip: '192.168.1.42' },
    { id: 'log-2', timestamp: '2026-07-28 13:15:04', user: 'Dr. Sarah Jenkins', action: 'Issued e-Prescription RX-8803', ip: '192.168.1.18' },
    { id: 'log-3', timestamp: '2026-07-28 11:45:00', user: 'Lab Tech', action: 'Published Blood Work Diagnostic Report LAB-2002', ip: '192.168.1.25' },
    { id: 'log-4', timestamp: '2026-07-28 09:30:12', user: 'Billing Dept', action: 'Settled Invoice INV-9001 ($240.00)', ip: '192.168.1.50' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" /> Hospital System Settings & Security Audit
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure facility metadata, appearance preferences, security access control, and operational audit trails
        </p>
      </div>

      {/* Hospital Metadata Form */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" /> Hospital Facility Information
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Facility Name</label>
              <input
                type="text"
                value={hospitalInfo.name}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Hospital Facility Code</label>
              <input
                type="text"
                value={hospitalInfo.code}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, code: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border outline-none font-mono ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={hospitalInfo.phone}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={hospitalInfo.email}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Physical Address</label>
            <input
              type="text"
              value={hospitalInfo.address}
              onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl border outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4 dark:border-slate-800">
            {saved && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Hospital configurations updated!
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 ml-auto"
            >
              Save Configurations
            </button>
          </div>
        </form>
      </div>

      {/* System Preferences */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" /> Interface & Theme Preferences
        </h3>

        <div className="flex items-center justify-between py-2 text-xs">
          <div>
            <span className="font-bold block text-slate-900 dark:text-slate-100">Dark Mode Theme</span>
            <span className="text-slate-400">Toggle high-contrast dark palette for reduced eye strain</span>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`p-2.5 rounded-xl border font-bold flex items-center gap-2 ${
              darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Dark Enabled' : 'Light Enabled'}
          </button>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" /> System Security & EHR Audit Trail
        </h3>
        <p className="text-xs text-slate-400 mb-4">Immutable log of system modifications and administrative actions</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`border-b font-semibold uppercase text-[10px] text-slate-400 ${
              darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Activity Description</th>
                <th className="p-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 text-slate-500">{log.timestamp}</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200 font-sans">{log.user}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-sans">{log.action}</td>
                  <td className="p-3 text-right text-slate-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

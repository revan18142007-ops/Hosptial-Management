import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  Pill,
  TestTube,
  FileText,
  BarChart2,
  Terminal,
  Settings,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  darkMode: boolean;
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  darkMode,
  collapsed = false,
  setCollapsed,
  isOpen = false,
  setIsOpen
}) => {
  const isMobileOpen = isOpen;
  const isCollapsed = collapsed;

  const toggleCollapsed = () => {
    if (setCollapsed) setCollapsed(!isCollapsed);
    if (setIsOpen) setIsOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'patient'] },
    { id: 'patients', label: 'Patients', icon: Users, roles: ['admin', 'doctor'] },
    { id: 'doctors', label: 'Doctors', icon: UserCheck, roles: ['admin', 'doctor', 'patient'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'doctor', 'patient'] },
    { id: 'prescriptions', label: 'Prescriptions & AI', icon: FileText, roles: ['admin', 'doctor', 'patient'], badge: 'AI' },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, roles: ['admin', 'patient'] },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill, roles: ['admin', 'doctor', 'patient'] },
    { id: 'laboratory', label: 'Laboratory', icon: TestTube, roles: ['admin', 'doctor', 'patient'] },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart2, roles: ['admin'] },
    { id: 'api-docs', label: 'Cloud API & Architecture', icon: Terminal, roles: ['admin', 'doctor', 'patient'], badge: 'Docs' },
    { id: 'settings', label: 'Settings & Audit Logs', icon: Settings, roles: ['admin', 'doctor', 'patient'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        transition-all duration-300 border-r flex flex-col justify-between
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'w-72 md:w-64'}
        ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-900 border-slate-800 text-slate-300'}
        shadow-2xl md:shadow-none
      `}>
        <div className="p-4 overflow-y-auto">
          
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm tracking-tight">MedCloud</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{currentRole} Portal</p>
                </div>
              </div>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={closeMobile}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden ml-auto"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block ml-auto"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {/* Links List */}
          <nav className="space-y-1.5">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    closeMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-semibold text-xs transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {(!isCollapsed || isMobileOpen) && (
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold tracking-wider ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Banner */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-4 m-4 rounded-[1.5rem] bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-xs text-white">Gemini Clinical AI</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AI-powered symptom evaluation, diagnostic drafting, & prescription intelligence.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

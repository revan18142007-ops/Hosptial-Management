import React, { useState } from 'react';
import {
  Activity,
  Bell,
  Moon,
  Sun,
  UserCheck,
  Search,
  CheckCircle,
  Clock,
  LogOut,
  Hospital,
  Menu
} from 'lucide-react';
import { UserRole, User, NotificationItem } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  setCurrentRole?: (role: UserRole) => void;
  currentUser?: User;
  darkMode: boolean;
  onToggleDarkMode?: () => void;
  setDarkMode?: (val: boolean) => void;
  onToggleSidebar?: () => void;
  notifications?: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  setCurrentRole,
  currentUser = { id: 'u-1', name: 'Johnathan Doe', email: 'j.doe@metropolitan-hospital.org', role: 'admin' },
  darkMode,
  onToggleDarkMode,
  setDarkMode,
  onToggleSidebar,
  notifications = [],
  onMarkRead = (_id: string) => {},
  onNavigate = (_tab: string) => {},
  onLogout
}) => {
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const handleRoleChange = (role: UserRole) => {
    if (onRoleChange) onRoleChange(role);
    if (setCurrentRole) setCurrentRole(role);
  };

  const handleToggleDarkMode = () => {
    if (onToggleDarkMode) onToggleDarkMode();
    if (setDarkMode) setDarkMode(!darkMode);
  };

  return (
    <header className={`sticky top-0 z-30 border-b transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 md:px-6">
        
        {/* Left: Brand & Hospital Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl border md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 transition-colors"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
            <Hospital className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                METROPOLITAN
              </span>
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                CLOUD HMS
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Medical Center & Health System
            </p>
          </div>
        </div>

        {/* Center: Search & Quick Navigation */}
        <div className="hidden md:flex items-center gap-2 max-w-md w-full mx-4">
          <div className={`relative w-full flex items-center rounded-2xl border px-3.5 py-2 text-sm transition-colors ${
            darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100/80 border-slate-200 text-slate-700'
          }`}>
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search patient ID, doctor, record or bill..."
              className="w-full bg-transparent outline-none placeholder:text-slate-400 text-xs font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onNavigate('patients');
                }
              }}
            />
            <kbd className="hidden lg:inline-block text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-lg font-mono font-bold">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Controls: Role Switcher, Dark Mode, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Role Switcher Pill */}
          <div className={`flex items-center p-1 rounded-2xl border text-xs font-medium ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden lg:inline">Role:</span>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-3 py-1 rounded-xl transition-all ${
                currentRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleChange('doctor')}
              className={`px-3 py-1 rounded-xl transition-all ${
                currentRole === 'doctor'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              Doctor
            </button>
            <button
              onClick={() => handleRoleChange('patient')}
              className={`px-3 py-1 rounded-xl transition-all ${
                currentRole === 'patient'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              Patient
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={handleToggleDarkMode}
            className={`p-2 rounded-lg border transition-colors ${
              darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifPopover(!showNotifPopover)}
              className={`relative p-2 rounded-lg border transition-colors ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifPopover && (
              <div className={`absolute right-0 mt-2 w-80 md:w-96 rounded-xl border shadow-xl p-4 z-50 ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-3 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <h4 className="font-semibold text-sm">Notifications</h4>
                  </div>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} Unread
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onMarkRead(n.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          n.read
                            ? darkMode ? 'bg-slate-800/40 border-slate-700/50 opacity-70' : 'bg-slate-50 border-slate-100 opacity-75'
                            : darkMode ? 'bg-blue-950/40 border-blue-800' : 'bg-blue-50/60 border-blue-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {n.date}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-100 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize mt-0.5">{currentRole} Access</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-xl p-2 z-50 ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="px-3 py-2 border-b dark:border-slate-700 mb-1">
                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('settings');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-500" /> My Profile & Preferences
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('api-docs');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Activity className="w-3.5 h-3.5 text-indigo-500" /> Cloud API & Docs
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 font-semibold flex items-center gap-2 mt-1 border-t dark:border-slate-700/60 pt-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" /> Log Out
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

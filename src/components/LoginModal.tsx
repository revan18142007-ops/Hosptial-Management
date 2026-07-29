import React, { useState } from 'react';
import { Lock, ShieldCheck, Hospital, AlertCircle, Eye, EyeOff, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
  targetRole?: UserRole;
  darkMode: boolean;
  isFullPage?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetRole = 'admin',
  darkMode,
  isFullPage = false
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(targetRole);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (selectedRole === 'admin') {
        if (password.trim() === 'admin@123') {
          setError('');
          onSuccess('admin');
          setPassword('');
          onClose();
        } else {
          setError('Invalid Admin password! Please use: admin@123');
        }
      } else {
        // Doctor / Patient non-restricted access
        onSuccess(selectedRole);
        setPassword('');
        onClose();
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setUsername('admin');
    } else if (role === 'doctor') {
      setUsername('dr.jenkins');
    } else {
      setUsername('patient.alice');
    }
  };

  const modalContent = (
    <div className={`w-full max-w-md p-6 sm:p-8 rounded-[2.5rem] border shadow-2xl transition-all ${
      darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Hospital Brand Badge */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
          <Hospital className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">MedCloud HMS</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          {selectedRole === 'admin' ? 'Administrator Authentication' : 'Clinical Access Portal'}
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className={`p-1.5 rounded-2xl border mb-6 flex gap-1 ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          type="button"
          onClick={() => handleRoleSelect('admin')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            selectedRole === 'admin'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Admin
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('doctor')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            selectedRole === 'doctor'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Doctor
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('patient')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            selectedRole === 'patient'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Patient
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            User Identifier
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-2xl border outline-none transition-colors ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              placeholder="Username or email"
              required
            />
          </div>
        </div>

        {selectedRole === 'admin' ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Admin Password
              </label>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                Key: admin@123
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (admin@123)"
                className={`w-full pl-10 pr-10 py-2.5 text-xs font-medium rounded-2xl border outline-none transition-colors ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Password required for Administrator access: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-bold text-blue-600 dark:text-blue-400">admin@123</code>
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Standard clinical access privileges enabled for {selectedRole}.</span>
          </div>
        )}

        <div className="pt-2 flex gap-3">
          {!isFullPage && (
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 text-xs font-bold rounded-2xl border transition-colors ${
                darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 text-xs font-extrabold rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Login as {selectedRole.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  if (isFullPage) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}>
        {modalContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      {modalContent}
    </div>
  );
};

import React from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Activity,
  FileText,
  CreditCard,
  Pill,
  TestTube
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Doctor, Patient, Appointment, Bill, UserRole, NotificationItem } from '../types';

interface DashboardViewProps {
  doctors?: Doctor[];
  patients?: Patient[];
  appointments?: Appointment[];
  bills?: Bill[];
  currentRole: UserRole;
  darkMode: boolean;
  onNavigate: (tab: string) => void;
  notifications?: NotificationItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  doctors = [],
  patients = [],
  appointments = [],
  bills = [],
  currentRole,
  darkMode,
  onNavigate,
  notifications = []
}) => {
  // Calculated Metrics
  const totalPatients = (patients || []).length;
  const totalDoctors = (doctors || []).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = (appointments || []).filter(a => a.date === '2026-07-29' || a.date === todayStr);
  const totalRevenue = (bills || []).reduce((acc, b) => acc + (b.status === 'Paid' ? b.totalAmount : 0), 0);

  // Revenue Trend Data
  const revenueData = [
    { month: 'Jan', revenue: 42000, appointments: 320 },
    { month: 'Feb', revenue: 48000, appointments: 350 },
    { month: 'Mar', revenue: 51000, appointments: 410 },
    { month: 'Apr', revenue: 59000, appointments: 480 },
    { month: 'May', revenue: 64000, appointments: 520 },
    { month: 'Jun', revenue: 72000, appointments: 590 },
    { month: 'Jul', revenue: 84000, appointments: 680 },
  ];

  // Department Patient Distribution Data
  const departmentData = [
    { name: 'Cardiology', value: 35, color: '#2563eb' },
    { name: 'General Med', value: 28, color: '#10b981' },
    { name: 'Pediatrics', value: 18, color: '#f59e0b' },
    { name: 'Orthopedics', value: 12, color: '#8b5cf6' },
    { name: 'Neurology', value: 7, color: '#ec4899' },
  ];

  // Status Distribution
  const statusCounts = [
    { status: 'Approved', count: (appointments || []).filter(a => a.status === 'Approved').length, fill: '#10b981' },
    { status: 'Pending', count: (appointments || []).filter(a => a.status === 'Pending').length, fill: '#f59e0b' },
    { status: 'Completed', count: (appointments || []).filter(a => a.status === 'Completed').length, fill: '#3b82f6' },
    { status: 'Cancelled', count: (appointments || []).filter(a => a.status === 'Cancelled').length, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Bento Header */}
      <div className={`p-8 rounded-[2.5rem] border transition-all ${
        darkMode
          ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-800 text-slate-100 shadow-xl'
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 border-blue-500 text-white shadow-lg shadow-blue-500/15'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[11px] px-3 py-1 rounded-full font-bold bg-white/20 text-white tracking-wider uppercase border border-white/20">
                {currentRole} Command Center
              </span>
              <span className="text-xs text-blue-100/90 font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Metropolitan Cloud Hospital System
            </h1>
            <p className="text-xs text-blue-100/80 max-w-xl leading-relaxed">
              Real-time synchronization across outpatient clinics, surgery suites, pharmacy inventory, and lab diagnostic streams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('appointments')}
              className="px-4 py-2.5 rounded-2xl bg-white text-blue-600 font-bold text-xs shadow-md hover:bg-blue-50 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
            {currentRole === 'admin' && (
              <button
                onClick={() => onNavigate('patients')}
                className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold text-xs hover:bg-white/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <Users className="w-4 h-4" /> New Patient
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Patients Bento */}
        <div className={`p-6 rounded-[2rem] border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Total Patients</span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{totalPatients}</span>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +12%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Active Health Records</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Total Doctors Bento */}
        <div className={`p-6 rounded-[2rem] border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Active Staff</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{totalDoctors}</span>
              <span className="text-slate-400 text-xs font-medium">5 Depts</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Specialists On Duty</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-slate-900 text-[10px] font-bold text-blue-700 dark:text-blue-200 flex items-center justify-center">DR</div>
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 border-2 border-white dark:border-slate-900 text-[10px] font-bold text-emerald-700 dark:text-emerald-200 flex items-center justify-center">SJ</div>
            <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 border-2 border-white dark:border-slate-900 text-[10px] font-bold text-purple-700 dark:text-purple-200 flex items-center justify-center">GW</div>
            <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900 border-2 border-white dark:border-slate-900 text-[10px] flex items-center justify-center font-bold text-orange-700 dark:text-orange-200">+80</div>
          </div>
        </div>

        {/* Today's Appointments Bento */}
        <div className={`p-6 rounded-[2rem] border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Today's Appts</span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{todayAppointments.length}</span>
              <span className="text-amber-500 text-xs font-bold">
                {appointments.filter(a => a.status === 'Pending').length} Pending
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Clinical Queue Active</p>
          </div>
          <div className="flex gap-1.5">
            <div className="h-2 w-3/4 bg-blue-500 rounded-full"></div>
            <div className="h-2 w-1/4 bg-amber-400 rounded-full"></div>
          </div>
        </div>

        {/* Gross Revenue Hero Bento Card */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-6 rounded-[2rem] shadow-lg shadow-blue-500/20 flex flex-col justify-between text-white border border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-blue-100 font-medium text-xs uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur text-white">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
              <span className="text-blue-200 text-xs font-mono">.00</span>
            </div>
            <span className="inline-block mt-2 px-2.5 py-1 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white">
              Monthly Goal: 84%
            </span>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[84%] rounded-full"></div>
          </div>
        </div>

      </div>

      {/* Bento Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart: Patient Inflow & Revenue Trend */}
        <div className={`lg:col-span-2 p-6 md:p-8 rounded-[2.5rem] border shadow-sm ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Patient Inflow & Revenue Growth</h3>
              <p className="text-xs text-slate-400">Monthly billing trends across all hospital departments</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> Revenue Stream
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '1rem',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart Bento Box */}
        <div className={`p-6 md:p-8 rounded-[2.5rem] border shadow-sm flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-0.5">Department Share</h3>
            <p className="text-xs text-slate-400 mb-4">Patient volume by medical specialty</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '1rem',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t dark:border-slate-800 text-[11px]">
            {departmentData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{d.name}</span>
                <span className="font-bold ml-auto text-slate-900 dark:text-slate-100">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bento Grid: Featured Dark Queue & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dark Bento Box: Upcoming Appointments Queue */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Upcoming Consultations</h3>
              <p className="text-xs text-slate-400">Live clinical queue for today</p>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-blue-400 text-xs font-semibold hover:underline"
            >
              View All Queue →
            </button>
          </div>

          <div className="space-y-3.5">
            {appointments.slice(0, 3).map((apt, idx) => (
              <div
                key={apt.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  idx === 0
                    ? 'bg-slate-800/90 border-slate-700 shadow-md'
                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex flex-col items-center justify-center text-blue-400 shrink-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider">OCT</span>
                    <span className="text-base font-extrabold leading-none">29</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-100">{apt.patientName}</p>
                    <p className="text-xs text-slate-400">{apt.doctorName} • {apt.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                    {apt.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Hospital Activity Bento Box */}
        <div className={`p-6 md:p-8 rounded-[2.5rem] border shadow-sm ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Hospital Activity
            </h3>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
              SYNCED
            </span>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl border text-xs bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.title}</span>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{item.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

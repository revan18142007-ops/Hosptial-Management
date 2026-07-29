import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  UserCheck,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  X,
  FileText
} from 'lucide-react';
import { Appointment, Doctor, Patient, UserRole } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  onAddAppointment: (a: Partial<Appointment>) => void;
  onUpdateStatus: (id: string, status: string) => void;
  currentRole: UserRole;
  darkMode: boolean;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  doctors,
  patients,
  onAddAppointment,
  onUpdateStatus,
  currentRole,
  darkMode
}) => {
  const [activeTabStatus, setActiveTabStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);

  const [formData, setFormData] = useState({
    patientId: patients[0]?.patientId || '',
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: 'General Consultation & Health Screening'
  });

  const filtered = appointments.filter(apt => {
    const matchesStatus = activeTabStatus === 'All' || apt.status === activeTabStatus;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.appointmentNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === formData.doctorId);
    const pat = patients.find(p => p.patientId === formData.patientId || p.id === formData.patientId);

    if (!doc) return;

    onAddAppointment({
      patientId: pat?.patientId || formData.patientId,
      patientName: pat?.name || 'Walk-in Patient',
      patientPhone: pat?.phone || '+1 (555) 000-0000',
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: 'Approved',
      consultationFee: doc.consultationFee
    });

    setShowBookModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" /> Outpatient & Inpatient Consultations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Schedule doctor visits, manage appointment statuses, and track patient queues
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Book New Appointment
        </button>
      </div>

      {/* Tabs & Search */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Approved', 'Pending', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTabStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTabStatus === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : darkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, doctor or appt no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border outline-none ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`border-b font-semibold uppercase text-[11px] tracking-wider text-slate-400 ${
              darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Appt No.</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Assigned Doctor</th>
                <th className="p-4">Department</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    No appointments found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{apt.appointmentNo}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{apt.patientName}</td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{apt.doctorName}</td>
                    <td className="p-4 text-slate-500">{apt.department}</td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                      {apt.date} at {apt.time}
                    </td>
                    <td className="p-4 font-bold text-emerald-600">${apt.consultationFee}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                          : apt.status === 'Pending'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                          : apt.status === 'Completed'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'Completed')}
                            className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                            className="px-2 py-1 rounded bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold text-[10px] border border-red-200 dark:border-red-800 hover:bg-red-100"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Book Clinical Appointment
              </h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Patient *</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.patientId}>
                      {p.name} ({p.patientId} - {p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Specialist Physician *</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialization} - Fee: ${d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Consultation Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Time Slot</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason for Visit / Symptoms</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-xl border font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

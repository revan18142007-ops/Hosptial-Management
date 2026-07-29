import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Award,
  DollarSign,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Building
} from 'lucide-react';
import { Doctor, UserRole, Department } from '../types';

interface DoctorsViewProps {
  doctors: Doctor[];
  departments: Department[];
  onAddDoctor: (d: Partial<Doctor>) => void;
  onUpdateDoctor: (id: string, d: Partial<Doctor>) => void;
  onDeleteDoctor: (id: string) => void;
  currentRole: UserRole;
  darkMode: boolean;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({
  doctors,
  departments,
  onAddDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  currentRole,
  darkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    department: departments[0]?.name || 'Cardiology',
    experience: '8 years',
    qualification: 'M.D.',
    roomNumber: 'Room 101',
    schedule: 'Mon - Fri (09:00 AM - 04:00 PM)',
    consultationFee: 120,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
  });

  const filtered = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.doctorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All' || doc.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddDoctor(formData);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" /> Medical Specialists & Physicians
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Specialist directory, clinical duty schedules, consultation fees, and department assignments
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Specialist Doctor
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search physician name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border outline-none font-medium ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className={`p-5 rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm shrink-0 border-2 border-blue-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                      {doc.doctorId}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      doc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mt-1 leading-tight">{doc.name}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{doc.specialization}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-b py-3 dark:border-slate-800 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><Building className="w-3.5 h-3.5" /> Department</span>
                  <span className="font-semibold">{doc.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Experience</span>
                  <span className="font-semibold">{doc.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Room / Schedule</span>
                  <span className="font-semibold">{doc.roomNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Consultation Fee</span>
                  <span className="font-bold text-emerald-600">${doc.consultationFee}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating} / 5.0
              </div>

              {currentRole === 'admin' && (
                <button
                  onClick={() => onDeleteDoctor(doc.id)}
                  className="p-1.5 rounded-lg border text-slate-400 hover:text-red-600 hover:border-red-200"
                  title="Remove Doctor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" /> Add Specialist Physician
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="e.g. Dr. Alexander Fleming"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                    placeholder="e.g. Interventional Cardiologist"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Room / Clinic Location</label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
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
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
                >
                  Save Physician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

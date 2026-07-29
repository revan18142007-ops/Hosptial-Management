import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Plus,
  Search,
  QrCode,
  FileText,
  Edit2,
  Trash2,
  X,
  User,
  Heart,
  Phone,
  Mail,
  MapPin,
  Shield,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import QRCode from 'qrcode';
import { Patient, UserRole } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  onAddPatient: (p: Partial<Patient>) => void;
  onUpdatePatient: (id: string, p: Partial<Patient>) => void;
  onDeletePatient: (id: string) => void;
  currentRole: UserRole;
  darkMode: boolean;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  onAddPatient,
  onUpdatePatient,
  onDeletePatient,
  currentRole,
  darkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientForQR, setSelectedPatientForQR] = useState<Patient | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: 30,
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    status: 'Outpatient' as 'Admitted' | 'Outpatient' | 'Discharged'
  });

  // Filtered Patients
  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.phone.includes(searchTerm);
    const matchesBlood = selectedBloodGroup === 'All' || p.bloodGroup === selectedBloodGroup;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesBlood && matchesStatus;
  });

  // Generate QR Code when a patient is selected
  useEffect(() => {
    if (selectedPatientForQR) {
      const qrPayload = JSON.stringify({
        hospital: 'Metropolitan Hospital System',
        patientId: selectedPatientForQR.patientId,
        name: selectedPatientForQR.name,
        bloodGroup: selectedPatientForQR.bloodGroup,
        emergencyContact: selectedPatientForQR.emergencyContact
      });
      QRCode.toDataURL(qrPayload, { width: 220, margin: 2 }, (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      });
    } else {
      setQrDataUrl('');
    }
  }, [selectedPatientForQR]);

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    onAddPatient({
      ...formData,
      medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(s => s.trim()) : [],
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : []
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: 30,
      gender: 'Female',
      bloodGroup: 'O+',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      allergies: '',
      status: 'Outpatient'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Patient Electronic Health Records
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage demographics, medical histories, QR patient identifiers, and admission status
          </p>
        </div>

        {currentRole !== 'patient' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Register New Patient
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className={`p-5 rounded-[2rem] border flex flex-col md:flex-row gap-4 items-center justify-between ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Patient Name, ID (PAT-xxxx), or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3.5 py-2.5 text-xs rounded-2xl border outline-none transition-colors ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Blood Group Filter */}
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className={`px-3.5 py-2.5 text-xs rounded-2xl border outline-none font-medium ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Blood Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-3.5 py-2.5 text-xs rounded-2xl border outline-none font-medium ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="Outpatient">Outpatient</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* Patient Cards Table */}
      <div className={`rounded-[2rem] border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`border-b font-semibold uppercase text-[11px] tracking-wider text-slate-400 ${
              darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Patient ID</th>
                <th className="p-4">Name & Demographics</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Medical History</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No matching patients found.
                  </td>
                </tr>
              ) : (
                filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* ID */}
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {patient.patientId}
                    </td>

                    {/* Name & Age */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{patient.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {patient.age} yrs • {patient.gender}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {patient.phone}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Mail className="w-3 h-3 shrink-0" /> {patient.email}
                      </div>
                    </td>

                    {/* Blood Group */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800">
                        <Heart className="w-3 h-3 fill-current" /> {patient.bloodGroup}
                      </span>
                    </td>

                    {/* Medical History */}
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {patient.medicalHistory.map((item, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        patient.status === 'Admitted'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : patient.status === 'Outpatient'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      }`}>
                        {patient.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPatientForQR(patient)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="View Patient ID Badge & QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      {currentRole === 'admin' && (
                        <button
                          onClick={() => onDeletePatient(patient.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors"
                          title="Delete Patient Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> New Patient Registration
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="patient@example.com"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Address & Emergency Contact</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none mb-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="Street Address, City"
                />
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="Emergency Contact Person & Phone"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Medical History (Comma separated)</label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  rows={2}
                  placeholder="e.g. Hypertension, Diabetes, Asthma"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient QR Badge Modal */}
      {selectedPatientForQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl text-center ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-slate-800">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Official Patient ID Badge
              </span>
              <button onClick={() => setSelectedPatientForQR(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable ID Card Container */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl text-left relative overflow-hidden mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] uppercase font-bold text-blue-200">Metropolitan Health</p>
                  <h4 className="font-bold text-lg leading-tight">{selectedPatientForQR.name}</h4>
                  <p className="font-mono text-xs text-blue-100 font-semibold mt-0.5">{selectedPatientForQR.patientId}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-700 shadow-sm">
                  {selectedPatientForQR.bloodGroup}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-100 border-t border-white/20 pt-2 mb-3">
                <div>Age / Sex: <span className="font-bold text-white">{selectedPatientForQR.age} / {selectedPatientForQR.gender}</span></div>
                <div>Status: <span className="font-bold text-white">{selectedPatientForQR.status}</span></div>
                <div className="col-span-2">Contact: <span className="font-bold text-white">{selectedPatientForQR.phone}</span></div>
              </div>

              {/* QR Code Canvas Output */}
              <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow-inner max-w-[140px] mx-auto">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Patient QR Code" className="w-28 h-28" />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center text-slate-400 text-[10px]">Generating QR...</div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              Scan this QR code at hospital reception, nursing triage, or lab workstations to retrieve patient EHR records instantly.
            </p>

            <button
              onClick={() => setSelectedPatientForQR(null)}
              className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
            >
              Close ID Card
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

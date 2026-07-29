import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Sparkles,
  Printer,
  Download,
  Trash2,
  X,
  CheckCircle,
  Pill,
  TestTube,
  User,
  Activity,
  Bot
} from 'lucide-react';
import { Prescription, Patient, Doctor, UserRole, PrescriptionMedicine } from '../types';
import { api } from '../services/api';

interface PrescriptionsViewProps {
  prescriptions: Prescription[];
  patients: Patient[];
  doctors: Doctor[];
  onAddPrescription: (p: Partial<Prescription>) => void;
  currentRole: UserRole;
  darkMode: boolean;
}

export const PrescriptionsView: React.FC<PrescriptionsViewProps> = ({
  prescriptions,
  patients,
  doctors,
  onAddPrescription,
  currentRole,
  darkMode
}) => {
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<Prescription | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.patientId || '',
    doctorId: doctors[0]?.id || '',
    diagnosis: 'Upper Respiratory Tract Infection',
    symptomsInput: 'Cough, mild fever, throat pain',
    medicines: [
      { name: 'Amoxicillin 500mg', dosage: '1 Capsule', frequency: '3 times daily', duration: '7 Days', instructions: 'Take after meals' }
    ] as PrescriptionMedicine[],
    labTestsRequested: ['Complete Blood Count (CBC)'],
    notes: 'Maintain standard hydration and bed rest for 3 days.'
  });

  const handleAddMedicineRow = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { name: '', dosage: '1 Tablet', frequency: 'Twice daily', duration: '5 Days', instructions: 'Take after food' }
      ]
    });
  };

  const handleRemoveMedicineRow = (index: number) => {
    const updated = formData.medicines.filter((_, idx) => idx !== index);
    setFormData({ ...formData, medicines: updated });
  };

  const handleMedicineChange = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    const updated = [...formData.medicines];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, medicines: updated });
  };

  // AI Consult Assistant Trigger
  const handleAIAssist = async () => {
    const selectedPat = patients.find(p => p.patientId === formData.patientId || p.id === formData.patientId);
    setAiLoading(true);

    try {
      const res = await api.getAIClinicalSummary({
        symptoms: formData.symptomsInput,
        medicalHistory: selectedPat?.medicalHistory || [],
        age: selectedPat?.age || 35,
        gender: selectedPat?.gender || 'Female'
      });

      if (res.suggestedMedicines && res.suggestedMedicines.length > 0) {
        setFormData(prev => ({
          ...prev,
          diagnosis: res.clinicalSummary ? res.clinicalSummary.substring(0, 100) : prev.diagnosis,
          medicines: res.suggestedMedicines,
          labTestsRequested: res.suggestedLabTests || prev.labTestsRequested,
          notes: res.clinicalSummary || prev.notes
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitRx = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === formData.doctorId);
    const pat = patients.find(p => p.patientId === formData.patientId || p.id === formData.patientId);

    if (!doc || !pat) return;

    onAddPrescription({
      patientId: pat.patientId,
      patientName: pat.name,
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      diagnosis: formData.diagnosis,
      medicines: formData.medicines,
      labTestsRequested: formData.labTestsRequested,
      notes: formData.notes
    });

    setShowWriteModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> Digital Prescriptions & AI Clinical Summarizer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate digital e-prescriptions, leverage Gemini AI clinical decision support, and issue official patient medication logs
          </p>
        </div>

        {currentRole !== 'patient' && (
          <button
            onClick={() => setShowWriteModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Issue Digital Prescription
          </button>
        )}
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className={`p-5 rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {rx.prescriptionNo}
                  </span>
                  <span className="text-xs text-slate-400">{rx.date}</span>
                </div>
                <button
                  onClick={() => setSelectedRxForPrint(rx)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> PDF / Print
                </button>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Patient Name:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{rx.patientName} ({rx.patientId})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Attending Doctor:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{rx.doctorName} ({rx.department})</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border dark:border-slate-700 mt-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Diagnosis:</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-snug">{rx.diagnosis}</p>
                </div>
              </div>

              {/* Medicines Summary */}
              <div className="space-y-1.5 text-xs mb-3">
                <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">Prescribed Medication</span>
                {rx.medicines.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-[11px]">
                    <span className="font-bold">{m.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">{m.dosage} • {m.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Prescription Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Issue Digital e-Prescription
              </h3>
              <button onClick={() => setShowWriteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assistant Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-blue-900/20 border border-indigo-500/30 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-indigo-400 flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Gemini AI Clinical Decision Support
                </span>
                <p className="text-slate-400 text-[11px]">
                  Enter presenting symptoms below and click "AI Consult Suggest" to generate automatic diagnosis & evidence-based dosages.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={aiLoading}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow hover:opacity-95 transition-all shrink-0 flex items-center justify-center gap-1.5"
              >
                {aiLoading ? <Bot className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? 'Analyzing Case...' : 'AI Consult Suggest'}
              </button>
            </div>

            <form onSubmit={handleSubmitRx} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                      <option key={p.id} value={p.patientId}>{p.name} ({p.patientId})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Prescribing Physician *</label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Presenting Symptoms (For AI Assistant)</label>
                <input
                  type="text"
                  value={formData.symptomsInput}
                  onChange={(e) => setFormData({ ...formData, symptomsInput: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="e.g. Fever > 38.5C, productive cough, shortness of breath"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              {/* Medicines List Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">Prescribed Medications</label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Medication Row
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.medicines.map((med, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border grid grid-cols-1 sm:grid-cols-4 gap-2 items-center ${
                      darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <input
                        type="text"
                        placeholder="Drug Name (e.g. Amoxicillin 500mg)"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                        className={`px-2 py-1.5 rounded-lg border text-xs outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 1 Tablet)"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        className={`px-2 py-1.5 rounded-lg border text-xs outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Frequency (e.g. 3x daily)"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                        className={`px-2 py-1.5 rounded-lg border text-xs outline-none ${
                          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="Instructions"
                          value={med.instructions}
                          onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                          className={`w-full px-2 py-1.5 rounded-lg border text-xs outline-none ${
                            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                          }`}
                        />
                        {formData.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicineRow(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Doctor's Dietary & Behavioral Advice</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-4 py-2 rounded-xl border font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
                >
                  Save & Sign e-Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable PDF Prescription Viewer Modal */}
      {selectedRxForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-serif">
            
            {/* Header Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-blue-900 font-sans">
                  METROPOLITAN HOSPITAL CENTER
                </h1>
                <p className="text-xs text-slate-600 font-sans">
                  742 Cloud Avenue, Suite 400 • Phone: +1 (800) 555-HOSP • Rx Reg #MH-88021
                </p>
              </div>
              <div className="text-right font-sans text-xs">
                <span className="font-bold text-blue-600 text-sm block">{selectedRxForPrint.prescriptionNo}</span>
                <span className="text-slate-500">Date: {selectedRxForPrint.date}</span>
              </div>
            </div>

            {/* Patient & Doctor Box */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans mb-6">
              <div>
                <p className="text-slate-500 uppercase text-[10px] font-bold">Patient Details</p>
                <p className="font-bold text-sm text-slate-900">{selectedRxForPrint.patientName}</p>
                <p className="text-slate-600">Patient ID: <span className="font-mono font-bold">{selectedRxForPrint.patientId}</span></p>
              </div>
              <div>
                <p className="text-slate-500 uppercase text-[10px] font-bold">Prescribing Physician</p>
                <p className="font-bold text-sm text-slate-900">{selectedRxForPrint.doctorName}</p>
                <p className="text-slate-600">Department: {selectedRxForPrint.department}</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mb-6 font-sans">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Diagnosis</span>
              <p className="text-sm font-semibold text-slate-800 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                {selectedRxForPrint.diagnosis}
              </p>
            </div>

            {/* Rx Symbol & Medicines */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-600 font-sans mb-3">Rx</div>
              <table className="w-full text-xs font-sans text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-600 uppercase text-[10px]">
                    <th className="pb-2">Medication Name</th>
                    <th className="pb-2">Dosage</th>
                    <th className="pb-2">Frequency</th>
                    <th className="pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedRxForPrint.medicines.map((m, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-bold text-slate-900">{m.name}</td>
                      <td className="py-2.5 text-slate-700">{m.dosage}</td>
                      <td className="py-2.5 text-slate-700">{m.frequency}</td>
                      <td className="py-2.5 text-slate-700">{m.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Doctor Signature Stamp */}
            <div className="flex justify-between items-end border-t pt-6 mt-8 font-sans">
              <div>
                <p className="text-[10px] text-slate-400">Electronic Verification Hash:</p>
                <p className="font-mono text-[10px] text-slate-500">SHA256: 8f9b2c41a...e0912</p>
              </div>

              <div className="text-center">
                <div className="w-36 border-b border-slate-900 mb-1"></div>
                <p className="font-bold text-xs text-slate-900">{selectedRxForPrint.doctorName}</p>
                <p className="text-[10px] text-slate-500">Digital Signature Verified</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t font-sans">
              <button
                onClick={() => setSelectedRxForPrint(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-100"
              >
                Close Preview
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

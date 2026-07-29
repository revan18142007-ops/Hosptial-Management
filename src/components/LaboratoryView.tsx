import React, { useState } from 'react';
import {
  TestTube,
  Plus,
  CheckCircle,
  Clock,
  FileText,
  X,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { LabTest, Patient, UserRole } from '../types';

interface LaboratoryViewProps {
  labTests: LabTest[];
  patients: Patient[];
  onCreateLabTest: (t: Partial<LabTest>) => void;
  onUpdateLabTest: (id: string, data: Partial<LabTest>) => void;
  currentRole: UserRole;
  darkMode: boolean;
}

export const LaboratoryView: React.FC<LaboratoryViewProps> = ({
  labTests,
  patients,
  onCreateLabTest,
  onUpdateLabTest,
  currentRole,
  darkMode
}) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedTestForResults, setSelectedTestForResults] = useState<LabTest | null>(null);

  const [formData, setFormData] = useState({
    patientId: patients[0]?.patientId || '',
    testName: 'Complete Blood Count (CBC) with Differential',
    category: 'Hematology',
    price: 85.00,
    doctorName: 'Dr. Sarah Jenkins'
  });

  const [resultInput, setResultInput] = useState({
    result: 'WBC: 7.2 x10^3/uL, RBC: 4.8 x10^6/uL, Hemoglobin: 14.2 g/dL, Platelets: 250 x10^3/uL',
    normalRange: 'WBC 4.5-11.0, RBC 4.3-5.9, Hb 13.5-17.5',
    resultSummary: 'All cell counts within standard reference ranges.'
  });

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.patientId === formData.patientId || p.id === formData.patientId);

    onCreateLabTest({
      patientId: pat?.patientId || formData.patientId,
      patientName: pat?.name || 'Inpatient',
      doctorName: formData.doctorName,
      testName: formData.testName,
      category: formData.category,
      price: formData.price,
      status: 'Pending'
    });

    setShowOrderModal(false);
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestForResults) return;

    onUpdateLabTest(selectedTestForResults.id, {
      ...resultInput,
      status: 'Completed'
    });

    setSelectedTestForResults(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TestTube className="w-6 h-6 text-teal-600" /> Laboratory Diagnostics & Pathology
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pathology orders, specimen status tracking, blood work analysis, and diagnostic reports
          </p>
        </div>

        {currentRole !== 'patient' && (
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs shadow-md hover:bg-teal-700 transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Order Laboratory Test
          </button>
        )}
      </div>

      {/* Lab Tests Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`border-b font-semibold uppercase text-[11px] tracking-wider text-slate-400 ${
              darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'
            }`}>
              <tr>
                <th className="p-4">Test No</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Test Name & Category</th>
                <th className="p-4">Ordering Physician</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {labTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-teal-600 dark:text-teal-400">{test.testNo}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{test.patientName} ({test.patientId})</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{test.testName}</div>
                    <div className="text-[11px] text-slate-400">{test.category}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{test.doctorName}</td>
                  <td className="p-4 font-bold text-emerald-600">${test.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      test.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : test.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                    }`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {test.status !== 'Completed' && currentRole !== 'patient' && (
                      <button
                        onClick={() => {
                          setSelectedTestForResults(test);
                          setResultInput({
                            result: test.result || '',
                            normalRange: test.normalRange || 'Standard Reference Range',
                            resultSummary: test.resultSummary || 'Normal findings'
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-semibold text-[10px] hover:bg-teal-700"
                      >
                        Enter Results
                      </button>
                    )}
                    {test.status === 'Completed' && (
                      <button
                        onClick={() => setSelectedTestForResults(test)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 dark:text-slate-300 font-semibold text-[10px] hover:bg-slate-100"
                      >
                        View Report
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Lab Test Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <TestTube className="w-5 h-5 text-teal-600" /> Order Pathology / Lab Test
              </h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Patient</label>
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
                <label className="block font-semibold mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="e.g. Lipid Profile, HBA1C, Thyroid Panel"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 rounded-xl border font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold shadow hover:bg-teal-700"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lab Results Modal */}
      {selectedTestForResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" /> Lab Diagnostic Report: {selectedTestForResults.testNo}
              </h3>
              <button onClick={() => setSelectedTestForResults(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResults} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 mb-2">
                <p className="font-bold">{selectedTestForResults.testName}</p>
                <p className="text-slate-500">Patient: {selectedTestForResults.patientName} ({selectedTestForResults.patientId})</p>
              </div>

              {selectedTestForResults.status === 'Completed' ? (
                <div className="space-y-2 py-2">
                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">Test Results Findings:</span>
                    <p className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border dark:border-slate-700">
                      {selectedTestForResults.result}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">Normal Reference Range:</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {selectedTestForResults.normalRange}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold mb-1">Diagnostic Findings & Measured Values</label>
                    <textarea
                      required
                      value={resultInput.result}
                      onChange={(e) => setResultInput({ ...resultInput, result: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border outline-none font-mono text-xs ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Normal Reference Range</label>
                    <input
                      type="text"
                      value={resultInput.normalRange}
                      onChange={(e) => setResultInput({ ...resultInput, normalRange: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedTestForResults(null)}
                      className="px-4 py-2 rounded-xl border font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold shadow hover:bg-teal-700"
                    >
                      Publish Lab Findings
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

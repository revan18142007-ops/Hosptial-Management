import React, { useState } from 'react';
import {
  Code,
  BookOpen,
  Cloud,
  Server,
  Database,
  Globe,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface ApiDocsViewProps {
  darkMode: boolean;
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({ darkMode }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/patients',
      description: 'Fetch all registered electronic health records (EHRs)',
      response: '[\n  {\n    "id": "p-1",\n    "patientId": "PAT-1001",\n    "name": "Jane Doe",\n    "bloodGroup": "O+",\n    "status": "Admitted"\n  }\n]'
    },
    {
      method: 'POST',
      path: '/api/patients',
      description: 'Register a new patient into MongoDB Atlas Cloud Database',
      response: '{\n  "message": "Patient registered successfully",\n  "patientId": "PAT-1005"\n}'
    },
    {
      method: 'POST',
      path: '/api/ai/clinical-summary',
      description: 'Invoke Gemini AI Clinical Assistant for evidence-based diagnosis & drug recommendations',
      response: '{\n  "clinicalSummary": "Presents symptoms consistent with acute sinusitis.",\n  "suggestedMedicines": [\n    { "name": "Amoxicillin 500mg", "dosage": "1 Cap", "frequency": "3x Daily" }\n  ]\n}'
    },
    {
      method: 'GET',
      path: '/api/doctors',
      description: 'Get directory of active specialist physicians',
      response: '[\n  {\n    "doctorId": "DOC-101",\n    "name": "Dr. Sarah Jenkins",\n    "specialization": "Cardiology"\n  }\n]'
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Code className="w-6 h-6 text-blue-600" /> API Documentation & Cloud Deployment Architecture
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          RESTful API endpoints reference, JSON payloads, and Cloud Hosting Deployment Guide for MongoDB Atlas, Render, and Vercel
        </p>
      </div>

      {/* Cloud Stack Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">MongoDB Atlas</h4>
            <p className="text-xs text-slate-400">Cloud NoSQL DB Cluster</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Render Backend</h4>
            <p className="text-xs text-slate-400">Node.js Express Engine</p>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Vercel Frontend</h4>
            <p className="text-xs text-slate-400">React SPA Edge Hosting</p>
          </div>
        </div>
      </div>

      {/* REST API Reference */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-600" /> Hospital REST API Specification
        </h3>

        <div className="space-y-4">
          {apiEndpoints.map((ep, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${
              darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    ep.method === 'GET'
                      ? 'bg-emerald-500 text-white'
                      : ep.method === 'POST'
                      ? 'bg-blue-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{ep.path}</span>
                </div>
                <span className="text-xs text-slate-500">{ep.description}</span>
              </div>

              <div className="relative mt-2">
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto">
                  {ep.response}
                </pre>
                <button
                  onClick={() => handleCopy(ep.response, idx)}
                  className="absolute right-2 top-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIndex === idx ? 'Copied' : 'Copy Payload'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Deployment Instructions */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-indigo-600" /> Step-by-Step Production Cloud Deployment Guide
        </h3>

        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
          
          <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">1. Setup MongoDB Atlas (Cloud Database)</h4>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Log into <strong>MongoDB Atlas</strong> and create a M0 Free Cluster.</li>
              <li>Create a Database User under <i>Database Access</i> and configure IP Access List (`0.0.0.0/0`).</li>
              <li>Copy the connection string URL: <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">mongodb+srv://admin:&lt;password&gt;@cluster0.mongodb.net/hospital_db</code></li>
            </ol>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
            <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">2. Deploy Backend API Service on Render</h4>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Connect your Git repository to <strong>Render Web Service</strong>.</li>
              <li>Set Build Command to <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">npm run build</code> and Start Command to <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">npm start</code>.</li>
              <li>In Environment Variables, add <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">GEMINI_API_KEY</code> and <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">MONGODB_URI</code>.</li>
            </ol>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">3. Deploy Frontend Web App on Vercel</h4>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Import repository in <strong>Vercel Dashboard</strong>.</li>
              <li>Vercel automatically detects Vite. Framework Preset: <i>Vite</i>.</li>
              <li>Deploy! Your Hospital Management System is live on global CDN edge nodes.</li>
            </ol>
          </div>

        </div>
      </div>

    </div>
  );
};

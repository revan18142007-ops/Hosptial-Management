import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_BILLS,
  INITIAL_PHARMACY,
  INITIAL_LAB_TESTS,
  INITIAL_DEPARTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from './src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Cloud Database Collections
let doctorsCollection = [...INITIAL_DOCTORS];
let patientsCollection = [...INITIAL_PATIENTS];
let appointmentsCollection = [...INITIAL_APPOINTMENTS];
let prescriptionsCollection = [...INITIAL_PRESCRIPTIONS];
let billsCollection = [...INITIAL_BILLS];
let pharmacyCollection = [...INITIAL_PHARMACY];
let labTestsCollection = [...INITIAL_LAB_TESTS];
let departmentsCollection = [...INITIAL_DEPARTMENTS];
let notificationsCollection = [...INITIAL_NOTIFICATIONS];
let auditLogsCollection = [...INITIAL_AUDIT_LOGS];

// Gemini Client Lazy Initializer
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function logAudit(user: string, role: string, action: string, module: string, req: express.Request) {
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user,
    role,
    action,
    module,
    ip: (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1'
  };
  auditLogsCollection.unshift(newLog);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // --- REST API ENDPOINTS ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'Hospital Management System API',
      timestamp: new Date().toISOString(),
      collections: {
        doctors: doctorsCollection.length,
        patients: patientsCollection.length,
        appointments: appointmentsCollection.length,
        bills: billsCollection.length,
        prescriptions: prescriptionsCollection.length,
        pharmacy: pharmacyCollection.length,
        laboratory: labTestsCollection.length
      }
    });
  });

  // AUTH API
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    
    // Quick demo JWT simulation
    let token = `jwt-token-${role}-${Date.now()}`;
    let userDetails: any = {
      id: `usr-${role}-1`,
      email: email || `${role}@metropolitan-hospital.org`,
      role: role || 'admin',
      name: role === 'admin' ? 'System Administrator' : role === 'doctor' ? 'Dr. Sarah Jenkins' : 'Eleanor Vance',
      createdAt: new Date().toISOString()
    };

    if (role === 'doctor') {
      userDetails.doctorId = 'doc-1';
    } else if (role === 'patient') {
      userDetails.patientId = 'PAT-8021';
    }

    logAudit(userDetails.name, role.toUpperCase(), `User Login (${role})`, 'Authentication', req);

    res.json({
      success: true,
      token,
      user: userDetails,
      message: 'Authenticated successfully'
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, age, gender, bloodGroup, address } = req.body;
    const newPatient = {
      id: `pat-${Date.now()}`,
      patientId: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone,
      age: Number(age) || 30,
      gender: gender || 'Female',
      bloodGroup: bloodGroup || 'O+',
      address: address || 'N/A',
      emergencyContact: 'Not provided',
      medicalHistory: ['Newly registered patient'],
      allergies: [],
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'Outpatient' as const
    };
    patientsCollection.unshift(newPatient);

    logAudit(name, 'PATIENT', `Registered New Account (${newPatient.patientId})`, 'Authentication', req);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient: newPatient,
      token: `jwt-token-patient-${Date.now()}`
    });
  });

  // DOCTORS CRUD
  app.get('/api/doctors', (req, res) => {
    const { department, search } = req.query;
    let list = [...doctorsCollection];
    if (department && department !== 'All') {
      list = list.filter(d => d.department.toLowerCase() === (department as string).toLowerCase());
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.doctorId.toLowerCase().includes(q));
    }
    res.json(list);
  });

  app.post('/api/doctors', (req, res) => {
    const doctorData = req.body;
    const newDoc = {
      ...doctorData,
      id: `doc-${Date.now()}`,
      doctorId: doctorData.doctorId || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: doctorData.rating || 5.0,
      status: doctorData.status || 'Active',
      image: doctorData.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
    };
    doctorsCollection.unshift(newDoc);
    logAudit('Admin', 'ADMIN', `Created Doctor Record ${newDoc.doctorId}`, 'Doctor Management', req);
    res.status(201).json(newDoc);
  });

  app.put('/api/doctors/:id', (req, res) => {
    const { id } = req.params;
    const idx = doctorsCollection.findIndex(d => d.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Doctor not found' });
    doctorsCollection[idx] = { ...doctorsCollection[idx], ...req.body };
    logAudit('Admin', 'ADMIN', `Updated Doctor Record ${doctorsCollection[idx].doctorId}`, 'Doctor Management', req);
    res.json(doctorsCollection[idx]);
  });

  app.delete('/api/doctors/:id', (req, res) => {
    const { id } = req.params;
    const target = doctorsCollection.find(d => d.id === id);
    doctorsCollection = doctorsCollection.filter(d => d.id !== id);
    if (target) {
      logAudit('Admin', 'ADMIN', `Deleted Doctor Record ${target.doctorId}`, 'Doctor Management', req);
    }
    res.json({ success: true, message: 'Doctor deleted' });
  });

  // PATIENTS CRUD
  app.get('/api/patients', (req, res) => {
    const { search, bloodGroup, status } = req.query;
    let list = [...patientsCollection];
    if (bloodGroup && bloodGroup !== 'All') {
      list = list.filter(p => p.bloodGroup === bloodGroup);
    }
    if (status && status !== 'All') {
      list = list.filter(p => p.status === status);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q) || p.phone.includes(q));
    }
    res.json(list);
  });

  app.post('/api/patients', (req, res) => {
    const patientData = req.body;
    const newPatient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      patientId: patientData.patientId || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredDate: new Date().toISOString().split('T')[0],
      status: patientData.status || 'Outpatient',
      medicalHistory: patientData.medicalHistory || [],
      allergies: patientData.allergies || []
    };
    patientsCollection.unshift(newPatient);
    logAudit('Staff/Admin', 'STAFF', `Added Patient Record ${newPatient.patientId}`, 'Patient Management', req);
    res.status(201).json(newPatient);
  });

  app.put('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    const idx = patientsCollection.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Patient not found' });
    patientsCollection[idx] = { ...patientsCollection[idx], ...req.body };
    logAudit('Staff/Admin', 'STAFF', `Updated Patient ${patientsCollection[idx].patientId}`, 'Patient Management', req);
    res.json(patientsCollection[idx]);
  });

  app.delete('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    const target = patientsCollection.find(p => p.id === id);
    patientsCollection = patientsCollection.filter(p => p.id !== id);
    if (target) {
      logAudit('Admin', 'ADMIN', `Deleted Patient ${target.patientId}`, 'Patient Management', req);
    }
    res.json({ success: true, message: 'Patient removed' });
  });

  // APPOINTMENTS CRUD
  app.get('/api/appointments', (req, res) => {
    const { doctorId, patientId, date, status } = req.query;
    let list = [...appointmentsCollection];
    if (doctorId) list = list.filter(a => a.doctorId === doctorId);
    if (patientId) list = list.filter(a => a.patientId === patientId);
    if (date) list = list.filter(a => a.date === date);
    if (status && status !== 'All') list = list.filter(a => a.status === status);
    res.json(list);
  });

  app.post('/api/appointments', (req, res) => {
    const aptData = req.body;
    const newApt = {
      ...aptData,
      id: `apt-${Date.now()}`,
      appointmentNo: `APT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: aptData.status || 'Approved',
      consultationFee: aptData.consultationFee || 120
    };
    appointmentsCollection.unshift(newApt);

    // Auto add notification
    notificationsCollection.unshift({
      id: `notif-${Date.now()}`,
      userId: newApt.doctorId,
      role: 'doctor',
      title: 'New Appointment Booked',
      message: `Appointment ${newApt.appointmentNo} booked for ${newApt.patientName} on ${newApt.date} at ${newApt.time}`,
      date: 'Just now',
      read: false,
      type: 'appointment'
    });

    logAudit(newApt.patientName || 'User', 'USER', `Booked Appointment ${newApt.appointmentNo}`, 'Appointments', req);
    res.status(201).json(newApt);
  });

  app.put('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const idx = appointmentsCollection.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });
    appointmentsCollection[idx] = { ...appointmentsCollection[idx], ...req.body };
    logAudit('Doctor/Admin', 'STAFF', `Updated Appointment ${appointmentsCollection[idx].appointmentNo} status to ${req.body.status || 'Updated'}`, 'Appointments', req);
    res.json(appointmentsCollection[idx]);
  });

  app.delete('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    appointmentsCollection = appointmentsCollection.filter(a => a.id !== id);
    res.json({ success: true, message: 'Appointment cancelled/deleted' });
  });

  // BILLING CRUD
  app.get('/api/bills', (req, res) => {
    const { status, search } = req.query;
    let list = [...billsCollection];
    if (status && status !== 'All') list = list.filter(b => b.status === status);
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(b => b.invoiceNo.toLowerCase().includes(q) || b.patientName.toLowerCase().includes(q) || b.patientId.toLowerCase().includes(q));
    }
    res.json(list);
  });

  app.post('/api/bills', (req, res) => {
    const billData = req.body;
    const subtotal = (billData.items || []).reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);
    const tax = subtotal * 0.05;
    const discount = Number(billData.discount) || 0;
    const totalAmount = subtotal + tax - discount;

    const newBill = {
      ...billData,
      id: `bill-${Date.now()}`,
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      subtotal,
      tax,
      discount,
      totalAmount,
      status: billData.status || 'Unpaid',
      date: billData.date || new Date().toISOString().split('T')[0],
      dueDate: billData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    };

    billsCollection.unshift(newBill);
    logAudit('Billing Dept', 'ADMIN', `Generated Invoice ${newBill.invoiceNo} ($${totalAmount.toFixed(2)})`, 'Billing', req);
    res.status(201).json(newBill);
  });

  app.put('/api/bills/:id', (req, res) => {
    const { id } = req.params;
    const idx = billsCollection.findIndex(b => b.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Bill not found' });
    billsCollection[idx] = { ...billsCollection[idx], ...req.body };
    logAudit('Billing Dept', 'ADMIN', `Updated Invoice ${billsCollection[idx].invoiceNo} Payment Status`, 'Billing', req);
    res.json(billsCollection[idx]);
  });

  // PRESCRIPTIONS CRUD
  app.get('/api/prescriptions', (req, res) => {
    const { patientId, doctorId } = req.query;
    let list = [...prescriptionsCollection];
    if (patientId) list = list.filter(p => p.patientId === patientId);
    if (doctorId) list = list.filter(p => p.doctorId === doctorId);
    res.json(list);
  });

  app.post('/api/prescriptions', (req, res) => {
    const rx = req.body;
    const newRx = {
      ...rx,
      id: `pres-${Date.now()}`,
      prescriptionNo: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    prescriptionsCollection.unshift(newRx);
    logAudit(rx.doctorName || 'Doctor', 'DOCTOR', `Issued Prescription ${newRx.prescriptionNo} for ${newRx.patientName}`, 'Medical Records', req);
    res.status(201).json(newRx);
  });

  // PHARMACY CRUD
  app.get('/api/pharmacy', (req, res) => {
    res.json(pharmacyCollection);
  });

  app.post('/api/pharmacy', (req, res) => {
    const med = req.body;
    const stock = Number(med.stock) || 0;
    const reorderLevel = Number(med.reorderLevel) || 50;
    const status = stock === 0 ? 'Out of Stock' : stock <= reorderLevel ? 'Low Stock' : 'In Stock';

    const newMed = {
      ...med,
      id: `med-${Date.now()}`,
      code: med.code || `MED-${Math.floor(100 + Math.random() * 900)}`,
      stock,
      unitPrice: Number(med.unitPrice) || 10,
      status
    };
    pharmacyCollection.unshift(newMed);
    logAudit('Pharmacist', 'STAFF', `Added Pharmacy Item ${newMed.code} (${newMed.name})`, 'Pharmacy', req);
    res.status(201).json(newMed);
  });

  app.put('/api/pharmacy/:id', (req, res) => {
    const { id } = req.params;
    const idx = pharmacyCollection.findIndex(m => m.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Medicine not found' });
    const updated = { ...pharmacyCollection[idx], ...req.body };
    const stock = Number(updated.stock);
    const reorder = Number(updated.reorderLevel);
    updated.status = stock === 0 ? 'Out of Stock' : stock <= reorder ? 'Low Stock' : 'In Stock';
    pharmacyCollection[idx] = updated;
    res.json(pharmacyCollection[idx]);
  });

  app.delete('/api/pharmacy/:id', (req, res) => {
    const { id } = req.params;
    pharmacyCollection = pharmacyCollection.filter(m => m.id !== id);
    res.json({ success: true });
  });

  // LABORATORY CRUD
  app.get('/api/laboratory', (req, res) => {
    res.json(labTestsCollection);
  });

  app.post('/api/laboratory', (req, res) => {
    const test = req.body;
    const newTest = {
      ...test,
      id: `lab-${Date.now()}`,
      testNo: `LAB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: test.status || 'Pending',
      requestedDate: new Date().toISOString().split('T')[0]
    };
    labTestsCollection.unshift(newTest);
    logAudit('Doctor', 'DOCTOR', `Requested Lab Order ${newTest.testNo} (${newTest.testName})`, 'Laboratory', req);
    res.status(201).json(newTest);
  });

  app.put('/api/laboratory/:id', (req, res) => {
    const { id } = req.params;
    const idx = labTestsCollection.findIndex(l => l.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Lab test not found' });
    labTestsCollection[idx] = {
      ...labTestsCollection[idx],
      ...req.body,
      completedDate: req.body.status === 'Completed' ? new Date().toISOString().split('T')[0] : labTestsCollection[idx].completedDate
    };
    logAudit('Lab Tech', 'STAFF', `Updated Lab Test ${labTestsCollection[idx].testNo} Result`, 'Laboratory', req);
    res.json(labTestsCollection[idx]);
  });

  // DEPARTMENTS
  app.get('/api/departments', (req, res) => {
    res.json(departmentsCollection);
  });

  // NOTIFICATIONS
  app.get('/api/notifications', (req, res) => {
    res.json(notificationsCollection);
  });

  app.put('/api/notifications/:id/read', (req, res) => {
    const { id } = req.params;
    const n = notificationsCollection.find(x => x.id === id);
    if (n) n.read = true;
    res.json({ success: true });
  });

  // AUDIT LOGS
  app.get('/api/audit-logs', (req, res) => {
    res.json(auditLogsCollection);
  });

  // GEMINI AI CLINICAL ASSISTANT
  app.post('/api/ai/clinical-summary', async (req, res) => {
    const { symptoms, medicalHistory, age, gender } = req.body;
    const aiClient = getGeminiClient();

    if (!aiClient) {
      return res.json({
        clinicalSummary: `Clinical Summary (Offline Mode):\n- Patient: ${gender}, ${age} years old\n- Presenting Symptoms: ${symptoms || 'General malaise'}\n- Historical Factors: ${Array.isArray(medicalHistory) ? medicalHistory.join(', ') : medicalHistory || 'None noted'}\n\nRecommendation:\n1. Perform physical check & vital signs evaluation.\n2. Order baseline Complete Blood Count (CBC) and Metabolic Panel.\n3. Prescribe symptom-specific palliative medication.`,
        suggestedMedicines: [
          { name: 'Paracetamol 500mg', dosage: '1 Tablet', frequency: '3x daily after meals', duration: '5 days', instructions: 'For pain/fever relief' },
          { name: 'Multivitamin Complex', dosage: '1 Capsule', frequency: 'Once daily after breakfast', duration: '14 days', instructions: 'General health supplement' }
        ],
        suggestedLabTests: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel']
      });
    }

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are an AI Clinical Assistant aiding a physician in a hospital management system. Analyze the following patient case and respond in JSON with keys "clinicalSummary", "suggestedMedicines" (array of objects with name, dosage, frequency, duration, instructions), and "suggestedLabTests" (array of test names).

Patient Details:
- Age: ${age}
- Gender: ${gender}
- Presenting Symptoms: ${symptoms}
- Prior Medical History: ${JSON.stringify(medicalHistory)}`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({ error: 'Failed to generate AI clinical summary', details: err.message });
    }
  });

  // SYSTEM ARCHITECTURE & EXPORT ENDPOINTS
  app.get('/api/system/schema', (req, res) => {
    res.json({
      database: 'MongoDB Atlas / Hospital-Management-DB',
      collections: [
        { name: 'users', indexes: ['email (unique)', 'role'] },
        { name: 'doctors', indexes: ['doctorId (unique)', 'department', 'status'] },
        { name: 'patients', indexes: ['patientId (unique)', 'phone', 'bloodGroup'] },
        { name: 'appointments', indexes: ['appointmentNo (unique)', 'date', 'doctorId', 'patientId'] },
        { name: 'prescriptions', indexes: ['prescriptionNo (unique)', 'appointmentId', 'patientId'] },
        { name: 'laboratory', indexes: ['testNo (unique)', 'patientId', 'status'] },
        { name: 'pharmacy', indexes: ['code (unique)', 'category', 'status'] },
        { name: 'bills', indexes: ['invoiceNo (unique)', 'patientId', 'status'] },
        { name: 'notifications', indexes: ['userId', 'read'] },
        { name: 'audit_logs', indexes: ['timestamp', 'user'] }
      ]
    });
  });

  // VITE MIDDLEWARE SETUP
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hospital Management Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

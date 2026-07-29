import {
  Doctor,
  Patient,
  Appointment,
  Prescription,
  Bill,
  PharmacyItem,
  LabTest,
  Department,
  NotificationItem,
  AuditLog
} from '../types';

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Auth
  login: async (email: string, role: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    return res.json();
  },

  registerPatient: async (data: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Doctors
  getDoctors: async (department?: string, search?: string): Promise<Doctor[]> => {
    const query = new URLSearchParams();
    if (department) query.append('department', department);
    if (search) query.append('search', search);
    const res = await fetch(`/api/doctors?${query.toString()}`);
    return res.json();
  },

  createDoctor: async (data: Partial<Doctor>): Promise<Doctor> => {
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateDoctor: async (id: string, data: Partial<Doctor>): Promise<Doctor> => {
    const res = await fetch(`/api/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteDoctor: async (id: string) => {
    const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Patients
  getPatients: async (search?: string, bloodGroup?: string, status?: string): Promise<Patient[]> => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (bloodGroup) query.append('bloodGroup', bloodGroup);
    if (status) query.append('status', status);
    const res = await fetch(`/api/patients?${query.toString()}`);
    return res.json();
  },

  createPatient: async (data: Partial<Patient>): Promise<Patient> => {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updatePatient: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    const res = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deletePatient: async (id: string) => {
    const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Appointments
  getAppointments: async (doctorId?: string, patientId?: string, status?: string): Promise<Appointment[]> => {
    const query = new URLSearchParams();
    if (doctorId) query.append('doctorId', doctorId);
    if (patientId) query.append('patientId', patientId);
    if (status) query.append('status', status);
    const res = await fetch(`/api/appointments?${query.toString()}`);
    return res.json();
  },

  createAppointment: async (data: Partial<Appointment>): Promise<Appointment> => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateAppointmentStatus: async (id: string, status: string): Promise<Appointment> => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Bills
  getBills: async (status?: string, search?: string): Promise<Bill[]> => {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (search) query.append('search', search);
    const res = await fetch(`/api/bills?${query.toString()}`);
    return res.json();
  },

  createBill: async (data: Partial<Bill>): Promise<Bill> => {
    const res = await fetch('/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateBill: async (id: string, data: Partial<Bill>): Promise<Bill> => {
    const res = await fetch(`/api/bills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Prescriptions
  getPrescriptions: async (patientId?: string): Promise<Prescription[]> => {
    const query = new URLSearchParams();
    if (patientId) query.append('patientId', patientId);
    const res = await fetch(`/api/prescriptions?${query.toString()}`);
    return res.json();
  },

  createPrescription: async (data: Partial<Prescription>): Promise<Prescription> => {
    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Pharmacy
  getPharmacyItems: async (): Promise<PharmacyItem[]> => {
    const res = await fetch('/api/pharmacy');
    return res.json();
  },

  createPharmacyItem: async (data: Partial<PharmacyItem>): Promise<PharmacyItem> => {
    const res = await fetch('/api/pharmacy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updatePharmacyStock: async (id: string, stock: number): Promise<PharmacyItem> => {
    const res = await fetch(`/api/pharmacy/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock })
    });
    return res.json();
  },

  // Laboratory
  getLabTests: async (): Promise<LabTest[]> => {
    const res = await fetch('/api/laboratory');
    return res.json();
  },

  createLabTest: async (data: Partial<LabTest>): Promise<LabTest> => {
    const res = await fetch('/api/laboratory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateLabTest: async (id: string, data: Partial<LabTest>): Promise<LabTest> => {
    const res = await fetch(`/api/laboratory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Departments
  getDepartments: async (): Promise<Department[]> => {
    const res = await fetch('/api/departments');
    return res.json();
  },

  // Notifications
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await fetch('/api/notifications');
    return res.json();
  },

  markNotificationRead: async (id: string) => {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    return res.json();
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await fetch('/api/audit-logs');
    return res.json();
  },

  // Gemini AI Assistant
  getAIClinicalSummary: async (payload: { symptoms: string; medicalHistory: any; age: number; gender: string }) => {
    const res = await fetch('/api/ai/clinical-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};

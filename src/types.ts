export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  patientId?: string;
  doctorId?: string;
}

export interface Doctor {
  id: string;
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  experience: string;
  qualification: string;
  roomNumber: string;
  schedule: string;
  status: 'Active' | 'On Leave' | 'Busy';
  rating: number;
  image: string;
  consultationFee: number;
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string[];
  allergies?: string[];
  qrCode?: string;
  registeredDate: string;
  status: 'Admitted' | 'Outpatient' | 'Discharged';
}

export interface Appointment {
  id: string;
  appointmentNo: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Cancelled';
  reason: string;
  notes?: string;
  consultationFee: number;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  prescriptionNo: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  labTestsRequested: string[];
  notes: string;
  date: string;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface Bill {
  id: string;
  invoiceNo: string;
  patientId: string;
  patientName: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  paymentMethod?: 'Cash' | 'Credit Card' | 'Insurance' | 'Online Gateway';
  date: string;
  dueDate: string;
}

export interface PharmacyItem {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  expiryDate: string;
  manufacturer: string;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface LabTest {
  id: string;
  testNo: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  testName: string;
  category: string;
  price: number;
  status: 'Pending' | 'Sample Collected' | 'In Progress' | 'Completed';
  result?: string;
  normalRange?: string;
  resultSummary?: string;
  requestedDate: string;
  completedDate?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  type: 'Lab Result' | 'Prescription' | 'Doctor Note' | 'Admission Summary' | 'Vaccination';
  title: string;
  doctorName: string;
  date: string;
  details: string;
  attachmentUrl?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole | 'all';
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'appointment' | 'lab' | 'billing' | 'system';
}

export interface Department {
  id: string;
  name: string;
  headDoctor: string;
  totalDoctors: number;
  description: string;
  location: string;
  iconName: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  ip: string;
}

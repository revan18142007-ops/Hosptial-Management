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

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dep-1',
    name: 'Cardiology',
    headDoctor: 'Dr. Sarah Jenkins, M.D.',
    totalDoctors: 12,
    description: 'Diagnosis and treatment of heart and vascular conditions.',
    location: 'Building A, 3rd Floor',
    iconName: 'Heart'
  },
  {
    id: 'dep-2',
    name: 'Neurology',
    headDoctor: 'Dr. Robert Vance, Ph.D.',
    totalDoctors: 8,
    description: 'Comprehensive care for disorders of the nervous system and brain.',
    location: 'Building B, 2nd Floor',
    iconName: 'Brain'
  },
  {
    id: 'dep-3',
    name: 'Pediatrics',
    headDoctor: 'Dr. Emily Watson, M.D.',
    totalDoctors: 15,
    description: 'Specialized healthcare for infants, children, and adolescents.',
    location: 'Building A, 1st Floor',
    iconName: 'Baby'
  },
  {
    id: 'dep-4',
    name: 'Orthopedics',
    headDoctor: 'Dr. Michael Chang, M.D.',
    totalDoctors: 10,
    description: 'Surgical and non-surgical care for musculoskeletal injuries.',
    location: 'Building C, Ground Floor',
    iconName: 'Activity'
  },
  {
    id: 'dep-5',
    name: 'General Medicine',
    headDoctor: 'Dr. Amanda Ramirez, M.D.',
    totalDoctors: 20,
    description: 'Primary medical care, health screenings, and wellness checks.',
    location: 'Main Pavilion, 1st Floor',
    iconName: 'Stethoscope'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    doctorId: 'DOC-1001',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@metropolitan-hospital.org',
    phone: '+1 (555) 234-5678',
    specialization: 'Senior Cardiologist',
    department: 'Cardiology',
    experience: '14 years',
    qualification: 'M.D., FACC (Harvard Medical)',
    roomNumber: 'Room 304-A',
    schedule: 'Mon - Fri (09:00 AM - 04:00 PM)',
    status: 'Active',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    consultationFee: 150
  },
  {
    id: 'doc-2',
    doctorId: 'DOC-1002',
    name: 'Dr. Robert Vance',
    email: 'r.vance@metropolitan-hospital.org',
    phone: '+1 (555) 345-6789',
    specialization: 'Neurologist & Spine Specialist',
    department: 'Neurology',
    experience: '18 years',
    qualification: 'M.D., Ph.D. (Johns Hopkins)',
    roomNumber: 'Room 210-B',
    schedule: 'Tue, Thu, Sat (10:00 AM - 05:00 PM)',
    status: 'Active',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    consultationFee: 180
  },
  {
    id: 'doc-3',
    doctorId: 'DOC-1003',
    name: 'Dr. Emily Watson',
    email: 'e.watson@metropolitan-hospital.org',
    phone: '+1 (555) 456-7890',
    specialization: 'Pediatric Specialist',
    department: 'Pediatrics',
    experience: '10 years',
    qualification: 'M.D., FAAP (Stanford)',
    roomNumber: 'Room 102-C',
    schedule: 'Mon - Sat (08:30 AM - 02:30 PM)',
    status: 'Active',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1594824813566-88855ce78347?auto=format&fit=crop&q=80&w=400',
    consultationFee: 120
  },
  {
    id: 'doc-4',
    doctorId: 'DOC-1004',
    name: 'Dr. Michael Chang',
    email: 'm.chang@metropolitan-hospital.org',
    phone: '+1 (555) 567-8901',
    specialization: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    experience: '12 years',
    qualification: 'M.S. Ortho, M.D. (Columbia)',
    roomNumber: 'Room G-12',
    schedule: 'Mon, Wed, Fri (09:00 AM - 05:00 PM)',
    status: 'Busy',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    consultationFee: 160
  },
  {
    id: 'doc-5',
    doctorId: 'DOC-1005',
    name: 'Dr. Amanda Ramirez',
    email: 'a.ramirez@metropolitan-hospital.org',
    phone: '+1 (555) 678-9012',
    specialization: 'General Physician & Internist',
    department: 'General Medicine',
    experience: '8 years',
    qualification: 'M.D. (UCLA Health)',
    roomNumber: 'Room 105-A',
    schedule: 'Mon - Fri (08:00 AM - 04:00 PM)',
    status: 'Active',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
    consultationFee: 100
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    patientId: 'PAT-8021',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 (555) 111-2222',
    age: 42,
    gender: 'Female',
    bloodGroup: 'A+',
    address: '742 Evergreen Terrace, Springfield, IL',
    emergencyContact: 'Thomas Vance (+1 555-999-1234)',
    medicalHistory: ['Hypertension', 'Mild Asthma', 'Penicillin Allergy'],
    allergies: ['Penicillin', 'Peanuts'],
    registeredDate: '2025-11-12',
    status: 'Outpatient'
  },
  {
    id: 'pat-2',
    patientId: 'PAT-8022',
    name: 'Marcus Brody',
    email: 'm.brody@example.com',
    phone: '+1 (555) 222-3333',
    age: 58,
    gender: 'Male',
    bloodGroup: 'O+',
    address: '100 Museum Way, Chicago, IL',
    emergencyContact: 'Marion Brody (+1 555-888-2345)',
    medicalHistory: ['Type 2 Diabetes', 'Hyperlipidemia'],
    allergies: ['Sulfa Drugs'],
    registeredDate: '2025-12-01',
    status: 'Admitted'
  },
  {
    id: 'pat-3',
    patientId: 'PAT-8023',
    name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    phone: '+1 (555) 333-4444',
    age: 29,
    gender: 'Female',
    bloodGroup: 'B-',
    address: '45 Lake Shore Drive, Evanston, IL',
    emergencyContact: 'Carlos Martinez (+1 555-777-3456)',
    medicalHistory: ['Seasonal Rhinitis', 'Post-Op Knee Surgery (2024)'],
    allergies: ['Latex'],
    registeredDate: '2026-01-15',
    status: 'Outpatient'
  },
  {
    id: 'pat-4',
    patientId: 'PAT-8024',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 444-5555',
    age: 35,
    gender: 'Male',
    bloodGroup: 'AB+',
    address: '88 Tech Boulevard, Schaumburg, IL',
    emergencyContact: 'Jenny Kim (+1 555-666-4567)',
    medicalHistory: ['Migraine with Aura'],
    allergies: [],
    registeredDate: '2026-02-10',
    status: 'Discharged'
  },
  {
    id: 'pat-5',
    patientId: 'PAT-8025',
    name: 'Clara Oswald',
    email: 'clara.o@example.com',
    phone: '+1 (555) 555-6666',
    age: 26,
    gender: 'Female',
    bloodGroup: 'O-',
    address: '12 Baker Street, Oak Park, IL',
    emergencyContact: 'Danny Pink (+1 555-555-7890)',
    medicalHistory: ['Acute Bronchitis (Resolved)'],
    allergies: ['Codeine'],
    registeredDate: '2026-03-02',
    status: 'Outpatient'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    appointmentNo: 'APT-2026-101',
    patientId: 'PAT-8021',
    patientName: 'Eleanor Vance',
    patientPhone: '+1 (555) 111-2222',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    date: '2026-07-29',
    time: '09:30 AM',
    status: 'Approved',
    reason: 'Routine Cardiac Follow-up & ECG Check',
    consultationFee: 150
  },
  {
    id: 'apt-2',
    appointmentNo: 'APT-2026-102',
    patientId: 'PAT-8022',
    patientName: 'Marcus Brody',
    patientPhone: '+1 (555) 222-3333',
    doctorId: 'doc-5',
    doctorName: 'Dr. Amanda Ramirez',
    department: 'General Medicine',
    date: '2026-07-29',
    time: '11:00 AM',
    status: 'Approved',
    reason: 'HBA1C Diabetes Consultation & Blood Pressure Check',
    consultationFee: 100
  },
  {
    id: 'apt-3',
    appointmentNo: 'APT-2026-103',
    patientId: 'PAT-8023',
    patientName: 'Sophia Martinez',
    patientPhone: '+1 (555) 333-4444',
    doctorId: 'doc-4',
    doctorName: 'Dr. Michael Chang',
    department: 'Orthopedics',
    date: '2026-07-29',
    time: '02:15 PM',
    status: 'Pending',
    reason: 'Right Knee ACL Post-Surgery Evaluation',
    consultationFee: 160
  },
  {
    id: 'apt-4',
    appointmentNo: 'APT-2026-104',
    patientId: 'PAT-8024',
    patientName: 'David Kim',
    patientPhone: '+1 (555) 444-5555',
    doctorId: 'doc-2',
    doctorName: 'Dr. Robert Vance',
    department: 'Neurology',
    date: '2026-07-30',
    time: '10:00 AM',
    status: 'Approved',
    reason: 'Recurrent Migraine Assessment & MRI Review',
    consultationFee: 180
  },
  {
    id: 'apt-5',
    appointmentNo: 'APT-2026-105',
    patientId: 'PAT-8025',
    patientName: 'Clara Oswald',
    patientPhone: '+1 (555) 555-6666',
    doctorId: 'doc-3',
    doctorName: 'Dr. Emily Watson',
    department: 'Pediatrics',
    date: '2026-07-28',
    time: '03:00 PM',
    status: 'Completed',
    reason: 'Wellness Screening & Allergy Test',
    consultationFee: 120
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'pres-1',
    prescriptionNo: 'RX-9081',
    appointmentId: 'apt-5',
    patientId: 'PAT-8025',
    patientName: 'Clara Oswald',
    doctorId: 'doc-3',
    doctorName: 'Dr. Emily Watson',
    department: 'Pediatrics',
    diagnosis: 'Acute Upper Respiratory Tract Infection',
    medicines: [
      {
        name: 'Amoxicillin Trihydrate 500mg',
        dosage: '1 Capsule',
        frequency: '3 times daily (8-hourly)',
        duration: '7 Days',
        instructions: 'Take after meals with plenty of water.'
      },
      {
        name: 'Paracetamol 500mg',
        dosage: '1 Tablet',
        frequency: 'As needed for fever (max 4/day)',
        duration: '5 Days',
        instructions: 'Take when temperature exceeds 38°C.'
      },
      {
        name: 'Cetirizine 10mg',
        dosage: '1 Tablet',
        frequency: 'Once daily at bedtime',
        duration: '5 Days',
        instructions: 'May cause mild drowsiness.'
      }
    ],
    labTestsRequested: ['Complete Blood Count (CBC)', 'Serum IgE Level'],
    notes: 'Rest for 3 days. Hydrate well with warm liquids and avoid cold foods.',
    date: '2026-07-28'
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill-1',
    invoiceNo: 'INV-2026-001',
    patientId: 'PAT-8021',
    patientName: 'Eleanor Vance',
    items: [
      { id: 'bi-1', description: 'Cardiology Specialist Consultation', quantity: 1, price: 150, amount: 150 },
      { id: 'bi-2', description: '12-Lead Electrocardiogram (ECG)', quantity: 1, price: 120, amount: 120 },
      { id: 'bi-3', description: 'Echocardiogram (Color Doppler)', quantity: 1, price: 350, amount: 350 }
    ],
    subtotal: 620,
    tax: 31,
    discount: 50,
    totalAmount: 601,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    date: '2026-07-27',
    dueDate: '2026-08-10'
  },
  {
    id: 'bill-2',
    invoiceNo: 'INV-2026-002',
    patientId: 'PAT-8022',
    patientName: 'Marcus Brody',
    items: [
      { id: 'bi-4', description: 'General Physician Consultation', quantity: 1, price: 100, amount: 100 },
      { id: 'bi-5', description: 'Comprehensive Metabolic Panel & HbA1c Test', quantity: 1, price: 180, amount: 180 },
      { id: 'bi-6', description: 'Inpatient Ward Room (2 Days)', quantity: 2, price: 250, amount: 500 }
    ],
    subtotal: 780,
    tax: 39,
    discount: 0,
    totalAmount: 819,
    status: 'Unpaid',
    paymentMethod: 'Insurance',
    date: '2026-07-28',
    dueDate: '2026-08-12'
  },
  {
    id: 'bill-3',
    invoiceNo: 'INV-2026-003',
    patientId: 'PAT-8025',
    patientName: 'Clara Oswald',
    items: [
      { id: 'bi-7', description: 'Pediatric Consultation', quantity: 1, price: 120, amount: 120 },
      { id: 'bi-8', description: 'Pharmacy Dispensed Medication', quantity: 1, price: 65, amount: 65 }
    ],
    subtotal: 185,
    tax: 9.25,
    discount: 10,
    totalAmount: 184.25,
    status: 'Paid',
    paymentMethod: 'Online Gateway',
    date: '2026-07-28',
    dueDate: '2026-08-15'
  }
];

export const INITIAL_PHARMACY: PharmacyItem[] = [
  {
    id: 'med-1',
    code: 'MED-101',
    name: 'Amoxicillin 500mg Capsules',
    category: 'Antibiotics',
    stock: 450,
    unitPrice: 12.50,
    expiryDate: '2027-11-30',
    manufacturer: 'Pfizer Pharmaceuticals',
    reorderLevel: 100,
    status: 'In Stock'
  },
  {
    id: 'med-2',
    code: 'MED-102',
    name: 'Metformin 850mg Tablets',
    category: 'Antidiabetic',
    stock: 80,
    unitPrice: 18.00,
    expiryDate: '2027-08-15',
    manufacturer: 'Novartis Healthcare',
    reorderLevel: 120,
    status: 'Low Stock'
  },
  {
    id: 'med-3',
    code: 'MED-103',
    name: 'Atorvastatin 20mg Tablets',
    category: 'Cardiovascular',
    stock: 620,
    unitPrice: 22.00,
    expiryDate: '2028-03-20',
    manufacturer: 'AstraZeneca',
    reorderLevel: 150,
    status: 'In Stock'
  },
  {
    id: 'med-4',
    code: 'MED-104',
    name: 'Paracetamol Extra 500mg',
    category: 'Analgesic & Antipyretic',
    stock: 1200,
    unitPrice: 5.00,
    expiryDate: '2028-06-10',
    manufacturer: 'GSK Consumer Healthcare',
    reorderLevel: 200,
    status: 'In Stock'
  },
  {
    id: 'med-5',
    code: 'MED-105',
    name: 'Omeprazole 20mg Delayed Release',
    category: 'Gastrointestinal',
    stock: 15,
    unitPrice: 15.00,
    expiryDate: '2026-12-01',
    manufacturer: 'Bayer Pharmaceuticals',
    reorderLevel: 50,
    status: 'Low Stock'
  }
];

export const INITIAL_LAB_TESTS: LabTest[] = [
  {
    id: 'lab-1',
    testNo: 'LAB-2026-701',
    patientId: 'PAT-8021',
    patientName: 'Eleanor Vance',
    doctorName: 'Dr. Sarah Jenkins',
    testName: 'Lipid Profile & Serum Cholesterol',
    category: 'Biochemistry',
    price: 95,
    status: 'Completed',
    result: 'Total Cholesterol: 215 mg/dL (Borderline High), HDL: 52 mg/dL, LDL: 138 mg/dL',
    normalRange: 'Total Cholesterol < 200 mg/dL',
    resultSummary: 'Slightly elevated LDL cholesterol. Dietary modification recommended.',
    requestedDate: '2026-07-27',
    completedDate: '2026-07-28'
  },
  {
    id: 'lab-2',
    testNo: 'LAB-2026-702',
    patientId: 'PAT-8022',
    patientName: 'Marcus Brody',
    doctorName: 'Dr. Amanda Ramirez',
    testName: 'Glycated Hemoglobin (HbA1c)',
    category: 'Endocrinology',
    price: 80,
    status: 'In Progress',
    requestedDate: '2026-07-28'
  },
  {
    id: 'lab-3',
    testNo: 'LAB-2026-703',
    patientId: 'PAT-8023',
    patientName: 'Sophia Martinez',
    doctorName: 'Dr. Michael Chang',
    testName: 'Knee Joint Magnetic Resonance Imaging (MRI)',
    category: 'Radiology & Imaging',
    price: 450,
    status: 'Pending',
    requestedDate: '2026-07-29'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'admin',
    role: 'all',
    title: 'New Patient Registered',
    message: 'Patient Clara Oswald (PAT-8025) registered successfully.',
    date: '10 minutes ago',
    read: false,
    type: 'system'
  },
  {
    id: 'notif-2',
    userId: 'doc-1',
    role: 'doctor',
    title: 'Upcoming Appointment Alert',
    message: 'Appointment with Eleanor Vance scheduled for 09:30 AM today.',
    date: '30 minutes ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif-3',
    userId: 'admin',
    role: 'admin',
    title: 'Pharmacy Stock Warning',
    message: 'Omeprazole 20mg has reached low stock level (15 items remaining).',
    date: '2 hours ago',
    read: true,
    type: 'system'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-07-28 22:45:12',
    user: 'Dr. Sarah Jenkins',
    role: 'Doctor',
    action: 'Prescription Created RX-9081',
    module: 'Prescriptions',
    ip: '192.168.1.45'
  },
  {
    id: 'log-102',
    timestamp: '2026-07-28 21:10:05',
    user: 'System Admin',
    role: 'Admin',
    action: 'Generated Billing Invoice INV-2026-003',
    module: 'Billing',
    ip: '10.0.0.12'
  },
  {
    id: 'log-103',
    timestamp: '2026-07-28 19:30:00',
    user: 'Lab Tech Manager',
    role: 'Staff',
    action: 'Uploaded Lab Results LAB-2026-701',
    module: 'Laboratory',
    ip: '192.168.1.88'
  }
];

export const mockPatients = INITIAL_PATIENTS;
export const mockDoctors = INITIAL_DOCTORS;
export const mockAppointments = INITIAL_APPOINTMENTS;
export const mockPrescriptions = INITIAL_PRESCRIPTIONS;
export const mockBills = INITIAL_BILLS;
export const mockPharmacyItems = INITIAL_PHARMACY;
export const mockLabTests = INITIAL_LAB_TESTS;
export const mockDepartments = INITIAL_DEPARTMENTS;
export const mockNotifications = INITIAL_NOTIFICATIONS;


import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import {
  mockPatients,
  mockDoctors,
  mockAppointments,
  mockPrescriptions,
  mockBills,
  mockPharmacyItems,
  mockLabTests,
  mockDepartments,
  mockNotifications
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { DoctorsView } from './components/DoctorsView';
import { AppointmentsView } from './components/AppointmentsView';
import { PrescriptionsView } from './components/PrescriptionsView';
import { BillingView } from './components/BillingView';
import { PharmacyView } from './components/PharmacyView';
import { LaboratoryView } from './components/LaboratoryView';
import { ReportsView } from './components/ReportsView';
import { ApiDocsView } from './components/ApiDocsView';
import { SettingsView } from './components/SettingsView';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [pendingRole, setPendingRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Core Application Data State
  const [patients, setPatients] = useState(mockPatients);
  const [doctors, setDoctors] = useState(mockDoctors);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [bills, setBills] = useState(mockBills);
  const [pharmacyItems, setPharmacyItems] = useState(mockPharmacyItems);
  const [labTests, setLabTests] = useState(mockLabTests);
  const [departments] = useState(mockDepartments);
  const [notifications, setNotifications] = useState(mockNotifications || []);

  // Sync dark mode class on document HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers
  const handleAddPatient = (newPatient: any) => {
    const created = {
      ...newPatient,
      id: `p-${Date.now()}`,
      patientId: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPatients([created, ...patients]);
  };

  const handleUpdatePatient = (id: string, updatedFields: any) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
  };

  const handleAddDoctor = (newDoc: any) => {
    const created = {
      ...newDoc,
      id: `doc-${Date.now()}`,
      doctorId: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      status: 'Active'
    };
    setDoctors([created, ...doctors]);
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };

  const handleAddAppointment = (newApt: any) => {
    const created = {
      ...newApt,
      id: `apt-${Date.now()}`,
      appointmentNo: `APT-${Math.floor(100 + Math.random() * 900)}`
    };
    setAppointments([created, ...appointments]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: status as any } : a));
  };

  const handleAddPrescription = (newRx: any) => {
    const created = {
      ...newRx,
      id: `rx-${Date.now()}`,
      prescriptionNo: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setPrescriptions([created, ...prescriptions]);
  };

  const handleCreateBill = (newBill: any) => {
    const subtotal = newBill.items.reduce((acc: number, item: any) => acc + item.amount, 0);
    const tax = subtotal * 0.05;
    const totalAmount = subtotal + tax - (newBill.discount || 0);

    const created = {
      ...newBill,
      id: `b-${Date.now()}`,
      invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      subtotal,
      tax,
      totalAmount
    };
    setBills([created, ...bills]);
  };

  const handleUpdateBillStatus = (id: string, status: 'Paid' | 'Unpaid') => {
    setBills(bills.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleAddPharmacyItem = (newItem: any) => {
    const created = {
      ...newItem,
      id: `ph-${Date.now()}`,
      code: `DRG-${Math.floor(100 + Math.random() * 900)}`,
      status: newItem.stock > 50 ? 'In Stock' : 'Low Stock'
    };
    setPharmacyItems([created, ...pharmacyItems]);
  };

  const handleUpdatePharmacyStock = (id: string, newStock: number) => {
    setPharmacyItems(pharmacyItems.map(p => {
      if (p.id === id) {
        return {
          ...p,
          stock: newStock,
          status: newStock > 50 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock'
        };
      }
      return p;
    }));
  };

  const handleCreateLabTest = (newTest: any) => {
    const created = {
      ...newTest,
      id: `lab-${Date.now()}`,
      testNo: `LAB-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setLabTests([created, ...labTests]);
  };

  const handleUpdateLabTest = (id: string, updatedFields: any) => {
    setLabTests(labTests.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const handleRoleChangeRequest = (role: UserRole) => {
    if (role === 'admin') {
      setPendingRole('admin');
      setShowAuthModal(true);
    } else {
      setCurrentRole(role);
    }
  };

  const handleLoginSuccess = (role: UserRole) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Authentication Successful',
      message: `Logged in with ${role.toUpperCase()} security credentials.`,
      date: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPendingRole('admin');
  };

  if (!isLoggedIn) {
    return (
      <LoginModal
        isOpen={true}
        onClose={() => {}}
        onSuccess={handleLoginSuccess}
        targetRole={pendingRole}
        darkMode={darkMode}
        isFullPage={true}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Admin Authentication Overlay Modal */}
      <LoginModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLoginSuccess}
        targetRole={pendingRole}
        darkMode={darkMode}
        isFullPage={false}
      />
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChangeRequest}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notifications={notifications}
        onMarkRead={(id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))}
        onNavigate={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
      />

      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentRole={currentRole}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          darkMode={darkMode}
        />

        {/* Main Content Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              patients={patients}
              doctors={doctors}
              appointments={appointments}
              bills={bills}
              notifications={notifications}
              pharmacyItems={pharmacyItems}
              labTests={labTests}
              currentRole={currentRole}
              darkMode={darkMode}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              onAddPatient={handleAddPatient}
              onUpdatePatient={handleUpdatePatient}
              onDeletePatient={handleDeletePatient}
              currentRole={currentRole}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorsView
              doctors={doctors}
              departments={departments}
              onAddDoctor={handleAddDoctor}
              onUpdateDoctor={() => {}}
              onDeleteDoctor={handleDeleteDoctor}
              currentRole={currentRole}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              doctors={doctors}
              patients={patients}
              onAddAppointment={handleAddAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
              currentRole={currentRole}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'prescriptions' && (
            <PrescriptionsView
              prescriptions={prescriptions}
              patients={patients}
              doctors={doctors}
              onAddPrescription={handleAddPrescription}
              currentRole={currentRole}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              bills={bills}
              patients={patients}
              onCreateBill={handleCreateBill}
              onUpdateBillStatus={handleUpdateBillStatus}
              currentRole={currentRole}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'pharmacy' && (
            <PharmacyView
              items={pharmacyItems}
              onAddItem={handleAddPharmacyItem}
              onUpdateStock={handleUpdatePharmacyStock}
              currentRole={currentRole}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'laboratory' && (
            <LaboratoryView
              labTests={labTests}
              patients={patients}
              onCreateLabTest={handleCreateLabTest}
              onUpdateLabTest={handleUpdateLabTest}
              currentRole={currentRole}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              bills={bills}
              doctors={doctors}
              patients={patients}
              appointments={appointments}
              pharmacyItems={pharmacyItems}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'apidocs' && (
            <ApiDocsView darkMode={darkMode} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentRole={currentRole}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
            />
          )}
        </main>
      </div>

    </div>
  );
}

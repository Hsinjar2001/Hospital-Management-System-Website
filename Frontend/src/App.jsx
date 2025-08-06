import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import AdminLayout from './Component/layout/AdminLayout';
import DoctorLayout from './Component/layout/DoctorLayout';
import PatientLayout from './Component/layout/PatientLayout';

// Common Components
import Footer from './Component/common/Footer';
import LoadingSpinner from './Component/common/LodingSpinner';
import Navbar from './Component/common/Navbar';

// Auth Context
const AuthContext = createContext();

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('hospitalUser');
        sessionStorage.removeItem('hospitalUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('hospitalUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hospitalUser');
    sessionStorage.removeItem('hospitalUser');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth Hook - EXPORT THIS
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Pages
import ChangePasswordPage from './pages/Auth/ChangePasswordPage';
import ForgetPasswordPage from './pages/Auth/ForgetPasswordPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Admin Dashboard Pages
import AddDoctorPage from './pages/Admindashboard/AddDoctorPage';
import AddPatientsPage from './pages/Admindashboard/AddPatientsPage';
import AdminDashboard from './pages/Admindashboard/AdminDashboard';
import AdminProfileSetting from './pages/Admindashboard/AdminProfileSetting';
import AppointmentsPage from './pages/Admindashboard/AppointmentsPage';
import DepartmentPage from './pages/Admindashboard/DepartmentPage';
import DoctorsListPage from './pages/Admindashboard/DoctorsListPage';
import PatientsDetailsPage from './pages/Admindashboard/PatientsDetailsPage';
import PatientsListPage from './pages/Admindashboard/PatientsListPage';
import RolesAndPremissionPage from './pages/Admindashboard/RolesAndPremissionPage';

// Doctor Dashboard Pages
import DoctorAppointmentPage from './pages/Doctordashboard/AppointmentPage';
import DoctorAppointmentManagementPage from './pages/Doctordashboard/DoctorAppointmentManagementPage';
import Doctordashboard from './pages/Doctordashboard/Doctordashboard';
import DoctorProfilePage from './pages/Doctordashboard/DoctorProfilePage';

import PatientsPage from './pages/Doctordashboard/PatientsPage';
import PrescriptionsPage from './pages/Doctordashboard/PrescriptionsPage';
import ReviewsPage from './pages/Doctordashboard/ReviewsPage';

// Patient Dashboard Pages
import PatientAppointmentPage from './pages/Patientdashboard/AppointmentPage';
import InvoicePage from './pages/Patientdashboard/InvoicePage';
import PatientInvoicesPage from './pages/Patientdashboard/PatientInvoicesPage';
import PatientDashboard from './pages/Patientdashboard/PatientDashboard';
import PatientsPrescriptionPage from './pages/Patientdashboard/PatientsPrescriptionPage';
import PatientSettingPage from './pages/Patientdashboard/SettingPage';
import DoctorsPage from './pages/Patient/DoctorsPage';

// Home Page
import HomePage from './pages/Home/Home_page';

// Error Page
import ErrorPage404 from './pages/shared/ErrorPage404';



// Unauthorized Page Component
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (isAuthenticated && user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'doctor':
        return <Navigate to="/doctor/dashboard" replace />;
      case 'patient':
        return <Navigate to="/patient/dashboard" replace />;
      default:
        return children;
    }
  }
  
  return children;
};

// Layout Wrapper Component
const LayoutWrapper = ({ children, role }) => {
  const getLayout = () => {
    switch (role) {
      case 'admin':
        return <AdminLayout>{children}</AdminLayout>;
      case 'doctor':
        return <DoctorLayout>{children}</DoctorLayout>;
      case 'patient':
        return <PatientLayout>{children}</PatientLayout>;
      default:
        return <div className="min-h-screen bg-gray-50">{children}</div>;
    }
  };
  
  return getLayout();
};

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="App">
      <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Navbar />
                  <HomePage />
                  {/* <Footer /> */}
                </PublicRoute>
              } 
            />
            <Route 
              path="/home" 
              element={
                <PublicRoute>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </PublicRoute>
              } 
            />
            
            {/* Authentication Routes */}
            <Route 
              path="/auth/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/auth/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/auth/forget-password" 
              element={
                <PublicRoute>
                  <ForgetPasswordPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/auth/change-password" 
              element={<ChangePasswordPage />} 
            />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <LayoutWrapper role="admin">
                  <Routes>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    
                    {/* Doctor Management */}
                    <Route path="doctors" element={<Navigate to="/admin/doctors/list" replace />} />
                    <Route path="doctors/list" element={<DoctorsListPage />} />
                    <Route path="doctors/add" element={<AddDoctorPage />} />
                    <Route path="doctors/edit/:id" element={<AddDoctorPage />} />
                    <Route path="doctors/:id" element={<AdminDashboard />} />
                    
                    {/* Patient Management */}
                    <Route path="patients" element={<Navigate to="/admin/patients/list" replace />} />
                    <Route path="patients/list" element={<PatientsListPage />} />
                    <Route path="patients/add" element={<AddPatientsPage />} />
                    <Route path="patients/edit/:id" element={<AddPatientsPage />} />
                    <Route path="patients/:id" element={<PatientsDetailsPage />} />
                    
                    {/* Appointments */}
                    <Route path="appointments" element={<Navigate to="/admin/appointments/list" replace />} />
                    <Route path="appointments/list" element={<AppointmentsPage />} />
                    <Route path="appointments/add" element={<AppointmentsPage />} />
                    <Route path="appointments/:id" element={<AppointmentsPage />} />
                    
                    {/* Departments */}
                    <Route path="departments" element={<Navigate to="/admin/departments/list" replace />} />
                    <Route path="departments/list" element={<DepartmentPage />} />
                    <Route path="departments/add" element={<DepartmentPage />} />
                    <Route path="departments/:id" element={<DepartmentPage />} />
                    
                    {/* Roles and Permissions */}
                    <Route path="roles" element={<Navigate to="/admin/roles/list" replace />} />
                    <Route path="roles/list" element={<RolesAndPremissionPage />} />
                    <Route path="roles/add" element={<RolesAndPremissionPage />} />
                    <Route path="roles/:id" element={<RolesAndPremissionPage />} />
                    
                    {/* Reports */}
                    <Route path="reports" element={<AdminDashboard />} />
                    <Route path="reports/patients" element={<AdminDashboard />} />
                    <Route path="reports/doctors" element={<AdminDashboard />} />
                    <Route path="reports/appointments" element={<AdminDashboard />} />
                    <Route path="reports/financial" element={<AdminDashboard />} />
                    
                    {/* Admin Profile */}
                    <Route path="profile" element={<AdminProfileSetting />} />
                    <Route path="profile/edit" element={<AdminProfileSetting />} />
                    <Route path="settings" element={<AdminProfileSetting />} />
                    
                    {/* Password Management */}
                    <Route path="change-password" element={<ChangePasswordPage />} />
                  </Routes>
                </LayoutWrapper>
              </ProtectedRoute>
            } />
            
            {/* Doctor Dashboard Routes */}
            <Route path="/doctor/*" element={
              <ProtectedRoute requiredRole="doctor">
                <LayoutWrapper role="doctor">
                  <Routes>
                    <Route index element={<Navigate to="/doctor/dashboard" replace />} />
                    <Route path="dashboard" element={<Doctordashboard />} />
                    
                    {/* Appointments */}
                    <Route path="appointments" element={<Navigate to="/doctor/appointments/manage" replace />} />
                    <Route path="appointments/manage" element={<DoctorAppointmentManagementPage />} />
                    
                    {/* Patients */}
                    <Route path="patients" element={<PatientsPage />} />
                    <Route path="patients/:id" element={<PatientsDetailsPage />} />
                    
                    {/* Prescriptions */}
                    <Route path="prescriptions" element={<Navigate to="/doctor/prescriptions/list" replace />} />
                    <Route path="prescriptions/list" element={<PrescriptionsPage />} />
                    <Route path="prescriptions/add" element={<PrescriptionsPage />} />
                    <Route path="prescriptions/:id" element={<PrescriptionsPage />} />
                    
                    {/* Reviews */}
                    <Route path="reviews" element={<Navigate to="/doctor/reviews/list" replace />} />
                    <Route path="reviews/list" element={<ReviewsPage />} />
                    
                    {/* Reports */}
                    <Route path="reports" element={<Doctordashboard />} />
                    <Route path="reports/patients" element={<Doctordashboard />} />
                    <Route path="reports/appointments" element={<Doctordashboard />} />
                    
                    {/* Doctor Profile */}
                    <Route path="profile" element={<DoctorProfilePage />} />
                    <Route path="profile/edit" element={<DoctorProfilePage />} />
                    <Route path="settings" element={<DoctorProfilePage />} />
                    
                    {/* Password Management */}
                    <Route path="change-password" element={<ChangePasswordPage />} />
                  </Routes>
                </LayoutWrapper>
              </ProtectedRoute>
            } />
            
            {/* Patient Dashboard Routes */}
            <Route path="/patient/*" element={
              <ProtectedRoute requiredRole="patient">
                <LayoutWrapper role="patient">
                  <Routes>
                    <Route index element={<Navigate to="/patient/dashboard" replace />} />
                    <Route path="dashboard" element={<PatientDashboard />} />
                    
                    {/* Doctors */}
                    <Route path="doctors" element={<DoctorsPage />} />
                    
                    {/* Appointments */}
                    <Route path="appointments" element={<Navigate to="/patient/appointments/list" replace />} />
                    <Route path="appointments/list" element={<PatientAppointmentPage />} />
                    <Route path="appointments/book" element={<PatientAppointmentPage />} />
                    <Route path="appointments/:id" element={<PatientAppointmentPage />} />
                    
                    {/* Medical Records */}
                    <Route path="medical-records" element={<PatientDashboard />} />
                    <Route path="medical-history" element={<PatientDashboard />} />
                    
                    {/* Prescriptions */}
                    <Route path="prescriptions" element={<Navigate to="/patient/prescriptions/list" replace />} />
                    <Route path="prescriptions/list" element={<PatientsPrescriptionPage />} />
                    <Route path="prescriptions/:id" element={<PatientsPrescriptionPage />} />
                    
                    {/* Invoices & Billing */}
                    <Route path="invoices" element={<Navigate to="/patient/invoices/list" replace />} />
                    <Route path="invoices/list" element={<PatientInvoicesPage />} />
                    <Route path="invoices/:id" element={<InvoicePage />} />
                    <Route path="billing" element={<InvoicePage />} />
                    <Route path="payment-history" element={<InvoicePage />} />
                    
                    {/* Health Records */}
                    <Route path="health-records" element={<PatientDashboard />} />
                    <Route path="lab-results" element={<PatientDashboard />} />
                    <Route path="vital-signs" element={<PatientDashboard />} />
                    
                    {/* Reviews */}
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="reviews/add" element={<ReviewsPage />} />
                    
                    {/* Patient Profile */}
                    <Route path="profile" element={<PatientSettingPage />} />
                    <Route path="profile/edit" element={<PatientSettingPage />} />
                    <Route path="settings" element={<PatientSettingPage />} />
                    <Route path="notifications" element={<PatientSettingPage />} />
                    <Route path="privacy" element={<PatientSettingPage />} />
                    
                    {/* Password Management */}
                    <Route path="change-password" element={<ChangePasswordPage />} />
                  </Routes>
                </LayoutWrapper>
              </ProtectedRoute>
            } />
            
            {/* Shared Routes */}
            <Route 
              path="/search/doctors" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <AdminDashboard />
                  <Footer />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/emergency" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <AdminDashboard />
                  <Footer />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/help" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PatientSettingPage />
                  <Footer />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/contact" 
              element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              } 
            />
            
            <Route 
              path="/about" 
              element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              } 
            />
            
            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/error" element={<ErrorPage404 />} />
            <Route path="/404" element={<ErrorPage404 />} />
            
            {/* Catch all route */}
            <Route path="*" element={<ErrorPage404 />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

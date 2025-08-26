import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import WorkerLayout from './Pages/Worker/components/Layout';
import WorkerDashboard from './Pages/Worker/Pages/Dashboard';
import MonitoringPage from './Pages/Worker/Pages/MonitoringPage';
import ControlsPage from './Pages/Worker/Pages/ControlsPage';
import NotificationsPage from './Pages/Worker/Pages/NotificationsPage';
import ProfilePage from './Pages/Worker/Pages/ProfilePage';
import AllWorkLogsPage from './Pages/Worker/Pages/AllWorkLogsPage';
import { TemperatureProvider } from './Pages/Worker/context/TemperatureContext';
import GlobalOverheatModal from './Pages/Worker/components/GlobalOverheatModal';
import WeatherDashboard from './Pages/Worker/Pages/WeatherDashboard';
import WorkerRoutesWrapper from './Pages/Worker/components/WorkerRoutesWrapper';

import SupervisorLayout from './Pages/Supervisor/components/Layout';
import SupervisorDashboard from './Pages/Supervisor/pages/Dashboard';
import WorkerManagement from './Pages/Supervisor/pages/WorkerManagement';
import IncidentManagement from './Pages/Supervisor/pages/IncidentManagement';
import ProfileLogs from './Pages/Supervisor/pages/ProfileLogs';
import SupervisorProfile from './Pages/Supervisor/pages/SupervisorProfile'; // Added import

import ManagerLayout from './Pages/Manager/components/Layout/Layout';
import Dashboard from './Pages/Manager/pages/Dashboard';
import Performance from './Pages/Manager/pages/Performance';
import Inventory from './Pages/Manager/pages/Inventory';
import Financial from './Pages/Manager/pages/Financial';
import Issues from './Pages/Manager/pages/IssuesPage';
import Workers from './Pages/Manager/pages/Workers';
import Profile from './Pages/Manager/pages/Profile';
import AddWorker from './Pages/Manager/pages/AddWorker';

import EmployeeForm from './Pages/Manager/Finance/EmployeeForm';
import PayrollView from './Pages/Manager/pages/PayrollView';

import { PaySuccess } from './Pages/Manager/Pages/PaySuccess';
import { PayCancel } from './Pages/Manager/Pages/PayCancel';

import OwnerLayout from './Pages/Owner/components/layout/OwnerLayout';
import { ExecutiveDashboard } from './Pages/Owner/components/dashboard/ExecutiveDashboard';
import { FinancialManagement } from './Pages/Owner/components/financial/FinancialManagement';
import { StrategicPlanning } from './Pages/Owner/components/strategic/StrategicPlanning';
import { UserManagement } from './Pages/Owner/components/users/UserManagement';
import  AddUser  from './Pages/Owner/components/users/AddUserModal';
import OwnerProfile from './Pages/Owner/components/profile/OwnerProfile';
import Reports from './Pages/Owner/components/reports';

import { Login } from './Pages/Login/LoginPage';
import { AuthProvider } from './Pages/Login/AuthContext';
import { ForgotPasswordPage } from './Pages/Login/Forgot/ForgotPasswordPage';
import { VerifyOtpPage } from './Pages/Login/Forgot/VerifyOtpPage';
import { ChangePasswordPage } from './Pages/Login/Forgot/ChangePasswordPage';

function App() {
  return (
    <AuthProvider>
      <TemperatureProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/add-user" element={<AddUser />} />

          {/* Worker Routes */}
          <Route path="/worker" element={<WorkerLayout />}>
            <Route element={<WorkerRoutesWrapper />}>
              <Route index element={<WorkerDashboard />} />
              <Route path="monitoring" element={<MonitoringPage />} />
              <Route path="controls" element={<ControlsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="WeatherDashboard" element={<WeatherDashboard />} />
              <Route path="work-logs" element={<AllWorkLogsPage />} />
            </Route>
          </Route>

          {/* Supervisor Routes */}
          <Route path="/supervisor" element={<SupervisorLayout />}>
            <Route index element={<SupervisorDashboard />} />
            <Route path="worker-management" element={<WorkerManagement />} />
            <Route path="incident-management" element={<IncidentManagement />} />
            <Route path="profile-logs" element={<ProfileLogs />} />
            <Route path="profile" element={<SupervisorProfile />} /> {/* Added route */}
          </Route>

          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="performance" element={<Performance />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="financial" element={<Financial />} />
            <Route path="issues" element={<Issues />} />
            <Route path="workers" element={<Workers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-worker" element={<AddWorker />} />
            <Route path="/manager/financial/employees/edit/:id" element={<EmployeeForm />} />
            <Route path="financial/employees/new" element={<EmployeeForm />} />
          </Route>

          <Route path="/payroll/:id" element={<PayrollView />} />
          <Route path="/manager/financial" element={<Financial />} />


          {/* Pay Success and Pay Cancel Routes */}
          <Route path="/pay-success" element={<PaySuccess />} />
          <Route path="/pay-cancel" element={<PayCancel />} />

          {/* Owner Routes */}
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<ExecutiveDashboard />} />
            <Route path="financial" element={<FinancialManagement />} />
            <Route path="strategic" element={<StrategicPlanning />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="profile" element={<OwnerProfile />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        {/* Render the GlobalOverheatModal globally */}
        <GlobalOverheatModal />
      </Router>
      </TemperatureProvider>
    </AuthProvider>
  );
}

export default App;

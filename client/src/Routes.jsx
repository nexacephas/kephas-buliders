import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import PublicLayout from './public/PublicLayout';
import RegistrationSuccess from './public/RegistrationSuccess';
import PublicHome from './App';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicHome />} />
          <Route path="/registration/success" element={<RegistrationSuccess />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Landing from '../pages/Landing';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyForgotOtp from '../pages/VerifyForgotOtp';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Subscriptions from '../pages/Subscriptions';
import CreateSubscription from '../pages/CreateSubscription';
import SubscriptionDetail from '../pages/SubscriptionDetail';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';

import ProtectedRoute from '../components/layout/ProtectedRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/verify" element={<VerifyForgotOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/subscriptions/new" element={<CreateSubscription />} />
          <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

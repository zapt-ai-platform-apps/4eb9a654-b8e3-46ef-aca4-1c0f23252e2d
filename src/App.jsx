import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthProvider from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import Dashboard from '@/pages/dashboard/Dashboard';
import Accounts from '@/pages/accounts/Accounts';
import ReviewScanner from '@/pages/reviews/ReviewScanner';
import AnalysisPage from '@/pages/analysis/AnalysisPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Layout from '@/components/layout/Layout';
import ZaptBadge from '@/components/common/ZaptBadge';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/accounts" element={
              <ProtectedRoute>
                <Accounts />
              </ProtectedRoute>
            } />
            
            <Route path="/scan/:accountId?" element={
              <ProtectedRoute>
                <ReviewScanner />
              </ProtectedRoute>
            } />
            
            <Route path="/analysis/:accountId" element={
              <ProtectedRoute>
                <AnalysisPage />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      
      <ZaptBadge />
      <ToastContainer position="bottom-right" />
    </div>
  );
}
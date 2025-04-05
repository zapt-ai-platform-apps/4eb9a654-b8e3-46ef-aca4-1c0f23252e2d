import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, recordLogin } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const hasSessionRef = useRef(false);
  const navigate = useNavigate();

  // Update session and session reference
  const updateSession = (newSession) => {
    setSession(newSession);
    hasSessionRef.current = newSession !== null;
  };

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        updateSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session) {
          hasSessionRef.current = true;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        Sentry.captureException(error);
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state change:', event);
      
      if (event === 'SIGNED_IN') {
        if (!hasSessionRef.current) {
          updateSession(newSession);
          setUser(newSession?.user || null);
          setHasRecordedLogin(false);
          navigate('/dashboard');
        } else {
          console.log('Already have session, ignoring SIGNED_IN event');
        }
      } else if (event === 'TOKEN_REFRESHED') {
        updateSession(newSession);
        setUser(newSession?.user || null);
      } else if (event === 'SIGNED_OUT') {
        updateSession(null);
        setUser(null);
        setHasRecordedLogin(false);
        navigate('/login');
      } else if (event === 'USER_UPDATED') {
        updateSession(newSession);
        setUser(newSession?.user || null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Record login in a separate effect
  useEffect(() => {
    if (session?.user?.email && !hasRecordedLogin) {
      try {
        recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
        setHasRecordedLogin(true);
      } catch (error) {
        console.error('Failed to record login:', error);
        Sentry.captureException(error);
      }
    }
  }, [session, hasRecordedLogin]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      Sentry.captureException(error);
      toast.error('Error signing out');
    }
  };

  const authContextValue = {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
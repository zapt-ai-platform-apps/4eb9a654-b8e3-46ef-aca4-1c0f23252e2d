import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import useAuth from '@/hooks/useAuth';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Loading authentication..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <img
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=64&height=64"
            alt="SocialScan"
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to SocialScan</h2>
          <p className="mt-2 text-sm text-gray-600">
            Monitor and analyze social media reviews all in one place
          </p>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-indigo-600">Sign in with ZAPT</p>
          <p className="text-xs text-gray-500 mt-1">
            <a 
              href="https://www.zapt.ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-indigo-600 transition-colors"
            >
              Learn more about ZAPT
            </a>
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4338ca',
                  brandAccent: '#312e81',
                }
              }
            }
          }}
          providers={['google', 'facebook', 'apple']}
          magicLink={true}
          view="magic_link"
        />
      </div>
    </div>
  );
}
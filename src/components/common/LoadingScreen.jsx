import React from 'react';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 text-lg">{message}</p>
    </div>
  );
}
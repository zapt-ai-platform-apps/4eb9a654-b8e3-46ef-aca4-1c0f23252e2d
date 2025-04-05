import React from 'react';

export default function ZaptBadge() {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <a 
        href="https://www.zapt.ai" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-xs font-medium bg-white text-gray-600 py-1 px-2 rounded-md shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
      >
        Made on ZAPT
      </a>
    </div>
  );
}
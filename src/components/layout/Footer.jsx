import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=24&height=24" 
              alt="SocialScan" 
              className="h-6 w-auto mr-2"
            />
            <span className="text-base font-medium text-gray-700">SocialScan</span>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Dashboard
            </Link>
            <a 
              href="https://www.zapt.ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Made on ZAPT
            </a>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            &copy; {currentYear} SocialScan. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
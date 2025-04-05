import React from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiSmile, FiTrendingUp, FiPhone } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const features = [
    { 
      icon: <FiBarChart2 className="h-10 w-10 text-indigo-600" />,
      title: 'Comprehensive Analytics',
      description: 'Get detailed analytics on customer reviews across multiple social media platforms. Track sentiment trends and identify key areas for improvement.'
    },
    { 
      icon: <FiSmile className="h-10 w-10 text-indigo-600" />,
      title: 'Sentiment Analysis',
      description: 'Understand customer emotions with advanced sentiment analysis. Know exactly how customers feel about your products and services.'
    },
    { 
      icon: <FiTrendingUp className="h-10 w-10 text-indigo-600" />,
      title: 'Actionable Insights',
      description: 'Convert data into actionable insights with AI-powered recommendations. Prioritize what matters most to improve customer satisfaction.'
    },
    { 
      icon: <FiPhone className="h-10 w-10 text-indigo-600" />,
      title: 'Mobile-Friendly',
      description: 'Monitor your reviews on the go with our mobile-friendly application. Get real-time updates wherever you are.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32" 
                alt="SocialScan" 
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-indigo-600">SocialScan</span>
            </div>
            <div>
              <Link
                to="/login"
                className="btn-primary"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                  Monitor and Analyze Social Media Reviews
                </h1>
                <p className="text-xl mb-8 text-indigo-100">
                  Get comprehensive insights into what customers are saying about your business across social media platforms.
                </p>
                <div className="space-x-4">
                  <Link to="/login" className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg inline-block">
                    Get Started
                  </Link>
                  <a href="#features" className="bg-transparent hover:bg-indigo-500 text-white border border-white font-bold py-3 px-6 rounded-lg transition-colors inline-block">
                    Learn More
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="data:image-request=dashboard showing social media review analysis with charts and sentiment scores"
                  alt="SocialScan Dashboard Preview" 
                  className="rounded-lg shadow-2xl h-96 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Powerful Features for Social Media Review Analysis
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unlock valuable insights from customer reviews and make data-driven decisions to improve your business.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-16">
                  <h2 className="text-3xl font-extrabold text-white mb-4">
                    Ready to gain insights from your social media reviews?
                  </h2>
                  <p className="text-indigo-100 text-lg mb-6">
                    Start analyzing customer feedback across all your social platforms and transform data into actionable insights today.
                  </p>
                  <Link
                    to="/login"
                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg inline-block"
                  >
                    Get Started Now
                  </Link>
                </div>
                <div className="hidden md:block bg-indigo-500">
                  <img 
                    src="data:image-request=person using mobile app to scan social media reviews with AI"
                    alt="SocialScan in action" 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
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
              <a href="#features" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Features
              </a>
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Sign In
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
              &copy; {new Date().getFullYear()} SocialScan. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">DDMRP</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-slate-600 hover:text-blue-600 transition-colors">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/intuiflow" className="text-blue-800 font-medium hover:text-blue-600 transition-colors">
                    IntuiFlow
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/login" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition-colors text-sm font-medium"
                  >
                    Admin Login
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 bg-green-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h1>
          
          <p className="text-xl text-slate-600 mb-8">
            We've received your demo request and will contact you shortly to schedule your personalized IntuitiveFlow demonstration.
          </p>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">What happens next?</h2>
            
            <ol className="space-y-4 text-left">
              <li className="flex items-start">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3 mt-0.5">
                  1
                </div>
                <p className="text-slate-600">
                  Our team will review your request and reach out to you within 1-2 business days.
                </p>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3 mt-0.5">
                  2
                </div>
                <p className="text-slate-600">
                  We'll schedule a convenient time for your personalized demo based on your preferences.
                </p>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-3 mt-0.5">
                  3
                </div>
                <p className="text-slate-600">
                  You'll receive a calendar invitation with all the details for your demo session.
                </p>
              </li>
            </ol>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
            <Link 
              href="/courses" 
              className="px-6 py-2 bg-white border border-blue-200 text-blue-600 rounded-md shadow-sm hover:bg-blue-50 transition-colors"
            >
              Explore Our Courses
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-600">© 2023 DDMRP Project</p>
        </div>
      </footer>
    </div>
  );
} 
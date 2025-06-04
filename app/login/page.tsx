"use client";

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Show success message briefly before redirecting
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // This would normally connect to an API endpoint
      // For now, just simulate a successful recovery email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRecoverySuccess(true);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to send recovery email. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col justify-center items-center p-4 relative">
      {/* Background with overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/courses/course-detail-bg.jpg"
          alt="DDMRP Admin"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/90"></div>
        
        {/* Abstract shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center justify-center">
              <div className="relative h-16 w-16 overflow-hidden">
                <Image 
                  src="/cropped-Design-sans-titre-23.png" 
                  alt="DDMRP Logo" 
                  width={64} 
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-1 w-10 bg-green-500 rounded-full"></div>
            <div className="h-1 w-6 bg-orange-400 rounded-full"></div>
            <div className="h-1 w-10 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-white/80">Sign in to access the admin dashboard</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600/90 to-green-500/90 px-6 py-5">
            <h2 className="text-xl font-semibold text-white">
              {forgotPassword ? 'Password Recovery' : 'Admin Login'}
            </h2>
          </div>
          
          <div className="p-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Login successful! Redirecting to dashboard...</span>
              </motion.div>
            )}

            {forgotPassword ? (
              <>
                {recoverySuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Recovery Email Sent</h3>
                    <p className="text-white/80 mb-6">
                      If an account exists with this email, you'll receive instructions to reset your password.
                    </p>
                    <button
                      onClick={() => {
                        setForgotPassword(false);
                        setRecoverySuccess(false);
                        setRecoveryEmail('');
                      }}
                      className="px-6 py-2 bg-white text-green-600 rounded-lg shadow-md hover:bg-green-50 transition-colors"
                    >
                      Return to Login
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRecovery} className="space-y-6">
                    <div>
                      <label htmlFor="recoveryEmail" className="block text-sm font-medium text-white mb-1">
                        Email Address
                      </label>
                      <input
                        id="recoveryEmail"
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-white placeholder-white/50"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-3 px-4 rounded-lg transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          'Send Recovery Email'
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setForgotPassword(false)}
                        className="text-white/80 hover:text-white text-sm text-center"
                      >
                        Return to login
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-white placeholder-white/50"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                      Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setForgotPassword(true)}
                      className="text-xs text-green-400 hover:text-green-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-white placeholder-white/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading || showSuccess}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-3 px-4 rounded-lg transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : showSuccess ? (
                    <span className="flex items-center justify-center">
                      <svg className="h-4 w-4 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Success
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-white/80 hover:text-white text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 
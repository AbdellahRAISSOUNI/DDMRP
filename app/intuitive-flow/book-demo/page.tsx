"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageWrapper from '@/app/components/PageWrapper';

export default function BookDemoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    preferredDate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/demo-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit form');
      }
      
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        preferredDate: '',
        message: ''
      });
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/intuitive-flow/book-demo/thank-you');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen w-full overflow-hidden">
        {/* Hero Section */}
        <div className="relative pt-40 pb-20 overflow-hidden">
          {/* Background with overlay */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/images/demo-bg.jpg"
              alt="Book a Demo"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-blue-900/80"></div>
            
            {/* Abstract shapes */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div variants={fadeIn} className="mb-4">
                <Link 
                  href="/intuitive-flow" 
                  className="inline-flex items-center text-blue-300 hover:text-blue-200 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to IntuitiveFlow
                </Link>
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Book Your Demo
              </motion.h1>
              
              <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 mb-6">
                {['bg-green-500', 'bg-orange-400', 'bg-blue-500'].map((color, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 w-10 ${color} rounded-full`}
                  ></div>
                ))}
              </motion.div>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl text-white/90 max-w-2xl mx-auto"
              >
                Experience how IntuitiveFlow can transform your supply chain management
              </motion.p>
            </motion.div>
          </div>
          
          {/* Decorative wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path 
                fill="#ffffff" 
                fillOpacity="1" 
                d="M0,64L60,80C120,96,240,128,360,122.7C480,117,600,75,720,64C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Form Section */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="py-16"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
                <h2 className="text-2xl font-bold text-white">Request Your Personalized Demo</h2>
                <p className="text-blue-100 mt-1">Fill out the form below and our team will contact you shortly</p>
              </div>
              
              <div className="p-6 md:p-8">
                {success ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 mb-6"
                  >
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-lg font-semibold">Thank you for your interest!</h3>
                    </div>
                    <p>We've received your request and will contact you shortly.</p>
                  </motion.div>
                ) : null}
                
                {error ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 mb-6"
                  >
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-semibold">Error</h3>
                    </div>
                    <p>{error}</p>
                  </motion.div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <motion.div variants={fadeIn} className="md:col-span-2 lg:col-span-1">
                      <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 bg-white"
                        placeholder="John Doe"
                        required
                      />
                    </motion.div>
                    
                    {/* Email */}
                    <motion.div variants={fadeIn} className="md:col-span-2 lg:col-span-1">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 bg-white"
                        placeholder="your@email.com"
                        required
                      />
                    </motion.div>
                    
                    {/* Phone */}
                    <motion.div variants={fadeIn} className="md:col-span-2 lg:col-span-1">
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 bg-white"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </motion.div>
                    
                    {/* Company */}
                    <motion.div variants={fadeIn} className="md:col-span-2 lg:col-span-1">
                      <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 bg-white"
                        placeholder="Your Company Ltd."
                      />
                    </motion.div>
                    
                    {/* Preferred Date */}
                    <motion.div variants={fadeIn} className="md:col-span-2">
                      <label htmlFor="preferredDate" className="block text-sm font-medium text-slate-700 mb-1">
                        Preferred Demo Date
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 bg-white"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </motion.div>
                    
                    {/* Message */}
                    <motion.div variants={fadeIn} className="md:col-span-2">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 bg-white"
                        placeholder="Tell us about your specific needs or questions..."
                      />
                    </motion.div>
                    
                    <motion.div variants={fadeIn} className="md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ${
                          isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Book Your Demo'
                        )}
                      </button>
                    </motion.div>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Features Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Quick Setup</h3>
                <p className="text-slate-600">
                  Our demo is designed to get you up and running quickly, with minimal setup time required.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Customized Demo</h3>
                <p className="text-slate-600">
                  We tailor each demo to your specific business needs and supply chain challenges.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Secure Process</h3>
                <p className="text-slate-600">
                  Your information is kept confidential and secure throughout the demo process.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </PageWrapper>
  );
} 
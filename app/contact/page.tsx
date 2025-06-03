"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }
      
      setSubmitResult({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : 'There was an error submitting your message. Please try again.',
      });
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
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen w-full overflow-hidden">
        {/* Hero section */}
        <div 
          ref={heroRef} 
          className="relative pt-40 pb-20 overflow-hidden"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <Image
              src="/images/contact-bg.jpg"
              alt="Contact DDMRP"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/70"></div>
            
            {/* Abstract shapes with parallax effect */}
            <div 
              className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            ></div>
            <div 
              className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ transform: `translateY(${scrollY * -0.03}px)` }}
            ></div>
            <div 
              className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ transform: `translateY(${scrollY * 0.04}px)` }}
            ></div>
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
                  href="/" 
                  className="inline-flex items-center text-green-400 hover:text-green-300 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Get in Touch
              </motion.h1>
              
              <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 mb-6">
                {['bg-green-500', 'bg-orange-400', 'bg-red-500'].map((color, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 w-12 ${color} rounded-full`}
                  ></div>
                ))}
              </motion.div>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl text-white/90 max-w-2xl mx-auto"
              >
                Have questions about our services? We're here to help you implement DDMRP successfully.
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
      
        {/* Contact Section */}
        <div className="py-16 -mt-6 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-12"
            >
              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-100"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="relative">
                    Send us a message
                    <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-green-500 rounded-full"></div>
                  </span>
                </h2>
                
                {submitResult && (
                  <div 
                    className={`p-6 mb-8 rounded-lg ${
                      submitResult.success 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {submitResult.success ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span className="font-medium">{submitResult.message}</span>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-slate-800 bg-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-800 bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-slate-800 bg-white"
                        placeholder="+1 (234) 567-8900"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-slate-800 bg-white"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-800 bg-white"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-medium py-3 px-6 rounded-lg transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h15" />
                        </svg>
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-xs text-slate-500 mt-4">
                    By submitting this form, you agree to our <a href="#" className="text-green-600 hover:underline">privacy policy</a> and <a href="#" className="text-green-600 hover:underline">terms of service</a>.
                  </p>
                </form>
              </motion.div>
              
              {/* Contact Information */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="lg:col-span-2 space-y-8"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="relative">
                      Contact Information
                      <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-orange-500 rounded-full"></div>
                    </span>
                  </h2>
                  
                  <div className="space-y-8 mt-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">Address</h3>
                        <p className="text-slate-600">
                          123 Business Street, Suite 100<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">Email</h3>
                        <p className="text-slate-600">
                          <a href="mailto:info@ddmrp.com" className="text-orange-500 hover:underline">
                            info@ddmrp.com
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">Phone</h3>
                        <p className="text-slate-600">
                          <a href="tel:+12345678900" className="text-red-600 hover:underline">
                            +1 (234) 567-8900
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      
        {/* FAQ Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                {['bg-green-500', 'bg-orange-400', 'bg-red-500'].map((color, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 w-12 ${color} rounded-full`}
                  ></div>
                ))}
              </div>
              <p className="text-lg text-slate-600">
                Find answers to common questions about our services
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              {[
                {
                  question: 'What is DDMRP?',
                  answer: 'Demand Driven Material Requirements Planning (DDMRP) is a method of supply chain planning and execution that protects and promotes the flow of relevant information through strategic establishment and management of decoupling point stock buffers.',
                  color: 'green'
                },
                {
                  question: 'How can DDMRP benefit my business?',
                  answer: 'DDMRP can help your business reduce inventory levels while improving service levels, shorten lead times, improve planning visibility, and create more stable production environments.',
                  color: 'orange'
                },
                {
                  question: 'Do you offer customized training programs?',
                  answer: 'Yes, we offer customized training programs tailored to your organization\'s specific needs and challenges. Contact us to discuss your requirements.',
                  color: 'red'
                },
                {
                  question: 'How long does implementation typically take?',
                  answer: 'Implementation timelines vary depending on the size and complexity of your organization. A typical implementation can range from 3-6 months, but we can provide a more accurate estimate after an initial consultation.',
                  color: 'green'
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div 
                      className={`h-3 w-3 rounded-full mr-3 ${
                        faq.color === 'green' ? 'bg-green-500' : 
                        faq.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    ></div>
                    <h3 className="text-xl font-semibold text-slate-800">{faq.question}</h3>
                  </div>
                  <p className="text-slate-600 pl-6">{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
} 
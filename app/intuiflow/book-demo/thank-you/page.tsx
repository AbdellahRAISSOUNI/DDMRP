"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageWrapper from '@/app/components/PageWrapper';

export default function ThankYouPage() {
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
        <div 
          ref={heroRef} 
          className="relative pt-40 pb-20 overflow-hidden"
        >
          {/* Background with overlay */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/images/demo-bg.jpg"
              alt="Thank You"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-blue-900/80"></div>
            
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
              className="absolute top-1/3 right-1/3 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl will-change-transform" 
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
                  href="/intuiflow" 
                  className="inline-flex items-center text-blue-300 hover:text-blue-200 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to IntuiFlow
                </Link>
              </motion.div>
              
              {/* Success icon with animation */}
              <motion.div 
                variants={fadeIn}
                className="inline-flex items-center justify-center h-24 w-24 bg-green-100 rounded-full mb-6 relative"
              >
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Thank You!
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
                className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
              >
                We've received your demo request and will contact you shortly to schedule your personalized IntuiFlow demonstration.
              </motion.p>

              <motion.div variants={fadeIn}>
                <Link 
                  href="/" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Return to Home
                </Link>
              </motion.div>
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

        {/* What happens next section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">What Happens Next?</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                {['bg-green-500', 'bg-orange-400', 'bg-blue-500'].map((color, index) => (
                  <div 
                    key={index}
                    className={`h-1 w-10 ${color} rounded-full`}
                  ></div>
                ))}
              </div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Here's what you can expect from our team
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div 
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Request Review</h3>
                <p className="text-slate-600">
                  Our team will review your request and reach out to you within 1-2 business days.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Demo Scheduling</h3>
                <p className="text-slate-600">
                  We'll schedule a convenient time for your personalized demo based on your preferences.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Calendar Invitation</h3>
                <p className="text-slate-600">
                  You'll receive a calendar invitation with all the details for your demo session.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Related Content */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">While You Wait</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Check out these resources to learn more about IntuiFlow and how it can benefit your organization
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-blue-600 relative">
                  <Image 
                    src="/images/supply-chain.jpg" 
                    alt="About IntuiFlow" 
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">About IntuiFlow</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 mb-4">Learn more about how IntuiFlow can transform your supply chain management process.</p>
                  <Link href="/intuiflow" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-green-600 relative">
                  <Image 
                    src="/images/demo-bg.jpg" 
                    alt="DDMRP Courses" 
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">DDMRP Formations</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 mb-4">Explore our comprehensive DDMRP courses designed for supply chain professionals.</p>
                  <Link href="/courses" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                    View Formations
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-orange-600 relative">
                  <Image 
                    src="/images/supply-chain.jpg" 
                    alt="Contact Us" 
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">Contact Us</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 mb-4">Have questions? Our team is ready to help you with any inquiries about IntuiFlow.</p>
                  <Link href="/contact" className="text-orange-600 hover:text-orange-800 font-medium inline-flex items-center">
                    Get in Touch
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-12 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
                <div className="md:max-w-2xl mb-8 md:mb-0">
                  <div className="flex items-center mb-6">
                    {['bg-green-300', 'bg-orange-300', 'bg-white'].map((color, index) => (
                      <div 
                        key={index}
                        className={`h-1.5 w-12 ${color} rounded-full mr-2`}
                      ></div>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to explore more?</h2>
                  <p className="text-blue-50 text-lg max-w-2xl">
                    Discover our courses and learn more about demand-driven material requirements planning.
                  </p>
                </div>
                <div>
                  <Link 
                    href="/courses"
                    className="inline-block bg-white hover:bg-blue-50 text-blue-600 font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    View Our Formations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </PageWrapper>
  );
}
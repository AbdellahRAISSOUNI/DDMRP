"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';

export default function IntuitiveFlowPage() {
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
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { 
      opacity: 1, 
      x: 0,
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
        {/* Hero Section */}
        <div 
          ref={heroRef} 
          className="relative min-h-[600px] md:min-h-[700px] pt-40 pb-20 flex items-center justify-center overflow-hidden"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/supply-chain.jpg"
              alt="IntuitiveFlow DDMRP"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-slate-900/80"></div>
            
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
                  href="/" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
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
                IntuitiveFlow
              </motion.h1>
              
              <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 mb-6">
                {['bg-green-500', 'bg-orange-400', 'bg-blue-500'].map((color, index) => (
                  <motion.div 
                    key={index}
                    initial={{ width: 0 }}
                    animate={{ width: '3rem' }}
                    transition={{ 
                      duration: 1, 
                      delay: 0.3 + (index * 0.2),
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className={`h-1.5 rounded-full ${color}`}
                  ></motion.div>
                ))}
              </motion.div>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
              >
                Revolutionize your supply chain management with our innovative approach to demand-driven material requirements planning
              </motion.p>

              <motion.div variants={fadeIn}>
                <Link 
                  href="/intuitive-flow/book-demo" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Book a Demo
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

        {/* Features Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Choose IntuitiveFlow?</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                {['bg-green-500', 'bg-orange-400', 'bg-blue-500'].map((color, index) => (
                  <div 
                    key={index}
                    className={`h-1 w-10 ${color} rounded-full`}
                  ></div>
                ))}
              </div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our innovative approach to demand-driven material requirements planning
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Streamlined Efficiency</h3>
                <p className="text-slate-600">
                  Optimize your supply chain with our advanced algorithms that reduce waste and improve flow, leading to significant cost savings and improved customer satisfaction.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Real-time Analytics</h3>
                <p className="text-slate-600">
                  Make data-driven decisions with our comprehensive analytics dashboard and reporting tools that provide insights into your entire supply chain ecosystem.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Time-saving Automation</h3>
                <p className="text-slate-600">
                  Automate routine tasks and focus on strategic decisions with our intelligent workflow system that adapts to your business processes.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-24 bg-slate-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How IntuitiveFlow Works</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                {['bg-green-500', 'bg-orange-400', 'bg-blue-500'].map((color, index) => (
                  <div 
                    key={index}
                    className={`h-1 w-10 ${color} rounded-full`}
                  ></div>
                ))}
              </div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our simple yet powerful approach to improving your supply chain
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Analyze",
                  description: "We analyze your current supply chain processes and identify areas for improvement.",
                  color: "green"
                },
                {
                  step: 2,
                  title: "Design",
                  description: "We design a customized solution tailored to your specific business needs.",
                  color: "orange"
                },
                {
                  step: 3,
                  title: "Implement",
                  description: "Our team works with you to implement the solution with minimal disruption.",
                  color: "blue"
                },
                {
                  step: 4,
                  title: "Optimize",
                  description: "We continuously monitor and optimize your system for maximum efficiency.",
                  color: "green"
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  className="bg-white rounded-xl shadow-md border border-slate-100 p-6 md:p-8 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-${item.color === "green" ? "green-500" : item.color === "orange" ? "orange-400" : "blue-500"}`}></div>
                  <div className={`absolute top-6 right-6 h-10 w-10 bg-${item.color === "green" ? "green-500" : item.color === "orange" ? "orange-400" : "blue-500"} rounded-full text-white flex items-center justify-center font-bold text-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeIn} className="text-center mt-12">
              <Link 
                href="/intuitive-flow/book-demo" 
                className="inline-block bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Book a Demo Today
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">What Our Clients Say</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                {['bg-green-500', 'bg-orange-400', 'bg-blue-500'].map((color, index) => (
                  <div 
                    key={index}
                    className={`h-1 w-10 ${color} rounded-full`}
                  ></div>
                ))}
              </div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Hear from businesses that have transformed with IntuitiveFlow
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <motion.div 
                variants={fadeInLeft}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 relative"
              >
                <div className="absolute -top-4 -left-4 text-6xl text-green-200 opacity-50 font-serif">"</div>
                <div className="flex items-center mb-6">
                  <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold mr-4 text-xl">
                    AB
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Alex Brown</h4>
                    <p className="text-sm text-slate-500">Supply Chain Director, TechCorp</p>
                  </div>
                </div>
                <p className="text-slate-600 italic text-lg">
                  "IntuitiveFlow has completely transformed our supply chain operations. We've reduced inventory costs by 23% while improving service levels."
                </p>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div 
                variants={fadeInRight}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 relative"
              >
                <div className="absolute -top-4 -left-4 text-6xl text-orange-200 opacity-50 font-serif">"</div>
                <div className="flex items-center mb-6">
                  <div className="h-14 w-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold mr-4 text-xl">
                    SJ
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Sarah Johnson</h4>
                    <p className="text-sm text-slate-500">Operations Manager, GlobalManufacturing</p>
                  </div>
                </div>
                <p className="text-slate-600 italic text-lg">
                  "The insights we've gained from IntuitiveFlow have been invaluable. Our team is now able to make proactive decisions rather than reactive ones."
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="py-16 md:py-24 bg-slate-50"
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
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your supply chain?</h2>
                  <p className="text-blue-50 text-lg max-w-2xl">
                    Book a personalized demo today and see how IntuitiveFlow can work for your business.
                  </p>
                </div>
                <div>
                  <Link 
                    href="/intuitive-flow/book-demo"
                    className="inline-block bg-white hover:bg-blue-50 text-blue-600 font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Schedule Your Demo
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
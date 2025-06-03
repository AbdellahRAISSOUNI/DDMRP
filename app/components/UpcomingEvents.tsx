"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import EventsList from './EventsList';
import { motion } from 'framer-motion';

export default function UpcomingEvents() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Animation variants for Framer Motion
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
    <section 
      id="upcoming-events" 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Background with subtle pattern and gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}></div>
        </div>
        
        {/* Abstract shapes with parallax effect */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * -0.03}px)` }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header with animated elements */}
        <motion.div 
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div className="md:max-w-2xl">
            <motion.span 
              variants={fadeIn}
              className="text-sm uppercase tracking-wider text-green-600 font-semibold"
            >
              Mark Your Calendar
            </motion.span>
            
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4"
            >
              Upcoming Events
            </motion.h2>
            
            <div className="flex items-center gap-2 mb-6">
              {['bg-green-500', 'bg-orange-400', 'bg-red-500'].map((color, index) => (
                <motion.div 
                  key={index}
                  initial={{ width: 0, opacity: 0 }}
                  animate={isVisible ? { width: index === 1 ? '4rem' : '2rem', opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-1.5 rounded-full ${color}`}
                ></motion.div>
              ))}
            </div>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg text-slate-600 max-w-2xl"
            >
              Join us at our upcoming workshops and training sessions to enhance your DDMRP knowledge and connect with industry experts.
            </motion.p>
          </div>
          
          <motion.div
            variants={fadeIn}
            className="mt-8 md:mt-0"
          >
            <Link 
              href="/events" 
              className="inline-flex items-center gap-2 bg-transparent hover:bg-green-50 text-green-600 font-medium py-2 px-4 border border-green-600 rounded-lg transition-colors duration-300"
            >
              <span>View All Events</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Events list with enhanced styling */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <EventsList />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20"
        >
          <div className="relative overflow-hidden rounded-xl border border-green-100 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent"></div>
            <div className="absolute right-0 bottom-0 -mb-12 -mr-12 w-64 h-64 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">Personalized Training</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Need customized DDMRP training?</h3>
                <p className="text-slate-600">Contact us to schedule a personalized consultation or to discuss private training options tailored specifically for your organization's needs.</p>
              </div>
              
              <div className="flex-shrink-0">
                <Link
                  href="/contact"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
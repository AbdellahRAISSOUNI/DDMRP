"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function IntuitiveFlowDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeBar, setActiveBar] = useState(3);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [flowProgress, setFlowProgress] = useState(0);
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

  // Dashboard animation sequence
  useEffect(() => {
    if (isVisible) {
      // Start animations after dashboard appears
      const timer1 = setTimeout(() => {
        setAnimationComplete(true);
      }, 1500);
      
      // Animate flow progress
      const timer2 = setTimeout(() => {
        setFlowProgress(33);
      }, 2000);
      
      const timer3 = setTimeout(() => {
        setFlowProgress(66);
      }, 3000);
      
      const timer4 = setTimeout(() => {
        setFlowProgress(100);
      }, 4000);
      
      // Animate inventory bars
      const barInterval = setInterval(() => {
        setActiveBar((prev) => (prev === 5 ? 1 : prev + 1));
      }, 2000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearInterval(barInterval);
      };
    }
  }, [isVisible]);

  return (
    <section 
      id="intuitive-flow" 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Background with subtle pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}></div>
        </div>
        
        {/* Abstract shapes with parallax effect */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 -left-24 w-64 h-64 bg-green-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * -0.03}px)` }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-orange-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="overflow-hidden mb-2">
              <span 
                className="text-sm uppercase tracking-wider text-blue-600 font-semibold"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                }}
              >
                Software Solution
              </span>
            </div>
            
            <div className="overflow-hidden">
              <h2 
                className="text-3xl md:text-4xl font-bold text-slate-800"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                  transitionDelay: '150ms'
                }}
              >
                Discover IntuitiveFlow
              </h2>
            </div>
            
            <div className="flex items-center gap-2 overflow-hidden">
              <div 
                className="h-1 w-0 bg-blue-600 rounded-full transition-all duration-1000 ease-out-expo"
                style={{ 
                  width: isVisible ? '2rem' : '0',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '300ms'
                }}
              ></div>
              <div 
                className="h-1 w-0 bg-orange-500 rounded-full transition-all duration-1000 ease-out-expo"
                style={{ 
                  width: isVisible ? '4rem' : '0',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '450ms'
                }}
              ></div>
              <div 
                className="h-1 w-0 bg-green-600 rounded-full transition-all duration-1000 ease-out-expo"
                style={{ 
                  width: isVisible ? '2rem' : '0',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '600ms'
                }}
              ></div>
            </div>
            
            <div 
              className="text-lg text-slate-600"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                transitionDelay: '300ms'
              }}
            >
              Experience our revolutionary tool that simplifies demand-driven planning and execution. IntuitiveFlow provides intuitive visualization and management of your supply chain.
            </div>
            
            <div className="space-y-4">
              {[
                'Real-time inventory visibility',
                'Demand-driven replenishment planning',
                'Buffer management optimization',
                'Supply chain performance analytics'
              ].map((feature, index) => (
                <div 
                  key={index} 
                  style={{ 
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                    transitionDelay: `${450 + index * 150}ms`
                  }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                transitionDelay: '1000ms'
              }}
            >
              <Link 
                href="/intuiflow" 
                className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              >
                Learn More About IntuiFlow
              </Link>
              <Link 
                href="/contact" 
                className="inline-block bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Request Demo
              </Link>
            </div>
          </div>
          
          <div 
            style={{ 
              transform: isVisible ? 'translateY(0) rotate(0)' : 'translateY(40px) rotate(2deg)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease-out',
              transitionDelay: '500ms'
            }}
            className="perspective-1000"
          >
            <div className="relative transform-style-3d">
              {/* Dashboard mockup */}
              <div className="relative z-10 bg-white rounded-2xl p-2 border border-slate-200 shadow-xl transform hover:rotate-y-5 transition-transform duration-700">
                {/* Modern Dashboard UI based on screenshot */}
                <div className="bg-[#1e2738] rounded-xl overflow-hidden">
                  {/* Dashboard header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-slate-300">IntuitiveFlow Dashboard</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="p-4 grid grid-cols-2 gap-4">
                    {/* Inventory Status Panel */}
                    <div className="bg-[#2a3649] rounded-lg p-4 shadow-lg transform transition-all duration-500" 
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: `translateY(${isVisible ? '0' : '20px'})`,
                        transitionDelay: '600ms'
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-slate-200 font-medium">Inventory Status</div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-end justify-between h-32 pt-4">
                        {[
                          { id: 1, height: '30%', color: 'bg-green-500' },
                          { id: 2, height: '50%', color: 'bg-green-500' },
                          { id: 3, height: '70%', color: 'bg-orange-500' },
                          { id: 4, height: '100%', color: 'bg-red-500' },
                          { id: 5, height: '60%', color: 'bg-green-500' }
                        ].map((bar) => (
                          <div 
                            key={bar.id} 
                            className="w-1/6 rounded-t-md transition-all duration-700 ease-in-out"
                            style={{
                              height: animationComplete ? bar.height : '0%',
                              backgroundColor: bar.color === 'bg-green-500' ? '#10b981' : 
                                              bar.color === 'bg-orange-500' ? '#f97316' : 
                                              '#ef4444',
                              transform: activeBar === bar.id ? 'translateY(-8px)' : 'translateY(0)',
                              boxShadow: activeBar === bar.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.2)' : 'none',
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Buffer Zones Panel */}
                    <div className="bg-[#2a3649] rounded-lg p-4 shadow-lg transform transition-all duration-500" 
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: `translateY(${isVisible ? '0' : '20px'})`,
                        transitionDelay: '800ms'
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-slate-200 font-medium">Buffer Zones</div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-32 flex flex-col overflow-hidden rounded-md">
                        <div 
                          className="h-1/3 bg-red-500 rounded-t flex items-center justify-center text-sm text-white font-medium transition-all duration-700"
                          style={{
                            transform: animationComplete ? 'translateX(0)' : 'translateX(-100%)',
                            opacity: animationComplete ? 1 : 0
                          }}
                        >
                          Red
                        </div>
                        <div 
                          className="h-1/3 bg-orange-500 flex items-center justify-center text-sm text-white font-medium transition-all duration-700"
                          style={{
                            transform: animationComplete ? 'translateX(0)' : 'translateX(100%)',
                            opacity: animationComplete ? 1 : 0,
                            transitionDelay: '200ms'
                          }}
                        >
                          Yellow
                        </div>
                        <div 
                          className="h-1/3 bg-green-500 rounded-b flex items-center justify-center text-sm text-white font-medium transition-all duration-700"
                          style={{
                            transform: animationComplete ? 'translateX(0)' : 'translateX(-100%)',
                            opacity: animationComplete ? 1 : 0,
                            transitionDelay: '400ms'
                          }}
                        >
                          Green
                        </div>
                      </div>
                    </div>
                    
                    {/* Supply Chain Flow Panel */}
                    <div 
                      className="bg-[#2a3649] rounded-lg p-4 shadow-lg col-span-2 transform transition-all duration-500" 
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: `translateY(${isVisible ? '0' : '20px'})`,
                        transitionDelay: '1000ms'
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-slate-200 font-medium">Supply Chain Flow</div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 mx-4 relative">
                          <div className="h-2 bg-blue-500 rounded relative">
                            {/* Progress bar that fills based on flowProgress state */}
                            <div 
                              className="absolute inset-0 bg-blue-300 rounded transition-all duration-1000 ease-in-out"
                              style={{ width: `${flowProgress}%` }}
                            ></div>
                            
                            {/* First marker */}
                            <div 
                              className={`absolute -top-1.5 w-5 h-5 bg-white rounded-full border-2 transition-all duration-500 ${animationComplete ? 'border-orange-500' : 'border-blue-500'}`}
                              style={{ 
                                left: '33%', 
                                transform: `translateX(-50%) scale(${flowProgress >= 33 ? 1.2 : 1})`,
                                boxShadow: flowProgress >= 33 ? '0 0 0 2px rgba(249, 115, 22, 0.2)' : 'none'
                              }}
                            ></div>
                            
                            {/* Second marker */}
                            <div 
                              className={`absolute -top-1.5 w-5 h-5 bg-white rounded-full border-2 transition-all duration-500 ${animationComplete && flowProgress >= 66 ? 'border-red-500' : 'border-blue-500'}`}
                              style={{ 
                                left: '66%', 
                                transform: `translateX(-50%) scale(${flowProgress >= 66 ? 1.2 : 1})`,
                                boxShadow: flowProgress >= 66 ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-green-500 rounded-full opacity-20 blur-xl"></div>
              
              {/* Floating elements */}
              <div 
                className="absolute -top-4 -left-4 bg-white p-3 rounded-lg shadow-lg border border-slate-100 transition-all duration-500"
                style={{ 
                  transform: isVisible ? 'rotate(6deg) translateY(0)' : 'rotate(6deg) translateY(20px)',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '700ms'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-slate-800">
                    Real-time Analytics
                  </div>
                </div>
              </div>
              
              <div 
                className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg border border-slate-100 transition-all duration-500"
                style={{ 
                  transform: isVisible ? 'rotate(-3deg) translateY(0)' : 'rotate(-3deg) translateY(20px)',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '900ms'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-slate-800">
                    Secure & Reliable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div 
          className="mt-20"
          style={{ 
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            opacity: isVisible ? 1 : 0,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
            transitionDelay: '800ms'
          }}
        >
          <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent"></div>
            <div className="absolute right-0 bottom-0 -mb-12 -mr-12 w-64 h-64 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">Streamline Your Operations</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to optimize your supply chain?</h3>
                <p className="text-slate-600">Schedule a personalized demo of IntuitiveFlow and discover how our software can transform your demand-driven planning and execution.</p>
              </div>
              
              <div className="flex-shrink-0">
                <Link
                  href="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Request Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
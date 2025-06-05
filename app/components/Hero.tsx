"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get header height for proper spacing
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }

    const handleResize = () => {
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Trigger animations when component is in view
  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative flex items-center overflow-hidden"
      style={{ 
        paddingTop: `${headerHeight + 16}px`,
        minHeight: `calc(100vh)`,
        paddingBottom: '2rem'
      }}
    >
      {/* Parallax background layers */}
      <div className="absolute inset-0 bg-slate-50">
        {/* Background image with parallax effect */}
        <div 
          className="absolute inset-0 opacity-10 will-change-transform"
          style={{ 
            transform: `translateY(${scrollY * 0.15}px)`,
            transition: 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)'
          }}
        >
          <Image 
            src="/images/hero-bg.jpg"
            alt="Background Pattern"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        {/* Abstract shapes with parallax effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-24 -left-24 w-96 h-96 bg-green-500 rounded-full opacity-5 blur-3xl will-change-transform" 
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div 
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500 rounded-full opacity-5 blur-3xl will-change-transform" 
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-red-500 rounded-full opacity-5 blur-3xl will-change-transform" 
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          ></div>
        </div>
        
        {/* Grid pattern overlay with parallax */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-10 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left content with text */}
          <div 
            className={`transform transition-all duration-1000 ease-out mt-4 sm:mt-0 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
          >
            {/* Animated color bars */}
            <div className="flex items-center gap-2 mb-4 md:mb-6 overflow-hidden">
              {['bg-green-600', 'bg-orange-500', 'bg-red-600'].map((color, index) => (
                <div 
                  key={index}
                  className={`h-1.5 w-0 ${color} rounded-full transition-all duration-1000 ease-out-expo`}
                  style={{ 
                    width: isVisible ? '3rem' : '0',
                    transitionDelay: `${index * 150}ms`,
                    opacity: isVisible ? 1 : 0
                  }}
                ></div>
              ))}
            </div>
            
            {/* Animated heading with staggered reveal */}
            <div className="overflow-hidden mb-4 md:mb-6">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                  transitionDelay: '300ms'
                }}
              >
                DDMRP Experts, <span className="text-gradient bg-gradient-to-r from-green-600 via-orange-500 to-red-600 bg-clip-text text-transparent">Supply Chain Excellence</span>
              </h1>
            </div>
            
            {/* Animated paragraph with reveal */}
            <div className="overflow-hidden mb-6 md:mb-8">
              <p 
                className="text-lg md:text-xl text-slate-600 max-w-lg"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                  transitionDelay: '500ms'
                }}
              >
                DDMRP Consulting is your gateway to supply chain excellence, leveraging expertise in Demand Driven Material Requirements Planning (DDMRP) to transform your operations.
              </p>
            </div>
            
            {/* Animated buttons with staggered reveal */}
            <div 
              className="flex flex-col sm:flex-row gap-4"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                transitionDelay: '700ms'
              }}
            >
              <Link 
                href="/contact" 
                className="inline-block bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-3 px-8 rounded-lg transition-all duration-500 text-center shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
              <Link 
                href="/courses" 
                className="inline-block bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold py-3 px-8 rounded-lg transition-colors duration-300 text-center shadow-sm hover:shadow-md"
              >
                Explore Courses
              </Link>
            </div>
            
            {/* Animated stats with staggered reveal */}
            <div 
              className="mt-8 md:mt-12 grid grid-cols-3 gap-2 md:gap-4"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                transitionDelay: '900ms'
              }}
            >
              {[
                { value: '97%', label: 'Success Rate' },
                { value: '30%', label: 'Cost Reduction' },
                { value: '50+', label: 'Global Clients' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center"
                  style={{ transitionDelay: `${900 + index * 100}ms` }}
                >
                  <div className="text-xl md:text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-xs md:text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right content with image */}
          <div 
            className={`relative transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div 
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ 
                transform: isVisible ? 'translateY(0) rotate(0)' : 'translateY(40px) rotate(2deg)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease-out',
                transitionDelay: '500ms'
              }}
            >
              {/* Hero image with parallax effect */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <div 
                  className="absolute inset-0 scale-110 will-change-transform"
                  style={{ 
                    transform: `translateY(${scrollY * -0.1}px)`,
                    transition: 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)'
                  }}
                >
                  <Image 
                    src="/images/hero/supply-chain-dashboard.jpg" 
                    alt="Supply Chain Dashboard" 
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Floating card with stats - Changed text color for better visibility */}
              <div 
                className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-lg"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                  transitionDelay: '800ms'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1 md:mr-2"></div>
                    <span className="text-xs md:text-sm font-medium text-slate-800">Optimized Inventory</span>
                  </div>
                  <div className="text-xs md:text-sm font-bold text-green-600">+42%</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div 
                className="absolute -top-6 -right-6 w-16 md:w-24 h-16 md:h-24 bg-green-500 rounded-full opacity-20 blur-xl"
                style={{ 
                  transform: `translateY(${scrollY * 0.05}px)`,
                }}
              ></div>
              <div 
                className="absolute -bottom-8 -left-8 w-24 md:w-32 h-24 md:h-32 bg-orange-500 rounded-full opacity-20 blur-xl"
                style={{ 
                  transform: `translateY(${scrollY * -0.05}px)`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with animation - Hide on small screens */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-slate-500 hidden md:flex"
        style={{ 
          opacity: 1 - (scrollY / 300),
          transform: `translate(-50%, ${scrollY * 0.2}px)`,
        }}
      >
        <span className="text-sm mb-2 opacity-70">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
} 
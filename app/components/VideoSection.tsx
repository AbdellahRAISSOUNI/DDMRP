"use client";

import { useEffect, useState, useRef } from 'react';

export default function VideoSection() {
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

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(243,244,246,1) 100%)'
      }}
    >
      {/* Background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
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
        
        {/* Grid pattern overlay with parallax */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-10 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column with text content */}
          <div 
            className="space-y-6"
            style={{ 
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
              transitionDelay: '300ms'
            }}
          >
            <div className="overflow-hidden mb-2">
              <h2 
                className="text-3xl md:text-4xl font-bold text-slate-800"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                }}
              >
                DDMRP
              </h2>
            </div>
            
            <div className="flex items-center gap-2 mb-6 overflow-hidden">
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
            
            <div 
              className="text-lg text-slate-600"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                transitionDelay: '500ms'
              }}
            >
              <p className="mb-4">
                Welcome to DDMRP Consulting – Your Gateway to Supply Chain Excellence. We help organizations optimize their operations and achieve sustainable success through Demand Driven Material Requirements Planning (DDMRP).
              </p>
            </div>
            
            <div 
              className="pt-4"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                transitionDelay: '700ms'
              }}
            >
              <a 
                href="#featured-courses" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Learn More
              </a>
            </div>
          </div>
          
          {/* Right column with video */}
          <div 
            className="relative"
            style={{ 
              transform: isVisible ? 'translateY(0) rotate(0)' : 'translateY(40px) rotate(1deg)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease-out',
              transitionDelay: '400ms'
            }}
          >
            {/* Video container with design elements */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-200">
              {/* Vimeo embed */}
              <div className="aspect-video w-full relative">
                <iframe 
                  src="https://player.vimeo.com/video/208396607?h=6d46cad187&title=0&byline=0&portrait=0" 
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowFullScreen
                  title="DDMRP Introduction"
                ></iframe>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                </div>
              </div>
              
              {/* Video badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                  <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-800">DDMRP Introduction</span>
                </div>
              </div>
            </div>
            
            {/* Decorative glows */}
            <div 
              className="absolute -top-6 -right-6 w-24 h-24 bg-green-500 rounded-full opacity-20 blur-xl"
              style={{ 
                transform: `translateY(${scrollY * 0.05}px)`,
              }}
            ></div>
            <div 
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500 rounded-full opacity-20 blur-xl"
              style={{ 
                transform: `translateY(${scrollY * -0.05}px)`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
} 
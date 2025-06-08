"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CallToAction() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-slate-900 w-full"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.99), rgba(15, 23, 42, 0.94))'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full opacity-10 blur-3xl will-change-transform" 
          style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * -0.05}px)` }}
        ></div>
        <div 
          className="absolute -bottom-24 right-1/4 w-80 h-80 bg-orange-500 rounded-full opacity-10 blur-3xl will-change-transform" 
          style={{ transform: `translate(${scrollY * -0.05}px, ${scrollY * 0.02}px)` }}
        ></div>
        <div 
          className="absolute top-1/3 right-0 w-64 h-64 bg-red-500 rounded-full opacity-10 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * 0.03}px)` }}
        ></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        
        {/* Animated dots pattern */}
        <div 
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        >
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                opacity: Math.random() * 0.3 + 0.1,
                animation: `pulse ${Math.random() * 4 + 3}s infinite alternate`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div>
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
              }}
            >
              Ready to Transform Your 
              <span className="relative inline-block">
                <span className="relative z-10 whitespace-nowrap"> Supply Chain?</span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-green-500 to-green-400 opacity-50 rounded"></span>
              </span>
            </h2>
            
            <p 
              className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                transitionDelay: '150ms'
              }}
            >
              Join thousands of professionals who have already mastered DDMRP methodology and revolutionized their inventory management. Whether you're looking to enhance your skills or implement DDMRP in your organization, we're here to help.
            </p>
            
            <div 
              className="flex flex-wrap gap-4 sm:gap-6"
              style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: isVisible ? 1 : 0,
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                transitionDelay: '300ms'
              }}
            >
              <Link 
                href="/courses" 
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-500 to-green-600 px-8 py-4 text-white shadow-lg transition-all duration-300"
                onMouseEnter={() => setHoveredButton('courses')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span className="relative z-10 font-medium tracking-wide flex items-center">
                  Explore Formations
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ml-2 transition-transform duration-300 ${hoveredButton === 'courses' ? 'translate-x-1' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="absolute inset-0 z-0 scale-x-[1.15] scale-y-[1.35] bg-gradient-to-br from-green-400 to-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-lg"></span>
              </Link>
              
              <Link 
                href="/contact" 
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-white shadow-lg transition-all duration-300"
                onMouseEnter={() => setHoveredButton('contact')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span className="relative z-10 font-medium tracking-wide flex items-center">
                  Contact Us
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ml-2 transition-transform duration-300 ${hoveredButton === 'contact' ? 'translate-x-1' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="absolute inset-0 z-0 scale-x-[1.15] scale-y-[1.35] bg-gradient-to-br from-white/20 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-lg"></span>
              </Link>
            </div>
          </div>
          
          {/* Right column - Animated graphic */}
          <div 
            className="relative"
            style={{ 
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease-out',
              transitionDelay: '450ms'
            }}
          >
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-bl-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-tr-2xl opacity-20"></div>
              
              {/* Stats and metrics */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">35%</div>
                  <div className="text-slate-300 text-sm">Average Inventory Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">98%</div>
                  <div className="text-slate-300 text-sm">Service Level Achievement</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">5000+</div>
                  <div className="text-slate-300 text-sm">Professionals Trained</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">40+</div>
                  <div className="text-slate-300 text-sm">Countries Worldwide</div>
                </div>
              </div>
              
              {/* Testimonial highlight */}
              <div className="relative">
                <svg className="h-8 w-8 text-green-500 mb-2 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-slate-300 italic mb-4">
                  "DDMRP transformed our supply chain operations. We reduced inventory by 35% while improving service levels."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">SJ</div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Sarah Johnson</p>
                    <p className="text-slate-400 text-sm">Supply Chain Director</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative floating elements - Constrain these to prevent overflow */}
            <div 
              className="absolute -top-6 -right-6 w-12 h-12 bg-orange-500 rounded-lg shadow-lg rotate-12 will-change-transform"
              style={{ 
                transform: `rotate(${12 + scrollY * 0.02}deg) translateY(${scrollY * -0.05}px)`,
                opacity: 0.7,
                maxWidth: '100%' 
              }}
            ></div>
            <div 
              className="absolute -bottom-8 left-1/3 w-16 h-16 bg-green-500 rounded-full shadow-lg will-change-transform"
              style={{ 
                transform: `translateY(${scrollY * -0.08}px)`,
                opacity: 0.6,
                maxWidth: '100%'
              }}
            ></div>
            <div 
              className="absolute top-1/2 -left-8 w-10 h-10 bg-red-500 rounded-md shadow-lg rotate-45 will-change-transform"
              style={{ 
                transform: `rotate(${45 + scrollY * 0.03}deg) translateX(${scrollY * -0.05}px)`,
                opacity: 0.6,
                maxWidth: '100%'
              }}
            ></div>
          </div>
        </div>
        
        {/* Back to top link */}
        <div className="mt-16 text-center">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center text-slate-300 hover:text-white transition-colors duration-300 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2 transform group-hover:-translate-y-1 transition-transform duration-300" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to top
          </button>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.1;
            transform: scale(1);
          }
          100% {
            opacity: 0.3;
            transform: scale(1.5);
          }
        }
      `}</style>
    </section>
  );
} 
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ModernHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) for the first 100px of scrolling
      const progress = Math.min(window.scrollY / 100, 1);
      setScrollProgress(progress);
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Calculate dynamic styles based on scroll progress
  const headerBgOpacity = Math.min(0.95, 0.85 + scrollProgress * 0.1);
  const headerBlur = `blur(${scrollProgress * 8}px)`;
  const headerPadding = 16 - scrollProgress * 6; // 16px to 10px
  const logoSize = Math.max(44, 56 - (scrollProgress * 12)); // Dynamically adjust logo size

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${headerBgOpacity})`,
        backdropFilter: isScrolled ? headerBlur : 'none',
        padding: `${headerPadding}px 0`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="group relative flex items-center"
            >
              {/* Logo container with hover effect */}
              <div 
                className="relative overflow-hidden transition-all duration-300 hover:scale-105"
                style={{ 
                  width: logoSize,
                  height: logoSize
                }}
              >
                {/* Hover gradient effect - subtle glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-400/20 via-yellow-400/20 to-red-400/20 rounded-md transition-all duration-300 group-hover:scale-110 group-hover:blur-[2px]"></div>
                
                {/* DDMRP Logo */}
                <Image 
                  src="/@ddmrp.png" 
                  alt="DDMRP Logo" 
                  width={logoSize}
                  height={logoSize}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              
              {/* Text logo */}
              <div className="flex flex-col ml-3">
                <span className="font-bold text-lg text-slate-800 leading-tight tracking-tight group-hover:text-green-600 transition-colors">
                  DDMRP
                </span>
                <span className="text-xs text-slate-600 font-medium group-hover:text-slate-800 transition-colors">
                  Demand Driven MRP
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center space-x-1">
              <li>
                <Link 
                  href="/" 
                  className="px-4 py-2 rounded-md font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/courses" 
                  className="px-4 py-2 rounded-md font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition-colors text-sm"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link 
                  href="/events" 
                  className="px-4 py-2 rounded-md font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors text-sm"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/intuitive-flow" 
                  className="px-4 py-2 rounded-md font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                >
                  IntuitiveFlow
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="px-4 py-2 rounded-md font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li className="ml-2">
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2 rounded-md transition-all text-sm font-medium shadow-sm hover:shadow flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Admin Login
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md focus:outline-none text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg mt-2 overflow-hidden transition-all duration-300 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link 
              href="/" 
              className="block px-4 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-green-50 hover:text-green-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/courses" 
              className="block px-4 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              href="/events" 
              className="block px-4 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/intuitive-flow" 
              className="block px-4 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              IntuitiveFlow
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-green-50 hover:text-green-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 pb-1">
              <Link 
                href="/login" 
                className="block w-full text-center px-4 py-2 rounded-md text-base font-medium bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 
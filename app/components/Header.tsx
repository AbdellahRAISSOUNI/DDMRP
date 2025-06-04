"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Set active path based on current URL
    setActivePath(window.location.pathname);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-md py-2' : 'py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center group relative"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              {/* Logo with hover effect */}
              <div 
                className="relative flex items-center transition-all duration-300 rounded-lg overflow-hidden"
                style={{
                  background: isLogoHovered 
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(249, 115, 22, 0.1), rgba(239, 68, 68, 0.1))' 
                    : 'transparent',
                  padding: isLogoHovered ? '0.5rem 1rem' : '0.5rem 0.5rem',
                }}
              >
                <div className="relative h-[40px] w-[40px] overflow-hidden flex-shrink-0">
                  <Image 
                    src="/cropped-Design-sans-titre-23.png" 
                    alt="DDMRP Logo" 
                    width={40} 
                    height={40}
                    className="transition-all duration-300 object-contain"
                    priority
                  />
                </div>
                <div className="ml-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-black text-lg leading-tight transition-all">
                      <span className="text-green-600">D</span>
                      <span className="text-green-600">D</span>
                      <span className="text-orange-500">M</span>
                      <span className="text-red-600">R</span>
                      <span className="text-red-600">P</span>
                    </span>
                  </div>
                </div>
                
                {/* Animated gradient border on hover */}
                <div 
                  className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                    isLogoHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(249, 115, 22, 0.3), rgba(239, 68, 68, 0.3))',
                    filter: 'blur(8px)',
                    zIndex: -1
                  }}
                ></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link 
                  href="/" 
                  className={`font-medium transition-colors ${
                    activePath === '/' ? 'text-green-600' : 'text-slate-800 hover:text-green-600'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={`font-medium transition-colors ${
                    activePath === '/about' ? 'text-green-600' : 'text-slate-800 hover:text-green-600'
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/courses" 
                  className={`font-medium transition-colors ${
                    activePath.startsWith('/courses') ? 'text-orange-500' : 'text-slate-800 hover:text-orange-500'
                  }`}
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link 
                  href="/events" 
                  className={`font-medium transition-colors ${
                    activePath.startsWith('/events') ? 'text-red-600' : 'text-slate-800 hover:text-red-600'
                  }`}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/intuiflow" 
                  className={`font-medium transition-colors ${
                    activePath.startsWith('/intuiflow') ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
                  }`}
                >
                  IntuiFlow
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md focus:outline-none text-slate-800"
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
        <div className="md:hidden bg-white shadow-lg mt-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activePath === '/' 
                  ? 'bg-green-50 text-green-600' 
                  : 'text-slate-800 hover:bg-green-50 hover:text-green-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activePath === '/about' 
                  ? 'bg-green-50 text-green-600' 
                  : 'text-slate-800 hover:bg-green-50 hover:text-green-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/courses" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activePath.startsWith('/courses')
                  ? 'bg-orange-50 text-orange-500' 
                  : 'text-slate-800 hover:bg-orange-50 hover:text-orange-500'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              href="/events" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activePath.startsWith('/events')
                  ? 'bg-red-50 text-red-600' 
                  : 'text-slate-800 hover:bg-red-50 hover:text-red-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/intuiflow" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activePath.startsWith('/intuiflow')
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-800 hover:bg-blue-50 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              IntuiFlow
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
} 
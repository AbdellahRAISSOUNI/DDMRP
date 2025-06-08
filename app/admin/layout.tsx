"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check for mobile viewport on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Check if the user is authenticated
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 w-10 bg-green-500 rounded-full animate-pulse"></div>
            <div className="h-1 w-6 bg-orange-400 rounded-full animate-pulse delay-75"></div>
            <div className="h-1 w-10 bg-red-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname?.startsWith('/admin/courses')) return 'Formation Management';
    if (pathname?.startsWith('/admin/archived')) return 'Archived Formations';
    if (pathname?.startsWith('/admin/inquiries')) return 'Course Inquiries';
    if (pathname?.startsWith('/admin/demo-bookings')) return 'Demo Bookings';
    if (pathname?.startsWith('/admin/events')) return 'Events Management';
    if (pathname?.startsWith('/admin/statistics')) return 'Statistics';
    return 'Admin Panel';
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-500 rounded-full blur-3xl"></div>
      </div>
      
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-900/80 z-40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></motion.div>
      )}
      
      {/* Sidebar - Only visible on desktop */}
      <motion.aside 
        className={`fixed lg:sticky top-0 left-0 z-30 h-screen bg-white shadow-lg flex flex-col ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } hidden lg:flex`}
      >
        <div className={`p-4 border-b border-slate-100 flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
          <Link href="/admin" className="flex items-center">
            <div className="relative h-10 w-10 overflow-hidden">
              <Image 
                src="/cropped-Design-sans-titre-23.png" 
                alt="DDMRP Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 via-orange-500 to-red-500 bg-clip-text text-transparent">DDMRP</h1>
                <div className="flex items-center gap-1.5">
                  <div className="h-0.5 w-5 bg-green-500 rounded-full"></div>
                  <div className="h-0.5 w-3 bg-orange-400 rounded-full"></div>
                  <div className="h-0.5 w-5 bg-red-500 rounded-full"></div>
                </div>
              </div>
            )}
          </Link>
          
          {/* Desktop Collapse Button */}
          {!sidebarCollapsed && (
            <button 
              onClick={toggleSidebar} 
              className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Desktop Expand Button when collapsed */}
          {sidebarCollapsed && (
            <button 
              onClick={toggleSidebar} 
              className="absolute -right-3 top-12 h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Navigation Menu - with flex-grow to push logout to bottom */}
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent" style={{ scrollbarWidth: 'thin' }}>
          <nav className={`px-3 py-5 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {/* Main Section */}
            {!sidebarCollapsed && (
              <div className="mb-3 px-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Main</span>
              </div>
            )}
            <ul className="space-y-1.5">
              <motion.li
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/admin"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-lg ${
                    isActive('/admin') && pathname === '/admin'
                      ? 'bg-green-50 text-green-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } transition-all duration-150`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">Dashboard</span>}
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/admin/courses"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-lg ${
                    isActive('/admin/courses')
                      ? 'bg-green-50 text-green-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } transition-all duration-150`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">Formations</span>}
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/admin/archived"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-lg ${
                    isActive('/admin/archived')
                      ? 'bg-green-50 text-green-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } transition-all duration-150`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">Archived</span>}
                </Link>
              </motion.li>
            </ul>

            {/* Communications Section */}
            {!sidebarCollapsed && (
              <div className="mt-6 mb-3 px-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Communications</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="my-4 border-t border-slate-100"></div>
            )}
            <ul className="space-y-1.5">
              <motion.li
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/admin/inquiries"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-lg ${
                    isActive('/admin/inquiries')
                      ? 'bg-orange-50 text-orange-500 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } transition-all duration-150`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">Inquiries</span>}
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/admin/demo-bookings"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-lg ${
                    isActive('/admin/demo-bookings')
                      ? 'bg-purple-50 text-purple-500 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } transition-all duration-150`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">Demo Bookings</span>}
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/admin/events"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-lg ${
                    isActive('/admin/events')
                      ? 'bg-red-50 text-red-500 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } transition-all duration-150`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">Events</span>}
                </Link>
              </motion.li>
            </ul>

            {/* Analytics Section */}
            {!sidebarCollapsed && (
              <div className="mt-6 mb-3 px-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Analytics</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="my-4 border-t border-slate-100"></div>
            )}
            <ul className="space-y-1.5">
              <motion.li
                whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/admin/statistics"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-lg ${
                    isActive('/admin/statistics')
                      ? 'bg-blue-50 text-blue-500 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } transition-all duration-150`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">Statistics</span>}
                </Link>
              </motion.li>
            </ul>
          </nav>
        </div>
        
        {/* Logout button at bottom */}
        <div className={`p-3 border-t border-slate-100 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <motion.button 
            onClick={handleSignOut}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            whileHover={{ x: sidebarCollapsed ? 0 : 4, backgroundColor: "rgba(254, 226, 226, 0.5)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>
      
      {/* Mobile Menu - Slide up panel */}
      {isMobile && (
        <motion.div 
          className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
          initial={{ y: "100%" }}
          animate={{ y: mobileMenuOpen ? 0 : "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <div className="bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex items-center">
                <div className="relative h-10 w-10 overflow-hidden">
                  <Image 
                    src="/cropped-Design-sans-titre-23.png" 
                    alt="DDMRP Logo" 
                    width={40} 
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 via-orange-500 to-red-500 bg-clip-text text-transparent">DDMRP</h1>
                  <div className="flex items-center gap-1.5">
                    <div className="h-0.5 w-5 bg-green-500 rounded-full"></div>
                    <div className="h-0.5 w-3 bg-orange-400 rounded-full"></div>
                    <div className="h-0.5 w-5 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {session?.user && (
                <div className="flex items-center bg-slate-50 p-3 rounded-lg mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-medium shadow-sm">
                    {session.user.name ? session.user.name[0].toUpperCase() : 'A'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">{session.user.name || session.user.email}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Main</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href="/admin" 
                    className={`flex flex-col items-center p-4 rounded-lg ${
                      isActive('/admin') && pathname === '/admin'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    } transition-all border border-slate-100 shadow-sm`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-sm">Dashboard</span>
                  </Link>
                  
                  <Link 
                    href="/admin/courses" 
                    className={`flex flex-col items-center p-4 rounded-lg ${
                      isActive('/admin/courses')
                        ? 'bg-green-50 text-green-600'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    } transition-all border border-slate-100 shadow-sm`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-sm">Formations</span>
                  </Link>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Communications</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Link 
                    href="/admin/inquiries" 
                    className={`flex flex-col items-center p-3 rounded-lg ${
                      isActive('/admin/inquiries')
                        ? 'bg-orange-50 text-orange-500'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    } transition-all border border-slate-100 shadow-sm`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="text-xs">Inquiries</span>
                  </Link>
                  
                  <Link 
                    href="/admin/demo-bookings" 
                    className={`flex flex-col items-center p-3 rounded-lg ${
                      isActive('/admin/demo-bookings')
                        ? 'bg-purple-50 text-purple-500'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    } transition-all border border-slate-100 shadow-sm`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Demos</span>
                  </Link>
                  
                  <Link 
                    href="/admin/events" 
                    className={`flex flex-col items-center p-3 rounded-lg ${
                      isActive('/admin/events')
                        ? 'bg-red-50 text-red-500'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    } transition-all border border-slate-100 shadow-sm`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Events</span>
                  </Link>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100 flex items-center justify-around py-2 px-4 lg:hidden">
          <Link 
            href="/admin" 
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              isActive('/admin') && pathname === '/admin' ? 'text-green-600' : 'text-slate-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            href="/admin/courses" 
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              isActive('/admin/courses') ? 'text-green-600' : 'text-slate-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
                                <span className="text-xs mt-1">Formations</span>
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 -mt-5 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white h-14 w-14 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs mt-0.5">Menu</span>
          </button>
          
          <Link 
            href="/admin/inquiries" 
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              isActive('/admin/inquiries') ? 'text-orange-500' : 'text-slate-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs mt-1">Inquiries</span>
          </Link>
          
          <Link 
            href="/admin/events" 
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              isActive('/admin/events') ? 'text-red-500' : 'text-slate-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs mt-1">Events</span>
          </Link>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header - simplified for mobile */}
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-100">
          <div className="px-4 md:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              {/* Logo for larger screens */}
              <div className="hidden lg:flex items-center mr-4">
                <div className="relative h-8 w-8 overflow-hidden">
                  <Image 
                    src="/cropped-Design-sans-titre-23.png" 
                    alt="DDMRP Logo" 
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Page title */}
              <div className="flex flex-col">
                <h2 className="text-lg font-medium text-slate-800">{getPageTitle()}</h2>
                <div className="hidden sm:flex h-1 w-12 bg-gradient-to-r from-green-500 via-orange-400 to-red-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View website link - desktop only */}
              <Link href="/" target="_blank" className="hidden md:flex items-center text-sm text-slate-500 hover:text-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Website
              </Link>
              
              {/* User profile - desktop only */}
              {session?.user && (
                <div className="hidden md:flex items-center bg-slate-100 rounded-full pl-3 pr-1 py-1">
                  <span className="text-sm text-slate-600 mr-2">
                    {session.user.name || session.user.email}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-medium shadow-sm">
                    {session.user.name ? session.user.name[0].toUpperCase() : 'A'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 bg-slate-50 pb-16 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
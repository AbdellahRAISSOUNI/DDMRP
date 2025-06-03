"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070f2]"></div>
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
    if (pathname?.startsWith('/admin/courses')) return 'Course Management';
    if (pathname?.startsWith('/admin/archived')) return 'Archived Courses';
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
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-50 z-20"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-30 h-screen bg-white shadow-sm transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        } ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0') : ''}`}
      >
        <div className={`p-3 border-b border-slate-100 flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
          <Link href="/admin" className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-[#0070f2] flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            {!sidebarCollapsed && <h1 className="text-lg font-bold text-slate-800 ml-3">DDMRP</h1>}
          </Link>
          
          {/* Desktop Collapse Button */}
          {!isMobile && !sidebarCollapsed && (
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
          {!isMobile && sidebarCollapsed && (
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
        <div className="flex-grow overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <nav className={`px-2 py-4 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {/* Main Section */}
            {!sidebarCollapsed && (
              <div className="mb-3 px-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Main</span>
              </div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg ${
                    isActive('/admin') && pathname === '/admin'
                      ? 'bg-[#eef5ff] text-[#0070f2]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/courses"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg ${
                    isActive('/admin/courses')
                      ? 'bg-[#eef5ff] text-[#0070f2]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm">Courses</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/archived"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg ${
                    isActive('/admin/archived')
                      ? 'bg-[#eef5ff] text-[#0070f2]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm">Archived</span>}
                </Link>
              </li>
            </ul>

            {/* Communications Section */}
            {!sidebarCollapsed && (
              <div className="mt-6 mb-3 px-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Communications</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="my-3 border-t border-slate-100"></div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/inquiries"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg ${
                    isActive('/admin/inquiries')
                      ? 'bg-[#fff4e6] text-[#f59638]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm">Inquiries</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/demo-bookings"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg ${
                    isActive('/admin/demo-bookings')
                      ? 'bg-[#f5e6ff] text-[#9038f5]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm">Demo Bookings</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/events"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg ${
                    isActive('/admin/events')
                      ? 'bg-[#e6f7f8] text-[#12a5b0]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm">Events</span>}
                </Link>
              </li>
            </ul>

            {/* Analytics Section */}
            {!sidebarCollapsed && (
              <div className="mt-6 mb-3 px-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Analytics</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="my-3 border-t border-slate-100"></div>
            )}
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/statistics"
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg ${
                    isActive('/admin/statistics')
                      ? 'bg-[#efeaff] text-[#6c4ed9]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {!sidebarCollapsed && <span className="ml-3 text-sm">Statistics</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Logout button at bottom */}
        <div className={`p-3 border-t border-slate-100 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={handleSignOut}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3 text-sm">Logout</span>}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden mr-3 h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <h2 className="text-lg font-medium text-slate-800">{getPageTitle()}</h2>
              
              <div className="hidden md:flex items-center">
                <span className="h-5 w-px bg-slate-200 mx-4"></span>
                <Link href="/" target="_blank" className="text-sm text-slate-500 hover:text-[#0070f2] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Website
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              {session?.user && (
                <>
                  <span className="hidden md:inline text-sm text-slate-600 mr-2">
                    {session.user.name || session.user.email}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-[#eef5ff] flex items-center justify-center text-[#0070f2] font-medium">
                    {session.user.name ? session.user.name[0].toUpperCase() : 'A'}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
} 
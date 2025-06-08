"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardStats {
  courses: {
    total: number;
    active: number;
    archived: number;
  };
  inquiries: {
    total: number;
    new: number;
  };
  demoBookings: {
    total: number;
    new: number;
  };
  eventRegistrations: {
    total: number;
    byStatus: {
      new: number;
      contacted: number;
      confirmed: number;
      attended: number;
      cancelled: number;
    };
  };
  events?: {
    total: number;
    active: number;
    archived: number;
    upcoming: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Create individual fetch promises
        const coursesPromise = fetch('/api/courses/statistics')
          .then(res => res.ok ? res.json() : { total: 0, active: 0, archived: 0 })
          .catch(() => ({ total: 0, active: 0, archived: 0 }));
          
        const inquiriesPromise = fetch('/api/inquiries/statistics')
          .then(res => res.ok ? res.json() : { total: 0, new: 0 })
          .catch(() => ({ total: 0, new: 0 }));
          
        const demoBookingsPromise = fetch('/api/demo-bookings/statistics')
          .then(res => res.ok ? res.json() : { total: 0, new: 0 })
          .catch(() => ({ total: 0, new: 0 }));
          
        const eventRegistrationsPromise = fetch('/api/event-registrations/statistics')
          .then(res => res.ok ? res.json() : { 
            total: 0, 
            byStatus: { new: 0, contacted: 0, confirmed: 0, attended: 0, cancelled: 0 } 
          })
          .catch(() => ({ 
            total: 0, 
            byStatus: { new: 0, contacted: 0, confirmed: 0, attended: 0, cancelled: 0 } 
          }));
        
        const eventsPromise = fetch('/api/events/statistics')
          .then(res => res.ok ? res.json() : { total: 0, active: 0, archived: 0, upcoming: 0 })
          .catch(() => ({ total: 0, active: 0, archived: 0, upcoming: 0 }));
        
        // Wait for all promises to resolve, even if some fail
        const [coursesData, inquiriesData, demoBookingsData, eventRegistrationsData, eventsData] = 
          await Promise.all([
            coursesPromise,
            inquiriesPromise,
            demoBookingsPromise,
            eventRegistrationsPromise,
            eventsPromise
          ]);
        
        setStats({
          courses: coursesData,
          inquiries: inquiriesData,
          demoBookings: demoBookingsData,
          eventRegistrations: eventRegistrationsData,
          events: eventsData
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load some dashboard statistics. Please refresh to try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Calculate total pending items that need attention
  const getTotalPendingItems = () => {
    if (!stats) return 0;
    
    const inquiriesNew = stats.inquiries?.new || 0;
    const demoBookingsNew = stats.demoBookings?.new || 0;
    const eventRegistrationsNew = stats.eventRegistrations?.byStatus?.new || 0;
    
    return inquiriesNew + demoBookingsNew + eventRegistrationsNew;
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1] 
      }
    })
  };
  
  return (
    <div className="w-full">
      {/* Dashboard Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-800 mb-2">
              <span className="bg-gradient-to-r from-green-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Supply Chain Management
              </span>
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-10 bg-green-500 rounded-full"></div>
              <div className="h-1 w-6 bg-orange-400 rounded-full"></div>
              <div className="h-1 w-10 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-slate-600">DDMRP course and event management system</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Link 
              href="/admin/courses/new" 
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-sm text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Course
            </Link>
            <Link 
              href="/admin/events/new" 
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all shadow-sm text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Event
            </Link>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 w-10 bg-green-500 rounded-full animate-pulse"></div>
              <div className="h-1 w-6 bg-orange-400 rounded-full animate-pulse delay-75"></div>
              <div className="h-1 w-10 bg-red-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      ) : stats ? (
        <>
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Courses KPI */}
            <motion.div 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-base md:text-lg font-medium text-slate-800">Formations</h2>
                  </div>
                  <div className="inline-flex items-center justify-center px-2.5 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                    <span className="font-bold mr-1">{stats.courses?.active || 0}</span> Active
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="text-2xl md:text-3xl font-bold text-slate-800">{stats.courses?.total || 0}</div>
                  <div className="text-sm text-slate-500">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded">
                      <span className="font-bold mr-1">{stats.courses?.archived || 0}</span> Archived
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/admin/courses" 
                    className="text-sm font-medium flex items-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    Manage courses
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Events KPI */}
            <motion.div 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-base md:text-lg font-medium text-slate-800">Events</h2>
                  </div>
                  <div className="inline-flex items-center justify-center px-2.5 py-1 bg-red-50 text-red-500 text-xs font-medium rounded-full">
                    <span className="font-bold mr-1">{stats.events?.upcoming || 0}</span> Upcoming
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="text-2xl md:text-3xl font-bold text-slate-800">{stats.events?.total || 0}</div>
                  <div className="text-sm text-slate-500">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded">
                      <span className="font-bold mr-1">{stats.events?.archived || 0}</span> Archived
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/admin/events" 
                    className="text-sm font-medium flex items-center text-red-500 hover:text-red-600 transition-colors"
                  >
                    Manage events
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Registrations KPI */}
            <motion.div 
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-base md:text-lg font-medium text-slate-800">Registrations</h2>
                  </div>
                  <div className="inline-flex items-center justify-center px-2.5 py-1 bg-orange-50 text-orange-500 text-xs font-medium rounded-full">
                    <span className="font-bold mr-1">{stats.eventRegistrations?.byStatus?.new || 0}</span> New
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="text-2xl md:text-3xl font-bold text-slate-800">{stats.eventRegistrations?.total || 0}</div>
                  <div className="text-sm text-slate-500">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded">
                      <span className="font-bold mr-1">{stats.eventRegistrations?.byStatus?.confirmed || 0}</span> Confirmed
                  </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/admin/events" 
                    className="text-sm font-medium flex items-center text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    View registrations
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Inquiries KPI */}
            <motion.div 
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-base md:text-lg font-medium text-slate-800">Inquiries</h2>
                  </div>
                  <div className="inline-flex items-center justify-center px-2.5 py-1 bg-blue-50 text-blue-500 text-xs font-medium rounded-full">
                    <span className="font-bold mr-1">{stats.inquiries?.new || 0}</span> New
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="text-2xl md:text-3xl font-bold text-slate-800">{stats.inquiries?.total || 0}</div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/admin/inquiries" 
                    className="text-sm font-medium flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    View inquiries
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Pending Items */}
          <motion.div 
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-6 md:mb-8"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-md overflow-hidden">
              <div className="px-4 md:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-base md:text-lg font-medium text-white">Pending Items</h2>
                    <p className="text-green-100 text-sm">Items that need your attention</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <span className="text-xl md:text-2xl font-bold text-white">{getTotalPendingItems()}</span>
                    <span className="ml-2 text-green-100">total</span>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 md:px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link href="/admin/inquiries" className="flex items-center justify-between px-3 md:px-4 py-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                      <span className="text-xs md:text-sm font-medium text-slate-700">New Inquiries</span>
                    </div>
                    <span className="text-sm font-bold text-orange-500">{stats.inquiries?.new || 0}</span>
                  </Link>
                  <Link href="/admin/demo-bookings" className="flex items-center justify-between px-3 md:px-4 py-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                      <span className="text-xs md:text-sm font-medium text-slate-700">Demo Bookings</span>
                    </div>
                    <span className="text-sm font-bold text-purple-500">{stats.demoBookings?.new || 0}</span>
                  </Link>
                  <Link href="/admin/events" className="flex items-center justify-between px-3 md:px-4 py-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                      <span className="text-xs md:text-sm font-medium text-slate-700">Event Registrations</span>
                    </div>
                    <span className="text-sm font-bold text-red-500">{stats.eventRegistrations?.byStatus?.new || 0}</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
            
          {/* Recent Activity and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Registration Status */}
            <motion.div 
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2 hover:shadow-md transition-all duration-300"
            >
              <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">Registration Status</h2>
                <Link href="/admin/events" className="text-sm text-red-500 hover:text-red-600 transition-colors">View All</Link>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-2 md:p-4 text-center">
                    <div className="text-lg md:text-2xl font-bold text-slate-800">{stats.eventRegistrations?.total || 0}</div>
                    <div className="text-xs md:text-sm text-slate-500 mt-1">Total</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 md:p-4 text-center">
                    <div className="text-lg md:text-2xl font-bold text-green-600">{stats.eventRegistrations?.byStatus?.new || 0}</div>
                    <div className="text-xs md:text-sm text-green-600 mt-1">New</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 md:p-4 text-center">
                    <div className="text-lg md:text-2xl font-bold text-orange-500">{stats.eventRegistrations?.byStatus?.contacted || 0}</div>
                    <div className="text-xs md:text-sm text-orange-500 mt-1">Contacted</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 md:p-4 text-center">
                    <div className="text-lg md:text-2xl font-bold text-blue-500">{stats.eventRegistrations?.byStatus?.confirmed || 0}</div>
                    <div className="text-xs md:text-sm text-blue-500 mt-1">Confirmed</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2 md:p-4 text-center">
                    <div className="text-lg md:text-2xl font-bold text-red-500">{stats.eventRegistrations?.byStatus?.attended || 0}</div>
                    <div className="text-xs md:text-sm text-red-500 mt-1">Attended</div>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div className="h-full bg-green-500" style={{ width: `${stats.eventRegistrations?.total ? (stats.eventRegistrations.byStatus.new / stats.eventRegistrations.total) * 100 : 0}%` }}></div>
                    <div className="h-full bg-orange-500" style={{ width: `${stats.eventRegistrations?.total ? (stats.eventRegistrations.byStatus.contacted / stats.eventRegistrations.total) * 100 : 0}%` }}></div>
                    <div className="h-full bg-blue-500" style={{ width: `${stats.eventRegistrations?.total ? (stats.eventRegistrations.byStatus.confirmed / stats.eventRegistrations.total) * 100 : 0}%` }}></div>
                    <div className="h-full bg-red-500" style={{ width: `${stats.eventRegistrations?.total ? (stats.eventRegistrations.byStatus.attended / stats.eventRegistrations.total) * 100 : 0}%` }}></div>
                    <div className="h-full bg-slate-300" style={{ width: `${stats.eventRegistrations?.total ? (stats.eventRegistrations.byStatus.cancelled / stats.eventRegistrations.total) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div 
              custom={6}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="px-4 md:px-6 py-4 border-b border-slate-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="text-lg font-medium text-white">Quick Actions</h2>
              </div>
              <div className="p-3 md:p-6">
                <div className="space-y-2 md:space-y-3">
                  <Link href="/admin/courses/new" className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 md:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-xs md:text-sm font-medium text-white">Add New Course</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/admin/events/new" className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 md:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs md:text-sm font-medium text-white">Create New Event</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/admin/inquiries" className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mr-2 md:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span className="text-xs md:text-sm font-medium text-white">View New Inquiries</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/admin/statistics" className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2 md:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-xs md:text-sm font-medium text-white">View Statistics</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </div>
  );
}
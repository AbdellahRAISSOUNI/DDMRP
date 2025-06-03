"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  
  return (
    <div className="w-full">
      {/* Dashboard Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Supply Chain Management</h1>
            <p className="text-slate-600">DDMRP course and event management system</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Link 
              href="/admin/courses/new" 
              className="inline-flex items-center px-3 py-2 bg-[#0070f2] text-white rounded-md hover:bg-[#0057b8] transition-colors shadow-sm text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Course
            </Link>
            <Link 
              href="/admin/events/new" 
              className="inline-flex items-center px-3 py-2 bg-[#12a5b0] text-white rounded-md hover:bg-[#0e8991] transition-colors shadow-sm text-sm"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070f2]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {error}
        </div>
      ) : stats ? (
        <>
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Courses KPI */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#eef5ff] flex items-center justify-center text-[#0070f2]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-lg font-medium text-slate-800">Courses</h2>
                  </div>
                  <span className="px-2.5 py-1 bg-[#eef5ff] text-[#0070f2] text-xs font-medium rounded-full">
                    {stats.courses?.active || 0} Active
                  </span>
                </div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold text-slate-800">{stats.courses?.total || 0}</div>
                  <div className="ml-4 text-sm text-slate-500">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded mr-1">
                      {stats.courses?.archived || 0} Archived
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/admin/courses" 
                    className="text-sm font-medium flex items-center text-[#0070f2] hover:text-[#0057b8]"
                  >
                    Manage courses
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Events KPI */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#e6f7f8] flex items-center justify-center text-[#12a5b0]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-lg font-medium text-slate-800">Events</h2>
                  </div>
                  <span className="px-2.5 py-1 bg-[#e6f7f8] text-[#12a5b0] text-xs font-medium rounded-full">
                    {stats.events?.upcoming || 0} Upcoming
                  </span>
                </div>
                <div className="flex items-end">
                  <div className="text-3xl font-bold text-slate-800">{stats.events?.total || 0}</div>
                  <div className="ml-4 text-sm text-slate-500">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 rounded mr-1">
                      {stats.events?.archived || 0} Archived
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/admin/events" 
                    className="text-sm font-medium flex items-center text-[#12a5b0] hover:text-[#0e8991]"
                  >
                    Manage events
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Registrations KPI */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#efeaff] flex items-center justify-center text-[#6c4ed9]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-lg font-medium text-slate-800">Registrations</h2>
                  </div>
                  <span className="px-2.5 py-1 bg-[#efeaff] text-[#6c4ed9] text-xs font-medium rounded-full">
                    {stats.eventRegistrations?.byStatus?.new || 0} New
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-800">{stats.eventRegistrations?.total || 0}</div>
                <div className="mt-4">
                  <Link 
                    href="/admin/events" 
                    className="text-sm font-medium flex items-center text-[#6c4ed9] hover:text-[#5a3fc7]"
                  >
                    View registrations
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Pending Items KPI */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-[#fff4e6] flex items-center justify-center text-[#f59638]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="ml-3 text-lg font-medium text-slate-800">Pending Items</h2>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800">{getTotalPendingItems()}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link 
                    href="/admin/inquiries?status=new" 
                    className="text-xs font-medium px-2 py-1 bg-[#fff4e6] text-[#f59638] rounded hover:bg-[#ffe8cc]"
                  >
                    {stats.inquiries?.new || 0} Inquiries
                  </Link>
                  <Link 
                    href="/admin/demo-bookings?status=new" 
                    className="text-xs font-medium px-2 py-1 bg-[#f5e6ff] text-[#9038f5] rounded hover:bg-[#edd9f9]"
                  >
                    {stats.demoBookings?.new || 0} Demo Bookings
                  </Link>
                  <Link 
                    href="/admin/events" 
                    className="text-xs font-medium px-2 py-1 bg-[#e6f7f8] text-[#12a5b0] rounded hover:bg-[#d7f1f3]"
                  >
                    {stats.eventRegistrations?.byStatus?.new || 0} Registrations
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden lg:col-span-1">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100">
                <h2 className="text-lg font-medium text-slate-800">Quick Actions</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <Link
                    href="/admin/courses/new"
                    className="flex items-center p-3 bg-[#eef5ff] text-[#0070f2] rounded-lg hover:bg-[#dceaff] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Course
                  </Link>
                  
                  <Link
                    href="/admin/events/new"
                    className="flex items-center p-3 bg-[#e6f7f8] text-[#12a5b0] rounded-lg hover:bg-[#d7f1f3] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Event
                  </Link>
                  
                  <Link
                    href="/admin/inquiries?status=new"
                    className="flex items-center p-3 bg-[#fff4e6] text-[#f59638] rounded-lg hover:bg-[#ffe8cc] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    View New Inquiries
                    {stats.inquiries?.new > 0 && (
                      <span className="ml-auto bg-white text-[#f59638] px-2 py-0.5 rounded-full text-xs font-medium">
                        {stats.inquiries?.new}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    href="/admin/demo-bookings?status=new"
                    className="flex items-center p-3 bg-[#f5e6ff] text-[#9038f5] rounded-lg hover:bg-[#edd9f9] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    View Demo Bookings
                    {stats.demoBookings?.new > 0 && (
                      <span className="ml-auto bg-white text-[#9038f5] px-2 py-0.5 rounded-full text-xs font-medium">
                        {stats.demoBookings?.new}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    href="/admin/statistics"
                    className="flex items-center p-3 bg-[#efeaff] text-[#6c4ed9] rounded-lg hover:bg-[#e5deff] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Statistics
                  </Link>
                  
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center p-3 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Public Site
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Registration Status */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden lg:col-span-2">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-medium text-slate-800">Registration Status</h2>
                <Link href="/admin/events" className="text-sm text-[#12a5b0] hover:text-[#0e8991]">View All</Link>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-slate-800">{stats.eventRegistrations?.total || 0}</div>
                    <div className="text-xs md:text-sm text-slate-500">Total</div>
                  </div>
                  <div className="bg-[#e6f7f8] rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-[#12a5b0]">{stats.eventRegistrations?.byStatus?.new || 0}</div>
                    <div className="text-xs md:text-sm text-[#12a5b0]">New</div>
                  </div>
                  <div className="bg-[#fff4e6] rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-[#f59638]">{stats.eventRegistrations?.byStatus?.contacted || 0}</div>
                    <div className="text-xs md:text-sm text-[#f59638]">Contacted</div>
                  </div>
                  <div className="bg-[#efeaff] rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-[#6c4ed9]">{stats.eventRegistrations?.byStatus?.confirmed || 0}</div>
                    <div className="text-xs md:text-sm text-[#6c4ed9]">Confirmed</div>
                  </div>
                  <div className="bg-[#eef5ff] rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold text-[#0070f2]">{stats.eventRegistrations?.byStatus?.attended || 0}</div>
                    <div className="text-xs md:text-sm text-[#0070f2]">Attended</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link 
                    href="/admin/events/new" 
                    className="inline-flex items-center px-3 py-1.5 bg-[#12a5b0] text-white text-sm rounded hover:bg-[#0e8991] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Event
                  </Link>
                  
                  <Link 
                    href="/admin/events" 
                    className="inline-flex items-center px-3 py-1.5 bg-white border border-[#12a5b0] text-[#12a5b0] text-sm rounded hover:bg-[#e6f7f8] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Manage Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DemoBooking, DemoBookingStatus } from '@/app/lib/models/demoBooking';
import { motion } from 'framer-motion';

export default function DemoBookingsPage() {
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<DemoBookingStatus | 'all'>('all');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    completed: 0,
    archived: 0
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/demo-bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch demo bookings');
        }
        const data = await response.json();
        setBookings(data);
        
        // Calculate stats
        const statCounts = data.reduce((acc: any, booking: DemoBooking) => {
          acc.total++;
          acc[booking.status]++;
          return acc;
        }, { total: 0, new: 0, contacted: 0, completed: 0, archived: 0 });
        
        setStats(statCounts);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching demo bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: string, status: DemoBookingStatus) => {
    try {
      const response = await fetch(`/api/demo-bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking._id?.toString() === id ? { ...booking, status } : booking
      );
      
      setBookings(updatedBookings);
      
      // Update stats
      const statCounts = updatedBookings.reduce((acc: any, booking: DemoBooking) => {
        acc.total++;
        acc[booking.status]++;
        return acc;
      }, { total: 0, new: 0, contacted: 0, completed: 0, archived: 0 });
      
      setStats(statCounts);
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeFilter);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Status badge styling
  const getStatusBadge = (status: DemoBookingStatus) => {
    switch(status) {
      case 'new':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'archived':
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-8 shadow-sm border border-purple-100">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Demo Bookings</h1>
        <p className="text-slate-600 max-w-2xl">Manage and track requests for IntuiFlow demonstrations. Schedule and organize product demonstrations for potential clients.</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-slate-500 mb-1">Total</div>
          <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-green-700 mb-1">New</div>
          <div className="text-3xl font-bold text-green-600">{stats.new}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-yellow-700 mb-1">Contacted</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.contacted}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-blue-700 mb-1">Completed</div>
          <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-slate-500 mb-1">Archived</div>
          <div className="text-3xl font-bold text-slate-600">{stats.archived}</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <h2 className="text-sm font-medium text-slate-600 mb-3">Filter By Status</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'all' 
                ? 'bg-purple-600 text-white border border-purple-600 shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveFilter('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'new' 
                ? 'bg-green-600 text-white border border-green-600 shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setActiveFilter('contacted')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'contacted' 
                ? 'bg-yellow-600 text-white border border-yellow-600 shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Contacted
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'completed' 
                ? 'bg-blue-600 text-white border border-blue-600 shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveFilter('archived')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'archived' 
                ? 'bg-slate-700 text-white border border-slate-700 shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-slate-600">Loading demo bookings...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800">Error Loading Bookings</h3>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBookings.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-slate-200 text-center"
        >
          <div className="bg-purple-50 rounded-full p-5 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-slate-800 mb-2">No demo bookings found</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-4">
            {activeFilter === 'all' 
              ? "There are no demo bookings yet." 
              : `There are no ${activeFilter} demo bookings.`}
          </p>
          <button 
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            View All Bookings
          </button>
        </motion.div>
      )}

      {/* Bookings List */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Preferred Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredBookings.map((booking, index) => (
                  <motion.tr 
                    key={booking._id?.toString()} 
                    className="hover:bg-slate-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{booking.fullName}</div>
                      <div className="text-sm text-blue-600 hover:underline">
                        <a href={`mailto:${booking.email}`}>{booking.email}</a>
                      </div>
                      <div className="text-sm text-slate-500">
                        <a href={`tel:${booking.phone}`}>{booking.phone}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-800 font-medium">{booking.company || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-800">
                        {booking.preferredDate ? (
                          <span className="bg-purple-50 text-purple-800 px-2 py-1 rounded-md text-xs font-medium">
                            {formatDate(booking.preferredDate)}
                          </span>
                        ) : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{formatDate(booking.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        getStatusBadge(booking.status)
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col space-y-2">
                        {booking.status !== 'contacted' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id!.toString(), 'contacted')}
                            className="text-yellow-600 hover:text-yellow-900 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Mark Contacted
                          </button>
                        )}
                        {booking.status !== 'completed' && booking.status !== 'archived' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id!.toString(), 'completed')}
                            className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark Completed
                          </button>
                        )}
                        {booking.status !== 'archived' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id!.toString(), 'archived')}
                            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Archive
                          </button>
                        )}
                        {booking.status === 'archived' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id!.toString(), 'new')}
                            className="text-green-600 hover:text-green-900 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 
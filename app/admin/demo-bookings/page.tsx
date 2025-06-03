"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DemoBooking, DemoBookingStatus } from '@/app/lib/models/demoBooking';

export default function DemoBookingsPage() {
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<DemoBookingStatus | 'all'>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/demo-bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch demo bookings');
        }
        const data = await response.json();
        setBookings(data);
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
      setBookings(bookings.map(booking => 
        booking._id?.toString() === id ? { ...booking, status } : booking
      ));
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Demo Bookings</h1>
        <p className="text-slate-600">Manage and track requests for IntuitiveFlow demonstrations</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === 'all' 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('new')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === 'new' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          New
        </button>
        <button
          onClick={() => setActiveFilter('contacted')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === 'contacted' 
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Contacted
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === 'completed' 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveFilter('archived')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === 'archived' 
              ? 'bg-slate-100 text-slate-700 border border-slate-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Archived
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-50 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No demo bookings found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {activeFilter === 'all' 
              ? "There are no demo bookings yet." 
              : `There are no ${activeFilter} demo bookings.`}
          </p>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Preferred Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id?.toString()} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{booking.fullName}</div>
                      <div className="text-sm text-slate-500">{booking.email}</div>
                      <div className="text-sm text-slate-500">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">{booking.company || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">
                        {booking.preferredDate ? formatDate(booking.preferredDate) : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">{formatDate(booking.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'new' ? 'bg-green-100 text-green-800' :
                        booking.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {booking.status !== 'contacted' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id!.toString(), 'contacted')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {booking.status !== 'completed' && booking.status !== 'archived' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id!.toString(), 'completed')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Mark Completed
                          </button>
                        )}
                        {booking.status !== 'archived' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id!.toString(), 'archived')}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            Archive
                          </button>
                        )}
                        {booking.status === 'archived' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id!.toString(), 'new')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 
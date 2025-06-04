"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Inquiry, InquiryStatus } from '@/app/lib/models/inquiry';
import { motion } from 'framer-motion';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    completed: 0,
    archived: 0
  });
  
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch('/api/inquiries');
        if (!response.ok) {
          throw new Error('Failed to fetch inquiries');
        }
        const data = await response.json();
        setInquiries(data);
        
        // Calculate stats
        const statCounts = data.reduce((acc: any, inquiry: Inquiry) => {
          acc.total++;
          acc[inquiry.status]++;
          return acc;
        }, { total: 0, new: 0, contacted: 0, completed: 0, archived: 0 });
        
        setStats(statCounts);
      } catch (err) {
        console.error('Error fetching inquiries:', err);
        setError('Failed to load inquiries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInquiries();
  }, []);
  
  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update inquiry status');
      }
      
      // Update the inquiry in the local state
      const updatedInquiries = inquiries.map(inquiry => 
        inquiry._id?.toString() === id 
          ? { ...inquiry, status } 
          : inquiry
      );
      
      setInquiries(updatedInquiries);
      
      // Update stats
      const statCounts = updatedInquiries.reduce((acc: any, inquiry: Inquiry) => {
        acc.total++;
        acc[inquiry.status]++;
        return acc;
      }, { total: 0, new: 0, contacted: 0, completed: 0, archived: 0 });
      
      setStats(statCounts);
    } catch (err) {
      console.error('Error updating inquiry status:', err);
      alert('Failed to update inquiry status. Please try again.');
    }
  };
  
  const filteredInquiries = filterStatus === 'all'
    ? inquiries
    : inquiries.filter(inquiry => inquiry.status === filterStatus);
  
  // Get formatted date
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

  // Get status badge styling
  const getStatusBadge = (status: InquiryStatus) => {
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-8 shadow-sm border border-blue-100">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Course Inquiries</h1>
        <p className="text-slate-600 max-w-2xl">Manage and respond to student inquiries about courses. Track progress and ensure timely communication with potential students.</p>
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
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <h2 className="text-sm font-medium text-slate-600 mb-3">Filter By Status</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              filterStatus === 'all' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Inquiries
          </button>
          <button
            onClick={() => setFilterStatus('new')}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              filterStatus === 'new' 
                ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setFilterStatus('contacted')}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              filterStatus === 'contacted' 
                ? 'bg-yellow-600 text-white border-yellow-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Contacted
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              filterStatus === 'completed' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus('archived')}
            className={`px-4 py-2 text-sm rounded-lg border transition-all ${
              filterStatus === 'archived' 
                ? 'bg-slate-700 text-white border-slate-700 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Archived
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading inquiries...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800">Error Loading Inquiries</h3>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-slate-200 text-center"
        >
          <div className="bg-slate-100 rounded-full p-5 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-slate-800 mb-2">No inquiries found</h2>
          {filterStatus !== 'all' && (
            <p className="text-slate-500 text-md mb-4">There are no inquiries with the <span className="font-medium">{filterStatus}</span> status.</p>
          )}
          <button 
            onClick={() => setFilterStatus('all')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            View All Inquiries
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry, index) => (
            <motion.div 
              key={inquiry._id?.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`py-2 px-6 flex justify-between items-center ${
                inquiry.status === 'new' ? 'bg-green-50 border-b border-green-100' : 
                inquiry.status === 'contacted' ? 'bg-yellow-50 border-b border-yellow-100' : 
                inquiry.status === 'completed' ? 'bg-blue-50 border-b border-blue-100' : 
                'bg-slate-50 border-b border-slate-100'
              }`}>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium mr-3 ${getStatusBadge(inquiry.status)}`}>
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </span>
                  <h2 className="text-lg font-semibold text-slate-800">{inquiry.fullName}</h2>
                </div>
                <span className="text-xs text-slate-500">{formatDate(inquiry.createdAt)}</span>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap md:flex-nowrap gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-slate-600">{inquiry.phone}</span>
                        </div>
                      )}
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="text-sm font-medium text-slate-700 mb-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Course:
                        </div>
                        <Link 
                          href={`/admin/courses/${inquiry.courseId}`}
                          className="text-blue-600 hover:underline flex items-center text-sm"
                        >
                          {inquiry.courseTitle}
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    {inquiry.message && (
                      <div className="mb-6">
                        <div className="text-sm font-medium text-slate-700 mb-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Message:
                        </div>
                        <div className="text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3 text-sm max-h-32 overflow-y-auto">
                          {inquiry.message}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {inquiry.status !== 'new' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id?.toString() || '', 'new')}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors"
                    >
                      Mark as New
                    </button>
                  )}
                  
                  {inquiry.status !== 'contacted' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id?.toString() || '', 'contacted')}
                      className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors"
                    >
                      Mark as Contacted
                    </button>
                  )}
                  
                  {inquiry.status !== 'completed' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id?.toString() || '', 'completed')}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  
                  {inquiry.status !== 'archived' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id?.toString() || '', 'archived')}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 
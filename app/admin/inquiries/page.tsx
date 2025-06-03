"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Inquiry, InquiryStatus } from '@/app/lib/models/inquiry';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all');
  
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch('/api/inquiries');
        if (!response.ok) {
          throw new Error('Failed to fetch inquiries');
        }
        const data = await response.json();
        setInquiries(data);
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
      setInquiries(inquiries.map(inquiry => 
        inquiry._id?.toString() === id 
          ? { ...inquiry, status } 
          : inquiry
      ));
    } catch (err) {
      console.error('Error updating inquiry status:', err);
      alert('Failed to update inquiry status. Please try again.');
    }
  };
  
  const filteredInquiries = filterStatus === 'all'
    ? inquiries
    : inquiries.filter(inquiry => inquiry.status === filterStatus);
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getStatusBadgeClass = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Course Inquiries</h1>
        <p className="text-slate-600">Manage and respond to student inquiries about courses.</p>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-1 text-sm rounded-full border ${
            filterStatus === 'all' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus('new')}
          className={`px-4 py-1 text-sm rounded-full border ${
            filterStatus === 'new' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          New
        </button>
        <button
          onClick={() => setFilterStatus('contacted')}
          className={`px-4 py-1 text-sm rounded-full border ${
            filterStatus === 'contacted' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          Contacted
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-1 text-sm rounded-full border ${
            filterStatus === 'completed' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilterStatus('archived')}
          className={`px-4 py-1 text-sm rounded-full border ${
            filterStatus === 'archived' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          Archived
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-slate-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">No inquiries found</p>
          {filterStatus !== 'all' && (
            <p className="text-slate-500 text-sm mt-1">Try changing your filter selection</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredInquiries.map((inquiry) => (
            <div 
              key={inquiry._id?.toString()} 
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-slate-800">{inquiry.fullName}</h2>
                    <div className="text-sm text-slate-600 mt-1">
                      <div className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">
                          {inquiry.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-3 py-1 rounded-full border ${getStatusBadgeClass(inquiry.status)}`}>
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </span>
                    <span className="text-xs text-slate-500 mt-2">
                      {formatDate(inquiry.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-1">Course:</div>
                  <Link 
                    href={`/admin/courses/${inquiry.courseId}`}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {inquiry.courseTitle}
                  </Link>
                </div>
                
                {inquiry.message && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-slate-700 mb-1">Message:</div>
                    <div className="text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3 text-sm">
                      {inquiry.message}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {inquiry.status !== 'new' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id?.toString() || '', 'new')}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm px-3 py-1 rounded-md transition-colors"
                    >
                      Mark as New
                    </button>
                  )}
                  
                  {inquiry.status !== 'contacted' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id?.toString() || '', 'contacted')}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-200 text-sm px-3 py-1 rounded-md transition-colors"
                    >
                      Mark as Contacted
                    </button>
                  )}
                  
                  {inquiry.status !== 'completed' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id?.toString() || '', 'completed')}
                      className="bg-green-100 hover:bg-green-200 text-green-800 border border-green-200 text-sm px-3 py-1 rounded-md transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  
                  {inquiry.status !== 'archived' && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry._id?.toString() || '', 'archived')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-sm px-3 py-1 rounded-md transition-colors"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
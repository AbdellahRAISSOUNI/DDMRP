"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '@/app/lib/models/event';
import { motion } from 'framer-motion';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    archived: 0,
    totalRegistrations: 0
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events?includeArchived=${showArchived}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        
        // Calculate stats
        const today = new Date();
        const statCounts = data.reduce((acc: any, event: Event) => {
          acc.total++;
          
          const eventDate = new Date(event.eventDate);
          if (event.isArchived) {
            acc.archived++;
          } else if (eventDate > today) {
            acc.upcoming++;
          } else {
            acc.past++;
          }
          
          // Count registrations if available
          if (event.registrationCount) {
            acc.totalRegistrations += event.registrationCount;
          }
          
          return acc;
        }, { total: 0, upcoming: 0, past: 0, archived: 0, totalRegistrations: 0 });
        
        setStats(statCounts);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showArchived]);

  const handleArchiveToggle = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isArchived: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      // Update local state
      const updatedEvents = events.map(event => 
        event._id?.toString() === id ? { ...event, isArchived: !currentStatus } : event
      );
      
      setEvents(updatedEvents);
      
      // Update stats
      const today = new Date();
      const statCounts = updatedEvents.reduce((acc: any, event: Event) => {
        acc.total++;
        
        const eventDate = new Date(event.eventDate);
        if (event.isArchived) {
          acc.archived++;
        } else if (eventDate > today) {
          acc.upcoming++;
        } else {
          acc.past++;
        }
        
        // Count registrations if available
        if (event.registrationCount) {
          acc.totalRegistrations += event.registrationCount;
        }
        
        return acc;
      }, { total: 0, upcoming: 0, past: 0, archived: 0, totalRegistrations: 0 });
      
      setStats(statCounts);
    } catch (err: any) {
      console.error('Error updating event:', err);
      alert('Failed to update event: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove from local state and update stats
      const updatedEvents = events.filter(event => event._id?.toString() !== id);
      setEvents(updatedEvents);
      
      // Update stats
      const today = new Date();
      const statCounts = updatedEvents.reduce((acc: any, event: Event) => {
        acc.total++;
        
        const eventDate = new Date(event.eventDate);
        if (event.isArchived) {
          acc.archived++;
        } else if (eventDate > today) {
          acc.upcoming++;
        } else {
          acc.past++;
        }
        
        // Count registrations if available
        if (event.registrationCount) {
          acc.totalRegistrations += event.registrationCount;
        }
        
        return acc;
      }, { total: 0, upcoming: 0, past: 0, archived: 0, totalRegistrations: 0 });
      
      setStats(statCounts);
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event: ' + err.message);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const filteredEvents = events.filter(event => showArchived ? true : !event.isArchived);

  // Check if event date is in the future
  const isUpcoming = (dateString: string | Date) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate > today;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 mb-8 shadow-sm border border-red-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Events Management</h1>
            <p className="text-slate-600 max-w-2xl">Create and manage upcoming events, workshops, and training sessions.</p>
          </div>
          <Link 
            href="/admin/events/new" 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Event
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Events</div>
          <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-green-700 mb-1">Upcoming</div>
          <div className="text-3xl font-bold text-green-600">{stats.upcoming}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-red-700 mb-1">Past</div>
          <div className="text-3xl font-bold text-red-600">{stats.past}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-slate-500 mb-1">Archived</div>
          <div className="text-3xl font-bold text-slate-600">{stats.archived}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4 flex flex-col items-center">
          <div className="text-sm font-medium text-blue-700 mb-1">Registrations</div>
          <div className="text-3xl font-bold text-blue-600">{stats.totalRegistrations}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <h2 className="text-sm font-medium text-slate-600 mb-3">View Options</h2>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            showArchived 
              ? 'bg-red-600 text-white border border-red-600 shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          } transition-all`}
        >
          {showArchived ? 'Hide Archived Events' : 'Show Archived Events'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-slate-600">Loading events...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800">Error Loading Events</h3>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredEvents.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-slate-200 text-center"
        >
          <div className="bg-red-50 rounded-full p-5 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-slate-800 mb-2">No events found</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {showArchived 
              ? "There are no archived events." 
              : "There are no active events. Create your first event to get started."}
          </p>
          <Link 
            href="/admin/events/new" 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Event
          </Link>
        </motion.div>
      )}

      {/* Events List */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div 
              key={event._id?.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl shadow-sm border ${
                event.isArchived 
                  ? 'border-slate-200' 
                  : isUpcoming(event.eventDate) 
                    ? 'border-green-200' 
                    : 'border-slate-200'
              } overflow-hidden hover:shadow-md transition-shadow`}
            >
              <div className={`border-b ${
                event.isArchived 
                  ? 'border-slate-100 bg-slate-50' 
                  : isUpcoming(event.eventDate)
                    ? 'border-green-100 bg-green-50'
                    : 'border-red-100 bg-red-50'
              }`}>
                <div className="py-2 px-6 flex justify-between items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                    event.isArchived 
                      ? 'bg-slate-100 text-slate-800 border border-slate-200' 
                      : isUpcoming(event.eventDate)
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {event.isArchived 
                      ? 'Archived' 
                      : isUpcoming(event.eventDate) 
                        ? 'Upcoming' 
                        : 'Past Event'}
                  </span>
                  <span className="text-xs text-slate-500">Created: {formatDate(event.createdAt)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-3">{event.title}</h2>
                
                <div className="flex flex-col space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`font-medium ${isUpcoming(event.eventDate) ? 'text-green-700' : 'text-slate-600'}`}>
                      {formatDate(event.eventDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-slate-600">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-blue-600 font-medium">
                      {event.registrationCount || 0} Registrations
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
                  <Link 
                    href={`/admin/events/${event._id}/registrations`}
                    className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 text-xs md:text-sm px-4 py-2 rounded-md transition-colors flex items-center shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View {event.registrationCount || 0} Registrations
                  </Link>
                  
                  <Link 
                    href={`/admin/events/${event._id}/edit`}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  
                  <button
                    onClick={() => handleArchiveToggle(event._id!.toString(), event.isArchived)}
                    className={`${
                      event.isArchived 
                        ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                    } text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors flex items-center`}
                  >
                    {event.isArchived ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Unarchive
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Archive
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(event._id!.toString())}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs md:text-sm px-3 py-1.5 rounded-md transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 
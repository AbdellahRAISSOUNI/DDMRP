"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '@/app/lib/models/event';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events?includeArchived=${showArchived}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
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
      setEvents(events.map(event => 
        event._id?.toString() === id ? { ...event, isArchived: !currentStatus } : event
      ));
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

      // Remove from local state
      setEvents(events.filter(event => event._id?.toString() !== id));
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

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Events</h1>
        <Link 
          href="/admin/events/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Event
        </Link>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            showArchived 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {showArchived ? 'Hide Archived Events' : 'Show Archived Events'}
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
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-50 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No events found</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {showArchived 
              ? "There are no archived events." 
              : "There are no active events. Create your first event to get started."}
          </p>
          <Link 
            href="/admin/events/new" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Event
          </Link>
        </div>
      )}

      {/* Events List */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredEvents.map((event) => (
                  <tr key={event._id?.toString()} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{event.title}</div>
                      <div className="text-sm text-slate-500">Created: {formatDate(event.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {formatDate(event.eventDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.isArchived ? 'bg-slate-100 text-slate-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {event.isArchived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/admin/events/${event._id}/registrations`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Registrations
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link 
                        href={`/admin/events/${event._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleArchiveToggle(event._id!.toString(), event.isArchived)}
                        className={`${
                          event.isArchived ? 'text-green-600 hover:text-green-900' : 'text-amber-600 hover:text-amber-900'
                        }`}
                      >
                        {event.isArchived ? 'Unarchive' : 'Archive'}
                      </button>
                      <button
                        onClick={() => handleDelete(event._id!.toString())}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Event } from '@/app/lib/models/event';
import { EventRegistration, EventRegistrationStatus } from '@/app/lib/models/eventRegistration';

export default function EventRegistrationsPage() {
  const params = useParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventRegistrationStatus | 'all'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`/api/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event');
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);
        
        // Fetch registrations
        const registrationsResponse = await fetch(`/api/events/${eventId}/registrations`);
        if (!registrationsResponse.ok) {
          throw new Error('Failed to fetch registrations');
        }
        const registrationsData = await registrationsResponse.json();
        setRegistrations(registrationsData);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const updateRegistrationStatus = async (id: string, status: EventRegistrationStatus) => {
    try {
      const response = await fetch(`/api/event-registrations/${id}`, {
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
      setRegistrations(registrations.map(registration => 
        registration._id?.toString() === id ? { ...registration, status } : registration
      ));
    } catch (err: any) {
      console.error('Error updating registration status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const filteredRegistrations = activeFilter === 'all' 
    ? registrations 
    : registrations.filter(registration => registration.status === activeFilter);

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
        <Link 
          href="/admin/events" 
          className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          {event ? `Registrations for: ${event.title}` : 'Event Registrations'}
        </h1>
        {event && (
          <div className="text-slate-600">
            <span className="mr-4">{formatDate(event.eventDate)}</span>
            <span>{event.location}</span>
          </div>
        )}
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
          onClick={() => setActiveFilter('confirmed')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === 'confirmed' 
              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setActiveFilter('attended')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === 'attended' 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Attended
        </button>
        <button
          onClick={() => setActiveFilter('cancelled')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === 'cancelled' 
              ? 'bg-slate-100 text-slate-700 border border-slate-200' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Cancelled
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
      {!loading && !error && filteredRegistrations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-50 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No registrations found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            {activeFilter === 'all' 
              ? "There are no registrations for this event yet." 
              : `There are no ${activeFilter} registrations.`}
          </p>
        </div>
      )}

      {/* Registrations List */}
      {!loading && !error && filteredRegistrations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Registration Date
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
                {filteredRegistrations.map((registration) => (
                  <tr key={registration._id?.toString()} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{registration.fullName}</div>
                      <div className="text-sm text-slate-500">{registration.email}</div>
                      <div className="text-sm text-slate-500">{registration.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">{registration.organization || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">{formatDate(registration.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        registration.status === 'new' ? 'bg-green-100 text-green-800' :
                        registration.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        registration.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                        registration.status === 'attended' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {registration.status !== 'contacted' && (
                          <button
                            onClick={() => updateRegistrationStatus(registration._id!.toString(), 'contacted')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {registration.status !== 'confirmed' && registration.status !== 'attended' && registration.status !== 'cancelled' && (
                          <button
                            onClick={() => updateRegistrationStatus(registration._id!.toString(), 'confirmed')}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Mark Confirmed
                          </button>
                        )}
                        {registration.status !== 'attended' && registration.status !== 'cancelled' && (
                          <button
                            onClick={() => updateRegistrationStatus(registration._id!.toString(), 'attended')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Mark Attended
                          </button>
                        )}
                        {registration.status !== 'cancelled' && (
                          <button
                            onClick={() => updateRegistrationStatus(registration._id!.toString(), 'cancelled')}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            Mark Cancelled
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
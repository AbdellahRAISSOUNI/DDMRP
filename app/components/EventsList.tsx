"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/app/lib/models/event';
import { motion } from 'framer-motion';

export default function EventsList({ limit = 3 }: { limit?: number }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        // Sort by date and limit the number of events
        const sortedEvents = data
          .filter((event: Event) => !event.isArchived)
          .sort((a: Event, b: Event) => {
            return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
          })
          .slice(0, limit);
        
        setEvents(sortedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit]);

  // Function to format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Get month abbreviation and day
  const getMonthDay = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return { month, day };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold">Error</h3>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-slate-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">No upcoming events</h3>
        <p className="text-slate-600">Check back soon for new events or subscribe to our newsletter.</p>
      </div>
    );
  }

  // Define event types with their corresponding colors
  const eventTypes = [
    { name: 'Workshop', color: 'green' },
    { name: 'Webinar', color: 'blue' },
    { name: 'Conference', color: 'purple' }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {events.map((event, index) => {
        const { month, day } = getMonthDay(event.eventDate);
        const eventType = eventTypes[index % eventTypes.length];
        
        // Define color classes based on event type
        let colorClasses = {
          bg: 'bg-green-600',
          bgLight: 'bg-green-100',
          text: 'text-green-600',
          hover: 'group-hover:text-green-600',
          border: 'group-hover:border-green-200',
          gradient: 'from-green-600 to-green-500'
        };
        
        if (eventType.color === 'blue') {
          colorClasses = {
            bg: 'bg-blue-600',
            bgLight: 'bg-blue-100',
            text: 'text-blue-600',
            hover: 'group-hover:text-blue-600',
            border: 'group-hover:border-blue-200',
            gradient: 'from-blue-600 to-blue-500'
          };
        } else if (eventType.color === 'purple') {
          colorClasses = {
            bg: 'bg-purple-600',
            bgLight: 'bg-purple-100',
            text: 'text-purple-600',
            hover: 'group-hover:text-purple-600',
            border: 'group-hover:border-purple-200',
            gradient: 'from-purple-600 to-purple-500'
          };
        }
        
        return (
          <motion.div key={event._id?.toString()} variants={itemVariants}>
            <Link 
              href={`/events/${event._id}`}
              className="group relative bg-white rounded-xl overflow-hidden transition-all duration-500 flex flex-col h-full block"
            >
              {/* Card with hover effect */}
              <div className="absolute inset-0 shadow-lg group-hover:shadow-2xl transition-shadow duration-500"></div>
              <div className={`absolute inset-0 border border-slate-200 rounded-xl ${colorClasses.border} transition-colors duration-500`}></div>
              
              {/* Date badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-white rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300 flex flex-col items-center w-16">
                  <div className={`${colorClasses.bg} text-white text-xs font-medium py-1 w-full text-center uppercase`}>
                    {month}
                  </div>
                  <div className="text-slate-800 text-xl font-bold py-1 w-full text-center">
                    {day}
                  </div>
                </div>
              </div>
              
              {/* Event type badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className={`${colorClasses.bgLight} px-3 py-1 rounded-full`}>
                  <span className={`text-xs font-medium ${colorClasses.text}`}>{eventType.name}</span>
                </div>
              </div>
              
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {event.imageUrl ? (
                  <div className="relative h-full w-full">
                    <Image 
                      src={event.imageUrl} 
                      alt={event.title} 
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=Event+Image';
                      }}
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="relative p-6 flex-grow flex flex-col">
                <h3 className={`text-xl font-bold text-slate-800 mb-3 ${colorClasses.hover} transition-colors`}>
                  {event.title}
                </h3>
                
                <div className="flex items-center text-slate-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${colorClasses.text} mr-2 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{event.location}</span>
                </div>
                
                {event.description && (
                  <div className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {event.description.replace(/<[^>]*>/g, '')}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                  <div className={`bg-gradient-to-r ${colorClasses.gradient} bg-size-200 bg-pos-0 group-hover:bg-pos-100 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-500 transform group-hover:scale-105`}>
                    View Details
                  </div>
                  
                  {/* Registration count if available */}
                  {event.registrationCount !== undefined && (
                    <div className="flex items-center text-xs text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>{event.registrationCount} {event.registrationCount === 1 ? 'Registration' : 'Registrations'}</span>
                    </div>
                  )}
                  
                  {/* Event date indicator */}
                  {!event.registrationCount && (
                    <div className="text-xs text-slate-500">
                      {formatDate(event.eventDate)}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
} 
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SimpleEditor from '@/app/components/ui/SimpleEditor';
import ImageUpload from '@/app/components/ui/ImageUpload';
import { useSession } from 'next-auth/react';

function EventCreator() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if not authenticated
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !eventDate || !location.trim()) {
      setError('Title, date, and location are required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          eventDate,
          location,
          imageUrl,
          isArchived: false
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create event');
      }
      
      const event = await response.json();
      router.push('/admin/events');
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Create New Event</h1>
        <Link 
          href="/admin/events" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Cancel
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <h2 className="text-lg font-medium text-blue-800">Event Details</h2>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-slate-700 mb-1">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  placeholder="Enter event location"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <SimpleEditor
                value={description}
                onChange={setDescription}
                placeholder="Enter event description"
              />
              <p className="mt-1 text-sm text-slate-500">
                Provide details about the event, agenda, speakers, etc.
              </p>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Event Image
              </label>
              <ImageUpload 
                value={imageUrl}
                onChange={setImageUrl}
              />
              <p className="mt-1 text-sm text-slate-500">
                Upload an image for the event or provide an image URL.
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
              <Link
                href="/admin/events"
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !eventDate || !location.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function NewEventPage() {
  return <EventCreator />;
} 
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Event } from '@/app/lib/models/event';
import { motion } from 'framer-motion';
import PageWrapper from '@/app/components/PageWrapper';

// Create a component that uses useParams hook
function EventContent() {
  const router = useRouter();
  const params = useParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // Function to format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventId
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit registration');
      }
      
      setFormSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        message: ''
      });
      
      // Scroll to the top of the form
      window.scrollTo({
        top: document.getElementById('registration-form')?.offsetTop || 0,
        behavior: 'smooth'
      });
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen w-full overflow-hidden">
        {/* Hero Section */}
        <div className="relative pt-40 pb-20 overflow-hidden">
          {/* Background with overlay */}
          <div className="absolute inset-0 w-full h-full z-0">
            {event && event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event?.title || "Event Details"}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
                quality={90}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/events-bg.jpg';
                }}
              />
            ) : (
              <Image
                src="/images/events-bg.jpg"
                alt="Event Details"
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
                quality={90}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/90"></div>
            
            {/* Abstract shapes */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-500 rounded-full opacity-20 blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl mx-auto"
            >
              <motion.div variants={fadeIn} className="mb-4">
                <Link 
                  href="/events" 
                  className="inline-flex items-center text-green-400 hover:text-green-300 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Events
                </Link>
              </motion.div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-600 animate-spin"></div>
                    <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-orange-500 animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                </div>
              ) : error || !event ? (
                <motion.div variants={fadeIn} className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold">Error</h3>
                  </div>
                  <p>{error || 'Event not found'}</p>
                </motion.div>
              ) : (
                <>
                  <motion.h1 
                    variants={fadeIn}
                    className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                  >
                    {event.title}
                  </motion.h1>
                  
                  <motion.div variants={fadeIn} className="flex items-center gap-3 mb-6">
                    <div className="h-1.5 w-16 bg-green-500 rounded-full"></div>
                    <div className="h-1.5 w-12 bg-orange-400 rounded-full"></div>
                    <div className="h-1.5 w-16 bg-red-500 rounded-full"></div>
                  </motion.div>
                  
                  <motion.div variants={fadeIn} className="flex flex-wrap gap-6 text-white/90">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
          
          {/* Decorative wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path 
                fill="#ffffff" 
                fillOpacity="1" 
                d="M0,64L60,80C120,96,240,128,360,122.7C480,117,600,75,720,64C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-6 relative z-10">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error || !event ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 max-w-3xl mx-auto">
              {error || 'Event not found'}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Event Details */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 mb-12"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="relative">
                    Event Details
                    <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-green-500 rounded-full"></div>
                  </span>
                </h2>
                
                <div 
                  className="prose prose-lg prose-slate max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </motion.div>
              
              {/* Registration Form */}
              <div id="registration-form" className="mt-12">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl font-bold text-slate-800 mb-6 text-center"
                >
                  Register for this Event
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {formSuccess ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 mb-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-medium">Registration Successful!</h3>
                      </div>
                      <p className="mb-6 text-lg">Thank you for registering for this event. We will contact you with more details soon.</p>
                      <button
                        onClick={() => setFormSuccess(false)}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
                      >
                        Register Another Person
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-5">
                        <h3 className="text-xl font-semibold text-white">Registration Form</h3>
                        <p className="text-green-100 text-sm mt-1">Fill in your details to secure your spot</p>
                      </div>
                      
                      <div className="p-8">
                        {formError && (
                          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{formError}</span>
                            </div>
                          </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-slate-800 bg-white"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Email Address <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-slate-800 bg-white"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-slate-800 bg-white"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="organization" className="block text-sm font-medium text-slate-700 mb-1">
                                Organization
                              </label>
                              <input
                                type="text"
                                id="organization"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-slate-800 bg-white"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                              Additional Information
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              rows={4}
                              value={formData.message}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-slate-800 bg-white"
                            />
                          </div>
                          
                          <div>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className={`w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-medium py-3 px-6 rounded-lg transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center ${
                                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                            >
                              {isSubmitting ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </span>
                              ) : (
                                <>
                                  Register Now
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h15" />
                                  </svg>
                                </>
                              )}
                            </button>
                          </div>
                          
                          <p className="text-center text-xs text-slate-500 mt-4">
                            By submitting this form, you agree to our <a href="#" className="text-green-600 hover:underline">privacy policy</a> and <a href="#" className="text-green-600 hover:underline">terms of service</a>.
                          </p>
                        </form>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </main>

        {/* Related Events Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Other Events You Might Like</h2>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-1.5 w-12 bg-green-500 rounded-full"></div>
                <div className="h-1.5 w-8 bg-orange-400 rounded-full"></div>
                <div className="h-1.5 w-12 bg-red-500 rounded-full"></div>
              </div>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Explore more opportunities to enhance your DDMRP knowledge and connect with industry experts
              </p>
            </motion.div>
            
            {/* This would typically show other events, but for now we'll just show a link */}
            <div className="text-center mt-8">
              <Link 
                href="/events" 
                className="inline-flex items-center justify-center bg-white hover:bg-green-50 text-green-600 font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200"
              >
                <span>View All Events</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

// Main page component that uses the client component with useParams
export default function EventDetailPage() {
  return <EventContent />;
} 
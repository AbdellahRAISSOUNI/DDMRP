"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/app/lib/models/event';
import PageWrapper from '@/app/components/PageWrapper';
import { motion, useScroll, useTransform } from 'framer-motion';
import EventsList from '../components/EventsList';
import Header from '../components/Header';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  
  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        // Sort by date
        const sortedEvents = data
          .filter((event: Event) => !event.isArchived)
          .sort((a: Event, b: Event) => {
            return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
          });
        
        setEvents(sortedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const filterEvents = (filter: string) => {
    setActiveFilter(filter);
    // In a real app, you would filter events here
    // For now, we'll just change the active filter state
  };

  return (
    <PageWrapper>
      <div className="min-h-screen w-full overflow-hidden">
        {/* Hero section */}
        <div 
          ref={heroRef} 
          className="relative min-h-[700px] md:min-h-[800px] pt-40 pb-20 flex items-center justify-center overflow-hidden"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/hero/supply-chain-dashboard.jpg"
              alt="DDMRP Events and Conferences"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
              quality={95}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95"></div>
            
            {/* Abstract shapes with parallax effect */}
            <motion.div 
              className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ translateY: useTransform(scrollYProgress, [0, 1], [0, 150]) }}
            ></motion.div>
            <motion.div 
              className="absolute bottom-1/4 -left-24 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ translateY: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
            ></motion.div>
            <motion.div 
              className="absolute top-1/3 right-1/3 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ translateY: useTransform(scrollYProgress, [0, 1], [0, 120]) }}
            ></motion.div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center max-w-3xl mx-auto"
              style={{ opacity, scale }}
            >
              <motion.div variants={fadeIn} className="mb-4">
                <Link 
                  href="/" 
                  className="inline-flex items-center text-green-400 hover:text-green-300 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </motion.div>
              
              <motion.div
                variants={fadeIn}
                className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white text-sm font-medium mb-6 border border-green-500/30"
              >
                Global DDMRP Network
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
              >
                Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Exchange</span> Events
              </motion.h1>
              
              <motion.div variants={fadeIn} className="flex items-center justify-center gap-3 mb-8">
                <div className="h-1.5 w-16 bg-green-500 rounded-full"></div>
                <div className="h-1.5 w-12 bg-blue-400 rounded-full"></div>
                <div className="h-1.5 w-16 bg-purple-500 rounded-full"></div>
              </motion.div>
              
              <motion.p 
                variants={fadeIn}
                className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light"
              >
                Connect with industry experts and enhance your DDMRP knowledge through our workshops, webinars, and conferences
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link 
                  href="#events-list" 
                  className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('events-list')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Explore Events</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Link>

                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-3 px-8 rounded-lg transition-all duration-300 backdrop-blur-sm"
                >
                  <span>Host an Event</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Event statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">{events.length || 0}</div>
                <div className="text-sm text-white/70">Upcoming Events</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-sm text-white/70">Expert Speakers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/70">Participants</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">10+</div>
                <div className="text-sm text-white/70">Countries</div>
              </div>
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
        <main id="events-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-6 relative z-10">
          {/* Introduction text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Join Our Global DDMRP Community</h2>
            <p className="text-slate-600 text-lg">
              Our events bring together industry leaders, practitioners, and researchers to share knowledge, 
              best practices, and innovative solutions in Demand Driven Material Requirements Planning.
            </p>
          </motion.div>
          
          {/* Filter options */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-16 flex flex-wrap gap-4 justify-center"
          >
            {['All', 'Workshops', 'Webinars', 'Conferences'].map((filter) => (
              <button 
                key={filter}
                onClick={() => filterEvents(filter)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                  activeFilter === filter 
                    ? 'bg-gradient-to-r from-green-600 to-blue-500 text-white scale-105' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-green-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-600 animate-spin"></div>
                <div className="h-16 w-16 rounded-full border-r-4 border-l-4 border-blue-500 animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 max-w-3xl mx-auto shadow-lg"
            >
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold">Error</h3>
              </div>
              <p>{error}</p>
            </motion.div>
          ) : events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center max-w-2xl mx-auto shadow-lg"
            >
              <div className="inline-flex items-center justify-center h-20 w-20 bg-slate-100 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-slate-800 mb-3">No events scheduled</h3>
              <p className="text-slate-600 max-w-md mx-auto text-lg">
                There are no upcoming events at the moment. Please check back later or subscribe to our newsletter.
              </p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Subscribe to Updates
                </Link>
              </div>
            </motion.div>
          ) : (
            <EventsList limit={events.length} />
          )}
        </main>

        {/* CTA section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl shadow-2xl"
            >
              <div className="absolute inset-0">
                <Image
                  src="/images/hero/supply-chain-dashboard.jpg"
                  alt="DDMRP Training"
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-blue-900/90"></div>
              </div>
              
              <div className="relative px-8 py-16 md:p-16 lg:p-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
                <div className="md:max-w-2xl mb-12 md:mb-0">
                  <div className="flex items-center mb-6 md:justify-start justify-center">
                    <div className="h-1.5 w-16 bg-green-500 rounded-full mr-3"></div>
                    <div className="h-1.5 w-10 bg-blue-400 rounded-full mr-3"></div>
                    <div className="h-1.5 w-16 bg-purple-500 rounded-full"></div>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">Want to host an event?</h2>
                  <p className="text-slate-200 text-lg md:text-xl max-w-2xl">
                    We're always looking for opportunities to collaborate with organizations interested in DDMRP. Contact us to discuss hosting a workshop or webinar.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center bg-white hover:bg-green-50 text-green-600 font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    <span>Contact Us</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
} 
"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/app/lib/models/course';
import PageWrapper from '@/app/components/PageWrapper';
import { motion } from 'framer-motion';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const coursesGridRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === pageRef.current) {
              setIsVisible(true);
            } else if (entry.target === calendarRef.current) {
              calendarRef.current.classList.add('animate-fade-in-up');
              calendarRef.current.classList.remove('opacity-0');
            } else if (entry.target === coursesGridRef.current) {
              coursesGridRef.current.classList.add('animate-fade-in-up');
              coursesGridRef.current.classList.remove('opacity-0');
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = [pageRef.current, calendarRef.current, coursesGridRef.current];
    elements.forEach(el => {
      if (el) observer.observe(el);
    });
    
    // Make sure elements are visible even if observer doesn't fire
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.classList.add('animate-fade-in-up');
        calendarRef.current.classList.remove('opacity-0');
      }
      if (coursesGridRef.current) {
        coursesGridRef.current.classList.add('animate-fade-in-up');
        coursesGridRef.current.classList.remove('opacity-0');
      }
    }, 500);
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        // Only show non-archived courses
        setCourses(data.filter((course: Course) => !course.isArchived));
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses by category
  const filteredCourses = filterCategory 
    ? courses.filter(course => course.program === filterCategory)
    : courses;

  // Extract unique categories
  const categories = [...new Set(courses.map(course => course.program).filter(Boolean))];

  return (
    <PageWrapper>
      <div className="min-h-screen relative" ref={pageRef}>
        {/* Hero section with parallax and image */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <Image
              src="/images/courses/course-hero.jpg"
              alt="DDMRP Training"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/70"></div>
            
            {/* Abstract shapes with parallax effect */}
            <div 
              className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            ></div>
            <div 
              className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ transform: `translateY(${scrollY * -0.03}px)` }}
            ></div>
            <div 
              className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-500 rounded-full opacity-20 blur-3xl will-change-transform" 
              style={{ transform: `translateY(${scrollY * 0.04}px)` }}
            ></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Master <span className="text-green-400">DDMRP</span> with Our Expert-Led Formations
              </h1>
              
              <div className="flex items-center justify-center gap-2 mb-8">
                {['bg-green-500', 'bg-orange-400', 'bg-red-500'].map((color, index) => (
                  <motion.div 
                    key={index}
                    className={`h-1.5 w-12 ${color} rounded-full`}
                    initial={{ width: '3rem', opacity: 1 }}
                    animate={{ width: '3rem', opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 + (index * 0.15) }}
                  ></motion.div>
                ))}
        </div>

              <motion.p 
                className="text-xl text-slate-200 mb-10"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Transform your supply chain expertise with our industry-leading certification programs
              </motion.p>
              
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <a 
                  href="#courses-grid" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Explore Formations
                </a>
                <Link 
                  href="/contact" 
                  className="inline-block bg-transparent hover:bg-white/10 text-white font-medium py-3 px-8 rounded-lg border border-white/30 backdrop-blur-sm transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Request Information
                </Link>
              </motion.div>
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
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-6 relative z-20">
        {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 shadow-lg max-w-3xl mx-auto">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-lg font-semibold text-red-800">Error</h2>
              </div>
              <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center h-24 w-24 bg-orange-50 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No courses available</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-8">
                There are no courses available at the moment. Please check back later or contact us for more information.
            </p>
              <Link 
                href="/contact" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Contact Us
              </Link>
          </div>
        ) : (
          <>
              {/* Calendar Section */}
              <div 
                ref={calendarRef}
                className="mb-24 transition-all duration-1000"
              >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                  <div className="md:max-w-2xl">
                    <span className="text-sm uppercase tracking-wider text-green-600 font-semibold">
                      Upcoming Sessions
                    </span>
                    <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-4">
                      Course Calendar
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-8 bg-green-600 rounded-full"></div>
                      <div className="h-1 w-16 bg-orange-500 rounded-full"></div>
                      <div className="h-1 w-8 bg-red-600 rounded-full"></div>
                    </div>
                    <p className="text-slate-600 max-w-2xl">
                      Plan your professional development with our upcoming DDMRP certification courses. 
                      Register early to secure your spot in these high-demand training sessions.
                    </p>
                  </div>
                  
                  <div className="mt-6 md:mt-0 flex-shrink-0">
                    <Link 
                      href="/contact?subject=Course%20Registration" 
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                      <span>Register Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
                  {/* Background image with overlay */}
                  <div className="absolute inset-0 opacity-5">
                    <Image
                      src="/images/courses/course-calendar.jpg"
                      alt="Course Calendar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="relative">
              <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                    <tr>
                            <th className="px-6 py-5 text-left font-semibold uppercase tracking-wider w-1/3 bg-gradient-to-r from-green-600 to-green-700 text-white">Date</th>
                            <th className="px-6 py-5 text-left font-semibold uppercase tracking-wider w-1/3 bg-gradient-to-r from-green-600 to-green-700 text-white">Program</th>
                            <th className="px-6 py-5 text-left font-semibold uppercase tracking-wider w-1/3 bg-gradient-to-r from-green-600 to-green-700 text-white">Instructor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {courses.map((course) => {
                      if (!course.program && !course.instructor && !course.dates) return null;
                      
                      return (
                              <tr key={course._id?.toString()} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-5 text-slate-800 whitespace-pre-line font-medium">
                            {course.dates || '-'}
                          </td>
                                <td className="px-6 py-5 text-slate-800">
                                  <div className="flex items-center">
                                    <div className="h-2 w-2 bg-green-600 rounded-full mr-2"></div>
                                    <span>{course.program || '-'}</span>
                                  </div>
                          </td>
                                <td className="px-6 py-5 text-slate-600">
                                  {course.instructor ? (
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2 text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                      </div>
                                      <span>{course.instructor}</span>
                                    </div>
                                  ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
                </div>
              </div>

              {/* Courses Grid Section */}
              <div 
                id="courses-grid"
                ref={coursesGridRef}
                className="transition-all duration-1000"
              >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                  <div className="md:max-w-2xl">
                    <span className="text-sm uppercase tracking-wider text-green-600 font-semibold">
                      Certification Programs
                    </span>
                    <h2 className="text-3xl font-bold text-slate-800 mt-2 mb-4">
                      Available Formations
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-8 bg-green-600 rounded-full"></div>
                      <div className="h-1 w-16 bg-orange-500 rounded-full"></div>
                      <div className="h-1 w-8 bg-red-600 rounded-full"></div>
                    </div>
                    <p className="text-slate-600 max-w-2xl">
                      Explore our comprehensive range of DDMRP certification courses designed to enhance your 
                      supply chain expertise and advance your career.
                    </p>
            </div>

                  {categories.length > 0 && (
                    <div className="mt-8 md:mt-0">
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setFilterCategory(null)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            filterCategory === null 
                              ? 'bg-green-600 text-white' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          All
                        </button>
                        {categories.map((category) => (
                          <button 
                            key={category} 
                            onClick={() => setFilterCategory(category || null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              filterCategory === category 
                                ? 'bg-green-600 text-white' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course, index) => (
                <Link 
                  key={course._id?.toString()} 
                  href={`/courses/${course._id}`}
                      className="group bg-white rounded-xl shadow-xl hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
                >
                      <div className="h-56 bg-slate-100 relative overflow-hidden">
                    {course.imageUrl ? (
                          <div className="relative h-full w-full">
                            <Image 
                        src={course.imageUrl} 
                        alt={course.title} 
                              fill
                              className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x300?text=Course+Image';
                        }}
                      />
                            
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                    ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                        
                        {/* Course badge */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                            <span className="text-xs font-medium text-slate-800">{course.program || 'DDMRP'}</span>
                          </div>
                        </div>
                        
                        {/* Decorative dots */}
                        <div className="absolute top-4 right-4">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                            <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                            <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                          </div>
                        </div>
                  </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-600 transition-colors">
                          {course.title}
                        </h3>
                        
                    {course.description ? (
                      <div 
                            className="text-slate-600 mb-6 line-clamp-3 text-sm flex-grow"
                        dangerouslySetInnerHTML={{ 
                          __html: course.description.length > 150 
                            ? course.description.substring(0, 150) + '...' 
                            : course.description 
                        }} 
                      />
                    ) : (
                          <p className="text-slate-500 mb-6 italic text-sm flex-grow">No description available</p>
                    )}
                        
                        {/* Course details */}
                        <div className="mt-auto">
                          {course.instructor && (
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <span className="text-sm text-slate-600">{course.instructor}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <span className="text-green-600 text-sm font-medium flex items-center">
                              View Course
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </span>
                            
                            <div className="flex space-x-1">
                              <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                              <div className="h-1.5 w-1.5 bg-orange-500 rounded-full"></div>
                              <div className="h-1.5 w-1.5 bg-red-600 rounded-full"></div>
                            </div>
                          </div>
                    </div>
                  </div>
                </Link>
              ))}
                </div>
                
                {/* CTA Section */}
                <div className="mt-20 relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0">
                    <Image
                      src="/images/courses/course-background.jpg"
                      alt="DDMRP Training"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/80"></div>
                  </div>
                  
                  <div className="relative px-6 py-12 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
                    <div className="md:max-w-2xl mb-8 md:mb-0">
                      <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your supply chain?</h2>
                      <p className="text-slate-200 text-lg">
                        Contact us today to discuss how our DDMRP expertise can help your organization achieve operational excellence.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Link 
                        href="/contact"
                        className="inline-block bg-white hover:bg-slate-100 text-green-600 font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
            </div>
          </>
        )}
      </main>
        </div>
    </PageWrapper>
  );
} 
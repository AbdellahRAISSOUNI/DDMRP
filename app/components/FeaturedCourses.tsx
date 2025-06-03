"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '../lib/models/course';

export default function FeaturedCourses() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    
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
        // Only show non-archived courses and limit to 3
        setCourses(data.filter((course: Course) => !course.isArchived).slice(0, 3));
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section 
      id="featured-courses" 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
    >
      {/* Background with diagonal pattern */}
      <div className="absolute inset-0 bg-slate-50">
        <div className="absolute inset-0 bg-white" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}></div>
        
        {/* Abstract shapes with parallax effect */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * -0.03}px)` }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-500 rounded-full opacity-5 blur-3xl will-change-transform" 
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        ></div>
        
        {/* Grid pattern overlay with parallax */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-10 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header with animated elements */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div className="md:max-w-2xl">
            <div className="overflow-hidden mb-2">
              <span 
                className="text-sm uppercase tracking-wider text-green-600 font-semibold"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                }}
              >
                Professional Development
              </span>
            </div>
            
            <div className="overflow-hidden mb-4">
              <h2 
                className="text-3xl md:text-4xl font-bold text-slate-800"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                  transitionDelay: '150ms'
                }}
              >
                Featured Courses
              </h2>
            </div>
            
            <div className="flex items-center gap-2 mb-6 overflow-hidden">
              <div 
                className="h-1 w-0 bg-green-600 rounded-full transition-all duration-1000 ease-out-expo"
                style={{ 
                  width: isVisible ? '2rem' : '0',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '300ms'
                }}
              ></div>
              <div 
                className="h-1 w-0 bg-orange-500 rounded-full transition-all duration-1000 ease-out-expo"
                style={{ 
                  width: isVisible ? '4rem' : '0',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '450ms'
                }}
              ></div>
              <div 
                className="h-1 w-0 bg-red-600 rounded-full transition-all duration-1000 ease-out-expo"
                style={{ 
                  width: isVisible ? '2rem' : '0',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '600ms'
                }}
              ></div>
            </div>
            
            <div className="overflow-hidden">
              <p 
                className="text-lg text-slate-600 max-w-2xl"
                style={{ 
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                  transitionDelay: '300ms'
                }}
              >
                Enhance your supply chain expertise with our industry-leading DDMRP courses designed to transform your operations and drive sustainable success.
              </p>
            </div>
          </div>
          
          <div
            className="mt-8 md:mt-0"
            style={{ 
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
              transitionDelay: '600ms'
            }}
          >
            <Link 
              href="/courses" 
              className="inline-flex items-center gap-2 bg-transparent hover:bg-green-50 text-green-600 font-medium py-2 px-4 border border-green-600 rounded-lg transition-colors duration-300"
            >
              <span>View All Courses</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div 
            className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-100 max-w-2xl mx-auto"
            style={{ 
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
            }}
          >
            <div className="inline-flex items-center justify-center h-20 w-20 bg-orange-50 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No courses available yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Check back soon for new courses or contact the administrator.
            </p>
            <Link 
              href="/contact" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {courses.map((course, index) => (
              <Link 
                key={course._id?.toString()} 
                href={`/courses/${course._id}`}
                className="group relative bg-white rounded-xl overflow-hidden transition-all duration-500 flex flex-col h-full"
                style={{ 
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                  transitionDelay: `${index * 150}ms`
                }}
              >
                {/* Card with hover effect */}
                <div className="absolute inset-0 shadow-lg group-hover:shadow-2xl transition-shadow duration-500"></div>
                <div className="absolute inset-0 border border-slate-200 rounded-xl group-hover:border-green-200 transition-colors duration-500"></div>
                
                <div className="relative h-48 md:h-56 bg-slate-100 overflow-hidden">
                  {course.imageUrl ? (
                    <div className="relative h-full w-full">
                      <Image 
                        src={course.imageUrl} 
                        alt={course.title} 
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
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
                      <span className="text-xs font-medium text-slate-800">DDMRP</span>
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
                
                <div className="relative p-6 flex-grow flex flex-col">
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
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-2 text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-600">{course.instructor}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="flex items-center">
                        <span className="text-green-600 text-sm font-medium mr-1">Learn More</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      
                      {/* Course level indicator */}
                      <div className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">
                        {index === 0 ? 'Advanced' : index === 1 ? 'Intermediate' : 'Beginner'}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA - only show if courses are available */}
        {!loading && courses.length > 0 && (
          <div 
            className="mt-20"
            style={{ 
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
              transitionDelay: '800ms'
            }}
          >
            <div className="relative overflow-hidden rounded-xl border border-green-100 bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent"></div>
              <div className="absolute right-0 bottom-0 -mb-12 -mr-12 w-64 h-64 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
              
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">Transform Your Supply Chain</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to take the next step?</h3>
                  <p className="text-slate-600">Explore our complete catalog of DDMRP courses and start your journey towards operational excellence with expert-led training and certification programs.</p>
                </div>
                
                <div className="flex-shrink-0">
                  <Link
                    href="/courses"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    View All Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 
"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Course } from '@/app/lib/models/course';
import InquiryForm from '@/app/components/ui/InquiryForm';
import PageWrapper from '@/app/components/PageWrapper';
import { motion } from 'framer-motion';

// Create a component that uses useParams hook
function CourseContent() {
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true); // Set to true by default
  const [scrollY, setScrollY] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (pageRef.current) observer.observe(pageRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Animation variants for Framer Motion
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

  return (
    <PageWrapper>
      <div className="min-h-screen relative" ref={pageRef}>
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : error || !course ? (
          <div className="max-w-3xl mx-auto px-4 py-32">
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-lg font-semibold text-red-800">Error</h2>
          </div>
              <p>{error || 'Course not found'}</p>
              <div className="mt-6">
              <Link 
                href="/courses" 
                  className="inline-flex items-center text-red-700 hover:text-red-800 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Courses
              </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero section with course title and image */}
            <section className="relative pt-40 pb-24 overflow-hidden">
              {/* Background image with overlay */}
              <div className="absolute inset-0">
                <Image
                  src="/images/courses/course-detail-hero.jpg"
                  alt="DDMRP Course"
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
                  className="max-w-4xl mx-auto text-center"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeIn} className="mb-4">
                    <Link 
                      href="/courses" 
                      className="inline-flex items-center text-green-400 hover:text-green-300 font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Courses
                    </Link>
                  </motion.div>
                  
                  <motion.h1 
                    variants={fadeIn}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                  >
                    {course.title}
                  </motion.h1>
                  
                  <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 mb-6">
                    {['bg-green-500', 'bg-orange-400', 'bg-red-500'].map((color, index) => (
                      <div 
                        key={index}
                        className={`h-1.5 w-12 ${color} rounded-full`}
                      ></div>
                    ))}
                  </motion.div>
                  
                  {course.program && (
                    <motion.div 
                      variants={fadeIn}
                      className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
                    >
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-white font-medium">{course.program}</span>
                    </motion.div>
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
            </section>
            
            {/* Course content */}
            <section className="pb-24 -mt-6 relative z-10" ref={contentRef}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                  {/* Course image and key info card */}
                  <div className="relative mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
                    >
                      <div className="grid md:grid-cols-2">
                        {/* Course image */}
                        <div className="relative h-72 md:h-full min-h-[320px] bg-slate-100">
                          {course.imageUrl ? (
                            <Image 
                    src={course.imageUrl} 
                    alt={course.title} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Course+Image';
                    }}
                  />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Decorative corner accent */}
                          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-green-600/20 to-transparent"></div>
                        </div>
                        
                        {/* Course key info */}
                        <div className="p-8 md:p-10 flex flex-col">
                          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                            <span className="relative">
                              Course Details
                              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-green-500 rounded-full"></div>
                            </span>
                          </h2>
                          
                          <div className="space-y-6 flex-grow">
                            {course.instructor && (
                              <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-500 mb-1">Instructor</h3>
                                  <p className="text-slate-800 font-medium">{course.instructor}</p>
                </div>
              </div>
            )}
            
                            {course.program && (
                              <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                  </svg>
                </div>
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-500 mb-1">Program</h3>
                                  <p className="text-slate-800 font-medium">{course.program}</p>
                </div>
              </div>
            )}
            
                            {course.dates && (
                              <div className="flex items-start">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-500 mb-1">Schedule</h3>
                                  <p className="text-slate-800 font-medium whitespace-pre-line">{course.dates}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Last updated</p>
                                <p className="text-sm text-slate-700">{new Date(course.updatedAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</p>
                              </div>
                              
                              <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-xs font-medium text-green-700">Certification</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Course description */}
                    <div className="lg:col-span-3 space-y-8">
            {course.description && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10"
                        >
                          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            About This Course
                          </h2>
                          
                <div 
                            className="prose prose-green max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
                        </motion.div>
                      )}
              </div>
            
                    <div className="lg:col-span-2 space-y-8">
            {/* Inquiry Form */}
                      <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="sticky top-24"
                      >
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-5">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              S'inscrire au Cours
                            </h2>
                            <p className="text-sm text-white/90 mt-1">Fill out this form and we'll contact you with more details about this course.</p>
                          </div>
              <InquiryForm courseId={course._id?.toString() || ''} />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Related courses or CTA section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="mt-16 relative overflow-hidden rounded-2xl"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src="/images/courses/course-detail-bg.jpg"
                        alt="DDMRP Training"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70"></div>
                    </div>
                    
                    <div className="relative px-8 py-16 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
                      <div className="md:max-w-2xl mb-8 md:mb-0">
                        <div className="flex items-center mb-6">
                          {['bg-green-500', 'bg-orange-400', 'bg-red-500'].map((color, index) => (
                            <div 
                              key={index}
                              className={`h-1.5 w-12 ${color} rounded-full mr-2`}
                            ></div>
                          ))}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to advance your career?</h2>
                        <p className="text-slate-200 text-lg max-w-2xl">
                          Explore our complete catalog of DDMRP courses and start your journey towards supply chain excellence today.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Link 
                          href="/courses"
                          className="inline-flex items-center bg-white hover:bg-slate-100 text-green-600 font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <span>View All Courses</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
            </div>
          </div>
            </section>
          </>
        )}
        </div>
    </PageWrapper>
  );
}

// Main page component that uses the client component with useParams
export default function CourseDetailPage() {
  return <CourseContent />;
} 
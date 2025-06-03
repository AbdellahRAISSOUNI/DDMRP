"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  const testimonials = [
    {
      id: 0,
      quote: "DDMRP Consulting transformed our supply chain operations. We reduced inventory by 35% while improving service levels. Their expertise and hands-on approach made all the difference.",
      author: "Sarah Johnson",
      title: "Supply Chain Director",
      company: "Global Manufacturing Inc.",
      avatar: "SJ"
    },
    {
      id: 1,
      quote: "The implementation process was smooth and the results exceeded our expectations. Our team is now fully equipped with the knowledge and tools to maintain a demand-driven supply chain.",
      author: "Michael Chen",
      title: "Operations Manager",
      company: "TechSolutions Ltd.",
      avatar: "MC"
    },
    {
      id: 2,
      quote: "Working with DDMRP Consulting was a game-changer for our business. Their strategic approach to inventory optimization helped us navigate market volatility with confidence.",
      author: "Elena Rodriguez",
      title: "CEO",
      company: "Innovative Logistics",
      avatar: "ER"
    }
  ];

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
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isVisible, testimonials.length]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Function to get background color based on avatar initials
  const getAvatarBgColor = (initials: string) => {
    const colors = [
      'bg-green-600',
      'bg-orange-500',
      'bg-red-600',
      'bg-blue-600',
      'bg-purple-600',
      'bg-teal-600'
    ];
    
    // Simple hash function to pick a color based on initials
    const hash = initials.charCodeAt(0) + (initials.length > 1 ? initials.charCodeAt(1) : 0);
    return colors[hash % colors.length];
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-slate-50 w-full"
    >
      {/* Background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
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
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
            style={{ 
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
            }}
          >
            Client Testimonials
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            {['bg-green-600', 'bg-orange-500', 'bg-red-600'].map((color, index) => (
              <div 
                key={index}
                className={`h-1.5 w-0 ${color} rounded-full transition-all duration-1000 ease-out-expo`}
                style={{ 
                  width: isVisible ? '3rem' : '0',
                  transitionDelay: `${index * 150}ms`,
                  opacity: isVisible ? 1 : 0
                }}
              ></div>
            ))}
          </div>
          
          <p 
            className="text-xl text-slate-600 max-w-3xl mx-auto"
            style={{ 
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
              transitionDelay: '300ms'
            }}
          >
            See what our clients say about working with us
          </p>
        </div>
        
        {/* Testimonials carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          style={{ 
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0,
            transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease-out',
            transitionDelay: '450ms'
          }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`transition-all duration-500 ease-in-out ${
                  activeTestimonial === index ? 'opacity-100 z-10' : 'opacity-0 absolute inset-0 z-0'
                }`}
              >
                <div className="grid md:grid-cols-5 items-stretch">
                  {/* Left side - Avatar */}
                  <div className="flex items-center justify-center p-8 md:col-span-2 bg-slate-50">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-bold ${getAvatarBgColor(testimonial.avatar)}`}>
                      {testimonial.avatar}
                    </div>
                  </div>
                  
                  {/* Right side - Quote */}
                  <div className="p-8 md:p-12 md:col-span-3 flex flex-col justify-center">
                    <svg className="h-10 w-10 text-green-600 mb-6 opacity-30" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    
                    <blockquote className="text-xl md:text-2xl font-medium text-slate-700 mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div>
                      <p className="font-bold text-slate-900">{testimonial.author}</p>
                      <p className="text-slate-600">{testimonial.title}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors duration-300"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors duration-300"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Dots indicator */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {testimonials.map((testimonial) => (
              <button
                key={testimonial.id}
                onClick={() => setActiveTestimonial(testimonial.id)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  activeTestimonial === testimonial.id ? 'bg-green-600' : 'bg-slate-300'
                }`}
                aria-label={`Go to testimonial ${testimonial.id + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
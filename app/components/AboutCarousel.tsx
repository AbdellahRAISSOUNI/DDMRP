"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const slides = [
    {
      id: 0,
      title: "About us",
      description: "DDMRP Consulting: Founded by industry experts, we've led supply chain transformation for over a decade. Our collaborative, hands-on approach empowers your organization to thrive with expertise and innovation.",
      image: "/images/about/team-business.jpg",
      alt: "Business team professionals in suits",
      link: "/about"
    },
    {
      id: 1,
      title: "Our services",
      description: "Services: DDMRP Implementation, Supply Chain Optimization, Strategic Alignment. Our certified consultants optimize your inventory, streamline operations, and align your supply chain with your business strategy.",
      image: "/images/about/consultant-laptop.jpg",
      alt: "Consultant working on laptop",
      link: "/about#services"
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 relative overflow-hidden bg-white"
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-slate-200">
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`transition-opacity duration-500 ${
                currentSlide === index ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
              style={{ 
                zIndex: currentSlide === index ? 10 : 0,
              }}
            >
              <div className="grid md:grid-cols-2 items-stretch">
                {/* Left side - Image */}
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover transform hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
                
                {/* Right side - Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 
                    className="text-2xl md:text-3xl font-bold text-slate-800 mb-4"
                    style={{ 
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      opacity: isVisible ? 1 : 0,
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                      transitionDelay: '300ms'
                    }}
                  >
                    {slide.title}
                  </h2>
                  
                  <p 
                    className="text-slate-600 mb-6"
                    style={{ 
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      opacity: isVisible ? 1 : 0,
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                      transitionDelay: '450ms'
                    }}
                  >
                    {slide.description}
                  </p>
                  
                  <div
                    style={{ 
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      opacity: isVisible ? 1 : 0,
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out',
                      transitionDelay: '600ms'
                    }}
                  >
                    <Link 
                      href={slide.link}
                      className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors duration-300"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors duration-300"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(slide.id)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  currentSlide === slide.id ? 'bg-green-600' : 'bg-slate-300'
                }`}
                aria-label={`Go to slide ${slide.id + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const historyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const imageReveal = {
    hidden: { opacity: 0, scale: 0.9, rotate: 2 },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
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

  const numberAnimation = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 0.8, 
      scale: 1,
      transition: { 
        duration: 1,
        ease: [0.34, 1.56, 0.64, 1], // Spring-like effect
      }
    }
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 relative overflow-hidden">
        {/* Background elements with parallax */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-24 -right-24 w-96 h-96 bg-green-500 rounded-full opacity-10 blur-3xl will-change-transform" 
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/4 -left-24 w-64 h-64 bg-orange-500 rounded-full opacity-10 blur-3xl will-change-transform" 
            style={{ transform: `translateY(${scrollY * -0.03}px)` }}
          ></div>
          <div 
            className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-500 rounded-full opacity-10 blur-3xl will-change-transform" 
            style={{ transform: `translateY(${scrollY * 0.04}px)` }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              variants={fadeIn} 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6"
            >
              About DDMRP Consulting
            </motion.h1>
            
            <motion.div variants={fadeIn} className="flex items-center justify-center gap-2 mb-8">
              {['bg-green-600', 'bg-orange-500', 'bg-red-600'].map((color, index) => (
                <motion.div 
                  key={index}
                  initial={{ width: 0 }}
                  animate={{ width: '3rem' }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.3 + (index * 0.2),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={`h-1.5 rounded-full ${color}`}
                ></motion.div>
              ))}
            </motion.div>
            
            <motion.p 
              variants={fadeIn} 
              className="text-xl md:text-2xl text-slate-600"
            >
              Transforming supply chains through innovation, expertise, and collaboration.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Decorative wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#f8fafc" 
              fillOpacity="1" 
              d="M0,64L60,80C120,96,240,128,360,122.7C480,117,600,75,720,64C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Notre Histoire (Our History) Section */}
      <motion.section 
        id="history" 
        ref={historyRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 md:py-24 bg-slate-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              variants={imageReveal}
              className="relative rounded-xl overflow-hidden shadow-xl order-2 md:order-1"
            >
              <div className="aspect-[4/3] relative">
                <Image 
                  src="/images/about/new/history.jpg" 
                  alt="DDMRP Consulting Team" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              </div>
              <motion.div 
                variants={numberAnimation}
                className="absolute bottom-6 right-6 z-10"
              >
                <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-green-600 rounded-full shadow-lg">
                  <div className="text-white text-4xl md:text-5xl font-bold">1</div>
                </div>
              </motion.div>
            </motion.div>

            <div className="space-y-6 order-1 md:order-2">
              <motion.div variants={fadeInRight} className="flex items-center mb-2">
                <div className="h-1 w-12 bg-green-600 rounded-full mr-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Notre Histoire
                </h2>
              </motion.div>
              
              <motion.div variants={fadeInRight} className="space-y-4">
                <p className="text-slate-600 text-lg">
                  Depuis ses modestes débuts à Casablanca, au Maroc, notre cabinet de formation s'est engagé à transformer les compétences et les capacités des individus et des organisations. Fondé par des experts passionnés, notre cabinet a évolué pour devenir un leader reconnu dans le domaine de la formation en Demand Driven Planner (DDP), Demand Driven Leader (DDL), Demand Driven Operational (DDO).
                </p>
                <p className="text-slate-600 text-lg">
                  Au fil des ans, nous avons aidé des milliers de professionnels à atteindre leur plein potentiel, tout en guidant les entreprises vers l'excellence opérationnelle.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInRight}
                className="mt-8 inline-block"
              >
                <Link 
                  href="/contact"
                  className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors group"
                >
                  <span>En savoir plus</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Nos Valeurs (Our Values) Section */}
      <motion.section 
        id="values" 
        ref={valuesRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 md:py-24 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <motion.div variants={fadeInLeft} className="flex items-center mb-2">
                <div className="h-1 w-12 bg-orange-500 rounded-full mr-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Nos Valeurs
                </h2>
              </motion.div>
              
              <motion.div variants={fadeInLeft} className="space-y-4">
                <p className="text-slate-600 text-lg">
                  Chez nous, l'intégrité, l'innovation et l'excellence sont au cœur de tout ce que nous faisons. Nous nous engageons à agir de manière éthique et à respecter nos engagements envers nos clients, nos partenaires et notre équipe.
                </p>
                <p className="text-slate-600 text-lg">
                  Nous encourageons la créativité et l'innovation, cherchant constamment de nouvelles façons d'améliorer nos services et de répondre aux besoins changeants du marché. Notre engagement envers l'excellence se reflète dans la qualité de nos programmes de formation et dans notre volonté de toujours viser l'excellence.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInLeft}
                className="mt-8 inline-block"
              >
                <Link 
                  href="/contact"
                  className="inline-flex items-center text-orange-500 font-medium hover:text-orange-600 transition-colors group"
                >
                  <span>En savoir plus</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            <motion.div 
              variants={imageReveal}
              className="relative rounded-xl overflow-hidden shadow-xl"
            >
              <div className="aspect-[4/3] relative">
                <Image 
                  src="/images/about/new/values-team.jpg" 
                  alt="DDMRP Team Collaboration" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              </div>
              <motion.div 
                variants={numberAnimation}
                className="absolute bottom-6 right-6 z-10"
              >
                <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-orange-500 rounded-full shadow-lg">
                  <div className="text-white text-4xl md:text-5xl font-bold">2</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Notre Éducation (Our Education) Section */}
      <motion.section 
        id="education" 
        ref={educationRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 md:py-24 bg-slate-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              variants={imageReveal}
              className="relative rounded-xl overflow-hidden shadow-xl order-2 md:order-1"
            >
              <div className="aspect-[4/3] relative">
                <Image 
                  src="/images/courses/course-detail-hero.jpg" 
                  alt="Education and Training" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              </div>
              <motion.div 
                variants={numberAnimation}
                className="absolute bottom-6 right-6 z-10"
              >
                <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-red-600 rounded-full shadow-lg">
                  <div className="text-white text-4xl md:text-5xl font-bold">3</div>
                </div>
              </motion.div>
            </motion.div>

            <div className="space-y-6 order-1 md:order-2">
              <motion.div variants={fadeInRight} className="flex items-center mb-2">
                <div className="h-1 w-12 bg-red-600 rounded-full mr-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Notre Éducation
                </h2>
              </motion.div>
              
              <motion.div variants={fadeInRight} className="space-y-4">
                <p className="text-slate-600 text-lg">
                  L'éducation est au cœur de notre mission. Nous croyons fermement que l'apprentissage continu est essentiel pour réussir dans un environnement en constante évolution. C'est pourquoi nous offrons des programmes de formation de haute qualité conçus pour répondre aux besoins spécifiques de nos clients.
                </p>
                <p className="text-slate-600 text-lg">
                  Nos formateurs expérimentés et certifiés utilisent des méthodes pédagogiques innovantes pour garantir une expérience d'apprentissage enrichissante et engageante. Que ce soit par le biais de séminaires, d'ateliers ou de sessions individuelles, nous nous engageons à fournir une éducation de classe mondiale qui inspire et transforme.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInRight}
                className="mt-8 inline-block"
              >
                <Link 
                  href="/courses"
                  className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors group"
                >
                  <span>Voir nos formations</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        id="services" 
        ref={servicesRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 md:py-24 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Our Services</h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              {['bg-green-600', 'bg-orange-500', 'bg-red-600'].map((color, index) => (
                <motion.div 
                  key={index}
                  initial={{ width: 0 }}
                  whileInView={{ width: '2rem' }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2 + (index * 0.2),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  viewport={{ once: true }}
                  className={`h-1 rounded-full ${color}`}
                ></motion.div>
              ))}
            </motion.div>
            <motion.p 
              variants={fadeIn} 
              className="text-xl text-slate-600 max-w-3xl mx-auto"
            >
              We provide comprehensive solutions to optimize your supply chain operations
            </motion.p>
          </motion.div>

          {/* Services Image Section */}
          <motion.div
            variants={imageReveal}
            className="mb-16 relative rounded-xl overflow-hidden shadow-xl"
          >
            <div className="aspect-[21/9] relative">
              <Image 
                src="/images/courses/course-detail-bg.jpg" 
                alt="DDMRP Services" 
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center max-w-2xl px-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Comprehensive DDMRP Solutions</h3>
                  <p className="text-white/90 text-lg">From implementation to optimization, we provide end-to-end support for your supply chain needs</p>
                </div>
              </div>
            </div>
            <motion.div 
              variants={numberAnimation}
              className="absolute bottom-6 right-6 z-10"
            >
              <div className="flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-full shadow-lg">
                <div className="text-white text-4xl md:text-5xl font-bold">4</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              {
                title: "DDMRP Implementation",
                description: "End-to-end implementation of Demand Driven MRP methodology, from assessment to execution and continuous improvement.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                color: "green"
              },
              {
                title: "Supply Chain Optimization",
                description: "Analysis and optimization of inventory positioning, buffer sizing, and operational workflows to maximize efficiency.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                ),
                color: "orange"
              },
              {
                title: "Strategic Alignment",
                description: "Aligning supply chain operations with business strategy to ensure sustainable growth and competitive advantage.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                color: "red"
              },
              {
                title: "Training & Certification",
                description: "Comprehensive training programs for teams at all levels, from awareness to advanced practitioner certification.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
                color: "green"
              },
              {
                title: "Software Selection",
                description: "Vendor-neutral guidance on selecting and implementing the right DDMRP-compliant software for your organization.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                color: "orange"
              },
              {
                title: "Change Management",
                description: "Structured approach to transitioning organizations from traditional planning methods to Demand Driven practices.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                color: "red"
              }
            ].map((service, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="group"
              >
                <div className={`bg-white rounded-xl p-6 md:p-8 shadow-md border border-slate-100 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
                  <div className={`absolute top-0 left-0 w-1 h-full bg-${service.color}-500 transform transition-all duration-300 group-hover:w-2`}></div>
                  <div className="mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">{service.title}</h3>
                  <p className="text-slate-600">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 md:py-24 bg-slate-50 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0">
              <Image 
                src="/images/hero/supply-chain-dashboard.jpg" 
                alt="Supply Chain Management" 
                fill
                className="object-cover"
                sizes="100vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-blue-900/80"></div>
            </div>

            <div className="px-6 py-12 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="md:max-w-2xl mb-8 md:mb-0">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your supply chain?</h2>
                <p className="text-white/90 text-lg">
                  Contact us today to discuss how our DDMRP expertise can help your organization achieve operational excellence.
                </p>
              </div>
              <div>
                <Link 
                  href="/contact"
                  className="inline-block bg-white hover:bg-slate-100 text-green-600 font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </PageWrapper>
  );
} 
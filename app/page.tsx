"use client";

import PageWrapper from './components/PageWrapper';
import Hero from './components/Hero';
import VideoSection from './components/VideoSection';
import FeaturedCourses from './components/FeaturedCourses';
import UpcomingEvents from './components/UpcomingEvents';
import AboutCarousel from './components/AboutCarousel';
import IntuitiveFlowDemo from './components/IntuitiveFlowDemo';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';

export default function Home() {
  return (
    <PageWrapper>
      <main className="min-h-screen w-full overflow-hidden">
        <Hero />
        <VideoSection />
        <AboutCarousel />
        <div id="courses">
          <FeaturedCourses />
        </div>
        <div id="events">
          <UpcomingEvents />
        </div>
        <div id="intuitive-flow">
          <IntuitiveFlowDemo />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <CallToAction />
      </main>
    </PageWrapper>
  );
}

import React from 'react';
import { Navbar } from '@/components/ui/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractivePreview } from '@/components/landing/InteractivePreview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CourseCategoriesSection } from '@/components/landing/CourseCategoriesSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { FooterSection } from '@/components/landing/FooterSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-[#00f0ff] selection:text-black">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Interactive Packet Visualizer Demo */}
      <InteractivePreview />

      {/* Features Grid */}
      <FeaturesSection />

      {/* How It Works 4-Step Pathway */}
      <HowItWorksSection />

      {/* Course Categories & Syllabus Highlights */}
      <CourseCategoriesSection />

      {/* Impact Statistics */}
      <StatsSection />

      {/* Student & Professional Testimonials */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

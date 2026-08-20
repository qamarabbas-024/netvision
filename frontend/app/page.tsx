import React from 'react';
import { Navbar } from '@/components/ui/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractivePreview } from '@/components/landing/InteractivePreview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CourseCategoriesSection } from '@/components/landing/CourseCategoriesSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { FooterSection } from '@/components/landing/FooterSection';

export default function Home() {
  return (
    <div className="min-h-screen surface-0 text-[#f4f5f7] font-sans selection:bg-[#2563eb] selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Interactive Packet Visualizer Demo */}
      <InteractivePreview />

      {/* Features Grid */}
      <FeaturesSection />

      {/* Course Categories & Syllabus Progression Roadmap */}
      <CourseCategoriesSection />

      {/* Pedagogical 4-Step Pathway */}
      <HowItWorksSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

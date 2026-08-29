import React from 'react';
import { Navbar } from '@/components/ui/Navigation';
import { HeroObservatorySection } from '@/components/landing/HeroObservatorySection';
import { FeatureBarSection } from '@/components/landing/FeatureBarSection';
import { StructuredPathwaySection } from '@/components/landing/StructuredPathwaySection';
import { CredentialAndMetricsSection } from '@/components/landing/CredentialAndMetricsSection';
import { FooterSection } from '@/components/landing/FooterSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070a10] text-[#f4f5f7] font-sans selection:bg-[#22c55e] selection:text-black">
      {/* Primary Navigation Header */}
      <Navbar />

      {/* Hero Section: 3D Network Observatory + Editorial Controls */}
      <HeroObservatorySection />

      {/* Feature Bar: 5 Interactive Capability Modules */}
      <FeatureBarSection />

      {/* Structured Learning Pathway: 7-Stage Progression Flow */}
      <StructuredPathwaySection />

      {/* Lower Section: Verifiable Credentials, Platform Metrics & CTA */}
      <CredentialAndMetricsSection />

      {/* Global Footer */}
      <FooterSection />
    </div>
  );
}

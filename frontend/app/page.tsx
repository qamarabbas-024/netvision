'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/landing/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { LiveObservatorySection } from '@/components/landing/LiveObservatorySection';
import { CurriculumSection } from '@/components/landing/CurriculumSection';
import { CertificationSection } from '@/components/landing/CertificationSection';
import { FAQSection } from '@/components/landing/FaqSection';
import { FooterSection } from '@/components/landing/FooterSection';
import { DeviceDetailsModal } from '@/components/3d/DeviceDetailsModal';
import { PacketInspectorModal } from '@/components/3d/PacketInspectorModal';
import { InteractiveTerminalModal } from '@/components/landing/InteractiveTerminalModal';
import { SignInModal } from '@/components/landing/SignInModal';
import { NetworkDevice, NetworkScenario } from '@/types/network';

export default function Home() {
  const [currentStageId] = useState(1);
  const [scenario, setScenario] = useState<NetworkScenario>('healthy');
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [inspectedPacketId, setInspectedPacketId] = useState<string | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Smooth scroll handler to curriculum section
  const handleExploreCurriculum = () => {
    const el = document.getElementById('structured-curriculum-pathway');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll handler to certifications section
  const handleScrollToCertifications = () => {
    const el = document.getElementById('certifications-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInjectFaultFromCLI = (fault: string) => {
    if (fault === 'packet_loss') setScenario('packet_loss');
    else if (fault === 'degraded') setScenario('degraded');
    else setScenario('healthy');
  };

  return (
    <div
      className="min-h-screen bg-[#0b0f17] text-[#e2e8f0] font-sans antialiased overflow-x-hidden selection:bg-[#10b981]/30 selection:text-[#34d399]"
      suppressHydrationWarning
    >
      {/* Top Navigation */}
      <Navigation
        onOpenSignIn={() => setIsSignInOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onExploreCurriculum={handleExploreCurriculum}
        onScrollToCertifications={handleScrollToCertifications}
      />

      <main>
        {/* Hero Section with 3D Network Observatory and 2x3 Feature Matrix */}
        <HeroSection
          currentStageId={currentStageId}
          scenario={scenario}
          onScenarioChange={setScenario}
          onExploreCurriculum={handleExploreCurriculum}
          onEnterInteractiveNetwork={() => setIsTerminalOpen(true)}
          onSelectDevice={setSelectedDevice}
          onPacketClick={setInspectedPacketId}
        />

        {/* The Interactive Observatory & 3 Glassmorphism Course Cards */}
        <LiveObservatorySection
          onOpenTerminal={() => setIsTerminalOpen(true)}
          scenario={scenario}
          onScenarioChange={setScenario}
        />

        {/* The Seven-Stage Mastery Pathway */}
        <CurriculumSection
          onStartLab={() => setIsTerminalOpen(true)}
        />

        {/* Prove Your Competence With Cryptographic Verification */}
        <CertificationSection
          onStartLearning={handleExploreCurriculum}
        />

        {/* Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Interactive Modals */}
      <DeviceDetailsModal
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />

      <PacketInspectorModal
        packetId={inspectedPacketId}
        onClose={() => setInspectedPacketId(null)}
      />

      <InteractiveTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onInjectFault={handleInjectFaultFromCLI}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onContinueAsGuest={() => {
          setIsSignInOpen(false);
          handleExploreCurriculum();
        }}
      />
    </div>
  );
}

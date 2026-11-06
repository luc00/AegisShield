/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TaxonomySection } from './components/TaxonomySection';
import { ThreatSimulator } from './components/ThreatSimulator';
import { LiveScanner } from './components/LiveScanner';
import { WafRulesStudio } from './components/WafRulesStudio';
import { EdgeNodesViewer } from './components/EdgeNodesViewer';
import { CaseStudiesAndProof } from './components/CaseStudiesAndProof';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import { DnsSetupModal } from './components/DnsSetupModal';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scannedDomain, setScannedDomain] = useState('');
  const [isProtectModalOpen, setIsProtectModalOpen] = useState(false);
  const [modalDomain, setModalDomain] = useState('tuosito.it');
  const [selectedPlan, setSelectedPlan] = useState('Business Armor');

  // Handle URL parameters if any (e.g., autostart, domain query)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get('domain') || params.get('scan');
    if (domainParam) {
      setScannedDomain(domainParam);
      setModalDomain(domainParam);
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScanDomainFromHero = (domain: string) => {
    setScannedDomain(domain);
    setModalDomain(domain);
    handleNavigate('scanner');
  };

  const handleOpenProtectModal = (domain?: string, plan?: string) => {
    if (domain) setModalDomain(domain);
    if (plan) setSelectedPlan(plan);
    setIsProtectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 3-Zone Navigation Header */}
      <Navbar
        onOpenProtectModal={(dom) => handleOpenProtectModal(dom || modalDomain)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section with interactive domain protect input and KPI strip */}
        <Hero
          onScanDomain={handleScanDomainFromHero}
          onOpenProtectModal={(dom) => handleOpenProtectModal(dom || modalDomain)}
        />

        {/* Attack Taxonomy: How we protect against any kind of hacker attack */}
        <TaxonomySection />

        {/* Live Attack Simulator Lab */}
        <ThreatSimulator />

        {/* Live Website Vulnerability & Security Scanner */}
        <LiveScanner
          initialDomain={scannedDomain}
          onOpenProtectModal={(dom) => handleOpenProtectModal(dom)}
        />

        {/* WAF Rules & Real-time Defense Configuration Studio */}
        <WafRulesStudio
          onOpenProtectModal={() => handleOpenProtectModal(modalDomain)}
        />

        {/* Global & European Edge PoP Nodes Status */}
        <section className="py-12 bg-white/50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EdgeNodesViewer />
          </div>
        </section>

        {/* Quantitative Case Studies & Empirical Proof */}
        <CaseStudiesAndProof />

        {/* Transparent Pricing Plans */}
        <PricingSection
          onSelectPlan={(planName) => handleOpenProtectModal(modalDomain, planName)}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenProtectModal={() => handleOpenProtectModal(modalDomain)}
      />

      {/* DNS Setup & 3-Minute Quick Protect Modal */}
      <DnsSetupModal
        isOpen={isProtectModalOpen}
        onClose={() => setIsProtectModalOpen(false)}
        initialDomain={modalDomain}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}

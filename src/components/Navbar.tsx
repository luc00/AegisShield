import React from 'react';
import { ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenProtectModal: (domain?: string) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProtectModal,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'protezioni', label: 'Protezioni' },
    { id: 'scanner', label: 'Scanner Live' },
    { id: 'simulatore', label: 'Simulatore Attacchi' },
    { id: 'regole-waf', label: 'Regole WAF' },
    { id: 'piani', label: 'Piani & Prezzi' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark with clean shield icon */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('hero');
            }}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
            aria-label="AegisShield CyberDefense Home"
          >
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/logo_transparent.png"
                alt="AegisShield Logo"
                className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(59,130,246,0.25)]"
              />
            </div>
            <span className="text-slate-900 font-extrabold tracking-tight">
              Aegis<span className="text-blue-600">Shield</span>
            </span>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Navigazione Principale">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 text-sm ${
                  activeSection === link.id
                    ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenProtectModal()}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition-all rounded-lg whitespace-nowrap shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Proteggi Sito Ora</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProtectModal();
              }}
              className="w-full py-2.5 px-4 text-center text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Proteggi Sito Ora</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

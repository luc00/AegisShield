import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenProtectModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenProtectModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 text-left">
          
          {/* Brand & Overview */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/logo_transparent.png"
                  alt="AegisShield Logo"
                  className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(59,130,246,0.25)]"
                />
              </div>
              <span className="text-slate-900 text-base font-extrabold tracking-tight">
                Aegis<span className="text-blue-600">Shield</span>
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Piattaforma di protezione perimetrale e Web Application Firewall (WAF) progettata per difendere siti web, e-commerce e API da attacchi hacker, DDoS e vulnerabilità applicative.
            </p>
            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span>Certificato ISO 27001</span>
              <span>·</span>
              <span>SOC 2 Type II</span>
              <span>·</span>
              <span>PCI-DSS Level 1</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Piattaforma & Strumenti
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('protezioni')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Tassonomia Minacce Hacker
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('scanner')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Scanner di Vulnerabilità Web
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('simulatore')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Simulatore Attacchi in Tempo Reale
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('regole-waf')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Configuratore Regole WAF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('piani')}
                  className="hover:text-blue-700 transition-colors cursor-pointer text-left"
                >
                  Piani & Prezzi
                </button>
              </li>
            </ul>
          </div>

          {/* Security Standards */}
          <div className="md:col-span-3 space-y-3">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Conformità & Normative
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>Regolamento Generale UE 2016/679 (GDPR)</li>
              <li>Direttiva NIS2 sulla Cybersecurity Europea</li>
              <li>OWASP Top 10 Core RuleSet Compliance</li>
              <li>Standard Crittografici NIST SP 800-52</li>
              <li>TLS 1.3 Strict Forward Secrecy</li>
            </ul>
          </div>

          {/* Incident Emergency hotline */}
          <div className="md:col-span-2 space-y-3">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Emergenza Hacker
            </p>
            <p className="text-slate-600 text-xs">
              Sito web attualmente sotto attacco DDoS o violazione attiva?
            </p>
            <button
              type="button"
              onClick={onOpenProtectModal}
              className="px-3.5 py-2 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 transition-colors text-xs font-semibold cursor-pointer w-full text-center"
            >
              Attivazione Rapida SOS
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AegisShield CyberDefense Inc. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Infrastruttura Anycast Globale (320 nodi)</span>
            <span>·</span>
            <span>Zero-Logging IP Privacy Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

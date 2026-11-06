import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Zap, Lock, Globe, Server } from 'lucide-react';
import { validateDomain } from '../utils/securityEngine';

interface HeroProps {
  onScanDomain: (domain: string) => void;
  onOpenProtectModal: (domain?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScanDomain, onOpenProtectModal }) => {
  const [domainInput, setDomainInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [visualMode, setVisualMode] = useState<'studio' | 'topology'>('studio');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDomain(domainInput || 'tuosito.it');
    if (!validation.isValid && domainInput) {
      setInputError(validation.error || 'Formato non valido');
      return;
    }
    setInputError(null);
    onScanDomain(validation.domain || 'tuosito.it');
  };

  const handlePresetSelect = (preset: string) => {
    setDomainInput(preset);
    setInputError(null);
    onScanDomain(preset);
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Subtle architectural dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Value Proposition & Interactive Domain Bar */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean unboxed category kicker with official logo */}
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-4">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/logo_transparent.png"
                  alt="AegisShield Logo"
                  className="w-full h-full object-contain drop-shadow-[0_1px_4px_rgba(59,130,246,0.3)]"
                />
              </div>
              <span>Cybersecurity Edge Network</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">Protezione Web Layer 3/4/7</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">Zero-Downtime WAF</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6 [text-wrap:balance]">
              Protezione perimetrale totale per qualsiasi sito web.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Blocca attacchi DDoS fino a 140 Tbps, SQL Injection, Cross-Site Scripting, bot malevoli e vulnerabilità zero-day prima che raggiungano la tua infrastruttura. Attivazione immediata senza toccare il tuo codice.
            </p>

            {/* Interactive Domain Onboarding / Scan Bar */}
            <form onSubmit={handleSubmit} className="mb-6 max-w-xl">
              <label htmlFor="domain-input" className="block text-xs font-semibold text-slate-700 mb-2">
                Inserisci l'indirizzo del tuo sito per verificare lo scudo:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <input
                    id="domain-input"
                    type="text"
                    value={domainInput}
                    onChange={(e) => {
                      setDomainInput(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="es. tuosito.it o app.azienda.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-semibold text-sm rounded-xl transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Scansiona & Proteggi</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {inputError && (
                <p className="mt-2 text-xs text-rose-600 font-medium" role="alert">
                  {inputError}
                </p>
              )}

              {/* Sample Presets to quickly test */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span className="text-slate-600">Prova subito con:</span>
                {['ecommerce-italia.it', 'portale-medico.org', 'fintech-gateway.io'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </form>

            {/* Quick Guarantees with subtle typography */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" aria-hidden="true" />
                <span>Configurazione DNS in 3 minuti</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>Zero downtime garantito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-slate-600" aria-hidden="true" />
                <span>Compatibile con qualsiasi hosting e CMS</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Focal Carrier with Interactive View Mode */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl">
              
              {/* Header Mode Selector */}
              <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500 pl-2">aegis://telemetry-preview</span>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setVisualMode('studio')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                      visualMode === 'studio'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Foto Laboratorio
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisualMode('topology')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                      visualMode === 'topology'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Schema CNAME
                  </button>
                </div>
              </div>

              {visualMode === 'studio' ? (
                /* Daylight Studio Photo */
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[420px] w-full bg-slate-100 overflow-hidden">
                  <img
                    src="/src/assets/images/bright_cyber_eng_studio_1793912327705.jpg"
                    alt="Laboratorio di ingegneria della sicurezza AegisShield con monitoraggio globale e WAF"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.classList.add('bg-gradient-to-br', 'from-white', 'via-slate-100', 'to-slate-200');
                      }
                    }}
                  />

                  {/* Real-time Defense Overlay Card (Frosted White Glass) */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-lg text-left">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <img
                            src="/assets/aistudio/logo_transparent.png"
                            alt="AegisShield Logo"
                            className="w-full h-full object-contain drop-shadow-[0_1px_4px_rgba(59,130,246,0.3)]"
                          />
                        </div>
                        <span className="font-bold text-slate-900">Aegis Core Defense Grid</span>
                      </div>
                      <span className="font-mono tabular-nums text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70">
                        MITIGATION: 100% ACTIVE
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Protezione WAF OWASP CRS:</span>
                        <span className="font-semibold text-slate-900">v4.0.0 Enforced</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Velocità di filtraggio perimetrale:</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">0.78 ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Zero-Day Hot-Patching:</span>
                        <span className="text-emerald-700 font-medium">Attivo su 320 nodi Edge</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive CNAME Blueprint Diagram */
                <div className="p-6 bg-slate-50/70 lg:h-[420px] flex flex-col justify-between text-left space-y-4">
                  <div>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                      Blueprint Instradamento Perimetrale
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Come il traffico viene schermato prima di raggiungere l'infrastruttura host
                    </p>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">CLIENT INTERNET:</span>
                        <span className="text-slate-800 font-bold">{domainInput || 'tuosito.it'}</span>
                      </div>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded">DNS QUERY</span>
                    </div>

                    <div className="p-3.5 bg-blue-50/90 rounded-xl border-2 border-blue-600/80 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-950 font-sans">
                          AEGISSHIELD ANYCAST EDGE
                        </span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                          WAF + DDOS
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 font-sans">
                        Filtraggio immediato: 0.78ms latenza · Blocca SQLi, XSS, bot e attacchi DDoS fino a 140 Tbps.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">SERVER ORIGINE (IP NASCOSTO):</span>
                        <span className="text-slate-800 font-bold">100% Protetto & Pulito</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold font-sans">
                        0 CARICO ANOMALO
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-sans">
                    Nessun downtime: il cambio CNAME si propaga senza interruzione per i visitatori legittimi.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* 4-Column Proof of Impact / KPI Strip placed below hero split */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
              140 <span className="text-blue-600 text-xl font-normal">Tbps</span>
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Capacità mitigazione Anycast L3/L4/L7
            </p>
          </div>

          <div className="space-y-1 border-l border-slate-200 pl-4">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-blue-600">
              &lt; 0.8 <span className="text-slate-700 text-xl font-normal">ms</span>
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Latenza ispezione pacchetti WAF
            </p>
          </div>

          <div className="space-y-1 border-l border-slate-200 pl-4">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
              99.999%
            </p>
            <p className="text-xs text-slate-600 font-medium">
              SLA continuità di servizio certificata
            </p>
          </div>

          <div className="space-y-1 border-l border-slate-200 pl-4">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-600">
              4.8M+
            </p>
            <p className="text-xs text-slate-600 font-medium">
              Attacchi hacker neutralizzati al giorno
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

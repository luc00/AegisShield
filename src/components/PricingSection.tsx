import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      id: 'starter',
      name: 'Starter Shield',
      audience: 'Per siti personali, blog e portali PMI',
      monthlyPrice: 39,
      annualPrice: 29,
      trafficLimit: 'Fino a 500.000 richieste / mese',
      ddosCapacity: '10 Gbps mitigazione L3/L4',
      features: [
        'Web Application Firewall standard',
        'Filtro SQL Injection e XSS base',
        'Protezione DDoS automatica fino a 10 Gbps',
        'Certificato SSL/TLS 1.3 automatico',
        'CDN globale con 45 nodi PoP',
        'Supporto standard via ticket in 24h',
      ],
      isPopular: false,
      ctaLabel: 'Attiva Starter Shield',
    },
    {
      id: 'business',
      name: 'Business Armor',
      audience: 'Per e-commerce, piattaforme SaaS e aziende',
      monthlyPrice: 119,
      annualPrice: 89,
      trafficLimit: 'Fino a 10.000.000 richieste / mese',
      ddosCapacity: '140 Tbps illimitato L3/L4/L7',
      features: [
        'WAF OWASP Core Ruleset v4.0 avanzato',
        'Mitigazione DDoS illimitata Layer 7',
        'Anti-Bot comportamentale con AI Fingerprint',
        'Virtual Patching istantaneo zero-day',
        'Geo-Blocking & Restrizione perimetrale IP/ASN',
        'Rate Limiting adattivo granulare per endpoint',
        'Supporto prioritario con SLA 2 ore',
      ],
      isPopular: true,
      ctaLabel: 'Attiva Business Armor',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Citadel',
      audience: 'Per banche, sanità e infrastrutture critiche',
      monthlyPrice: 399,
      annualPrice: 319,
      trafficLimit: 'Richieste illimitate & multi-dominio',
      ddosCapacity: '140 Tbps + protezione BGP e Anycast dedicata',
      features: [
        'Tutte le funzionalità Business Armor',
        'SOC dedicato 24/7/365 con analisti umani',
        'SLA 99.999% con garanzia risarcitoria contrattuale',
        'Canale d\'emergenza hacker prioritario (15 min SLA)',
        'Ispezione traffico API REST e GraphQL custom',
        'Audit di sicurezza e Penetration Test semestrale',
        'Account Security Manager dedicato',
      ],
      isPopular: false,
      ctaLabel: 'Richiedi Enterprise Citadel',
    },
  ];

  return (
    <section id="piani" className="py-20 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-3">
            <span>Piani Trasparenti</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">Zero Costi Nascosti</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Scegli il Livello di Protezione per il Tuo Sito.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Attivabile in 3 minuti con instradamento DNS. Nessuna installazione sul server o modifica al codice.
          </p>

          {/* Billing Cadence Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-slate-200/70 border border-slate-300/80 rounded-xl">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                !isAnnual
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fatturazione Mensile
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Fatturazione Annuale</span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch text-left">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'bg-white border-2 border-slate-900 shadow-md'
                    : 'bg-white border border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    Consigliato per Aziende
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.audience}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono tabular-nums text-slate-900">
                      €{price}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      / mese {isAnnual ? '(annuo)' : ''}
                    </span>
                  </div>

                  {/* Limits */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-800 font-medium">{plan.trafficLimit}</p>
                    <p className="text-blue-700 font-mono font-semibold text-[11px]">
                      {plan.ddosCapacity}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2.5 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Cosa include:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3.5 px-4 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                      plan.isPopular
                        ? 'bg-slate-900 hover:bg-slate-800 active:scale-98 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    <span>{plan.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

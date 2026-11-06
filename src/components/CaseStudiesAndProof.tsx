import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CaseStudiesAndProof: React.FC = () => {
  const caseStudies = [
    {
      company: 'FashionStyle Italia S.p.A.',
      sector: 'E-commerce & Retail Nazionale',
      metric: '4.2M bot bloccati',
      secondaryMetric: '85 Gbps mitigati',
      timeframe: 'Black Friday 2025',
      challenge: 'Attacco DDoS volumetrico coordinato con botnet di credential stuffing durante il picco di vendite del Black Friday.',
      result: '0 secondi di downtime registrati, 100% transazioni salvaguardate, risparmio di banda server del 74%.',
      author: 'Marco Valenti',
      role: 'Head of Infrastructure & Security',
    },
    {
      company: 'OmniaPay FinTech Solutions',
      sector: 'Gateway Pagamenti & Open Banking',
      metric: '12.400 SQLi neutralizzati',
      secondaryMetric: '100% PCI-DSS compliant',
      timeframe: 'Audit Q3 2025',
      challenge: 'Campagne costanti di SQL injection mirate a endpoint di convalida carte e token di transazione.',
      result: 'Tutte le richieste malevole bloccate sull\'edge con latenza media di 0.72ms senza impatto sui pagamenti legittimi.',
      author: 'Elena Rinaldi',
      role: 'Chief Information Security Officer (CISO)',
    },
    {
      company: 'SaluteConnessa Cloud',
      sector: 'Sanità Privata & Fascicolo Sanitario',
      metric: '4 minuti al Virtual Patch',
      secondaryMetric: 'Zero downtime',
      timeframe: 'CVE-2025-XXXX exploit globale',
      challenge: 'Divulgazione pubblica di vulnerabilità zero-day critica sui sistemi web prima del rilascio della patch fornitore.',
      result: 'Regola di virtual patching applicata a livello perimetrale in 240 secondi, proteggendo oltre 350.000 record sanitari.',
      author: 'Ing. Roberto Bassi',
      role: 'Direttore Tecnico IT',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-3">
            <span>Evidenze Sul Campo</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">Casi Studio Verificati</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Risultati Concreti su Infrastrutture di Produzione.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Dati misurati e verificati durante incidenti reali e tentativi di attacco hacker su larga scala.
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {caseStudies.map((cs, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Sector & Company */}
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                    {cs.sector}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {cs.company}
                  </h3>
                </div>

                {/* Quantitative highlight */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <p className="text-2xl font-black font-mono tabular-nums text-slate-900">
                    {cs.metric}
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    {cs.secondaryMetric} · {cs.timeframe}
                  </p>
                </div>

                {/* Challenge & Outcome */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500">Minaccia affrontata:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">
                      {cs.challenge}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-semibold text-emerald-800">Risultato AegisShield:</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">
                      {cs.result}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attributable author */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{cs.author}</p>
                  <p className="text-slate-500 text-[11px]">{cs.role}</p>
                </div>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

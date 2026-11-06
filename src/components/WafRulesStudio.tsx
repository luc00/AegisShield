import React, { useState } from 'react';
import {
  Download,
} from 'lucide-react';
import {
  SecurityRulesConfig,
  DEFAULT_SECURITY_RULES,
  calculateSecurityScore,
} from '../utils/securityEngine';
import datacenterImg from '../assets/images/bright_datacenter_corridor_1793912328121.jpg';

interface WafRulesStudioProps {
  onOpenProtectModal: () => void;
}

export const WafRulesStudio: React.FC<WafRulesStudioProps> = ({ onOpenProtectModal }) => {
  const [rules, setRules] = useState<SecurityRulesConfig>(DEFAULT_SECURITY_RULES);
  const [selectedGeoCountries, setSelectedGeoCountries] = useState<string[]>(['RU', 'KP']);

  const currentScore = calculateSecurityScore(rules, 0);

  const handleToggle = (key: keyof SecurityRulesConfig) => {
    setRules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGeoToggle = (countryCode: string) => {
    setSelectedGeoCountries((prev) => {
      const updated = prev.includes(countryCode)
        ? prev.filter((c) => c !== countryCode)
        : [...prev, countryCode];
      setRules((r) => ({ ...r, geoBlockList: updated }));
      return updated;
    });
  };

  const countries = [
    { code: 'RU', name: 'Russia' },
    { code: 'KP', name: 'Corea del Nord' },
    { code: 'CN', name: 'Cina' },
    { code: 'IR', name: 'Iran' },
    { code: 'BR', name: 'Brasile' },
    { code: 'VN', name: 'Vietnam' },
  ];

  const exportRulesJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(rules, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'aegisshield-waf-rules.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section id="regole-waf" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-3">
            <span>Pannello di Controllo WAF</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">Regole Dinamiche</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Configuratore Regole WAF & Resilienza Perimetrale.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Personalizza i moduli di filtraggio dei pacchetti in tempo reale. Ogni regola viene distribuita istantaneamente sui 320 nodi Edge globali con propagazione in meno di 2 secondi.
          </p>
        </div>

        {/* Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Toggles & Sliders */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Rule 1: OWASP Core Ruleset */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">OWASP Core Ruleset (CRS v4.0)</span>
                  <span className="text-[10px] font-mono text-blue-700 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                    PARANOIA LEVEL 2
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ispezione di protocollo avanzata contro SQLi, Remote Code Execution, PHP injection e anomalie HTTP.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('owaspCoreRules')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rules.owaspCoreRules ? 'bg-slate-900' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={rules.owaspCoreRules}
                aria-label="Attiva OWASP Core Ruleset"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    rules.owaspCoreRules ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Rule 2: DDoS Rate Limiting */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Mitigazione DDoS & Rate Limiting L7</span>
                    <span className="text-[10px] font-mono text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      AUTO-SCALING
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Soglia massima di richieste per singolo IP prima dell'attivazione della mitigazione volumetrica.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('ddosMitigation')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rules.ddosMitigation ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={rules.ddosMitigation}
                  aria-label="Attiva mitigazione DDoS"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      rules.ddosMitigation ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {rules.ddosMitigation && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
                    <span>Soglia Rate Limit per IP:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {rules.rateLimitThreshold} req / minuto
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="600"
                    step="10"
                    value={rules.rateLimitThreshold}
                    onChange={(e) =>
                      setRules({ ...rules, rateLimitThreshold: Number(e.target.value) })
                    }
                    className="w-full accent-slate-900 bg-slate-200 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Rule 3: Virtual Patching Zero-Day */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Virtual Patching & Zero-Day Shield</span>
                  <span className="text-[10px] font-mono text-purple-700 font-semibold px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
                    CVE HOTPATCH
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Applica patch virtuali a livello WAF per vulnerabilità note e zero-day senza attendere aggiornamenti del CMS.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('virtualPatching')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rules.virtualPatching ? 'bg-slate-900' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={rules.virtualPatching}
                aria-label="Attiva Virtual Patching"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    rules.virtualPatching ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Rule 4: Anti-Bot & Scraper Shield */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4">
              <div className="space-y-1 text-left">
                <span className="text-sm font-bold text-slate-900">Anti-Bot & Challenge Crittografica Trasparente</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Blocca scraper headless, botnet di scraping prezzi e tentativi di credential stuffing con challenge JS invisibile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('botProtection')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rules.botProtection ? 'bg-slate-900' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={rules.botProtection}
                aria-label="Attiva Anti-Bot"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    rules.botProtection ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Rule 5: Geo-Fencing & ASN Block */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-left">
              <div>
                <span className="text-sm font-bold text-slate-900">Geo-Fencing & Blocco Geografico Nazioni</span>
                <p className="text-xs text-slate-600 mt-1">
                  Seleziona i paesi da cui bloccare qualsiasi richiesta in arrivo a livello perimetrale:
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {countries.map((c) => {
                  const isBlocked = selectedGeoCountries.includes(c.code);
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleGeoToggle(c.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isBlocked
                          ? 'bg-rose-50 text-rose-800 border border-rose-300 font-semibold'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-[11px] font-sans">({c.name})</span>
                      {isBlocked && <span className="text-rose-600 font-bold">×</span>}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Defense Scorecard & Bright Datacenter Corridor Visual */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Scorecard Box */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Indice di Protezione WAF Attivo
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calcolato dinamicamente sulle regole selezionate
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                    {currentScore}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentScore >= 90
                      ? 'bg-slate-900'
                      : currentScore >= 70
                      ? 'bg-blue-600'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${currentScore}%` }}
                />
              </div>

              {/* Posture Status */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">OWASP CRS v4:</span>
                  <span className={rules.owaspCoreRules ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                    {rules.owaspCoreRules ? 'Protetto' : 'Disabilitato'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">DDoS Layer 7:</span>
                  <span className={rules.ddosMitigation ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                    {rules.ddosMitigation ? 'Mitigazione Attiva' : 'Disabilitato'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Zero-Day Hotpatch:</span>
                  <span className={rules.virtualPatching ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                    {rules.virtualPatching ? 'Attivo' : 'Spento'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Paesi in Geo-Block:</span>
                  <span className="text-slate-900 font-mono font-semibold">{selectedGeoCountries.join(', ') || 'Nessuno'}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onOpenProtectModal}
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-xs text-center cursor-pointer"
                >
                  Applica Regole al Tuo Sito
                </button>
                <button
                  type="button"
                  onClick={exportRulesJson}
                  className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
                  title="Esporta configurazione JSON"
                >
                  <Download className="w-4 h-4" />
                  <span>Esporta</span>
                </button>
              </div>
            </div>

            {/* Datacenter Infrastructure Reality Card with bright photo */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                <img
                  src={datacenterImg}
                  alt="Infrastruttura data center europea luminosa e moderna"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('/assets/images/bright_datacenter_corridor_1793912328121.jpg')) {
                      target.src = '/assets/images/bright_datacenter_corridor_1793912328121.jpg';
                    }
                  }}
                />
                <div className="p-3 bg-white border-t border-slate-100 text-xs text-left">
                  <p className="font-bold text-slate-900">Rete Edge Anycast Europea</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    320 punti di presenza (PoP) nei principali Internet Exchange europei (MIX Milano, DE-CIX Francoforte, LINX Londra).
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

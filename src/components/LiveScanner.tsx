import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Download,
  Copy,
  Check,
  Code2,
  FileText,
} from 'lucide-react';
import {
  validateDomain,
  analyzeSiteVulnerabilities,
  generateSecurityHeadersSnippet,
  generateMarkdownAuditReport,
} from '../utils/securityEngine';

interface LiveScannerProps {
  initialDomain?: string;
  onOpenProtectModal: (domain: string) => void;
}

export const LiveScanner: React.FC<LiveScannerProps> = ({
  initialDomain = '',
  onOpenProtectModal,
}) => {
  const [domain, setDomain] = useState(initialDomain || 'mio-ecommerce.it');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanResult, setScanResult] = useState<ReturnType<typeof analyzeSiteVulnerabilities> | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [selectedServerSnippet, setSelectedServerSnippet] = useState<'nginx' | 'caddy' | 'cloudflare'>('nginx');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const scanSteps = [
    'Risoluzione DNS & Ispezione hop di instradamento...',
    'Verifica resilienza volumetrica DDoS Layer 3/4/7...',
    'Analisi perimetrale WAF e test iniezioni OWASP Top 10...',
    'Controllo crittografia TLS 1.3 e intestazioni HTTP di sicurezza...',
    'Audit protezione botnet, brute-force e rate-limiting...',
  ];

  const handleStartScan = (targetDomain?: string) => {
    const rawTarget = targetDomain || domain;
    const validation = validateDomain(rawTarget);
    const domainToScan = validation.isValid ? validation.domain : 'tuosito.it';

    setDomain(domainToScan);
    setIsScanning(true);
    setScanStep(0);
    setHasScanned(false);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < scanSteps.length) {
        setScanStep(currentStep);
      } else {
        clearInterval(interval);
        const result = analyzeSiteVulnerabilities(domainToScan);
        setScanResult(result);
        setIsScanning(false);
        setHasScanned(true);
      }
    }, 350);
  };

  useEffect(() => {
    if (initialDomain) {
      handleStartScan(initialDomain);
    }
  }, [initialDomain]);

  const filteredFindings = scanResult?.findings.filter((f) => {
    if (selectedSeverity === 'ALL') return true;
    return f.severity === selectedSeverity;
  });

  const handleCopySnippet = () => {
    const snippet = generateSecurityHeadersSnippet(selectedServerSnippet, domain);
    navigator.clipboard?.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!scanResult) return;
    const reportMd = generateMarkdownAuditReport(domain, scanResult);
    const blob = new Blob([reportMd], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AegisShield_Audit_${domain}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="scanner" className="py-20 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-3">
            <span>Diagnostica Web Gratuita</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">Scanner Vulnerabilità Esterno</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Scanner di Vulnerabilità e Postura di Difesa.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Analizza in pochi secondi l'esposizione del tuo sito web agli attacchi hacker più aggressivi: scopri se il tuo server è vulnerabile a blocchi DDoS, script injection o furto di dati.
          </p>
        </div>

        {/* Input Bar */}
        <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-4xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStartScan();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Inserisci dominio (es. portale.it o app.azienda.com)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scansione in corso...</span>
                </>
              ) : (
                <>
                  <span>Avvia Analisi Sicurezza</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick presets */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span className="text-slate-600">Dominio di esempio rapido:</span>
            {['shop-abbigliamento.it', 'studio-legale-cloud.com', 'saas-analytics.eu'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setDomain(p);
                  handleStartScan(p);
                }}
                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Scanning in progress state */}
        {isScanning && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center max-w-4xl mx-auto space-y-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-900">
              {scanSteps[scanStep]}
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-md mx-auto">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Interrogazione nodi Aegis Anycast in corso...
            </p>
          </div>
        )}

        {/* Scan Results view */}
        {hasScanned && scanResult && !isScanning && (
          <div className="space-y-6 max-w-5xl">
            {/* Scorecard Hero Strip */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
              
              {/* Score badge */}
              <div className="md:col-span-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-2xl font-black font-mono text-rose-700">
                    {scanResult.overallGrade}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {scanResult.score}/100
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Postura: {scanResult.domain}
                  </h3>
                  <p className="text-xs text-rose-700 font-semibold mt-0.5">
                    Vulnerabile a DDoS e iniezioni
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Durata scansione: {scanResult.scanDurationSec}s
                  </p>
                </div>
              </div>

              {/* Potential with AegisShield */}
              <div className="md:col-span-5 border-y md:border-y-0 md:border-x border-slate-200 py-3 md:py-0 md:px-6">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Con AegisShield Attivo: Grado A+ (100/100)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Attivando il proxy inverso CNAME, tutte le 5 vulnerabilità rilevate vengono schermate all'edge prima di raggiungere il server.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-3 flex flex-col gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => onOpenProtectModal(scanResult.domain)}
                  className="w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Attiva Scudo Subito</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Scarica Report (.md)</span>
                </button>
              </div>

            </div>

            {/* Severity Filter Tabs */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200/80 rounded-xl">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedSeverity === sev
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sev === 'ALL' ? 'Tutte le Vulnerabilità' : sev}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {filteredFindings?.length} riscontri rilevati
              </span>
            </div>

            {/* Findings List */}
            <div className="space-y-3">
              {filteredFindings?.map((finding) => {
                const isExpanded = expandedFinding === finding.id;
                return (
                  <div
                    key={finding.id}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    <div
                      onClick={() => setExpandedFinding(isExpanded ? null : finding.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                            finding.severity === 'CRITICAL'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : finding.severity === 'HIGH'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : finding.severity === 'MEDIUM'
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {finding.severity}
                        </span>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {finding.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Categoria: {finding.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-blue-700 font-medium hidden sm:inline-block">
                          {isExpanded ? 'Nascondi dettagli' : 'Come Aegis protegge'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/70 space-y-3 text-left">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">Descrizione rischio:</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {finding.description}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200/80 flex items-start gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-semibold text-blue-900">Risoluzione automatica AegisShield:</span>
                            <p className="text-slate-700 mt-0.5">
                              {finding.howAegisProtects}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ready-to-Copy Production Security Headers Generator */}
            <div className="mt-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <Code2 className="w-4 h-4" />
                    <span>Strumento Tecnico per Sviluppatori & DevOps</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    Generatore Intestazioni di Sicurezza (HSTS, CSP, Permissions-Policy)
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  {(['nginx', 'caddy', 'cloudflare'] as const).map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => setSelectedServerSnippet(srv)}
                      className={`px-2.5 py-1 text-xs font-mono font-semibold rounded cursor-pointer transition-colors ${
                        selectedServerSnippet === srv
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {srv.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  {generateSecurityHeadersSnippet(selectedServerSnippet, domain)}
                </pre>
                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-sans flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-xs"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiato!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copia Snippet</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

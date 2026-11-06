import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Flame,
  Bug,
  KeyRound,
  Cpu,
  Layers,
  ArrowRight,
  Server,
  Lock,
  Globe,
} from 'lucide-react';

export const TaxonomySection: React.FC = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const categories = [
    {
      id: 'volumetric',
      title: 'Attacchi Volumetrici & DDoS',
      icon: Flame,
      summary: 'Assorbimento immediato di picchi massivi di traffico fino a 140 Tbps.',
      threats: [
        { name: 'SYN Flood & UDP Reflection', desc: 'Saturazione della banda di rete del server con pacchetti spuri ad alta frequenza.' },
        { name: 'HTTP Flood Layer 7', desc: 'Migliaia di richieste HTTP per secondo mirate a endpoint pesanti come /search o /cart.' },
        { name: 'HTTP/2 Rapid Reset (CVE-2023-44487)', desc: 'Generazione continua di frame RST_STREAM per causare denial of service immediato.' },
        { name: 'Slowloris & Slow Read Attack', desc: 'Mantenimento di connessioni HTTP aperte per esaurire il pool thread del server Apache/NGINX.' },
      ],
      shieldMechanism: 'La rete globale Anycast di AegisShield distribuisce il carico su 320 nodi planetari. Il traffico malevolo viene scartato al confine della rete con filtri BGP Flowspec senza mai raggiungere l\'IP del tuo hosting.',
    },
    {
      id: 'injection',
      title: 'Attacchi Applicativi & Injection',
      icon: Bug,
      summary: 'Ispezione semantica di ogni query, parametro e cookie con motore OWASP CRS v4.',
      threats: [
        { name: 'SQL Injection (SQLi)', desc: 'Manipolazione delle query SQL sul database per bypassare login o estrarre carte di credito.' },
        { name: 'Cross-Site Scripting (XSS)', desc: 'Iniezione di payload JS nel browser dei clienti per sottrarre cookie e sessioni.' },
        { name: 'Server-Side Request Forgery (SSRF)', desc: 'Costrizione del server a inviare richieste verso risorse interne cloud (es. metadati AWS).' },
        { name: 'Remote Code Execution (RCE)', desc: 'Esecuzione non autorizzata di comandi di sistema shell all\'interno del server web.' },
      ],
      shieldMechanism: 'AegisShield WAF decodifica ed esegue il parsing semantico di payload multipli (Gzip, Base64, JSON, GraphQL) a meno di 1 millisecondo di latenza, neutralizzando i comandi dannosi prima che vengano interpretati.',
    },
    {
      id: 'auth_bots',
      title: 'Botnet & Furto Credenziali',
      icon: KeyRound,
      summary: 'Riconoscimento comportamentale di scraper e bot senza disturbare i visitatori umani.',
      threats: [
        { name: 'Credential Stuffing', desc: 'Botnet che testano liste di milioni di password sottratte da leak web per violare account.' },
        { name: 'Inventory & Cart Sniping', desc: 'Script automatizzati che svuotano scorte nei negozi online in pochi millisecondi.' },
        { name: 'Web Scraping Non Autorizzato', desc: 'Estrazione massiva di listini prezzi, database annunci o proprietà intellettuale.' },
        { name: 'Account Takeover (ATO)', desc: 'Attacchi mirati per sottrarre profili utente e credenziali amministrative.' },
      ],
      shieldMechanism: 'Verifica crittografica invisibile (JavaScript Proof-of-Work Challenge) che distingue un browser reale da simulatori headless tipo Puppeteer o Python, senza mostrare fastidiosi CAPTCHA agli utenti.',
    },
    {
      id: 'zeroday',
      title: 'Zero-Day & Vulnerabilità CMS',
      icon: Cpu,
      summary: 'Protezione attiva per falle non ancora scoperte o patchate su WordPress, Laravel, Drupal.',
      threats: [
        { name: 'Vulnerabilità Plugin & Temi CMS', desc: 'Bug non corretti in estensioni di terze parti usate su WordPress, WooCommerce, Magento.' },
        { name: 'Falle Framework Zero-Day', desc: 'Exploit divulgati prima del rilascio di una patch ufficiale da parte dei produttori.' },
        { name: 'Supply Chain Injection', desc: 'Compromissione di librerie open-source importate nei pacchetti npm o Composer.' },
        { name: 'Directory Traversal (/etc/passwd)', desc: 'Accesso illegittimo a file di configurazione, credenziali di database e chiavi private.' },
      ],
      shieldMechanism: 'Virtual Patching: quando una nuova CVE viene scoperta a livello mondiale, il team di ricerca AegisShield applica una regola di blocco globale sull\'edge entro 15 minuti, proteggendo il tuo sito prima che tu debba aggiornare.',
    },
  ];

  const currentCategory = categories[activeCategoryIndex];
  const Icon = currentCategory.icon;

  return (
    <section id="protezioni" className="py-20 bg-slate-50/50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-3">
            <span>Matrice Completa di Copertura</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">Tassonomia Minacce</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Come Proteggiamo da Qualsiasi Tipo di Attacco Hacker.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Nessun punto cieco nella difesa: dai tentativi di saturazione di banda fino agli exploit più sofisticati dell'application layer.
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {categories.map((cat, idx) => {
            const CatIcon = cat.icon;
            const isCurrent = activeCategoryIndex === idx;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryIndex(idx)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-28 shadow-2xs ${
                  isCurrent
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <CatIcon
                  className={`w-5 h-5 ${
                    isCurrent ? 'text-blue-400' : 'text-slate-500'
                  }`}
                />
                <span
                  className={`text-xs sm:text-sm font-bold leading-tight ${
                    isCurrent ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {cat.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Category View */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Threats Covered in this category */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-blue-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  {currentCategory.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                {currentCategory.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentCategory.threats.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1"
                >
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{t.name}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* How Aegis Protects */}
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Meccanismo di Protezione AegisShield:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentCategory.shieldMechanism}
              </p>
            </div>
          </div>

          {/* Clean Architectural Network Topology Diagram */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4 text-left">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-900">Topologia di Difesa Perimetrale</span>
                <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  REVERSE PROXY CNAME
                </span>
              </div>

              {/* Step 1: Internet Traffic */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>1. Richieste Utenti & Attacchi Hacker</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">HTTP/2, HTTPS</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Traffico globale instradato verso il DNS di AegisShield tramite CNAME.
                </p>
              </div>

              <div className="flex justify-center text-slate-400">
                ↓
              </div>

              {/* Step 2: AegisShield Edge Layer */}
              <div className="p-3.5 bg-blue-50/90 rounded-xl border-2 border-blue-500/80 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <img
                        src="/assets/aistudio/logo_transparent.png"
                        alt="Logo"
                        className="w-full h-full object-contain drop-shadow-[0_1px_4px_rgba(59,130,246,0.3)]"
                      />
                    </div>
                    <span>2. Scudo Perimetrale AegisShield</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                    ISPEZIONE 0.8ms
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>• Filtraggio DDoS L3/L4 Anycast:</span>
                    <span className="text-emerald-700 font-semibold">140 Tbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Ispezione WAF OWASP v4 (SQLi / XSS):</span>
                    <span className="text-emerald-700 font-semibold">Blocco automatico</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Sfida Crittografica Bot Scraper:</span>
                    <span className="text-emerald-700 font-semibold">Invisibile</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-slate-400">
                ↓
              </div>

              {/* Step 3: Origin Server */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-600" />
                    <span>3. Il Tuo Server di Origine (Host / Cloud)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    100% SICURO
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Riceve solo traffico legittimo, pulito e sanificato. Zero carichi CPU anomali.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

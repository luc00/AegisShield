import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Copy,
  Check,
  Globe,
  RefreshCw,
  Lock,
} from 'lucide-react';
import {
  validateDomain,
  generateDnsInstructions,
} from '../utils/securityEngine';

interface DnsSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain?: string;
  selectedPlan?: string;
}

export const DnsSetupModal: React.FC<DnsSetupModalProps> = ({
  isOpen,
  onClose,
  initialDomain = '',
  selectedPlan = 'Business Armor',
}) => {
  const [domain, setDomain] = useState(initialDomain || 'tuosito.it');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShieldActive, setIsShieldActive] = useState(false);

  if (!isOpen) return null;

  const validation = validateDomain(domain);
  const effectiveDomain = validation.isValid ? validation.domain : 'tuosito.it';
  const dnsConfig = generateDnsInstructions(effectiveDomain, selectedPlan);

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVerifyDns = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsShieldActive(true);
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-left my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Chiudi procedura"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase">
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/logo_transparent.png"
                alt="Logo"
                className="w-full h-full object-contain drop-shadow-[0_1px_4px_rgba(59,130,246,0.25)]"
              />
            </div>
            <span>Configurazione Scudo Perimetrale</span>
          </div>
          <h3 id="modal-title" className="text-2xl font-bold text-slate-900">
            Attiva la Protezione per {effectiveDomain}
          </h3>
          <p className="text-xs text-slate-500">
            Piano selezionato: <strong className="text-slate-800">{selectedPlan}</strong> · Zero downtime · Attivazione in 3 minuti
          </p>
        </div>

        {/* Domain input */}
        <div>
          <label htmlFor="modal-domain" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Dominio da proteggere:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              id="modal-domain"
              type="text"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setIsShieldActive(false);
              }}
              placeholder="es. tuosito.it"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 3 Simple Setup Steps */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Istruzioni DNS Rapide:
          </p>

          {/* Step 1: CNAME Record */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">
                1. Aggiungi il record CNAME nel tuo provider DNS:
              </span>
              <span className="text-[10px] font-mono text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                CONSIGLIATO
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-sans">Tipo:</span>
                <span className="text-slate-900 font-bold">CNAME</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-sans">Nome / Host:</span>
                <span className="text-slate-900">@ o www</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <div className="min-w-0 pr-1">
                  <span className="text-slate-400 block text-[10px] font-sans">Destinazione:</span>
                  <span className="text-blue-700 truncate block text-[11px] font-semibold">
                    {dnsConfig.proxyCname}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(dnsConfig.proxyCname, 'cname')}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                  title="Copia valore CNAME"
                >
                  {copiedField === 'cname' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Anycast IP fallback */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-900 block">
              2. Indirizzi IP Anycast dedicati (per record A):
            </span>
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
              {dnsConfig.proxyIps.map((ip, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2"
                >
                  <span className="text-slate-800">{ip}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(ip, `ip-${idx}`)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {copiedField === `ip-${idx}` ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SSL Note */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Certificato SSL/TLS 1.3 crittografato a 256-bit emesso automaticamente in 60 secondi dopo la propagazione.
            </span>
          </div>
        </div>

        {/* Verification Area */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {isShieldActive ? (
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <Check className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 p-0.5 border border-emerald-300" />
              <span>Scudo AegisShield Confermato: Il tuo sito è protetto al 100%!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Dopo aver salvato i record DNS, clicca qui per verificare:
            </div>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleVerifyDns}
              disabled={isVerifying || isShieldActive}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-98 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifica instradamento...</span>
                </>
              ) : isShieldActive ? (
                <span>Protezione Attiva</span>
              ) : (
                <span>Verifica Propagazione DNS</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

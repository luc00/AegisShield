import React, { useState } from 'react';
import { Server, Activity, ShieldCheck, Globe, Wifi } from 'lucide-react';
import { getEdgeNodesStatus, EdgeNodeStatus } from '../utils/securityEngine';

export const EdgeNodesViewer: React.FC = () => {
  const [nodes] = useState<EdgeNodeStatus[]>(getEdgeNodesStatus());
  const [selectedNodeId, setSelectedNodeId] = useState<string>('edge-it-mxp');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Wifi className="w-3.5 h-3.5" />
            <span>Rete Edge Anycast Europea & Globale</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Presenza Perimetrale & Punti di Interconnessione (PoP)
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>320 Nodi Anycast Operativi</span>
        </div>
      </div>

      {/* Node selector tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">{node.city}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums ${
                    isSelected ? 'text-blue-300' : 'text-emerald-700 font-semibold'
                  }`}
                >
                  {node.latencyMs}ms
                </span>
              </div>
              <p
                className={`text-[10px] truncate mt-0.5 ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {node.country}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[10px] font-sans">Internet Exchange:</span>
          <span className="text-slate-900 font-bold font-sans text-xs">{selectedNode.internetExchange}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-sans">Latenza Ispezione:</span>
          <span className="text-blue-700 font-bold tabular-nums text-sm">{selectedNode.latencyMs} ms</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-sans">Attacchi Bloccati (24h):</span>
          <span className="text-slate-900 font-bold tabular-nums text-sm">
            {selectedNode.blockedAttacks24h.toLocaleString('it-IT')}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-sans">Capacità Portata Node:</span>
          <span className="text-emerald-700 font-bold tabular-nums text-sm">
            {selectedNode.capacityTbps} Tbps
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Evidence, EvidenceCategory, SuspectId } from '../types/case';
import { ShieldAlert, FileText, Cpu, Eye, Clock, Lock, Sparkles, ChevronRight, Search, CheckCircle } from 'lucide-react';
import { sound } from '../services/audioService';

interface EvidencePanelProps {
  evidenceList: Evidence[];
  unlockedEvidenceIds: string[];
  onInspectEvidence: (evidence: Evidence) => void;
  activeEvidenceId?: string;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidenceList,
  unlockedEvidenceIds,
  onInspectEvidence,
  activeEvidenceId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: Array<{ key: string; label: string; icon: React.ReactNode }> = [
    { key: 'ALL', label: 'All', icon: <Search className="w-3 h-3" /> },
    { key: 'PHYSICAL', label: 'Physical', icon: <ShieldAlert className="w-3 h-3" /> },
    { key: 'DIGITAL', label: 'Digital', icon: <Cpu className="w-3 h-3" /> },
    { key: 'TESTIMONY', label: 'Testimony', icon: <FileText className="w-3 h-3" /> },
  ];

  const filteredEvidence = evidenceList.filter((ev) => {
    if (selectedCategory === 'ALL') return true;
    return ev.category === selectedCategory;
  });

  const unlockedCount = evidenceList.filter(e => unlockedEvidenceIds.includes(e.id)).length;

  const handleInspect = (ev: Evidence) => {
    sound.playEvidenceChime();
    onInspectEvidence(ev);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1017] border-l border-[#1f2533] select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-[#1f2533] bg-[#111520] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono-code uppercase tracking-wider text-slate-400 font-semibold">
            Evidence Locker
          </h2>
          <p className="text-[11px] text-slate-500">
            {unlockedCount} of {evidenceList.length} leads uncovered
          </p>
        </div>
        <div className="text-[11px] font-mono-code text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
          Forensics
        </div>
      </div>

      {/* Category Tabs */}
      <div className="p-2 border-b border-[#1a202d] bg-[#0c0f16] flex gap-1 overflow-x-auto no-scrollbar">
        {categories.map((cat: { key: string; label: string; icon: React.ReactNode }) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-code flex items-center gap-1 transition-all shrink-0 ${
              selectedCategory === cat.key
                ? 'bg-[#1e2535] text-[#d4af37] border border-[#d4af37]/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#151922]'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Evidence Cards List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {filteredEvidence.map((ev) => {
          const isUnlocked = unlockedEvidenceIds.includes(ev.id);
          const isSelected = activeEvidenceId === ev.id;

          if (!isUnlocked) {
            return (
              <div
                key={ev.id}
                className="p-3 rounded-xl border border-[#1b202c] bg-[#0f121a]/60 text-slate-600 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#141822] border border-slate-800 flex items-center justify-center text-slate-600">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono-code text-slate-500 uppercase">
                      Undiscovered Lead
                    </span>
                    <p className="text-[11px] text-slate-600">Interrogate suspects to uncover</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono-code text-slate-700 uppercase">
                  {ev.category}
                </span>
              </div>
            );
          }

          return (
            <div
              key={ev.id}
              onClick={() => handleInspect(ev)}
              className={`p-3 rounded-xl cursor-pointer border transition-all text-left group relative overflow-hidden ${
                isSelected
                  ? 'bg-[#181f2d] border-[#d4af37] shadow-lg ring-1 ring-[#d4af37]/40'
                  : 'bg-[#111520] hover:bg-[#151b28] border-[#1e2535] hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[#1c2230] text-[#d4af37] border border-[#d4af37]/25 uppercase font-medium">
                  {ev.category}
                </span>
                <span className="text-[10px] font-mono-code text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {ev.timeDiscovered || 'Found'}
                </span>
              </div>

              <h3 className="text-xs font-semibold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-1 mb-1">
                {ev.name}
              </h3>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans mb-2">
                {ev.description}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-500 pt-1.5 border-t border-[#1b2230]">
                <span>{ev.relatedSuspects.length} Suspect(s) linked</span>
                <span className="text-[#d4af37] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Inspect Forensics <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

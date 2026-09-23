import React, { useState } from 'react';
import { Suspect, SuspectId } from '../types/case';
import { Users, X, HeartHandshake, ShieldCheck, AlertCircle, Eye } from 'lucide-react';

interface RelationshipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspects: Record<SuspectId, Suspect>;
}

export const RelationshipsModal: React.FC<RelationshipsModalProps> = ({
  isOpen,
  onClose,
  suspects,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<SuspectId>('evelyn_blackwood');

  if (!isOpen) return null;

  const currentSuspect = suspects[selectedSuspectId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-[#10141d] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#202738] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#181e2b] border border-amber-400/40 flex items-center justify-center text-[#d4af37]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-slate-100 uppercase tracking-wide">
                Suspect Psychological Web
              </h3>
              <span className="text-[10px] font-mono-code text-slate-500 uppercase">
                Interpersonal loyalties, rivalries, and secret ties
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a202c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suspect Selector Pill Row */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-[#1d2332]">
          {Object.values(suspects).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSuspectId(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-2 shrink-0 transition-all ${
                selectedSuspectId === s.id
                  ? 'bg-[#1e2638] text-[#d4af37] border border-[#d4af37]/50 font-bold shadow-sm'
                  : 'bg-[#131722] text-slate-400 hover:text-slate-200 border border-[#202636]'
              }`}
            >
              <img src={s.avatar} alt={s.name} className="w-5 h-5 rounded-full object-cover" />
              <span>{s.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Selected Suspect's Perspective */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 bg-[#141822] p-3 rounded-xl border border-[#202738]">
            <img
              src={currentSuspect.avatar}
              alt={currentSuspect.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#d4af37]/40"
            />
            <div>
              <h4 className="font-cinzel text-sm font-bold text-slate-100">
                {currentSuspect.name}
              </h4>
              <p className="text-xs text-slate-400 font-sans">{currentSuspect.role}</p>
              <p className="text-[11px] text-amber-300/80 font-reading italic mt-0.5">
                Personality: {currentSuspect.personality}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono-code uppercase text-slate-500 tracking-wider block">
              How {currentSuspect.name.split(' ')[0]} views the others:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto">
              {Object.entries(currentSuspect.relationships).map(([targetId, desc]) => {
                const target = suspects[targetId as SuspectId];
                return (
                  <div
                    key={targetId}
                    className="p-3 rounded-xl bg-[#131722] border border-[#1f2638] space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                      <span className="text-xs font-semibold text-slate-200">
                        {target ? target.name : targetId.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-reading leading-relaxed italic">
                      “{desc}”
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#1f2535] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#202738] hover:bg-[#2c364d] text-slate-200 font-cinzel text-xs uppercase tracking-wider transition-colors"
          >
            Close Relations
          </button>
        </div>
      </div>
    </div>
  );
};

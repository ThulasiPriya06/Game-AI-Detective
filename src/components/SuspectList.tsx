import React, { useState } from 'react';
import { Suspect, SuspectId, EmotionalState } from '../types/case';
import { MessageSquare, Users, AlertCircle, ChevronRight, HeartHandshake, Eye } from 'lucide-react';

interface SuspectListProps {
  suspects: Record<SuspectId, Suspect>;
  activeSuspectId: SuspectId;
  onSelectSuspect: (id: SuspectId) => void;
  suspectEmotions: Record<SuspectId, EmotionalState>;
  contradictionCountBySuspect: Record<SuspectId, number>;
  conversationCountBySuspect: Record<SuspectId, number>;
  onOpenRelationships: () => void;
}

export const SuspectList: React.FC<SuspectListProps> = ({
  suspects,
  activeSuspectId,
  onSelectSuspect,
  suspectEmotions,
  contradictionCountBySuspect,
  conversationCountBySuspect,
  onOpenRelationships,
}) => {
  const getEmotionBadge = (emotion: EmotionalState) => {
    switch (emotion) {
      case 'calm':
        return <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">Calm</span>;
      case 'defensive':
        return <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400">Defensive</span>;
      case 'nervous':
        return <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-orange-950/60 border border-orange-500/30 text-orange-400">Nervous</span>;
      case 'hesitant':
        return <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-400">Hesitant</span>;
      case 'panicked':
        return <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-red-950/70 border border-red-500/50 text-red-400 animate-pulse">Panicked</span>;
      case 'smug':
        return <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-400">Smug</span>;
      default:
        return null;
    }
  };

  const suspectList = Object.values(suspects);

  return (
    <div className="flex flex-col h-full bg-[#0d1017] border-r border-[#1f2533] select-none">
      {/* Panel header */}
      <div className="p-3.5 border-b border-[#1f2533] flex items-center justify-between bg-[#111520]">
        <div>
          <h2 className="text-xs font-mono-code uppercase tracking-wider text-slate-400 font-semibold">
            Persons of Interest ({suspectList.length})
          </h2>
          <p className="text-[11px] text-slate-500">Mansion occupants present during theft</p>
        </div>
        <button
          onClick={onOpenRelationships}
          className="p-1.5 rounded bg-[#171c2a] hover:bg-[#20273a] text-slate-300 hover:text-amber-300 border border-slate-700/50 transition-colors flex items-center gap-1 text-[11px] font-mono-code"
          title="Inspect Suspect Relationships"
        >
          <Users className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="hidden sm:inline">Relations</span>
        </button>
      </div>

      {/* Suspect List Scrollable */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {suspectList.map((suspect) => {
          const isActive = suspect.id === activeSuspectId;
          const emotion = suspectEmotions[suspect.id] || suspect.initialEmotion;
          const contradictions = contradictionCountBySuspect[suspect.id] || 0;
          const questionsAsked = conversationCountBySuspect[suspect.id] || 0;

          return (
            <div
              key={suspect.id}
              onClick={() => onSelectSuspect(suspect.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border text-left relative overflow-hidden group ${
                isActive
                  ? 'bg-[#181e2b] border-[#d4af37]/60 shadow-md ring-1 ring-[#d4af37]/30'
                  : 'bg-[#111520]/80 hover:bg-[#151a26] border-[#1e2433] hover:border-slate-700'
              }`}
            >
              {/* Active glow marker */}
              {isActive && (
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#d4af37] to-amber-600" />
              )}

              <div className="flex items-center gap-3">
                {/* Avatar with subtle border */}
                <div className="relative shrink-0">
                  <img
                    src={suspect.avatar}
                    alt={suspect.name}
                    className={`w-12 h-12 rounded-lg object-cover border ${
                      isActive ? 'border-[#d4af37]' : 'border-slate-700'
                    }`}
                  />
                  {contradictions > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-black text-white text-[9px] font-mono-code font-bold flex items-center justify-center" title={`${contradictions} contradiction discovered`}>
                      !
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-[#d4af37]' : 'text-slate-200'}`}>
                      {suspect.name}
                    </h3>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-[#d4af37] translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'}`} />
                  </div>

                  <p className="text-xs text-slate-400 truncate mb-1.5 font-sans">
                    {suspect.role}
                  </p>

                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {getEmotionBadge(emotion)}
                    </div>
                    <span className="text-[10px] font-mono-code text-slate-400">
                      {questionsAsked > 0 ? `${questionsAsked} Qs` : 'Unquestioned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Public Claim snippet preview */}
              <div className="mt-2 pt-2 border-t border-[#1b2230] text-[11px] text-slate-400 italic line-clamp-1">
                “{suspect.publicClaim}”
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick relationship overview footer banner */}
      <div className="p-2.5 bg-[#0b0e14] border-t border-[#1b2230] text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Interrogate freely</span>
        </span>
        <button
          onClick={onOpenRelationships}
          className="text-amber-400 hover:text-amber-300 font-mono-code text-[10px] underline underline-offset-2"
        >
          View Allegiances
        </button>
      </div>
    </div>
  );
};

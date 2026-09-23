import React from 'react';
import { Shield, BookOpen, Volume2, VolumeX, AlertTriangle, Scale, RefreshCw } from 'lucide-react';
import { sound } from '../services/audioService';

interface HeaderProps {
  caseTitle: string;
  caseNumber: string;
  unlockedEvidenceCount: number;
  totalEvidenceCount: number;
  discoveredContradictionCount: number;
  totalContradictionCount: number;
  onOpenNotebook: () => void;
  onOpenAccusation: () => void;
  onResetCase: () => void;
  difficulty: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  caseTitle,
  caseNumber,
  unlockedEvidenceCount,
  totalEvidenceCount,
  discoveredContradictionCount,
  totalContradictionCount,
  onOpenNotebook,
  onOpenAccusation,
  onResetCase,
  difficulty,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="h-16 bg-[#0f1218]/95 backdrop-blur border-b border-[#222733] px-4 md:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Title & Case badge */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-[#1a1f2c] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-code tracking-wider text-[#d4af37] bg-[#d4af37]/10 px-1.5 py-0.5 rounded border border-[#d4af37]/20 uppercase">
              {caseNumber}
            </span>
            <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-widest hidden sm:inline">
              Mode: {difficulty}
            </span>
          </div>
          <h1 className="text-sm md:text-base font-cinzel font-bold text-slate-100 tracking-wide truncate max-w-[200px] sm:max-w-xs md:max-w-none">
            {caseTitle}
          </h1>
        </div>
      </div>

      {/* Metrics & Badges */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Contradictions Counter */}
        <button
          onClick={onOpenNotebook}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono-code border transition-all ${
            discoveredContradictionCount > 0
              ? 'bg-red-950/40 border-red-500/40 text-red-400 hover:bg-red-900/40'
              : 'bg-[#151922] border-[#222733] text-slate-400 hover:text-slate-300'
          }`}
          title="Contradictions Discovered"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Contradictions:</span>
          <span className="font-bold text-red-400">{discoveredContradictionCount}</span>
          <span className="text-slate-500">/{totalContradictionCount}</span>
        </button>

        {/* Evidence Counter */}
        <button
          onClick={onOpenNotebook}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono-code bg-[#151922] border border-[#222733] text-slate-300 hover:border-[#d4af37]/30 transition-all"
          title="Evidence Collected"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Evidence:</span>
          <span className="font-bold text-[#d4af37]">{unlockedEvidenceCount}</span>
          <span className="text-slate-500">/{totalEvidenceCount}</span>
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleMute}
          className="p-2 rounded bg-[#151922] border border-[#222733] text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
          title={isMuted ? 'Unmute Ambiance' : 'Mute Ambiance'}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
        </button>

        {/* Notebook Button */}
        <button
          onClick={onOpenNotebook}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c2230] hover:bg-[#252d40] border border-[#d4af37]/30 text-xs font-medium text-slate-200 transition-all shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span className="hidden md:inline">Notebook</span>
        </button>

        {/* Make Accusation Button */}
        <button
          onClick={onOpenAccusation}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white text-xs font-cinzel font-bold tracking-wider uppercase border border-amber-400/40 transition-all shadow-lg hover:shadow-red-900/30"
        >
          <Scale className="w-4 h-4 text-amber-200" />
          <span className="hidden sm:inline">Make</span> Accusation
        </button>

        {/* Reset button */}
        <button
          onClick={onResetCase}
          className="p-2 rounded text-slate-500 hover:text-slate-300 hover:bg-[#151922] transition-colors"
          title="Restart Case"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

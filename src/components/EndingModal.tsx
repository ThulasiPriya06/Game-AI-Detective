import React from 'react';
import { AccusationResult } from '../types/case';
import { Award, CheckCircle, XCircle, RotateCcw, BookOpen, AlertOctagon, Sparkles, ShieldAlert } from 'lucide-react';
import { sound } from '../services/audioService';

interface EndingModalProps {
  result: AccusationResult;
  onRestart: () => void;
  onRevise: () => void;
  onInspectNotebook: () => void;
}

export const EndingModal: React.FC<EndingModalProps> = ({
  result,
  onRestart,
  onRevise,
  onInspectNotebook,
}) => {
  const getBadgeStyle = () => {
    switch (result.badge) {
      case 'GOLD':
        return {
          title: 'MASTER DETECTIVE — GOLD COMMENDATION',
          color: 'from-amber-400 via-[#d4af37] to-amber-600',
          border: 'border-amber-400/80',
          glow: 'shadow-amber-500/20',
          icon: <Award className="w-10 h-10 text-amber-300" />,
        };
      case 'SILVER':
        return {
          title: 'SENIOR INVESTIGATOR — SILVER BADGE',
          color: 'from-slate-200 via-slate-400 to-slate-500',
          border: 'border-slate-300',
          glow: 'shadow-slate-400/20',
          icon: <Award className="w-10 h-10 text-slate-200" />,
        };
      case 'BRONZE':
        return {
          title: 'INCOMPLETE CASE — BRONZE MERIT',
          color: 'from-amber-700 via-amber-800 to-amber-900',
          border: 'border-amber-700',
          glow: 'shadow-amber-900/20',
          icon: <Award className="w-10 h-10 text-amber-500" />,
        };
      default:
        return {
          title: 'CASE DISMISSED — WRONGFUL ARREST',
          color: 'from-red-600 via-red-800 to-red-950',
          border: 'border-red-600',
          glow: 'shadow-red-600/20',
          icon: <AlertOctagon className="w-10 h-10 text-red-400" />,
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in zoom-in-95 duration-300">
      <div className={`bg-[#0f121a] border ${badgeStyle.border} rounded-2xl w-full max-w-3xl my-auto p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden`}>
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-[#141824] border border-amber-400/30 flex items-center justify-center mb-4 shadow-xl">
          {badgeStyle.icon}
        </div>

        {/* Verdict Title */}
        <div className="text-xs font-mono-code text-amber-300 tracking-widest uppercase mb-1">
          {badgeStyle.title}
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-slate-100 uppercase tracking-wider mb-2">
          {result.endingType.replace('_', ' ')}
        </h2>

        {/* Score Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181e2b] border border-amber-400/30 text-amber-200 text-xs font-mono-code mb-6">
          <span>Detective Rating:</span>
          <span className="font-bold text-amber-300 text-sm">{result.score}%</span>
        </div>

        {/* Evaluation Summary Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left mb-6 text-xs font-mono-code">
          <div className="p-2.5 rounded-lg bg-[#141822] border border-[#222938]">
            <span className="text-slate-500 block text-[10px]">Culprit:</span>
            <span className={result.culpritCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {result.culpritCorrect ? '✓ Identified' : '✕ Mistaken'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#141822] border border-[#222938]">
            <span className="text-slate-500 block text-[10px]">Motive:</span>
            <span className={result.motiveCorrect ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {result.motiveCorrect ? '✓ Accurate' : 'Partially Flawed'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#141822] border border-[#222938]">
            <span className="text-slate-500 block text-[10px]">Method:</span>
            <span className={result.methodCorrect ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {result.methodCorrect ? '✓ Reconstructed' : 'Incomplete'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#141822] border border-[#222938]">
            <span className="text-slate-500 block text-[10px]">Evidence Score:</span>
            <span className="text-amber-300 font-bold">
              {result.evidenceScore}% Match
            </span>
          </div>
        </div>

        {/* Feedback Message */}
        <div className="bg-[#141822] border border-[#222938] rounded-xl p-4 text-left mb-6">
          <h4 className="text-xs font-mono-code uppercase text-[#d4af37] font-semibold mb-1">
            Inspector General's Assessment:
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {result.evaluatorFeedback}
          </p>
        </div>

        {/* Authoritative True Story Reveal */}
        <div className="bg-[#121620] border border-amber-500/20 rounded-xl p-5 text-left mb-8 max-h-60 overflow-y-auto">
          <div className="flex items-center gap-2 text-xs font-mono-code text-amber-300 uppercase font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>The Canonical Truth of Blackwood Mansion:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-reading leading-relaxed">
            {result.fullTruthStory}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Investigate Again</span>
          </button>

          <button
            onClick={onRevise}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1c2230] hover:bg-[#252d40] border border-slate-700 text-slate-200 font-cinzel text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>Revise Accusation</span>
          </button>

          <button
            onClick={onInspectNotebook}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#131722] hover:bg-[#1a1f2c] border border-slate-800 text-slate-400 hover:text-slate-200 font-cinzel text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Clues</span>
          </button>
        </div>
      </div>
    </div>
  );
};

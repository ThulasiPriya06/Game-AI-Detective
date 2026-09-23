import React from 'react';
import { Evidence, SuspectId } from '../types/case';
import { X, Clock, FileSearch, ShieldAlert, Cpu, FileText, CheckCircle2 } from 'lucide-react';

interface EvidenceDetailModalProps {
  evidence: Evidence | null;
  onClose: () => void;
  suspectNames: Record<SuspectId, string>;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({
  evidence,
  onClose,
  suspectNames,
}) => {
  if (!evidence) return null;

  const getCategoryIcon = () => {
    switch (evidence.category) {
      case 'PHYSICAL':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'DIGITAL':
        return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'TESTIMONY':
        return <FileText className="w-5 h-5 text-purple-400" />;
      default:
        return <FileSearch className="w-5 h-5 text-[#d4af37]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-[#10141d] border border-[#d4af37]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#202738] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181e2b] border border-slate-700 flex items-center justify-center">
              {getCategoryIcon()}
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-[#d4af37] uppercase tracking-wider font-semibold">
                Forensic Item #{evidence.id}
              </span>
              <h3 className="font-cinzel text-base font-bold text-slate-100">
                {evidence.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a202c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-500 font-mono-code uppercase block text-[10px] mb-1">
              Field Description
            </span>
            <p className="text-slate-300 font-sans leading-relaxed bg-[#141824] p-3 rounded-xl border border-[#202738]">
              {evidence.description}
            </p>
          </div>

          <div>
            <span className="text-[#d4af37] font-mono-code uppercase block text-[10px] mb-1">
              Forensic Lab Findings & Clues
            </span>
            <div className="text-slate-200 font-reading text-sm leading-relaxed bg-[#161d2b] p-4 rounded-xl border border-[#28334a]">
              {evidence.detailedAnalysis}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-2 border-t border-[#1f2535] flex items-center justify-between text-[11px] font-mono-code text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Found: {evidence.timeDiscovered || 'Early Discovery'}
            </span>
            <span>Category: {evidence.category}</span>
          </div>

          {/* Related Suspects */}
          {evidence.relatedSuspects.length > 0 && (
            <div className="bg-[#141822] p-2.5 rounded-xl border border-[#202738]">
              <span className="text-[10px] font-mono-code text-slate-500 uppercase block mb-1.5">
                Related Persons of Interest:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evidence.relatedSuspects.map((sid) => (
                  <span
                    key={sid}
                    className="px-2 py-0.5 rounded bg-[#1c2333] text-amber-200 font-mono-code text-[11px] border border-slate-700"
                  >
                    {suspectNames[sid] || sid}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-[#1f2535] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#202738] hover:bg-[#2c364d] text-slate-200 font-cinzel text-xs uppercase tracking-wider transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

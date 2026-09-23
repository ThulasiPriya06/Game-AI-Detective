import React, { useState, useEffect } from 'react';
import { Suspect, SuspectId, Evidence, Contradiction, TimelineEntry } from '../types/case';
import { BookOpen, Users, AlertTriangle, Clock, Edit3, X, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { TimelineView } from './TimelineView';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspects: Record<SuspectId, Suspect>;
  evidenceList: Evidence[];
  unlockedEvidenceIds: string[];
  contradictions: Contradiction[];
  discoveredContradictionIds: string[];
  timeline: TimelineEntry[];
  unlockedTimelineIds: string[];
}

export const NotebookModal: React.FC<NotebookModalProps> = ({
  isOpen,
  onClose,
  suspects,
  evidenceList,
  unlockedEvidenceIds,
  contradictions,
  discoveredContradictionIds,
  timeline,
  unlockedTimelineIds,
}) => {
  const [activeTab, setActiveTab] = useState<'suspects' | 'clues' | 'contradictions' | 'timeline' | 'theory'>('contradictions');
  const [playerTheory, setPlayerTheory] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('detective_player_theory');
    if (saved) setPlayerTheory(saved);
  }, []);

  const handleTheoryChange = (text: string) => {
    setPlayerTheory(text);
    localStorage.setItem('detective_player_theory', text);
  };

  if (!isOpen) return null;

  const discoveredContradictions = contradictions.filter(c => discoveredContradictionIds.includes(c.id));
  const unlockedEvidence = evidenceList.filter(e => unlockedEvidenceIds.includes(e.id));

  const suspectNames: Record<SuspectId, string> = Object.values(suspects).reduce((acc, s) => {
    acc[s.id] = s.name;
    return acc;
  }, {} as Record<SuspectId, string>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0f121a] border border-[#d4af37]/40 rounded-2xl w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Notebook Binder Header */}
        <div className="p-4 bg-[#141822] border-b border-[#222938] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1c2230] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-base font-bold text-slate-100 tracking-wide uppercase">
                Detective's Field Notebook
              </h2>
              <span className="text-[10px] font-mono-code text-slate-500 uppercase">
                Case 001 Dossier • Authoritative Records
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2533] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notebook Tabs */}
        <div className="flex border-b border-[#222938] bg-[#0c0f16] px-4 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('contradictions')}
            className={`py-3 px-2 sm:px-3 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'contradictions'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Contradictions</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-950/70 border border-red-500/40 text-red-300">
              {discoveredContradictions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('clues')}
            className={`py-3 px-2 sm:px-3 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'clues'
                ? 'border-[#d4af37] text-[#d4af37] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Clues & Evidence</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#1c2230] border border-[#d4af37]/30 text-amber-300">
              {unlockedEvidence.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('suspects')}
            className={`py-3 px-2 sm:px-3 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'suspects'
                ? 'border-[#d4af37] text-[#d4af37] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Suspect Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-2 sm:px-3 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'timeline'
                ? 'border-[#d4af37] text-[#d4af37] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`py-3 px-2 sm:px-3 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'theory'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>My Theory</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0c12]">
          {/* TAB 1: CONTRADICTIONS */}
          {activeTab === 'contradictions' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  Discovered inconsistencies between suspect testimony and verified physical evidence. A lie proves deception, but does not always mean theft!
                </span>
              </div>

              {discoveredContradictions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono-code text-xs">
                  No contradictions discovered yet. Question suspects about their alibis, timestamps, and specific evidence.
                </div>
              ) : (
                discoveredContradictions.map((contra) => {
                  const suspect = suspects[contra.suspectId];
                  return (
                    <div
                      key={contra.id}
                      className="bg-[#12151e] border border-red-500/30 rounded-xl p-4 shadow-md space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[#202738] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <h3 className="font-semibold text-slate-100 text-sm">
                            {contra.title}
                          </h3>
                        </div>
                        <span className="text-xs font-mono-code text-amber-300 bg-[#1c2230] px-2 py-0.5 rounded">
                          Suspect: {suspect?.name || contra.suspectId}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1.5 font-sans">
                        <div>
                          <strong className="text-slate-400">Suspect's Claim:</strong>{' '}
                          <span className="italic text-slate-200">“{contra.statementSnippet}”</span>
                        </div>
                        <div className="bg-[#181016] p-2.5 rounded-lg border border-red-900/40 text-red-200 text-xs font-reading">
                          <strong className="text-red-400 font-mono-code uppercase block text-[10px] mb-1">
                            Discovered Contradiction Analysis:
                          </strong>
                          {contra.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: CLUES & EVIDENCE */}
          {activeTab === 'clues' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-[#121620] border border-[#22293b] rounded-xl p-4 shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#1c2230] text-[#d4af37] border border-[#d4af37]/30 uppercase font-bold">
                      {ev.category}
                    </span>
                    <span className="text-[10px] font-mono-code text-slate-500">
                      Discovered {ev.timeDiscovered}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-100 text-sm">{ev.name}</h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{ev.description}</p>

                  <div className="bg-[#171c28] p-3 rounded-lg border border-slate-700/40 text-xs text-slate-300 font-reading leading-relaxed">
                    <span className="font-mono-code text-[10px] text-[#d4af37] uppercase block mb-1">
                      Forensic Analysis:
                    </span>
                    {ev.detailedAnalysis}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SUSPECTS */}
          {activeTab === 'suspects' && (
            <div className="space-y-4">
              {Object.values(suspects).map((s) => (
                <div
                  key={s.id}
                  className="bg-[#121620] border border-[#22293b] rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#d4af37]/40 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-100 font-cinzel">{s.name}</h3>
                      <span className="text-[10px] font-mono-code text-amber-300 bg-[#1c2230] px-2 py-0.5 rounded">
                        {s.role} • Age {s.age}
                      </span>
                    </div>

                    <p className="text-slate-400 font-reading italic">
                      Claimed Alibi: “{s.publicClaim}”
                    </p>

                    <div className="pt-2 border-t border-[#1e2535] text-[11px] text-slate-400">
                      <strong className="text-slate-300 font-mono-code">Known Allegiances:</strong>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                        {Object.entries(s.relationships).map(([targetId, rel]) => (
                          <div key={targetId} className="truncate">
                            • <span className="text-amber-200/90 capitalize">{targetId.replace('_', ' ')}:</span> {rel}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'timeline' && (
            <TimelineView
              timeline={timeline}
              unlockedTimelineIds={unlockedTimelineIds}
              suspectNames={suspectNames}
            />
          )}

          {/* TAB 5: THEORY */}
          {activeTab === 'theory' && (
            <div className="h-full flex flex-col space-y-3">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Deduction scratchpad (Auto-saved for your review before accusation)</span>
                <span className="text-amber-300 font-mono-code text-[10px]">Saved Locally</span>
              </div>
              <textarea
                value={playerTheory}
                onChange={(e) => handleTheoryChange(e.target.value)}
                placeholder="Draft your deductions here... Who do you think took the diamond? Why did the camera shut off? Who wore the dark velvet shawl? What is Clara hiding?"
                className="flex-1 min-h-[300px] w-full bg-[#131722] border border-[#252d40] focus:border-[#d4af37] rounded-xl p-4 text-sm text-slate-200 font-reading leading-relaxed outline-none resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#141822] border-t border-[#222938] flex items-center justify-between text-xs text-slate-400 font-mono-code">
          <span>AI Detective Notebook • Case 001</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#202738] hover:bg-[#2b344c] text-slate-200 transition-colors"
          >
            Close Notebook
          </button>
        </div>
      </div>
    </div>
  );
};

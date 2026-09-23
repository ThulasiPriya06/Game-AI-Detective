import React, { useState } from 'react';
import { Suspect, SuspectId, Evidence, AccusationSubmission } from '../types/case';
import { Scale, AlertTriangle, CheckCircle2, ChevronRight, X, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../services/audioService';

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspects: Record<SuspectId, Suspect>;
  unlockedEvidence: Evidence[];
  onSubmitAccusation: (submission: AccusationSubmission) => void;
  isEvaluating: boolean;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  isOpen,
  onClose,
  suspects,
  unlockedEvidence,
  onSubmitAccusation,
  isEvaluating,
}) => {
  const [selectedCulprit, setSelectedCulprit] = useState<SuspectId | null>(null);
  const [selectedMotive, setSelectedMotive] = useState<string>('');
  const [customMotive, setCustomMotive] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [naturalExplanation, setNaturalExplanation] = useState<string>('');

  if (!isOpen) return null;

  const toggleEvidence = (id: string) => {
    if (selectedEvidenceIds.includes(id)) {
      setSelectedEvidenceIds(selectedEvidenceIds.filter(e => e !== id));
    } else {
      if (selectedEvidenceIds.length < 3) {
        setSelectedEvidenceIds([...selectedEvidenceIds, id]);
      }
    }
  };

  const motiveOptions = [
    { id: 'dismissal', label: 'Imminent dismissal & escape: Facing termination tomorrow; stole gem to flee abroad.' },
    { id: 'gambling_debt', label: 'Desperate debt: Needed funds to pay off a violent $400,000 gambling syndicate.' },
    { id: 'embezzlement_cover', label: 'Audit panic: Stealing the diamond to compensate for $1.8M in embezzled funds.' },
    { id: 'opportunistic_greed', label: 'Sheer opportunism: Saw the camera blackout and took the $12M jewel.' },
    { id: 'family_revenge', label: 'Spite & resentment: Vengeance against Lord Blackwood\'s tyrannical treatment.' },
  ];

  const methodOptions = [
    { id: 'cipher_frame_shawl', label: 'Master cipher + Stolen keycard + Shawl disguise to frame another suspect.' },
    { id: 'brute_force_hack', label: 'Hacking the digital study lock and resetting the vault timer.' },
    { id: 'accomplice_handoff', label: 'Working with an outside accomplice via the terrace patio.' },
    { id: 'opportunistic_safe', label: 'Found the study door left open and dialed a guessed combination.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCulprit || (!selectedMotive && !customMotive) || !selectedMethod) return;

    sound.playGavelStrike();

    onSubmitAccusation({
      culpritId: selectedCulprit,
      motive: customMotive || selectedMotive,
      method: selectedMethod,
      evidenceIds: selectedEvidenceIds,
      naturalExplanation,
    });
  };

  const canSubmit = selectedCulprit && (selectedMotive || customMotive) && selectedMethod && selectedEvidenceIds.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0f121a] border border-amber-500/50 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-red-950 via-[#181116] to-[#121622] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-slate-100 tracking-wider uppercase">
                Make Your Accusation
              </h2>
              <span className="text-[10px] font-mono-code text-amber-300 uppercase tracking-widest">
                Official Indictment • Case 001
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#0a0d13]">
          {/* STEP 1: SELECT CULPRIT */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Who stole the Blackwood Diamond?</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {Object.values(suspects).map((s) => {
                const isSelected = selectedCulprit === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedCulprit(s.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                        : 'bg-[#121622] hover:bg-[#181e2c] border-[#22293b]'
                    }`}
                  >
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                    />
                    <div className="w-full">
                      <div className="text-xs font-semibold text-slate-100 truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{s.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: MOTIVE */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>What was their motive?</span>
            </div>

            <div className="space-y-2">
              {motiveOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedMotive === opt.label
                      ? 'bg-amber-950/40 border-amber-400/80 text-amber-200'
                      : 'bg-[#121622] hover:bg-[#161c2a] border-[#22293b] text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="motive"
                    checked={selectedMotive === opt.label}
                    onChange={() => setSelectedMotive(opt.label)}
                    className="mt-0.5 text-amber-500 focus:ring-amber-400"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* STEP 3: METHOD */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>How did they carry out the crime?</span>
            </div>

            <div className="space-y-2">
              {methodOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedMethod === opt.label
                      ? 'bg-amber-950/40 border-amber-400/80 text-amber-200'
                      : 'bg-[#121622] hover:bg-[#161c2a] border-[#22293b] text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={selectedMethod === opt.label}
                    onChange={() => setSelectedMethod(opt.label)}
                    className="mt-0.5 text-amber-500 focus:ring-amber-400"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* STEP 4: SUPPORTING EVIDENCE */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-300">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Select up to 3 pieces of supporting evidence ({selectedEvidenceIds.length}/3)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {unlockedEvidence.map((ev) => {
                const isSelected = selectedEvidenceIds.includes(ev.id);
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => toggleEvidence(ev.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-400 text-amber-200'
                        : 'bg-[#121622] hover:bg-[#171c2b] border-[#22293b] text-slate-400'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold truncate text-slate-200">{ev.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{ev.category}</div>
                    </div>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-amber-400 bg-amber-500 text-black font-bold' : 'border-slate-600'
                    }`}>
                      {isSelected && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: NATURAL EXPLANATION */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-300">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold">5</span>
              <span>Explain your deductive reasoning to the Inspector General:</span>
            </div>

            <textarea
              value={naturalExplanation}
              onChange={(e) => setNaturalExplanation(e.target.value)}
              placeholder="Provide your full deductive argument... Why are other suspects innocent? How did the culprit bypass security? Where is the diamond hidden?"
              className="w-full bg-[#131722] border border-[#252d40] focus:border-amber-400 rounded-xl p-3 text-xs text-slate-100 font-reading leading-relaxed outline-none min-h-[90px] resize-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!canSubmit || isEvaluating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-800 via-amber-600 to-amber-700 hover:from-red-700 hover:to-amber-500 text-white font-cinzel font-bold text-sm tracking-widest uppercase transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Scale className="w-5 h-5" />
              <span>{isEvaluating ? 'Presenting Evidence to Crown Court...' : 'Submit Final Accusation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

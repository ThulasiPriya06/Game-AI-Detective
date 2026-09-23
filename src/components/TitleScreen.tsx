import React, { useState } from 'react';
import { Shield, Play, HelpCircle, Eye, Flame, Compass, Lock, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { Difficulty } from '../types/case';
import { sound } from '../services/audioService';

interface TitleScreenProps {
  onStartGame: (difficulty: Difficulty) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  isMuted,
  onToggleMute,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const handleStart = () => {
    sound.startAmbiance();
    sound.playEvidenceChime();
    onStartGame(selectedDifficulty);
  };

  return (
    <div className="relative min-h-screen bg-[#07090d] text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-[#d4af37]/30">
      {/* Background noir textures & atmospheric lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.12),rgba(0,0,0,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f141e_1px,transparent_1px),linear-gradient(to_bottom,#0f141e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-10 px-6 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded border border-[#d4af37]/40 bg-[#161a24] flex items-center justify-center text-[#d4af37]">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-mono-code text-xs text-slate-400 tracking-widest uppercase">
            AI Studio • Noir Dossier
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 text-xs font-mono-code text-slate-400 hover:text-amber-300 bg-[#131720]/80 px-3 py-1.5 rounded-full border border-slate-800 hover:border-amber-400/40 transition-all"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />}
          <span>{isMuted ? 'Sound Off' : 'Noir Audio Active'}</span>
        </button>
      </div>

      {/* Main Hero Cinematic Section */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center">
        {/* Case Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b202c]/90 border border-[#d4af37]/30 text-[#d4af37] text-xs font-mono-code tracking-wider uppercase mb-6 shadow-sm">
          <Lock className="w-3.5 h-3.5" />
          CASE 001 • THE BLACKWOOD DIAMOND
        </div>

        {/* Title */}
        <h1 className="font-cinzel text-5xl sm:text-6xl md:text-7xl font-black tracking-wider text-slate-100 drop-shadow-2xl mb-2">
          AI DETECTIVE
        </h1>
        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#d4af37] to-amber-500 mb-6 uppercase">
          WHO IS LYING?
        </h2>

        {/* Subtitle */}
        <p className="font-reading text-lg sm:text-xl text-slate-300 italic max-w-xl mx-auto leading-relaxed mb-10">
          “Everyone has a story. Only one version can be true.”
        </p>

        {/* Case Synopsis Summary Card */}
        <div className="w-full max-w-2xl bg-[#0f131a]/80 backdrop-blur border border-[#222838] rounded-xl p-5 text-left mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between border-b border-[#1f2533] pb-3 mb-3">
            <span className="text-xs font-mono-code text-[#d4af37] uppercase tracking-wider font-semibold">
              The Incident Briefing
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              11:42 PM • Blackwood Mansion
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans mb-3">
            The priceless 45-carat <strong className="text-amber-200">"Eye of the Void"</strong> diamond has disappeared from Lord Arthur Blackwood's locked study safe. No broken windows, no alarms tripped. Five people were inside the mansion.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono-code text-slate-400">
            <div><span className="text-slate-500">Value:</span> $12,000,000</div>
            <div><span className="text-slate-500">Suspects:</span> 5 Present</div>
            <div><span className="text-slate-500">Status:</span> Sealed Manor</div>
          </div>
        </div>

        {/* Difficulty Picker */}
        <div className="w-full max-w-md mb-8">
          <div className="text-xs font-mono-code text-slate-400 uppercase tracking-widest mb-2.5">
            Select Investigation Difficulty
          </div>
          <div className="grid grid-cols-3 gap-2 bg-[#121620] p-1.5 rounded-lg border border-[#222838]">
            <button
              onClick={() => setSelectedDifficulty('easy')}
              className={`py-2 px-3 rounded text-xs font-mono-code transition-all ${
                selectedDifficulty === 'easy'
                  ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EASY
              <span className="block text-[10px] text-slate-500 mt-0.5">Assisted</span>
            </button>
            <button
              onClick={() => setSelectedDifficulty('normal')}
              className={`py-2 px-3 rounded text-xs font-mono-code transition-all ${
                selectedDifficulty === 'normal'
                  ? 'bg-amber-950/70 border border-amber-500/50 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              NORMAL
              <span className="block text-[10px] text-slate-500 mt-0.5">Balanced</span>
            </button>
            <button
              onClick={() => setSelectedDifficulty('hard')}
              className={`py-2 px-3 rounded text-xs font-mono-code transition-all ${
                selectedDifficulty === 'hard'
                  ? 'bg-red-950/70 border border-red-500/50 text-red-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HARD
              <span className="block text-[10px] text-slate-500 mt-0.5">Deceptive</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto flex-1 group py-3.5 px-8 rounded-lg bg-gradient-to-r from-[#d4af37] via-amber-500 to-[#b89728] hover:from-amber-400 hover:to-amber-500 text-black font-cinzel font-bold text-sm tracking-wider uppercase transition-all shadow-xl hover:shadow-[#d4af37]/20 flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-current transition-transform group-hover:translate-x-0.5" />
            <span>Start Investigation</span>
          </button>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-lg bg-[#141822] hover:bg-[#1c2230] text-slate-200 border border-[#2b3346] hover:border-slate-500 font-cinzel font-semibold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-[#d4af37]" />
            <span>How to Play</span>
          </button>
        </div>
      </main>

      {/* Footer credits & atmosphere note */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs font-mono-code text-slate-400 border-t border-slate-900/80">
        AI Detective: Natural Language Suspect Interrogation • Powered by Gemini AI
      </footer>

      {/* HOW TO PLAY MODAL */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#10141d] border border-[#d4af37]/40 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto text-left shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#222838] pb-4 mb-5">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-cinzel text-lg font-bold uppercase tracking-wider text-slate-100">
                  Detective Field Handbook
                </h3>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="text-slate-400 hover:text-white px-2 py-1 text-sm font-mono-code"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3 bg-[#151a24] p-3.5 rounded-lg border border-[#232a3b]">
                <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-mono-code text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  1
                </span>
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">Natural Language Interrogation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You are not restricted to predefined dialogue options. Type your own questions naturally! Ask about timestamps, whereabouts, motives, relationships, or specific pieces of evidence.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#151a24] p-3.5 rounded-lg border border-[#232a3b]">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 font-mono-code text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  2
                </span>
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">Contradiction Discovery</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When a suspect's statement conflicts with uncovered forensic evidence or verified testimony, the system registers a <span className="text-red-400 font-bold">⚠ Contradiction</span>. Remember: A lie does NOT automatically mean they stole the diamond—some suspects are hiding affairs or personal debts!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#151a24] p-3.5 rounded-lg border border-[#232a3b]">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono-code text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  3
                </span>
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">Accidental Slip-Ups</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Guilty or panicked suspects may casually mention details only the perpetrator would know (such as the location of the safe before it is disclosed). Watch for these slips!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#151a24] p-3.5 rounded-lg border border-[#232a3b]">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-mono-code text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  4
                </span>
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">The Detective Notebook & Accusation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Track the timeline, clues, and suspect psychology in your notebook. When confident, click <strong className="text-amber-300">Make Accusation</strong> to present your culprit, motive, method, and supporting evidence.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222838] flex justify-end">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="px-5 py-2 rounded bg-[#d4af37] text-black font-cinzel font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
              >
                Understood, Let's Begin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

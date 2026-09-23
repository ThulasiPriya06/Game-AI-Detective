import React, { useState, useRef, useEffect } from 'react';
import { Suspect, SuspectId, DialogueMessage, EmotionalState, Evidence } from '../types/case';
import { Send, AlertTriangle, Sparkles, User, Shield, Info, Lightbulb, Clock, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../services/audioService';

interface InterrogationChatProps {
  suspect: Suspect;
  messages: DialogueMessage[];
  onSendMessage: (question: string) => Promise<void>;
  isThinking: boolean;
  currentEmotion: EmotionalState;
  unlockedEvidence: Evidence[];
  latestContradiction: string | null;
  onDismissContradiction: () => void;
  onOpenNotebook: () => void;
  difficulty: string;
}

export const InterrogationChat: React.FC<InterrogationChatProps> = ({
  suspect,
  messages,
  onSendMessage,
  isThinking,
  currentEmotion,
  unlockedEvidence,
  latestContradiction,
  onDismissContradiction,
  onOpenNotebook,
  difficulty,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Focus input when suspect changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [suspect.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    const text = inputText.trim();
    setInputText('');
    sound.playTypewriterClick();
    await onSendMessage(text);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  // Dynamic suggested prompts tailored to the active suspect and current case state
  const getSuggestions = () => {
    switch (suspect.id) {
      case 'evelyn_blackwood':
        return [
          "Where were you between 11:30 and 11:45 PM?",
          "Your study keycard was swiped at 11:37 PM. Explain that.",
          "Who were you arguing with on the phone?",
          "What did you and your father argue about at dinner?",
        ];
      case 'marcus_reed':
        return [
          "Did you leave your security console at any point tonight?",
          "We found Turkish Sobranie cigarette butts on the terrace.",
          "Why did East Corridor Camera 4 go offline at 11:35 PM?",
          "Did anyone approach the front foyer before the theft?",
        ];
      case 'clara_moore':
        return [
          "Were you really alone in the kitchen all night?",
          "Did you see anyone walking down the East corridor?",
          "Daniel Cross's gold cufflink was found in your pantry.",
          "Tell me about the figure in the dark velvet shawl.",
        ];
      case 'daniel_cross':
        return [
          "You claim you were in the library, but you were seen in the pantry.",
          "What was the heated dispute between you and Arthur earlier?",
          "Why is one of your gold cufflinks missing from your sleeve?",
          "Who knew the master safe combination?",
        ];
      case 'sophia_grant':
        return [
          "How did you know the safe was behind the maritime painting?",
          "Who has access to Lord Blackwood's confidential vault codes?",
          "What were you doing near the Library Archives?",
          "Where was Evelyn's dark velvet shawl kept?",
        ];
      default:
        return [
          "What did you see around 11:40 PM?",
          "Where were you when the alarms sounded?",
        ];
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] relative select-text">
      {/* Active Suspect Profile Banner */}
      <div className="p-3.5 sm:p-4 bg-[#11141c] border-b border-[#1d222e] flex items-center justify-between gap-3 shadow-md z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={suspect.avatar}
              alt={suspect.name}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-[#d4af37]/50 shadow-inner"
            />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#11141c] ${
              currentEmotion === 'panicked' ? 'bg-red-500 animate-ping' :
              currentEmotion === 'defensive' ? 'bg-amber-500' :
              currentEmotion === 'nervous' ? 'bg-orange-400' : 'bg-emerald-500'
            }`} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-cinzel font-bold text-slate-100 truncate">
                {suspect.name}
              </h2>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#1c2230] text-[#d4af37] border border-[#d4af37]/30 uppercase hidden sm:inline">
                {suspect.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-reading italic truncate max-w-sm sm:max-w-md">
              “{suspect.publicClaim}”
            </p>
          </div>
        </div>

        {/* Emotional state indicator tag */}
        <div className="text-right shrink-0">
          <div className="text-[10px] font-mono-code text-slate-500 uppercase tracking-widest mb-0.5">
            Composure
          </div>
          <div className="text-xs font-mono-code font-bold uppercase tracking-wider capitalize text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-600/30">
            {currentEmotion}
          </div>
        </div>
      </div>

      {/* Contradiction Popup Alert Banner */}
      {latestContradiction && (
        <div className="bg-gradient-to-r from-red-950/90 via-[#260f12] to-red-950/90 border-b border-red-500/60 p-3 px-4 flex items-center justify-between text-xs text-red-200 animate-in slide-in-from-top-2 duration-300 shadow-xl z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div>
              <span className="font-mono-code font-bold tracking-wider text-red-400 uppercase">
                ⚠ CONTRADICTION DISCOVERED:
              </span>{' '}
              <span>{latestContradiction}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNotebook}
              className="text-[11px] font-mono-code text-amber-300 underline underline-offset-2 hover:text-white px-2 py-1"
            >
              Open Notebook
            </button>
            <button
              onClick={onDismissContradiction}
              className="text-red-400 hover:text-white font-mono-code text-xs px-1.5 py-0.5 rounded bg-red-950/50"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-[#141822] border border-[#262e40] flex items-center justify-center text-[#d4af37] mb-4 shadow-inner">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-slate-200 mb-1">
              Begin Interrogation with {suspect.name}
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-reading leading-relaxed">
              Every suspect in Blackwood Mansion has reasons to be evasive. Type any question naturally or probe their alibi, timeline, and relationships.
            </p>
            <div className="w-full space-y-1.5 text-left">
              <div className="text-[10px] font-mono-code uppercase text-slate-500 tracking-wider mb-1">
                Suggested Opening Questions:
              </div>
              {getSuggestions().slice(0, 3).map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full p-2.5 rounded-lg bg-[#121620] hover:bg-[#181e2b] border border-[#202738] hover:border-[#d4af37]/40 text-xs text-slate-300 text-left transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{suggestion}</span>
                  <CornerDownRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4af37] shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isDetective = msg.sender === 'detective';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-3">
                  <div className="bg-[#191520] border border-red-500/40 text-red-300 px-4 py-2 rounded-lg text-xs font-mono-code flex items-center gap-2 shadow-lg max-w-lg text-center">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{msg.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${
                  isDetective ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div className="shrink-0 pt-0.5">
                  {isDetective ? (
                    <div className="w-8 h-8 rounded-lg bg-[#1a202c] border border-slate-600 flex items-center justify-center text-slate-200 shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  ) : (
                    <img
                      src={suspect.avatar}
                      alt={suspect.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#d4af37]/40 shadow-md"
                    />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono-code text-slate-500">
                    <span className={isDetective ? 'text-amber-400 font-bold ml-auto' : 'text-slate-300 font-semibold'}>
                      {isDetective ? 'Detective (You)' : suspect.name}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isDetective
                        ? 'bg-gradient-to-br from-[#1e2738] to-[#161c28] text-slate-100 border border-slate-700/60 rounded-tr-none shadow-md font-sans'
                        : 'bg-[#131722] text-slate-200 border border-[#232b3d] rounded-tl-none shadow-md font-reading text-[15px]'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Accidental slip up indicator tag if applicable */}
                  {msg.isSlipUp && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono-code bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/30 w-fit">
                      <Sparkles className="w-3 h-3" />
                      <span>Accidental Slip-Up Detected</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <img
              src={suspect.avatar}
              alt={suspect.name}
              className="w-8 h-8 rounded-lg object-cover border border-[#d4af37]/40 shrink-0"
            />
            <div className="bg-[#131722] border border-[#232b3d] rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2 font-mono-code">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
              <span>{suspect.name} is weighing their words...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick inquiries bar */}
      <div className="px-4 py-1.5 bg-[#0d1017] border-t border-[#1a1f2b] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono-code uppercase text-slate-500 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-[#d4af37]" /> Leads:
        </span>
        {getSuggestions().map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSuggestionClick(sug)}
            className="text-[11px] font-sans px-2.5 py-1 rounded bg-[#141822] hover:bg-[#1d2332] text-slate-400 hover:text-amber-200 border border-[#202738] shrink-0 transition-colors whitespace-nowrap"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Box Area */}
      <div className="p-3 sm:p-4 bg-[#0f121a] border-t border-[#1d222e]">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isThinking}
            placeholder={`Question ${suspect.name}... (e.g. "What were you doing at 11:40?")`}
            className="flex-1 bg-[#151924] border border-[#283144] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="p-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center shrink-0 active:scale-95"
            title="Ask Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Small hint requirement under input */}
        <p className="text-[11px] font-reading text-slate-400 italic text-center mt-2">
          Ask anything. The suspects may not tell you the truth.
        </p>
      </div>
    </div>
  );
};

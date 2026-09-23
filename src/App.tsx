import React, { useState, useEffect } from 'react';
import { CASE_001 } from './cases/case001';
import {
  SuspectId,
  EmotionalState,
  DialogueMessage,
  Difficulty,
  Evidence,
  AccusationSubmission,
  AccusationResult,
} from './types/case';
import { ContradictionDetector } from './engine/contradictionDetector';
import { CaseEvaluator } from './engine/evaluator';
import { sound } from './services/audioService';

import { Header } from './components/Header';
import { TitleScreen } from './components/TitleScreen';
import { SuspectList } from './components/SuspectList';
import { InterrogationChat } from './components/InterrogationChat';
import { EvidencePanel } from './components/EvidencePanel';
import { TimelineView } from './components/TimelineView';
import { NotebookModal } from './components/NotebookModal';
import { AccusationModal } from './components/AccusationModal';
import { EndingModal } from './components/EndingModal';
import { EvidenceDetailModal } from './components/EvidenceDetailModal';
import { RelationshipsModal } from './components/RelationshipsModal';

import { MessageSquare, Users, BookOpen, Clock, Scale } from 'lucide-react';

export default function App() {
  const currentCase = CASE_001;

  // Navigation & Game State
  const [gameState, setGameState] = useState<'title' | 'investigating' | 'ended'>('title');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Active Suspect & Dialogues
  const [activeSuspectId, setActiveSuspectId] = useState<SuspectId>('evelyn_blackwood');
  const [conversationHistory, setConversationHistory] = useState<Record<SuspectId, DialogueMessage[]>>({
    evelyn_blackwood: [],
    marcus_reed: [],
    clara_moore: [],
    daniel_cross: [],
    sophia_grant: [],
  });

  const [suspectEmotions, setSuspectEmotions] = useState<Record<SuspectId, EmotionalState>>({
    evelyn_blackwood: currentCase.suspects.evelyn_blackwood.initialEmotion,
    marcus_reed: currentCase.suspects.marcus_reed.initialEmotion,
    clara_moore: currentCase.suspects.clara_moore.initialEmotion,
    daniel_cross: currentCase.suspects.daniel_cross.initialEmotion,
    sophia_grant: currentCase.suspects.sophia_grant.initialEmotion,
  });

  // Evidence & Contradictions State
  const [unlockedEvidenceIds, setUnlockedEvidenceIds] = useState<string[]>(
    currentCase.evidence.filter(e => e.unlockedAtStart).map(e => e.id)
  );
  const [unlockedTimelineIds, setUnlockedTimelineIds] = useState<string[]>(
    currentCase.timeline.filter(t => t.unlockedAtStart).map(t => t.id)
  );
  const [discoveredContradictionIds, setDiscoveredContradictionIds] = useState<string[]>([]);
  const [discoveredSlipUpIds, setDiscoveredSlipUpIds] = useState<string[]>([]);
  const [latestContradiction, setLatestContradiction] = useState<string | null>(null);

  // Modal Views
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [isAccusationOpen, setIsAccusationOpen] = useState<boolean>(false);
  const [isRelationshipsOpen, setIsRelationshipsOpen] = useState<boolean>(false);
  const [activeInspectingEvidence, setActiveInspectingEvidence] = useState<Evidence | null>(null);
  const [accusationResult, setAccusationResult] = useState<AccusationResult | null>(null);

  // Loading States
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Mobile Tabs
  const [mobileTab, setMobileTab] = useState<'interrogate' | 'suspects' | 'evidence' | 'timeline'>('interrogate');

  // Load saved state or set defaults
  useEffect(() => {
    const saved = localStorage.getItem('detective_game_state_case001');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedEvidenceIds) setUnlockedEvidenceIds(parsed.unlockedEvidenceIds);
        if (parsed.unlockedTimelineIds) setUnlockedTimelineIds(parsed.unlockedTimelineIds);
        if (parsed.discoveredContradictionIds) setDiscoveredContradictionIds(parsed.discoveredContradictionIds);
        if (parsed.conversationHistory) setConversationHistory(parsed.conversationHistory);
        if (parsed.suspectEmotions) setSuspectEmotions(parsed.suspectEmotions);
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (gameState === 'investigating') {
      localStorage.setItem(
        'detective_game_state_case001',
        JSON.stringify({
          unlockedEvidenceIds,
          unlockedTimelineIds,
          discoveredContradictionIds,
          conversationHistory,
          suspectEmotions,
        })
      );
    }
  }, [unlockedEvidenceIds, unlockedTimelineIds, discoveredContradictionIds, conversationHistory, suspectEmotions, gameState]);

  const handleStartGame = (chosenDifficulty: Difficulty) => {
    setDifficulty(chosenDifficulty);
    setGameState('investigating');
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleResetCase = () => {
    if (window.confirm('Restart investigation for Case 001? All unlocked clues and dialogues will reset.')) {
      localStorage.removeItem('detective_game_state_case001');
      setConversationHistory({
        evelyn_blackwood: [],
        marcus_reed: [],
        clara_moore: [],
        daniel_cross: [],
        sophia_grant: [],
      });
      setSuspectEmotions({
        evelyn_blackwood: currentCase.suspects.evelyn_blackwood.initialEmotion,
        marcus_reed: currentCase.suspects.marcus_reed.initialEmotion,
        clara_moore: currentCase.suspects.clara_moore.initialEmotion,
        daniel_cross: currentCase.suspects.daniel_cross.initialEmotion,
        sophia_grant: currentCase.suspects.sophia_grant.initialEmotion,
      });
      setUnlockedEvidenceIds(currentCase.evidence.filter(e => e.unlockedAtStart).map(e => e.id));
      setUnlockedTimelineIds(currentCase.timeline.filter(t => t.unlockedAtStart).map(t => t.id));
      setDiscoveredContradictionIds([]);
      setDiscoveredSlipUpIds([]);
      setLatestContradiction(null);
      setAccusationResult(null);
      setGameState('investigating');
    }
  };

  // Interrogation send handler
  const handleSendMessage = async (question: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const detectiveMsg: DialogueMessage = {
      id: `det_${Date.now()}`,
      sender: 'detective',
      text: question,
      timestamp,
    };

    // Append detective message
    setConversationHistory(prev => ({
      ...prev,
      [activeSuspectId]: [...(prev[activeSuspectId] || []), detectiveMsg],
    }));

    setIsThinking(true);

    try {
      const res = await fetch('/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suspectId: activeSuspectId,
          question,
          conversationHistory: conversationHistory[activeSuspectId] || [],
          unlockedEvidenceIds,
          difficulty,
        }),
      });

      const data = await res.json();
      const dialogueText = data.dialogue || "I have nothing further to say, Detective.";
      const returnedEmotion = (data.emotionalState as EmotionalState) || 'calm';
      const reactionCue = data.reaction ? ` *${data.reaction}*` : '';
      const fullText = dialogueText + reactionCue;

      // Update emotion
      setSuspectEmotions(prev => ({
        ...prev,
        [activeSuspectId]: returnedEmotion,
      }));

      // Analyze for Contradictions & Accidental Slip-ups & Dynamic Leads
      const analysis = ContradictionDetector.analyze(
        currentCase,
        activeSuspectId,
        fullText,
        unlockedEvidenceIds,
        discoveredContradictionIds
      );

      let isSlipUpDetected = false;

      // Handle newly discovered contradiction
      if (analysis.newlyDiscoveredContradiction) {
        const contra = analysis.newlyDiscoveredContradiction;
        sound.playContradictionChime();
        setDiscoveredContradictionIds(prev => [...prev, contra.id]);
        setLatestContradiction(`${contra.title} (${currentCase.suspects[activeSuspectId].name})`);

        // Escalate emotion if contradicted
        setSuspectEmotions(prev => ({
          ...prev,
          [activeSuspectId]: activeSuspectId === 'sophia_grant' ? 'panicked' : 'defensive',
        }));
      }

      // Handle accidental slip-up
      if (analysis.accidentalSlipUp && !discoveredSlipUpIds.includes(analysis.accidentalSlipUp.id)) {
        sound.playEvidenceChime();
        isSlipUpDetected = true;
        setDiscoveredSlipUpIds(prev => [...prev, analysis.accidentalSlipUp!.id]);
      }

      // Handle dynamic evidence unlocking
      if (analysis.unlockedEvidenceId && !unlockedEvidenceIds.includes(analysis.unlockedEvidenceId)) {
        sound.playEvidenceChime();
        setUnlockedEvidenceIds(prev => [...prev, analysis.unlockedEvidenceId!]);
      }

      // Handle timeline event unlocking
      if (analysis.unlockedTimelineId && !unlockedTimelineIds.includes(analysis.unlockedTimelineId)) {
        setUnlockedTimelineIds(prev => [...prev, analysis.unlockedTimelineId!]);
      }

      const suspectMsg: DialogueMessage = {
        id: `susp_${Date.now()}`,
        sender: 'suspect',
        suspectId: activeSuspectId,
        text: fullText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotionalState: returnedEmotion,
        isSlipUp: isSlipUpDetected,
      };

      setConversationHistory(prev => ({
        ...prev,
        [activeSuspectId]: [...(prev[activeSuspectId] || []), suspectMsg],
      }));
    } catch (err) {
      console.error('Failed to query suspect:', err);
      const fallbackMsg: DialogueMessage = {
        id: `susp_err_${Date.now()}`,
        sender: 'suspect',
        suspectId: activeSuspectId,
        text: "I... I would prefer not to answer that without Lord Blackwood present.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotionalState: 'hesitant',
      };
      setConversationHistory(prev => ({
        ...prev,
        [activeSuspectId]: [...(prev[activeSuspectId] || []), fallbackMsg],
      }));
    } finally {
      setIsThinking(false);
    }
  };

  // Accusation submission handler
  const handleSubmitAccusation = async (submission: AccusationSubmission) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/accuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission }),
      });
      const data = await res.json();
      if (data.result) {
        setAccusationResult(data.result);
      } else {
        // Fallback local evaluation
        const evalResult = CaseEvaluator.evaluate(currentCase, submission);
        setAccusationResult(evalResult);
      }
    } catch {
      const evalResult = CaseEvaluator.evaluate(currentCase, submission);
      setAccusationResult(evalResult);
    } finally {
      setIsEvaluating(false);
      setIsAccusationOpen(false);
      setGameState('ended');
    }
  };

  // Metrics counts
  const contradictionCountBySuspect: Record<SuspectId, number> = {
    evelyn_blackwood: 0,
    marcus_reed: 0,
    clara_moore: 0,
    daniel_cross: 0,
    sophia_grant: 0,
  };
  currentCase.contradictions.forEach(c => {
    if (discoveredContradictionIds.includes(c.id)) {
      contradictionCountBySuspect[c.suspectId] = (contradictionCountBySuspect[c.suspectId] || 0) + 1;
    }
  });

  const conversationCountBySuspect: Record<SuspectId, number> = {
    evelyn_blackwood: (conversationHistory.evelyn_blackwood || []).filter(m => m.sender === 'detective').length,
    marcus_reed: (conversationHistory.marcus_reed || []).filter(m => m.sender === 'detective').length,
    clara_moore: (conversationHistory.clara_moore || []).filter(m => m.sender === 'detective').length,
    daniel_cross: (conversationHistory.daniel_cross || []).filter(m => m.sender === 'detective').length,
    sophia_grant: (conversationHistory.sophia_grant || []).filter(m => m.sender === 'detective').length,
  };

  const unlockedEvidenceObjects = currentCase.evidence.filter(e => unlockedEvidenceIds.includes(e.id));

  const suspectNames: Record<SuspectId, string> = Object.values(currentCase.suspects).reduce((acc, s) => {
    acc[s.id] = s.name;
    return acc;
  }, {} as Record<SuspectId, string>);

  // Render Title Screen
  if (gameState === 'title') {
    return (
      <TitleScreen
        onStartGame={handleStartGame}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0e14] text-slate-100 font-sans">
      {/* Top Header */}
      <Header
        caseTitle={currentCase.title}
        caseNumber={currentCase.caseNumber}
        unlockedEvidenceCount={unlockedEvidenceIds.length}
        totalEvidenceCount={currentCase.evidence.length}
        discoveredContradictionCount={discoveredContradictionIds.length}
        totalContradictionCount={currentCase.contradictions.length}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onOpenAccusation={() => setIsAccusationOpen(true)}
        onResetCase={handleResetCase}
        difficulty={difficulty}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Investigation Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* DESKTOP 3-COLUMN LAYOUT */}
        {/* Left Column: Suspects (Hidden on small screens unless active) */}
        <section
          className={`w-full md:w-72 lg:w-80 h-full shrink-0 z-10 transition-all ${
            mobileTab === 'suspects' ? 'block' : 'hidden md:block'
          }`}
        >
          <SuspectList
            suspects={currentCase.suspects}
            activeSuspectId={activeSuspectId}
            onSelectSuspect={(id) => {
              setActiveSuspectId(id);
              setMobileTab('interrogate');
            }}
            suspectEmotions={suspectEmotions}
            contradictionCountBySuspect={contradictionCountBySuspect}
            conversationCountBySuspect={conversationCountBySuspect}
            onOpenRelationships={() => setIsRelationshipsOpen(true)}
          />
        </section>

        {/* Center Column: Interrogation Room */}
        <section
          className={`flex-1 h-full min-w-0 transition-all ${
            mobileTab === 'interrogate' ? 'block' : 'hidden md:block'
          }`}
        >
          <InterrogationChat
            suspect={currentCase.suspects[activeSuspectId]}
            messages={conversationHistory[activeSuspectId] || []}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            currentEmotion={suspectEmotions[activeSuspectId]}
            unlockedEvidence={unlockedEvidenceObjects}
            latestContradiction={latestContradiction}
            onDismissContradiction={() => setLatestContradiction(null)}
            onOpenNotebook={() => setIsNotebookOpen(true)}
            difficulty={difficulty}
          />
        </section>

        {/* Right Column: Evidence / Timeline Panel */}
        <section
          className={`w-full md:w-80 lg:w-96 h-full shrink-0 z-10 transition-all ${
            mobileTab === 'evidence'
              ? 'block'
              : mobileTab === 'timeline'
              ? 'block'
              : 'hidden lg:block'
          }`}
        >
          {mobileTab === 'timeline' ? (
            <TimelineView
              timeline={currentCase.timeline}
              unlockedTimelineIds={unlockedTimelineIds}
              suspectNames={suspectNames}
            />
          ) : (
            <EvidencePanel
              evidenceList={currentCase.evidence}
              unlockedEvidenceIds={unlockedEvidenceIds}
              onInspectEvidence={(ev) => setActiveInspectingEvidence(ev)}
            />
          )}
        </section>
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden h-14 bg-[#0e121a] border-t border-[#1f2533] flex items-center justify-around px-2 z-30">
        <button
          onClick={() => setMobileTab('interrogate')}
          className={`flex flex-col items-center gap-1 text-[10px] font-mono-code ${
            mobileTab === 'interrogate' ? 'text-[#d4af37] font-bold' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Interrogate</span>
        </button>

        <button
          onClick={() => setMobileTab('suspects')}
          className={`flex flex-col items-center gap-1 text-[10px] font-mono-code ${
            mobileTab === 'suspects' ? 'text-[#d4af37] font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Suspects</span>
        </button>

        <button
          onClick={() => setMobileTab('evidence')}
          className={`flex flex-col items-center gap-1 text-[10px] font-mono-code ${
            mobileTab === 'evidence' ? 'text-[#d4af37] font-bold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Evidence</span>
        </button>

        <button
          onClick={() => setMobileTab('timeline')}
          className={`flex flex-col items-center gap-1 text-[10px] font-mono-code ${
            mobileTab === 'timeline' ? 'text-[#d4af37] font-bold' : 'text-slate-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timeline</span>
        </button>

        <button
          onClick={() => setIsNotebookOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-mono-code text-amber-300"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Notebook</span>
        </button>
      </nav>

      {/* MODALS */}
      {/* 1. Detective Notebook Modal */}
      <NotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        suspects={currentCase.suspects}
        evidenceList={currentCase.evidence}
        unlockedEvidenceIds={unlockedEvidenceIds}
        contradictions={currentCase.contradictions}
        discoveredContradictionIds={discoveredContradictionIds}
        timeline={currentCase.timeline}
        unlockedTimelineIds={unlockedTimelineIds}
      />

      {/* 2. Accusation Modal */}
      <AccusationModal
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        suspects={currentCase.suspects}
        unlockedEvidence={unlockedEvidenceObjects}
        onSubmitAccusation={handleSubmitAccusation}
        isEvaluating={isEvaluating}
      />

      {/* 3. Evidence Detail Inspection Modal */}
      <EvidenceDetailModal
        evidence={activeInspectingEvidence}
        onClose={() => setActiveInspectingEvidence(null)}
        suspectNames={suspectNames}
      />

      {/* 4. Relationships Modal */}
      <RelationshipsModal
        isOpen={isRelationshipsOpen}
        onClose={() => setIsRelationshipsOpen(false)}
        suspects={currentCase.suspects}
      />

      {/* 5. Ending Screen Modal */}
      {gameState === 'ended' && accusationResult && (
        <EndingModal
          result={accusationResult}
          onRestart={handleResetCase}
          onRevise={() => {
            setGameState('investigating');
            setIsAccusationOpen(true);
          }}
          onInspectNotebook={() => {
            setGameState('investigating');
            setIsNotebookOpen(true);
          }}
        />
      )}
    </div>
  );
}

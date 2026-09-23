export type Difficulty = 'easy' | 'normal' | 'hard';

export type SuspectId = 'evelyn_blackwood' | 'marcus_reed' | 'clara_moore' | 'daniel_cross' | 'sophia_grant';

export type EmotionalState = 'calm' | 'defensive' | 'nervous' | 'hesitant' | 'panicked' | 'smug';

export type EvidenceCategory = 'PHYSICAL' | 'DIGITAL' | 'TESTIMONY' | 'TIMELINE';

export interface Suspect {
  id: SuspectId;
  name: string;
  role: string;
  age: number;
  avatar: string;
  personality: string;
  initialEmotion: EmotionalState;
  publicClaim: string;
  trueLocation: string;
  secret: string;
  whatTheyKnow: string[];
  whatTheyDoNotKnow: string[];
  lies: string[];
  slipUps: string[];
  relationships: Record<string, string>;
}

export interface Evidence {
  id: string;
  name: string;
  category: EvidenceCategory;
  description: string;
  detailedAnalysis: string;
  timeDiscovered?: string;
  relatedSuspects: SuspectId[];
  isSecret?: boolean;
  unlockedAtStart?: boolean;
  unlockCondition?: string;
  iconType?: string;
}

export interface TimelineEntry {
  id: string;
  time: string;
  title: string;
  description: string;
  verified: boolean;
  relatedSuspects: SuspectId[];
  unlockedAtStart: boolean;
  source: string;
}

export interface Contradiction {
  id: string;
  title: string;
  suspectId: SuspectId;
  statementSnippet: string;
  conflictingEvidenceId: string;
  explanation: string;
  discovered: boolean;
}

export interface AccidentalClue {
  id: string;
  suspectId: SuspectId;
  triggerPhrase: string;
  slipContent: string;
  deductionHint: string;
  unlocked: boolean;
}

export interface CaseDefinition {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  location: string;
  crimeTime: string;
  briefing: {
    synopsis: string;
    victim: string;
    stolenItem: string;
    itemValue: string;
    circumstances: string;
  };
  suspects: Record<SuspectId, Suspect>;
  evidence: Evidence[];
  timeline: TimelineEntry[];
  contradictions: Contradiction[];
  accidentalClues: AccidentalClue[];
  trueSolution: {
    culpritId: SuspectId;
    culpritName: string;
    trueMotive: string;
    trueMethod: string;
    keyEvidenceIds: string[];
    fullTruthStory: string;
  };
}

export interface DialogueMessage {
  id: string;
  sender: 'detective' | 'suspect' | 'system';
  suspectId?: SuspectId;
  text: string;
  timestamp: string;
  isContradictionAlert?: boolean;
  contradictionId?: string;
  isSlipUp?: boolean;
  emotionalState?: EmotionalState;
}

export interface AccusationSubmission {
  culpritId: SuspectId;
  motive: string;
  method: string;
  evidenceIds: string[];
  naturalExplanation: string;
}

export type EndingType = 'PERFECT_SOLUTION' | 'CORRECT_CULPRIT' | 'PARTIAL_TRUTH' | 'WRONG_ACCUSATION' | 'FAILED_INVESTIGATION';

export interface AccusationResult {
  endingType: EndingType;
  score: number;
  badge: 'GOLD' | 'SILVER' | 'BRONZE' | 'FAILED';
  culpritCorrect: boolean;
  motiveCorrect: boolean;
  methodCorrect: boolean;
  evidenceScore: number;
  evaluatorFeedback: string;
  fullTruthStory: string;
}

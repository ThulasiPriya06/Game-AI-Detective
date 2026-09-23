import { CaseDefinition, Contradiction, Evidence, SuspectId } from '../types/case';

export interface DetectionResult {
  newlyDiscoveredContradiction?: Contradiction;
  accidentalSlipUp?: {
    id: string;
    suspectId: SuspectId;
    slipContent: string;
    deductionHint: string;
  };
  unlockedEvidenceId?: string;
  unlockedTimelineId?: string;
}

export class ContradictionDetector {
  /**
   * Scans a suspect's statement against the authoritative case definition,
   * current discovered evidence, and established facts.
   */
  static analyze(
    caseDef: CaseDefinition,
    suspectId: SuspectId,
    suspectResponse: string,
    unlockedEvidenceIds: string[],
    alreadyDiscoveredContradictionIds: string[]
  ): DetectionResult {
    const textLower = suspectResponse.toLowerCase();
    const result: DetectionResult = {};

    // 1. Check Contradictions based on conflicting evidence already in player's possession
    for (const contra of caseDef.contradictions) {
      if (contra.suspectId !== suspectId) continue;
      if (alreadyDiscoveredContradictionIds.includes(contra.id)) continue;

      const hasConflictingEvidence = unlockedEvidenceIds.includes(contra.conflictingEvidenceId);

      // Check if statement touches upon the topic of the contradiction
      let matchesTopic = false;
      if (suspectId === 'marcus_reed') {
        matchesTopic = textLower.includes('never left') || textLower.includes('at my post') || 
                       textLower.includes('entire night') || textLower.includes('console') ||
                       textLower.includes('terrace') || textLower.includes('smoke');
      } else if (suspectId === 'daniel_cross') {
        matchesTopic = textLower.includes('library all') || textLower.includes('never left the library') ||
                       textLower.includes('pantry') || textLower.includes('alone in the library') ||
                       textLower.includes('cufflink');
      } else if (suspectId === 'evelyn_blackwood') {
        matchesTopic = textLower.includes('keycard') || textLower.includes('never swiped') ||
                       textLower.includes('bedroom all night') || textLower.includes('phone');
      } else if (suspectId === 'clara_moore') {
        matchesTopic = textLower.includes('alone in the kitchen') || textLower.includes('no one visited') ||
                       textLower.includes('pantry');
      } else if (suspectId === 'sophia_grant') {
        matchesTopic = textLower.includes('painting') || textLower.includes('cushion') ||
                       textLower.includes('wall safe') || textLower.includes('never touched') ||
                       textLower.includes('lavender');
      }

      if (matchesTopic && hasConflictingEvidence) {
        result.newlyDiscoveredContradiction = contra;
        break;
      }
    }

    // 2. Check Accidental Slip-Ups
    for (const clue of caseDef.accidentalClues) {
      if (clue.suspectId === suspectId) {
        const trigger = clue.triggerPhrase.toLowerCase();
        if (textLower.includes(trigger) || (clue.id === 'slip_sophia_painting' && textLower.includes('painting')) ||
            (clue.id === 'slip_sophia_cushion' && (textLower.includes('cushion') || textLower.includes('velvet'))) ||
            (clue.id === 'slip_daniel_tea' && textLower.includes('tea'))) {
          result.accidentalSlipUp = {
            id: clue.id,
            suspectId: clue.suspectId,
            slipContent: clue.slipContent,
            deductionHint: clue.deductionHint,
          };
          break;
        }
      }
    }

    // 3. Check Dynamic Evidence Unlocking based on dialogue keywords
    if (suspectId === 'marcus_reed') {
      if ((textLower.includes('smoke') || textLower.includes('terrace') || textLower.includes('outside') || textLower.includes('cigarette')) &&
          !unlockedEvidenceIds.includes('ev_terrace_cigarette')) {
        result.unlockedEvidenceId = 'ev_terrace_cigarette';
        result.unlockedTimelineId = 'tl_5';
      }
    } else if (suspectId === 'clara_moore') {
      if ((textLower.includes('daniel') || textLower.includes('pantry') || textLower.includes('wine') || textLower.includes('cufflink')) &&
          !unlockedEvidenceIds.includes('ev_pantry_cufflink')) {
        result.unlockedEvidenceId = 'ev_pantry_cufflink';
        result.unlockedTimelineId = 'tl_4';
      } else if ((textLower.includes('hallway') || textLower.includes('shawl') || textLower.includes('figure') || textLower.includes('saw someone')) &&
                 !unlockedEvidenceIds.includes('ev_clara_sighting')) {
        result.unlockedEvidenceId = 'ev_clara_sighting';
        result.unlockedTimelineId = 'tl_7';
      }
    } else if (suspectId === 'daniel_cross') {
      if ((textLower.includes('pantry') || textLower.includes('clara') || textLower.includes('cufflink')) &&
          !unlockedEvidenceIds.includes('ev_pantry_cufflink')) {
        result.unlockedEvidenceId = 'ev_pantry_cufflink';
        result.unlockedTimelineId = 'tl_4';
      }
    } else if (suspectId === 'evelyn_blackwood') {
      if ((textLower.includes('phone') || textLower.includes('call') || textLower.includes('vance') || textLower.includes('debt') || textLower.includes('money')) &&
          !unlockedEvidenceIds.includes('ev_evelyn_phone_log')) {
        result.unlockedEvidenceId = 'ev_evelyn_phone_log';
      }
    } else if (suspectId === 'sophia_grant') {
      if ((textLower.includes('archive') || textLower.includes('encyclopedia') || textLower.includes('book') || textLower.includes('shelf')) &&
          !unlockedEvidenceIds.includes('ev_archive_encyclopedia')) {
        result.unlockedEvidenceId = 'ev_archive_encyclopedia';
        result.unlockedTimelineId = 'tl_10';
      } else if ((textLower.includes('cipher') || textLower.includes('code') || textLower.includes('combination') || textLower.includes('ledger') || textLower.includes('insurance')) &&
                 !unlockedEvidenceIds.includes('ev_sophia_notebook')) {
        result.unlockedEvidenceId = 'ev_sophia_notebook';
      }
    }

    return result;
  }
}

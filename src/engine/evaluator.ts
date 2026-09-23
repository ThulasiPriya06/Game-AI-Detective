import { AccusationResult, AccusationSubmission, CaseDefinition } from '../types/case';

export class CaseEvaluator {
  static evaluate(
    caseDef: CaseDefinition,
    submission: AccusationSubmission
  ): AccusationResult {
    const { trueSolution } = caseDef;
    const culpritCorrect = submission.culpritId === trueSolution.culpritId;

    // Motive evaluation
    const motiveLower = submission.motive.toLowerCase() + ' ' + submission.naturalExplanation.toLowerCase();
    const motiveMatches = 
      motiveLower.includes('dismiss') ||
      motiveLower.includes('fire') ||
      motiveLower.includes('falsif') ||
      motiveLower.includes('ruin') ||
      motiveLower.includes('severance') ||
      motiveLower.includes('flee') ||
      motiveLower.includes('escape') ||
      motiveLower.includes('revenge') ||
      motiveLower.includes('mistreat') ||
      motiveLower.includes('financial') ||
      motiveLower.includes('start a new life') ||
      submission.motive.includes('dismissal');

    // Method evaluation
    const methodLower = submission.method.toLowerCase() + ' ' + submission.naturalExplanation.toLowerCase();
    let methodPoints = 0;
    if (methodLower.includes('cipher') || methodLower.includes('combination') || methodLower.includes('code') || methodLower.includes('insurance') || methodLower.includes('ledger')) {
      methodPoints += 2;
    }
    if (methodLower.includes('keycard') || methodLower.includes('evelyn') || methodLower.includes('frame') || methodLower.includes('shawl')) {
      methodPoints += 2;
    }
    if (methodLower.includes('camera') || methodLower.includes('marcus') || methodLower.includes('smoke') || methodLower.includes('breaker') || methodLower.includes('post')) {
      methodPoints += 1;
    }
    if (methodLower.includes('archive') || methodLower.includes('encyclopedia') || methodLower.includes('book') || methodLower.includes('safe dial')) {
      methodPoints += 2;
    }
    const methodCorrect = methodPoints >= 3;

    // Evidence evaluation
    let evidencePoints = 0;
    for (const evId of submission.evidenceIds) {
      if (trueSolution.keyEvidenceIds.includes(evId)) {
        evidencePoints += 1;
      }
    }
    const evidenceScore = Math.min(100, Math.round((evidencePoints / Math.max(1, trueSolution.keyEvidenceIds.length)) * 100));

    // Calculate overall score
    let score = 0;
    if (culpritCorrect) {
      score += 45;
      if (motiveMatches) score += 20;
      if (methodCorrect) score += 20;
      score += Math.round((evidenceScore / 100) * 15);
    } else {
      // Partial credit if they uncovered real secrets (e.g. Daniel's embezzlement or Marcus's cigarette)
      if (submission.culpritId === 'daniel_cross' && (motiveLower.includes('embezzle') || motiveLower.includes('audit'))) {
        score = 45;
      } else if (submission.culpritId === 'evelyn_blackwood' && (motiveLower.includes('debt') || motiveLower.includes('gamble'))) {
        score = 35;
      } else {
        score = 15;
      }
    }

    score = Math.max(10, Math.min(100, score));

    // Determine ending type
    let endingType: AccusationResult['endingType'];
    let badge: AccusationResult['badge'];
    let feedback = '';

    if (culpritCorrect && score >= 90) {
      endingType = 'PERFECT_SOLUTION';
      badge = 'GOLD';
      feedback = 'Brilliant deductions, Detective! You saw through Sophia\'s timid facade, exposed her calculated scheme to frame Evelyn with the keycard and shawl, linked her access to the confidential vault cipher, and located the hidden gem in the library archives.';
    } else if (culpritCorrect && score >= 65) {
      endingType = 'CORRECT_CULPRIT';
      badge = 'SILVER';
      feedback = 'You correctly identified Sophia Grant as the thief! While your motive or method reconstruction missed a few subtle elements, your primary accusation held firm and Lord Blackwood\'s diamond was safely recovered.';
    } else if (score >= 40) {
      endingType = 'PARTIAL_TRUTH';
      badge = 'BRONZE';
      feedback = 'You uncovered genuine misconduct and secret rendezvous within Blackwood Mansion, but the true thief slipped away right under your nose while you chased an innocent party\'s private secrets.';
    } else if (score >= 20) {
      endingType = 'WRONG_ACCUSATION';
      badge = 'FAILED';
      feedback = 'An innocent person was wrongfully condemned! You fell directly into the culprit\'s calculated frame-up trap, mistaking circumstantial misdirection for genuine guilt.';
    } else {
      endingType = 'FAILED_INVESTIGATION';
      badge = 'FAILED';
      feedback = 'Your case lacked necessary evidentiary backing. The district attorney dismissed your charges for lack of probable cause, and the real thief escaped across the border.';
    }

    return {
      endingType,
      score,
      badge,
      culpritCorrect,
      motiveCorrect: motiveMatches,
      methodCorrect,
      evidenceScore,
      evaluatorFeedback: feedback,
      fullTruthStory: trueSolution.fullTruthStory,
    };
  }
}

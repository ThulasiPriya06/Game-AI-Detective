import { CaseDefinition } from '../types/case';
import { CASE_001 } from './case001';

export const CASE_REGISTRY: Record<string, CaseDefinition> = {
  case_001: CASE_001,
};

export function getCase(caseId: string = 'case_001'): CaseDefinition {
  return CASE_REGISTRY[caseId] || CASE_001;
}

export function getAllCasesSummary() {
  return Object.values(CASE_REGISTRY).map(c => ({
    id: c.id,
    caseNumber: c.caseNumber,
    title: c.title,
    location: c.location,
    crimeTime: c.crimeTime,
    stolenItem: c.briefing.stolenItem,
  }));
}

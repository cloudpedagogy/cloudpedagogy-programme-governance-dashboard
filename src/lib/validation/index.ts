import type { CombinedDataset } from '../../types';

export interface ValidationIssue {
  severity: 'warning' | 'error';
  category: 'id' | 'reference' | 'missing' | 'structure';
  message: string;
}

export function validateDataset(dataset: CombinedDataset): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!dataset) return issues;

  const moduleIds = new Set<string>();
  const outcomeIds = new Set<string>();
  const assessmentIds = new Set<string>();

  // 1. Check for Duplicate IDs and populate known IDs
  dataset.modules?.forEach(m => {
    if (moduleIds.has(m.id)) issues.push({ severity: 'error', category: 'id', message: `Duplicate Module ID detected: ${m.id}` });
    moduleIds.add(m.id);
  });
  dataset.outcomes?.forEach(o => {
    if (outcomeIds.has(o.id)) issues.push({ severity: 'error', category: 'id', message: `Duplicate Outcome ID detected: ${o.id}` });
    outcomeIds.add(o.id);
  });
  dataset.assessments?.forEach(a => {
    if (assessmentIds.has(a.id)) issues.push({ severity: 'error', category: 'id', message: `Duplicate Assessment ID detected: ${a.id}` });
    assessmentIds.add(a.id);
  });

  // 2. Missing References
  dataset.outcomes?.forEach(o => {
    o.alignedAssessments?.forEach(aid => {
      if (!assessmentIds.has(aid)) {
        issues.push({ severity: 'error', category: 'reference', message: `Outcome ${o.id} references missing Assessment ${aid}` });
      }
    });
  });

  dataset.assessments?.forEach(a => {
    a.linkedOutcomes?.forEach(oid => {
      if (!outcomeIds.has(oid)) {
        issues.push({ severity: 'error', category: 'reference', message: `Assessment ${a.id} references missing Outcome ${oid}` });
      }
    });
    if (a.week !== undefined && (a.week < 1 || a.week > 52)) {
      issues.push({ severity: 'warning', category: 'structure', message: `Assessment ${a.id} has an invalid week value: ${a.week}` });
    }
  });

  dataset.programmes?.forEach(p => {
    p.modules?.forEach(m => {
      if (!moduleIds.has(m.id)) {
        issues.push({ severity: 'error', category: 'reference', message: `Programme ${p.id} references missing Module ${m.id}` });
      }
    });
  });

  // 3. Completeness checks (Warnings)
  if (!dataset.programmes || dataset.programmes.length === 0) {
    issues.push({ severity: 'warning', category: 'missing', message: 'Dataset contains no programmes.' });
  }

  return issues;
}

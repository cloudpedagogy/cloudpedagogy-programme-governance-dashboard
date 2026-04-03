import type { CombinedDataset } from '../../types';

// A. Module Reuse Rate
export function calculateModuleReuse(dataset: CombinedDataset) {
  const { modules, programmes } = dataset;
  let sharedModuleCount = 0;
  let singleUseModuleCount = 0;
  let heavilyUsedModuleCount = 0;
  let totalProgrammesPerShared = 0;
  const sharedModulesList: { id: string, title: string, uses: number }[] = [];

  modules.forEach(mod => {
    const usingProgrammes = programmes.filter(p => p.modules.some(m => m.id === mod.id)).length;
    if (usingProgrammes > 1) {
      sharedModuleCount++;
      totalProgrammesPerShared += usingProgrammes;
      sharedModulesList.push({ id: mod.id, title: mod.title, uses: usingProgrammes });
    }
    if (usingProgrammes === 1) singleUseModuleCount++;
    if (usingProgrammes >= 3) heavilyUsedModuleCount++;
  });

  const totalModules = modules.length;
  const reuseRate = totalModules === 0 ? 0 : (sharedModuleCount / totalModules) * 100;
  const avgProgrammesPerShared = sharedModuleCount === 0 ? 0 : (totalProgrammesPerShared / sharedModuleCount);

  return {
    reuseRate,
    sharedModuleCount,
    singleUseModuleCount,
    heavilyUsedModuleCount,
    avgProgrammesPerShared,
    sharedModulesList: sharedModulesList.sort((a, b) => b.uses - a.uses)
  };
}

// B. Outcome Alignment Score
export function calculateOutcomeAlignment(dataset: CombinedDataset) {
  const { outcomes, modules } = dataset;
  
  let totalScore = 0;
  const unlinkedOutcomes: string[] = [];
  const unassessedOutcomes: string[] = [];
  const overconcentratedOutcomes: string[] = [];

  outcomes.forEach(outcome => {
    // hasModuleLink
    const moduleLinks = modules.filter(m => m.outcomes.some(o => o.id === outcome.id)).length;
    const hasModuleLink = moduleLinks > 0 ? 0.4 : 0;
    if (moduleLinks === 0) unlinkedOutcomes.push(outcome.id);

    // hasAssessmentLink
    const hasAssessmentLink = outcome.alignedAssessments.length > 0 ? 0.4 : 0;
    if (outcome.alignedAssessments.length === 0) unassessedOutcomes.push(outcome.id);

    // isNotOverconcentrated (aligned to > 3 assessments is considered overconcentrated for this logic)
    const isConcentrated = outcome.alignedAssessments.length > 3;
    const isNotOverconcentrated = isConcentrated ? 0 : 0.2;
    if (isConcentrated) overconcentratedOutcomes.push(outcome.id);

    totalScore += (hasModuleLink + hasAssessmentLink + isNotOverconcentrated);
  });

  const avgScore = outcomes.length === 0 ? 0 : (totalScore / outcomes.length) * 100;

  return {
    alignmentScore: avgScore,
    unlinkedOutcomes,
    unassessedOutcomes,
    overconcentratedOutcomes
  };
}

// C. Assessment Load Balance
export function calculateAssessmentLoad(dataset: CombinedDataset) {
  const { assessments } = dataset;
  
  const weeklyCounts: Record<number, number> = {};
  const typeDistribution: Record<string, number> = {};
  let overloadedWeeks = 0;
  const weekRisk: Record<number, 'low' | 'moderate' | 'high'> = {};

  assessments.forEach(ass => {
    const w = ass.week || 1; // fallback
    weeklyCounts[w] = (weeklyCounts[w] || 0) + 1;
    typeDistribution[ass.type] = (typeDistribution[ass.type] || 0) + 1;
  });

  Object.entries(weeklyCounts).forEach(([weekStr, count]) => {
    const w = parseInt(weekStr, 10);
    if (count <= 1) weekRisk[w] = 'low';
    else if (count === 2) weekRisk[w] = 'moderate';
    else {
      weekRisk[w] = 'high';
      overloadedWeeks++;
    }
  });

  // Load balance score out of 100: penalize overloaded weeks
  const totalWeeks = Object.keys(weeklyCounts).length;
  const loadBalanceScore = totalWeeks === 0 ? 100 : Math.max(0, 100 - (overloadedWeeks * 10));

  return {
    loadBalanceScore,
    overloadedWeeks,
    weeklyCounts,
    weekRisk,
    typeDistribution
  };
}

// D. Governance Completeness
export function calculateGovernanceCompleteness(dataset: CombinedDataset) {
  const { modules, governanceMetadata } = dataset;
  
  const moduleScores: Record<string, number> = {};
  let totalScore = 0;

  modules.forEach(mod => {
    const meta = governanceMetadata[mod.id];
    let score = 0;
    if (meta) {
      const doc = meta.documentedOutcomes ?? 0;
      const mapping = meta.assessmentMapping ?? 0;
      const dep = meta.dependencyClarity ?? 0;
      const align = meta.programmeAlignmentEvidence ?? 0;
      score = (doc + mapping + dep + align) / 4;
    }
    moduleScores[mod.id] = score;
    totalScore += score;
  });

  const systemWideAggregate = modules.length === 0 ? 0 : (totalScore / modules.length) * 100;

  // For programme-level aggregates
  const programmeAggregates: Record<string, number> = {};
  dataset.programmes.forEach(prog => {
    let pScore = 0;
    prog.modules.forEach(m => {
      pScore += (moduleScores[m.id] || 0);
    });
    programmeAggregates[prog.id] = prog.modules.length === 0 ? 0 : (pScore / prog.modules.length) * 100;
  });

  return {
    systemWideAggregate,
    moduleScores,
    programmeAggregates
  };
}

// E. AI Governance Signals
export function calculateAIGovernance(dataset: CombinedDataset) {
  const records = dataset.aiGovernanceRecords || [];
  
  // Total potential entities we might care about (programmes + modules + outcomes + assessments)
  const totalEntities = dataset.programmes.length + dataset.modules.length + dataset.outcomes.length + dataset.assessments.length;
  
  // A. AI Visibility Rate
  const visibilityRate = totalEntities === 0 ? 0 : (records.length / totalEntities) * 100;
  
  // B. Human Review Signal
  const aiUsedRecords = records.filter(r => r.aiUsed);
  const humanReviewedCount = aiUsedRecords.filter(r => r.humanReviewed).length;
  const humanReviewSignal = aiUsedRecords.length === 0 ? 0 : (humanReviewedCount / aiUsedRecords.length) * 100;

  // C. Traceability Signal
  let traceabilityScore = 0;
  aiUsedRecords.forEach(r => {
    let score = 0;
    if (r.rationaleRecorded) score += 0.33;
    if (r.accountabilityNamed) score += 0.33;
    if (r.sourceMaterialChecked) score += 0.34;
    traceabilityScore += score;
  });
  const traceabilitySignal = aiUsedRecords.length === 0 ? 0 : (traceabilityScore / aiUsedRecords.length) * 100;

  // D. AI Oversight Readiness
  let oversightScore = 0;
  aiUsedRecords.forEach(r => {
    let score = 0;
    if (r.humanReviewed) score += 0.2;
    if (r.rationaleRecorded) score += 0.2;
    if (r.sourceMaterialChecked) score += 0.2;
    if (r.outputModifiedByHuman) score += 0.2;
    if (r.accountabilityNamed) score += 0.2;
    oversightScore += score;
  });
  const oversightReadiness = aiUsedRecords.length === 0 ? 0 : (oversightScore / aiUsedRecords.length) * 100;

  return {
    visibilityRate,
    humanReviewSignal,
    traceabilitySignal,
    oversightReadiness,
    totalRecords: records.length,
    activeAIRecords: aiUsedRecords.length
  };
}

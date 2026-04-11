import type { CombinedDataset, Module } from '../../types';

export type RAGStatus = 'red' | 'amber' | 'green';

export interface ModuleHealthDetail {
  moduleId: string;
  code: string;
  status: RAGStatus;
  outcomeAssessedPct: number;
  skillsAlignedCount: number;
  assessmentsPerOutcome: number;
  reason?: string;
}

export interface ProgrammeHealth {
  overallScore: number;
  outcomesAssessedPct: number;
  modulesAlignedPct: number;
  riskProfile: {
    red: number;
    amber: number;
    green: number;
  };
  details: ModuleHealthDetail[];
}

export const calculateModuleHealth = (module: Module): ModuleHealthDetail => {
  const { outcomes, assessments, skills } = module;
  
  const totalOutcomes = outcomes.length;
  const unassessedOutcomes = outcomes.filter(o => o.alignedAssessments.length === 0);
  const outcomeAssessedPct = totalOutcomes > 0 
    ? ((totalOutcomes - unassessedOutcomes.length) / totalOutcomes) * 100 
    : 100;

  const assessmentsPerOutcome = totalOutcomes > 0 
    ? assessments.length / totalOutcomes 
    : 0;

  const skillsAlignedCount = skills.length;

  let status: RAGStatus = 'green';
  let reason = '';

  if (unassessedOutcomes.length > 0) {
    status = 'red';
    reason = `${unassessedOutcomes.length} unassessed outcomes`;
  } else if (skillsAlignedCount === 0) {
    status = 'red';
    reason = '0 skills aligned';
  } else if (assessmentsPerOutcome < 1.0) {
    status = 'amber';
    reason = 'low assessment density';
  }

  return {
    moduleId: module.id,
    code: module.code,
    status,
    outcomeAssessedPct,
    skillsAlignedCount,
    assessmentsPerOutcome,
    reason
  };
};

export const calculateProgrammeHealth = (dataset: CombinedDataset): ProgrammeHealth => {
  const { modules } = dataset;
  
  const details = modules.map(calculateModuleHealth);
  
  const red = details.filter(d => d.status === 'red').length;
  const amber = details.filter(d => d.status === 'amber').length;
  const green = details.filter(d => d.status === 'green').length;

  const modulesAligned = details.filter(d => d.skillsAlignedCount > 0).length;
  const modulesAlignedPct = modules.length > 0 ? (modulesAligned / modules.length) * 100 : 100;

  const totalOutcomes = dataset.outcomes.length;
  const unassessedOutcomes = dataset.outcomes.filter(o => o.alignedAssessments.length === 0).length;
  const outcomesAssessedPct = totalOutcomes > 0 ? ((totalOutcomes - unassessedOutcomes) / totalOutcomes) * 100 : 100;

  const overallScore = (outcomesAssessedPct + modulesAlignedPct) / 2;

  return {
    overallScore,
    outcomesAssessedPct,
    modulesAlignedPct,
    riskProfile: { red, amber, green },
    details
  };
};

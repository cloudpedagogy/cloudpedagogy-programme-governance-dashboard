import type { CombinedDataset, Programme, Module, Outcome, Assessment, Snapshot, GovernanceMetadata, AIGovernanceRecord } from '../../types';

// Generate 20 Outcomes
const outcomes: Outcome[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `out-${i + 1}`,
  description: `Outcome ${i + 1}: Analyze and implement complex systems.`,
  alignedAssessments: [`ass-${i + 1}`],
}));

// Generate 20 Assessments
const assessments: Assessment[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `ass-${i + 1}`,
  type: i % 2 === 0 ? 'Coursework' : 'Exam',
  weighting: 50,
  linkedOutcomes: [`out-${i + 1}`, `out-${(i + 1) % 20 + 1}`], // multiple outcomes for variety
  week: (i % 5) + 1, // distribute evenly between weeks 1 and 5
}));

// Generate 12 Modules (4 of them are shared)
const modules: Module[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `mod-${i + 1}`,
  code: `CS${100 + i}`,
  title: `Module ${i + 1} Title`,
  credits: 15,
  outcomes: [outcomes[i], outcomes[(i + 1) % 20]],
  assessments: [assessments[i], assessments[(i + 1) % 20]],
  skills: [{ id: `sk-${i + 1}`, name: `Skill ${i + 1}`, level: 'intermediate' }],
}));

const governanceMetadata: Record<string, GovernanceMetadata> = {};
modules.forEach((mod, i) => {
  governanceMetadata[mod.id] = {
    lastReviewed: '2026-03-15',
    reviewer: 'Prof. Governance',
    status: 'approved',
    version: '1.0.0',
    documentedOutcomes: (i % 4 === 0) ? 0.5 : 1, // some weak docs
    assessmentMapping: (i % 3 === 0) ? 0.6 : 0.9,
    dependencyClarity: 0.8,
    programmeAlignmentEvidence: 1,
  };
});

// 3 Programmes
// Shared modules: mod-1, mod-2, mod-3, mod-4
const programmes: Programme[] = [
  {
    id: 'prog-001',
    title: 'BSc Computer Science',
    description: 'Undergraduate degree focusing on computing fundamentals.',
    modules: [modules[0], modules[1], modules[2], modules[3], modules[4], modules[5], modules[6]],
    metadata: { lastReviewed: '2026-01-10', reviewer: 'Dr. Alan', status: 'approved', version: '2.0' }
  },
  {
    id: 'prog-002',
    title: 'BSc Software Engineering',
    description: 'Focused on large-scale software systems.',
    modules: [modules[0], modules[1], modules[7], modules[8], modules[9]], // Uses shared modules 1 and 2
    metadata: { lastReviewed: '2026-02-12', reviewer: 'Dr. Turing', status: 'approved', version: '1.5' }
  },
  {
    id: 'prog-003',
    title: 'MSc Artificial Intelligence',
    description: 'Postgraduate degree in AI methodologies.',
    modules: [modules[2], modules[3], modules[10], modules[11]], // Uses shared modules 3 and 4
    metadata: { lastReviewed: '2026-04-01', reviewer: 'Dr. Ada', status: 'draft', version: '0.9' }
  }
];

const aiGovernanceRecords: AIGovernanceRecord[] = [
  {
    id: 'aigov-1',
    entityType: 'module',
    entityId: 'mod-1',
    aiUsed: true,
    aiUseType: ['mapping', 'analysis'],
    humanReviewed: true,
    rationaleRecorded: true,
    sourceMaterialChecked: true,
    outputModifiedByHuman: true,
    accountabilityNamed: true,
    notes: 'AI used to cross-reference module outcomes against national guidelines.',
    reviewedBy: 'Dr. Alan',
    reviewDate: '2026-03-12',
  },
  {
    id: 'aigov-2',
    entityType: 'outcome',
    entityId: 'out-1',
    aiUsed: true,
    aiUseType: ['drafting'],
    humanReviewed: false,
    rationaleRecorded: false,
    sourceMaterialChecked: false,
    outputModifiedByHuman: false,
    accountabilityNamed: false,
  },
  {
    id: 'aigov-3',
    entityType: 'assessment',
    entityId: 'ass-3',
    aiUsed: true,
    aiUseType: ['scenario_generation'],
    humanReviewed: true,
    rationaleRecorded: false,
    sourceMaterialChecked: true,
    outputModifiedByHuman: true,
    accountabilityNamed: true,
  },
];

export const demoDataset: CombinedDataset = {
  programmes,
  modules,
  outcomes,
  assessments,
  skills: [], // Simplification
  governanceMetadata,
  aiGovernanceRecords,
};

export const demoSnapshots: Snapshot[] = [
  {
    id: 'snap-001',
    timestamp: '2025-10-01T10:00:00Z',
    programmeId: 'prog-001',
    metrics: {
      moduleReuseRate: 35,
      outcomeAlignmentScore: 88,
      assessmentLoadBalance: 72,
      governanceCompleteness: 94,
    }
  },
  {
    id: 'snap-002',
    timestamp: new Date().toISOString(),
    programmeId: 'prog-001',
    metrics: {
      moduleReuseRate: 40,
      outcomeAlignmentScore: 92,
      assessmentLoadBalance: 75,
      governanceCompleteness: 98,
    }
  }
];

// For backward compatibility while refactoring
export const demoProgramme = programmes[0];
export const demoSnapshot = demoSnapshots[1];

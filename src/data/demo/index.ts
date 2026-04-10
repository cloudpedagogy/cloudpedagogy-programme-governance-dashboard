import type { CombinedDataset, Programme, Module, Outcome, Assessment, Snapshot, GovernanceMetadata, AIGovernanceRecord } from '../../types';

// Generate 20 Outcomes
const outcomes: Outcome[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `out-${i + 1}`,
  description: [
    'Analyze and interpret epidemiological data patterns.',
    'Evaluate community health intervention frameworks.',
    'Apply biostatistical methods to population datasets.',
    'Assess environmental risk factors in urban populations.',
    'Develop evidence-based health promotion strategies.',
    'Design infectious disease surveillance protocols.',
    'Evaluate global health policy impact on local systems.',
    'Analyze social determinants of health outcomes.',
    'Apply ethical frameworks to public health decision-making.',
    'Synthesize research evidence for policy briefs.'
  ][i % 10] + ` (Metric Group ${Math.floor(i/10) + 1})`,
  alignedAssessments: [`ass-${i + 1}`],
}));

// Generate 20 Assessments
const assessments: Assessment[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `ass-${i + 1}`,
  type: i % 2 === 0 ? 'Policy Brief' : 'Case Study Exam',
  weighting: 50,
  linkedOutcomes: [`out-${i + 1}`, `out-${(i + 1) % 20 + 1}`],
  week: (i % 5) + 6, // Focused on mid-to-late term clustering
}));

const moduleData = [
  { code: 'PH101', title: 'Foundations of Public Health' },
  { code: 'PH102', title: 'Principles of Epidemiology' },
  { code: 'PH103', title: 'Biostatistics for Health Research' },
  { code: 'PH104', title: 'Health Promotion & Prevention' },
  { code: 'PH105', title: 'Environmental Health Science' },
  { code: 'PH106', title: 'Global Health Systems & Policy' },
  { code: 'PH107', title: 'Social Determinants of Health' },
  { code: 'PH108', title: 'Health Economics & Resource Allocation' },
  { code: 'PH109', title: 'Research Methods in Public Health' },
  { code: 'PH110', title: 'Infectious Disease Management' },
  { code: 'PH111', title: 'Chronic Disease Prevention' },
  { code: 'PH112', title: 'Ethics in Public Health Practice' },
];

// Generate 12 Modules
const modules: Module[] = moduleData.map((data, i) => ({
  id: `mod-${i + 1}`,
  code: data.code,
  title: data.title,
  credits: 15,
  outcomes: [outcomes[i], outcomes[(i + 1) % 20]],
  assessments: [assessments[i], assessments[(i + 1) % 20]],
  skills: [{ id: `sk-${i + 1}`, name: `Health Literacy L${i % 3 + 1}`, level: 'intermediate' }],
}));

const governanceMetadata: Record<string, GovernanceMetadata> = {};
modules.forEach((mod, i) => {
  governanceMetadata[mod.id] = {
    lastReviewed: '2026-03-20',
    reviewer: i % 2 === 0 ? 'Dr. John Snow' : 'Dr. Sarah Gilbert',
    status: 'approved',
    version: '1.2.0',
    documentedOutcomes: (i % 5 === 0) ? 0.4 : 1, // some missing outcome evidence
    assessmentMapping: (i % 4 === 0) ? 0.7 : 1.0,
    dependencyClarity: 0.9,
    programmeAlignmentEvidence: 1,
  };
});

// 3 Public Health Programmes
const programmes: Programme[] = [
  {
    id: 'prog-001',
    title: 'BSc Public Health',
    description: 'Undergraduate foundation in population health, epidemiology, and healthcare systems.',
    modules: [modules[0], modules[1], modules[2], modules[3], modules[4], modules[5], modules[6]],
    metadata: { lastReviewed: '2026-01-15', reviewer: 'Dr. John Snow', status: 'approved', version: '3.0' }
  },
  {
    id: 'prog-002',
    title: 'MSc Epidemiology & Biostatistics',
    description: 'Advanced postgraduate training in quantitative health research and data surveillance.',
    modules: [modules[0], modules[1], modules[7], modules[8], modules[9]], 
    metadata: { lastReviewed: '2026-02-20', reviewer: 'Dr. Sarah Gilbert', status: 'approved', version: '2.1' }
  },
  {
    id: 'prog-003',
    title: 'MA Global Health Policy',
    description: 'Policy-focused study of international health governance and crisis management.',
    modules: [modules[2], modules[3], modules[10], modules[11]], 
    metadata: { lastReviewed: '2026-03-25', reviewer: 'Dr. Margaret Chan', status: 'draft', version: '0.8' }
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
    notes: 'AI used to cross-reference module outcomes against WHO Global Health Competency frameworks.',
    reviewedBy: 'Dr. John Snow',
    reviewDate: '2026-03-18',
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
    rationaleRecorded: true,
    sourceMaterialChecked: true,
    outputModifiedByHuman: true,
    accountabilityNamed: true,
    notes: 'Epidemiological scenario generated via AI; reviewed and verified by faculty for pedagogical rigor.',
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

export interface Programme {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  metadata: GovernanceMetadata;
}

export interface Module {
  id: string;
  code: string;
  title: string;
  credits: number;
  outcomes: Outcome[];
  assessments: Assessment[];
  skills: Skill[];
}

export interface Outcome {
  id: string;
  description: string;
  alignedAssessments: string[];
}

export interface Assessment {
  id: string;
  type: string;
  weighting: number;
  linkedOutcomes: string[];
  week?: number; // Optional until older data is fully migrated to it
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface GovernanceMetadata {
  lastReviewed: string;
  reviewer: string;
  status: 'draft' | 'approved' | 'archived';
  version: string;
  documentedOutcomes?: number; // 0 to 1 score
  assessmentMapping?: number; // 0 to 1 score
  dependencyClarity?: number; // 0 to 1 score
  programmeAlignmentEvidence?: number; // 0 to 1 score
}

export interface Snapshot {
  id: string;
  name?: string;
  timestamp: string;
  programmeId?: string; // Optional if saving full system state
  metrics: {
    moduleReuseRate: number;
    outcomeAlignmentScore: number;
    assessmentLoadBalance: number;
    governanceCompleteness: number;
    riskProfile?: {
      red: number;
      amber: number;
      green: number;
    };
  };
  structuralCounts?: {
    programmes: number;
    modules: number;
    sharedModules: number;
    outcomes: number;
    unassessedOutcomes: number;
    assessments: number;
    overloadedWeeks: number;
  };
}

export interface DecisionRecord {
  id: string;
  entityType: 'programme' | 'module' | 'outcome' | 'assessment';
  entityId: string;
  decisionMaker: string;
  status: 'draft' | 'proposed' | 'approved' | 'rejected';
  rationale: string;
  timestamp: string;
  evidenceReference?: string;
}

export type AIGovernanceRecord = {
  id: string;
  entityType: "programme" | "module" | "outcome" | "assessment" | "snapshot";
  entityId: string;
  aiUsed: boolean;
  aiUseType?: (
    | "drafting"
    | "mapping"
    | "analysis"
    | "summarisation"
    | "feedback_structuring"
    | "scenario_generation"
    | "other"
  )[];
  humanReviewed: boolean;
  rationaleRecorded: boolean;
  sourceMaterialChecked: boolean;
  outputModifiedByHuman: boolean;
  accountabilityNamed: boolean;
  notes?: string;
  reviewedBy?: string;
  reviewDate?: string;
};

export interface CombinedDataset {
  programmes: Programme[];
  modules: Module[];
  outcomes: Outcome[];
  assessments: Assessment[];
  skills: Skill[];
  governanceMetadata: Record<string, GovernanceMetadata>; // e.g. keyed by module ID
  aiGovernanceRecords?: AIGovernanceRecord[];
  decisionRecords?: DecisionRecord[];
  capabilityNotes?: string;
  governanceNotes?: string;
}

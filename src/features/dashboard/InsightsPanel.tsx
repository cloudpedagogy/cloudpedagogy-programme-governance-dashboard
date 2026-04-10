import type { CombinedDataset } from '../../types';
import {
  calculateModuleReuse,
  calculateOutcomeAlignment,
  calculateAssessmentLoad,
  calculateGovernanceCompleteness
} from '../../lib/metrics';
import type { DetailItem } from '../../components/DetailPanel';

interface Insight {
  id: string;
  severity: 'info' | 'attention' | 'concern';
  message: string;
  detailItem?: DetailItem;
}

interface InsightsPanelProps {
  dataset: CombinedDataset;
  onSelectDetail?: (item: DetailItem) => void;
}

export function InsightsPanel({ dataset, onSelectDetail }: InsightsPanelProps) {
  const reuse = calculateModuleReuse(dataset);
  const alignment = calculateOutcomeAlignment(dataset);
  const load = calculateAssessmentLoad(dataset);
  const governance = calculateGovernanceCompleteness(dataset);

  const insights: Insight[] = [];

  // Rules-based insight generation
  
  // 1. Modules shared 3+
  if (reuse.heavilyUsedModuleCount > 0) {
    const heavilyUsed = reuse.sharedModulesList.filter(m => m.uses >= 3);
    heavilyUsed.forEach(m => {
      insights.push({
        id: `shared-3-${m.id}`,
        severity: 'info',
        message: `High Reuse: ${m.title} is shared across ${m.uses} programmes.`,
        detailItem: { type: 'module', id: m.id }
      });
    });
  }

  // 2. Unassessed Outcomes
  if (alignment.unassessedOutcomes.length > 0) {
    alignment.unassessedOutcomes.forEach(oid => {
      insights.push({
        id: `unassessed-${oid}`,
        severity: 'concern',
        message: `Curriculum Gap: Outcome ${oid} has no aligned assessments.`,
        detailItem: { type: 'outcome', id: oid }
      });
    });
  }

  // 3. Overloaded weeks
  if (load.overloadedWeeks > 0) {
    Object.entries(load.weekRisk).forEach(([weekStr, risk]) => {
      if (risk === 'high') {
        insights.push({
          id: `overload-${weekStr}`,
          severity: 'attention',
          message: `Workload Risk: Week ${weekStr} is overloaded with ${load.weeklyCounts[parseInt(weekStr)]} assessments.`,
          detailItem: { type: 'week', id: weekStr }
        });
      }
    });
  }

  // 4. Weak Governance Completeness (< 50%)
  const weakModules = dataset.modules.filter(m => (governance.moduleScores[m.id] || 0) < 0.5);
  weakModules.forEach(m => {
    insights.push({
      id: `gov-weak-${m.id}`,
      severity: 'concern',
      message: `Compliance Risk: ${m.title} has very weak governance completeness (${((governance.moduleScores[m.id] || 0) * 100).toFixed(0)}%).`,
      detailItem: { type: 'module', id: m.id }
    });
  });

  // --- AI GOVERNANCE INSIGHTS ---
  const aiRecords = dataset.aiGovernanceRecords || [];
  const activeAiRecords = aiRecords.filter(r => r.aiUsed);

  activeAiRecords.forEach(r => {
    let resolvedLabel = r.entityId;
    if (r.entityType === 'module') resolvedLabel = dataset.modules.find(m => m.id === r.entityId)?.title || resolvedLabel;
    else if (r.entityType === 'programme') resolvedLabel = dataset.programmes.find(p => p.id === r.entityId)?.title || resolvedLabel;

    if (!r.humanReviewed) {
      insights.push({
        id: `ai-no-human-${r.id}`,
        severity: 'concern',
        message: `Oversight Gap: AI used on ${r.entityType} '${resolvedLabel}' without recorded human review.`,
        detailItem: { type: 'ai-record', id: r.id }
      });
    }

    if (!r.accountabilityNamed) {
      insights.push({
        id: `ai-no-owner-${r.id}`,
        severity: 'attention',
        message: `Traceability: AI support logged for '${resolvedLabel}' but no accountability owner named.`,
        detailItem: { type: 'ai-record', id: r.id }
      });
    }

    if (!r.rationaleRecorded) {
      insights.push({
        id: `ai-no-rationale-${r.id}`,
        severity: 'attention',
        message: `Traceability: AI used on '${resolvedLabel}' lacks pedagogical rationale.`,
        detailItem: { type: 'ai-record', id: r.id }
      });
    }

    if (!r.sourceMaterialChecked) {
      insights.push({
        id: `ai-no-source-${r.id}`,
        severity: 'attention',
        message: `Traceability: Source constraints not verified for AI operations on '${resolvedLabel}'.`,
        detailItem: { type: 'ai-record', id: r.id }
      });
    }
  });

  // Calculate concentration of AI use types
  if (activeAiRecords.length > 0) {
    const useTypes: Record<string, number> = {};
    activeAiRecords.forEach(r => {
      r.aiUseType?.forEach(ut => {
        useTypes[ut] = (useTypes[ut] || 0) + 1;
      });
    });

    const totalTypesUsed = Object.values(useTypes).reduce((a, b) => a + b, 0);
    Object.entries(useTypes).forEach(([type, count]) => {
      if (totalTypesUsed > 2 && count / totalTypesUsed > 0.7) {
        insights.push({
          id: `ai-concentrated-${type}`,
          severity: 'info',
          message: `AI Trend: Heavy concentration (${Math.round((count / totalTypesUsed) * 100)}%) on '${type}' activities across visible records.`,
        });
      }
    });
  }

  return (
    <div className="insights-panel">
      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Governance Insights</h3>
      {insights.length === 0 ? (
        <div style={{ padding: '2rem', border: '1px dashed var(--border)', borderRadius: '6px', textAlign: 'center' }}>
          <p className="text-small" style={{ margin: 0 }}>No significant structural risks detected.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {insights.map(insight => (
            <div key={insight.id} className={`insight-item insight-${insight.severity}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge">
                  {insight.severity === 'concern' ? 'Critical' : insight.severity === 'attention' ? 'Alert' : 'Notice'}
                </span>
                {insight.detailItem && (
                  <button 
                    className="link-button" 
                    onClick={() => onSelectDetail?.(insight.detailItem!)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    View Detail
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                {insight.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


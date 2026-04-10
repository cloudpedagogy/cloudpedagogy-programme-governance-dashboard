
import type { CombinedDataset } from '../../types';

interface OutcomeAlignmentViewProps {
  dataset: CombinedDataset;
}

export function OutcomeAlignmentView({ dataset }: OutcomeAlignmentViewProps) {
  const { outcomes, modules } = dataset;

  const outcomeData = outcomes.map(outcome => {
    const linkedModulesCount = modules.filter(m => m.outcomes.some(o => o.id === outcome.id)).length;
    const linkedAssessmentsCount = outcome.alignedAssessments.length;

    const hasModuleLink = linkedModulesCount > 0 ? 0.4 : 0;
    const hasAssessmentLink = linkedAssessmentsCount > 0 ? 0.4 : 0;
    const isNotOverconcentrated = linkedAssessmentsCount <= 3 ? 0.2 : 0;
    
    return {
      id: outcome.id,
      description: outcome.description,
      linkedModulesCount,
      linkedAssessmentsCount,
      isUnlinked: linkedModulesCount === 0,
      isUnassessed: linkedAssessmentsCount === 0,
      isOverconcentrated: linkedAssessmentsCount > 3,
      score: (hasModuleLink + hasAssessmentLink + isNotOverconcentrated) * 100
    };
  });

  return (
    <div className="feature-view">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Outcome Alignment</h2>
      <p className="text-small" style={{ marginBottom: '2rem' }}>Institutional mapping of learning outcomes to modules and assessments.</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Learning Outcome</th>
            <th style={{ width: '120px' }}>Modules</th>
            <th style={{ width: '120px' }}>Tests</th>
            <th style={{ width: '100px' }}>Score</th>
            <th style={{ width: '180px' }}>Status Signals</th>
          </tr>
        </thead>
        <tbody>
          {outcomeData.map(outcome => (
            <tr key={outcome.id}>
              <td>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{outcome.description}</div>
                <div className="text-small">{outcome.id}</div>
              </td>
              <td>{outcome.linkedModulesCount}</td>
              <td>{outcome.linkedAssessmentsCount}</td>
              <td>
                <span style={{ fontWeight: 600 }}>{outcome.score.toFixed(0)}%</span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {outcome.isUnlinked && <span className="badge">Unlinked</span>}
                  {outcome.isUnassessed && <span className="badge">Unassessed</span>}
                  {outcome.isOverconcentrated && <span className="badge" style={{ opacity: 0.8 }}>Concentrated</span>}
                  {(!outcome.isUnlinked && !outcome.isUnassessed && !outcome.isOverconcentrated) && (
                    <span className="badge" style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>Verified</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {outcomeData.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No learning outcomes found in current governance dataset.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


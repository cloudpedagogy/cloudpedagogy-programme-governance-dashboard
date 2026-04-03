
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
      <h2>Outcome Alignment</h2>
      <p className="description">Analyze how outcomes map to modules and assessments.</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Modules</th>
            <th>Assessments</th>
            <th>Score</th>
            <th>Flags</th>
          </tr>
        </thead>
        <tbody>
          {outcomeData.map(outcome => (
            <tr key={outcome.id}>
              <td>{outcome.description} <em>({outcome.id})</em></td>
              <td>{outcome.linkedModulesCount}</td>
              <td>{outcome.linkedAssessmentsCount}</td>
              <td>{outcome.score.toFixed(0)}%</td>
              <td>
                <div className="badge-group">
                  {outcome.isUnlinked && <span className="badge badge-danger">Unlinked</span>}
                  {outcome.isUnassessed && <span className="badge badge-danger">Unassessed</span>}
                  {outcome.isOverconcentrated && <span className="badge badge-warning">Over-concentrated</span>}
                  {(!outcome.isUnlinked && !outcome.isUnassessed && !outcome.isOverconcentrated) && (
                    <span className="badge badge-success">Healthy</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {outcomeData.length === 0 && (
            <tr>
              <td colSpan={5}>No outcomes found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

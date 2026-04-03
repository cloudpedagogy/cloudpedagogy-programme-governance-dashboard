
import type { CombinedDataset } from '../../types';
import { calculateAssessmentLoad } from '../../lib/metrics';

interface AssessmentLoadViewProps {
  dataset: CombinedDataset;
}

export function AssessmentLoadView({ dataset }: AssessmentLoadViewProps) {
  const loadMetrics = calculateAssessmentLoad(dataset);

  const weekData = Object.entries(loadMetrics.weeklyCounts).map(([weekStr, count]) => {
    const week = parseInt(weekStr, 10);
    const risk = loadMetrics.weekRisk[week];
    return { week, count, risk };
  });

  weekData.sort((a, b) => a.week - b.week);

  return (
    <div className="feature-view">
      <h2>Assessment Load Balance</h2>
      <p className="description">Review the distribution of assessment deadlines across weeks.</p>
      
      <div className="summary-panel" style={{ marginBottom: '2rem' }}>
        <h3>Type Distribution</h3>
        <ul className="inline-list">
          {Object.entries(loadMetrics.typeDistribution).map(([type, count]) => (
            <li key={type}><strong>{type}:</strong> {count}</li>
          ))}
        </ul>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Week</th>
            <th>Total Assessments</th>
            <th>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {weekData.map(data => (
            <tr key={data.week} className={data.risk === 'high' ? 'row-danger' : ''}>
              <td><strong>Week {data.week}</strong></td>
              <td>{data.count}</td>
              <td>
                <span className={`badge badge-${data.risk === 'high' ? 'danger' : data.risk === 'moderate' ? 'warning' : 'success'}`}>
                  {data.risk.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
          {weekData.length === 0 && (
            <tr>
              <td colSpan={3}>No assessment scheduling data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

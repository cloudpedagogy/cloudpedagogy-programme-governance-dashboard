
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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Assessment Load Balance</h2>
      <p className="text-small" style={{ marginBottom: '2rem' }}>Institutional review of assessment deadline distribution and scheduling risk.</p>
      
      <section className="kpi-card" style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Type Distribution</h4>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {Object.entries(loadMetrics.typeDistribution).map(([type, count]) => (
            <div key={type}>
              <span className="text-small">{type}</span>
              <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{count}</div>
            </div>
          ))}
        </div>
      </section>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '150px' }}>Academic Week</th>
            <th style={{ width: '200px' }}>Total Assessments</th>
            <th>Governance Signal</th>
          </tr>
        </thead>
        <tbody>
          {weekData.map(data => (
            <tr key={data.week} style={data.risk === 'high' ? { backgroundColor: '#fcfcfc' } : {}}>
              <td>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Week {data.week}</span>
              </td>
              <td>{data.count}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge">
                    {data.risk === 'high' ? 'High Volume' : data.risk === 'moderate' ? 'Moderate' : 'Balanced'}
                  </span>
                  {data.risk === 'high' && <span style={{ fontSize: '1rem' }}>⚠️</span>}
                </div>
              </td>
            </tr>
          ))}
          {weekData.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No assessment scheduling data detected.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


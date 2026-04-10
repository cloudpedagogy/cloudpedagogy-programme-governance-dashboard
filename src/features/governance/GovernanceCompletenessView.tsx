
import type { CombinedDataset } from '../../types';

interface GovernanceCompletenessViewProps {
  dataset: CombinedDataset;
}

export function GovernanceCompletenessView({ dataset }: GovernanceCompletenessViewProps) {
  const { modules, governanceMetadata } = dataset;

  const govData = modules.map(mod => {
    const meta = governanceMetadata[mod.id] || {};
    const docOut = meta.documentedOutcomes ?? 0;
    const asMap = meta.assessmentMapping ?? 0;
    const depClarity = meta.dependencyClarity ?? 0;
    const progAlign = meta.programmeAlignmentEvidence ?? 0;
    
    const score = ((docOut + asMap + depClarity + progAlign) / 4) * 100;

    return {
      id: mod.id,
      code: mod.code,
      title: mod.title,
      docOut: docOut * 100,
      asMap: asMap * 100,
      depClarity: depClarity * 100,
      progAlign: progAlign * 100,
      score
    };
  });

  // Sort weakest modules first
  govData.sort((a, b) => a.score - b.score);

  return (
    <div className="feature-view">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Governance Completeness</h2>
      <p className="text-small" style={{ marginBottom: '2rem' }}>Detailed institutional governance checklist and completeness mapping for all modules.</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Module</th>
            <th style={{ width: '100px' }}>Outcomes</th>
            <th style={{ width: '100px' }}>Assessment</th>
            <th style={{ width: '100px' }}>Dependency</th>
            <th style={{ width: '100px' }}>Alignment</th>
            <th style={{ width: '120px' }}>Aggregate</th>
          </tr>
        </thead>
        <tbody>
          {govData.map(data => (
            <tr key={data.id}>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.code}</div>
                <div className="text-small">{data.title}</div>
              </td>
              <td>
                <span style={{ fontWeight: data.docOut === 100 ? 600 : 400, color: data.docOut === 100 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {data.docOut.toFixed(0)}%
                </span>
              </td>
              <td>
                <span style={{ fontWeight: data.asMap === 100 ? 600 : 400, color: data.asMap === 100 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {data.asMap.toFixed(0)}%
                </span>
              </td>
              <td>
                <span style={{ fontWeight: data.depClarity === 100 ? 600 : 400, color: data.depClarity === 100 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {data.depClarity.toFixed(0)}%
                </span>
              </td>
              <td>
                <span style={{ fontWeight: data.progAlign === 100 ? 600 : 400, color: data.progAlign === 100 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {data.progAlign.toFixed(0)}%
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.score.toFixed(0)}%</span>
                  {data.score < 80 && <span className="badge">Review Req.</span>}
                </div>
              </td>
            </tr>
          ))}
          {govData.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No modules found in current governance dataset.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


import type { CombinedDataset } from '../../types';
import { calculateModuleHealth } from '../../lib/governance/scoring';

interface GovernanceCompletenessViewProps {
  dataset: CombinedDataset;
}

export function GovernanceCompletenessView({ dataset }: GovernanceCompletenessViewProps) {
  const { modules, governanceMetadata } = dataset;

  const govData = modules.map(mod => {
    const meta = governanceMetadata[mod.id] || {};
    const health = calculateModuleHealth(mod);
    
    return {
      id: mod.id,
      moduleId: mod.id,
      code: mod.code,
      status: health.status,
      title: mod.title,
      docOut: (meta.documentedOutcomes ?? 0) * 100,
      asMap: (meta.assessmentMapping ?? 0) * 100,
      depClarity: (meta.dependencyClarity ?? 0) * 100,
      progAlign: (meta.programmeAlignmentEvidence ?? 0) * 100,
    };
  });

  // Sort weakest modules first
  govData.sort((a, b) => {
    const order = { red: 0, amber: 1, green: 2 };
    return order[a.status] - order[b.status];
  });

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
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    data.status === 'red' ? 'bg-red-100 text-red-700' :
                    data.status === 'amber' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {data.status}
                  </span>
                  {data.status !== 'green' && <span className="text-[10px] text-slate-400 italic">Review Req.</span>}
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


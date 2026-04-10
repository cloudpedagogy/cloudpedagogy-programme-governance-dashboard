import type { CombinedDataset } from '../../types';
import type { DetailItem } from '../../components/DetailPanel';

interface AIGovernanceViewProps {
  dataset: CombinedDataset;
  onSelectDetail?: (item: DetailItem) => void;
}

export function AIGovernanceView({ dataset, onSelectDetail }: AIGovernanceViewProps) {
  const records = dataset.aiGovernanceRecords || [];

  const recordData = records.map(record => {
    let score = 0;
    if (record.humanReviewed) score += 0.2;
    if (record.rationaleRecorded) score += 0.2;
    if (record.sourceMaterialChecked) score += 0.2;
    if (record.outputModifiedByHuman) score += 0.2;
    if (record.accountabilityNamed) score += 0.2;
    
    const readinessScore = score * 100;

    let label = record.entityId;
    if (record.entityType === 'module') label = dataset.modules.find(m => m.id === record.entityId)?.title || label;
    else if (record.entityType === 'programme') label = dataset.programmes.find(p => p.id === record.entityId)?.title || label;
    else if (record.entityType === 'outcome') label = dataset.outcomes.find(o => o.id === record.entityId)?.description || label;

    return { ...record, label, readinessScore };
  });

  // Sort weakest oversight readiness first by default
  recordData.sort((a, b) => a.readinessScore - b.readinessScore);

  return (
    <div className="feature-view">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>AI Governance Records</h2>
      <p className="text-small" style={{ marginBottom: '2rem' }}>Interpretive oversight records tracking AI-supported curriculum generation and mapping events.</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Entity</th>
            <th style={{ width: '100px' }}>AI Assist</th>
            <th>AIG Use Type</th>
            <th style={{ width: '180px' }}>Oversight Traces</th>
            <th style={{ width: '120px' }}>Readiness</th>
            <th style={{ width: '100px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {recordData.map(data => (
            <tr key={data.id}>
              <td>
                <div style={{ textTransform: 'uppercase', fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{data.entityType}</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={data.label}>
                  {data.label}
                </div>
              </td>
              <td>
                <span className="badge" style={{ opacity: data.aiUsed ? 1 : 0.5 }}>{data.aiUsed ? 'Yes' : 'No'}</span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {data.aiUseType?.map(type => (
                    <span key={type} className="text-small">{type}</span>
                  )) || <span className="text-small">Direct</span>}
                </div>
              </td>
              <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                  <span style={{ color: data.humanReviewed ? 'var(--text-primary)' : 'inherit' }}>{data.humanReviewed ? '●' : '○'} Review</span>
                  <span style={{ color: data.rationaleRecorded ? 'var(--text-primary)' : 'inherit' }}>{data.rationaleRecorded ? '●' : '○'} Rationale</span>
                  <span style={{ color: data.sourceMaterialChecked ? 'var(--text-primary)' : 'inherit' }}>{data.sourceMaterialChecked ? '●' : '○'} Source</span>
                  <span style={{ color: data.outputModifiedByHuman ? 'var(--text-primary)' : 'inherit' }}>{data.outputModifiedByHuman ? '●' : '○'} Edit</span>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{data.readinessScore.toFixed(0)}%</span>
                </div>
              </td>
              <td>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => onSelectDetail?.({ type: 'ai-record', id: data.id })}
                >
                  Inspect
                </button>
              </td>
            </tr>
          ))}
          {recordData.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No AI Governance oversight records discovered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


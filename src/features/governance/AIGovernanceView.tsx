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
      <h2>AI Governance Records</h2>
      <p className="description">Interpretive oversight records tracking AI-supported curriculum generation and mapping events.</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Entity Type</th>
            <th>Target Label</th>
            <th>AI Used</th>
            <th>Use Type</th>
            <th>Oversight Traces</th>
            <th>Oversight Readiness</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {recordData.map(data => (
            <tr key={data.id}>
              <td style={{ textTransform: 'capitalize' }}>{data.entityType}</td>
              <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={data.label}>
                <strong>{data.label}</strong>
              </td>
              <td>{data.aiUsed ? 'Yes' : 'No'}</td>
              <td>{data.aiUseType?.join(', ') || 'Unspecified'}</td>
              <td style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
                <span title="Human Reviewed">{data.humanReviewed ? '✅' : '❌'}</span>
                <span title="Rationale Recorded">{data.rationaleRecorded ? '✅' : '❌'}</span>
                <span title="Source Checked">{data.sourceMaterialChecked ? '✅' : '❌'}</span>
                <span title="Output Modified">{data.outputModifiedByHuman ? '✅' : '❌'}</span>
                <span title="Accountability Named">{data.accountabilityNamed ? '✅' : '❌'}</span>
              </td>
              <td>
                <strong className={data.readinessScore < 50 ? 'text-danger' : data.readinessScore < 90 ? 'text-warning' : 'text-success'}>
                  {data.readinessScore.toFixed(0)}%
                </strong>
              </td>
              <td>
                <button 
                  className="link-button" 
                  onClick={() => onSelectDetail?.({ type: 'ai-record', id: data.id })}
                >
                  View Detail
                </button>
              </td>
            </tr>
          ))}
          {recordData.length === 0 && (
            <tr>
              <td colSpan={7}>No AI Governance oversight records discovered.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

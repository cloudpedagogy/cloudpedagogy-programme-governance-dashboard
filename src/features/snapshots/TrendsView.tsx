import { useState, useEffect } from 'react';
import type { CombinedDataset, Snapshot } from '../../types';
import { storage } from '../../lib/storage';
import { calculateModuleReuse, calculateOutcomeAlignment, calculateAssessmentLoad, calculateGovernanceCompleteness } from '../../lib/metrics';

interface TrendsViewProps {
  dataset: CombinedDataset;
}

export function TrendsView({ dataset }: TrendsViewProps) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>('');

  useEffect(() => {
    setSnapshots(storage.loadSnapshots());
  }, []);

  // Compute live current dataset metrics
  const reuse = calculateModuleReuse(dataset);
  const align = calculateOutcomeAlignment(dataset);
  const load = calculateAssessmentLoad(dataset);
  const gov = calculateGovernanceCompleteness(dataset);

  const currentMetrics = {
    moduleReuseRate: reuse.reuseRate,
    outcomeAlignmentScore: align.alignmentScore,
    assessmentLoadBalance: load.loadBalanceScore,
    governanceCompleteness: gov.systemWideAggregate
  };

  const currentStructural = {
    programmes: dataset.programmes.length,
    modules: dataset.modules.length,
    sharedModules: reuse.sharedModuleCount,
    outcomes: dataset.outcomes.length,
    unassessedOutcomes: align.unassessedOutcomes.length,
    assessments: dataset.assessments.length,
    overloadedWeeks: load.overloadedWeeks
  };

  const selectedSnapshot = snapshots.find(s => s.id === selectedSnapshotId);

  return (
    <div className="feature-view">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Trends & Comparison</h2>
      <p className="text-small" style={{ marginBottom: '2rem' }}>Compare the live dataset metrics against historically saved institutional snapshots.</p>

      <div style={{ margin: '2rem 0' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Comparison Snapshot</h4>
        <select 
          value={selectedSnapshotId} 
          onChange={e => setSelectedSnapshotId(e.target.value)}
          style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            width: '100%',
            maxWidth: '400px'
          }}
        >
          <option value="">-- Choose Historical Snapshot --</option>
          {snapshots.map(s => (
            <option key={s.id} value={s.id}>{s.name || s.id} ({new Date(s.timestamp).toLocaleDateString()})</option>
          ))}
        </select>
      </div>

      {selectedSnapshot ? (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Metric Variance</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Indicator</th>
                  <th>Snap</th>
                  <th>Live</th>
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentMetrics).map(([key, currentVal]) => {
                  const snapVal = (selectedSnapshot.metrics as any)[key] || 0;
                  const diff = currentVal - snapVal;
                  return (
                    <tr key={key}>
                      <td style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td>{snapVal.toFixed(1)}</td>
                      <td><span style={{ fontWeight: 600 }}>{currentVal.toFixed(1)}</span></td>
                      <td>
                        <span className="badge" style={{ opacity: diff === 0 ? 0.4 : 1 }}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Structural Variance</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Snap</th>
                  <th>Live</th>
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentStructural).map(([key, currentVal]) => {
                  const snapVal = selectedSnapshot.structuralCounts ? (selectedSnapshot.structuralCounts as any)[key] : 'N/A';
                  const diff = snapVal !== 'N/A' ? (currentVal - snapVal) : 0;
                  return (
                    <tr key={key}>
                      <td style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td>{snapVal}</td>
                      <td><span style={{ fontWeight: 600 }}>{currentVal}</span></td>
                      {snapVal !== 'N/A' ? (
                        <td>
                          <span className="badge" style={{ opacity: diff === 0 ? 0.4 : 1 }}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        </td>
                      ) : <td>-</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div style={{ padding: '4rem 2rem', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {snapshots.length === 0 
            ? "No snapshots available. Save one from the action bar to enable trend comparison."
            : "Select a snapshot above to view institutional variances."}
        </div>
      )}
    </div>
  );
}


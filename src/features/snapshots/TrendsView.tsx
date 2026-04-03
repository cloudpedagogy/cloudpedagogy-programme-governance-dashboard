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
      <h2>Trends & Comparison</h2>
      <p className="description">Compare the live dataset metrics against historically saved snapshots.</p>

      <div style={{ margin: '2rem 0' }}>
        <strong>Select Snapshot to Compare: </strong>
        <select 
          value={selectedSnapshotId} 
          onChange={e => setSelectedSnapshotId(e.target.value)}
          style={{ padding: '0.5rem', marginLeft: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">-- Choose Snapshot --</option>
          {snapshots.map(s => (
            <option key={s.id} value={s.id}>{s.name || s.id} ({new Date(s.timestamp).toLocaleDateString()})</option>
          ))}
        </select>
      </div>

      {selectedSnapshot ? (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Metric Variance</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Indicator</th>
                  <th>Snapshot</th>
                  <th>Current</th>
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentMetrics).map(([key, currentVal]) => {
                  const snapVal = (selectedSnapshot.metrics as any)[key] || 0;
                  const diff = currentVal - snapVal;
                  return (
                    <tr key={key}>
                      <td style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td>{snapVal.toFixed(1)}</td>
                      <td><strong>{currentVal.toFixed(1)}</strong></td>
                      <td className={diff > 0 ? 'text-success' : diff < 0 ? 'text-danger' : ''}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Structural Variance</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Snapshot</th>
                  <th>Current</th>
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentStructural).map(([key, currentVal]) => {
                  const snapVal = selectedSnapshot.structuralCounts ? (selectedSnapshot.structuralCounts as any)[key] : 'N/A';
                  const diff = snapVal !== 'N/A' ? (currentVal - snapVal) : 0;
                  return (
                    <tr key={key}>
                      <td style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td>{snapVal}</td>
                      <td><strong>{currentVal}</strong></td>
                      {snapVal !== 'N/A' ? (
                        <td className={diff > 0 ? 'text-primary' : diff < 0 ? 'text-warning' : ''}>
                          {diff > 0 ? '+' : ''}{diff}
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
        <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center', color: '#6c757d' }}>
          {snapshots.length === 0 
            ? "No snapshots available. Save one from the action bar to enable trend comparison."
            : "Select a snapshot above to view variances."}
        </div>
      )}
    </div>
  );
}

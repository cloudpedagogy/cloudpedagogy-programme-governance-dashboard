import { useState } from 'react';
import type { CombinedDataset } from '../../types';
import {
  calculateOutcomeAlignment,
  calculateAssessmentLoad,
  calculateGovernanceCompleteness
} from '../../lib/metrics';
import type { DetailItem } from '../../components/DetailPanel';

interface ProgrammeComparisonViewProps {
  dataset: CombinedDataset;
  onSelectDetail?: (item: DetailItem) => void;
}

export function ProgrammeComparisonView({ dataset, onSelectDetail }: ProgrammeComparisonViewProps) {
  const [selectedProgIds, setSelectedProgIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    if (selectedProgIds.includes(id)) {
      setSelectedProgIds(selectedProgIds.filter(pid => pid !== id));
    } else {
      if (selectedProgIds.length < 3) {
        setSelectedProgIds([...selectedProgIds, id]);
      } else {
        alert("Maximum 3 programmes can be compared at once.");
      }
    }
  };

  const selectedProgrammes = dataset.programmes.filter(p => selectedProgIds.includes(p.id));

  return (
    <div className="feature-view">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Programme Comparison</h2>
      <p className="text-small" style={{ marginBottom: '2rem' }}>Select up to 3 programmes to compare structurally.</p>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Select Programmes</h4>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {dataset.programmes.map(prog => (
            <label 
              key={prog.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                cursor: 'pointer', 
                backgroundColor: selectedProgIds.includes(prog.id) ? 'var(--text-primary)' : 'var(--bg)', 
                color: selectedProgIds.includes(prog.id) ? '#ffffff' : 'var(--text-primary)',
                padding: '0.5rem 1rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border)',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <input 
                type="checkbox" 
                checked={selectedProgIds.includes(prog.id)} 
                onChange={() => toggleSelection(prog.id)}
                style={{ accentColor: '#111' }}
              />
              {prog.title}
            </label>
          ))}
        </div>
      </div>

      {selectedProgrammes.length > 0 ? (
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {selectedProgrammes.map(prog => {
            const pDataset: CombinedDataset = {
              ...dataset,
              programmes: [prog],
              modules: prog.modules,
              outcomes: prog.modules.flatMap(m => m.outcomes),
              assessments: prog.modules.flatMap(m => m.assessments)
            };
            
            const pAlign = calculateOutcomeAlignment(pDataset);
            const pLoad = calculateAssessmentLoad(pDataset);
            const pGov = calculateGovernanceCompleteness(pDataset);

            const sharedModulesInProg = prog.modules.filter(m => 
              dataset.programmes.filter(globalP => globalP.modules.some(gm => gm.id === m.id)).length > 1
            );

            return (
              <div key={prog.id} className="kpi-card" style={{ flex: '1', minWidth: '320px', borderTop: '4px solid var(--text-primary)' }}>
                <h3>
                  <button 
                    className="link-button" 
                    onClick={() => onSelectDetail?.({ type: 'programme', id: prog.id })}
                    style={{ fontSize: '1.125rem', fontWeight: 600 }}
                  >
                    {prog.title}
                  </button>
                </h3>
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span className="text-small">Modules</span>
                    <span style={{ fontWeight: 600 }}>{prog.modules.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span className="text-small">Shared Modules</span>
                    <span style={{ fontWeight: 600 }}>{sharedModulesInProg.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span className="text-small">Unassessed Outcomes</span>
                    <span className="badge" style={{ fontWeight: 600 }}>{pAlign.unassessedOutcomes.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span className="text-small">Total Assessments</span>
                    <span style={{ fontWeight: 600 }}>{pDataset.assessments.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span className="text-small">Overloaded Weeks</span>
                    <span className="badge" style={{ fontWeight: 600 }}>{pLoad.overloadedWeeks}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                    <span className="text-small">Governance Completeness</span>
                    <span style={{ fontWeight: 600 }}>{pGov.systemWideAggregate.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '4rem 2rem', border: '1px dashed var(--border)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Please select at least one programme to begin comparison.
        </div>
      )}
    </div>
  );
}


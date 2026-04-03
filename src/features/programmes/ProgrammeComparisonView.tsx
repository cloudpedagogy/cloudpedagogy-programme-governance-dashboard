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
      <h2>Programme Comparison</h2>
      <p className="description">Select up to 3 programmes to compare structurally.</p>
      
      <div style={{ marginBottom: '2rem' }}>
        <strong>Select Programmes:</strong>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {dataset.programmes.map(prog => (
            <label key={prog.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backgroundColor: selectedProgIds.includes(prog.id) ? '#e7f1ff' : '#f8f9fa', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <input 
                type="checkbox" 
                checked={selectedProgIds.includes(prog.id)} 
                onChange={() => toggleSelection(prog.id)}
              />
              {prog.title}
            </label>
          ))}
        </div>
      </div>

      {selectedProgrammes.length > 0 ? (
        <div className="comparison-grid" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {selectedProgrammes.map(prog => {
            // Compute isolated metrics for this programme
            const pDataset: CombinedDataset = {
              ...dataset,
              programmes: [prog],
              modules: prog.modules,
              outcomes: prog.modules.flatMap(m => m.outcomes),
              assessments: prog.modules.flatMap(m => m.assessments)
            };
            
            // Deduplicate outcomes/assessments to avoid double counting if modules share them, 
            // though in current demo data structure they are usually distinct arrays in definitions. 
            // We'll trust the metric functions to process the flat maps roughly accurately for structural bounds.

            const pAlign = calculateOutcomeAlignment(pDataset);
            const pLoad = calculateAssessmentLoad(pDataset);
            const pGov = calculateGovernanceCompleteness(pDataset);

            const sharedModulesInProg = prog.modules.filter(m => 
              dataset.programmes.filter(globalP => globalP.modules.some(gm => gm.id === m.id)).length > 1
            );

            return (
              <div key={prog.id} className="kpi-card" style={{ flex: '1', minWidth: '300px' }}>
                <h3>
                  <button 
                    className="link-button" 
                    onClick={() => onSelectDetail?.({ type: 'programme', id: prog.id })}
                    style={{ fontSize: 'inherit', fontWeight: 'bold' }}
                  >
                    {prog.title}
                  </button>
                </h3>
                <table className="data-table" style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
                  <tbody>
                    <tr>
                      <td>Modules</td>
                      <td><strong>{prog.modules.length}</strong></td>
                    </tr>
                    <tr>
                      <td>Shared Modules</td>
                      <td><strong>{sharedModulesInProg.length}</strong></td>
                    </tr>
                    <tr>
                      <td>Unassessed Outcomes</td>
                      <td className={pAlign.unassessedOutcomes.length > 0 ? 'text-danger' : 'text-success'}>
                        <strong>{pAlign.unassessedOutcomes.length}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Total Assessments</td>
                      <td><strong>{pDataset.assessments.length}</strong></td>
                    </tr>
                    <tr>
                      <td>Overloaded Weeks</td>
                      <td className={pLoad.overloadedWeeks > 0 ? 'text-danger' : 'text-success'}>
                        <strong>{pLoad.overloadedWeeks}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>Governance Completeness</td>
                      <td className={pGov.systemWideAggregate < 80 ? 'text-warning' : 'text-success'}>
                        <strong>{pGov.systemWideAggregate.toFixed(0)}%</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center', color: '#6c757d' }}>
          Please select at least one programme to begin comparison.
        </div>
      )}
    </div>
  );
}

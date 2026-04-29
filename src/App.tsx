import { useState, useEffect } from 'react';
import './App.css';
import { demoDataset } from './data/demo';
import { storage } from './lib/storage';
import { validateDataset } from './lib/validation';
import type { ValidationIssue } from './lib/validation';
import type { CombinedDataset, Snapshot } from './types';
import { calculateModuleReuse, calculateOutcomeAlignment, calculateAssessmentLoad, calculateGovernanceCompleteness } from './lib/metrics';

import { Overview } from './features/dashboard/Overview';
import { ModuleReuseView } from './features/modules/ModuleReuseView';
import { OutcomeAlignmentView } from './features/outcomes/OutcomeAlignmentView';
import { AssessmentLoadView } from './features/assessments/AssessmentLoadView';
import { GovernanceCompletenessView } from './features/governance/GovernanceCompletenessView';
import { AIGovernanceView } from './features/governance/AIGovernanceView';
import { HealthSummary } from './features/dashboard/HealthSummary';
import { DecisionTraceCenter } from './features/governance/DecisionTraceCenter';
import { ProgrammeComparisonView } from './features/programmes/ProgrammeComparisonView';
import { TrendsView } from './features/snapshots/TrendsView';
import { MethodologyView } from './features/dashboard/MethodologyView';
import { DetailPanel } from './components/DetailPanel';
import type { DetailItem } from './components/DetailPanel';

import { BrandHeader } from './components/BrandHeader';
import { BrandFooter } from './components/BrandFooter';

function App() {
  const [dataset, setDataset] = useState<CombinedDataset | null>(null);
  const [currentView, setCurrentView] = useState('Summary');
  const [selectedDetail, setSelectedDetail] = useState<DetailItem | null>(null);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const loaded = storage.loadDataset();
    if (loaded) {
      setDataset(loaded);
      setValidationIssues(validateDataset(loaded));
    }
  }, []);

  const handleLoadDemo = () => {
    setDataset(demoDataset);
    storage.saveDataset(demoDataset);
    setValidationIssues(validateDataset(demoDataset));
  };

  const handleSaveSnapshot = () => {
    if (!dataset) return;
    const name = window.prompt("Enter a label for this snapshot (e.g. 'Pre-Approval Review v2'):");
    if (!name) return; // cancelled
    
    // Save live metrics mapped
    const reuse = calculateModuleReuse(dataset);
    const align = calculateOutcomeAlignment(dataset);
    const load = calculateAssessmentLoad(dataset);
    const gov = calculateGovernanceCompleteness(dataset);

    const newSnapshot: Snapshot = {
      id: `snap-${Date.now()}`,
      name: name,
      timestamp: new Date().toISOString(),
      metrics: {
        moduleReuseRate: reuse.reuseRate,
        outcomeAlignmentScore: align.alignmentScore,
        assessmentLoadBalance: load.loadBalanceScore,
        governanceCompleteness: gov.systemWideAggregate
      },
      structuralCounts: {
        programmes: dataset.programmes.length,
        modules: dataset.modules.length,
        sharedModules: reuse.sharedModuleCount,
        outcomes: dataset.outcomes.length,
        unassessedOutcomes: align.unassessedOutcomes.length,
        assessments: dataset.assessments.length,
        overloadedWeeks: load.overloadedWeeks
      }
    };

    const existing = storage.loadSnapshots();
    storage.saveSnapshots([...existing, newSnapshot]);
    alert(`Snapshot '${name}' saved successfully in local storage.`);
  }

  const handleResetData = () => {
    storage.resetData();
    setDataset(null);
    setCurrentView('Summary');
    setSelectedDetail(null);
    setValidationIssues([]);
    setShowValidation(false);
  };

  const VIEWS = ['Summary', 'Overview', 'Programme Comparison', 'Module Reuse', 'Outcome Alignment', 'Assessment Load', 'Governance Completeness', 'AI Governance', 'Decision Trace', 'Snapshot Trends', 'Methodology'];

  return (
    <div className="dashboard-container">
      <BrandHeader />

      {validationIssues.length > 0 && (
        <div className="validation-banner" onClick={() => setShowValidation(!showValidation)}>
          <div className="validation-summary">
            <strong>⚠️ Data Integrity Warnings Detected:</strong> {validationIssues.length} issues found. Click to {showValidation ? 'hide' : 'expand'} details.
          </div>
          {showValidation && (
            <ul className="validation-details">
              {validationIssues.map((iss, i) => (
                <li key={i}><strong>[{iss.category.toUpperCase()}]</strong> {iss.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!dataset && (
        <div className="action-bar-empty">
          <button onClick={handleLoadDemo} className="btn btn-primary">Initialize Governance Dashboard</button>
        </div>
      )}

      {dataset && (
        <>
          <nav className="view-nav">
            {VIEWS.map(view => (
              <button 
                key={view} 
                className={currentView === view ? 'active' : ''} 
                onClick={() => setCurrentView(view)}
              >
                {view}
              </button>
            ))}
          </nav>

          <div className="view-header">
            <div className="action-bar">
              <button onClick={handleLoadDemo} className="btn btn-secondary">Reload Data</button>
              <button onClick={handleSaveSnapshot} className="btn btn-secondary">Save Snapshot</button>
              <button onClick={() => setCurrentView('Snapshot Trends')} className="btn btn-secondary">View Trends</button>
              <button onClick={handleResetData} className="btn btn-danger-link">Reset State</button>
            </div>
          </div>

          <main className="view-content">
            {currentView === 'Summary' && <HealthSummary dataset={dataset} />}
            {currentView === 'Overview' && <Overview dataset={dataset} onSelectDetail={setSelectedDetail} />}
            {currentView === 'Programme Comparison' && <ProgrammeComparisonView dataset={dataset} onSelectDetail={setSelectedDetail} />}
            {currentView === 'Module Reuse' && <ModuleReuseView dataset={dataset} />}
            {currentView === 'Outcome Alignment' && <OutcomeAlignmentView dataset={dataset} />}
            {currentView === 'Assessment Load' && <AssessmentLoadView dataset={dataset} />}
            {currentView === 'Governance Completeness' && <GovernanceCompletenessView dataset={dataset} />}
            {currentView === 'AI Governance' && <AIGovernanceView dataset={dataset} onSelectDetail={setSelectedDetail} />}
            {currentView === 'Decision Trace' && <DecisionTraceCenter dataset={dataset} />}
            {currentView === 'Snapshot Trends' && <TrendsView dataset={dataset} />}
            {currentView === 'Methodology' && <MethodologyView />}
          </main>
        </>
      )}

      {selectedDetail && dataset && (
        <DetailPanel 
          item={selectedDetail} 
          dataset={dataset} 
          onClose={() => setSelectedDetail(null)} 
        />
      )}

      {/* Lightweight capability and governance layer */}
      {/* Optional, non-blocking, and does not alter core workflow */}
      {dataset && (
        <div style={{ margin: '2rem auto', maxWidth: '1200px', padding: '0 1rem' }}>
          <details style={{ fontSize: '0.85rem', color: '#666', background: '#f9f9f9', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #eee' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Capability & Governance Notes (Optional)</summary>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Capability Notes</label>
                <textarea 
                  placeholder="What capability this supports, suggested AI use pattern, reflection prompt..."
                  style={{ width: '100%', minHeight: '60px', padding: '0.5rem', fontFamily: 'inherit', fontSize: 'inherit', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
                  value={dataset.capabilityNotes || ''}
                  onChange={(e) => {
                    const updated = { ...dataset, capabilityNotes: e.target.value };
                    setDataset(updated);
                    storage.saveDataset(updated);
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Governance Notes</label>
                <textarea 
                  placeholder="Rationale, assumptions, risks, human review notes..."
                  style={{ width: '100%', minHeight: '60px', padding: '0.5rem', fontFamily: 'inherit', fontSize: 'inherit', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
                  value={dataset.governanceNotes || ''}
                  onChange={(e) => {
                    const updated = { ...dataset, governanceNotes: e.target.value };
                    setDataset(updated);
                    storage.saveDataset(updated);
                  }}
                />
              </div>
            </div>
          </details>
        </div>
      )}

      <BrandFooter />
    </div>
  );
}


export default App;

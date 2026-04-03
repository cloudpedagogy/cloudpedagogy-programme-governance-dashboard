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
import { ProgrammeComparisonView } from './features/programmes/ProgrammeComparisonView';
import { TrendsView } from './features/snapshots/TrendsView';
import { MethodologyView } from './features/dashboard/MethodologyView';
import { DetailPanel } from './components/DetailPanel';
import type { DetailItem } from './components/DetailPanel';

function App() {
  const [dataset, setDataset] = useState<CombinedDataset | null>(null);
  const [currentView, setCurrentView] = useState('Overview');
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
  };

  const handleResetData = () => {
    storage.resetData();
    setDataset(null);
    setCurrentView('Overview');
    setSelectedDetail(null);
    setValidationIssues([]);
    setShowValidation(false);
  };

  const VIEWS = ['Overview', 'Programme Comparison', 'Module Reuse', 'Outcome Alignment', 'Assessment Load', 'Governance Completeness', 'AI Governance', 'Snapshot Trends', 'Methodology'];

  return (
    <div className="dashboard-container">
      {validationIssues.length > 0 && (
        <div className="validation-banner" onClick={() => setShowValidation(!showValidation)} style={{ cursor: 'pointer', backgroundColor: '#fff3cd', color: '#856404', padding: '10px 15px', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #ffeeba' }}>
          <strong>⚠️ Data Integrity Warnings Detected:</strong> {validationIssues.length} issues found. Click to {showValidation ? 'hide' : 'expand'} details.
          {showValidation && (
            <ul style={{ marginTop: '0.8rem', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
              {validationIssues.map((iss, i) => (
                <li key={i}><strong>[{iss.category.toUpperCase()}]</strong> {iss.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <header className="dashboard-header">
        <h1>Programme Governance Dashboard</h1>
        <p className="description">
          A local-first dashboard for curriculum coherence, structural risk, and governance completeness.
        </p>
        <div className="disclaimer">
          <p>
            <strong>Disclaimer:</strong> This dashboard provides structured indicators to support interpretation and reflection. It does not replace professional judgement or institutional decision-making.
          </p>
        </div>
        
        <div className="action-bar">
          <button onClick={handleLoadDemo} className="btn btn-primary">Load Demo Data</button>
          <button onClick={handleSaveSnapshot} className="btn btn-secondary">Save Snapshot</button>
          <button onClick={() => setCurrentView('Snapshot Trends')} className="btn btn-secondary">View Trends</button>
          <button onClick={handleResetData} className="btn btn-danger">Reset Local State</button>
        </div>
      </header>

      {dataset ? (
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

          <div className="view-content">
            {currentView === 'Overview' && <Overview dataset={dataset} onSelectDetail={setSelectedDetail} />}
            {currentView === 'Programme Comparison' && <ProgrammeComparisonView dataset={dataset} onSelectDetail={setSelectedDetail} />}
            {currentView === 'Module Reuse' && <ModuleReuseView dataset={dataset} />}
            {currentView === 'Outcome Alignment' && <OutcomeAlignmentView dataset={dataset} />}
            {currentView === 'Assessment Load' && <AssessmentLoadView dataset={dataset} />}
            {currentView === 'Governance Completeness' && <GovernanceCompletenessView dataset={dataset} />}
            {currentView === 'AI Governance' && <AIGovernanceView dataset={dataset} onSelectDetail={setSelectedDetail} />}
            {currentView === 'Snapshot Trends' && <TrendsView dataset={dataset} />}
            {currentView === 'Methodology' && <MethodologyView />}
          </div>
        </>
      ) : (
        <section className="dataset-overview" style={{ marginTop: '2rem' }}>
          <p>No data loaded. Click 'Load Demo Data' to begin.</p>
        </section>
      )}

      {selectedDetail && dataset && (
        <DetailPanel 
          item={selectedDetail} 
          dataset={dataset} 
          onClose={() => setSelectedDetail(null)} 
        />
      )}
    </div>
  );
}

export default App;

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

import { BrandHeader } from './components/BrandHeader';
import { BrandFooter } from './components/BrandFooter';

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
  }

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
            {currentView === 'Overview' && <Overview dataset={dataset} onSelectDetail={setSelectedDetail} />}
            {currentView === 'Programme Comparison' && <ProgrammeComparisonView dataset={dataset} onSelectDetail={setSelectedDetail} />}
            {currentView === 'Module Reuse' && <ModuleReuseView dataset={dataset} />}
            {currentView === 'Outcome Alignment' && <OutcomeAlignmentView dataset={dataset} />}
            {currentView === 'Assessment Load' && <AssessmentLoadView dataset={dataset} />}
            {currentView === 'Governance Completeness' && <GovernanceCompletenessView dataset={dataset} />}
            {currentView === 'AI Governance' && <AIGovernanceView dataset={dataset} onSelectDetail={setSelectedDetail} />}
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

      <BrandFooter />
    </div>
  );
}


export default App;

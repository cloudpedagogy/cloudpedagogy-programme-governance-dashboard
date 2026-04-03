import type { CombinedDataset } from '../../types';
import {
  calculateModuleReuse,
  calculateOutcomeAlignment,
  calculateAssessmentLoad,
  calculateGovernanceCompleteness,
  calculateAIGovernance
} from '../../lib/metrics';
import type { DetailItem } from '../../components/DetailPanel';
import { InsightsPanel } from './InsightsPanel';

interface OverviewProps {
  dataset: CombinedDataset;
  onSelectDetail?: (item: DetailItem) => void;
}

export function Overview({ dataset, onSelectDetail }: OverviewProps) {
  const reuse = calculateModuleReuse(dataset);
  const alignment = calculateOutcomeAlignment(dataset);
  const load = calculateAssessmentLoad(dataset);
  const governance = calculateGovernanceCompleteness(dataset);
  const aiGov = calculateAIGovernance(dataset);

  const topSharedModules = reuse.sharedModulesList.slice(0, 3);
  const weakestGovModules = [...dataset.modules]
    .sort((a, b) => (governance.moduleScores[a.id] || 0) - (governance.moduleScores[b.id] || 0))
    .slice(0, 3);
  const overloadedWeeksList = Object.entries(load.weekRisk).filter(([_, risk]) => risk === 'high');

  return (
    <>
      <section className="dataset-overview">
        <h2>Dataset Summary</h2>
        <ul className="overview-list">
          <li><strong>{dataset.programmes.length}</strong> Programmes</li>
          <li><strong>{reuse.sharedModuleCount}</strong> Shared Modules</li>
          <li><strong>{alignment.unassessedOutcomes.length}</strong> Unassessed Outcomes</li>
          <li><strong>{load.overloadedWeeks}</strong> Overloaded Weeks</li>
        </ul>
      </section>
      
      <main className="kpi-grid">
        <div className="kpi-card">
          <h3>Module Reuse Rate</h3>
          <div className="kpi-value">{reuse.reuseRate.toFixed(1)}%</div>
        </div>
        <div className="kpi-card">
          <h3>Outcome Alignment Score</h3>
          <div className="kpi-value">{alignment.alignmentScore.toFixed(1)}/100</div>
        </div>
        <div className="kpi-card">
          <h3>Assessment Load Balance</h3>
          <div className="kpi-value">{load.loadBalanceScore.toFixed(1)}/100</div>
        </div>
        <div className="kpi-card">
          <h3>Governance Completeness</h3>
          <div className="kpi-value">{governance.systemWideAggregate.toFixed(1)}%</div>
        </div>
      </main>

      <section className="ai-governance-summary" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #6c757d' }}>
        <h2 style={{ marginTop: 0 }}>AI Governance Signals</h2>
        <p className="description" style={{ marginBottom: '1.5rem', fontStyle: 'italic', fontSize: '0.95rem' }}>
          This AI governance layer provides structured visibility into AI-supported curriculum work. It highlights review, traceability, and oversight signals, but does not replace professional judgement or institutional decision-making.
        </p>
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="kpi-card" style={{ backgroundColor: '#fff' }}>
            <h3>AI Visibility Rate</h3>
            <div className="kpi-value" style={{ color: '#007bff' }}>{aiGov.visibilityRate.toFixed(1)}%</div>
            <p className="text-small">{aiGov.totalRecords} records total</p>
          </div>
          <div className="kpi-card" style={{ backgroundColor: '#fff' }}>
            <h3>Human Review Signal</h3>
            <div className="kpi-value" style={{ color: aiGov.humanReviewSignal < 80 ? '#dc3545' : '#28a745' }}>{aiGov.humanReviewSignal.toFixed(1)}%</div>
          </div>
          <div className="kpi-card" style={{ backgroundColor: '#fff' }}>
            <h3>Traceability Signal</h3>
            <div className="kpi-value" style={{ color: '#6c757d' }}>{aiGov.traceabilitySignal.toFixed(1)}%</div>
          </div>
          <div className="kpi-card" style={{ backgroundColor: '#fff' }}>
            <h3>Oversight Readiness</h3>
            <div className="kpi-value" style={{ color: '#17a2b8' }}>{aiGov.oversightReadiness.toFixed(1)}%</div>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <section className="analytics-overview" style={{ flex: '2', minWidth: '300px' }}>
          <h2>Analytics Overview</h2>
          <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            
            <div className="kpi-card">
              <h3>Top Shared Modules</h3>
              {topSharedModules.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.8rem' }}>
                  {topSharedModules.map(m => (
                    <li key={m.id}>
                      <button className="link-button" onClick={() => onSelectDetail?.({ type: 'module', id: m.id })}>
                        {m.title}
                      </button> <strong style={{ color: '#007bff' }}>({m.uses} progs)</strong>
                    </li>
                  ))}
                </ul>
              ) : <p>No shared modules found.</p>}
            </div>

            <div className="kpi-card">
              <h3>Outcomes Needing Attention</h3>
              <p><strong>{alignment.unassessedOutcomes.length}</strong> unassessed outcomes.</p>
              <p><strong>{alignment.overconcentratedOutcomes.length}</strong> over-concentrated outcomes.</p>
            </div>

            <div className="kpi-card">
              <h3>Overloaded Weeks</h3>
              {overloadedWeeksList.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.8rem' }}>
                  {overloadedWeeksList.map(([week, _]) => (
                    <li key={week}>
                      <button className="link-button" onClick={() => onSelectDetail?.({ type: 'week', id: week })}>
                        Week {week}
                      </button> <strong style={{ color: '#dc3545' }}>({load.weeklyCounts[parseInt(week)]} assessments)</strong>
                    </li>
                  ))}
                </ul>
              ) : <p>No overloaded weeks detected.</p>}
            </div>

            <div className="kpi-card">
              <h3>Weakest Governance</h3>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.8rem' }}>
                {weakestGovModules.map(m => (
                  <li key={m.id}>
                    <button className="link-button" onClick={() => onSelectDetail?.({ type: 'module', id: m.id })}>
                      {m.title}
                    </button> <strong style={{ color: '#dc3545' }}>({((governance.moduleScores[m.id] || 0) * 100).toFixed(0)}%)</strong>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        <section style={{ flex: '1', minWidth: '300px' }}>
          <InsightsPanel dataset={dataset} onSelectDetail={onSelectDetail} />
        </section>
      </div>
    </>
  );
}

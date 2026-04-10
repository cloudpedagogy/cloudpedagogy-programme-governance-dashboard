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
      <section className="feature-view">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1rem' }}>Dataset Summary</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Programmes</span> <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dataset.programmes.length}</div></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Shared Modules</span> <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{reuse.sharedModuleCount}</div></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Unassessed Outcomes</span> <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{alignment.unassessedOutcomes.length}</div></div>
          <div><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Overloaded Weeks</span> <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{load.overloadedWeeks}</div></div>
        </div>
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

      <section className="feature-view">
        <h2>AI Governance Signals</h2>
        <p className="text-small" style={{ marginBottom: '2rem', maxWidth: '800px' }}>
          This AI governance layer provides structured visibility into AI-supported curriculum work. It highlights review, traceability, and oversight signals.
        </p>
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="kpi-card">
            <h3>AI Visibility Rate</h3>
            <div className="kpi-value">{aiGov.visibilityRate.toFixed(1)}%</div>
            <p className="text-small">{aiGov.totalRecords} records total</p>
          </div>
          <div className="kpi-card">
            <h3>Human Review Signal</h3>
            <div className="kpi-value">{aiGov.humanReviewSignal.toFixed(1)}%</div>
          </div>
          <div className="kpi-card">
            <h3>Traceability Signal</h3>
            <div className="kpi-value">{aiGov.traceabilitySignal.toFixed(1)}%</div>
          </div>
          <div className="kpi-card">
            <h3>Oversight Readiness</h3>
            <div className="kpi-value">{aiGov.oversightReadiness.toFixed(1)}%</div>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <section style={{ flex: '2', minWidth: '300px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Analytics Overview</h2>
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            
            <div className="kpi-card">
              <h3>Top Shared Modules</h3>
              {topSharedModules.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0' }}>
                  {topSharedModules.map(m => (
                    <li key={m.id} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <button className="link-button" onClick={() => onSelectDetail?.({ type: 'module', id: m.id })}>
                        {m.title}
                      </button> 
                      <span className="badge">{m.uses} progs</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-small">No shared modules found.</p>}
            </div>

            <div className="kpi-card">
              <h3>Outcomes Needing Attention</h3>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-small">Unassessed</span>
                  <span className="badge">{alignment.unassessedOutcomes.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-small">Over-concentrated</span>
                  <span className="badge">{alignment.overconcentratedOutcomes.length}</span>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <h3>Overloaded Weeks</h3>
              {overloadedWeeksList.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0' }}>
                  {overloadedWeeksList.map(([week, _]) => (
                    <li key={week} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <button className="link-button" onClick={() => onSelectDetail?.({ type: 'week', id: week })}>
                        Week {week}
                      </button> 
                      <span className="badge">{load.weeklyCounts[parseInt(week)]} assessments</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-small">No overloaded weeks detected.</p>}
            </div>

            <div className="kpi-card">
              <h3>Weakest Governance</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0' }}>
                {weakestGovModules.map(m => (
                  <li key={m.id} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button className="link-button" onClick={() => onSelectDetail?.({ type: 'module', id: m.id })}>
                      {m.title}
                    </button> 
                    <span className="badge">{((governance.moduleScores[m.id] || 0) * 100).toFixed(0)}%</span>
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


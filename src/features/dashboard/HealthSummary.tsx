
import type { CombinedDataset } from '../../types';
import { calculateProgrammeHealth } from '../../lib/governance/scoring';

interface HealthSummaryProps {
  dataset: CombinedDataset;
}

export function HealthSummary({ dataset }: HealthSummaryProps) {
  const health = calculateProgrammeHealth(dataset);

  return (
    <div className="feature-view">
      <div className="summary-header mb-8">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Programme Governance Summary</h2>
        <p className="description">Institutional oversight of curriculum alignment, assessment coverage, and risk distribution.</p>
      </div>

      <div className="grid-3 mb-8">
        <div className="card shadow-sm border p-6 bg-white rounded-lg">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4 flex items-center gap-1">
            Governance Completeness
            <span className="cursor-help text-slate-400" title="Composite score based on the percentage of learning outcomes with mapped assessments and modules with aligned skill categories.">ⓘ</span>
          </h3>
          <div className="text-4xl font-extrabold text-slate-900 mb-2">{health.overallScore.toFixed(0)}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-1000" 
              style={{ width: `${health.overallScore}%` }} 
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 italic">Institutional target: &gt; 90%</p>
        </div>

        <div className="card shadow-sm border p-6 bg-white rounded-lg">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Risk Profile</h3>
          <div className="flex items-end gap-1 mb-4 h-12">
            <div className="flex-1 bg-red-500 rounded-t" style={{ height: `${(health.riskProfile.red / dataset.modules.length) * 100}%`, minHeight: '4px' }} title={`${health.riskProfile.red} Red Risks`}></div>
            <div className="flex-1 bg-amber-500 rounded-t" style={{ height: `${(health.riskProfile.amber / dataset.modules.length) * 100}%`, minHeight: '4px' }} title={`${health.riskProfile.amber} Amber Risks`}></div>
            <div className="flex-1 bg-emerald-500 rounded-t" style={{ height: `${(health.riskProfile.green / dataset.modules.length) * 100}%`, minHeight: '4px' }} title={`${health.riskProfile.green} Green Status`}></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold mb-4">
            <span className="text-red-600">{health.riskProfile.red} Red</span>
            <span className="text-amber-600">{health.riskProfile.amber} Amber</span>
            <span className="text-emerald-600">{health.riskProfile.green} Green</span>
          </div>
          <div className="pt-3 border-t border-slate-100 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Red: unassessed outcomes or zero-skill modules</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Amber: assessment density &lt; 1.0 per outcome</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Green: full coverage and alignment</span>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border p-6 bg-white rounded-lg">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4">Alignment Evidence</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Outcomes Assessed</span>
              <span className="text-xs font-bold">{health.outcomesAssessedPct.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Modules with Skills</span>
              <span className="text-xs font-bold">{health.modulesAlignedPct.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="audit-section bg-slate-50 rounded-xl p-8 border border-slate-200">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Critical Risk Drill-down</h3>
            <p className="text-[10px] text-slate-500 italic mt-1">Click a module to view detailed evidence gaps</p>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Status</th>
              <th>Alignment Detail</th>
              <th>Primary Evidence Gap</th>
            </tr>
          </thead>
          <tbody>
            {health.details.sort((a, b) => {
              const order = { red: 0, amber: 1, green: 2 };
              return order[a.status] - order[b.status];
            }).map(detail => (
              <tr key={detail.moduleId}>
                <td>
                  <div className="font-bold">{detail.code}</div>
                </td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                    detail.status === 'red' ? 'bg-red-100 text-red-700' : 
                    detail.status === 'amber' ? 'bg-amber-100 text-amber-700' : 
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {detail.status}
                  </span>
                </td>
                <td>
                  <div className="text-[10px] text-slate-500">
                    {detail.outcomeAssessedPct.toFixed(0)}% outcomes assessed · {detail.assessmentsPerOutcome.toFixed(1)} tasks/LO
                  </div>
                </td>
                <td className="text-xs font-medium text-slate-700 italic">
                  {detail.reason || <span className="text-slate-300">Evidence verified</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

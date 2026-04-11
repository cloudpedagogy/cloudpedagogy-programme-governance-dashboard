
import type { CombinedDataset } from '../../types';

interface DecisionTraceCenterProps {
  dataset: CombinedDataset;
}

export function DecisionTraceCenter({ dataset }: DecisionTraceCenterProps) {
  const { decisionRecords = [] } = dataset;

  return (
    <div className="feature-view">
      <div className="summary-header mb-8">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Decision Trace Center</h2>
        <p className="description">Audit trail of critical curriculum design decisions and AI governance approvals. (Read-only integration layer).</p>
      </div>

      <div className="info-box bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
        <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
          <span>ℹ️ System Integration Notice</span>
        </h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          This view provides the preparatory linkage points for the <strong>Decision Record Tool</strong>. 
          New decisions should be recorded in the standalone Decision Record Tool and synchronized back to this institutional dashboard for audit visibility.
        </p>
      </div>

      <div className="decision-list-section">
        <h3 className="text-sm font-bold text-slate-800 mb-6">recorded Design Decisions</h3>
        
        {decisionRecords.length > 0 ? (
          <div className="space-y-4">
            {decisionRecords.map(record => (
              <div key={record.id} className="card p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                      {record.entityType}: {record.entityId}
                    </span>
                    <div className="text-sm font-bold text-slate-900">{record.status === 'approved' ? '✅' : '📝'} Approval Status: {record.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{record.decisionMaker}</div>
                    <div className="text-[10px] text-slate-400">{new Date(record.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded text-xs text-slate-700 italic border-l-4 border-slate-300">
                  "{record.rationale}"
                </div>
                {record.evidenceReference && (
                  <div className="mt-3 text-[10px] font-bold text-blue-600 flex items-center gap-1 cursor-pointer hover:underline">
                    <span>🔗 View Evidence:</span>
                    <span>{record.evidenceReference}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 text-sm italic">No decision traces recorded in current governance dataset.</p>
            <button className="mt-4 px-4 py-2 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-500 hover:bg-slate-50">
              Prepare Integration Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

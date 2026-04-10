import type { CombinedDataset } from '../types';

export interface DetailItem {
  type: 'module' | 'outcome' | 'week' | 'programme' | 'ai-record';
  id: string; // ID or week number string
}

interface DetailPanelProps {
  item: DetailItem;
  dataset: CombinedDataset;
  onClose: () => void;
}

export function DetailPanel({ item, dataset, onClose }: DetailPanelProps) {
  let content = null;

  if (item.type === 'module') {
    const mod = dataset.modules.find(m => m.id === item.id);
    if (mod) {
      const usingProgs = dataset.programmes.filter(p => p.modules.some(m => m.id === mod.id));
      const govMeta = dataset.governanceMetadata[mod.id] || {};
      const score = (((govMeta.documentedOutcomes ?? 0) + (govMeta.assessmentMapping ?? 0) + (govMeta.dependencyClarity ?? 0) + (govMeta.programmeAlignmentEvidence ?? 0)) / 4) * 100;
      
      content = (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Module Detail</h3>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{mod.code}: {mod.title}</h4>
          
          <div className="detail-section">
            <h4 style={{ fontSize: 'var(--font-size-meta)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Structure & Usage</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span className="text-small">Credits</span>
                <div style={{ fontWeight: 600 }}>{mod.credits}</div>
              </div>
              <div>
                <span className="text-small">Programmes</span>
                <div style={{ fontWeight: 600 }}>{usingProgs.length}</div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <span className="text-small">Aligned Outcomes</span>
              <div style={{ fontWeight: 600 }}>{mod.outcomes.length}</div>
            </div>
          </div>

          <div className="detail-section">
            <h4 style={{ fontSize: 'var(--font-size-meta)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Governance Completeness ({score.toFixed(0)}%)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Documented Outcomes', value: govMeta.documentedOutcomes },
                { label: 'Assessment Mapping', value: govMeta.assessmentMapping },
                { label: 'Dependency Clarity', value: govMeta.dependencyClarity },
                { label: 'Programme Alignment', value: govMeta.programmeAlignmentEvidence }
              ].map(meta => (
                <div key={meta.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-small">{meta.label}</span>
                  <span className="badge" style={{ opacity: (meta.value ?? 0) === 1 ? 1 : 0.6 }}>
                    {(meta.value ?? 0) * 100}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  } else if (item.type === 'outcome') {
    const outcome = dataset.outcomes.find(o => o.id === item.id);
    if (outcome) {
      const linkedModules = dataset.modules.filter(m => m.outcomes.some(o => o.id === outcome.id));
      content = (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Outcome Analysis</h3>
          <div style={{ padding: '1.25rem', backgroundColor: '#fcfcfc', border: '1px solid var(--border)', borderRadius: '6px', marginBottom: '1.5rem' }}>
            <div className="text-small" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{outcome.id}</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>"{outcome.description}"</div>
          </div>

          <div className="detail-section">
            <h4 style={{ fontSize: 'var(--font-size-meta)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Curriculum Mapping</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span className="text-small">Linked Modules</span>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {linkedModules.length === 0 ? (
                    <span className="badge">No Modules Linked</span>
                  ) : linkedModules.map(m => (
                    <span key={m.id} className="badge">{m.code}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-small">Aligned Assessments</span>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {outcome.alignedAssessments.length === 0 ? (
                    <span className="badge">No Assessments Aligned</span>
                  ) : outcome.alignedAssessments.map(as => (
                    <span key={as} className="badge">{as}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else if (item.type === 'week') {
    const weekNum = parseInt(item.id, 10);
    const assessmentsInWeek = dataset.assessments.filter(a => a.week === weekNum);
    
    content = (
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Workload Review</h3>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Academic Week {weekNum}</h4>
        
        <div className="detail-section">
          <h4 style={{ fontSize: 'var(--font-size-meta)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Assessments ({assessmentsInWeek.length})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assessmentsInWeek.map(a => (
              <div key={a.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.type}</span>
                  <span className="badge">{a.weighting}% Weight</span>
                </div>
                <div className="text-small">Mapped to {a.linkedOutcomes.length} learning outcomes</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (item.type === 'programme') {
    const prog = dataset.programmes.find(p => p.id === item.id);
    if (prog) {
      content = (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Programme Governance</h3>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{prog.title}</h4>
          
          <div className="detail-section">
            <h4 style={{ fontSize: 'var(--font-size-meta)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Summary Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-small">Total Modules</span>
                <span style={{ fontWeight: 600 }}>{prog.modules.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-small">Governance Status</span>
                <span className="badge">{prog.metadata.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-small">Version</span>
                <span style={{ fontWeight: 600 }}>v{prog.metadata.version}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-small">Last Institutional Review</span>
                <span style={{ fontWeight: 600 }}>{prog.metadata.lastReviewed}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else if (item.type === 'ai-record') {
    const record = dataset.aiGovernanceRecords?.find(r => r.id === item.id);
    if (record) {
      let label = record.entityId;
      if (record.entityType === 'module') label = dataset.modules.find(m => m.id === record.entityId)?.title || label;
      else if (record.entityType === 'programme') label = dataset.programmes.find(p => p.id === record.entityId)?.title || label;
      else if (record.entityType === 'outcome') label = dataset.outcomes.find(o => o.id === record.entityId)?.description || label;
      
      content = (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>AI Oversight Detail</h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="badge" style={{ textTransform: 'uppercase', fontSize: 'var(--font-size-meta)' }}>{record.entityType}</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{label}</div>
          </div>
          
          <div className="detail-section">
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Oversight Checklist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Human Review Recorded', value: record.humanReviewed },
                { label: 'Pedagogical Rationale', value: record.rationaleRecorded },
                { label: 'Source Material Verified', value: record.sourceMaterialChecked },
                { label: 'Active Human Edit', value: record.outputModifiedByHuman },
                { label: 'Accountability Owner', value: record.accountabilityNamed }
              ].map(trace => (
                <div key={trace.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-small">{trace.label}</span>
                  <span className="badge" style={{ opacity: trace.value ? 1 : 0.4 }}>
                    {trace.value ? 'Verified' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Audit Notes</h4>
            <div style={{ padding: '1rem', backgroundColor: '#fcfcfc', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.875rem' }}>
              {record.notes || <em style={{ opacity: 0.5 }}>No institutional audit notes attached.</em>}
            </div>
          </div>
        </div>
      );
    }
  }

  if (!content) content = <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No detailed data found for this item.</div>;

  return (
    <div className="detail-panel-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Institutional Data Viewer</span>
          <button 
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.5rem', lineHeight: 1 }} 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="detail-panel-content">
          {content}
        </div>
      </div>
    </div>
  );
}


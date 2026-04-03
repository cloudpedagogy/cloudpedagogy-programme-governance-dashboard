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
          <h3>Module: {mod.code} - {mod.title}</h3>
          <p><strong>Credits:</strong> {mod.credits}</p>
          <div className="detail-section">
            <h4>Usage & Alignment</h4>
            <p className="detail-explanation">Shows where this module is taught and how robust its curriculum footprint is.</p>
            <ul>
              <li>Used in <strong>{usingProgs.length}</strong> programme(s): {usingProgs.map(p => p.title).join(', ')}</li>
              <li>Outcomes mapped: {mod.outcomes.length}</li>
              <li>Assessments mapped: {mod.assessments.length}</li>
            </ul>
          </div>
          <div className="detail-section">
            <h4>Governance ({score.toFixed(0)}%)</h4>
            <p className="detail-explanation">Exposes the specific missing compliance documentation for this module.</p>
            <ul>
              <li>Documented Outcomes: {(govMeta.documentedOutcomes ?? 0) * 100}%</li>
              <li>Assessment Mapping: {(govMeta.assessmentMapping ?? 0) * 100}%</li>
              <li>Dependency Clarity: {(govMeta.dependencyClarity ?? 0) * 100}%</li>
              <li>Programme Alignment: {(govMeta.programmeAlignmentEvidence ?? 0) * 100}%</li>
            </ul>
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
          <h3>Outcome: {outcome.id}</h3>
          <p className="outcome-text">"{outcome.description}"</p>
          <div className="detail-section">
            <h4>Curriculum Linkage</h4>
            <p className="detail-explanation">Identifies structural orphan risks. Outcomes with no modules or assessments are curriculum defects.</p>
            <ul>
              <li><strong>Modules Teaching this:</strong> {linkedModules.length === 0 ? <span className="text-danger">None</span> : linkedModules.map(m => m.code).join(', ')}</li>
              <li><strong>Aligned Assessments:</strong> {outcome.alignedAssessments.length === 0 ? <span className="text-danger">None</span> : outcome.alignedAssessments.join(', ')}</li>
            </ul>
          </div>
        </div>
      );
    }
  } else if (item.type === 'week') {
    const weekNum = parseInt(item.id, 10);
    const assessmentsInWeek = dataset.assessments.filter(a => a.week === weekNum);
    
    content = (
      <div>
        <h3>Assessment Load: Week {weekNum}</h3>
        <p className="detail-explanation">Examines student and staff structural overload by looking at assessment clustering.</p>
        <div className="detail-section">
          <h4>Assessments ({assessmentsInWeek.length} total)</h4>
          <ul>
            {assessmentsInWeek.map(a => (
              <li key={a.id}><strong>{a.type}</strong> (Weighting: {a.weighting}%) - Linked to {a.linkedOutcomes.length} outcomes</li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else if (item.type === 'programme') {
    const prog = dataset.programmes.find(p => p.id === item.id);
    if (prog) {
      content = (
        <div>
          <h3>Programme: {prog.title}</h3>
          <p>{prog.description}</p>
          <div className="detail-section">
            <h4>Structure</h4>
            <p className="detail-explanation">High-level details of programme volume and basic risk factors.</p>
            <ul>
              <li>Modules: {prog.modules.length}</li>
              <li>Metadata Status: {prog.metadata.status} v{prog.metadata.version}</li>
              <li>Last Reviewed: {prog.metadata.lastReviewed}</li>
            </ul>
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
          <h3>AI Oversight Record</h3>
          <p className="detail-explanation">Interpretive oversight signals reflecting transparency in AI-supported processes.</p>
          <div className="detail-section">
            <h4>Entity Link</h4>
            <ul>
              <li style={{ textTransform: 'capitalize' }}><strong>Type:</strong> {record.entityType}</li>
              <li><strong>Target:</strong> {label}</li>
              <li><strong>AI Use Type:</strong> {record.aiUseType?.join(', ') || 'Unspecified'}</li>
            </ul>
          </div>
          <div className="detail-section">
            <h4>Oversight Traces</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li>{record.humanReviewed ? '✅' : '❌'} Human Review Recorded</li>
              <li>{record.rationaleRecorded ? '✅' : '❌'} Pedagogical Rationale Included</li>
              <li>{record.sourceMaterialChecked ? '✅' : '❌'} Source Constraints Verified</li>
              <li>{record.outputModifiedByHuman ? '✅' : '❌'} Output Actively Modified</li>
              <li>{record.accountabilityNamed ? '✅' : '❌'} Accountability Owner Named</li>
            </ul>
          </div>
          <div className="detail-section">
            <h4>Audit Notes</h4>
            <p>{record.notes || <em>No specific notes attached to this record.</em>}</p>
            {record.reviewDate && <p className="text-small" style={{ marginTop: '0.5rem' }}>Reviewed on: {record.reviewDate}</p>}
          </div>
        </div>
      );
    }
  }

  if (!content) content = <p>No detailed data found for this item.</p>;

  return (
    <div className="detail-panel-overlay">
      <div className="detail-panel">
        <div className="detail-panel-header">
          <h2>Detail Viewer</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <div className="detail-panel-content">
          {content}
        </div>
      </div>
    </div>
  );
}

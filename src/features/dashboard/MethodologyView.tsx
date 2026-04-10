

export function MethodologyView() {
  return (
    <div className="feature-view">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Methodology & Transparency</h2>
      <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '6px', marginBottom: '2.5rem', backgroundColor: '#fcfcfc' }}>
        <p className="text-small" style={{ margin: 0 }}>
          <strong>Institutional Governance Note:</strong> These metrics are interpretive structural indicators designed to surface mapping gaps. They are not compliance scores and do not replace professional judgement or institutional decision-making.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        
        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Module Reuse Rate</h3>
          <p className="text-small"><strong>Definition:</strong> Illustrates the degree of structural efficiency and shared curriculum across programmes.</p>
          <p className="text-small"><strong>Logic:</strong> <code>(Shared Modules) / (Total Modules)</code></p>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>Note: Unified curriculum structures often show higher reuse rates, while specialized tracks show lower rates.</p>
        </div>

        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Outcome Alignment Score</h3>
          <p className="text-small"><strong>Definition:</strong> Measures how outcomes map to modules and verification tasks (assessments).</p>
          <p className="text-small"><strong>Logic:</strong> Multi-factor check for module presence, assessment presence, and concentration bounds.</p>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>Note: This measures structural opportunity, not academic difficulty or quality.</p>
        </div>

        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Assessment Load Balance</h3>
          <p className="text-small"><strong>Definition:</strong> Identifies potential structural stress points arising from clustered assessment deadlines.</p>
          <p className="text-small"><strong>Logic:</strong> Points deducted for every week hosting &ge;3 major assessments universally.</p>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>Note: This highlights administrative scheduling risks across the entire programme.</p>
        </div>

        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Governance Completeness</h3>
          <p className="text-small"><strong>Definition:</strong> Checklist aggregation ensuring administrative and pedagogical metadata isn't missing.</p>
          <p className="text-small"><strong>Logic:</strong> Aggregate of Documented Outcomes, Assessment Mapping, and Programme Alignment Evidence.</p>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>Note: This is an audit of metadata existence, not academic rigor.</p>
        </div>

        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>AI Visibility Rate</h3>
          <p className="text-small"><strong>Definition:</strong> Proportion of the curriculum structure with attached AI governance records.</p>
          <p className="text-small"><strong>Logic:</strong> <code>(AI Records) / (Total Curriculum Components)</code></p>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>Note: Measures logging effectiveness and institutional visibility into AI intersections.</p>
        </div>

        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Human Review Signal</h3>
          <p className="text-small"><strong>Definition:</strong> Fundamental safety check indicating academic human oversight.</p>
          <p className="text-small"><strong>Logic:</strong> Percentage of AI-tagged records with verified <code>humanReviewed</code> flag.</p>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>Note: Confirms the presence of a recorded oversight event.</p>
        </div>

        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Traceability Signal</h3>
          <p className="text-small"><strong>Definition:</strong> Tracks why AI was used, data boundaries, and accountability ownership.</p>
          <p className="text-small"><strong>Logic:</strong> Weighted score of rationale, source material constraints, and named accountability.</p>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>Note: Highlights where documentation trails might require strengthening.</p>
        </div>

        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>AI Oversight Readiness</h3>
          <p className="text-small"><strong>Definition:</strong> Holistic स्कैन (scanning) aggregate for institutional AI integration visibility.</p>
          <p className="text-small"><strong>Logic:</strong> Average of five critical defensive flags across all visible AI-operations.</p>
          <p className="text-small" style={{ color: 'var(--text-muted)' }}>Note: Designed for rapid scanning rather than individual quality assessment.</p>
        </div>

      </div>
    </div>
  );
}


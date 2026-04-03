

export function MethodologyView() {
  return (
    <div className="feature-view">
      <h2>Methodology & Transparency</h2>
      <p className="description" style={{ marginBottom: '2rem' }}>
        Learn how indicators are calculated. 
        <strong className="text-warning" style={{ display: 'block', marginTop: '0.5rem' }}>
          Important Note: These metrics are interpretive structural indicators designed to surface mapping gaps. They are NOT compliance scores (pass/fail) and do NOT replace professional judgement or institutional decision-making.
        </strong>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div className="kpi-card" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
          <h3 style={{ color: '#007bff', fontSize: '1.25rem' }}>Module Reuse Rate</h3>
          <p><strong>What it means:</strong> Illustrates the degree of structural efficiency and shared curriculum across programmes.</p>
          <p><strong>How it is calculated:</strong> <code>(Number of Modules Shared Across &gt;1 Programme) / (Total Number of Modules in Dataset)</code>.</p>
          <p><strong>What it does NOT mean:</strong> A high score does not necessarily mean "better". Excessive reuse might indicate a lack of specialized content for specific cohorts.</p>
        </div>

        <div className="kpi-card" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
          <h3 style={{ color: '#007bff', fontSize: '1.25rem' }}>Outcome Alignment Score</h3>
          <p><strong>What it means:</strong> Measures how comprehensively outcomes are mapped to teaching components (modules) and verification tasks (assessments), while penalizing extreme concentration.</p>
          <p><strong>How it is calculated:</strong> Each outcome earns points if it has at least one connected module (+40%), at least one connected assessment (+40%), and is not mapped to more than 3 assessments (+20% non-overconcentration bonus). The results are averaged across all outcomes.</p>
          <p><strong>What it does NOT mean:</strong> It does not measure the actual *quality* or difficulty of the mapping, nor does it guarantee students are definitively achieving the outcome—only that the structural opportunity exists.</p>
        </div>

        <div className="kpi-card" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
          <h3 style={{ color: '#007bff', fontSize: '1.25rem' }}>Assessment Load Balance</h3>
          <p><strong>What it means:</strong> Identifies potential structural stress points arising from clustered assessment deadlines.</p>
          <p><strong>How it is calculated:</strong> Out of 100 maximum points, the system subtracts points for every 'Overloaded Week'. A week is objectively classified as overloaded (high risk) if it concurrently hosts 3 or more assessments universally across the dataset.</p>
          <p><strong>What it does NOT mean:</strong> It cannot determine the exact hourly workload stress on students, as a 'Week 4' essay and a 'Week 4' multiple-choice quiz weigh differently in reality.</p>
        </div>

        <div className="kpi-card" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
          <h3 style={{ color: '#007bff', fontSize: '1.25rem' }}>Governance Completeness</h3>
          <p><strong>What it means:</strong> A direct checklist aggregation ensuring administrative and pedagogical metadata isn't missing.</p>
          <p><strong>How it is calculated:</strong> Averages four specific scalar dimensions embedded on each module: Documented Outcomes, Assessment Mapping Clarity, Dependency Accuracy, and Programme Alignment Evidence.</p>
          <p><strong>What it does NOT mean:</strong> This is an audit of the *existence* of valid metadata. It does not measure academic rigor. 50% completeness merely means half the required governance fields haven't been adequately filled out.</p>
        </div>

        <div className="kpi-card" style={{ textAlign: 'left', alignItems: 'flex-start', borderLeft: '4px solid #17a2b8' }}>
          <h3 style={{ color: '#17a2b8', fontSize: '1.25rem' }}>AI Visibility Rate</h3>
          <p><strong>What it means:</strong> The proportion of the overall curriculum structure that has attached AI governance records.</p>
          <p><strong>How it is calculated:</strong> <code>(Total AI Records) / (Total Programmes + Modules + Outcomes + Assessments)</code></p>
          <p><strong>What it does NOT mean:</strong> A high score does not mean "AI is doing everything," nor does it mean "bad governance." It solely measures how effectively the institution is recording and logging AI intersections.</p>
        </div>

        <div className="kpi-card" style={{ textAlign: 'left', alignItems: 'flex-start', borderLeft: '4px solid #17a2b8' }}>
          <h3 style={{ color: '#17a2b8', fontSize: '1.25rem' }}>Human Review Signal</h3>
          <p><strong>What it means:</strong> The fundamental safety check indicating that an academic human looked at the final output.</p>
          <p><strong>How it is calculated:</strong> Measures the percentage of AI-tagged records where the <code>humanReviewed</code> flag is strictly marked as true.</p>
          <p><strong>What it does NOT mean:</strong> It does not represent compliance scoring or automated approval, nor does it guarantee the human review was thorough—only that a record of the oversight event exists.</p>
        </div>

        <div className="kpi-card" style={{ textAlign: 'left', alignItems: 'flex-start', borderLeft: '4px solid #17a2b8' }}>
          <h3 style={{ color: '#17a2b8', fontSize: '1.25rem' }}>Traceability Signal</h3>
          <p><strong>What it means:</strong> Ensures we know exactly *why* AI was used, *where* the data boundaries were, and *who* is responsible.</p>
          <p><strong>How it is calculated:</strong> A weighted score assessing whether pedagogical rationale was provided, whether source materials were constrained, and if an accountability owner was explicitly named on the records.</p>
          <p><strong>What it does NOT mean:</strong> It does not replace professional judgement. A low traceability score simply acts as a pointer highlighting where documentation trails have broken down.</p>
        </div>

        <div className="kpi-card" style={{ textAlign: 'left', alignItems: 'flex-start', borderLeft: '4px solid #17a2b8' }}>
          <h3 style={{ color: '#17a2b8', fontSize: '1.25rem' }}>AI Oversight Readiness</h3>
          <p><strong>What it means:</strong> A holistic, high-level aggregate score designed for rapid institutional scanning of AI integrations.</p>
          <p><strong>How it is calculated:</strong> Averages five critical defensive flags across all visible AI-operations: Human Review, Rationale Presence, Source Material Checks, Active Human Modification, and Identified Accountability.</p>
          <p><strong>What it does NOT mean:</strong> It is highly interpretive and exists solely to support visibility. It is not an objective quality grade of the curriculum.</p>
        </div>

      </div>
    </div>
  );
}

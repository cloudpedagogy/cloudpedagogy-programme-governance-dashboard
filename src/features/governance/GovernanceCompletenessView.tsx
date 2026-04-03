
import type { CombinedDataset } from '../../types';

interface GovernanceCompletenessViewProps {
  dataset: CombinedDataset;
}

export function GovernanceCompletenessView({ dataset }: GovernanceCompletenessViewProps) {
  const { modules, governanceMetadata } = dataset;

  const govData = modules.map(mod => {
    const meta = governanceMetadata[mod.id] || {};
    const docOut = meta.documentedOutcomes ?? 0;
    const asMap = meta.assessmentMapping ?? 0;
    const depClarity = meta.dependencyClarity ?? 0;
    const progAlign = meta.programmeAlignmentEvidence ?? 0;
    
    const score = ((docOut + asMap + depClarity + progAlign) / 4) * 100;

    return {
      id: mod.id,
      code: mod.code,
      title: mod.title,
      docOut: docOut * 100,
      asMap: asMap * 100,
      depClarity: depClarity * 100,
      progAlign: progAlign * 100,
      score
    };
  });

  // Sort weakest modules first
  govData.sort((a, b) => a.score - b.score);

  return (
    <div className="feature-view">
      <h2>Governance Completeness</h2>
      <p className="description">Drill down into the detailed governance checklist for all modules.</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Module</th>
            <th>Doc Outcomes</th>
            <th>Assessment Map</th>
            <th>Dep Clarity</th>
            <th>Prog Align</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {govData.map(data => (
            <tr key={data.id}>
              <td><strong>{data.code}</strong>: {data.title}</td>
              <td className={data.docOut < 100 ? 'text-warning' : 'text-success'}>{data.docOut.toFixed(0)}%</td>
              <td className={data.asMap < 100 ? 'text-warning' : 'text-success'}>{data.asMap.toFixed(0)}%</td>
              <td className={data.depClarity < 100 ? 'text-warning' : 'text-success'}>{data.depClarity.toFixed(0)}%</td>
              <td className={data.progAlign < 100 ? 'text-warning' : 'text-success'}>{data.progAlign.toFixed(0)}%</td>
              <td>
                <strong className={data.score < 80 ? 'text-danger' : data.score < 100 ? 'text-warning' : 'text-success'}>
                  {data.score.toFixed(0)}%
                </strong>
              </td>
            </tr>
          ))}
          {govData.length === 0 && (
            <tr>
              <td colSpan={6}>No modules found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

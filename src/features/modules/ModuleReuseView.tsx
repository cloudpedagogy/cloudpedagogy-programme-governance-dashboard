
import type { CombinedDataset } from '../../types';

interface ModuleReuseViewProps {
  dataset: CombinedDataset;
}

export function ModuleReuseView({ dataset }: ModuleReuseViewProps) {
  const { modules, programmes } = dataset;

  const moduleData = modules.map(mod => {
    const usingProgrammes = programmes.filter(p => p.modules.some(m => m.id === mod.id));
    return {
      id: mod.id,
      code: mod.code,
      title: mod.title,
      programmeCount: usingProgrammes.length,
      programmes: usingProgrammes.map(p => p.id), // or p.title
      isShared: usingProgrammes.length > 1
    };
  });

  // Sort: Shared highest first, then by programme count descending
  moduleData.sort((a, b) => b.programmeCount - a.programmeCount);

  return (
    <div className="feature-view">
      <h2>Module Reuse</h2>
      <p className="description">Explore how modules are distributed across different programmes.</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Module Name</th>
            <th>Programmes Using</th>
            <th>Status</th>
            <th>Programme IDs</th>
          </tr>
        </thead>
        <tbody>
          {moduleData.map(mod => (
            <tr key={mod.id}>
              <td>
                <strong>{mod.code}</strong>: {mod.title}
              </td>
              <td>{mod.programmeCount}</td>
              <td>
                {mod.isShared ? (
                  <span className="badge badge-primary">Shared</span>
                ) : (
                  <span className="badge badge-default">Single-programme</span>
                )}
              </td>
              <td>
                <span className="text-small">{mod.programmes.join(', ')}</span>
              </td>
            </tr>
          ))}
          {moduleData.length === 0 && (
            <tr>
              <td colSpan={4}>No modules found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

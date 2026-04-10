
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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Module Reuse</h2>
      <p className="text-small" style={{ marginBottom: '2rem' }}>Explore module distribution across institutional programmes.</p>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>Module</th>
            <th style={{ width: '150px' }}>Programmes</th>
            <th style={{ width: '150px' }}>Status</th>
            <th>Distribution</th>
          </tr>
        </thead>
        <tbody>
          {moduleData.map(mod => (
            <tr key={mod.id}>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mod.code}</div>
                <div className="text-small">{mod.title}</div>
              </td>
              <td>
                <span style={{ fontWeight: 500 }}>{mod.programmeCount}</span>
              </td>
              <td>
                {mod.isShared ? (
                  <span className="badge">Shared</span>
                ) : (
                  <span className="badge" style={{ opacity: 0.6 }}>Standard</span>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {mod.programmes.map(pId => (
                    <span key={pId} className="text-small" style={{ border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '4px' }}>
                      {pId}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
          {moduleData.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No modules detected in current governance dataset.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


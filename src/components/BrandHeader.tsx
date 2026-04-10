import React from 'react';

export const BrandHeader: React.FC = () => {
  return (
    <header style={{ 
      padding: '1.5rem 0', 
      borderBottom: '1px solid var(--border)',
      marginBottom: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      <a 
        href="https://www.cloudpedagogy.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-primary)', 
          textDecoration: 'none',
          fontWeight: 500,
          marginBottom: '0.25rem'
        }}
      >
        CloudPedagogy
      </a>
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        Programme Governance Dashboard
      </div>
    </header>
  );
};

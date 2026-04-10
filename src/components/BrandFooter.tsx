import React from 'react';

export const BrandFooter: React.FC = () => {
  return (
    <footer style={{ 
      padding: '2rem 0', 
      borderTop: '1px solid var(--border)',
      marginTop: '4rem',
      textAlign: 'left'
    }}>
      <p style={{ 
        fontSize: 'var(--font-size-meta)', 
        color: 'var(--text-muted)', 
        margin: 0,
        letterSpacing: '0.01em'
      }}>
        CloudPedagogy · Governance-ready AI and curriculum systems
      </p>
    </footer>
  );
};

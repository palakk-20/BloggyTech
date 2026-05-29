import React from 'react';

const LoadingComponent = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            {/* Inline CSS animation for a clean pink spinner */}
            <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255, 192, 203, 0.3)', // Light pink background ring
                borderTop: '4px solid pink',                  // Solid pink spinning head
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingComponent;
import React from 'react';

interface UsernameModalProps {
  onClose: () => void;
  onCheckAgain: () => void;
  isChecking: boolean;
}

// Note: This modal is not currently used in Arc version
// Kept for potential future use
const UsernameModal: React.FC<UsernameModalProps> = ({ onClose, onCheckAgain, isChecking }) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '1200px',
        height: '900px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0a1929 0%, #051420 100%)',
          padding: '40px 38px 20px 38px',
          borderRadius: '20px',
          width: '500px',
          minHeight: '300px',
          margin: '0 auto',
          border: '2px solid #00D4FF',
          boxShadow: '0 0 40px rgba(0, 212, 255, 0.4), inset 0 0 60px rgba(0, 212, 255, 0.03)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#00D4FF',
            fontSize: '24px',
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          ✕
        </button>

        <h2 style={{
          color: '#00D4FF',
          marginBottom: '20px',
          marginTop: '12px',
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          fontFamily: "'Orbitron', sans-serif",
          textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
        }}>
          Welcome to Arc
        </h2>
        <p style={{
          fontSize: '16px',
          display: 'block',
          color: '#E0F7FF',
          lineHeight: '1.6',
          textAlign: 'center',
          opacity: 0.9
        }}>
          Connect your wallet to start playing on Arc Testnet.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '18px 32px',
              background: 'linear-gradient(90deg, #00D4FF 0%, #0099CC 100%)',
              color: '#0a1929',
              fontWeight: 'bold',
              fontSize: '18px',
              fontFamily: "'Orbitron', sans-serif",
              border: 'none',
              borderRadius: '32px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0, 212, 255, 0.5)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.5)';
            }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsernameModal;

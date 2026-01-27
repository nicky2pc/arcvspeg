import React from 'react';
import { ARC_CONFIG } from '../../../game/arcMintUtils';

interface FaucetModalProps {
  onClose: () => void;
}

const FaucetModal: React.FC<FaucetModalProps> = ({ onClose }) => {
  const openFaucet = () => {
    window.open(ARC_CONFIG.faucet, '_blank');
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0a1929 0%, #051420 100%)',
          padding: '40px 30px',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '480px',
          textAlign: 'center',
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

        {/* Icon */}
        <div style={{ marginBottom: '20px' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
            <circle cx="12" cy="12" r="10" stroke="#00D4FF" strokeWidth="2" fill="none"/>
            <path d="M12 6v2m0 8v2m-6-6h2m8 0h2" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" fill="#00D4FF"/>
          </svg>
        </div>

        <h2 style={{
          color: '#00D4FF',
          fontSize: '28px',
          margin: '0 0 16px 0',
          fontWeight: 'bold',
          fontFamily: "'Orbitron', sans-serif",
          textShadow: '0 0 20px rgba(0, 212, 255, 0.5)'
        }}>
          Get Testnet USDC
        </h2>

        <p style={{
          color: '#E0F7FF',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '28px',
          opacity: 0.9
        }}>
          You need USDC on <strong>Arc Testnet</strong> to mint your Trophy NFT and pay for gas.
        </p>

        <button
          onClick={openFaucet}
          style={{
            display: 'block',
            width: '100%',
            padding: '18px 32px',
            background: 'linear-gradient(90deg, #00D4FF 0%, #0099CC 100%)',
            color: '#0a1929',
            fontWeight: 'bold',
            fontSize: '18px',
            fontFamily: "'Orbitron', sans-serif",
            borderRadius: '32px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.5)',
            marginBottom: '20px',
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
          Open Circle Faucet
        </button>

        <div style={{
          background: 'rgba(0, 212, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '8px'
        }}>
          <p style={{
            color: '#E0F7FF',
            fontSize: '14px',
            margin: 0,
            opacity: 0.8
          }}>
            <strong>Steps:</strong><br/>
            1. Select "Arc Testnet" on the faucet<br/>
            2. Paste your wallet address<br/>
            3. Request USDC and return here
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaucetModal;

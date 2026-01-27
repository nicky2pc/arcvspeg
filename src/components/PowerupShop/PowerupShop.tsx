import React, { useState, useEffect } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { buyPowerup, getPlayerPowerups } from '../../game/arcMintUtils';
import './PowerupShop.css';

interface PowerupShopProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_POWERUPS = 3; // Max per type for game balance

const POWERUP_INFO = {
  shield: {
    name: 'Shield',
    icon: '🛡️',
    description: '+1 extra hit protection',
    price: '0.01 USDC'
  },
  speed: {
    name: 'Speed Boost',
    icon: '⚡',
    description: '+15% move speed in game',
    price: '0.005 USDC'
  },
  double: {
    name: 'Double Damage',
    icon: '💥',
    description: '2x damage for 20 seconds',
    price: '0.02 USDC'
  }
};

const PowerupShop: React.FC<PowerupShopProps> = ({ isOpen, onClose }) => {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [playerPowerups, setPlayerPowerups] = useState({
    shields: 0,
    speedBoosts: 0,
    doubles: 0,
    spent: '0'
  });

  // Use wallets[0] like NFT mint does
  const wallet = wallets[0];

  useEffect(() => {
    if (isOpen && wallet?.address) {
      loadPlayerPowerups();
    }
  }, [isOpen, wallet?.address]);

  const loadPlayerPowerups = async () => {
    if (!wallet?.address) return;
    try {
      const powerups = await getPlayerPowerups(wallet.address);
      setPlayerPowerups(powerups);
    } catch (error) {
      console.error('Failed to load powerups:', error);
    }
  };

  const handlePurchase = async (type: 'shield' | 'speed' | 'double') => {
    if (!wallet) {
      setStatus('No wallet connected');
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    if (isPurchasing) return;

    setIsPurchasing(true);
    setStatus(`Purchasing ${POWERUP_INFO[type].name}...`);

    try {
      const txHash = await buyPowerup(wallet, type, 1, (msg) => {
        setStatus(msg);
      });
      setStatus(`${POWERUP_INFO[type].name} purchased!`);
      await loadPlayerPowerups();
      setTimeout(() => setStatus(null), 3000);
    } catch (error: any) {
      setStatus(error.message || 'Purchase failed');
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="powerup-overlay" onClick={onClose}>
      <div className="powerup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="powerup-header">
          <h2>POWERUP SHOP</h2>
          <button className="powerup-close" onClick={onClose}>✕</button>
        </div>

        {!authenticated ? (
          <div className="powerup-body">
            <p className="powerup-notice">Login to purchase powerups</p>
          </div>
        ) : (
          <div className="powerup-body">
            <div className="powerup-inventory">
              <span>Your Powerups:</span>
              <div className="inventory-items">
                <div className="inv-item">🛡️ {playerPowerups.shields}</div>
                <div className="inv-item">⚡ {playerPowerups.speedBoosts}</div>
                <div className="inv-item">💥 {playerPowerups.doubles}</div>
              </div>
            </div>

            <div className="powerup-grid">
              {(Object.keys(POWERUP_INFO) as Array<keyof typeof POWERUP_INFO>).map((type) => {
                const owned = type === 'shield' ? playerPowerups.shields :
                              type === 'speed' ? playerPowerups.speedBoosts :
                              playerPowerups.doubles;
                const isMaxed = owned >= MAX_POWERUPS;

                return (
                  <div key={type} className={`powerup-card ${isMaxed ? 'maxed' : ''}`}>
                    <div className="powerup-icon">{POWERUP_INFO[type].icon}</div>
                    <div className="powerup-name">{POWERUP_INFO[type].name}</div>
                    <div className="powerup-desc">{POWERUP_INFO[type].description}</div>
                    <div className="powerup-owned">{owned}/{MAX_POWERUPS}</div>
                    <div className="powerup-price">{POWERUP_INFO[type].price}</div>
                    <button
                      className="powerup-buy-btn"
                      onClick={() => handlePurchase(type)}
                      disabled={isPurchasing || !wallet || isMaxed}
                    >
                      {isMaxed ? 'MAX' : isPurchasing ? 'WAIT...' : 'BUY'}
                    </button>
                  </div>
                );
              })}
            </div>

            {status && (
              <div className={`powerup-status ${status.includes('failed') || status.includes('error') ? 'error' : ''}`}>
                {status}
              </div>
            )}

            <div className="powerup-note">
              Powerups are stored onchain. Effects apply every game.
              <br />
              Max {MAX_POWERUPS} per type for balance.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerupShop;

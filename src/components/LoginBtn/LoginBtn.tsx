import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ARC_CONFIG } from '../../game/arcMintUtils.ts';
import { ethers } from 'ethers';

export default function LoginBtn() {
  const { ready: privyReady, authenticated, login, logout, isModalOpen } = usePrivy();
  const { wallets } = useWallets();

  const connectedWallet = wallets[0];

  const fullAddress = connectedWallet?.address || '';
  const shortAddress = fullAddress
    ? `${fullAddress.slice(0, 6)}...${fullAddress.slice(-4)}`
    : '';

  const [displayText, setDisplayText] = useState(shortAddress);
  const [balance, setBalance] = useState('0.0000');
  const [needsFaucet, setNeedsFaucet] = useState(false);

  const updateBalance = async () => {
    if (!connectedWallet) return;

    try {
      const ethereumProvider = await connectedWallet.getEthereumProvider();
      const provider = new ethers.BrowserProvider(ethereumProvider);

      // Check network and switch if needed
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== ARC_CONFIG.chainId) {
        try {
          await ethereumProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${ARC_CONFIG.chainId.toString(16)}` }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await ethereumProvider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${ARC_CONFIG.chainId.toString(16)}`,
                chainName: 'Arc Testnet',
                rpcUrls: [ARC_CONFIG.rpc],
                nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
                blockExplorerUrls: [ARC_CONFIG.explorer],
              }],
            });
          }
        }
      }

      const balanceWei = await provider.getBalance(connectedWallet.address);
      const formatted = ethers.formatEther(balanceWei);
      const rounded = parseFloat(formatted).toFixed(4);
      setBalance(rounded);

      // Check if needs faucet (less than 0.001 USDC)
      setNeedsFaucet(parseFloat(rounded) < 0.001);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance('0.0000');
      setNeedsFaucet(true);
    }
  };

  const copyAddress = async () => {
    if (!fullAddress) return;
    await navigator.clipboard.writeText(fullAddress);
    setDisplayText('Copied!');
    setTimeout(() => setDisplayText(shortAddress), 2000);
  };

  const handleLoginClick = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  const openFaucet = () => {
    window.open(ARC_CONFIG.faucet, '_blank');
  };

  useEffect(() => {
    setDisplayText(shortAddress);
  }, [shortAddress]);

  useEffect(() => {
    if (authenticated && connectedWallet) {
      updateBalance();
      const interval = setInterval(updateBalance, 15000);
      return () => clearInterval(interval);
    } else {
      setBalance('0.0000');
      setNeedsFaucet(false);
    }
  }, [authenticated, connectedWallet]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  if (!privyReady) {
    return null;
  }

  return (
    <>
      <button className="login-btn" onClick={handleLoginClick} disabled={!privyReady}>
        <span>{authenticated ? 'Logout' : 'Login'}</span>
      </button>

      {authenticated && fullAddress && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
          <div
            className="username-container"
            onClick={copyAddress}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            title="Click to copy address"
          >
            <p
              style={{
                background: displayText === 'Copied!' ? 'linear-gradient(90deg, #0099CC 0%, #00D4FF 100%)' : 'none',
                WebkitBackgroundClip: displayText === 'Copied!' ? 'text' : 'initial',
                WebkitTextFillColor: displayText === 'Copied!' ? 'transparent' : 'inherit',
                fontWeight: displayText === 'Copied!' ? '700' : 'normal',
                transition: 'all 0.3s ease',
                margin: 0,
              }}
            >
              {displayText}
            </p>
          </div>

          <div
            className="balance-container"
            onClick={needsFaucet ? openFaucet : undefined}
            style={{
              cursor: needsFaucet ? 'pointer' : 'default',
              borderColor: needsFaucet ? '#FF6B6B' : undefined,
              animation: needsFaucet ? 'pulse-warning 2s infinite' : undefined
            }}
            title={needsFaucet ? 'Click to get testnet USDC' : undefined}
          >
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {balance} USDC
              {needsFaucet && (
                <span style={{ color: '#FF6B6B', fontSize: '12px' }}>
                  (Get USDC)
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-warning {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.3); }
          50% { box-shadow: 0 0 15px rgba(255, 107, 107, 0.6); }
        }
      `}</style>
    </>
  );
}

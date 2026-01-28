import React, { useState, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import './NFTScoreChecker.css';

interface NFTScoreCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTokenId?: number;
}

// Simple ABI for reading NFT score
const NFT_ABI = [
  "function getScore(uint256 tokenId) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '';
const ARC_RPC_URL = 'https://rpc.testnet.arc.network';

const NFTScoreCheckerModal: React.FC<NFTScoreCheckerModalProps> = ({
  isOpen,
  onClose,
  initialTokenId
}) => {
  const [tokenId, setTokenId] = useState<string>(initialTokenId ? initialTokenId.toString() : '');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; score?: number; owner?: string } | null>(null);
  const { wallets } = useWallets();

  const NFT_IMAGE_URL = 'https://ipfs.io/ipfs/bafybeibp4angkcrdleql6delf6yq3w7e6nan6ozs6aueky4kesxsqbdb7a';

  // Auto-fill tokenId if provided
  useEffect(() => {
    if (initialTokenId) {
      setTokenId(initialTokenId.toString());
    }
  }, [initialTokenId]);

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      if (!initialTokenId) {
        setTokenId('');
      }
    }
  }, [isOpen, initialTokenId]);

  const handleCheckNFT = async () => {
    const id = parseInt(tokenId);
    if (isNaN(id) || id < 0) {
      setResult({ success: false, message: 'Enter valid NFT ID (number)' });
      return;
    }

    if (!NFT_CONTRACT_ADDRESS) {
      setResult({ success: false, message: 'NFT contract address not configured' });
      return;
    }

    setIsChecking(true);
    setResult(null);

    try {
      const provider = new ethers.JsonRpcProvider(ARC_RPC_URL);
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);

      // Check if token exists by getting owner
      const owner = await contract.ownerOf(id);
      const score = await contract.getScore(id);

      setResult({
        success: true,
        message: `Trophy NFT #${id}`,
        score: Number(score),
        owner: owner
      });
    } catch (error: any) {
      // Handle various error cases with user-friendly messages
      const errorMsg = error.message?.toLowerCase() || '';
      const errorCode = error.code || '';

      if (
        errorMsg.includes('nonexistent token') ||
        errorMsg.includes('invalid token') ||
        errorMsg.includes('erc721') ||
        errorMsg.includes('call_exception') ||
        errorCode === 'CALL_EXCEPTION' ||
        error.data?.includes('0x7e273289') // ERC721NonexistentToken selector
      ) {
        setResult({
          success: false,
          message: `NFT #${id} does not exist yet`
        });
      } else if (errorMsg.includes('network') || errorMsg.includes('timeout')) {
        setResult({
          success: false,
          message: 'Network error. Please try again.'
        });
      } else {
        setResult({
          success: false,
          message: 'Unable to fetch NFT data. Token may not exist.'
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleClear = () => {
    setTokenId('');
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tokenId && !isChecking) {
      handleCheckNFT();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">NFT SCORE CHECKER</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Enter NFT ID to view its game score
          </p>

          <div className="input-section">
            <input
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter NFT ID (e.g., 1)"
              min="0"
              disabled={isChecking}
              className="token-input"
              autoFocus
            />
          </div>

          <div className="button-section">
            <button
              onClick={handleCheckNFT}
              disabled={isChecking || !tokenId}
              className="check-button"
            >
              {isChecking ? 'CHECKING...' : 'CHECK SCORE'}
            </button>

            <button
              onClick={handleClear}
              disabled={isChecking}
              className="clear-button"
            >
              CLEAR
            </button>
          </div>

          {result && (
            <div className={`result-container ${result.success ? 'success' : 'error'}`}>
              <div className="result-message">
                {result.message}
              </div>

              {result.success && result.score !== undefined && (
                <div className="score-display">
                  <div className="nft-image-preview">
                    <img
                      src={NFT_IMAGE_URL}
                      alt={`NFT #${tokenId}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200/1b1b1b/00D4FF?text=ARC+TROPHY';
                      }}
                    />
                  </div>
                  <div className="score-value">
                    <span className="score-label">Game Score:</span>
                    <span className="score-number">{result.score}</span>
                  </div>
                  <div className="nft-info">
                    <div className="nft-id">Token ID: #{tokenId}</div>
                    {result.owner && (
                      <div className="owner-info">
                        Owner: {shortenAddress(result.owner)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="info-section">
            <h4>HOW IT WORKS:</h4>
            <ul>
              <li>Enter any NFT ID to check its recorded score</li>
              <li>Trophy NFTs are minted when you score 5+ points</li>
              <li>Each NFT stores the game score onchain</li>
              <li>View any player's achievement on Arc Testnet</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="close-modal-btn" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTScoreCheckerModal;

import React, { useState, useEffect } from 'react';
import { LeaderboardRecord, LeaderboardPopupProps } from '../../types.ts';
import { useWallets, usePrivy } from '@privy-io/react-auth';

const LeaderboardPopup: React.FC<LeaderboardPopupProps> = ({ isOpen, onClose }) => {
  const [guestLeaderboardData, setGuestLeaderboardData] = useState<LeaderboardRecord[]>([]);
  const [authLeaderboardData, setAuthLeaderboardData] = useState<LeaderboardRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guestErrorMessage, setGuestErrorMessage] = useState<string | null>(null);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'auth' | 'guest'>('auth');

  const { wallets } = useWallets();
  const { authenticated } = usePrivy();

  const fetchAllLeaderboards = async () => {
    setIsLoading(true);
    setGuestErrorMessage(null);
    setAuthErrorMessage(null);

    try {
      const guestData = await import('../../game/utils.ts').then(m => m.getLeaderBoard());
      setGuestLeaderboardData(guestData);
    } catch (error) {
      setGuestErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }

    try {
      const authData = await import('../../game/utils.ts').then(m => m.getAuthLeaderBoard());
      setAuthLeaderboardData(authData);
    } catch (error) {
      setAuthErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }

    setIsLoading(false);
  };

  const fetchActiveLeaderboard = async () => {
    setIsLoading(true);

    if (activeTab === 'auth') {
      setAuthErrorMessage(null);
      try {
        const data = await import('../../game/utils.ts').then(m => m.getAuthLeaderBoard());
        setAuthLeaderboardData(data);
      } catch (error) {
        setAuthErrorMessage(error instanceof Error ? error.message : "Unknown error");
      }
    } else {
      setGuestErrorMessage(null);
      try {
        const data = await import('../../game/utils.ts').then(m => m.getLeaderBoard());
        setGuestLeaderboardData(data);
      } catch (error) {
        setGuestErrorMessage(error instanceof Error ? error.message : "Unknown error");
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!authenticated) {
      setActiveTab('guest');
    } else {
      setActiveTab('auth');
    }
  }, [authenticated]);

  useEffect(() => {
    if (isOpen) {
      fetchAllLeaderboards();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLeaderboardData = activeTab === 'auth' ? authLeaderboardData : guestLeaderboardData;
  const currentErrorMessage = activeTab === 'auth' ? authErrorMessage : guestErrorMessage;
  const columnCount = activeTab === 'auth' ? 4 : 3;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Leaderboard</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'auth' ? 'active' : ''}`}
            onClick={() => setActiveTab('auth')}
          >
            Authorized players
          </button>
          <button
            className={`tab-button ${activeTab === 'guest' ? 'active' : ''}`}
            onClick={() => setActiveTab('guest')}
          >
            Guests
          </button>
        </div>

        <div className="table-wrapper" style={{ maxHeight: '700px', overflowY: 'auto' }}>
          <table className="transactions-table" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Place</th>
                <th style={{ width: activeTab === 'auth' ? '40%' : '50%' }}>
                  {activeTab === 'auth' ? 'Username / Wallet' : 'Player ID'}
                </th>
                {activeTab === 'auth' && <th style={{ width: '20%' }}>Top Score</th>}
                <th style={{ width: activeTab === 'auth' ? '30%' : '40%' }}>
                  {activeTab === 'auth' ? 'Total Score' : 'Score'}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentLeaderboardData.map((record, index) => {
                const place = index + 1;

                // Основнойスコア для правой колонки
                const displayScore = record.total_score ?? record.score ?? 0;

                // Отображение игрока
                let playerDisplay;
                if (activeTab === 'auth') {
                  if (record.username) {
                    playerDisplay = record.username.startsWith('@') ? (
                      <a href={`https://x.com/${record.username.substring(1)}`} target="_blank" rel="noopener noreferrer">
                        {record.username}
                      </a>
                    ) : record.username;
                  } else {
                    const shortAddr = record.address
                      ? `${record.address.slice(0, 6)}...${record.address.slice(-4)}`
                      : 'Unknown';
                    playerDisplay = shortAddr;
                  }
                } else {
                  // Guest
                  playerDisplay = record.id ?? 'Unknown';
                }

                return (
                  <tr key={index}>
                    <td>{place}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {playerDisplay}
                    </td>
                    {activeTab === 'auth' && <td>{record.score ?? '-'}</td>}
                    <td>{displayScore}</td>
                  </tr>
                );
              })}

              {currentLeaderboardData.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={columnCount} style={{ textAlign: 'center' }}>
                    {currentErrorMessage || "No players to display"}
                  </td>
                </tr>
              )}

              {isLoading && (
                <tr>
                  <td colSpan={columnCount} style={{ textAlign: 'center' }}>
                    Loading leaderboard...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button className="refresh-button" onClick={fetchActiveLeaderboard} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPopup;
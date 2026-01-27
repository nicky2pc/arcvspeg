import { useState, useEffect, useRef } from 'react';
import { CONFIG } from '../game/config.ts';
import { Transaction, UseTransactionsReturn, UpdateTransactionCallback } from '../types.ts';
import { usePrivy, useUser } from '@privy-io/react-auth';
import { useWallets } from '@privy-io/react-auth';

import { mintTrophyNFT, getExplorerUrl, ARC_CONFIG } from '../game/arcMintUtils.ts';


const TRANSACTIONS_UPDATED_EVENT = 'transactions-updated';

const dispatchTransactionsUpdated = (transactions: Transaction[]) => {
  const event = new CustomEvent(TRANSACTIONS_UPDATED_EVENT, { detail: transactions });
  window.dispatchEvent(event);
};

let globalTransactions: Transaction[] = (() => {
  const savedTransactions = localStorage.getItem("transactions");
  if (!savedTransactions) return [];

  let parsedTransactions = JSON.parse(savedTransactions);

  parsedTransactions = parsedTransactions.map(tx =>
    (!tx.link || tx.link === "Pending...") ? { ...tx, link: "Not processed" } : tx
  );

  localStorage.setItem("transactions", JSON.stringify(parsedTransactions));
  return parsedTransactions;
})();

const updateGlobalTransactions = (newTransactions: Transaction[]) => {
  globalTransactions = newTransactions;
  localStorage.setItem("transactions", JSON.stringify(globalTransactions));
  dispatchTransactionsUpdated(globalTransactions);
};

export const useTransactions = (): UseTransactionsReturn => {
  const { wallets } = useWallets();
  const { authenticated, user, getAccessToken } = usePrivy();
  const { refreshUser } = useUser();
  const privyWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  const [transactions, setTransactions] = useState<Transaction[]>(globalTransactions);
  const scoreBufferRef = useRef<number | null>(null);
  const submitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const pendingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleTransactionsUpdated = (event: CustomEvent<Transaction[]>) => {
      if (event.detail) {
        setTransactions([...event.detail]);
      } else {
        setTransactions([...globalTransactions]);
      }
    };

    window.addEventListener(TRANSACTIONS_UPDATED_EVENT, handleTransactionsUpdated as EventListener);

    setTransactions([...globalTransactions]);

    return () => {
      window.removeEventListener(TRANSACTIONS_UPDATED_EVENT, handleTransactionsUpdated as EventListener);
    };
  }, []);

  const updateTransactions = (transaction: Transaction, callback: UpdateTransactionCallback) => {
    const { id, type } = transaction;

    const updated = [transaction, ...globalTransactions];
    if (updated.length > CONFIG.MAX_TRANSACTIONS) {
      updated.length = CONFIG.MAX_TRANSACTIONS;
    }

    updateGlobalTransactions(updated);

    callback()
      .then((data) => {
        const updatedTransactions = globalTransactions.map(tx => {
          if (tx.id === id && tx.type === type) {
            if (tx.type === "Faucet") {
              if (data?.success) {
                return {
                  ...tx,
                  type: `Faucet: Success`,
                  link: ARC_CONFIG.faucet,
                  date: Date.now(),
                  error: ""
                };
              } else if (data?.error) {
                return {
                  ...tx,
                  link: "",
                  date: Date.now(),
                  error: data.error
                };
              }
            }

            return {
              ...tx,
              link: (data?.tx_url ?? tx.link) as string,
              tx_url: data?.tx_url ?? tx.tx_url,
              date: Date.now(),
              error: data?.error ?? tx.error
            };
          }
          return tx;
        });

        updateGlobalTransactions(updatedTransactions);
      })
      .catch(() => {
        const updatedTransactions = globalTransactions.map(tx =>
          tx.id === id && tx.type === type
            ? { ...tx, link: "", date: Date.now(), error: tx.error ? tx.error : "Unexpected error" }
            : tx
        );

        updateGlobalTransactions(updatedTransactions);
      });
  };

  const handleMint = (killCount: number) => {
    // Use Arc mint instead
    handleArcMint(killCount, killCount);
  };

  // Arc Trophy NFT Mint
  const handleArcMint = async (score: number, kills: number = score) => {
    const connectedWallet = wallets[0];

    if (!connectedWallet) {
      throw new Error("No wallet connected");
    }

    const transaction: Transaction = {
      id: Date.now(),
      type: `Trophy Mint: ${score} pts`,
      link: "Pending...",
      date: Date.now(),
      error: "",
      userAddress: connectedWallet.address
    };

    // Add transaction to list
    const updated = [transaction, ...globalTransactions];
    if (updated.length > CONFIG.MAX_TRANSACTIONS) {
      updated.length = CONFIG.MAX_TRANSACTIONS;
    }
    updateGlobalTransactions(updated);

    try {
      const txHash = await mintTrophyNFT(
        connectedWallet,
        score,
        kills,
        (status) => {
          console.log(`[Arc Mint] ${status}`);
        }
      );

      // Update transaction with hash
      const updatedTransactions = globalTransactions.map(tx =>
        tx.id === transaction.id
          ? {
            ...tx,
            link: getExplorerUrl(txHash),
            date: Date.now(),
            error: ""
          }
          : tx
      );
      updateGlobalTransactions(updatedTransactions);

      return txHash;
    } catch (error: any) {
      // On error, update transaction
      const updatedTransactions = globalTransactions.map(tx =>
        tx.id === transaction.id
          ? {
            ...tx,
            link: "",
            date: Date.now(),
            error: error.message || "Mint failed"
          }
          : tx
      );
      updateGlobalTransactions(updatedTransactions);
      throw error;
    }
  };

  // Alias for compatibility
  const handleConfidentialMint = handleArcMint;

  const handleFaucet = async (address: string) => {
    const transaction: Transaction = {
      id: Date.now(),
      type: `Faucet`,
      link: "Pending...",
      date: Date.now(),
      error: ""
    };

    const updated = [transaction, ...globalTransactions];
    if (updated.length > CONFIG.MAX_TRANSACTIONS) {
      updated.length = CONFIG.MAX_TRANSACTIONS;
    }
    updateGlobalTransactions(updated);

    // For Arc, open the Circle faucet in a new tab
    window.open(ARC_CONFIG.faucet, '_blank');

    // Update transaction to show faucet link
    const updatedTransactions = globalTransactions.map(tx =>
      tx.id === transaction.id
        ? {
          ...tx,
          type: "Faucet (Circle)",
          link: ARC_CONFIG.faucet,
          date: Date.now(),
          error: ""
        }
        : tx
    );
    updateGlobalTransactions(updatedTransactions);
  };

  const handleTotalScore = async (score: number, isDead = false, unitType?: 'FLY' | 'IRON' | 'BASIC_CASH' | 'TERRA_LUNA' | null, gameStat?: any) => {
    // For Arc, we don't send transactions for every kill - only at game end for mint
    // This saves gas and provides better UX

    if (!isDead) {
      // Just log the score update, don't send transaction
      console.log(`Score update: ${score}, enemy: ${unitType}`);
      return;
    }

    // On death, log final score
    console.log(`Game Over! Final score: ${score}`, gameStat);

    // No transaction on death - user can choose to mint if score >= 5
  };

  const clearTransactions = () => {
    updateGlobalTransactions([]);
  };

  return {
    transactions,
    handleMint,
    handleConfidentialMint,
    handleTotalScore,
    handleFaucet,
    clearTransactions
  };
};

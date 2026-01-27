import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

// Arc Testnet Configuration
const ARC_TESTNET = {
  id: 5042002,
  name: 'Arc Testnet',
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
    public: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
};

export const ARC_CONFIG = {
  chainId: 5042002,
  rpc: 'https://rpc.testnet.arc.network',
  wsRpc: 'wss://rpc.testnet.arc.network',
  explorer: 'https://testnet.arcscan.app',
  faucet: 'https://faucet.circle.com',
};

export default function PrivyWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmjh3wc2w01hpjv0ct8ex2f0l"
      config={{
        loginMethods: ['wallet'],
        supportedChains: [ARC_TESTNET],
        defaultChain: ARC_TESTNET,
        walletConnectCloudProjectId: '1247cce75f33facb80993a3fd3c9a16b',
        mfa: {
          noPromptOnMfaRequired: true,
        },
        appearance: {
          theme: 'dark',
          accentColor: '#00D4FF',
          logo: '/arc-favicon.svg',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

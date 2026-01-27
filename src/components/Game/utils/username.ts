// Arc doesn't use a centralized username system like Monad
// These functions are kept for compatibility but return null/empty

export const ARC_PROVIDER_ID = '';

// Legacy name kept for compatibility - returns undefined for Arc
export const getMonadIdWallet = (user: any): string | undefined => {
  // Arc doesn't use cross-app wallets - just return undefined to skip username checks
  return undefined;
};

// Alias with Arc naming
export const getArcWallet = getMonadIdWallet;

export const checkUsername = async (walletAddress: string) => {
  // Return empty name to skip username requirement on Arc
  return { name: null };
};

import { ethers } from 'ethers';

// Arc Testnet Configuration
export const ARC_CONFIG = {
  chainId: 5042002,
  rpc: 'https://rpc.testnet.arc.network',
  explorer: 'https://testnet.arcscan.app',
  faucet: 'https://faucet.circle.com',
};

// Contract ABIs
const NFT_ABI = [
  "function mintTrophy(string validationString, string tokenURI, uint256 score) external",
  "function getScore(uint256 tokenId) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function minScoreToMint() view returns (uint256)",
  "event TrophyMinted(address indexed player, uint256 indexed tokenId, uint256 score)"
];

const GAME_ACTIONS_ABI = [
  "function buyShield(uint256 quantity) external payable",
  "function buySpeedBoost(uint256 quantity) external payable",
  "function buyDoubleDamage(uint256 quantity) external payable",
  "function donate(string message) external payable",
  "function getPlayerPowerups(address player) view returns (uint256 shields, uint256 speedBoosts, uint256 doubles, uint256 spent)",
  "function getPrices() view returns (uint256 shield, uint256 speed, uint256 double)",
  "event PowerupPurchased(address indexed player, string powerupType, uint256 amount)",
  "event DonationReceived(address indexed donor, uint256 amount, string message)"
];

// Contract addresses - update after deployment
export let NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "";
export let GAME_ACTIONS_ADDRESS = import.meta.env.VITE_GAME_ACTIONS_ADDRESS || "";

// Set contract addresses
export const setNFTContractAddress = (address: string) => {
  NFT_CONTRACT_ADDRESS = address;
  localStorage.setItem('arc_nft_contract', address);
};

export const setGameActionsAddress = (address: string) => {
  GAME_ACTIONS_ADDRESS = address;
  localStorage.setItem('arc_game_actions', address);
};

// Load addresses from localStorage
export const loadContractAddresses = () => {
  const savedNFT = localStorage.getItem('arc_nft_contract');
  const savedGameActions = localStorage.getItem('arc_game_actions');
  if (savedNFT) NFT_CONTRACT_ADDRESS = savedNFT;
  if (savedGameActions) GAME_ACTIONS_ADDRESS = savedGameActions;
};

// Initialize
loadContractAddresses();

// NFT metadata IPFS URI
const TOKEN_URI = 'ipfs://bafybeibp4angkcrdleql6delf6yq3w7e6nan6ozs6aueky4kesxsqbdb7a';

// Generate UUID for validation
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate validation string (timestamp__uuid format)
function generateValidationString(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const uuid = generateUUID();
  return `${timestamp}__${uuid}`;
}

// Get explorer URL for transaction
export const getExplorerUrl = (txHash: string): string => {
  return `${ARC_CONFIG.explorer}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (address: string): string => {
  return `${ARC_CONFIG.explorer}/address/${address}`;
};

// Ensure connected to Arc Testnet
async function ensureArcNetwork(ethereumProvider: any, onStatusUpdate?: (status: string) => void) {
  const provider = new ethers.BrowserProvider(ethereumProvider);
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== ARC_CONFIG.chainId) {
    onStatusUpdate?.("Switching to Arc Testnet...");
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
      } else {
        throw switchError;
      }
    }
  }

  return new ethers.BrowserProvider(ethereumProvider);
}

// Mint trophy NFT
export const mintTrophyNFT = async (
  wallet: any,
  score: number,
  kills: number = 0,
  onStatusUpdate?: (status: string) => void
): Promise<string> => {
  try {
    if (!NFT_CONTRACT_ADDRESS) {
      throw new Error('NFT contract address not configured');
    }

    onStatusUpdate?.("Connecting to Arc Testnet...");

    const ethereumProvider = await wallet.getEthereumProvider();
    const provider = await ensureArcNetwork(ethereumProvider, onStatusUpdate);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    onStatusUpdate?.("Preparing trophy mint...");

    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
    const validationString = generateValidationString();

    // Estimate gas
    let gasLimit = 500_000n;
    try {
      const estimated = await contract.mintTrophy.estimateGas(
        validationString,
        TOKEN_URI,
        score
      );
      gasLimit = estimated * 130n / 100n; // 30% buffer
    } catch (e) {
      console.warn('Gas estimation failed, using default limit');
    }

    onStatusUpdate?.("Minting trophy NFT...");

    const tx = await contract.mintTrophy(
      validationString,
      TOKEN_URI,
      score,
      { gasLimit }
    );

    onStatusUpdate?.("Waiting for confirmation...");
    const receipt = await tx.wait();

    onStatusUpdate?.("Trophy minted!");
    return receipt.hash || tx.hash;

  } catch (error: any) {
    console.error("Mint error:", error);

    if (error.message?.includes('Score too low')) {
      throw new Error('Score too low to mint trophy (minimum 5 required)');
    }
    if (error.message?.includes('Validation expired')) {
      throw new Error('Transaction took too long, please try again');
    }
    if (error.message?.includes('UUID already used')) {
      throw new Error('Please try again');
    }
    if (error.message?.includes('user rejected')) {
      throw new Error('Transaction rejected by user');
    }

    throw new Error(error.message || "Failed to mint trophy");
  }
};

// Buy powerup
export const buyPowerup = async (
  wallet: any,
  powerupType: 'shield' | 'speed' | 'double',
  quantity: number = 1,
  onStatusUpdate?: (status: string) => void
): Promise<string> => {
  try {
    const contractAddr = GAME_ACTIONS_ADDRESS || import.meta.env.VITE_GAME_ACTIONS_ADDRESS;
    if (!contractAddr) {
      throw new Error('Game Actions contract not configured');
    }

    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    onStatusUpdate?.("Connecting to Arc Testnet...");

    const ethereumProvider = await wallet.getEthereumProvider();
    const provider = await ensureArcNetwork(ethereumProvider, onStatusUpdate);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddr, GAME_ACTIONS_ABI, signer);

    onStatusUpdate?.("Getting prices...");
    const [shieldPrice, speedPrice, doublePrice] = await contract.getPrices();

    let price: bigint;
    let methodName: string;
    let displayName: string;

    switch (powerupType) {
      case 'shield':
        price = shieldPrice;
        methodName = 'buyShield';
        displayName = 'Shield';
        break;
      case 'speed':
        price = speedPrice;
        methodName = 'buySpeedBoost';
        displayName = 'Speed Boost';
        break;
      case 'double':
        price = doublePrice;
        methodName = 'buyDoubleDamage';
        displayName = 'Double Damage';
        break;
    }

    const totalCost = price * BigInt(quantity);
    onStatusUpdate?.(`Confirm ${displayName} for ${ethers.formatEther(totalCost)} USDC...`);

    const tx = await contract[methodName](quantity, { value: totalCost });

    onStatusUpdate?.("Waiting for confirmation...");
    await tx.wait();

    onStatusUpdate?.("Powerup purchased!");
    return tx.hash;

  } catch (error: any) {
    console.error("Powerup purchase error:", error);

    if (error.message?.includes('Insufficient payment') || error.message?.includes('insufficient funds')) {
      throw new Error('Insufficient USDC balance');
    }
    if (error.message?.includes('user rejected') || error.message?.includes('User rejected')) {
      throw new Error('Transaction rejected');
    }
    if (error.message?.includes('ACTION_REJECTED')) {
      throw new Error('Transaction rejected');
    }

    throw new Error(error.message || "Failed to purchase powerup");
  }
};

// Send donation
export const sendDonation = async (
  wallet: any,
  amount: string,
  message: string = '',
  onStatusUpdate?: (status: string) => void
): Promise<string> => {
  try {
    if (!GAME_ACTIONS_ADDRESS) {
      throw new Error('Game Actions contract not configured');
    }

    onStatusUpdate?.("Connecting to Arc Testnet...");

    const ethereumProvider = await wallet.getEthereumProvider();
    const provider = await ensureArcNetwork(ethereumProvider, onStatusUpdate);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(GAME_ACTIONS_ADDRESS, GAME_ACTIONS_ABI, signer);

    onStatusUpdate?.("Sending donation...");
    const value = ethers.parseEther(amount);
    const tx = await contract.donate(message, { value });

    onStatusUpdate?.("Waiting for confirmation...");
    await tx.wait();

    onStatusUpdate?.("Thank you for your donation!");
    return tx.hash;

  } catch (error: any) {
    console.error("Donation error:", error);
    throw new Error(error.message || "Failed to send donation");
  }
};

// Get player powerups
export const getPlayerPowerups = async (playerAddress: string): Promise<{
  shields: number;
  speedBoosts: number;
  doubles: number;
  spent: string;
}> => {
  const contractAddr = GAME_ACTIONS_ADDRESS || import.meta.env.VITE_GAME_ACTIONS_ADDRESS;

  if (!contractAddr) {
    console.log("getPlayerPowerups: No contract address configured");
    return { shields: 0, speedBoosts: 0, doubles: 0, spent: '0' };
  }

  try {
    console.log("getPlayerPowerups: Fetching for", playerAddress, "from contract", contractAddr);
    const provider = new ethers.JsonRpcProvider(ARC_CONFIG.rpc);
    const contract = new ethers.Contract(contractAddr, GAME_ACTIONS_ABI, provider);

    const [shields, speedBoosts, doubles, spent] = await contract.getPlayerPowerups(playerAddress);
    console.log("getPlayerPowerups result:", { shields: shields.toString(), speedBoosts: speedBoosts.toString(), doubles: doubles.toString() });

    return {
      shields: Number(shields),
      speedBoosts: Number(speedBoosts),
      doubles: Number(doubles),
      spent: ethers.formatEther(spent)
    };
  } catch (error) {
    console.error("Failed to get powerups:", error);
    return { shields: 0, speedBoosts: 0, doubles: 0, spent: '0' };
  }
};

// Get NFT score
export const getNFTScore = async (tokenId: number): Promise<number | null> => {
  if (!NFT_CONTRACT_ADDRESS) {
    return null;
  }

  try {
    const provider = new ethers.JsonRpcProvider(ARC_CONFIG.rpc);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);

    const score = await contract.getScore(tokenId);
    return Number(score);
  } catch (error) {
    console.error("Failed to get NFT score:", error);
    return null;
  }
};

// Get total supply
export const getTotalSupply = async (): Promise<number> => {
  if (!NFT_CONTRACT_ADDRESS) {
    return 0;
  }

  try {
    const provider = new ethers.JsonRpcProvider(ARC_CONFIG.rpc);
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);

    const supply = await contract.totalSupply();
    return Number(supply);
  } catch (error) {
    console.error("Failed to get total supply:", error);
    return 0;
  }
};

// Record game completion (cheaper alternative to minting)
export const recordGameCompletion = async (
  wallet: any,
  score: number,
  kills: number,
  onStatusUpdate?: (status: string) => void
): Promise<string> => {
  try {
    onStatusUpdate?.("Connecting to Arc Testnet...");

    const ethereumProvider = await wallet.getEthereumProvider();
    const provider = await ensureArcNetwork(ethereumProvider, onStatusUpdate);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    onStatusUpdate?.("Recording game completion...");

    // Send a simple transaction with game data
    const gameData = `ARC_GAME:${score}:${kills}:${Date.now()}`;
    const tx = await signer.sendTransaction({
      to: userAddress,
      value: 0n,
      data: ethers.toUtf8Bytes(gameData)
    });

    onStatusUpdate?.("Waiting for confirmation...");
    await tx.wait();

    return tx.hash;

  } catch (error: any) {
    console.error("Record error:", error);
    throw new Error(error.message || "Failed to record game");
  }
};

import { Enemy } from "./classes/Enemy.ts";
import { Weapon } from "./classes/Weapon.ts";
import { CONFIG } from "./config.ts";
import { getImageFromCache } from "./imageCache.ts";

// Enemy types - stablecoins
export const ENEMY_TYPES = {
  DAI: "dai",           // DAI stablecoin
  PYUSD: "pyusd",       // PayPal USD
  USDE: "usde",         // Ethena USDe
  USDT: "usdt",         // Tether USDT
  TERRA_LUNA: "terraLuna"  // Terra Luna UST - the boss
};

const ENEMY_COLORS = {
  [ENEMY_TYPES.DAI]: "#FFFF00",        // Yellow for DAI
  [ENEMY_TYPES.PYUSD]: "#0000FF",      // Blue for PYUSD
  [ENEMY_TYPES.USDE]: "#000000",       // Black for USDe
  [ENEMY_TYPES.USDT]: "#00FF00",       // Green for USDT
  [ENEMY_TYPES.TERRA_LUNA]: "#DAA520"  // Dark golden yellow for Terra/Luna
};

// Image paths for enemies
const ENEMY_IMAGES = {
  [ENEMY_TYPES.DAI]: "/chars/enemies/dai-weapon.png",
  [ENEMY_TYPES.PYUSD]: "/chars/enemies/pyusd-weapon.png",
  [ENEMY_TYPES.USDE]: "/chars/enemies/usde-weapon.png",
  [ENEMY_TYPES.USDT]: "/chars/enemies/usdt-weapon.png",
  [ENEMY_TYPES.TERRA_LUNA]: "/chars/enemies/luna-weapon.png"
};

export default function createEnemy(
  enemiesRef: Enemy[],
  difficulty: number,
  firstPlayer: boolean,
  type: string,
  frameMultiplier: number,
  imageCache?: any
): Enemy[] {
  if (enemiesRef.length >= CONFIG.MAX_ENEMIES) {
    return enemiesRef;
  }

  const padding = 100;
  const randomX = padding + Math.random() * (CONFIG.CANVAS_WIDTH - padding * 2);
  const randomY = padding + Math.random() * (CONFIG.CANVAS_HEIGHT - padding * 2);

  let difficultyMultiplier = Math.min(1 + difficulty * 0.1, 2.5);

  // Determine enemy type
  let enemyType: string;
  if (type === "fire" || type === ENEMY_TYPES.TERRA_LUNA) {
    enemyType = ENEMY_TYPES.TERRA_LUNA; // Boss
  } else {
    // Random between DAI, PYUSD, USDE, USDT
    const randomTypes = [ENEMY_TYPES.DAI, ENEMY_TYPES.PYUSD, ENEMY_TYPES.USDE, ENEMY_TYPES.USDT];
    enemyType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
  }

  // Stats based on enemy type
  let bulletSpeed: number;
  let fireRate: number;
  let moveSpeed: number;
  let health: number;

  switch (enemyType) {
    case ENEMY_TYPES.TERRA_LUNA:
      // Boss - Terra Luna: very tough, fast, aggressive
      bulletSpeed = 2.5 * frameMultiplier;
      fireRate = 600;
      moveSpeed = 4 * frameMultiplier;
      health = 8;
      break;
    case ENEMY_TYPES.DAI:
      // DAI: balanced stablecoin enemy
      const baseDaiSpeed = (1.0 + Math.random() * 0.8) * frameMultiplier;
      bulletSpeed = Math.min(baseDaiSpeed * difficultyMultiplier, 3.5);
      fireRate = Math.max(2200 / difficultyMultiplier, 900);
      moveSpeed = (0.4 + Math.random() * 0.3) * frameMultiplier * difficultyMultiplier;
      health = 2;
      break;
    case ENEMY_TYPES.PYUSD:
      // PYUSD: faster bullets, lower health
      const basePyusdSpeed = (1.3 + Math.random() * 0.7) * frameMultiplier;
      bulletSpeed = Math.min(basePyusdSpeed * difficultyMultiplier, 3.8);
      fireRate = Math.max(2000 / difficultyMultiplier, 800);
      moveSpeed = (0.5 + Math.random() * 0.4) * frameMultiplier * difficultyMultiplier;
      health = 1;
      break;
    case ENEMY_TYPES.USDE:
      // USDe: tanky but slow
      const baseUsdeSpeed = (0.8 + Math.random() * 0.6) * frameMultiplier;
      bulletSpeed = Math.min(baseUsdeSpeed * difficultyMultiplier, 3.0);
      fireRate = Math.max(2500 / difficultyMultiplier, 1100);
      moveSpeed = (0.3 + Math.random() * 0.3) * frameMultiplier * difficultyMultiplier;
      health = 3;
      break;
    case ENEMY_TYPES.USDT:
    default:
      // USDT: erratic movement, medium stats
      const baseUsdtSpeed = (1.2 + Math.random() * 0.6) * frameMultiplier;
      bulletSpeed = Math.min(baseUsdtSpeed * difficultyMultiplier, 3);
      fireRate = Math.max(2800 / difficultyMultiplier, 1000);
      moveSpeed = (0.5 + Math.random() * 0.5) * frameMultiplier * difficultyMultiplier;
      health = 2;
      break;
  }

  // Get enemy image
  const imageSrc = ENEMY_IMAGES[enemyType] || ENEMY_IMAGES[ENEMY_TYPES.DAI];
  let characterImage = getImageFromCache(imageSrc);
  if (!characterImage) {
    const img = new Image();
    img.src = imageSrc;
    characterImage = img;
  }

  const bulletColor = ENEMY_COLORS[enemyType] || "#FF0000";
  const weaponImage = imageCache?.weapons?.[0];

  const spawnTime = firstPlayer ? Date.now() + 3000 : Date.now();

  const enemy = new Enemy(
    randomX,
    randomY,
    bulletSpeed,
    fireRate,
    moveSpeed,
    bulletColor,
    spawnTime,
    enemyType,
    characterImage
  );

  // Set health based on enemy type
  enemy.health = health;
  enemy.maxHealth = health;

  if (enemyType !== ENEMY_TYPES.TERRA_LUNA) {
    enemy.width = enemy.width * 1.25;
    enemy.height = enemy.height;
  }

  // Assign weapon
  const weaponDamage = enemyType === ENEMY_TYPES.TERRA_LUNA ? 3 : 1;
  const weaponBulletSize = enemyType === ENEMY_TYPES.TERRA_LUNA ? 18 : 8;
  enemy.weapon = new Weapon(fireRate, weaponBulletSize, weaponDamage, bulletColor, weaponImage);

  enemiesRef.push(enemy);
  return enemiesRef;
}

// Create boss specifically
export function createBoss(
  enemiesRef: Enemy[],
  frameMultiplier: number
): Enemy[] {
  return createEnemy(enemiesRef, 10, false, ENEMY_TYPES.TERRA_LUNA, frameMultiplier, {});
}
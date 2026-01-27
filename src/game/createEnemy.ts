import { Enemy } from "./classes/Enemy.ts";
import { Weapon } from "./classes/Weapon.ts";
import { CONFIG } from "./config.ts";
import { getImageFromCache } from "./imageCache.ts";

// Enemy types based on crypto scam/failure projects
export const ENEMY_TYPES = {
  IRON: "iron",           // Iron Finance / TITAN collapse
  BASIC_CASH: "basicCash", // Basic Cash algorithmic stablecoin failure
  TERRA_LUNA: "terraLuna"  // Terra Luna UST - the boss
};

const ENEMY_COLORS = {
  [ENEMY_TYPES.IRON]: "#FFD700",       // Gold for Iron
  [ENEMY_TYPES.BASIC_CASH]: "#8A2BE2", // Violet for Basic Cash
  [ENEMY_TYPES.TERRA_LUNA]: "#DAA520"  // Dark golden yellow for Terra/Luna (better contrast)
};

// Image paths for enemies
const ENEMY_IMAGES = {
  [ENEMY_TYPES.IRON]: "/chars/enemies/iron-enemy.png",
  [ENEMY_TYPES.BASIC_CASH]: "/chars/enemies/basis-enemy.png",
  [ENEMY_TYPES.TERRA_LUNA]: "/chars/enemies/luna-enemy.png"
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
    // Random between IRON and BASIC_CASH
    enemyType = Math.random() < 0.5 ? ENEMY_TYPES.IRON : ENEMY_TYPES.BASIC_CASH;
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
    case ENEMY_TYPES.IRON:
      // Iron Finance: medium speed, rust-colored bullets
      const baseIronSpeed = (1.0 + Math.random() * 0.8) * frameMultiplier;
      bulletSpeed = Math.min(baseIronSpeed * difficultyMultiplier, 3.5);
      fireRate = Math.max(2200 / difficultyMultiplier, 900);
      moveSpeed = (0.4 + Math.random() * 0.3) * frameMultiplier * difficultyMultiplier;
      health = 2;
      break;
    case ENEMY_TYPES.BASIC_CASH:
    default:
      // Basic Cash: erratic movement, lower damage
      const baseBasicSpeed = (1.2 + Math.random() * 0.6) * frameMultiplier;
      bulletSpeed = Math.min(baseBasicSpeed * difficultyMultiplier, 3);
      fireRate = Math.max(2800 / difficultyMultiplier, 1000);
      moveSpeed = (0.5 + Math.random() * 0.5) * frameMultiplier * difficultyMultiplier;
      health = 1;
      break;
  }

  // Get enemy image
  const imageSrc = ENEMY_IMAGES[enemyType] || ENEMY_IMAGES[ENEMY_TYPES.BASIC_CASH];
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

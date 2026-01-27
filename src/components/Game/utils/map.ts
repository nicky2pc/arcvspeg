import { CONFIG } from '../../../game/config';

export const drawMap = (ctx: CanvasRenderingContext2D) => {
  // Arc theme - darker cyan walls on light background
  ctx.fillStyle = '#0099CC';
  for (let y = 0; y < CONFIG.MAP.length; y++) {
    for (let x = 0; x < CONFIG.MAP[y].length; x++) {
      if (CONFIG.MAP[y][x] === 1) {
        ctx.fillRect(
          x * CONFIG.CELL_SIZE,
          y * CONFIG.CELL_SIZE,
          CONFIG.CELL_SIZE - 1,
          CONFIG.CELL_SIZE - 1
        );
      }
    }
  }
};



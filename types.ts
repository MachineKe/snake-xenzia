
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Coords {
  x: number;
  y: number;
}

export type GameState = 'IDLE' | 'RUNNING' | 'GAME_OVER';

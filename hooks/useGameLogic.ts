
import { useState, useEffect, useCallback } from 'react';
import { Direction, Coords, GameState } from '../types.ts';
import { GRID_SIZE, TICK_RATE, HIGH_SCORE_KEY } from '../constants.ts';
import useInterval from './useInterval.ts';

const getRandomCoords = (snake: Coords[] = []): Coords => {
  let newFood: Coords;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

const useGameLogic = () => {
  const getInitialHighScore = (): number => {
    try {
      const storedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
      return storedHighScore ? parseInt(storedHighScore, 10) : 0;
    } catch (error) {
      console.error("Could not read high score from localStorage", error);
      return 0;
    }
  };

  const initialSnake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
  
  const [snake, setSnake] = useState<Coords[]>(initialSnake);
  const [food, setFood] = useState<Coords>(() => getRandomCoords(initialSnake));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [pendingDirection, setPendingDirection] = useState<Direction | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getInitialHighScore);
  const [gameState, setGameState] = useState<GameState>('IDLE');

  const startGame = () => {
    setSnake(initialSnake);
    setFood(getRandomCoords(initialSnake));
    setDirection('RIGHT');
    setPendingDirection(null);
    setScore(0);
    setGameState('RUNNING');
  };

  const changeDirection = useCallback((newDirection: Direction) => {
    if (gameState !== 'RUNNING') return;
    
    const isOpposite = (dir1: Direction, dir2: Direction) => {
        return (dir1 === 'UP' && dir2 === 'DOWN') ||
               (dir1 === 'DOWN' && dir2 === 'UP') ||
               (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
               (dir1 === 'RIGHT' && dir2 === 'LEFT');
    };

    if (!isOpposite(direction, newDirection)) {
        setPendingDirection(newDirection);
    }
  }, [direction, gameState]);

  const tick = () => {
    if (gameState !== 'RUNNING') return;

    let currentDirection = direction;
    if (pendingDirection) {
        setDirection(pendingDirection);
        currentDirection = pendingDirection;
        setPendingDirection(null);
    }

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (currentDirection) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameState('GAME_OVER');
      return;
    }

    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        setGameState('GAME_OVER');
        return;
      }
    }

    newSnake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 10);
      setFood(getRandomCoords(newSnake));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useInterval(tick, gameState === 'RUNNING' ? TICK_RATE : null);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      } catch (error) {
        console.error("Could not save high score to localStorage", error);
      }
    }
  }, [score, highScore]);

  return { gameState, snake, food, score, highScore, startGame, changeDirection };
};

export default useGameLogic;


import React from 'react';
import { motion } from 'framer-motion';
import { GRID_SIZE } from '../constants.ts';
import { Coords } from '../types.ts';

interface GameBoardProps {
  snake: Coords[];
  food: Coords;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food }) => {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  return (
    <div
      className="aspect-square w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg grid"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
    >
      {cells.map((_, index) => {
        const x = index % GRID_SIZE;
        const y = Math.floor(index / GRID_SIZE);
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={index}
            className={`aspect-square w-full h-full flex items-center justify-center ${
              (x + y) % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/30'
            }`}
          >
            {isSnake && (
              <motion.div
                layout
                className={`w-full h-full ${isSnakeHead ? 'bg-green-400' : 'bg-green-500'} rounded-sm`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
              />
            )}
            {isFood && (
              <motion.div
                className="w-3/4 h-3/4 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;

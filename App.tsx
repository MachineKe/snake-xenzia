
import React, { useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import GameBoard from './components/GameBoard.tsx';
import Controls from './components/Controls.tsx';
import Scoreboard from './components/Scoreboard.tsx';
import GameOverModal from './components/GameOverModal.tsx';
import useGameLogic from './hooks/useGameLogic.ts';
import { Direction } from './types.ts';

const App: React.FC = () => {
  const {
    gameState,
    snake,
    food,
    score,
    highScore,
    startGame,
    changeDirection,
  } = useGameLogic();

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let newDirection: Direction | null = null;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        newDirection = 'UP';
        break;
      case 'ArrowDown':
      case 's':
        newDirection = 'DOWN';
        break;
      case 'ArrowLeft':
      case 'a':
        newDirection = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
        newDirection = 'RIGHT';
        break;
    }
    if (newDirection) {
      e.preventDefault();
      changeDirection(newDirection);
    }
  }, [changeDirection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const firstTouch = e.touches[0];
    if (firstTouch) {
      touchStartRef.current = { x: firstTouch.clientX, y: firstTouch.clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) {
      return;
    }

    const touch = e.touches[0];
    if (!touch) {
        return;
    }

    const touchStartX = touchStartRef.current.x;
    const touchStartY = touchStartRef.current.y;
    const touchMoveX = touch.clientX;
    const touchMoveY = touch.clientY;

    const diffX = touchStartX - touchMoveX;
    const diffY = touchStartY - touchMoveY;

    const swipeThreshold = 20; // Lowered for more sensitivity

    let newDirection: Direction | null = null;

    // Check if the swipe distance is significant enough
    if (Math.abs(diffX) > swipeThreshold || Math.abs(diffY) > swipeThreshold) {
        // Determine direction
        if (Math.abs(diffX) > Math.abs(diffY)) {
            newDirection = diffX > 0 ? 'LEFT' : 'RIGHT';
        } else {
            newDirection = diffY > 0 ? 'UP' : 'DOWN';
        }

        if (newDirection) {
            changeDirection(newDirection);
            // Reset the start position to the current position.
            // This allows for a new swipe gesture (e.g., right then up) without lifting the finger.
            touchStartRef.current = { x: touchMoveX, y: touchMoveY };
        }
    }
  }, [changeDirection]);

  const handleTouchEnd = useCallback(() => {
    // Reset the touch start reference when the finger is lifted
    touchStartRef.current = null;
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div 
        className="w-full max-w-sm h-[85vh] max-h-[800px] bg-black rounded-[40px] border-8 border-gray-700 shadow-2xl shadow-indigo-500/20 flex flex-col overflow-hidden relative p-4 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="game-container"
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl border-x-2 border-b-2 border-gray-700"></div>
        
        <Scoreboard score={score} highScore={highScore} />

        <div className="flex-grow flex items-center justify-center p-2">
          <GameBoard snake={snake} food={food} />
        </div>

        <Controls onDirectionChange={changeDirection} />

        <AnimatePresence>
          {gameState === 'GAME_OVER' && (
            <GameOverModal score={score} onRestart={startGame} />
          )}
        </AnimatePresence>
         <AnimatePresence>
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                <h1 className="text-5xl font-vt323 text-green-400 mb-4">SNAKE XENZIA</h1>
                <button
                    onClick={startGame}
                    className="bg-green-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                >
                    Start Game
                </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default App;

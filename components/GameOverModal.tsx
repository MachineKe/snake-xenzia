
import React from 'react';
import { motion } from 'framer-motion';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart }) => {
  return (
    <motion.div
      className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-800 p-8 rounded-2xl shadow-lg text-center border-2 border-gray-700"
        initial={{ scale: 0.7, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <h2 className="text-5xl font-vt323 text-red-500 mb-2">GAME OVER</h2>
        <p className="text-gray-300 text-lg mb-4">Your Score</p>
        <p className="text-6xl font-vt323 text-green-400 mb-8">{score}</p>
        <button
          onClick={onRestart}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-indigo-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GameOverModal;

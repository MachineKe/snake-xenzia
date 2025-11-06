
import React from 'react';

interface ScoreboardProps {
  score: number;
  highScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between items-center px-4 pt-8 pb-2 text-green-400 font-vt323">
      <div className="text-center">
        <span className="text-xl block text-gray-400">SCORE</span>
        <span className="text-4xl">{score.toString().padStart(4, '0')}</span>
      </div>
      <div className="text-center">
        <span className="text-xl block text-gray-400">HIGH SCORE</span>
        <span className="text-4xl">{highScore.toString().padStart(4, '0')}</span>
      </div>
    </div>
  );
};

export default Scoreboard;


import React from 'react';
import { Direction } from '../types.ts';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

const ArrowIcon: React.FC<{ rotation: string }> = ({ rotation }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={{ transform: rotation }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

const ControlButton: React.FC<{
  onClick: () => void;
  ariaLabel: string;
  gridArea: string;
  children: React.ReactNode;
}> = ({ onClick, ariaLabel, gridArea, children }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 active:bg-indigo-500 active:text-white transition-colors"
    style={{ gridArea }}
  >
    {children}
  </button>
);

const Controls: React.FC<ControlsProps> = ({ onDirectionChange }) => {
  return (
    <div className="w-full flex justify-center items-center p-4">
      <div
        className="grid gap-2 w-48 h-48"
        style={{
          gridTemplateAreas: `
            ". up ."
            "left . right"
            ". down ."
          `,
          gridTemplateRows: '1fr 1fr 1fr',
          gridTemplateColumns: '1fr 1fr 1fr',
        }}
      >
        <ControlButton
          onClick={() => onDirectionChange('UP')}
          ariaLabel="Move up"
          gridArea="up"
        >
          <ArrowIcon rotation="rotate(0deg)" />
        </ControlButton>
        <ControlButton
          onClick={() => onDirectionChange('LEFT')}
          ariaLabel="Move left"
          gridArea="left"
        >
          <ArrowIcon rotation="rotate(-90deg)" />
        </ControlButton>
        <ControlButton
          onClick={() => onDirectionChange('RIGHT')}
          ariaLabel="Move right"
          gridArea="right"
        >
          <ArrowIcon rotation="rotate(90deg)" />
        </ControlButton>
        <ControlButton
          onClick={() => onDirectionChange('DOWN')}
          ariaLabel="Move down"
          gridArea="down"
        >
          <ArrowIcon rotation="rotate(180deg)" />
        </ControlButton>
      </div>
    </div>
  );
};

export default Controls;

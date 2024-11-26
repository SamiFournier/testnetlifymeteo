import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
      <div className="text-white text-center">
        <p className="text-xl">{message}</p>
        <button 
          onClick={onRetry} 
          className="mt-4 px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
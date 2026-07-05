import React from 'react';

interface GameHeaderProps {
  score: number;
  streak: number;
  highScore: number;
  onBack: () => void;
  onShowLeaderboard: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, streak, highScore, onBack, onShowLeaderboard 
}) => {
  return (
    <>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#F5F5F5',
        color: 'black'
      }}>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onBack(); }}
          style={{ 
            color: 'black', 
            textDecoration: 'none', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            fontFamily: "'Inria Sans', sans-serif"
          }}
        >
          &lt; Volver a inicio
        </a>
      </div>

      {/* Score Banner (Indicators) */}
      <div style={{
        backgroundColor: 'rgb(0, 0, 0)',
        color: 'white',
        padding: '10px',
        fontSize: '14px',
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '15px', 
        alignItems: 'center',
        fontFamily: "'Inria Sans', sans-serif"
      }}>
        <span>Racha: <span style={{ color: '#58FFC2' }}>{streak}</span></span>
        <span>Score: <span style={{ color: '#FFDD01' }}>{score}</span></span>
        <span>Récord: <span style={{ color: '#FF2977' }}>{highScore}</span></span>
        <button 
          onClick={onShowLeaderboard}
          style={{ 
            fontFamily: "'Inria Sans', sans-serif",
            fontSize: '14px', 
            textAlign: 'center',
            border: '2px solid #000000',
            borderRadius: '10px',
            padding: '5px 15px', 
            margin: '0', 
            cursor: 'pointer',
            boxShadow: '2px 2px 0 #000',
            display: 'inline-block',
            backgroundColor: '#ffffff',
            color: 'black'
          }}
        >
          🏆 Top 10
        </button>
      </div>
    </>
  );
};

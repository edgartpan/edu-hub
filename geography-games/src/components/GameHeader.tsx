import React from 'react';
import { Button } from './Button';

interface GameHeaderProps {
  title: string;
  score: number;
  onBack: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ title, score, onBack }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <Button variant="light" onClick={onBack}>← Volver</Button>
        <div className="neobrutal-card" style={{ padding: '5px 15px', borderRadius: '10px' }}>
          <strong>Puntos:</strong> {score}
        </div>
      </div>
      <h2 style={{ textAlign: 'center', margin: 0 }}>{title}</h2>
    </div>
  );
};

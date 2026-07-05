import React, { useEffect, useState } from 'react';
import { getTopScores } from '../services/firebase';
import type { ScoreData } from '../services/firebase';

interface LeaderboardModalProps {
  gameId: string;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ gameId, onClose }) => {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const data = await getTopScores(gameId);
      setScores(data);
      setLoading(false);
    };
    fetchScores();
  }, [gameId]);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 100
    }}>
      <div style={{ 
        position: 'fixed',
        top: '10%', left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#F5F5F5',
        padding: '30px 20px',
        width: '90%',
        maxWidth: '320px',
        maxHeight: '80vh',
        zIndex: 101,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '15px',
        color: '#333',
        fontFamily: "'Inria Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#333',
            padding: 0
          }}
        >
          &#x2715;
        </button>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '22px', marginBottom: '20px' }}>
          Mejores Puntuaciones
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1, textAlign: 'left' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
          ) : scores.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>No hay puntuaciones aún.</div>
          ) : (
            <div>
              {scores.map((s, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: idx === scores.length - 1 ? 'none' : '1px solid #ddd',
                  padding: '12px 0',
                  fontSize: '16px',
                  alignItems: 'center'
                }}>
                  <div style={{ fontWeight: 'bold', width: '25px', color: '#6358FF' }}>#{idx + 1}</div>
                  <div style={{ flexGrow: 1, textAlign: 'left', paddingLeft: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{s.name}</div>
                  <div style={{ fontWeight: 'bold', color: '#FF2977' }}>{s.score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

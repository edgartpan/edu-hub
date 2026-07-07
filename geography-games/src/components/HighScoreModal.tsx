import React, { useState } from 'react';

interface HighScoreModalProps {
  onSubmit: (initials: string) => void;
  onCancel: () => void;
}

export const HighScoreModal: React.FC<HighScoreModalProps> = ({ onSubmit, onCancel }) => {
  const [initials, setInitials] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initials.trim().length > 0) {
      onSubmit(initials.trim());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 100
    }}>
      <div style={{ 
        position: 'fixed',
        top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#F5F5F5',
        padding: '30px',
        width: '90%',
        maxWidth: '320px',
        zIndex: 101,
        textAlign: 'center',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '15px',
        color: '#333',
        fontFamily: "'Inria Sans', sans-serif"
      }}>
        <button 
          onClick={onCancel}
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
          ¡Nuevo Récord!
        </div>
        <div style={{ fontSize: '16px', marginBottom: '10px' }}>
          Ingresa tu nombre:
        </div>
        <form onSubmit={handleSubmit}>
          <input 
            className="name-input"
            type="text" 
            maxLength={15} 
            autoComplete="off" 
            spellCheck="false"
            autoCorrect="off"
            autoCapitalize="none"
            placeholder="Tu nombre..."
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
            style={{
              fontSize: '20px',
              width: '100%',
              boxSizing: 'border-box',
              textAlign: 'center',
              border: '2px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              margin: '20px 0',
              fontFamily: "'Inria Sans', sans-serif",
              outline: 'none',
              textTransform: 'capitalize'
            }}
            autoFocus
          />
          <button 
            type="submit"
            disabled={initials.trim().length === 0}
            style={{
              width: 'auto', 
              padding: '10px 40px', 
              marginTop: '10px',
              position: 'relative',
              fontFamily: "'Inria Sans', sans-serif",
              fontSize: '23px',
              textAlign: 'center',
              border: '2px solid #000000',
              borderRadius: '10px',
              cursor: initials.trim().length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '5px 5px 0px #000000',
              backgroundColor: '#ffffff',
              color: 'black'
            }}
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

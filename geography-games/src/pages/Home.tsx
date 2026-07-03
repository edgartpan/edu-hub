import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface HomeProps {
  onSelectGame: (gameId: 'capitals' | 'flags' | 'continents' | 'mapLocation') => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectGame }) => {
  return (
    <div style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', width: '100%' }}>
      <div className="hub-container">
        <a href="../../index.html" className="return-edu-btn">
          ← Volver al Edu Hub
        </a>
        <header className="neobrutal-card" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          Geography <span style={{ color: 'var(--primary)' }}>Hub</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Aprende y pon a prueba tus conocimientos sobre países, capitales y banderas.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        <Card>
          <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Países y Capitales</h2>
            <p style={{ marginBottom: '25px', color: 'var(--text-muted)', flex: 1 }}>
              ¿Cuál es la capital de este país? O ¿A qué país pertenece esta capital?
            </p>
            <Button variant="primary" onClick={() => onSelectGame('capitals')} style={{ width: '100%', marginTop: 'auto' }}>
              Jugar Capitales
            </Button>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Identificar Banderas</h2>
            <p style={{ marginBottom: '25px', color: 'var(--text-muted)', flex: 1 }}>
              Observa la bandera y selecciona el país correcto de la lista de opciones.
            </p>
            <Button variant="secondary" onClick={() => onSelectGame('flags')} style={{ width: '100%', marginTop: 'auto' }}>
              Jugar Banderas
            </Button>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Identifica continente</h2>
            <p style={{ marginBottom: '25px', color: 'var(--text-muted)', flex: 1 }}>
              Te mostraremos un país o su bandera y debes seleccionar a qué continente pertenece.
            </p>
            <Button variant="accent" onClick={() => onSelectGame('continents')} style={{ width: '100%', backgroundColor: 'var(--lvl-1-accent)', color: 'var(--text)', borderColor: 'var(--border)', marginTop: 'auto' }}>
              Jugar Continentes
            </Button>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Localizar en el Mapa</h2>
            <p style={{ marginBottom: '25px', color: 'var(--text-muted)', flex: 1 }}>
              Te diremos el nombre de un país y tendrás 3 intentos para encontrarlo y hacer clic sobre él en el mapa mundial.
            </p>
            <Button variant="accent" onClick={() => onSelectGame('mapLocation')} style={{ width: '100%', backgroundColor: 'var(--lvl-4-accent)', borderColor: 'var(--border)', marginTop: 'auto' }}>
              Jugar Mapa
            </Button>
          </div>
        </Card>

        </div>
      </div>
    </div>
  );
};

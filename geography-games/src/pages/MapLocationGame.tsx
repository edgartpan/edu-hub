import { useState, useEffect, useRef } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { GameHeader } from '../components/GameHeader';
import { Button } from '../components/Button';
import { countries, type Country, getFlagUrl } from '../data/countries';
import { useGameScoring } from '../hooks/useGameScoring';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { HighScoreModal } from '../components/HighScoreModal';
import isoMap from '../data/isoMap.json';
import regionMap from '../data/regionMap.json';

interface MapLocationGameProps {
  onBack: () => void;
}

const geoUrl = "./features.json";

const regionColors: Record<string, string> = {
  'Americas': '#fed7aa', // Naranja pastel
  'Europe': '#bbf7d0',   // Verde pastel
  'Asia': '#fbcfe8',     // Rosa pastel
  'Africa': '#fef08a',   // Amarillo pastel
  'Oceania': '#bfdbfe',  // Azul pastel
};

export const MapLocationGame: React.FC<MapLocationGameProps> = ({ onBack }) => {
  const { 
    score, streak, highScore, handleCorrect, handleIncorrect,
    showLeaderboard, setShowLeaderboard, showHighScoreModal,
    finishGame, submitHighScore, cancelHighScore
  } = useGameScoring("mapLocation");

  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [unaskedCountries, setUnaskedCountries] = useState<Country[]>([]);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  
  // Estado para el zoom (Inicia más cerca como se solicitó)
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1.5 });
  
  // Referencia para guardar la coordenada central del país objetivo
  const targetCentroidRef = useRef<[number, number] | null>(null);

  const resetGamePool = () => {
    // Only use countries that exist in the isoMap to ensure they can be clicked
    const validCountries = countries.filter(c => (isoMap as Record<string, string>)[c.flagCode]);
    const shuffled = [...validCountries].sort(() => Math.random() - 0.5);
    setUnaskedCountries(shuffled);
    return shuffled;
  };

  const generateQuestion = (pool?: Country[]) => {
    let currentPool = pool || unaskedCountries;
    if (currentPool.length === 0) {
      currentPool = resetGamePool();
    }

    const target = currentPool[0];
    const newPool = currentPool.slice(1);
    setUnaskedCountries(newPool);
    setCurrentCountry(target);
    setFeedback(null);
    setClickedId(null);
    setAttempts(0);
    targetCentroidRef.current = null;
    
    // Reiniciar zoom al cambiar de pregunta a una vista predeterminada más cercana
    setPosition({ coordinates: [0, 20], zoom: 1.5 });
  };

  useEffect(() => {
    const initialPool = resetGamePool();
    generateQuestion(initialPool);
  }, []);

  const handleGeographyClick = (geo: any) => {
    if (feedback === 'correct' || attempts >= 3) return; // Wait for next question
    if (!currentCountry) return;

    const clickedNumericId = geo.id; 
    const targetNumericId = (isoMap as Record<string, string>)[currentCountry.flagCode];
    
    const isMatch = Number(clickedNumericId) === Number(targetNumericId);

    if (isMatch) {
      setClickedId(geo.id);
      setFeedback('correct');
      handleCorrect(10);
      setTimeout(() => generateQuestion(), 2000);
    } else {
      setClickedId(geo.id);
      setFeedback('incorrect');
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        // Enviar la cámara al país objetivo
        if (targetCentroidRef.current) {
          setPosition({ coordinates: targetCentroidRef.current, zoom: 3 });
        }
        
        handleIncorrect(5); // Aplicar castigo solo cuando falla totalmente
        // Show the correct answer and move on
        setTimeout(() => generateQuestion(), 3500);
      } else {
        // Just briefly show incorrect flash, let them try again
        setTimeout(() => {
          if (attempts < 2) setFeedback(null);
        }, 1000);
      }
    }
  };

  const handleZoomIn = () => {
    if (position.zoom >= 8) return; // Permitir zoom mucho mayor
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <GameHeader 
        score={score} 
        streak={streak}
        highScore={highScore}
        onBack={() => finishGame(onBack)}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
      
      <div style={{ padding: '20px 15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {currentCountry && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: 0 }}>Encuentra en el mapa:</h3>
              <h1 style={{ fontSize: '2.2rem', margin: '5px 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
                <img 
                  src={getFlagUrl(currentCountry.flagCode)} 
                  alt="bandera" 
                  style={{ width: '45px', border: '2px solid var(--border)', borderRadius: '4px' }}
                />
                {currentCountry.name}
              </h1>
              <p style={{ margin: 0, fontWeight: 'bold', color: feedback === 'incorrect' ? 'red' : 'inherit' }}>
                Intentos: {attempts}/3
              </p>
            </div>
            
            <div style={{ 
              width: '100%', 
              maxWidth: '800px',
              height: '350px', 
              backgroundColor: '#a3d8f4', // Ocean blue
              borderRadius: '15px', 
              border: '4px solid var(--border)',
              overflow: 'hidden',
              boxShadow: '4px 4px 0px var(--shadow)',
              position: 'relative'
            }}>
              
              {/* Controles de Zoom */}
              <div style={{ position: 'absolute', right: '15px', bottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
                <Button variant="light" onClick={handleZoomIn} style={{ padding: '5px 15px', fontSize: '1.5rem', minWidth: '45px' }}>+</Button>
                <Button variant="light" onClick={handleZoomOut} style={{ padding: '5px 15px', fontSize: '1.5rem', minWidth: '45px' }}>-</Button>
              </div>

              <ComposableMap
                projectionConfig={{ scale: 140 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ZoomableGroup 
                  zoom={position.zoom} 
                  center={position.coordinates} 
                  onMoveEnd={handleMoveEnd}
                  maxZoom={10} // Más niveles de zoom
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const targetNumericId = currentCountry ? (isoMap as Record<string, string>)[currentCountry.flagCode] : null;
                        const isTarget = Number(geo.id) === Number(targetNumericId);
                        const isClicked = geo.id === clickedId;
                        
                        // Guardar el centroide del país objetivo silenciosamente
                        if (isTarget) {
                          targetCentroidRef.current = geoCentroid(geo);
                        }

                        // Determinar color base usando TODOS los países del mundo vía regionMap
                        const numericIdStr = Number(geo.id).toString().padStart(3, '0');
                        const region = (regionMap as Record<string, string>)[numericIdStr] || (regionMap as Record<string, string>)[Number(geo.id).toString()];
                        let fill = region ? regionColors[region] || '#e2e8f0' : '#e2e8f0';

                        if (isTarget && (feedback === 'correct' || attempts >= 3)) fill = "#4ade80"; // Green when found or revealed
                        else if (isClicked && feedback === 'incorrect') fill = "#f87171"; // Red flash when wrong

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => handleGeographyClick(geo)}
                            style={{
                              default: {
                                fill: fill,
                                stroke: "#111827",
                                strokeWidth: 0.5 / position.zoom, // Mantener los bordes finos al hacer zoom
                                outline: "none"
                              },
                              hover: {
                                fill: (isTarget && attempts >= 3) || feedback === 'correct' ? fill : "#fbbf24", // Yellow hover
                                stroke: "#111827",
                                strokeWidth: 1 / position.zoom,
                                outline: "none",
                                cursor: 'pointer'
                              },
                              pressed: {
                                fill: "#f59e0b",
                                outline: "none"
                              }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>

              {feedback === 'correct' && (
                <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--lvl-3-accent)', padding: '10px 20px', borderRadius: '10px', border: '3px solid var(--border)', fontWeight: 'bold', fontSize: '1.2rem', zIndex: 10 }}>
                  ¡Excelente! +10
                </div>
              )}
              {attempts >= 3 && feedback === 'incorrect' && (
                <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#f87171', padding: '10px 20px', borderRadius: '10px', border: '3px solid var(--border)', fontWeight: 'bold', fontSize: '1.2rem', color: 'white', zIndex: 10, textAlign: 'center', width: '80%' }}>
                  Agotaste tus intentos. ¡Estaba aquí!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

      {showLeaderboard && (
        <LeaderboardModal gameId="mapLocation" onClose={() => setShowLeaderboard(false)} />
      )}
      
      {showHighScoreModal && (
        <HighScoreModal 
          onSubmit={(initials) => {
            submitHighScore(initials);
            generateQuestion(resetGamePool());
          }} 
          onCancel={() => {
            cancelHighScore();
          }} 
        />
      )}
    </div>
  );
};

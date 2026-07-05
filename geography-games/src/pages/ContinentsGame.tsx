import { useState, useEffect } from 'react';
import { GameHeader } from '../components/GameHeader';
import { Button } from '../components/Button';
import { countries, type Country, getFlagUrl } from '../data/countries';
import { useGameScoring } from '../hooks/useGameScoring';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { HighScoreModal } from '../components/HighScoreModal';

interface ContinentsGameProps {
  onBack: () => void;
}

const CONTINENTS = [
  { id: 'Americas', label: 'América' },
  { id: 'Europe', label: 'Europa' },
  { id: 'Asia', label: 'Asia' },
  { id: 'Africa', label: 'África' },
  { id: 'Oceania', label: 'Oceanía' }
];

export const ContinentsGame: React.FC<ContinentsGameProps> = ({ onBack }) => {
  const { 
    score, streak, highScore, handleCorrect, handleIncorrect,
    showLeaderboard, setShowLeaderboard, showHighScoreModal,
    finishGame, submitHighScore, cancelHighScore
  } = useGameScoring("continents");

  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [showFlag, setShowFlag] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [unaskedCountries, setUnaskedCountries] = useState<Country[]>([]);

  const resetGamePool = () => {
    // Only use countries that have a valid continent from our list to avoid odd regions
    const validCountries = countries.filter(c => CONTINENTS.some(cont => cont.id === c.region));
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
    setShowFlag(Math.random() > 0.5);
    setFeedback(null);
  };

  useEffect(() => {
    const initialPool = resetGamePool();
    generateQuestion(initialPool);
  }, []);

  const handleAnswer = (selectedRegion: string) => {
    if (feedback !== null) return;

    if (currentCountry && selectedRegion === currentCountry.region) {
      setFeedback('correct');
      handleCorrect(10);
      setTimeout(generateQuestion, 1000);
    } else {
      setFeedback('incorrect');
      handleIncorrect(5);
      setTimeout(generateQuestion, 3000);
    }
  };

  return (
    <div className="app-container">
      <GameHeader 
        score={score} 
        streak={streak}
        highScore={highScore}
        onBack={() => finishGame(onBack)}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
      
      <div style={{ padding: '20px 15px' }}>
        <div className="glass-panel" style={{ padding: '20px', margin: '0 auto' }}>
          
          {currentCountry && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <div style={{ margin: '20px auto', display: 'flex', justifyContent: 'center', minHeight: '150px', alignItems: 'center' }}>
                {showFlag ? (
                  <img 
                    src={getFlagUrl(currentCountry.flagCode)} 
                    alt="Bandera" 
                    style={{ 
                      width: '180px', 
                      border: '4px solid var(--border)', 
                      borderRadius: '10px',
                      boxShadow: '6px 6px 0px var(--shadow)'
                    }} 
                  />
                ) : (
                  <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase', margin: 0, padding: '20px', backgroundColor: 'var(--bg)', borderRadius: '15px', border: '3px solid var(--border)', boxShadow: '4px 4px 0px var(--shadow)' }}>
                    {currentCountry.name}
                  </h1>
                )}
              </div>
              
              {feedback === 'correct' && (
                <div style={{ margin: '15px 0', color: 'green', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  ¡Excelente! +10
                </div>
              )}
              {feedback === 'incorrect' && (
                <div style={{ margin: '15px 0', color: 'red', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  ¡Incorrecto! Era {CONTINENTS.find(c => c.id === currentCountry.region)?.label}.
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                {CONTINENTS.map((cont) => (
                  <Button 
                    key={cont.id} 
                    variant="light"
                    onClick={() => handleAnswer(cont.id)}
                    style={{ 
                      fontSize: '1.2rem', 
                      padding: '15px',
                      backgroundColor: feedback && cont.id === currentCountry.region ? 'var(--lvl-3-accent)' : 
                                       feedback === 'incorrect' ? '#ffebeb' : 'var(--card-bg)'
                    }}
                  >
                    {cont.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showLeaderboard && (
        <LeaderboardModal gameId="continents" onClose={() => setShowLeaderboard(false)} />
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

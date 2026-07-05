import { useState, useEffect } from 'react';
import { GameHeader } from '../components/GameHeader';
import { Button } from '../components/Button';
import { countries, type Country, getFlagUrl } from '../data/countries';
import { useGameScoring } from '../hooks/useGameScoring';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { HighScoreModal } from '../components/HighScoreModal';

interface FlagsGameProps {
  onBack: () => void;
}

export const FlagsGame: React.FC<FlagsGameProps> = ({ onBack }) => {
  const { 
    score, streak, highScore, handleCorrect, handleIncorrect,
    showLeaderboard, setShowLeaderboard, showHighScoreModal,
    finishGame, submitHighScore, cancelHighScore
  } = useGameScoring("flags");

  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [unaskedCountries, setUnaskedCountries] = useState<Country[]>([]);

  const resetGamePool = () => {
    const shuffled = [...countries].sort(() => Math.random() - 0.5);
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

    // Get 3 random wrong options
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      if (randomCountry.name !== target.name && !wrongOptions.includes(randomCountry.name)) {
        wrongOptions.push(randomCountry.name);
      }
    }

    // Shuffle options
    const allOptions = [...wrongOptions, target.name];
    allOptions.sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setFeedback(null);
  };

  useEffect(() => {
    const initialPool = resetGamePool();
    generateQuestion(initialPool);
  }, []);

  const handleAnswer = (selected: string) => {
    if (feedback !== null) return; // Prevent multiple clicks

    if (currentCountry && selected === currentCountry.name) {
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
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>¿A qué país pertenece esta bandera?</h3>
            
            <div style={{ margin: '20px auto', display: 'flex', justifyContent: 'center' }}>
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
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
              {options.map((opt, i) => (
                <Button 
                  key={i} 
                  variant="light"
                  onClick={() => handleAnswer(opt)}
                  style={{ 
                    fontSize: '1.2rem', 
                    padding: '15px',
                    backgroundColor: feedback && opt === currentCountry.name ? 'var(--lvl-2-accent)' : 
                                     feedback === 'incorrect' ? '#ffebeb' : 'var(--card-bg)'
                  }}
                >
                  {opt}
                </Button>
              ))}
            </div>

            {feedback === 'correct' && (
              <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold', fontSize: '1.5rem' }}>
                ¡Excelente! +10
              </div>
            )}
            {feedback === 'incorrect' && (
              <div style={{ marginTop: '20px', color: 'red', fontWeight: 'bold', fontSize: '1.5rem' }}>
                ¡Incorrecto! Era {currentCountry.name}.
              </div>
            )}
          </div>
        )}
      </div>
    </div>

      {showLeaderboard && (
        <LeaderboardModal gameId="flags" onClose={() => setShowLeaderboard(false)} />
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

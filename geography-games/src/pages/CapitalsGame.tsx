import { useState, useEffect } from 'react';
import { GameHeader } from '../components/GameHeader';
import { Button } from '../components/Button';
import { countries, type Country, getFlagUrl } from '../data/countries';

interface CapitalsGameProps {
  onBack: () => void;
}

export const CapitalsGame: React.FC<CapitalsGameProps> = ({ onBack }) => {
  const [score, setScore] = useState(0);
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
      if (randomCountry.capital !== target.capital && !wrongOptions.includes(randomCountry.capital)) {
        wrongOptions.push(randomCountry.capital);
      }
    }

    // Shuffle options
    const allOptions = [...wrongOptions, target.capital];
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

    if (currentCountry && selected === currentCountry.capital) {
      setFeedback('correct');
      setScore(s => s + 10);
      setTimeout(generateQuestion, 1000);
    } else {
      setFeedback('incorrect');
      setScore(s => s - 5);
      setTimeout(generateQuestion, 3000);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel" style={{ padding: '20px', margin: '0 auto' }}>
        <GameHeader title="Países y Capitales" score={score} onBack={onBack} />
        
        {currentCountry && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>¿Cuál es la capital de?</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', margin: '20px 0' }}>
              <img 
                src={getFlagUrl(currentCountry.flagCode)} 
                alt={`Bandera de ${currentCountry.name}`} 
                style={{ width: '60px', borderRadius: '4px', border: '2px solid var(--border)', boxShadow: '2px 2px 0px var(--shadow)' }} 
              />
              <h1 style={{ fontSize: '2.2rem', textTransform: 'uppercase', margin: 0 }}>
                {currentCountry.name}
              </h1>
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
                    backgroundColor: feedback && opt === currentCountry.capital ? 'var(--lvl-1-accent)' : 
                                     feedback === 'incorrect' ? '#ffebeb' : 'var(--card-bg)'
                  }}
                >
                  {opt}
                </Button>
              ))}
            </div>

            {feedback === 'correct' && (
              <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold', fontSize: '1.5rem' }}>
                ¡Correcto! +10
              </div>
            )}
            {feedback === 'incorrect' && (
              <div style={{ marginTop: '20px', color: 'red', fontWeight: 'bold', fontSize: '1.5rem' }}>
                ¡Incorrecto! Era {currentCountry.capital}.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

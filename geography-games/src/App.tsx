import { useState } from 'react';
import { Home } from './pages/Home';
import { CapitalsGame } from './pages/CapitalsGame';
import { FlagsGame } from './pages/FlagsGame';
import { ContinentsGame } from './pages/ContinentsGame';
import { MapLocationGame } from './pages/MapLocationGame';
import './index.css';

type GameScreen = 'home' | 'capitals' | 'flags' | 'continents' | 'mapLocation';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');

  const handleBack = () => setCurrentScreen('home');

  return (
    <>
      {currentScreen === 'home' && <Home onSelectGame={setCurrentScreen} />}
      {currentScreen === 'capitals' && <CapitalsGame onBack={handleBack} />}
      {currentScreen === 'flags' && <FlagsGame onBack={handleBack} />}
      {currentScreen === 'continents' && <ContinentsGame onBack={handleBack} />}
      {currentScreen === 'mapLocation' && <MapLocationGame onBack={handleBack} />}
      <div className="donation-banner">
        Si esta aplicación te resultó útil, puedes <a href="https://paypal.me/edgartpan?country.x=MX&locale.x=es_XC" target="_blank" rel="noreferrer">donar aquí</a>
      </div>
    </>
  );
}

export default App;

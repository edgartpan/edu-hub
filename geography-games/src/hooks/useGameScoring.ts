import { useState, useEffect } from 'react';
import { getTopScores, isHighScore, saveHighScore } from '../services/firebase';

export function useGameScoring(gameId: string) {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHighScoreModal, setShowHighScoreModal] = useState(false);

  useEffect(() => {
    getTopScores(gameId).then(scores => {
      if (scores.length > 0) setHighScore(scores[0].score);
    });
  }, [gameId]);

  const handleCorrect = (points = 10) => {
    setScore(s => s + points);
    setStreak(s => s + 1);
  };

  const handleIncorrect = (penalty = 5) => {
    setScore(s => s - penalty);
    setStreak(0);
  };

  const finishGame = async (onExit?: () => void) => {
    if (score <= 0) {
      if (onExit) onExit();
      return;
    }
    
    const qualifies = await isHighScore(gameId, score);
    if (qualifies) {
      // Temporarily store the exit callback if provided so we can call it after saving
      if (onExit) {
         // Hack to pass the callback to the modal. 
         // Better: we just don't exit if they qualify, we wait for them to submit/cancel.
         // Let's attach it to window for simplicity or just navigate when modal closes.
         (window as any)._pendingExit = onExit;
      }
      setShowHighScoreModal(true);
    } else {
      alert(`¡Juego terminado! Tu puntaje fue: ${score}`);
      resetScoring();
      if (onExit) onExit();
    }
  };

  const submitHighScore = async (initials: string, settings: string = '') => {
    await saveHighScore(gameId, initials, score, settings);
    setShowHighScoreModal(false);
    resetScoring();
    getTopScores(gameId).then(scores => {
      if (scores.length > 0) setHighScore(scores[0].score);
    });
    if ((window as any)._pendingExit) {
      (window as any)._pendingExit();
      delete (window as any)._pendingExit;
    }
  };

  const cancelHighScore = () => {
    setShowHighScoreModal(false);
    resetScoring();
    if ((window as any)._pendingExit) {
      (window as any)._pendingExit();
      delete (window as any)._pendingExit;
    }
  };

  const resetScoring = () => {
    setScore(0);
    setStreak(0);
  };

  return {
    score, streak, highScore, 
    handleCorrect, handleIncorrect, 
    showLeaderboard, setShowLeaderboard,
    showHighScoreModal, setShowHighScoreModal,
    finishGame, submitHighScore, cancelHighScore, resetScoring
  };
}

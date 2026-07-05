import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAmHPNej3Qpmt4jb3V5Rbfrbm_MsEnWKVY",
    authDomain: "math-hub-a45c5.firebaseapp.com",
    projectId: "math-hub-a45c5",
    storageBucket: "math-hub-a45c5.firebasestorage.app",
    messagingSenderId: "3003341330",
    appId: "1:3003341330:web:c35d806e7d09fbc83796cb",
    measurementId: "G-XY314T89QP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface ScoreData {
  name: string;
  score: number;
  date: any;
  settings: string;
}

export async function saveHighScore(gameId: string, playerName: string, score: number, settingsInfo: string) {
    try {
        const scoresRef = collection(db, "leaderboards", gameId, "scores");
        await addDoc(scoresRef, {
            name: playerName.trim().substring(0, 15),
            score: Math.floor(score),
            date: serverTimestamp(),
            settings: settingsInfo
        });
        console.log("Puntuación guardada exitosamente");
    } catch (error) {
        console.error("Error al guardar la puntuación:", error);
    }
}

export async function getTopScores(gameId: string): Promise<ScoreData[]> {
    try {
        const scoresRef = collection(db, "leaderboards", gameId, "scores");
        const q = query(scoresRef, orderBy("score", "desc"), limit(10));
        const snapshot = await getDocs(q);

        const scores: ScoreData[] = [];
        snapshot.forEach((doc) => {
            scores.push(doc.data() as ScoreData);
        });
        return scores;
    } catch (error) {
        console.error("Error al obtener puntuaciones:", error);
        return [];
    }
}

export async function isHighScore(gameId: string, newScore: number): Promise<boolean> {
    if (newScore <= 0) return false;

    const scores = await getTopScores(gameId);
    if (scores.length < 10) return true; // Si hay menos de 10, siempre entra

    const lowestTopScore = scores[scores.length - 1].score;
    return newScore > lowestTopScore;
}

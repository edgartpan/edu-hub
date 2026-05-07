let isGameTerminated = false;
//get elements from HTML
var divsumando1 = document.getElementById("divsumando1");
var divsumando2 = document.getElementById("divsumando2");
var btnopcion1 = document.getElementById("btnopcion1");
var btnopcion2 = document.getElementById("btnopcion2");
var btnopcion3 = document.getElementById("btnopcion3");
var level_ready = document.getElementById("level_ready");
var retro = document.getElementById("retro");
var imagen = document.getElementById("img");
var racha_ui = document.getElementById("racha_ui");
var score_ui = document.getElementById("score_ui");
var difficulty_value = document.getElementById("difficulty");

//initial values
//  score
var currentScore = 0;
var currentRacha = 0;
racha_ui.innerHTML = currentRacha;
score_ui.innerHTML = currentScore;
//  difficulty
var dificultad_set = 5;
difficulty_value.value = dificultad_set

//modify difficulty
function increase(){
  dificultad_set = dificultad_set + 1;
  difficulty_value.value = dificultad_set;
}

function decrease(){
  if (dificultad_set > 2) {
    dificultad_set = dificultad_set - 1;
    difficulty_value.value = dificultad_set;
  }
}
level_ready.addEventListener('click', generate);

//evaluate
function wrong_answer () {
    currentRacha = 0;
    racha_ui.innerHTML = currentRacha;
    retro.innerHTML = "¿Segur@?";
    retro.style.color = "#FF2977";
    imagen.src="../sumas/gifs/no.gif";
}

function right_answer () {
    currentRacha++;
    let multiplier = currentRacha >= 10 ? 2 : (currentRacha >= 5 ? 1.5 : 1);
    let basePoints = Math.floor(Math.pow(dificultad_set, 1.5));
    currentScore += Math.floor(basePoints * multiplier);
    
    score_ui.innerHTML = currentScore;
    racha_ui.innerHTML = currentRacha;
    
    retro.innerHTML = "¡Correcto!";
    retro.style.color = "#26C5AE";
    imagen.src="../sumas/gifs/si.gif"
    setTimeout(function() {
      generate();
    }, 2000);

}

// create necessary variables
var sumando1, sumando2, error1, error2, sorteo, correcto, incorrecto1, incorrecto2, resultados;


//variables sumas
function generate () {
    if(isGameTerminated) return;
    retro.innerHTML="&nbsp;"; retro.style.color=""; imagen.src="../sumas/gifs/neutral.gif";
    
    let type = Math.floor(Math.random() * 3);
    let seq = [], ans, w1, w2;
    if(type === 0) { // Arithmetic
        let start = Math.floor(Math.random() * 10) + 1;
        let step = Math.floor(Math.random() * 5) + 2;
        for(let i=0; i<4; i++) seq.push(start + i*step);
        ans = start + 4*step;
        w1 = ans + step; w2 = ans - 1;
    } else if(type === 1) { // Geometric
        let start = Math.floor(Math.random() * 3) + 1;
        let step = Math.floor(Math.random() * 2) + 2; // 2 or 3
        for(let i=0; i<4; i++) seq.push(start * Math.pow(step, i));
        ans = start * Math.pow(step, 4);
        w1 = ans * step; w2 = ans + step;
    } else { // Squares
        let start = Math.floor(Math.random() * 5) + 1;
        for(let i=0; i<4; i++) seq.push(Math.pow(start+i, 2));
        ans = Math.pow(start+4, 2);
        w1 = Math.pow(start+5, 2); w2 = ans + 2;
    }
    
    document.getElementById('divsumando1').innerHTML = seq.join(', ') + ', ...';
    correcto = ans.toString();
    
    let opts = [ans, w1, w2].sort(() => Math.random() - 0.5);
    btnopcion1.innerHTML = opts[0];
    btnopcion2.innerHTML = opts[1];
    btnopcion3.innerHTML = opts[2];
}
  
//validate buttons 
function checkAnswer(btnNum) {
    var selectedBtn = document.getElementById("btnopcion" + btnNum);
    if (selectedBtn.innerText == correcto){
      right_answer()
    } else {
      wrong_answer()
    }
  }

//call main function
generate();

// Settings Modal Logic
function toggleSettings() {
    const panel = document.getElementById("settingsPanel");
    const overlay = document.getElementById("settingsOverlay");
    const isVisible = overlay.style.display === "block";
    panel.style.display = isVisible ? "none" : "block";
    overlay.style.display = isVisible ? "none" : "block";
}

function updateDifficulty(val) {
    let num = parseInt(val);
    if (!isNaN(num) && num >= 2) {
        dificultad_set = num;
    } else {
        difficulty.value = dificultad_set;
    }
}

function applySettings() {
    generate();
    toggleSettings();
}

function cancelSettings() {
    toggleSettings();
}

// Arcade Firebase Logic
async function terminarJuego() {
    isGameTerminated = true;
    if (currentScore <= 0) {
        alert("¡Juega un poco más para obtener una puntuación!");
        return;
    }
    
    const isTop10 = await isHighScore("secuencias", currentScore);
    
    if (isTop10) {
        document.getElementById("highScoreOverlay").style.display = "block";
        document.getElementById("highScorePanel").style.display = "block";
        document.getElementById("initialsInput").focus();
    } else {
        alert("¡Juego terminado! Tu puntaje fue: " + currentScore);
        resetGame();
    }
}

async function submitHighScore() {
    const initials = document.getElementById("initialsInput").value;
    if (initials.trim().length < 1) return;
    
    const settingsStr = "Max: " + dificultad_set;
    await saveHighScore("secuencias", initials, currentScore, settingsStr);
    
    document.getElementById("highScoreOverlay").style.display = "none";
    document.getElementById("highScorePanel").style.display = "none";
    
    alert("¡Puntuación guardada exitosamente!");
    resetGame();
}

function resetGame() {
    isGameTerminated = false;
    currentScore = 0;
    currentRacha = 0;
    score_ui.innerHTML = currentScore;
    racha_ui.innerHTML = currentRacha;
    loadHighestScore();
    generate();
}

function cancelHighScore() {
    document.getElementById("highScoreOverlay").style.display = "none";
    document.getElementById("highScorePanel").style.display = "none";
    resetGame();
}

async function showLeaderboard() {
    document.getElementById("leaderboardOverlay").style.display = "block";
    document.getElementById("leaderboardPanel").style.display = "block";
    
    let scores = await getTopScores("secuencias");
    let html = "";
    if (scores.length === 0) {
        html = "<p>No hay puntuaciones aún.</p>";
    } else {
        scores.forEach((s, idx) => {
            html += `<div class="leaderboard-item">
                <div class="lb-rank">#${idx + 1}</div>
                <div class="lb-name">${s.name}</div>
                <div class="lb-score">${s.score}</div>
            </div>`;
        });
    }
    document.getElementById("leaderboardContent").innerHTML = html;
}

function hideLeaderboard() {
    document.getElementById("leaderboardOverlay").style.display = "none";
    document.getElementById("leaderboardPanel").style.display = "none";
}

async function loadHighestScore() {
    let top = await getTopScores("secuencias");
    if (top.length > 0 && document.getElementById("highscore_ui")) {
        document.getElementById("highscore_ui").innerText = top[0].score;
    }
}
loadHighestScore();
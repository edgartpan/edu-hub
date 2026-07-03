let isGameTerminated = false;
//get elements from HTML
var btnopcion1 = document.getElementById("btnopcion1");
var btnopcion2 = document.getElementById("btnopcion2");
var btnopcion3 = document.getElementById("btnopcion3");
var level_ready = document.getElementById("level_ready");
var retro = document.getElementById("retro");
var imagen = document.getElementById("img");
var racha_ui = document.getElementById("racha_ui");
var score_ui = document.getElementById("score_ui");

var questionText = document.getElementById("questionText");
var svgContainer = document.getElementById("svgContainer");

//initial values
var currentScore = 0;
var currentRacha = 0;
racha_ui.innerHTML = currentRacha;
score_ui.innerHTML = currentScore;

// We don't have settings difficulty_set because this is dynamic model generated.
var basePoints = 15; 

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
    currentScore += Math.floor(basePoints * multiplier);
    
    score_ui.innerHTML = currentScore;
    racha_ui.innerHTML = currentRacha;
    
    retro.innerHTML = "¡Correcto!";
    retro.style.color = "#26C5AE";
    imagen.src="../sumas/gifs/si.gif"
    
    // The user requested: "The game must be infinite: after a correct selection, immediately load the next visual problem"
    setTimeout(function() {
      generate();
    }, 2000);
}

// create necessary variables
var correcto;

// Mock function representing generative model call
async function fetchGeminiGeometry() {
    return new Promise((resolve) => {
        setTimeout(() => {
            let A = Math.floor(Math.random() * 8 + 2) * 10;
            let B = Math.floor(Math.random() * 8 + 2) * 10;
            let C = Math.floor(Math.random() * 8 + 2) * 10;
            while(A===B) B = Math.floor(Math.random() * 8 + 2) * 10;
            
            let types = ['val', 'sum', 'diff'];
            let type = types[Math.floor(Math.random() * types.length)];
            let json = {
                svg_diagram: '<svg viewBox="0 0 200 200" width="100%" height="100%">' +
                    '<line x1="20" y1="170" x2="190" y2="170" stroke="#333" stroke-width="2"/>' +
                    '<line x1="20" y1="10" x2="20" y2="170" stroke="#333" stroke-width="2"/>' +
                    '<rect x="40" y="' + (170 - A) + '" width="30" height="' + A + '" fill="#FF2977"/>' +
                    '<text x="55" y="190" font-size="16" fill="black" text-anchor="middle">A</text>' +
                    '<rect x="90" y="' + (170 - B) + '" width="30" height="' + B + '" fill="#6358FF"/>' +
                    '<text x="105" y="190" font-size="16" fill="black" text-anchor="middle">B</text>' +
                    '<rect x="140" y="' + (170 - C) + '" width="30" height="' + C + '" fill="#58FFC2"/>' +
                    '<text x="155" y="190" font-size="16" fill="black" text-anchor="middle">C</text>' +
                    '<text x="10" y="70" font-size="12" fill="black" text-anchor="end">100</text>' +
                    '<line x1="18" y1="70" x2="22" y2="70" stroke="#333" stroke-width="2"/>' +
                    '<text x="10" y="120" font-size="12" fill="black" text-anchor="end">50</text>' +
                    '<line x1="18" y1="120" x2="22" y2="120" stroke="#333" stroke-width="2"/>' +
                '</svg>'
            };
            
            if(type === 'val'){
                json.question = "¿Cuál es el valor de la barra B?";
                json.correct_answer = B;
                json.options = [A, B, C].sort(() => Math.random() - 0.5);
            } else if(type === 'sum'){
                json.question = "¿Cuánto suman A y C?";
                json.correct_answer = A + C;
                json.options = [A+C, A+B, B+C].sort(() => Math.random() - 0.5);
                if(new Set(json.options).size < 3) json.options = [A+C, A+C+10, A+C-10];
            } else {
                json.question = "¿Diferencia positiva entre A y B? (A - B o B - A)";
                let diff = Math.abs(A - B);
                json.correct_answer = diff;
                json.options = [diff, diff+10, Math.abs(diff-10)].sort(() => Math.random() - 0.5);
                if(new Set(json.options).size < 3) json.options = [diff, diff+20, diff+30];
            }
            resolve(json);
        }, 500);
    });
}

//variables
async function generate () {
    if(isGameTerminated) return;

    //reset feedback
    retro.innerHTML="&nbsp;";
    retro.style.color="";
    imagen.src="../sumas/gifs/neutral.gif";
    
    // Loading State
    questionText.innerHTML = "Generando diagrama...";
    svgContainer.innerHTML = `<svg width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#6358FF" stroke-width="4" stroke-dasharray="31.4 31.4">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
        </circle>
    </svg>`;
    btnopcion1.innerHTML = "-";
    btnopcion2.innerHTML = "-";
    btnopcion3.innerHTML = "-";
    btnopcion1.disabled = true;
    btnopcion2.disabled = true;
    btnopcion3.disabled = true;

    // Fetch from "Model"
    const data = await fetchGeminiGeometry();
    
    if(isGameTerminated) return;

    // Populate UI
    questionText.innerHTML = data.question;
    svgContainer.innerHTML = data.svg_diagram;
    correcto = data.correct_answer;
    
    btnopcion1.innerHTML = data.options[0];
    btnopcion2.innerHTML = data.options[1];
    btnopcion3.innerHTML = data.options[2];
    
    btnopcion1.disabled = false;
    btnopcion2.disabled = false;
    btnopcion3.disabled = false;
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


// Arcade Firebase Logic
async function terminarJuego() {
    isGameTerminated = true;
    if (currentScore <= 0) {
        alert("¡Juega un poco más para obtener una puntuación!");
        return;
    }
    
    const isTop10 = await isHighScore("estadistica", currentScore);
    
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
    
    const settingsStr = "Geometry";
    await saveHighScore("estadistica", initials, currentScore, settingsStr);
    
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
    
    let scores = await getTopScores("estadistica");
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
    let top = await getTopScores("estadistica");
    if (top.length > 0 && document.getElementById("highscore_ui")) {
        document.getElementById("highscore_ui").innerText = top[0].score;
    }
}
loadHighestScore();

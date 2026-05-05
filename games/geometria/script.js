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
            let types = ['angle', 'side', 'area_rect', 'perim_rect', 'area_square'];
            let type = types[Math.floor(Math.random() * types.length)];
            let json = {};
            if (type === 'angle') {
                let A = Math.floor(Math.random() * 40) + 40; // 40-80
                let B = Math.floor(Math.random() * 40) + 40; // 40-80
                let C = 180 - A - B;
                json.question = "Calcula el ángulo faltante 'C'";
                json.svg_diagram = `<svg viewBox="0 0 200 200" width="100%" height="100%">
                    <polygon points="40,160 160,160 100,60" fill="none" stroke="#6358FF" stroke-width="3"/>
                    <text x="35" y="155" font-size="16" fill="black">A=${A}°</text>
                    <text x="125" y="155" font-size="16" fill="black">B=${B}°</text>
                    <text x="95" y="50" font-size="20" fill="#FF2977" font-weight="bold">C=?</text>
                </svg>`;
                json.correct_answer = C;
                
                let w1 = C + Math.floor(Math.random() * 10) + 1;
                let w2 = C - Math.floor(Math.random() * 10) - 1;
                if(w1 === C) w1++;
                if(w2 === C) w2--;
                json.options = [C, w1, w2];
            } else if (type === 'side') {
                // Pythagorean triples
                let triples = [[3,4,5], [5,12,13], [6,8,10], [9,12,15], [8,15,17]];
                let t = triples[Math.floor(Math.random() * triples.length)];
                json.question = "Calcula la hipotenusa 'c'";
                json.svg_diagram = `<svg viewBox="0 0 200 200" width="100%" height="100%">
                    <polygon points="50,40 50,160 150,160" fill="none" stroke="#6358FF" stroke-width="3"/>
                    <rect x="50" y="140" width="20" height="20" fill="none" stroke="#6358FF" stroke-width="2"/>
                    <text x="25" y="100" font-size="18" fill="black">a=${t[0]}</text>
                    <text x="100" y="180" font-size="18" fill="black">b=${t[1]}</text>
                    <text x="110" y="90" font-size="20" fill="#FF2977" font-weight="bold">c=?</text>
                </svg>`;
                json.correct_answer = t[2];
                
                let w1 = t[2] + Math.floor(Math.random() * 3) + 1;
                let w2 = t[2] - Math.floor(Math.random() * 3) - 1;
                if (w2 <= 0) w2 = t[2] + 4;
                if(w1 === t[2]) w1++;
                if(w2 === t[2]) w2--;
                json.options = [t[2], w1, w2];
            } else if (type === 'area_rect') {
                let w = Math.floor(Math.random() * 8) + 3; // 3 to 10
                let h = Math.floor(Math.random() * 5) + 2; // 2 to 6
                if (w === h) w++;
                let area = w * h;
                json.question = "Calcula el ÁREA del rectángulo";
                json.svg_diagram = `<svg viewBox="0 0 200 200" width="100%" height="100%">
                    <rect x="30" y="60" width="140" height="80" fill="#E8E6FF" stroke="#6358FF" stroke-width="3"/>
                    <text x="100" y="50" font-size="18" fill="black" text-anchor="middle">b = ${w}</text>
                    <text x="15" y="105" font-size="18" fill="black" text-anchor="middle" transform="rotate(-90 15 105)">h = ${h}</text>
                    <text x="100" y="110" font-size="20" fill="#FF2977" font-weight="bold" text-anchor="middle">A=?</text>
                </svg>`;
                json.correct_answer = area;
                let w1 = area + w;
                let w2 = w * 2 + h * 2; // confuse with perimeter
                if (w2 === area) w2 = area + 5;
                json.options = [area, w1, w2];
            } else if (type === 'perim_rect') {
                let w = Math.floor(Math.random() * 8) + 3; // 3 to 10
                let h = Math.floor(Math.random() * 5) + 2; // 2 to 6
                if (w === h) w++;
                let perim = 2 * w + 2 * h;
                json.question = "Calcula el PERÍMETRO del rectángulo";
                json.svg_diagram = `<svg viewBox="0 0 200 200" width="100%" height="100%">
                    <rect x="30" y="60" width="140" height="80" fill="none" stroke="#6358FF" stroke-width="4" stroke-dasharray="8,8"/>
                    <text x="100" y="50" font-size="18" fill="black" text-anchor="middle">b = ${w}</text>
                    <text x="15" y="105" font-size="18" fill="black" text-anchor="middle" transform="rotate(-90 15 105)">h = ${h}</text>
                    <text x="100" y="110" font-size="20" fill="#FF2977" font-weight="bold" text-anchor="middle">P=?</text>
                </svg>`;
                json.correct_answer = perim;
                let w1 = perim + 2;
                let w2 = w * h; // confuse with area
                if (w2 === perim) w2 = perim + 4;
                json.options = [perim, w1, w2];
            } else if (type === 'area_square') {
                let l = Math.floor(Math.random() * 8) + 3; // 3 to 10
                let area = l * l;
                json.question = "Calcula el ÁREA del cuadrado";
                json.svg_diagram = `<svg viewBox="0 0 200 200" width="100%" height="100%">
                    <rect x="50" y="50" width="100" height="100" fill="#E8E6FF" stroke="#6358FF" stroke-width="3"/>
                    <text x="100" y="40" font-size="18" fill="black" text-anchor="middle">L = ${l}</text>
                    <text x="100" y="110" font-size="20" fill="#FF2977" font-weight="bold" text-anchor="middle">A=?</text>
                </svg>`;
                json.correct_answer = area;
                let w1 = l * 4; // confuse with perimeter
                if (w1 === area) w1 = area + 5;
                let w2 = area + Math.floor(Math.random() * 5) + 1;
                json.options = [area, w1, w2];
            }

            // shuffle options
            json.options.sort((a, b) => a - b);
            resolve(json);
        }, 800); // simulated network delay
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
    
    const isTop10 = await isHighScore("geometria", currentScore);
    
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
    await saveHighScore("geometria", initials, currentScore, settingsStr);
    
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
    
    let scores = await getTopScores("geometria");
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
    let top = await getTopScores("geometria");
    if (top.length > 0 && document.getElementById("highscore_ui")) {
        document.getElementById("highscore_ui").innerText = top[0].score;
    }
}
loadHighestScore();

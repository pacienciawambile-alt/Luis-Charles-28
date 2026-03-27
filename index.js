const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;
let snake, food, direction, game;

// Pontuações e melhor jogador armazenados no localStorage
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
let bestPlayerName = localStorage.getItem("bestPlayer") || "N/A";
let minScore = parseInt(localStorage.getItem("minScore")) || 0;

// Atualiza menu
document.getElementById("maxScore").innerText = bestScore;
document.getElementById("minScore").innerText = minScore;
document.getElementById("bestPlayer").innerText = bestPlayerName;

// Redimensiona canvas para responsivo
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Inicializa o jogo
function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = undefined;
    score = 0;
    food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    document.getElementById("score").innerText = score;
}

// Funções de direção
function changeDirection(newDir) {
    if (newDir === "UP" && direction !== "DOWN") direction = "UP";
    if (newDir === "DOWN" && direction !== "UP") direction = "DOWN";
    if (newDir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}
function setDirection(dir){ changeDirection(dir); }
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") changeDirection("UP");
    if (e.key === "ArrowDown") changeDirection("DOWN");
    if (e.key === "ArrowLeft") changeDirection("LEFT");
    if (e.key === "ArrowRight") changeDirection("RIGHT");
});

// Menu
document.getElementById("menuBtn").onclick = () => document.getElementById("menuContent").classList.toggle("hidden");
document.getElementById("resetScore").onclick = () => {
    bestScore = 0;
    bestPlayerName = "N/A";
    minScore = 0;
    localStorage.clear();
    document.getElementById("maxScore").innerText = bestScore;
    document.getElementById("minScore").innerText = minScore;
    document.getElementById("bestPlayer").innerText = bestPlayerName;
};

// Sons
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// Desenhar
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar cobra
    snake.forEach((seg, index) => {
        ctx.fillStyle = "yellow"; // cobra amarela
        ctx.fillRect(seg.x, seg.y, box, box);
    });

    // Desenhar comida
    ctx.fillStyle = "yellow"; // comida amarela
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    // Movimentos
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // Comer comida
    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        eatSound.play().catch(() => { });
        food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // Checagem de colisão (borda ou consigo mesma)
    if (headX < 0 || headY < 0 || headX >= canvas.width || headY >= canvas.height ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {

        clearInterval(game);
        gameOverSound.play().catch(() => { });
        alert("Game Over!");

        // Mostrar botão reiniciar
        document.getElementById("restart").style.display = "block";

        // Atualizar pontuação máxima e melhor jogador
        if (score > bestScore) {
            bestScore = score;
            bestPlayerName = prompt("Novo melhor jogador! Digite seu nome:", "Jogador");
            localStorage.setItem("bestScore", bestScore);
            localStorage.setItem("bestPlayer", bestPlayerName);
        }

        // Atualizar pontuação mínima
        if (minScore === 0 || score < minScore) {
            minScore = score;
            localStorage.setItem("minScore", minScore);
        }

        // Atualizar menu
        document.getElementById("maxScore").innerText = bestScore;
        document.getElementById("minScore").innerText = minScore;
        document.getElementById("bestPlayer").innerText = bestPlayerName;

        return;
    }

    snake.unshift(newHead);
}

// Botão de reiniciar
document.getElementById("restart").onclick = () => {
    clearInterval(game);
    initGame();
    document.getElementById("restart").style.display = "none";
    game = setInterval(draw, 100);
};

// Iniciar o jogo
initGame();
game = setInterval(draw, 100);

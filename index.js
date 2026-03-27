const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let gridSize = 20;
let box;

let score = 0;
let snake, food, direction, game;

// Scores
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
let bestPlayerName = localStorage.getItem("bestPlayer") || "N/A";
let minScore = parseInt(localStorage.getItem("minScore")) || 0;

document.getElementById("maxScore").innerText = bestScore;
document.getElementById("minScore").innerText = minScore;
document.getElementById("bestPlayer").innerText = bestPlayerName;

// 🔥 RESIZE INTELIGENTE (ESPAÇO PARA BOTÕES)
function resizeCanvas() {
    const controlsHeight = 180;
    const headerHeight = 100;

    const availableHeight = window.innerHeight - controlsHeight - headerHeight;
    const size = Math.min(window.innerWidth * 0.95, availableHeight);

    canvas.width = size;
    canvas.height = size;

    box = canvas.width / gridSize;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 🎮 INICIAR JOGO
function initGame() {
    snake = [{
        x: Math.floor(gridSize / 2) * box,
        y: Math.floor(gridSize / 2) * box
    }];

    direction = undefined;
    score = 0;

    food = {
        x: Math.floor(Math.random() * gridSize) * box,
        y: Math.floor(Math.random() * gridSize) * box
    };

    document.getElementById("score").innerText = score;
}

// 🎯 CONTROLOS
function changeDirection(newDir) {
    if (newDir === "UP" && direction !== "DOWN") direction = "UP";
    if (newDir === "DOWN" && direction !== "UP") direction = "DOWN";
    if (newDir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

function setDirection(dir) {
    changeDirection(dir);
}

// Teclado
document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") changeDirection("UP");
    if (e.key === "ArrowDown") changeDirection("DOWN");
    if (e.key === "ArrowLeft") changeDirection("LEFT");
    if (e.key === "ArrowRight") changeDirection("RIGHT");
});

// 📋 MENU
document.getElementById("menuBtn").onclick = () =>
    document.getElementById("menuContent").classList.toggle("hidden");

document.getElementById("resetScore").onclick = () => {
    localStorage.clear();
    location.reload();
};

// 🔊 SONS
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// 🎨 DESENHAR
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cobra
    snake.forEach(seg => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(seg.x, seg.y, box, box);
    });

    // Comida
    ctx.fillStyle = "yellow";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    // Movimento
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // Comer
    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = score;

        eatSound.play().catch(() => {});

        food = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // 💀 COLISÃO
    if (
        headX < 0 ||
        headY < 0 ||
        headX >= gridSize * box ||
        headY >= gridSize * box ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
    ) {
        clearInterval(game);
        gameOverSound.play().catch(() => {});
        alert("Game Over!");

        document.getElementById("restart").style.display = "block";

        // Melhor score
        if (score > bestScore) {
            bestScore = score;
            bestPlayerName = prompt("Novo melhor jogador:", "Jogador");

            localStorage.setItem("bestScore", bestScore);
            localStorage.setItem("bestPlayer", bestPlayerName);
        }

        // Pior score
        if (minScore === 0 || score < minScore) {
            minScore = score;
            localStorage.setItem("minScore", minScore);
        }

        document.getElementById("maxScore").innerText = bestScore;
        document.getElementById("minScore").innerText = minScore;
        document.getElementById("bestPlayer").innerText = bestPlayerName;

        return;
    }

    snake.unshift(newHead);
}

// 🔄 REINICIAR
document.getElementById("restart").onclick = () => {
    clearInterval(game);
    initGame();
    document.getElementById("restart").style.display = "none";
    game = setInterval(draw, 100);
};

// 🚀 START
initGame();
game = setInterval(draw, 100);

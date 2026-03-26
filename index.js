const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ajusta canvas para o menor lado da tela
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9; // 90% da tela
    canvas.width = size;
    canvas.height = size;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // inicial
const box = 20;
let score = 0;
let maxScore = 0;
let minScore = 0;

let snake;
let food;
let direction;
let game;

// INICIAR ESTADO
function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = undefined;
    score = 0;

    food = {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box
    };

    document.getElementById("score").innerText = score;
}

// DIREÇÃO UNIFICADA
function changeDirection(newDir) {
    if (newDir === "UP" && direction !== "DOWN") direction = "UP";
    if (newDir === "DOWN" && direction !== "UP") direction = "DOWN";
    if (newDir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// TECLADO
document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp") changeDirection("UP");
    if (event.key === "ArrowDown") changeDirection("DOWN");
    if (event.key === "ArrowLeft") changeDirection("LEFT");
    if (event.key === "ArrowRight") changeDirection("RIGHT");
});

// MOBILE
function setDirection(dir) {
    changeDirection(dir);
}

// MENU
document.getElementById("menuBtn").onclick = () => {
    document.getElementById("menuContent").classList.toggle("hidden");
};

// ZERAR SCORE
document.getElementById("resetScore").onclick = () => {
    maxScore = 0;
    minScore = 0;
    document.getElementById("maxScore").innerText = 0;
    document.getElementById("minScore").innerText = 0;
};

// DESENHAR
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach(seg => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(seg.x, seg.y, box, box);
    });

    ctx.fillStyle = "yellow";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // COMER
    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = score;

        document.getElementById("eatSound").play().catch(()=>{});

        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // GAME OVER
    if (
        headX < 0 || headY < 0 ||
        headX >= canvas.width || headY >= canvas.height ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
    ) {
        clearInterval(game);

        document.getElementById("gameOverSound").play().catch(()=>{});

        alert("Game Over!");
        document.getElementById("restart").style.display = "block";

        if (score > maxScore) {
            maxScore = score;
            document.getElementById("maxScore").innerText = maxScore;
        }

        if (minScore === 0 || score < minScore) {
            minScore = score;
            document.getElementById("minScore").innerText = minScore;
        }

        return;
    }

    snake.unshift(newHead);
}

// RESTART
document.getElementById("restart").onclick = () => {
    clearInterval(game);
    initGame();
    document.getElementById("restart").style.display = "none";
    game = setInterval(draw, 100);
};

// START
initGame();
game = setInterval(draw, 100);


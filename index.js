const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let score = 0;

let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
};

let direction;

document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "yellow" : "yellow";
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    ctx.fillStyle = "yellow";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    if (
        headX < 0 || headY < 0 ||
        headX >= canvas.width || headY >= canvas.height ||
        snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
    ) {
        clearInterval(game);
        alert("Game Over!");


    }

    snake.unshift(newHead);
}

let game = setInterval(draw, 100);

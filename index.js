const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;
let maxScore = 0;
let minScore = 0;
let snake, food, direction, game;

// Ajustar canvas para caber na tela
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight)*0.9;
    canvas.width = size;
    canvas.height = size;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Inicializar jogo
function initGame() {
    snake = [{x: 9*box, y:10*box}];
    direction = undefined;
    score = 0;
    food = {x: Math.floor(Math.random()*19)*box, y: Math.floor(Math.random()*19)*box};
    document.getElementById("score").innerText = score;
}

// Direção teclado e mobile
function changeDirection(newDir) {
    if(newDir==="UP" && direction!=="DOWN") direction="UP";
    if(newDir==="DOWN" && direction!=="UP") direction="DOWN";
    if(newDir==="LEFT" && direction!=="RIGHT") direction="LEFT";
    if(newDir==="RIGHT" && direction!=="LEFT") direction="RIGHT";
}
document.addEventListener("keydown", e=>{
    if(e.key==="ArrowUp") changeDirection("UP");
    if(e.key==="ArrowDown") changeDirection("DOWN");
    if(e.key==="ArrowLeft") changeDirection("LEFT");
    if(e.key==="ArrowRight") changeDirection("RIGHT");
});
function setDirection(dir){changeDirection(dir);}

// Menu
document.getElementById("menuBtn").onclick = ()=>document.getElementById("menuContent").classList.toggle("hidden");
document.getElementById("resetScore").onclick = ()=>{
    maxScore=0; minScore=0;
    document.getElementById("maxScore").innerText=0;
    document.getElementById("minScore").innerText=0;
};

// Desenhar
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Obstáculos
    obstacles.forEach(o=>{
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x*box, o.y*box, box, box);
    });

    // Cobra
    snake.forEach((seg,index)=>{
        ctx.fillStyle = snakeColors[index % snakeColors.length];
        ctx.fillRect(seg.x, seg.y, box, box);
    });

    // Comida
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if(direction==="UP") headY -= box;
    if(direction==="DOWN") headY += box;
    if(direction==="LEFT") headX -= box;
    if(direction==="RIGHT") headX += box;

    // Comer
    if(headX===food.x && headY===food.y){
        score++;
        document.getElementById("score").innerText=score;
        document.getElementById("eatSound").play().catch(()=>{});
        food = {x: Math.floor(Math.random()*19)*box, y: Math.floor(Math.random()*19)*box};
    } else {
        snake.pop();
    }

    let newHead = {x:headX, y:headY};

    // Colisão
    if(headX<0 || headY<0 || headX>=canvas.width || headY>=canvas.height ||
       snake.some(seg=>seg.x===newHead.x && seg.y===newHead.y) ||
       obstacles.some(o=>o.x*box===newHead.x && o.y*box===newHead.y)){
        clearInterval(game);
        document.getElementById("gameOverSound").play().catch(()=>{});
        alert("Game Over!");
        document.getElementById("restart").style.display="block";

        if(score>maxScore){maxScore=score; document.getElementById("maxScore").innerText=maxScore;}
        if(minScore===0||score<minScore){minScore=score; document.getElementById("minScore").innerText=minScore;}
        return;
    }

    snake.unshift(newHead);
}

// Restart
document.getElementById("restart").onclick = ()=>{
    clearInterval(game);
    initGame();
    document.getElementById("restart").style.display="none";
    game = setInterval(draw,100);
}

// Start
initGame();
game=setInterval(draw,100);

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = 800;
canvas.height = 200;

// Game State
let score = 0;
let gameSpeed = 6;
let isGameOver = false;
let obstacles = [];
let frame = 0;

// Image Assets
const dinoImg = new Image();
const cactusImg = new Image();

// Simple counter to track loading
let imagesLoaded = 0;
const totalImages = 2;

function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // ONLY start the game once all images are ready
        update();
    }
}

dinoImg.onload = onImageLoad;
cactusImg.onload = onImageLoad;

// Set the sources (I've used shorter, cleaner SVG data)
dinoImg.src = "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect x='20' y='0' width='20' height='20' fill='%23535353'/><rect x='0' y='10' width='20' height='20' fill='%23535353'/><rect x='10' y='30' width='10' height='10' fill='%23535353'/><rect x='30' y='30' width='10' height='10' fill='%23535353'/></svg>";

cactusImg.src = "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='40'><rect x='5' y='0' width='10' height='40' fill='%23535353'/><rect x='0' y='10' width='5' height='15' fill='%23535353'/><rect x='15' y='15' width='5' height='15' fill='%23535353'/></svg>";

// Physics & Dino
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GROUND_Y = 150;

const dino = { x: 50, y: GROUND_Y, w: 40, h: 40, dy: 0, grounded: false };

// Input
function jump() {
    if (isGameOver) restart();
    else if (dino.grounded) { dino.dy = JUMP_FORCE; dino.grounded = false; }
}
window.addEventListener('keydown', (e) => { if (e.code === 'Space') jump(); });
canvas.addEventListener('mousedown', jump);

function restart() {
    score = 0; gameSpeed = 6; obstacles = []; isGameOver = false;
    dino.y = GROUND_Y; dino.dy = 0;
    update();
}

function update() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    // Gravity
    dino.dy += GRAVITY;
    dino.y += dino.dy;
    if (dino.y > GROUND_Y) { dino.y = GROUND_Y; dino.dy = 0; dino.grounded = true; }

    // Draw Dino (wobble for run effect)
    let runY = (dino.grounded && Math.floor(frame / 8) % 2 === 0) ? dino.y - 2 : dino.y;
    ctx.drawImage(dinoImg, dino.x, runY, dino.w, dino.h);

    // Obstacles
    if (frame % 100 === 0) obstacles.push({ x: canvas.width, y: GROUND_Y + 5, w: 20, h: 35 });

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.x -= gameSpeed;
        ctx.drawImage(cactusImg, o.x, o.y, o.w, o.h);

        // Collision
        if (dino.x < o.x + o.w && dino.x + dino.w > o.x && runY < o.y + o.h && runY + dino.h > o.y) {
            isGameOver = true;
        }

        if (o.x + o.w < 0) {
            obstacles.splice(i, 1);
            score++;
            gameSpeed += 0.1;
            scoreElement.innerText = score.toString().padStart(5, '0');
        }
    }

    if (isGameOver) {
        ctx.fillStyle = "#535353";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER - CLICK TO RESTART", canvas.width/2, canvas.height/2);
    } else {
        requestAnimationFrame(update);
    }
}

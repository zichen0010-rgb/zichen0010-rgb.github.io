const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 200;

// Load Images (Using SVG Data URIs for instant loading)
const dinoImg = new Image();
dinoImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZD0iTTMwIDZoLTR2Mmg0VjZ6bS00IDloLTh2Mmg4di0yem0tNCAyaC0ydjJoMnYtMnpNMTAgMjFoNHYyaDR2MmgydjJoMnYyaDR2Mmg0di0yaDJ2LTJoMnYtMmg0di0yaDJ2LTJoMnYtMmg0di0yaDJ2LTJoMnYtMmgtNHYyaC0ydjJoLTJ2MmgtNHYyaC0ydjJoLTJ2MmgtOHYtMmgtMnYtMmgtMnYtMmgtMnYtMmgtNHYyem0zMCAwaDR2Mmg0di0yaC00di0yek0xMCAzM2g0djJoNHYyaDJ2MmgydjJoNHYyaDR2LTJoMnYtMmgydi0yaDR2LTJoMnYtMmg0di0yaDJ2LTJoMnYtMmgtNHYyaC0ydjJoLTJ2MmgtNHYyaC0ydjJoLTJ2MmgtOHYtMmgtMnYtMmgtMnYtMmgtMnYtMmgtNHYyeiIgZmlsbD0iIzUzNTM1MyIvPjwvc3ZnPg==';

const cactusImg = new Image();
cactusImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZD0iTTI0IDR2NDBoLTRWNGg0em0tOCA4djEyaC00VjEyOGg0em0xNiA0djEyaDRWMTZoLTR6bS04IDhoNHYyaC00di0yem04IDRoNHYyaC00di0yek0xMiAxNmgtNHYyaDR2LTJ6bTI0IDRoLTR2Mmg0di0yeiIgZmlsbD0iIzUzNTM1MyIvPjwvc3ZnPg==';

let score = 0;
let gameSpeed = 5;
let isGameOver = false;
let animationFrame = 0; // For "wobble" effect/animation

const dino = {
    x: 50,
    y: 150,
    width: 44,
    height: 44,
    dy: 0,
    jumpForce: 12,
    gravity: 0.6,
    grounded: false
};

const obstacles = [];

function spawnObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 40,
        width: 25,
        height: 40
    });
}

function jump() {
    if (dino.grounded) {
        dino.dy = -dino.jumpForce;
        dino.grounded = false;
    }
    if (isGameOver) restart();
}

window.addEventListener('keydown', (e) => { if (e.code === 'Space') jump(); });

function restart() {
    score = 0;
    obstacles.length = 0;
    isGameOver = false;
    gameSpeed = 5;
    animate();
}

function animate() {
    if (isGameOver) return;
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationFrame++;

    // Physics
    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > canvas.height) {
        dino.y = canvas.height - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    }

    // DRAW DINO (With a slight "running" bounce)
    let runBoost = (dino.grounded && Math.floor(animationFrame / 10) % 2 === 0) ? 2 : 0;
    ctx.drawImage(dinoImg, dino.x, dino.y + runBoost, dino.width, dino.height);

    // Obstacles
    if (Math.random() < 0.01) spawnObstacle();

    obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed;
        
        // DRAW CACTUS
        ctx.drawImage(cactusImg, obs.x, obs.y, obs.width, obs.height);

        // Collision
        if (dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y) {
            isGameOver = true;
            ctx.fillStyle = '#535353';
            ctx.font = 'bold 24px Courier';
            ctx.fillText('G A M E  O V E R', 300, 100);
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
            score++;
            gameSpeed += 0.1;
        }
    });

    ctx.fillStyle = '#535353';
    ctx.font = '20px Courier';
    ctx.fillText(score.toString().padStart(5, '0'), 700, 30);
}

animate();

const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_COLOR = "#fff";
const BALL_COLOR = "#0f0";
const NET_COLOR = "#fff";
const FPS = 60;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2 - 1, i, 2, 15, NET_COLOR);
    }
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, '#111');

    // Net
    drawNet();

    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

    // Ball
    drawCircle(ballX, ballY, BALL_RADIUS, BALL_COLOR);
}

// Game logic
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Player paddle collision
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some "spin"
        let collidePoint = ballY - (playerY + PADDLE_HEIGHT/2);
        ballSpeedY = collidePoint * 0.2;
    }

    // AI paddle collision
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        let collidePoint = ballY - (aiY + PADDLE_HEIGHT/2);
        ballSpeedY = collidePoint * 0.2;
    }

    // Left/right wall (score or reset)
    if (ballX - BALL_RADIUS < 0 || ballX + BALL_RADIUS > canvas.width) {
        resetBall();
    }

    // AI movement (basic)
    let aiCenter = aiY + PADDLE_HEIGHT/2;
    if (aiCenter < ballY - 35) {
        aiY += 5;
    } else if (aiCenter > ballY + 35) {
        aiY -= 5;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT/2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
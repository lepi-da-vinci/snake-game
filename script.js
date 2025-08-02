// Mengambil elemen-elemen dari HTML
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startMenu = document.getElementById('startMenu');
const gameOverMenu = document.getElementById('gameOverMenu');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const highScoreDisplay = document.getElementById('highScore');

// Variabel untuk pengaturan game
const gridSize = 20;
let snakeSpeed = 150;
let snake = [];
let direction = '';
let changingDirection = false;
let food = {};
let score = 0;
let highScore = 0;
let gameRunning = false;

// Event Listeners untuk tombol
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', changeDirection);

// Memuat skor tertinggi saat halaman dimuat
window.onload = function() {
    loadHighScore();
};

// Fungsi untuk memulai game
function startGame() {
    // Mereset variabel game
    snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
    direction = '';
    changingDirection = false;
    score = 0;
    gameRunning = true;
    scoreDisplay.textContent = score;

    // Menyembunyikan menu dan menampilkan kanvas
    startMenu.classList.add('hidden');
    gameOverMenu.classList.add('hidden');
    
    createFood();
    main(); // Memulai game loop
}

// Fungsi utama yang menjalankan game
function main() {
    if (gameOver() && gameRunning) {
        gameRunning = false;
        gameOverMenu.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
        updateHighScore(); // Memperbarui skor tertinggi
        return;
    }

    if (!gameRunning) return; // Jika game belum mulai, berhenti

    changingDirection = false;
    setTimeout(function onTick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, snakeSpeed);
}

// Fungsi untuk menggambar ular
function drawSnake() {
    snake.forEach(snakePart => {
        ctx.fillStyle = '#27ae60';
        ctx.strokeStyle = '#2c3e50';
        ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
        ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
    });
}

// Fungsi untuk menggambar apel
function drawFood() {
    ctx.fillStyle = '#e74c3c';
    ctx.strokeStyle = '#c0392b';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    ctx.strokeRect(food.x, food.y, gridSize, gridSize);
}

// Fungsi untuk menggerakkan ular
function moveSnake() {
    if (direction === '') return; // Jangan bergerak jika belum ada input

    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'right') head.x += gridSize;
    if (direction === 'left') head.x -= gridSize;
    if (direction === 'up') head.y -= gridSize;
    if (direction === 'down') head.y += gridSize;

    snake.unshift(head);

    const ateFood = snake[0].x === food.x && snake[0].y === food.y;
    if (ateFood) {
        score += 10;
        scoreDisplay.textContent = score; // Memperbarui tampilan skor
        createFood();
    } else {
        snake.pop();
    }
}

// Fungsi untuk menghasilkan apel
function createFood() {
    function randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / gridSize) * gridSize;
    }
    food = {
        x: randomFood(0, canvas.width - gridSize),
        y: randomFood(0, canvas.height - gridSize)
    };
}

// Fungsi untuk mengecek kondisi game over
function gameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - gridSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - gridSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// Fungsi untuk mengubah arah ular
function changeDirection(event) {
    // Tombol panah
    const LEFT_KEY_ARROW = 37;
    const UP_KEY_ARROW = 38;
    const RIGHT_KEY_ARROW = 39;
    const DOWN_KEY_ARROW = 40;
    // Tombol WASD
    const LEFT_KEY_WASD = 65; // A
    const UP_KEY_WASD = 87; // W
    const RIGHT_KEY_WASD = 68; // D
    const DOWN_KEY_WASD = 83; // S

    if (changingDirection || !gameRunning) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingRight = direction === 'right';
    const goingLeft = direction === 'left';

    if ((keyPressed === LEFT_KEY_ARROW || keyPressed === LEFT_KEY_WASD) && !goingRight) {
        direction = 'left';
    }
    if ((keyPressed === UP_KEY_ARROW || keyPressed === UP_KEY_WASD) && !goingDown) {
        direction = 'up';
    }
    if ((keyPressed === RIGHT_KEY_ARROW || keyPressed === RIGHT_KEY_WASD) && !goingLeft) {
        direction = 'right';
    }
    if ((keyPressed === DOWN_KEY_ARROW || keyPressed === DOWN_KEY_WASD) && !goingUp) {
        direction = 'down';
    }
}

// Menyimpan dan memuat skor tertinggi menggunakan Local Storage
function loadHighScore() {
    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore !== null) {
        highScore = parseInt(storedHighScore);
    }
    highScoreDisplay.textContent = highScore;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = highScore;
    }
}
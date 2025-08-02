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
const mobileControls = document.querySelector('.mobile-controls');
const desktopTutorial = document.getElementById('desktopTutorial');
const mobileTutorial = document.getElementById('mobileTutorial');

// Tombol kontrol mobile
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Variabel untuk pengaturan game
const gridSize = 20;
let snakeSpeed = 100;
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

// Event Listeners untuk tombol kontrol mobile
upBtn.addEventListener('click', () => handleMobileClick('up'));
downBtn.addEventListener('click', () => handleMobileClick('down'));
leftBtn.addEventListener('click', () => handleMobileClick('left'));
rightBtn.addEventListener('click', () => handleMobileClick('right'));

// Fungsi untuk menangani klik tombol mobile
function handleMobileClick(newDirection) {
    // Mengecek arah baru tidak berlawanan dengan arah saat ini
    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingRight = direction === 'right';
    const goingLeft = direction === 'left';

    if (changingDirection || !gameRunning) return;
    changingDirection = true;

    if (newDirection === 'left' && !goingRight) direction = 'left';
    if (newDirection === 'up' && !goingDown) direction = 'up';
    if (newDirection === 'right' && !goingLeft) direction = 'right';
    if (newDirection === 'down' && !goingUp) direction = 'down';
}

// Memuat skor tertinggi dan menyesuaikan UI saat halaman dimuat
window.onload = function() {
    loadHighScore();
    checkDeviceType();
    startMenu.classList.remove('hidden');
};

function checkDeviceType() {
    const isMobile = window.matchMedia("only screen and (max-width: 599px)").matches;
    if (isMobile) {
        desktopTutorial.classList.add('hidden');
        mobileTutorial.classList.remove('hidden');
        if (gameRunning) mobileControls.classList.remove('hidden');
    } else {
        desktopTutorial.classList.remove('hidden');
        mobileTutorial.classList.add('hidden');
        mobileControls.classList.add('hidden');
    }
}

// Fungsi untuk memulai game
function startGame() {
    // Menyesuaikan ukuran kanvas untuk HP
    const isMobile = window.matchMedia("only screen and (max-width: 599px)").matches;
    if (isMobile) {
        // Mengatur ukuran kanvas berdasarkan CSS
        const canvasSize = Math.floor(canvas.offsetWidth / gridSize) * gridSize;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
    } else {
        // Ukuran tetap untuk desktop
        canvas.width = 400;
        canvas.height = 400;
    }
    
    // Mereset variabel game
    snake = [{ 
        x: Math.floor(canvas.width / 2 / gridSize) * gridSize, 
        y: Math.floor(canvas.height / 2 / gridSize) * gridSize 
    }];
    direction = '';
    changingDirection = false;
    score = 0;
    gameRunning = true;
    scoreDisplay.textContent = score;

    // Menyembunyikan menu dan menampilkan kanvas
    startMenu.classList.add('hidden');
    gameOverMenu.classList.add('hidden');
    
    checkDeviceType();

    createFood();
    main(); // Memulai game loop
}

// Fungsi utama yang menjalankan game
function main() {
    if (gameOver() && gameRunning) {
        gameRunning = false;
        gameOverMenu.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
        updateHighScore();
        mobileControls.classList.add('hidden');
        return;
    }

    if (!gameRunning) return;

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
    if (direction === '') return;

    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'right') head.x += gridSize;
    if (direction === 'left') head.x -= gridSize;
    if (direction === 'up') head.y -= gridSize;
    if (direction === 'down') head.y += gridSize;

    snake.unshift(head);

    const ateFood = snake[0].x === food.x && snake[0].y === food.y;
    if (ateFood) {
        score += 10;
        scoreDisplay.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

// Fungsi untuk menghasilkan apel di posisi acak
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

// Fungsi untuk mengubah arah ular (untuk keyboard)
function changeDirection(event) {
    // Tombol panah
    const LEFT_KEY_ARROW = 37;
    const UP_KEY_ARROW = 38;
    const RIGHT_KEY_ARROW = 39;
    const DOWN_KEY_ARROW = 40;
    // Tombol WASD
    const LEFT_KEY_WASD = 65;
    const UP_KEY_WASD = 87;
    const RIGHT_KEY_WASD = 68;
    const DOWN_KEY_WASD = 83;

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
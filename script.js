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

// Event Listeners untuk tombol kontrol mobile
upBtn.addEventListener('click', () => changeDirection({ keyCode: 38 }));
downBtn.addEventListener('click', () => changeDirection({ keyCode: 40 }));
leftBtn.addEventListener('click', () => changeDirection({ keyCode: 37 }));
rightBtn.addEventListener('click', () => changeDirection({ keyCode: 39 }));

// Memuat skor tertinggi dan menyesuaikan UI saat halaman dimuat
window.onload = function() {
    loadHighScore();
    checkDeviceType();
};

function checkDeviceType() {
    const isMobile = window.matchMedia("only screen and (max-width: 599px)").matches;
    if (isMobile) {
        desktopTutorial.classList.add('hidden');
        mobileTutorial.classList.remove('hidden');
        mobileControls.classList.remove('hidden');
    } else {
        desktopTutorial.classList.remove('hidden');
        mobileTutorial.classList.add('hidden');
        mobileControls.classList.add('hidden');
    }
}

// Fungsi untuk memulai game
function startGame() {
    // Memastikan kanvas memiliki ukuran yang benar di JavaScript
    const canvasSize = Math.floor(canvas.offsetWidth / gridSize) * gridSize;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    // Mereset variabel game
    snake = [{ 
        x: Math.floor(canvasSize / 2 / gridSize) * gridSize, 
        y: Math.floor(canvasSize / 2 / gridSize) * gridSize 
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

// pengulangan
function main() {
    if (gameOver() && gameRunning) {
        gameRunning = false;
        gameOverMenu.classList.remove('hidden');
        finalScoreDisplay.textContent = score;
        updateHighScore();
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


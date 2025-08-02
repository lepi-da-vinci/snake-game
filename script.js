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
let snakeSpeed = 170;
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
        mobileControls.classList.remove('hidden'); // Menampilkan kontrol mobile
    } else {
        desktopTutorial.classList.remove('hidden');
        mobileTutorial.classList.add('hidden');
        mobileControls.classList.add('hidden'); // Menyembunyikan kontrol mobile
    }
}

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
    
    // Memastikan tombol mobile tampil jika di HP
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
        updateHighScore(); // Memperbarui skor tertinggi
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

// Fungsi-fungsi lainnya (drawSnake, drawFood, moveSnake, createFood, gameOver, changeDirection, loadHighScore, updateHighScore)
// Tetap sama seperti sebelumnya, tidak perlu diubah.
// ...
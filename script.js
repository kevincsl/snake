const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 100, y: 100 }]; // 蛇的初始位置
let dx = 10; // 蛇的初始移動方向 (向右)
let dy = 0;
let food = { x: 0, y: 0 };
let score = 0;
let gameSpeed = 100; // 遊戲速度
let startTime = new Date(); // 遊戲開始時間

const timeElement = document.getElementById('time');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas.height / 10)) * 10
    };
}

// 初始化食物位置
generateFood();

function updateInfo() {
    const currentTime = Math.floor((new Date() - startTime) / 1000);
    timeElement.textContent = `時間: ${currentTime}`;
    scoreElement.textContent = `分數: ${score}`;
}

// 在原有的 gameLoop 函數中加入遊戲狀態控制
let gameActive = true;

// 遊戲迴圈
function gameLoop() {
    if (!gameActive) return;

    setTimeout(() => {
        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新時間和分數
        updateInfo();

        // 繪製遊戲物件
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);

        // 更新蛇的位置
        let head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // 碰撞偵測
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameActive = false;
            return;
        }

        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameActive = false;
                return;
            }
        }

        // 吃到食物
        if (head.x === food.x && head.y === food.y) {
            score++;
            generateFood();
        } else {
            snake.pop();
        }

        requestAnimationFrame(gameLoop);
    }, gameSpeed);
}

// 定義重置遊戲函數
function resetGame() {
    // 重置蛇的位置和長度
    snake = [{ x: 100, y: 100 }];
    
    // 重置移動方向
    dx = 10;
    dy = 0;
    
    // 重置分數
    score = 0;
    
    // 重置開始時間
    startTime = new Date();
    
    // 重新生成食物
    generateFood();
    
    // 更新顯示
    updateInfo();
    
    // 如果遊戲結束了，重新開始遊戲循環
    if (!gameActive) {
        gameActive = true;
        gameLoop();
    }
}

// 綁定點擊事件
restartButton.addEventListener('click', resetGame);

// 監聽鍵盤事件
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && dy === 0 ) {
        dx = 0;
        dy = -10;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 10;
    } else if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -10;
        dy = 0;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = 10;
        dy = 0;
    }
});

// 初始啟動遊戲
gameLoop();

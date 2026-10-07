const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ball = { x: 150, y: 450, radius: 15, dy: 0, isRolling: false };
let pins = [];
let score = 0;

// ピンを三角形に配置する処理
function setupPins() {
    pins = [];
    let startX = 150;
    let startY = 100;
    let rows = 4;
    let pinRadius = 10;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
            let px = startX - (row * 15) + (col * 30);
            let py = startY + (row * 25);
            pins.push({ x: px, y: py, radius: pinRadius, active: true });
        }
    }
}

// 画面に図形を描画する処理
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ピンを描画（白）
    ctx.fillStyle = "white";
    pins.forEach(pin => {
        if (pin.active) {
            ctx.beginPath();
            ctx.arc(pin.x, pin.y, pin.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    });

    // ボールを描画（黒）
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // スコア表示
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("倒した数: " + score, 10, 30);
}

// ボールの動きと衝突判定を計算する処理
function update() {
    if (ball.isRolling) {
        ball.y -= ball.dy; // ボールが上に進む

        // ボールとピンの当たり判定
        pins.forEach(pin => {
            if (pin.active) {
                let dist = Math.hypot(ball.x - pin.x, ball.y - pin.y);
                if (dist < ball.radius + pin.radius) {
                    pin.active = false; // ピンを倒す
                    score++;
                }
            }
        });

        // 画面上部を抜けたらリセット
        if (ball.y < 0) {
            ball.isRolling = false;
            ball.y = 450;
            setTimeout(setupPins, 1000); // 1秒後にピンを再セット
        }
    }
}

// ゲームを毎フレーム更新するループ
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// クリックでボールを発射
canvas.addEventListener("click", () => {
    if (!ball.isRolling) {
        ball.isRolling = true;
        ball.dy = 8; // ボールのスピード
        score = 0;
    }
});

// 初期化してゲームスタート
setupPins();
gameLoop();
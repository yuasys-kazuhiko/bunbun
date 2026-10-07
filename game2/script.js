const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// カゴの設定
let basket = { x: 120, y: 450, width: 60, height: 20 };
let apples = [];
let score = 0;
let gameOver = false;

// リンゴを上から降らせる処理
function spawnApple() {
    if (!gameOver) {
        let ax = Math.random() * (canvas.width - 20) + 10;
        apples.push({ x: ax, y: -20, radius: 10, speed: 2 + Math.random() * 3 });
        
        // スコアが上がるほどリンゴが降るペースが速くなる
        let spawnTime = Math.max(300, 1000 - (score * 30));
        setTimeout(spawnApple, spawnTime);
    }
}

// 画面を更新する処理
function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // カゴを描画
    ctx.fillStyle = "#8b4513"; // 茶色
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    // リンゴの処理と描画
    ctx.fillStyle = "red";
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        apple.y += apple.speed; // 下へ移動

        // リンゴを描く
        ctx.beginPath();
        ctx.arc(apple.x, apple.y, apple.radius, 0, Math.PI * 2);
        ctx.fill();

        // カゴでキャッチしたか判定
        if (apple.y + apple.radius > basket.y && 
            apple.y - apple.radius < basket.y + basket.height && 
            apple.x > basket.x && 
            apple.x < basket.x + basket.width) {
            
            apples.splice(i, 1); // リンゴを消す
            score++;
            i--;
            continue;
        }

        // 地面に落ちたらゲームオーバー
        if (apple.y > canvas.height) {
            gameOver = true;
        }
    }

    // スコア表示
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("スコア: " + score, 10, 30);

    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("ゲームオーバー", 50, 250);
        ctx.font = "20px Arial";
        ctx.fillText("画面クリックでリトライ", 50, 290);
    } else {
        requestAnimationFrame(update);
    }
}

// マウスや指の動きに合わせてカゴを動かす
canvas.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    basket.x = e.clientX - rect.left - basket.width / 2;
});
canvas.addEventListener("touchmove", (e) => {
    let rect = canvas.getBoundingClientRect();
    basket.x = e.touches[0].clientX - rect.left - basket.width / 2;
    e.preventDefault(); // 画面スクロールを防ぐ
}, {passive: false});

// クリックでリトライ
canvas.addEventListener("click", () => {
    if (gameOver) {
        apples = [];
        score = 0;
        gameOver = false;
        spawnApple();
        update();
    }
});

// ゲーム開始
spawnApple();
update();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  color: 'blue',
  speed: 5,
  lasers: []  // 총알 대신 레이저로 변경
};

let enemies = [];
const enemySpawnInterval = 2000; // 2 seconds
let gameOver = false;

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawLasers() {
  player.lasers.forEach(laser => {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(laser.x, laser.y);
    ctx.lineTo(laser.x, laser.y - laser.height);
    ctx.stroke();
    laser.y -= laser.speed;
  });
}

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.fillStyle = 'green';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.y += enemy.speed;
  });
}

function updateGame() {
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawLasers();
  drawEnemies();
  checkCollisions();
  requestAnimationFrame(updateGame);
}

function checkCollisions() {
  // Remove lasers that are off-screen
  player.lasers = player.lasers.filter(laser => laser.y > 0);

  // Remove enemies that are off-screen
  enemies = enemies.filter(enemy => enemy.y < canvas.height);

  // Check for laser-enemy collisions
  player.lasers.forEach((laser, laserIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (laser.x < enemy.x + enemy.width &&
        laser.x + 4 > enemy.x &&
        laser.y < enemy.y + enemy.height &&
        laser.y - laser.height < enemy.y + enemy.height) {
        // Remove collided laser and enemy
        player.lasers.splice(laserIndex, 1);
        enemies.splice(enemyIndex, 1);
      }
    });
  });

  // Check for player-enemy collisions
  enemies.forEach((enemy) => {
    if (player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y) {
      // Game over
      gameOver = true;
    }
  });
}

function spawnEnemy() {
  if (gameOver) return;

  const enemy = {
    x: Math.random() * (canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    speed: 3
  };
  enemies.push(enemy);
}

setInterval(spawnEnemy, enemySpawnInterval);

canvas.addEventListener('mousemove', (e) => {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  player.x = e.clientX - rect.left - player.width / 2;
});

canvas.addEventListener('click', () => {
  if (gameOver) return;

  player.lasers.push({ x: player.x + player.width / 2 - 2, y: player.y, height: 20, speed: 7 });
});

updateGame();

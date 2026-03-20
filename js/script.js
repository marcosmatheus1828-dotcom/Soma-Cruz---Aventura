const menuScreen = document.getElementById('menu-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const menuAudio = document.getElementById('menu-audio');
const battleAudio = document.getElementById('battle-audio');
const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const gameScreen = document.getElementById('game-screen');

let isPlaying = false;
let collisionInterval = null;

window.onload = () => {
    menuAudio.play().catch(() => {});
    menuScreen.classList.add('active');
};

function startGame() {
    menuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    gameoverScreen.classList.remove('active');

    menuAudio.pause();
    battleAudio.currentTime = 0;
    battleAudio.play();

    // POSIÇÕES INICIAIS (Longe um do outro)
    player.style.left = '15%';
    enemy.style.left = '80%'; // Inimigo começa na direita

    isPlaying = true;

    collisionInterval = setInterval(() => {
        checkCollision();
        moveEnemy(); // Usando a lógica de perseguição
    }, 20);

    document.addEventListener('keydown', handleKey);
}
function handleKey(e){
    console.log(e.key,e.code);
if (!isPlaying)return;

    let currentLeft = parseFloat(player.style.left) || 15;
    const step = 4; // velocidade

    // Movimento Esquerda
    if (e.key === 'ArrowLeft' && currentLeft > 5) {
        player.style.left = (currentLeft - step) + '%';
        player.style.transform = 'scaleX(-1)'; // vira para esquerda
    }
    // Movimento Direita
    if (e.key === 'ArrowRight' && currentLeft < 80) {
        player.style.left = (currentLeft + step) + '%';
        player.style.transform = 'scaleX(1)'; // vira para direita
    }
    
    // PULO (deve estar AQUI dentro)
    if ((e.key === 'ArrowUp' || e.key === ' ') && !player.classList.add('jump')) {
        !player.classList.add('jump');
        
        setTimeout(() => {
            player.classList.remove('jump');
        }, 500);
    }
}

// LÓGICA DE SEGUIR 
function moveEnemy() {
    if (!isPlaying) return;
    
    let pPos = parseFloat(player.style.left);
    let ePos = parseFloat(enemy.style.left);
    let speed = 0.3; // Velocidade do inimigo em %

    if (pPos > ePos) {
        enemy.style.left = (ePos + speed) + '%';
        enemy.style.transform = 'scaleX(-1)';
    } else {
        enemy.style.left = (ePos - speed) + '%';
        enemy.style.transform = 'scaleX(1)';
    }
}

function checkCollision() {
    if (!isPlaying) return;
    const pRect = player.getBoundingClientRect();
    const eRect = enemy.getBoundingClientRect();

    // Margem de erro para a colisão ficar mais justa 
    if (
        pRect.right > eRect.left + 20 &&
        pRect.left < eRect.right - 20 &&
        pRect.bottom > eRect.top &&
        pRect.top < eRect.bottom
    ) {
        endGame();
    }
}

function endGame() {
    isPlaying = false;
    clearInterval(collisionInterval);
    gameoverScreen.classList.add('active');
    battleAudio.pause();
}

function restartBattle() {
    gameoverScreen.classList.remove('active');
    player.style.left = '15%';
    enemy.style.left = '80%';
    
    battleAudio.currentTime = 0;
    battleAudio.play();
    isPlaying = true;

    collisionInterval = setInterval(() => {
        checkCollision();
        moveEnemy();
    }, 20);
}
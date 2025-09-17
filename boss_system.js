// ========================================
// SISTEMA DE BOSS
// ========================================
// 
// Este arquivo contém:
// - Sistema de spawn de boss a cada 60 segundos
// - Aviso visual antes do spawn
// - Efeitos visuais dramáticos
// - Stats balanceados por dificuldade
// - Limpeza da tela antes do boss
//
// ========================================

// Sistema de Boss
var bossSpawnTimer = 0;
var BOSS_SPAWN_INTERVAL = 20000; // 60 segundos
var bossActive = false;

// ========================================
// CLASSE BOSS PROJECTILE
// ========================================
function BossProjectileObject(x, y, velocityX, velocityY, damage) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.damage = damage;
    this.radius = 8;
    this.exists = true;
    this.lifespan = 5000; // 5 segundos
    this.age = 0;
    this.color = '#FF0000';
}

BossProjectileObject.prototype.update = function(dt) {
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;
    this.age += dt;
    
    // Verificar se saiu da tela
    if (this.x < -50 || this.x > WIDTH + 50 || this.y < -50 || this.y > HEIGHT + 50) {
        this.exists = false;
    }
    
    // Verificar se expirou
    if (this.age >= this.lifespan) {
        this.exists = false;
    }
};

BossProjectileObject.prototype.render = function(ctx, camera) {
    if (!this.exists) return;
    
    var screenX = this.x - camera.x;
    var screenY = this.y - camera.y;
    
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Efeito de brilho
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
};

// ========================================
// SISTEMA DE BOSS
// ========================================
function updateBossSystem(dt) {
    // Spawn do boss
    if (!bossActive) {
        bossSpawnTimer += dt;
        if (bossSpawnTimer >= BOSS_SPAWN_INTERVAL) {
            spawnBoss();
            bossSpawnTimer = 0;
            bossActive = true;
        }
    }
    
    // Verificar se boss morreu
    var bossExists = enemies_list.some(function(enemy) {
        return enemy.isBoss && enemy.alive;
    });
    
    if (!bossExists && bossActive) {
        bossActive = false;
        bossSpawnTimer = 0; // Reset timer
    }
}

function spawnBoss() {
    // Mostrar aviso de boss chegando
    showBossWarning();
    
    // Limpar todos os inimigos da tela
    enemies_list = enemies_list.filter(function(enemy) {
        if (enemy.isBoss) return true; // Manter bosses existentes
        return false; // Remover todos os outros inimigos
    });
    
    // Limpar projéteis de inimigos
    enemy_projectiles_list = [];
    
    // Aguardar 3 segundos (tempo do aviso) antes de spawnar o boss
    setTimeout(function() {
        var level = player.level;
        
        // Stats do boss MUITO mais fortes (usando valores padrão)
        var bossHealth = Math.floor(500 * (1 + level * 0.5));
        var bossDamage = Math.floor(40);
        
        // Spawnar no centro da tela para máximo impacto
        var x = WIDTH / 2;
        var y = HEIGHT / 2;
        
        var boss = new BossObject(enemySprite, x, y, bossHealth, bossHealth);
        boss.base_damage = bossDamage;
        boss.base_speed = 0.1; // Mais rápido
        enemies_list.push(boss);
        
        // Efeito visual de spawn dramático
        createParticleExplosion(x, y, "#FF0000", 50);
        
        // Efeito de "wave" - múltiplas explosões
        for (var i = 0; i < 5; i++) {
            setTimeout(function() {
                var waveX = x + (Math.random() - 0.5) * 200;
                var waveY = y + (Math.random() - 0.5) * 200;
                createParticleExplosion(waveX, waveY, "#FFD700", 20);
            }, i * 200);
        }
        
        bossActive = true;
        console.log("BOSS SPAWNADO! Nível:", level, "Vida:", bossHealth);
    }, 3000); // 3 segundos de aviso
}

function showBossWarning() {
    // Criar aviso visual
    var warningDiv = document.createElement('div');
    warningDiv.id = 'bossWarning';
    warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 4000;
        color: white;
        font-family: 'Arial', sans-serif;
        animation: bossWarningPulse 0.5s infinite alternate;
    `;
    
    // Adicionar CSS da animação
    var style = document.createElement('style');
    style.textContent = `
        @keyframes bossWarningPulse {
            from { background: rgba(255, 0, 0, 0.8); }
            to { background: rgba(255, 0, 0, 0.4); }
        }
    `;
    document.head.appendChild(style);
    
    // Título do aviso
    var title = document.createElement('h1');
    title.textContent = '⚠️ BOSS INCOMING! ⚠️';
    title.style.cssText = 'font-size: 4em; margin-bottom: 20px; text-shadow: 3px 3px 6px rgba(0,0,0,0.8); animation: bossWarningText 0.3s infinite alternate;';
    
    // Adicionar CSS da animação do texto
    var textStyle = document.createElement('style');
    textStyle.textContent = `
        @keyframes bossWarningText {
            from { transform: scale(1); }
            to { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(textStyle);
    
    warningDiv.appendChild(title);
    
    // Contador regressivo
    var countdown = document.createElement('h2');
    countdown.textContent = '3';
    countdown.style.cssText = 'font-size: 6em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);';
    warningDiv.appendChild(countdown);
    
    // Atualizar contador
    var timeLeft = 3;
    var countdownInterval = setInterval(function() {
        timeLeft--;
        if (timeLeft > 0) {
            countdown.textContent = timeLeft;
        } else {
            countdown.textContent = 'FIGHT!';
            clearInterval(countdownInterval);
        }
    }, 1000);
    
    document.body.appendChild(warningDiv);
    
    // Remover aviso após 3 segundos
    setTimeout(function() {
        if (warningDiv.parentNode) {
            warningDiv.remove();
        }
        if (style.parentNode) {
            style.remove();
        }
        if (textStyle.parentNode) {
            textStyle.remove();
        }
    }, 3000);
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================
function createParticleExplosion(x, y, color, count) {
    for (var i = 0; i < count; i++) {
        var angle = Math.random() * 2 * Math.PI;
        var speed = (Math.random() * 0.2) + 0.05;
        var lifespan = randomIntBetween(400, 700);
        particles_list.push(new ParticleObject(x, y, color, speed, angle, lifespan));
    }
}

console.log('Sistema de boss carregado!');

// Sistema de Boss
var BossObject = function(spriteSheet, x, y, health, maxHealth) {
    const scale = 5; // Boss ainda maior
    return {
        x: x,
        y: y,
        radius: 40 * scale,
        health: health,
        max_health: maxHealth,
        alive: true,
        base_damage: 35, // Mais dano
        base_speed: 0.08, // Mais rápido
        isBoss: true,
        enemyType: 'boss',
        
        // Propriedades especiais do boss
        phase: 1, // Fase do boss (1, 2, 3)
        invincibility_time: 0,
        special_attack_timer: 0,
        special_attack_cooldown: 5000, // 5 segundos entre ataques especiais
        
        // Propriedades do Sprite
        sprite: spriteSheet,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,
        
        // Efeitos especiais do boss
        auraPulse: 0,
        lastAttack: 0,
        attackCooldown: 2000, // 2 segundos entre ataques
        
        render: function(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Efeito de aura pulsante
            this.auraPulse += 0.1;
            var auraSize = this.radius + Math.sin(this.auraPulse) * 10;
            
            // Aura externa (vermelha)
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, auraSize, 0, Math.PI * 2);
            ctx.stroke();
            
            // Aura interna (dourada)
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, auraSize - 5, 0, Math.PI * 2);
            ctx.stroke();
            
            // Sprite do boss
            const renderWidth = this.frameWidth * this.scale;
            const renderHeight = this.frameHeight * this.scale;
            
            ctx.drawImage(
                this.sprite,
                0, 0,
                this.frameWidth, this.frameHeight,
                -renderWidth / 2, -renderHeight / 2,
                renderWidth, renderHeight
            );
            
            // Barra de vida do boss
            var barWidth = 100;
            var barHeight = 8;
            var barX = -barWidth / 2;
            var barY = -this.radius - 20;
            
            // Fundo da barra
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Vida atual
            var healthPercentage = this.health / this.max_health;
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
            
            // Borda da barra
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barWidth, barHeight);
            
            // Texto "BOSS"
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('BOSS', 0, barY - 15);
            
            ctx.restore();
        },
        
        update: function(dt) {
            // Decrementar invencibilidade
            if (this.invincibility_time > 0) {
                this.invincibility_time -= dt;
            }
            
            // Movimento em direção ao jogador
            var dx = player.x - this.x;
            var dy = player.y - this.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                var moveX = (dx / distance) * this.base_speed * dt;
                var moveY = (dy / distance) * this.base_speed * dt;
                
                this.x += moveX;
                this.y += moveY;
            }
            
            // Ataque especial do boss
            var now = Date.now();
            if (now - this.lastAttack > this.attackCooldown) {
                this.specialAttack();
                this.lastAttack = now;
            }
        },
        
        specialAttack: function() {
            // Criar múltiplos projéteis em direções diferentes
            var directions = 8;
            for (var i = 0; i < directions; i++) {
                var angle = (i / directions) * Math.PI * 2;
                var projectile = new ProjectileObject(
                    projectileSprite, 
                    this.x, 
                    this.y, 
                    angle
                );
                projectile.speed = 0.3; // Mais lento que projéteis do jogador
                projectile.damage = this.base_damage;
                projectile.isEnemyProjectile = true;
                projectiles_list.push(projectile);
            }
            
            // Efeito visual
            createParticleExplosion(this.x, this.y, "#FF0000", 20);
        },
        
        take_damage: function(damage) {
            // Verificar invencibilidade
            if (this.invincibility_time > 0) return;
            
            this.health -= damage;
            
            // Aplicar invencibilidade temporária
            this.invincibility_time = 500; // 500ms de invencibilidade
            
            // Verificar mudança de fase
            var healthPercent = this.health / this.max_health;
            if (healthPercent <= 0.66 && this.phase === 1) {
                this.phase = 2;
                this.enterPhase2();
            } else if (healthPercent <= 0.33 && this.phase === 2) {
                this.phase = 3;
                this.enterPhase3();
            }
            
            if (this.health <= 0) {
                this.alive = false;
                // Boss dropa muito XP
                var bossXP = 100 + (this.max_health / 5);
                experience_orbs_list.push(new ExperienceOrbObject(xpSprite, this.x, this.y, bossXP));
                
                // Efeito de morte
                createParticleExplosion(this.x, this.y, "#FFD700", 80);
                
                // Notificar que o boss morreu
                showBossDefeated();
            }
        },
        
        enterPhase2: function() {
            // Fase 2: Boss fica mais agressivo
            this.base_speed *= 1.5;
            this.attackCooldown *= 0.7;
            this.special_attack_cooldown *= 0.8;
            
            // Efeito visual de mudança de fase
            createParticleExplosion(this.x, this.y, "#FF4500", 30);
        },
        
        enterPhase3: function() {
            // Fase 3: Boss fica muito agressivo
            this.base_speed *= 1.3;
            this.attackCooldown *= 0.6;
            this.special_attack_cooldown *= 0.5;
            
            // Efeito visual de mudança de fase
            createParticleExplosion(this.x, this.y, "#8B0000", 40);
        }
    };
};

// Função para mostrar aviso de boss chegando
function showBossWarning() {
    var warningDiv = document.createElement('div');
    warningDiv.id = 'bossWarning';
    warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(139, 0, 0, 0.9);
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
            0% { background: rgba(139, 0, 0, 0.9); }
            100% { background: rgba(255, 0, 0, 0.9); }
        }
    `;
    document.head.appendChild(style);
    
    // Título principal
    var title = document.createElement('h1');
    title.textContent = '⚠️ BOSS INCOMING! ⚠️';
    title.style.cssText = 'font-size: 4em; margin-bottom: 20px; text-shadow: 3px 3px 6px rgba(0,0,0,0.8); color: #FFD700;';
    warningDiv.appendChild(title);
    
    // Subtítulo
    var subtitle = document.createElement('h2');
    subtitle.textContent = 'Prepare-se para a batalha!';
    subtitle.style.cssText = 'font-size: 2em; margin-bottom: 30px; color: #FF6B6B;';
    warningDiv.appendChild(subtitle);
    
    // Contador regressivo
    var countdown = document.createElement('div');
    countdown.id = 'bossCountdown';
    countdown.textContent = '3';
    countdown.style.cssText = 'font-size: 6em; font-weight: bold; color: #FF0000; text-shadow: 4px 4px 8px rgba(0,0,0,0.8);';
    warningDiv.appendChild(countdown);
    
    document.body.appendChild(warningDiv);
    
    // Contador regressivo
    var timeLeft = 3;
    var countdownInterval = setInterval(function() {
        timeLeft--;
        countdown.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            warningDiv.remove();
            style.remove();
        }
    }, 1000);
}

// Função para mostrar que o boss foi derrotado
function showBossDefeated() {
    var victoryDiv = document.createElement('div');
    victoryDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: #FFD700;
        padding: 30px 50px;
        border-radius: 15px;
        font-size: 2em;
        font-weight: bold;
        text-align: center;
        z-index: 1001;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    
    victoryDiv.innerHTML = `
        <div style="font-size: 3em; margin-bottom: 20px;">🏆</div>
        <div>BOSS DERROTADO!</div>
        <div style="font-size: 0.7em; margin-top: 15px; color: #ccc;">+100 XP Bônus</div>
    `;
    
    document.body.appendChild(victoryDiv);
    
    // Remover após 3 segundos
    setTimeout(function() {
        victoryDiv.remove();
    }, 3000);
}

console.log('BossSystem carregado!');

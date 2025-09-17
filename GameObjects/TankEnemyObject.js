// TankEnemy - Inimigo resistente e poderoso
// Desenvolvido para trabalho em equipe

var TankEnemyObject = function(sprite, x, y, health, damage) {
    const scale = 2.0; // Muito maior que inimigo normal
    return {
        x: x,
        y: y,
        radius: 20 * scale,
        health: health,
        max_health: health,
        base_damage: damage,
        speed: 0.4, // Muito mais lento
        alive: true,
        sprite: sprite,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,
        invincibility_time: 0,
        isBoss: false,
        enemyType: 'tank', // Identificador do tipo
        
        // Propriedades específicas do TankEnemy
        charge_timer: 0,
        charge_cooldown: 5000, // 5 segundos entre cargas
        is_charging: false,
        charge_speed: 2.0,
        charge_duration: 1000, // 1 segundo de carga
        charge_direction: { x: 0, y: 0 },
        armor: 0.3, // Reduz 30% do dano recebido
        knockback_resistance: 0.8, // Resistência a knockback
        
        render: function(ctx, camera) {
            if (!this.alive) return;
            
            ctx.save();
            ctx.translate(-camera.x, -camera.y);
            // Efeito visual de carga
            if (this.is_charging) {
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#8B0000';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Partículas de carga
                for (var i = 0; i < 8; i++) {
                    var angle = (i / 8) * Math.PI * 2;
                    var px = this.x + Math.cos(angle) * (this.radius + 15);
                    var py = this.y + Math.sin(angle) * (this.radius + 15);
                    ctx.fillStyle = '#FF0000';
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Sprite do inimigo
            if (this.sprite && this.sprite.complete) {
                ctx.drawImage(
                    this.sprite,
                    0, 0, this.frameWidth, this.frameHeight,
                    this.x - this.radius, this.y - this.radius,
                    this.radius * 2, this.radius * 2
                );
            } else {
                // Fallback: círculo vermelho escuro
                ctx.fillStyle = this.is_charging ? '#8B0000' : '#DC143C';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Barra de vida (sempre visível)
            var barWidth = this.radius * 2;
            var barHeight = 6;
            var barY = this.y - this.radius - 12;
            
            // Fundo da barra
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(this.x - barWidth/2 - 1, barY - 1, barWidth + 2, barHeight + 2);
            
            // Vida atual
            var healthPercent = this.health / this.max_health;
            ctx.fillStyle = healthPercent > 0.5 ? 'rgba(0, 255, 0, 0.9)' : 
                           healthPercent > 0.25 ? 'rgba(255, 255, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)';
            ctx.fillRect(this.x - barWidth/2, barY, barWidth * healthPercent, barHeight);
            
            // Texto "TANK"
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('TANK', this.x, this.y + 5);
            
            ctx.restore();
        },
        
        update: function(dt) {
            if (!this.alive) return;
            
            // Atualizar timer de invencibilidade
            if (this.invincibility_time > 0) {
                this.invincibility_time -= dt;
            }
            
            // Atualizar timer de carga
            this.charge_timer += dt;
            
            // Lógica da carga
            if (this.charge_timer >= this.charge_cooldown && !this.is_charging) {
                this.startCharge();
            }
            
            if (this.is_charging) {
                this.updateCharge(dt);
            } else {
                this.updateNormalMovement(dt);
            }
        },
        
        startCharge: function() {
            this.is_charging = true;
            this.charge_timer = 0;
            
            // Calcular direção da carga (em direção ao jogador)
            if (player) {
                var dx = player.x - this.x;
                var dy = player.y - this.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    this.charge_direction.x = dx / distance;
                    this.charge_direction.y = dy / distance;
                }
            }
        },
        
        updateCharge: function(dt) {
            // Mover durante a carga
            this.x += this.charge_direction.x * this.charge_speed * (dt / 16.67);
            this.y += this.charge_direction.y * this.charge_speed * (dt / 16.67);
            
            // Verificar se a carga terminou
            if (this.charge_timer >= this.charge_duration) {
                this.is_charging = false;
            }
        },
        
        updateNormalMovement: function(dt) {
            // Movimento normal em direção ao jogador
            if (player) {
                var dx = player.x - this.x;
                var dy = player.y - this.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    var moveX = (dx / distance) * this.speed * (dt / 16.67);
                    var moveY = (dy / distance) * this.speed * (dt / 16.67);
                    
                    this.x += moveX;
                    this.y += moveY;
                }
            }
        },
        
        take_damage: function(amount) {
            if (this.invincibility_time > 0) return;
            
            // Aplicar redução de dano da armadura
            var actualDamage = amount * (1 - this.armor);
            this.health -= actualDamage;
            this.invincibility_time = 300; // 300ms de invencibilidade
            
            // Efeito visual de dano
            if (this.health <= 0) {
                this.alive = false;
                // Criar partículas de morte
                createParticleExplosion(this.x, this.y, "#DC143C", 25);
                
                // Dropar XP
                var xpOrb = new ExperienceOrbObject(xpSprite, this.x, this.y, 30);
                experience_orbs_list.push(xpOrb);
            } else {
                // Efeito visual de dano
                createParticleExplosion(this.x, this.y, "#FF0000", 10);
            }
        }
    };
};
/*
    DashEnemyObject

    Inimigo mais rápido, dá uns dash de vez em quando

    Parâmetros:
    - sprite: spriteSheet
    - x: x
    - y: y
    - max_health: vida máxima
    - base_speed: velocidade base dos inimigos, velocidade efetiva é 2.5x a base
    - base_damage: dano base
*/
function DashEnemyObject(sprite, x, y, max_health, base_speed, base_damage) {
    // Cria o objeto base EnemyObject
    var base = new EnemyObject(sprite, x, y, max_health, base_speed, base_damage);

    // Propriedades específicas do DashEnemy
    base.invincibility_time = 0;
    base.enemyType = 'dash';
    base.frozen = false;
    base.freeze_timer = 0;

    
    base.is_dashing = false;
    base.is_revving = false;
    base.rev_timer = 0;
    base.rev_duration = 500;
    base.dash_timer = 0;
    base.dash_cooldown = 3000; // 3 segundos entre dashes
    base.dash_duration = 600; // ms
    base.dash_speed_multiplier = 5.0;
    base.dash_target = { x: 0, y: 0 };


    base.startDash = function() {
        this.is_dashing = true;
        this.is_revving = false;
        this.dash_timer = 0;
        this.rev_timer = 0;
        this.dash_target = { x: player.x, y: player.y };
    }

    base.startRev = function() {
        this.is_revving = true;
        this.is_dashing = false;
        this.rev_timer = 0;
    }

    base.stopDash = function() {
        this.is_dashing = false;
        this.is_revving = false;
        this.dash_timer = 0;
        this.rev_timer = 0;
    }

    // Sobrescreve o método update para incluir lógica de dash
    base.update = function(dt) {

        // Lógica de congelamento
        if (this.frozen) {
            this.freeze_timer -= dt;
            if (this.freeze_timer <= 0) {
                this.frozen = false;
            }
            return; // Pula o resto da atualização se estiver congelado
        }

        // Atualiza a animação (básico, pois não usamos herança clássica aqui)
        this.animationTimer += dt;
        if (this.animationTimer > this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.animationTimer = 0;
        }

        // If enemyType is fast_dash, do dash logic
        // Dash logic
        // If not dashing, move towards player
        this.dash_timer += dt;
        
        // Dashing movement
        if (this.is_dashing) {
            this.moveTowardsPoint(dt, this.speed * this.dash_speed_multiplier, this.dash_target.x, this.dash_target.y);
            if (this.dash_timer >= this.dash_duration || this.distanceToPoint(this.dash_target.x, this.dash_target.y) < this.radius) {
                this.stopDash();
            }
        }
        // Revving dash
        else if(this.is_revving) {
            this.rev_timer += dt;
            if (this.rev_timer >= this.rev_duration) {
                this.startDash();
            }
        }
        else {
            this.moveTowardsPlayer(dt, this.speed);
            if (this.dash_timer >= this.dash_cooldown && this.distanceToPoint(player.x, player.y) <= (this.dash_duration * this.dash_speed_multiplier * this.speed)) {
                this.startRev();
            }
        }

        // Verifica se o inimigo está morto
        if (this.health <= 0) {
            this.alive = false;
        }
    };

    // Sobrescreve o método render para efeito visual do dash
    base.render = function(ctx, camera) {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        // Efeito visual de congelamento
        if (this.frozen) {
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#ADD8E6'; // Azul claro
            ctx.beginPath();
            // Desenha um "bloco de gelo" em volta
            ctx.rect(this.x - this.radius - 2, this.y - this.radius - 2, (this.radius + 2) * 2, (this.radius + 2) * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        // Efeito visual do dash
        if (this.is_dashing) {
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#00FFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        } else if(this.is_revving) {
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        // Vira o sprite para encarar o jogador
        if (player.x < this.x) {
            ctx.scale(-1, 1);
        }

        // Sprite do inimigo
        if (this.sprite && this.sprite.complete) {
            const frameX = (this.currentFrame % this.numColumns) * this.frameWidth;
            const frameY = Math.floor(this.currentFrame / this.numColumns) * this.frameHeight;
            const renderWidth = this.frameWidth * this.scale;
            const renderHeight = this.frameHeight * this.scale;

            ctx.drawImage(
                this.sprite,
                frameX, frameY, this.frameWidth, this.frameHeight,
                -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight
            );
        } else {
            // Fallback: círculo azul claro
            ctx.fillStyle = this.is_dashing ? '#00FFFF' : '#87CEEB';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Barra de vida
        if (this.health < this.max_health) {
            var barWidth = this.radius * 2;
            var barHeight = 6;
            var barX = this.x - this.radius;
            var barY = this.y - this.radius - 12;
            ctx.fillStyle = "red";
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = "green";
            ctx.fillRect(barX, barY, (this.health / this.max_health) * barWidth, barHeight);
        }

        ctx.restore();
    };

    return base;
}
var BossObject = function(sprite, x, y) {
    // Call parent constructor to set up base enemy properties
    EnemyObject.call(this, sprite, x, y, enemy_status.base_health, enemy_status.base_speed, enemy_status.base_damage);
    
    // Override enemy-specific properties
    this.isBoss = true;
    this.enemyType = 'boss';
    
    // Make boss sprite twice as big
    this.scale = this.scale * 2; // Double the inherited scale (2.5 * 2 = 5.0)

    // Override sprite properties for the boss
    this.frameWidth = 128;
    this.frameHeight = 128;
    this.frameCount = 6;
    this.numColumns = 2;

    this.radius = (this.frameWidth / 2) * this.scale; // Update collision radius to match new scale and frame size
    this.max_health = enemy_status.base_health * 10;
    this.health = this.max_health;
    
    // Boss-specific properties
    this.attackTimer = 0;
    this.attackInterval = 2000; // Attack every 2 seconds
    this.projectileSpeed = 0.3;
    this.projectileDamage = this.base_damage * 5;
    this.lastAttackTime = 0;

    // Visual effects
    this.pulseTimer = 0;
    this.auraColor = '#FF0000';
    this.auraRadius = 60;
};

// Set up prototype chain for inheritance
BossObject.prototype = Object.create(EnemyObject.prototype);
BossObject.prototype.constructor = BossObject;

// Override update method for boss-specific behavior
BossObject.prototype.update = function(dt) {
    // Update sprite animation (inherited from EnemyObject)
    this.animationTimer += dt;
    if (this.animationTimer > this.animationSpeed) {
        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        this.animationTimer = 0;
    }
    
    // Update pulse timer
    this.pulseTimer += dt;
    
    // Update attack timer
    this.attackTimer += dt;
    
    // Boss movement logic (chase player) - use inherited method
    this.moveTowardsPlayer(dt, this.speed);
    
    // Boss attack system
    if (this.attackTimer >= this.attackInterval) {
        this.attack();
        this.attackTimer = 0;
    }
    
    // Check if dead
    if (this.health <= 0) {
        this.alive = false;
        this.onDeath();
    }
};

BossObject.prototype.attack = function() {
    if (!player || !player.alive) return;
    
    // Create multiple projectiles in different directions
    var numProjectiles = 8;
    for (var i = 0; i < numProjectiles; i++) {
        var angle = (i / numProjectiles) * Math.PI * 2;
        
        // Create boss projectile
        var projectile = new EnemyProjectileObject(
            this.x, this.y, 
            angle,
            this.projectileSpeed,
            this.projectileDamage,
            8 // radius
        );
        
        enemy_projectiles_list.push(projectile);
    }
    
    // Visual attack effect
    createParticleExplosion(this.x, this.y, this.auraColor, 10);
};

BossObject.prototype.onDeath = function() {
    let s = new Audio(sound_configuration.defeated_boss_sound);
    s.play();
    // Dramatic death visual effect
    createParticleExplosion(this.x, this.y, "#FFD700", 50);
    
    // Multiple explosions in sequence
    for (var i = 0; i < 5; i++) {
        setTimeout(function() {
            var waveX = this.x + randomIntBetween(-100, 100);
            var waveY = this.y + randomIntBetween(-100, 100);
            createParticleExplosion(waveX, waveY, "#FFD700", 20);
        }.bind(this), i * 200);
    }
    
    // Give extra experience
    var expReward = 50;
    experience_orbs_list.push(new ExperienceOrbObject(xpSprite, this.x, this.y, expReward));
    
    // Mark boss as inactive
    bossActive = false;
    bossSpawnTimer = 0;
    
    console.log("BOSS DEFEATED! Reward: " + expReward + " XP");
};

// Override render method for boss-specific visuals
BossObject.prototype.render = function(ctx, camera) {
    if (!this.alive) return;
    
    var screenX = this.x - camera.x;
    var screenY = this.y - camera.y;
    
    // Pulsing aura effect
    ctx.save();
    var pulseScale = 1 + Math.sin(this.pulseTimer * 0.003) * 0.3;
    var auraRadius = this.auraRadius * pulseScale;
    
    // Draw aura
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = this.auraColor;
    ctx.beginPath();
    ctx.arc(screenX, screenY, auraRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw boss sprite with animation (same logic as EnemyObject)
    ctx.globalAlpha = 1.0;
    ctx.translate(-camera.x, -camera.y);
    // Turn sprite to face player (disabled for boss to prevent text mirroring)
    ctx.translate(this.x, this.y);
    // Boss always faces the same direction to keep text readable
    // if (player.x < this.x) {
    //     ctx.scale(-1, 1);
    // }

    // Calculate animation frame
    const frameX = (this.currentFrame % this.numColumns) * this.frameWidth;
    const frameY = Math.floor(this.currentFrame / this.numColumns) * this.frameHeight;
    const renderWidth = this.frameWidth * this.scale;
    const renderHeight = this.frameHeight * this.scale;

    // Draw the sprite
    ctx.drawImage(this.sprite, frameX, frameY, this.frameWidth, this.frameHeight, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
    ctx.restore(); // Restore transformation (translate/scale)
    
    // Boss health bar (drawn in screen coordinates, not affected by transformations)
    ctx.save();
    var barWidth = 100;
    var barHeight = 8;
    var barX = screenX - barWidth/2;
    var barY = screenY - renderHeight/2 - 20;
    
    // Health bar background
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Current health
    var healthPercentage = this.health / this.max_health;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
    
    // Health bar border
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    ctx.restore();
};
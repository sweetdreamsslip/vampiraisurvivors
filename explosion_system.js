/**
 * SISTEMA DE EXPLOSÕES
 * Responsável por: efeitos visuais, dano em área, partículas
 * 
 * Como usar:
 * - createParticleExplosion(x, y, color, count) - cria explosão de partículas
 * - createDeathExplosion(x, y) - cria explosão quando inimigo morre
 * - getExplosionDamage() - retorna dano de explosão atual
 * - getExplosionRadius() - retorna raio de explosão atual
 */

// Variáveis de explosões
var explosion_particles_list = [];

function createParticleExplosion(x, y, color, count) {
    for (var i = 0; i < count; i++) {
        var angle = Math.random() * 2 * Math.PI;
        var speed = (Math.random() * 0.2) + 0.05; // random speed
        var lifespan = randomIntBetween(400, 700); // random lifespan
        particles_list.push(new ParticleObject(x, y, color, speed, angle, lifespan));
    }
}

function createDeathExplosion(x, y) {
    // Explosão principal
    createParticleExplosion(x, y, "#FF4500", 25); // Laranja
    createParticleExplosion(x, y, "#FFD700", 15); // Dourado
    createParticleExplosion(x, y, "#FF0000", 10); // Vermelho
    
    // Dano de explosão aos inimigos próximos
    if(player.upgrades.explosion_damage > 0) {
        var explosionRadius = getExplosionRadius();
        var explosionDamage = getExplosionDamage();
        
        for(var i = 0; i < enemies_list.length; i++) {
            var enemy = enemies_list[i];
            var distance = Math.sqrt((enemy.x - x) * (enemy.x - x) + (enemy.y - y) * (enemy.y - y));
            
            if(distance <= explosionRadius) {
                enemy.take_damage(explosionDamage);
                // Efeito visual de dano por explosão
                createParticleExplosion(enemy.x, enemy.y, "#FF6600", 8);
            }
        }
    }
    
    // Explosão secundária com delay
    setTimeout(function() {
        createParticleExplosion(x + randomIntBetween(-20, 20), y + randomIntBetween(-20, 20), "#FFA500", 10);
    }, 100);
}

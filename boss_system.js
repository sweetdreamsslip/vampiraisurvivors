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

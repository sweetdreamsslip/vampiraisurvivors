/**
 * SISTEMA DE LEVEL UP
 * Responsável por: experiência, níveis, progressão do jogador
 * 
 * Como usar:
 * - initializePlayerLevel() - inicializa sistema de level no jogador
 * - checkLevelUp() - verifica se jogador subiu de nível
 * - renderLevelInfo(ctx) - renderiza informações de nível no HUD
 */

// Função para inicializar sistema de level no jogador
function initializePlayerLevel() {
    if (!player.experience_to_next_level) {
        player.experience_to_next_level = 100;
    }
    if (!player.upgrades) {
        player.upgrades = {
            piercing_shot: 0,
            double_shot: 0,
            damage_boost: 0,
            fire_rate: 0,
            projectile_speed: 0,
            explosion_damage: 0
        };
    }
}

// Função para verificar level up
function checkLevelUp() {
    // Verifica se o jogador subiu de nível
    while(player.experience >= player.experience_to_next_level) {
        player.experience -= player.experience_to_next_level;
        player.level++;
        player.experience_to_next_level = Math.floor(player.experience_to_next_level * 1.2); // Aumenta exponencialmente
        
        // Sempre mostra quiz primeiro, depois upgrade se acertar
        showQuizInterface();
    }
}

// Função para renderizar informações de nível no HUD
function renderLevelInfo(ctx) {
    // Informações básicas
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Vida: " + player.health + "/" + player_status.max_health, 20, 30);
    ctx.fillText("Nível: " + player.level, 20, 55);
    ctx.fillText("Experiência: " + player.experience + "/" + player.experience_to_next_level, 20, 80);
    ctx.fillText("Projéteis: " + projectiles_list.length, 20, 105);
    
    // Mostra upgrades ativos
    ctx.fillStyle = "yellow";
    ctx.font = "16px Arial";
    var yOffset = 130;
    for(var upgradeType in player.upgrades) {
        if(player.upgrades[upgradeType] > 0) {
            var upgradeText = upgrade_types[upgradeType].name + ": " + player.upgrades[upgradeType];
            if(upgradeType === "explosion_damage" && player.upgrades[upgradeType] > 0) {
                upgradeText += " (Dano: " + getExplosionDamage() + ", Raio: " + getExplosionRadius() + ")";
            }
            ctx.fillText(upgradeText, 20, yOffset);
            yOffset += 20;
        }
    }
}

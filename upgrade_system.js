/**
 * SISTEMA DE UPGRADES
 * Responsável por: gerenciar upgrades do jogador, interface de seleção, aplicação de melhorias
 * 
 * Como usar:
 * - showUpgradeInterface() - mostra interface de seleção
 * - applyUpgrade(upgradeType) - aplica upgrade específico
 * - getPlayerDamage() - retorna dano atual do jogador
 * - getProjectileSpeed() - retorna velocidade atual dos projéteis
 * - getFireRate() - retorna taxa de tiro atual
 * - isPiercingShot() - verifica se tiro perfurante está ativo
 * - isDoubleShot() - verifica se tiro duplo está ativo
 * - getExplosionDamage() - retorna dano de explosão atual
 * - getExplosionRadius() - retorna raio de explosão atual
 */

// Variáveis do sistema de upgrade
var upgrade_interface_visible = false;
var available_upgrades = [];

// Funções para calcular stats baseados nos upgrades
function getPlayerDamage() {
    return player_status.damage + (player.upgrades.damage_boost * 5);
}

function getProjectileSpeed() {
    return player_status.projectile_speed + (player.upgrades.projectile_speed * 0.2);
}

function getFireRate() {
    return Math.max(10, player_status.time_between_projectiles - (player.upgrades.fire_rate * 15));
}

function isPiercingShot() {
    return player.upgrades.piercing_shot > 0;
}

function isDoubleShot() {
    return player.upgrades.double_shot > 0;
}

function getExplosionDamage() {
    return player.upgrades.explosion_damage * 15; // 15 de dano por nível
}

function getExplosionRadius() {
    return 80 + (player.upgrades.explosion_damage * 20); // 80 + 20 por nível
}

// Função para mostrar interface de upgrade
function showUpgradeInterface() {
    upgrade_interface_visible = true;
    generateAvailableUpgrades();
}

// Função para gerar upgrades disponíveis
function generateAvailableUpgrades() {
    available_upgrades = [];
    
    for(var upgradeType in upgrade_types) {
        var upgrade = upgrade_types[upgradeType];
        if(player.upgrades[upgradeType] < upgrade.max_level) {
            available_upgrades.push(upgradeType);
        }
    }
    
    // Se não há upgrades disponíveis, não mostra a interface
    if(available_upgrades.length === 0) {
        upgrade_interface_visible = false;
        return;
    }
    
    // Limita a 3 opções aleatórias
    if(available_upgrades.length > 3) {
        var shuffled = available_upgrades.sort(() => 0.5 - Math.random());
        available_upgrades = shuffled.slice(0, 3);
    }
}

// Função para aplicar upgrade
function applyUpgrade(upgradeType) {
    if(player.upgrades[upgradeType] < upgrade_types[upgradeType].max_level) {
        player.upgrades[upgradeType]++;
        upgrade_interface_visible = false;
    }
}

// Função para renderizar interface de upgrade
function renderUpgradeInterface(ctx) {
    // Fundo semi-transparente
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Título
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ESCOLHA SEU UPGRADE", WIDTH / 2, 100);
    
    // Opções de upgrade
    var startX = WIDTH / 2 - 200;
    var startY = 200;
    var cardWidth = 120;
    var cardHeight = 150;
    var spacing = 20;
    
    for(var i = 0; i < available_upgrades.length; i++) {
        var upgradeType = available_upgrades[i];
        var upgrade = upgrade_types[upgradeType];
        var x = startX + i * (cardWidth + spacing);
        var y = startY;
        
        // Card background
        ctx.fillStyle = "rgba(50, 50, 50, 0.9)";
        ctx.fillRect(x, y, cardWidth, cardHeight);
        
        // Card border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cardWidth, cardHeight);
        
        // Upgrade name
        ctx.fillStyle = "yellow";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(upgrade.name, x + cardWidth/2, y + 30);
        
        // Current level
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText("Nível: " + player.upgrades[upgradeType] + "/" + upgrade.max_level, x + cardWidth/2, y + 50);
        
        // Description
        ctx.fillStyle = "lightgray";
        ctx.font = "12px Arial";
        var words = upgrade.description.split(' ');
        var line = '';
        var lineY = y + 70;
        for(var j = 0; j < words.length; j++) {
            var testLine = line + words[j] + ' ';
            var metrics = ctx.measureText(testLine);
            if(metrics.width > cardWidth - 10 && j > 0) {
                ctx.fillText(line, x + cardWidth/2, lineY);
                line = words[j] + ' ';
                lineY += 15;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x + cardWidth/2, lineY);
        
        // Key number
        ctx.fillStyle = "lime";
        ctx.font = "20px Arial";
        ctx.fillText((i + 1).toString(), x + cardWidth/2, y + cardHeight - 10);
    }
    
    // Instructions
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Pressione 1, 2 ou 3 para escolher", WIDTH / 2, HEIGHT - 50);
    
    ctx.textAlign = "left";
}

// Função para verificar se interface está visível
function isUpgradeInterfaceVisible() {
    return upgrade_interface_visible;
}

/**
 * SISTEMA DE RENDERIZAÇÃO
 * Responsável por: desenhar tudo na tela, interfaces, HUD
 * 
 * Como usar:
 * - render() - função principal de renderização
 * - renderHUD(ctx) - renderiza HUD do jogo
 * - renderInterfaces(ctx) - renderiza interfaces de upgrade/quiz
 */

// Função principal de renderização
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Renderizar objetos do jogo
    enemies_list.forEach(function(enemy) {
        enemy.render(ctx);
    });
    
    player.render(ctx);
    
    projectiles_list.forEach(function(projectile) {
        projectile.render(ctx);
    });
    
    // Renderizar HUD
    renderHUD(ctx);
    
    // Renderizar interfaces
    renderInterfaces(ctx);
}

// Função para renderizar HUD
function renderHUD(ctx) {
    // Informações de nível (se sistema de level estiver ativo)
    if (typeof renderLevelInfo === 'function') {
        renderLevelInfo(ctx);
    } else {
        // HUD básico
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Vida: " + player.health, 20, 30);
        ctx.fillText("Projéteis: " + projectiles_list.length, 20, 55);
    }
}

// Função para renderizar interfaces
function renderInterfaces(ctx) {
    // Interface de upgrade
    if (typeof isUpgradeInterfaceVisible === 'function' && isUpgradeInterfaceVisible()) {
        renderUpgradeInterface(ctx);
    }
    
    // Interface de quiz
    if (typeof isQuizInterfaceVisible === 'function' && isQuizInterfaceVisible()) {
        renderQuizInterface(ctx);
    }
}

/**
 * SISTEMA DE GAME LOOP
 * Responsável por: loop principal do jogo, update, inicialização
 * 
 * Como usar:
 * - initialize() - inicializa o jogo
 * - update(dt) - atualiza lógica do jogo
 * - run() - loop principal
 */

// Função de inicialização
function initialize() {
    // Inicializar sistemas
    if (typeof initializePlayerLevel === 'function') {
        initializePlayerLevel();
    }
    
    if (typeof setupInputListeners === 'function') {
        setupInputListeners();
    }
    
    // Inicializar inimigos
    for(var i = 0; i < 10; i++){
        enemies_list.push(new enemy(randomIntBetween(0, WIDTH), randomIntBetween(0, HEIGHT), 100, 100, 20, "blue"));
    }
    
    // Inicializar tempo
    lastUpdateTime = performance.now();
    run();
}

// Função de update principal
function update(dt) {
    // Pausa o jogo se interfaces estiverem visíveis
    var isPaused = false;
    if (typeof isUpgradeInterfaceVisible === 'function' && isUpgradeInterfaceVisible()) {
        isPaused = true;
    }
    if (typeof isQuizInterfaceVisible === 'function' && isQuizInterfaceVisible()) {
        isPaused = true;
    }
    
    if (isPaused) {
        return;
    }
    
    // Atualizar ângulo de mira
    angle_between_player_and_mouse = angleBetweenPoints(player.x, player.y, mouse.x, mouse.y);
    player.update(dt);

    // Sistema de disparo
    time_since_last_projectile += dt;
    if (mouse.mouseDown && time_since_last_projectile >= player_status.time_between_projectiles) {
        projectiles_list.push(new projectile(player.x, player.y, angle_between_player_and_mouse));
        time_since_last_projectile = 0;
    }
    
    // Atualizar projéteis
    projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });

    // Colisão jogador-inimigo
    for(var i = 0; i < enemies_list.length; i++){
        if(aabbCircleCollision(player, enemies_list[i])){
            player.take_damage(enemies_list[i].base_damage);
        }
    }

    // Colisão projétil-inimigo
    for(var i = 0; i < projectiles_list.length; i++){
        for(var j = 0; j < enemies_list.length; j++){
            if(aabbCircleCollision(projectiles_list[i], enemies_list[j])){
                projectiles_list[i].exists = false;	
                enemies_list[j].take_damage(player_status.damage);
                if(enemies_list[j].health <= 0){
                    enemies_list[j].respawn();
                }
            }
        }
    }

    // Atualizar inimigos
    enemies_list.forEach(function(enemy) {
        enemy.update(dt);
    });

    // Remover projéteis que não existem mais
    projectiles_list = projectiles_list.filter(function(projectile) {
        return projectile.exists;
    });
}

// Loop principal do jogo
function run() {
    var now = performance.now();
    var dt = (now - lastUpdateTime);
    lastUpdateTime = now;
    update(dt);
    render();
    requestAnimationFrame(run);
}

// Sistema de Inimigos - Configuração e Spawn
// Desenvolvido para trabalho em equipe

// Configurações de spawn para cada tipo de inimigo
var enemySpawnConfig = {
    normal: {
        spawn_interval: 2000, // 2 segundos
        spawn_chance: 0.7, // 70% de chance
        max_count: 8
    },
    fast: {
        spawn_interval: 3000, // 3 segundos
        spawn_chance: 0.3, // 30% de chance
        max_count: 4
    },
    shooting: {
        spawn_interval: 5000, // 5 segundos
        spawn_chance: 0.2, // 20% de chance
        max_count: 3
    },
    tank: {
        spawn_interval: 8000, // 8 segundos
        spawn_chance: 0.1, // 10% de chance
        max_count: 2
    },
    flying: {
        spawn_interval: 4000, // 4 segundos
        spawn_chance: 0.25, // 25% de chance
        max_count: 3
    }
};

// Timers para cada tipo de inimigo
var enemySpawnTimers = {
    normal: 0,
    fast: 0,
    shooting: 0,
    tank: 0,
    flying: 0
};

// Contadores de inimigos ativos por tipo
var activeEnemyCounts = {
    normal: 0,
    fast: 0,
    shooting: 0,
    tank: 0,
    flying: 0
};

// Função para contar inimigos ativos por tipo
function updateEnemyCounts() {
    activeEnemyCounts = {
        normal: 0,
        fast: 0,
        shooting: 0,
        tank: 0,
        flying: 0
    };
    
    enemies_list.forEach(function(enemy) {
        if (enemy.alive && enemy.enemyType) {
            activeEnemyCounts[enemy.enemyType]++;
        } else if (enemy.alive && !enemy.enemyType) {
            // Inimigo normal (sem tipo definido)
            activeEnemyCounts.normal++;
        }
    });
}

// Função para spawnar inimigo baseado no tipo
function spawnEnemyByType(type) {
    switch(type) {
        case 'normal':
            spawnEnemy();
            break;
        case 'fast':
            spawnFastEnemy();
            break;
        case 'shooting':
            spawnShootingEnemy();
            break;
        case 'tank':
            spawnTankEnemy();
            break;
        case 'flying':
            spawnFlyingEnemy();
            break;
    }
}

// Função principal de spawn de inimigos
function updateEnemySpawning(dt) {
    if (!game_running || !player) return;
    
    // Atualizar contadores
    updateEnemyCounts();
    
    // Atualizar timers e tentar spawnar cada tipo
    Object.keys(enemySpawnConfig).forEach(function(type) {
        var config = enemySpawnConfig[type];
        var timer = enemySpawnTimers[type];
        var count = activeEnemyCounts[type];
        
        // Atualizar timer
        enemySpawnTimers[type] += dt;
        
        // Verificar se pode spawnar
        if (timer >= config.spawn_interval && 
            count < config.max_count && 
            Math.random() < config.spawn_chance) {
            
            spawnEnemyByType(type);
            enemySpawnTimers[type] = 0;
        }
    });
}

// Função para ajustar dificuldade dos inimigos
function adjustEnemyDifficulty() {
    var difficulty = current_difficulty || 'normal';
    var multiplier = difficulty_modes[difficulty]?.enemy_spawn_multiplier || 1;
    
    // Ajustar intervalos de spawn baseado na dificuldade
    Object.keys(enemySpawnConfig).forEach(function(type) {
        var originalInterval = enemySpawnConfig[type].spawn_interval;
        enemySpawnConfig[type].spawn_interval = originalInterval / multiplier;
        
        // Ajustar chances de spawn
        if (difficulty === 'hard') {
            enemySpawnConfig[type].spawn_chance *= 1.2;
            enemySpawnConfig[type].max_count = Math.ceil(enemySpawnConfig[type].max_count * 1.5);
        } else if (difficulty === 'easy') {
            enemySpawnConfig[type].spawn_chance *= 0.8;
            enemySpawnConfig[type].max_count = Math.ceil(enemySpawnConfig[type].max_count * 0.7);
        }
    });
}

// Função para resetar sistema de inimigos
function resetEnemySystem() {
    enemySpawnTimers = {
        normal: 0,
        fast: 0,
        shooting: 0,
        tank: 0,
        flying: 0
    };
    
    activeEnemyCounts = {
        normal: 0,
        fast: 0,
        shooting: 0,
        tank: 0,
        flying: 0
    };
}

// Função para obter estatísticas de inimigos
function getEnemyStats() {
    return {
        total: enemies_list.filter(e => e.alive).length,
        byType: activeEnemyCounts,
        config: enemySpawnConfig
    };
}

console.log('Sistema de Inimigos carregado!');

// Sistema de Dificuldade Balanceado para Crianças e Adultos
var difficulty_modes = {
    "easy": {
        name: "Fácil",
        description: "Perfeito para crianças e iniciantes",
        player_multiplier: 1.3, // Jogador 30% mais forte
        enemy_multiplier: 0.7,  // Inimigos 30% mais fracos
        experience_multiplier: 1.5, // 50% mais experiência
        spawn_rate_multiplier: 0.8, // Spawn 20% mais lento
        color: "#4CAF50" // Verde
    },
    "normal": {
        name: "Normal", 
        description: "Equilibrado para jogadores médios",
        player_multiplier: 1.0, // Valores base
        enemy_multiplier: 1.0,
        experience_multiplier: 1.0,
        spawn_rate_multiplier: 1.0,
        color: "#FF9800" // Laranja
    },
    "hard": {
        name: "Difícil",
        description: "Desafio para jogadores experientes", 
        player_multiplier: 0.8, // Jogador 20% mais fraco
        enemy_multiplier: 1.4,  // Inimigos 40% mais fortes
        experience_multiplier: 0.8, // 20% menos experiência
        spawn_rate_multiplier: 1.3, // Spawn 30% mais rápido
        color: "#F44336" // Vermelho
    }
};

var player_status_configurations = {
    "easy": {
        speed: 0.5, // Mais rápido para facilitar movimento
        max_health: 120, // Mais vida
        projectile_speed: 0.7, // Projéteis mais rápidos
        time_between_projectiles: 300, // Disparo muito mais lento
        damage: 12, // Mais dano
        invincibility_time: 1500, // Mais tempo de invencibilidade
        magnet_max_distance: 250, // Maior alcance de magnet
    },
    "normal": {
        speed: 0.4, // Velocidade equilibrada
        max_health: 100, // Vida padrão
        projectile_speed: 0.6, // Velocidade padrão
        time_between_projectiles: 250, // Disparo mais lento
        damage: 10, // Dano padrão
        invincibility_time: 1000, // Tempo padrão
        magnet_max_distance: 200, // Alcance padrão
    },
    "hard": {
        speed: 0.35, // Mais lento para aumentar desafio
        max_health: 80, // Menos vida
        projectile_speed: 0.5, // Projéteis mais lentos
        time_between_projectiles: 180, // Disparo mais lento
        damage: 8, // Menos dano
        invincibility_time: 800, // Menos tempo de invencibilidade
        magnet_max_distance: 150, // Menor alcance
    },
    "debug": {
        speed: 1,
        max_health: 100,
        projectile_speed: 1,
        time_between_projectiles: 5,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 100,
    }
}


var enemy_spawn_configurations = {
    "easy": {
        time_between_enemy_spawn: 1000, // Spawn mais lento
        base_health: 20, // Inimigos mais fracos
        base_damage: 6,
        base_speed: 0.06,
    },
    "normal": {
        time_between_enemy_spawn: 800, // Spawn equilibrado
        base_health: 30,
        base_damage: 10,
        base_speed: 0.08,
    },
    "hard": {
        time_between_enemy_spawn: 600, // Spawn mais rápido
        base_health: 40, // Inimigos mais fortes
        base_damage: 14,
        base_speed: 0.10,
    },
    "debug": {
        time_between_enemy_spawn: 100,
        base_health: 30,
        base_damage: 10,
        base_speed: 0.08,
    }
}

// Sistema de dificuldade adaptativa
var current_difficulty = "normal"; // Padrão: Normal
var selected_enemy_spawn_configuration = current_difficulty;
var selected_player_status_configuration = current_difficulty;

// Função para mudar dificuldade
function setDifficulty(difficulty) {
    current_difficulty = difficulty;
    selected_enemy_spawn_configuration = difficulty;
    selected_player_status_configuration = difficulty;
    
    // Aplicar configurações se a função de atualização existir
    if (typeof updateDifficultySettings !== 'undefined') {
        updateDifficultySettings();
    }
    
    console.log(`Dificuldade alterada para: ${difficulty_modes[difficulty].name}`);
}
var player_status_configurations = {
    "default": {
        speed: 0.4, // Velocidade inicial boa
        max_health: 100, // Vida inicial adequada
        projectile_speed: 0.6, // Projéteis com velocidade boa
        time_between_projectiles: 150, // Disparo razoável
        damage: 10, // Dano inicial adequado
        invincibility_time: 1000, // Tempo de invencibilidade bom
        magnet_max_distance: 200, // Alcance de magnet adequado
    },
    "debug": {
        speed: 1,
        max_health: 100,
        projectile_speed: 1,
        time_between_projectiles: 5,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 100,
    },
    "custom": {
        speed: 0.4,
        max_health: 90,
        projectile_speed: 0.6,
        time_between_projectiles: 150,
        damage: 9,
        invincibility_time: 900,
        magnet_max_distance: 120,
    }
}


var enemy_spawn_configurations = {
    "default": {
        time_between_enemy_spawn: 800, // Inimigos aparecem mais devagar no início
    },
    "debug": {
        time_between_enemy_spawn: 100,
    }
}

var selected_enemy_spawn_configuration = "default";
var selected_player_status_configuration = "default";
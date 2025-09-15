var player_status_configurations = {
    "default": {
        speed: 0.4,
        max_health: 100,
        projectile_speed: 0.7,
        time_between_projectiles: 100,
        time_between_gun_drone_projectiles: 500,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 200,
    },
    "debug": {
        speed: 1,
        max_health: 100,
        projectile_speed: 1,
        time_between_projectiles: 5,
        time_between_gun_drone_projectiles: 5,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 100,
    },
    "custom": {
        speed: 0.5,
        max_health: 100,
        projectile_speed: 1,
        time_between_projectiles: 100,
        time_between_gun_drone_projectiles: 100,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 100,
    }
}


var enemy_spawn_configurations = {
    "default": {
        time_between_enemy_spawn: 500,
    },
    "debug": {
        time_between_enemy_spawn: 100,
    }
}

var selected_enemy_spawn_configuration = "default";
var selected_player_status_configuration = "default";
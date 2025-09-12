var player_status_configurations = {
    "default": {
        speed: 0.4,
        max_health: 100,
        projectile_speed: 0.7,
        time_between_projectiles: 100,
        damage: 10,
        invincibility_time: 1000,
    },
    "debug": {
        speed: 1,
        max_health: 100,
        projectile_speed: 1,
        time_between_projectiles: 5,
        damage: 10,
        invincibility_time: 1000,
    },
    "custom": {
        speed: 0.5,
        max_health: 100,
        projectile_speed: 1,
        time_between_projectiles: 100,
        damage: 10,
        invincibility_time: 1000,
    }
}

var selected_player_status_configuration = "default";
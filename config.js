var player_status_configurations = {
    "default": {
        speed: 0.4,
        max_health: 100,
        projectile_speed: 0.7,
        time_between_projectiles: 800,
        time_between_gun_drone_projectiles: 2000,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 200,
        piercing_strength: 0,
        freezing_effect: 0,
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
        piercing_strength: 0,
        freezing_effect: 0,
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
        piercing_strength: 0,
        freezing_effect: 0,
    }
}


var enemy_spawn_configurations = {
    "default": {
        time_between_enemy_spawn: 800,
        initial_amount_of_enemies: 1,
    },
    "debug": {
        time_between_enemy_spawn: 100,
        initial_amount_of_enemies: 1,
    }
}


var enemy_status_configurations = {
    "default": {
        base_speed: 0.1,
        base_damage: 25,
        base_health: 35,
        base_health_multiplier: 1,
        base_damage_multiplier: 1,
        base_speed_multiplier: 1,
    },
}

var experience_configurations = {
    "default": {
        base_orb_value: 5,
        base_orb_value_multiplier: 10,
    },
}

var quiz_difficulty = "normal"


var selected_enemy_spawn_configuration = "default";
var selected_player_status_configuration = "default";
var selected_enemy_status_configuration = "default";
var selected_experience_configuration = "default";
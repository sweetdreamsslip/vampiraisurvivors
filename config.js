var player_status_configurations = {
    "default": {
        speed: 0.4,
        max_health: 100,
        projectile_speed: 0.7,
        time_between_projectiles: 1000, // 60 projéteis por minuto
        time_between_gun_drone_projectiles: 1000, // 60 projéteis por minuto
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 200,
        piercing_strength: 0,
        gun_drone_piercing_strength: 5,
        freezing_effect: 0,
        has_boomerang_shot: false,
        boomerang_max_distance: 500,
    },
    "debug": {
        speed: 0.4,
        max_health: 300,
        projectile_speed: 0.7,
        time_between_projectiles: 1000, // 60 projéteis por minuto
        time_between_gun_drone_projectiles: 1000, // 60 projéteis por minuto
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 200,
        piercing_strength: 0,
        gun_drone_piercing_strength: 5,
        freezing_effect: 0,
        has_boomerang_shot: false,
        boomerang_max_distance: 750,
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
        gun_drone_piercing_strength: 5,
        freezing_effect: 0,
        has_boomerang_shot: false,
        boomerang_max_distance: 300,
    },
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

var sound_configurations = {
    "default": {
        shoot_sound: "sounds/lapis_scratch.mp3",
        dog_shoot_sound: "sounds/dog_bark1.mp3",
        background_music: "sounds/sparkmandrill.mp3",
        defeated_boss_sound: "sounds/Jogo-Morte do Boss.mp3",
        enemy_death_sound: "sounds/Som_Jogo Livro.mp3",
    },
    "debug": {
        shoot_sound: "sounds/lapis_scratch.mp3",
        dog_shoot_sound: "sounds/dog_bark1.mp3",
        background_music: "sounds/guitarra.mp3",
        defeated_boss_sound: "sounds/Jogo-Morte do Boss.mp3",
        enemy_death_sound: "sounds/Som_Jogo Livro.mp3",
    },
}

var texture_configurations = {
    "default": {
        playerSprite: "images/estudante.png",
        projectileSprite: "images/lapis2.png",
        enemySprite: "images/ptbrremaster.png",
        playerShootingSprite: "images/estudanteatirando.png",
        playerShootingAndMovingSprite: "images/atirandoecorrendo.png",
        xpSprite: "images/xp.png",
        heartSprite: "images/heart.png",
        backgroundSprite: "images/bg.png",
        gunDroneSprite: "images/Dogpet.png",
        gunDroneProjectileSprite: "images/petprojectile.png",
        tankSprite: "images/tank.png",
        clockSprite: "images/clock.png",
        bossSprite: "images/bossmath.png",
        flyingEnemySprite: "images/flyingenemy.png",
        dashEnemySprite: "images/dashenemy.png",
    },
}


var selected_player_status_configuration = "debug";
var selected_enemy_spawn_configuration = "default";
var selected_enemy_status_configuration = "default";
var selected_experience_configuration = "default";
var selected_sound_configuration = "default";
var selected_texture_configuration = "default";
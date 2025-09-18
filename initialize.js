function initialize() {
    //initialize player
    player = PlayerObject(playerSprite, playerShootingSprite, playerShootingAndMovingSprite);
    //initialize gun drones
    for(var i = 0; i < 1; i++){
        gun_drones_list.push(new GunDroneObject(player.x + 60, player.y, 60));
    }

    //enemies_list.push(new BossObject(bossSprite, WIDTH / 2, HEIGHT / 2, 100));
    //console.log(enemies_list[0]);
    //initialize experience orbs
    /*
    for(var i = 0; i < 160; i++){
        experience_orbs_list.push(new ExperienceOrbObject(randomIntBetween(0, WIDTH), randomIntBetween(0, HEIGHT), 5, "orange", randomIntBetween(1, 10)));
    }
    */
    //initialize last update time
    lastUpdateTime = performance.now();
    run();
}
var SpawnerObject = function(){

    this.bossSpawnTimer = 55000;
    this.BOSS_SPAWN_INTERVAL = 60000; // 20 segundos
    this.bossActive = false;

    this.enemy_classes = [NormalBook, FastBook, DashEnemy, FlyingEnemy, TankEnemy];
    this.time_since_last_spawn = 0;
    this.time_between_spawns = enemy_spawn.time_between_enemy_spawn;

    this.update = function(dt){
        this.time_since_last_spawn += dt;
        //this.bossSpawnTimer += dt;
        if(this.bossSpawnTimer >= this.BOSS_SPAWN_INTERVAL){
            this.bossActive = true;
            this.bossSpawnTimer = 0;
            this.spawnBoss();
        }
        if(this.time_since_last_spawn >= this.time_between_spawns){
            this.time_since_last_spawn = 0;
            this.spawn();
        }
    },

    this.spawn = function(){
        // List of enemy classes to spawn
        // Arguments for enemy constructors
        var args = [randomIntBetween(0, scenario.width), randomIntBetween(0, scenario.height)];
        // Pick a random enemy class and spawn it
        var random_enemy = randomIntBetween(0, this.enemy_classes.length - 1);
        enemies_list.push(
            new this.enemy_classes[random_enemy](...args)
        );
    },

    this.spawnBoss = function(){
        enemies_list.push(new BossObject(bossSprite, randomIntBetween(0, scenario.width), randomIntBetween(0, scenario.height), 100));
    }
}
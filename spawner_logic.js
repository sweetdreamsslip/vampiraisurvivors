var SpawnerObject = function(){

    this.bossSpawnTimer = 0;
    this.BOSS_SPAWN_INTERVAL = 60_000; // 60 segundos
    this.bossActive = false;
    this.bossWarningShown = false;

    // Now an array of objects: {class: EnemyClass, weight: number}
    this.enemy_classes = [
        { class: NormalBook, weight: 5 },
        { class: FastBook, weight: 2 },
        { class: DashEnemy, weight: 1 },
        { class: FlyingEnemy, weight: 1 },
        { class: TankEnemy, weight: 1 }
    ];
    this.time_since_last_spawn = 0;
    this.time_between_spawns = enemy_spawn.time_between_enemy_spawn;

    // Helper: pick a random enemy class based on weights
    this.pickWeightedEnemyClass = function() {
        var totalWeight = 0;
        for (var i = 0; i < this.enemy_classes.length; i++) {
            totalWeight += this.enemy_classes[i].weight;
        }
        var rnd = Math.random() * totalWeight;
        var acc = 0;
        for (var i = 0; i < this.enemy_classes.length; i++) {
            acc += this.enemy_classes[i].weight;
            if (rnd < acc) {
                return this.enemy_classes[i].class;
            }
        }
        // Fallback
        return this.enemy_classes[0].class;
    };

    this.update = function(dt){
        this.time_since_last_spawn += dt;
        this.bossSpawnTimer += dt;

        // Show boss warning 3 seconds before boss spawns
        if (!this.bossWarningShown && this.bossSpawnTimer >= this.BOSS_SPAWN_INTERVAL - 3000) {
            this.bossWarningShown = true;
            if (typeof showBossWarning === "function") {
                showBossWarning();
            }
        }
        if (this.bossSpawnTimer < this.BOSS_SPAWN_INTERVAL - 3000) {
            this.bossWarningShown = false;
        }
        
        // boss spawn logic
        if(this.bossSpawnTimer >= this.BOSS_SPAWN_INTERVAL){
            this.bossActive = true;
            this.bossSpawnTimer = 0;
            this.spawnBoss();
        }

        // enemy spawn logic
        if(this.time_since_last_spawn >= this.time_between_spawns){
            this.time_since_last_spawn = 0;
            this.spawn();
        }
    },

    this.spawn = function(){
        // Arguments for enemy constructors
        var args = [randomIntBetween(0, scenario.width), randomIntBetween(0, scenario.height)];
        // Pick a random enemy class based on weights and spawn it
        var EnemyClass = this.pickWeightedEnemyClass();
        enemies_list.push(
            new EnemyClass(...args)
        );
    },

    this.spawnBoss = function(){
        enemies_list.push(new BossObject(bossSprite, randomIntBetween(0, scenario.width), randomIntBetween(0, scenario.height), 100));
    }
}
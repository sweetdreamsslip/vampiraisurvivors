var SpawnerObject = function(){

    this.time_since_last_spawn = 0;
    this.time_between_spawns = enemy_spawn.time_between_enemy_spawn;
    this.bossSpawnTimer = 45_000;
    this.BOSS_SPAWN_INTERVAL = 60_000; // ms
    this.bossActive = false;
    this.warningActive = false;
    this.warningTimer = 0;
    this.warningDuration = 3_000; // ms

    // Weighted enemy spawning configuration
    this.enemy_classes = [
        { class: NormalBook, weight: 5 },
        { class: FastBook, weight: 2 },
        { class: DashEnemy, weight: 1 },
        { class: FlyingEnemy, weight: 1 },
        { class: TankEnemy, weight: 1 }
    ];

    // Helper function to pick a random enemy class based on weights
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
        // Fallback to normal book if no other enemy class is picked
        return this.enemy_classes[0].class;
    };

    this.update = function(dt){
        this.time_since_last_spawn += dt;
        this.bossSpawnTimer += dt;

        // starts warning and updates warning timer when the boss is about to spawn
        if(this.bossSpawnTimer >= this.BOSS_SPAWN_INTERVAL - this.warningDuration){
            this.warningActive = true;
            this.warningTimer += dt;
            if(this.warningTimer >= this.warningDuration){
                this.warningActive = false;
                this.warningTimer = 0;
            }
        }
        
        // boss spawn logic - spawns the boss and resets the boss spawn timer
        if(this.bossSpawnTimer >= this.BOSS_SPAWN_INTERVAL){
            this.bossActive = true;
            this.bossSpawnTimer = 0;
            this.spawnBoss();
            this.warningActive = false;
        }

        // enemy spawn logic - spawns an enemy and resets the enemy spawn timer
        if(this.time_since_last_spawn >= this.time_between_spawns){
            this.time_since_last_spawn = 0;
            this.spawnEnemy();
        }
    },

    this.spawnEnemy = function(){
        // Arguments for enemy constructors
        var args = [randomIntBetween(0, scenario.width), randomIntBetween(0, scenario.height)];
        // Pick a random enemy class based on weights and spawn it
        var EnemyClass = this.pickWeightedEnemyClass();
        enemies_list.push(
            new EnemyClass(...args)
        );
    },

    this.spawnBoss = function(){
        enemies_list.push(new BossObject(bossSprite, randomIntBetween(0, scenario.width), randomIntBetween(0, scenario.height)));
    }


    this.showBossWarning = function(ctx) {
        if (!this.warningActive) return;

        ctx.save();
        ctx.fillStyle = '#FF0000';
        ctx.globalAlpha = Math.min(this.waveFunction(this.warningTimer/1000), 0.7);
        ctx.fillRect(0, 0, WIDTH, HEIGHT/6);
        ctx.globalAlpha = 1.0;
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("Hora da prova!", WIDTH / 2, (HEIGHT / 6) / 2 + 15);
        ctx.restore();
    }
    
    this.waveFunction = function(x){
        return (Math.sin(2*Math.PI*x + 4.71238898038469) + 1) / 2;
    }
}
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lastUpdateTime;

var WIDTH = window.innerWidth-20;
var HEIGHT = window.innerHeight-20;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// fetch player status configuration
var player_status = Object.assign({}, player_status_configurations[selected_player_status_configuration]);
var enemy_spawn = Object.assign({}, enemy_spawn_configurations[selected_enemy_spawn_configuration]);

// global variables
var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;
var time_since_last_enemy_spawn = 0;
var gamePaused = false;
var gameStarted = false;
var experienceMultiplier = 1; // Para o upgrade de experiência duplicada

// game objects
var player;
var enemies_list = [];
var projectiles_list = [];
var particles_list = [];
var experience_orbs_list = [];
var damage_zones_list = []; // Zonas de dano

// sprites
var playerSprite = new Image();
var projectileSprite = new Image();
var enemySprite = new Image();

// controller support
var is_gamepad_connected = false;

// control variables
var mouse = {
    x: 0,
    y: 0,
    mouseDown: false,
};
var keys_down = [];


function createParticleExplosion(x, y, color, count) {
    for (var i = 0; i < count; i++) {
        var angle = Math.random() * 2 * Math.PI;
        var speed = (Math.random() * 0.2) + 0.05; // random speed
        var lifespan = randomIntBetween(400, 700); // random lifespan
        particles_list.push(new ParticleObject(x, y, color, speed, angle, lifespan));
    }
}


// event listeners
canvas.addEventListener("mousemove", function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mousedown", function(e) {
    mouse.mouseDown = true;
});
canvas.addEventListener("mouseup", function(e) {
    mouse.mouseDown = false;
});
window.addEventListener("keydown", function(e) {
    keys_down.push(e.key);
    
    // Controles especiais
    if (e.key === ' ' || e.key === 'Escape') { // Espaço ou ESC para pausar
        if (gameStarted) {
            togglePause();
        }
    }
    if (e.key === 'Enter' && !gameStarted) { // Enter para iniciar
        startGame();
    }
});
window.addEventListener("keyup", function(e) {
    keys_down = keys_down.filter(function(key) {
        return key !== e.key;
    });
});
// gamepad connection
window.addEventListener("gamepadconnected", function(e) {
    console.log("Controle conectado no índice %d: %s.", e.gamepad.index, e.gamepad.id);
    is_gamepad_connected = true;
});
window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Controle desconectado do índice %d: %s", e.gamepad.index, e.gamepad.id);
    is_gamepad_connected = false;
});



// update function
function update(dt) {
    if (!gameStarted || gamePaused) return;
    
    time_since_last_projectile += dt;
    time_since_last_enemy_spawn += dt;
    const gamepadState = pollGamepad();

    // Define o ângulo de mira: prioriza o controle, senão usa o mouse
    if (gamepadState.aimAngle !== null) {
        angle_between_player_and_mouse = gamepadState.aimAngle;
    } else {
        angle_between_player_and_mouse = angleBetweenPoints(player.x, player.y, mouse.x, mouse.y);
    }
    player.update(dt, gamepadState.moveVector);

    //projectile firing
    time_since_last_projectile += dt;
    if ((mouse.mouseDown || gamepadState.isShooting) && time_since_last_projectile >= player_status.time_between_projectiles) {
        player.attack(angle_between_player_and_mouse);
        time_since_last_projectile = 0;
    }
    
    //projectile updating
    projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });

    //player collision
    for(var i = 0; i < enemies_list.length; i++){
        if(aabbCircleCollision(player, enemies_list[i])){
            var damage = enemies_list[i].base_damage;
            // Aplicar redução de dano se tiver o upgrade
            if (player.damage_reduction > 0) {
                damage = Math.max(1, damage - player.damage_reduction);
            }
            player.take_damage(damage);
        }
    }

    //projectile collision
    for(var i = 0; i < projectiles_list.length; i++){
        for(var j = 0; j < enemies_list.length; j++){
            if(aabbCircleCollision(projectiles_list[i], enemies_list[j])){
                createParticleExplosion(enemies_list[j].x, enemies_list[j].y, "#8A2BE2", randomIntBetween(10, 20)); // Cor roxa para explosão do livro
                
                // Tiro perfurante - não remove o projétil
                if (!player.piercing_shot) {
                    projectiles_list[i].exists = false;
                }
                
                enemies_list[j].take_damage(player_status.damage);
            }
        }
    }

    // enemy updating
    enemies_list.forEach(function(enemy) {
        enemy.update(dt);
        if(!enemy.alive) {
            // Experiência baseada no nível do inimigo (mais difícil = mais XP)
            var baseExp = 3;
            var levelBonus = Math.floor(enemy.max_health / 25); // Bonus baseado na vida máxima
            var totalExp = baseExp + levelBonus;
            experience_orbs_list.push(new ExperienceOrbObject(enemy.x, enemy.y, 8, "orange", totalExp));
        }
    });

    // update particles
    particles_list.forEach(function(p) {
        p.update(dt);
    });

    // update experience orbs
    experience_orbs_list.forEach(function(orb) {
        orb.update(dt, player.x, player.y);
        if(aabbCircleCollision(orb, player)){
            player.gain_experience(orb.experience_value * experienceMultiplier);
            orb.exists = false;
        }
    });

    // update damage zones
    damage_zones_list.forEach(function(zone) {
        zone.update(dt);
    });

    // remove enemies that are no longer exists
    enemies_list = enemies_list.filter(function(enemy) {
        return enemy.alive;
    });
    // remove projectiles that are no longer exists
    projectiles_list = projectiles_list.filter(function(projectile) {
        return projectile.exists;
    });
    // remove dead particles
    particles_list = particles_list.filter(function(p) {
        return p.lifespan > 0;
    });
    // remove experience orbs that are no longer exists
    experience_orbs_list = experience_orbs_list.filter(function(orb) {
        return orb.exists;
    });
    // remove damage zones that are no longer exists
    damage_zones_list = damage_zones_list.filter(function(zone) {
        return zone.exists;
    });

    // enemy spawning
    if(time_since_last_enemy_spawn >= enemy_spawn.time_between_enemy_spawn){
        // Dificuldade gradual - começa fácil e aumenta suavemente
        var level = player.level;
        var difficultyMultiplier = 1 + (level * 0.1); // Crescimento mais suave
        var spawnRateMultiplier = Math.max(0.3, 1 - (level * 0.05)); // Spawn fica mais rápido gradualmente
        
        // Stats base mais baixas no início
        var baseHealth = 25;
        var baseDamage = 8;
        var baseSpeed = 0.08;
        
        // Aumento gradual das stats
        var enemyHealth = Math.floor(baseHealth * difficultyMultiplier);
        var enemyDamage = Math.floor(baseDamage * difficultyMultiplier);
        var enemySpeed = baseSpeed + (level * 0.005); // Velocidade aumenta muito gradualmente
        
        // Ajustar tempo de spawn baseado no nível
        var currentSpawnTime = enemy_spawn.time_between_enemy_spawn * spawnRateMultiplier;
        
        var enemy = new EnemyObject(enemySprite, randomIntBetween(0, WIDTH), randomIntBetween(0, HEIGHT), enemyHealth, enemyHealth);
        enemy.base_damage = enemyDamage;
        enemy.base_speed = enemySpeed;
        enemies_list.push(enemy);
        time_since_last_enemy_spawn -= currentSpawnTime;
    }

}

// render function
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameStarted && !gamePaused) {
        //enemy rendering
        experience_orbs_list.forEach(function(orb) {
            orb.render(ctx);
        });
        enemies_list.forEach(function(enemy) {
            enemy.render(ctx);
        });
        //damage zones rendering
        damage_zones_list.forEach(function(zone) {
            zone.render(ctx);
        });
        //player rendering
        player.render(ctx);
        //projectile rendering
        projectiles_list.forEach(function(projectile) {
            projectile.render(ctx);
        });
        // particle rendering
        particles_list.forEach(function(p) {
            p.render(ctx);
        });
        
        // Atualizar HUD
        updateHUD();
        
        // Verificar se o jogador morreu
        if (player.health <= 0) {
            showGameOver();
        }
    } else if (gamePaused) {
        // Tela de pausa
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSADO", canvas.width / 2, canvas.height / 2);
        ctx.font = "24px Arial";
        ctx.fillText("Pressione Espaço ou ESC para continuar", canvas.width / 2, canvas.height / 2 + 50);
        ctx.textAlign = "left";
    }
}

function updateHUD() {
    // Atualiza informações do HUD
    document.getElementById('healthDisplay').textContent = Math.max(0, player.health);
    document.getElementById('expDisplay').textContent = player.experience;
    document.getElementById('levelDisplay').textContent = player.level;
    document.getElementById('projectilesDisplay').textContent = projectiles_list.length;
}

function showGameOver() {
    document.getElementById('finalLevel').textContent = player.level;
    document.getElementById('gameOverScreen').style.display = 'flex';
    gameStarted = false;
}

function startGame() {
    console.log("startGame chamada!");
    gameStarted = true;
    gamePaused = false;
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'block';
}

function togglePause() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        // Mostrar tela de pausa
        console.log("Jogo pausado - Pressione Espaço ou ESC para continuar");
    } else {
        console.log("Jogo despausado");
    }
}

// run function
function run() {
    var now = performance.now();
    var dt = (now - lastUpdateTime); // dt is in milliseconds
    lastUpdateTime = now;
    update(dt);
    render();
    requestAnimationFrame(run);
}

function initialize() {
    console.log("Inicializando jogo...");
    //initialize player
    player = PlayerObject(playerSprite);
    //initialize enemies - começar com menos inimigos
    for(var i = 0; i < 5; i++){
        enemies_list.push(new EnemyObject(enemySprite, randomIntBetween(0, WIDTH), randomIntBetween(0, HEIGHT), 25, 25));
    }

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

let imagesToLoad = 3;
function onImageLoaded() {
    imagesToLoad--;
    console.log("Imagem carregada! Restam:", imagesToLoad);
    if (imagesToLoad === 0) {
        console.log("Todas as imagens carregadas, inicializando...");
        initialize();
    }
}

playerSprite.onload = onImageLoaded;
projectileSprite.onload = onImageLoaded;
enemySprite.onload = onImageLoaded;

playerSprite.src = "estudante.png";
projectileSprite.src = "lapis2.png";
enemySprite.src = "livro ptbr.png";
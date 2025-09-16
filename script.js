var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lastUpdateTime;

var WIDTH = window.innerWidth-20;
var HEIGHT = window.innerHeight-20;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Tornar WIDTH e HEIGHT globais para os arquivos de inimigos
window.WIDTH = WIDTH;
window.HEIGHT = HEIGHT;

// fetch player status configuration - usar valores padrão inicialmente
var player_status = Object.assign({}, player_status_configurations["normal"]);
var enemy_spawn = Object.assign({}, enemy_spawn_configurations["normal"]);

// Função para atualizar configurações de dificuldade
function updateDifficultySettings() {
    if (typeof current_difficulty !== 'undefined') {
        Object.assign(player_status, player_status_configurations[current_difficulty]);
        Object.assign(enemy_spawn, enemy_spawn_configurations[current_difficulty]);
    }
}

// global variables
var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;
var time_since_last_enemy_spawn = 0;
var gamePaused = false;
var gameStarted = false;
var experienceMultiplier = 1; // Para o upgrade de experiência duplicada

// Lista de projéteis de inimigos
var enemy_projectiles_list = [];

// sprites
var playerSprite = new Image();
var projectileSprite = new Image();
var enemySprite = new Image();
var xpSprite = new Image();
var heartSprite = new Image();
var backgroundSprite = new Image();

// game objects
var player;
var enemies_list = [];
var projectiles_list = [];
var particles_list = [];
var experience_orbs_list = [];
var damage_zones_list = []; // Zonas de dano
var powerups_list = [];

// Sistema de Power-ups
var activePowerUps = {};
var powerupSpawnTimer = 0;
var POWERUP_SPAWN_INTERVAL = 10000; // 10 segundos (reduzido para teste)

// Sistema de controle de perguntas já utilizadas
var usedQuestions = {
    easy: [],
    normal: [],
    hard: []
};

// Sistema de Boss
var bossSpawnTimer = 0;
var BOSS_SPAWN_INTERVAL = 60000; // 60 segundos
var bossActive = false;

// Sistema de teclado
var keys = {};

// Estado do jogo
var game_running = false;

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
        
        // Cluster - Dois tipos de projéteis
        if (activePowerUps.cluster) {
            // Segundo projétil em ângulo ligeiramente diferente
            var clusterAngle = angle_between_player_and_mouse + (Math.random() - 0.5) * 0.5;
            player.attack(clusterAngle);
        }
        
        time_since_last_projectile = 0;
    }
    
    // Controle do teleporte Proxy (tecla T)
    if (keys['t'] || keys['T']) {
        useProxyTeleport();
        keys['t'] = false;
        keys['T'] = false;
    }
    
    //projectile updating
    projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });
    
    //enemy projectile updating
    enemy_projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });

    //player collision with enemies
    for(var i = 0; i < enemies_list.length; i++){
        if(aabbCircleCollision(player, enemies_list[i])){
            // Verificar se está em modo stealth (VPN)
            if (!player.stealth) {
                var damage = enemies_list[i].base_damage;
                // Aplicar redução de dano se tiver o upgrade
                if (player.damage_reduction > 0) {
                    damage = Math.max(1, damage - player.damage_reduction);
                }
                player.take_damage(damage);
                
                // Aplicar efeito do Firewall se ativo
                applyFirewallEffect();
            }
        }
    }
    
    //player collision with enemy projectiles
    for(var i = 0; i < enemy_projectiles_list.length; i++){
        if(aabbCircleCollision(player, enemy_projectiles_list[i])){
            // Verificar se está em modo stealth (VPN)
            if (!player.stealth) {
                var damage = enemy_projectiles_list[i].damage;
                // Aplicar redução de dano se tiver o upgrade
                if (player.damage_reduction > 0) {
                    damage = Math.max(1, damage - player.damage_reduction);
                }
                player.take_damage(damage);
                
                // Aplicar efeito do Firewall se ativo
                applyFirewallEffect();
                
                // Remover projétil
                enemy_projectiles_list[i].alive = false;
            }
        }
    }

    //projectile collision
    for(var i = 0; i < projectiles_list.length; i++){
        for(var j = 0; j < enemies_list.length; j++){
            if(aabbCircleCollision(projectiles_list[i], enemies_list[j])){
                createParticleExplosion(enemies_list[j].x, enemies_list[j].y, "#8A2BE2", randomIntBetween(10, 20)); // Cor roxa para explosão do livro
                
                // Efeito de explosão
                if (projectiles_list[i].explosive) {
                    createExplosionEffect(projectiles_list[i].x, projectiles_list[i].y);
                }
                
                // Efeito de congelamento
                if (projectiles_list[i].freeze) {
                    enemies_list[j].frozen = true;
                    enemies_list[j].freeze_timer = 2000; // 2 segundos congelado
                }
                
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
            // Aplicar efeito do Antivírus se ativo
            applyAntivirusEffect();
            
            // Sistema de experiência balanceado por dificuldade
            var difficulty = difficulty_modes[current_difficulty] || difficulty_modes["normal"]; // Fallback para normal
            var baseExp = 3;
            var levelBonus = Math.floor(enemy.max_health / 25); // Bonus baseado na vida máxima
            var totalExp = Math.floor((baseExp + levelBonus) * difficulty.experience_multiplier);
            
            // Aplicar multiplicador de experiência se tiver o upgrade
            if (player.xp_multiplier) {
                totalExp = Math.floor(totalExp * player.xp_multiplier);
            }
            
            experience_orbs_list.push(new ExperienceOrbObject(xpSprite, enemy.x, enemy.y, totalExp));
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
    
    // update experience orbs
    experience_orbs_list.forEach(function(orb) {
        orb.update(dt, player.x, player.y);
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
    
    // Sistema de Power-ups
    updatePowerUps(dt);
    
    // Sistema de Boss
    updateBossSystem(dt);
    
    // Efeitos especiais dos power-ups
    updateSpecialPowerUps();
    
    // Aplicar regeneração
    applyRegeneration(dt);

    // Sistema de spawn de inimigos diversificados
    updateEnemySpawning(dt);
    
    // enemy spawning com sistema de dificuldade balanceado
    if(time_since_last_enemy_spawn >= enemy_spawn.time_between_enemy_spawn){
        var level = player.level;
        var difficulty = difficulty_modes[current_difficulty] || difficulty_modes["normal"]; // Fallback para normal
        
        // Curva de dificuldade progressiva e balanceada
        var levelMultiplier = 1 + (level * 0.08); // Crescimento mais suave
        var spawnRateMultiplier = Math.max(0.4, 1 - (level * 0.03)); // Spawn mais gradual
        
        // Aplicar multiplicadores de dificuldade
        var enemyHealth = Math.floor(enemy_spawn.base_health * levelMultiplier * difficulty.enemy_multiplier);
        var enemyDamage = Math.floor(enemy_spawn.base_damage * levelMultiplier * difficulty.enemy_multiplier);
        var enemySpeed = enemy_spawn.base_speed + (level * 0.003) * difficulty.enemy_multiplier;
        
        // Ajustar tempo de spawn baseado no nível e dificuldade
        var currentSpawnTime = enemy_spawn.time_between_enemy_spawn * spawnRateMultiplier * difficulty.spawn_rate_multiplier;
        
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
    
    // Efeito visual do stealth (VPN)
    if (player.stealth) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#00BFFF';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
        //projectile rendering
        projectiles_list.forEach(function(projectile) {
            projectile.render(ctx);
        });
        
        //enemy projectile rendering
        enemy_projectiles_list.forEach(function(projectile) {
            projectile.render(ctx);
        });
        // particle rendering
        particles_list.forEach(function(p) {
            p.render(ctx);
        });
        
        // power-up rendering
        powerups_list.forEach(function(powerup) {
            powerup.render(ctx);
        });
        
        // Mostrar estatísticas de perguntas
        var stats = showQuestionStats();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Arial';
        ctx.fillText(`Perguntas restantes: ${stats.remaining}/${stats.total}`, 10, HEIGHT - 20);
        
        // boss rendering
        enemies_list.forEach(function(enemy) {
            if (enemy.isBoss) {
                enemy.render(ctx);
            }
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

function updateHUD() {
    // Atualiza informações do HUD
    document.getElementById('healthDisplay').textContent = Math.max(0, player.health);
    document.getElementById('expDisplay').textContent = player.experience;
    document.getElementById('levelDisplay').textContent = player.level;
    document.getElementById('projectilesDisplay').textContent = projectiles_list.length;
    
    // Atualizar barra de progressão de XP
    updateXPProgressBar();
}

function updateXPProgressBar() {
    // Calcular XP necessário para próximo nível
    var currentLevel = player.level;
    var xpForCurrentLevel = Math.floor(50 + (currentLevel * 75));
    var xpForNextLevel = Math.floor(50 + ((currentLevel + 1) * 75));
    var xpNeeded = xpForNextLevel - xpForCurrentLevel;
    var xpProgress = player.experience - xpForCurrentLevel;
    var progressPercentage = Math.max(0, Math.min(100, (xpProgress / xpNeeded) * 100));
    
    // Criar ou atualizar barra de progressão
    var progressContainer = document.getElementById('xpProgressContainer');
    if (!progressContainer) {
        progressContainer = document.createElement('div');
        progressContainer.id = 'xpProgressContainer';
        progressContainer.style.cssText = `
            width: 200px;
            height: 20px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid #FFD700;
            border-radius: 10px;
            margin-top: 5px;
            overflow: hidden;
        `;
        
        var progressBar = document.createElement('div');
        progressBar.id = 'xpProgressBar';
        progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #FFD700, #FFA500);
            width: 0%;
            transition: width 0.3s ease;
        `;
        
        progressContainer.appendChild(progressBar);
        
        // Adicionar ao HUD
        var expDisplay = document.getElementById('expDisplay').parentElement;
        expDisplay.appendChild(progressContainer);
    }
    
    // Atualizar largura da barra
    var progressBar = document.getElementById('xpProgressBar');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    }
    
    // Atualizar texto de progressão
    var progressText = document.getElementById('xpProgressText');
    if (!progressText) {
        progressText = document.createElement('div');
        progressText.id = 'xpProgressText';
        progressText.style.cssText = `
            color: #FFD700;
            font-size: 12px;
            text-align: center;
            margin-top: 2px;
        `;
        progressContainer.appendChild(progressText);
    }
    
    progressText.textContent = `${xpProgress}/${xpNeeded} XP para próximo nível`;
}

function showGameOver() {
    document.getElementById('finalLevel').textContent = player.level;
    document.getElementById('gameOverScreen').style.display = 'flex';
    gameStarted = false;
}

function startGame() {
    console.log("startGame chamada!");
    
    // Resetar perguntas utilizadas
    usedQuestions = {
        easy: [],
        normal: [],
        hard: []
    };
    
    // Resetar sistema de inimigos
    resetEnemySystem();
    enemy_projectiles_list = [];
    
    // Atualizar configurações de dificuldade antes de iniciar
    updateDifficultySettings();
    
    // Ajustar dificuldade dos inimigos
    adjustEnemyDifficulty();
    
    gameStarted = true;
    gamePaused = false;
    game_running = true;
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
    
    // Verificar se os sprites estão carregados
    console.log("PlayerSprite carregado:", playerSprite.complete);
    console.log("XpSprite carregado:", xpSprite.complete);
    
    //initialize player
    player = PlayerObject(playerSprite);
    player.stealth = false; // Para o power-up VPN
    
    // Inicializar propriedades dos novos upgrades
    player.boomerang = false;
    player.explosive = false;
    player.freeze = false;
    player.extra_lives = 0;
    player.projectile_speed_multiplier = 1.0;
    player.regeneration = false;
    player.xp_multiplier = 1.0;
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

let imagesToLoad = 4;
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
backgroundSprite.onload = onImageLoaded;

playerSprite.src = "estudante.png";
projectileSprite.src = "lapis2.png";
enemySprite.src = "livro ptbr.png";
backgroundSprite.src = "umaruchan.jpg";

// Criar sprites simples para XP e coração
xpSprite.width = 32;
xpSprite.height = 32;
heartSprite.width = 32;
heartSprite.height = 32;

// Sistema de Power-ups
function updatePowerUps(dt) {
    // Verificar se o jogo está rodando
    if (!game_running) return;
    
    // Spawn de power-ups
    powerupSpawnTimer += dt;
    if (powerupSpawnTimer >= POWERUP_SPAWN_INTERVAL) {
        spawnPowerUp();
        powerupSpawnTimer = 0;
    }
    
    // Atualizar power-ups existentes
    powerups_list.forEach(function(powerup) {
        powerup.update(dt);
        
        // Verificar colisão com jogador
        if (aabbCircleCollision(player, powerup) && !powerup.collected) {
            collectPowerUp(powerup);
        }
    });
    
    // Remover power-ups coletados ou expirados
    powerups_list = powerups_list.filter(function(powerup) {
        return powerup.exists && !powerup.collected;
    });
    
    // Atualizar power-ups ativos
    updateActivePowerUps(dt);
}

function spawnPowerUp() {
    // Verificar se o jogo está rodando e se o player existe
    if (!game_running || !player) return;
    
    var types = ['speed', 'damage', 'health', 'fire_rate', 'shield', 'antivirus', 'vpn', 'cluster', 'firewall', 'proxy'];
    var randomType = types[Math.floor(Math.random() * types.length)];
    
    // Spawnar em posição aleatória longe do jogador
    var x, y;
    do {
        x = randomIntBetween(50, WIDTH - 50);
        y = randomIntBetween(50, HEIGHT - 50);
    } while (Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2) < 100);
    
    var powerup = new PowerUpObject(x, y, randomType);
    powerups_list.push(powerup);
}

function collectPowerUp(powerup) {
    powerup.collected = true;
    powerup.exists = false;
    
    // Aplicar efeito do power-up
    applyPowerUpEffect(powerup.type);
    
    // Efeito visual
    createParticleExplosion(powerup.x, powerup.y, "#FFD700", 15);
    
    // Power-up coletado
    
    // Mostrar quiz para escolher power-up adicional
    showPowerUpQuiz();
}

function applyPowerUpEffect(type) {
    var duration = 8000; // 8 segundos (reduzido de 10)
    var difficulty = difficulty_modes[current_difficulty] || difficulty_modes["normal"];
    
    switch(type) {
        case 'speed':
            if (!activePowerUps.speed) {
                activePowerUps.speed = { duration: duration, originalSpeed: player_status.speed };
                player_status.speed *= 1.25; // Reduzido de 1.5 para 1.25
            }
            break;
        case 'damage':
            if (!activePowerUps.damage) {
                activePowerUps.damage = { duration: duration, originalDamage: player_status.damage };
                player_status.damage = Math.floor(player_status.damage * 1.3); // Reduzido de 1.5 para 1.3
            }
            break;
        case 'health':
            player.health = Math.min(player.health + 20, player_status.max_health); // Reduzido de 30 para 20
            break;
        case 'fire_rate':
            if (!activePowerUps.fire_rate) {
                activePowerUps.fire_rate = { duration: duration, originalRate: player_status.time_between_projectiles };
                player_status.time_between_projectiles *= 0.8; // Mais desafiador: 0.8 (20% mais rápido)
            }
            break;
        case 'shield':
            if (!activePowerUps.shield) {
                activePowerUps.shield = { duration: duration };
                player.damage_reduction += 1; // Reduzido de 2 para 1
            }
            break;
        case 'antivirus':
            if (!activePowerUps.antivirus) {
                activePowerUps.antivirus = { duration: duration };
            }
            break;
        case 'vpn':
            if (!activePowerUps.vpn) {
                activePowerUps.vpn = { duration: duration };
            }
            break;
        case 'cluster':
            if (!activePowerUps.cluster) {
                activePowerUps.cluster = { duration: duration };
            }
            break;
        case 'firewall':
            if (!activePowerUps.firewall) {
                activePowerUps.firewall = { duration: duration };
            }
            break;
        case 'proxy':
            if (!activePowerUps.proxy) {
                activePowerUps.proxy = { duration: duration };
            }
            break;
    }
}

function updateActivePowerUps(dt) {
    for (var type in activePowerUps) {
        activePowerUps[type].duration -= dt;
        
        if (activePowerUps[type].duration <= 0) {
            // Remover efeito
            switch(type) {
                case 'speed':
                    player_status.speed = activePowerUps[type].originalSpeed;
                    break;
                case 'damage':
                    player_status.damage = activePowerUps[type].originalDamage;
                    break;
                case 'fire_rate':
                    player_status.time_between_projectiles = activePowerUps[type].originalRate;
                    break;
                case 'shield':
                    player.damage_reduction = Math.max(0, player.damage_reduction - 1);
                    break;
                case 'antivirus':
                case 'vpn':
                case 'cluster':
                case 'firewall':
                case 'proxy':
                    // Power-ups especiais não precisam reverter
                    break;
            }
            delete activePowerUps[type];
        }
    }
}

// Função para spawnar inimigo normal (função original)
function spawnEnemy() {
    if (!player || !game_running) return;
    
    // Spawnar nas bordas da tela
    var side = Math.floor(Math.random() * 4);
    var x, y;
    
    switch(side) {
        case 0: // Topo
            x = Math.random() * WIDTH;
            y = -50;
            break;
        case 1: // Direita
            x = WIDTH + 50;
            y = Math.random() * HEIGHT;
            break;
        case 2: // Baixo
            x = Math.random() * WIDTH;
            y = HEIGHT + 50;
            break;
        case 3: // Esquerda
            x = -50;
            y = Math.random() * HEIGHT;
            break;
    }
    
    // Calcular stats baseado na dificuldade
    var difficulty = current_difficulty || 'normal';
    var health = 20 * (difficulty_modes[difficulty]?.enemy_health_multiplier || 1);
    var damage = 10 * (difficulty_modes[difficulty]?.enemy_damage_multiplier || 1);
    
    var enemy = new EnemyObject(enemySprite, x, y, health, damage);
    enemies_list.push(enemy);
}

// Função para obter pergunta aleatória não utilizada
function getUnusedQuestion(difficulty) {
    var availableQuestions = QuizSystem.questions[difficulty] || QuizSystem.questions['normal'];
    var used = usedQuestions[difficulty] || [];
    
    // Se todas as perguntas foram usadas, resetar a lista
    if (used.length >= availableQuestions.length) {
        usedQuestions[difficulty] = [];
        used = [];
    }
    
    // Encontrar perguntas não utilizadas
    var unusedQuestions = availableQuestions.filter(function(q, index) {
        return used.indexOf(index) === -1;
    });
    
    // Se não há perguntas não utilizadas, usar todas
    if (unusedQuestions.length === 0) {
        unusedQuestions = availableQuestions;
        usedQuestions[difficulty] = [];
    }
    
    // Escolher pergunta aleatória das não utilizadas
    var randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    var selectedQuestion = unusedQuestions[randomIndex];
    
    // Encontrar o índice original da pergunta
    var originalIndex = availableQuestions.findIndex(function(q) {
        return q.question === selectedQuestion.question;
    });
    
    // Marcar como utilizada
    if (originalIndex !== -1) {
        usedQuestions[difficulty].push(originalIndex);
    }
    
    // ========================================
    // MUDANÇA PRINCIPAL: EMBARALHAMENTO DE RESPOSTAS
    // ========================================
    // Aplicar embaralhamento para evitar que jogador decore posições
    return QuizSystem.shuffleOptions(selectedQuestion);
}

// Função para mostrar estatísticas de perguntas (debug)
function showQuestionStats() {
    var difficulty = current_difficulty || 'normal';
    var total = QuizSystem.questions[difficulty].length;
    var used = usedQuestions[difficulty].length;
    var remaining = total - used;
    
    console.log(`Perguntas ${difficulty}: ${remaining}/${total} restantes`);
    return { total: total, used: used, remaining: remaining };
}

// Função para criar efeito de explosão
function createExplosionEffect(x, y) {
    // Criar partículas de explosão
    for (var i = 0; i < 15; i++) {
        var angle = (i / 15) * Math.PI * 2;
        var speed = randomIntBetween(2, 8);
        var particle = new ParticleObject(x, y, "#FF4500", speed, angle, 1000);
        particles_list.push(particle);
    }
    
    // Causar dano em área
    enemies_list.forEach(function(enemy) {
        var dx = enemy.x - x;
        var dy = enemy.y - y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) { // Raio de explosão
            var damage = Math.max(1, Math.floor(player_status.damage * 0.5));
            enemy.take_damage(damage);
        }
    });
}

// Função para aplicar regeneração
function applyRegeneration(dt) {
    if (player.regeneration && player.health < player.max_health) {
        player.regeneration_timer = (player.regeneration_timer || 0) + dt;
        
        if (player.regeneration_timer >= 3000) { // A cada 3 segundos
            player.health = Math.min(player.max_health, player.health + 1);
            player.regeneration_timer = 0;
            
            // Efeito visual
            createParticleExplosion(player.x, player.y, "#00FF00", 3);
        }
    }
}

// Sistema de Quiz para Power-ups
function showPowerUpQuiz() {
    var difficulty = current_difficulty || 'normal';
    var question = getUnusedQuestion(difficulty);
    
    // Pausar jogo
    gamePaused = true;
    
    // Criar interface do quiz
    var quizDiv = document.createElement('div');
    quizDiv.id = 'powerUpQuiz';
    quizDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        color: white;
        font-family: 'Arial', sans-serif;
    `;
    
    // Título
    var title = document.createElement('h1');
    title.textContent = '🎁 POWER-UP ENCONTRADO! 🎁';
    title.style.cssText = 'color: #FFD700; font-size: 2.5em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);';
    quizDiv.appendChild(title);
    
    // Pergunta
    var questionDiv = document.createElement('div');
    questionDiv.style.cssText = 'background: rgba(255, 107, 107, 0.2); padding: 20px; border-radius: 10px; margin-bottom: 30px; max-width: 600px; text-align: center;';
    
    var questionText = document.createElement('h2');
    questionText.textContent = question.question;
    questionText.style.cssText = 'margin-bottom: 20px; font-size: 1.3em;';
    questionDiv.appendChild(questionText);
    
    var categoryText = document.createElement('p');
    categoryText.textContent = `Categoria: ${question.category}`;
    categoryText.style.cssText = 'color: #ccc; font-size: 0.9em; margin-bottom: 15px;';
    questionDiv.appendChild(categoryText);
    
    // Opções
    var optionsDiv = document.createElement('div');
    optionsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
    
    question.options.forEach((option, index) => {
        var optionButton = document.createElement('button');
        optionButton.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        optionButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid #ff6b6b;
            padding: 15px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            transition: all 0.3s ease;
        `;
        
        optionButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 107, 107, 0.3)';
            this.style.transform = 'scale(1.05)';
        });
        
        optionButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.transform = 'scale(1)';
        });
        
        optionButton.addEventListener('click', function() {
            handleQuizAnswer(index === question.correct, quizDiv);
        });
        
        optionsDiv.appendChild(optionButton);
    });
    
    questionDiv.appendChild(optionsDiv);
    quizDiv.appendChild(questionDiv);
    
    // Instruções
    var instructions = document.createElement('p');
    instructions.textContent = 'Responda corretamente para ganhar um power-up adicional!';
    instructions.style.cssText = 'font-size: 1.1em; color: #ccc; margin-top: 20px;';
    quizDiv.appendChild(instructions);
    
    document.body.appendChild(quizDiv);
}

function handleQuizAnswer(isCorrect, quizDiv) {
    // Remover interface do quiz
    quizDiv.remove();
    
    if (isCorrect) {
        // Mostrar interface de seleção de upgrades
        createUpgradeSelectionInterface();
    } else {
        // Aplicar power-up básico automático
        var types = ['speed', 'damage', 'health', 'fire_rate', 'shield'];
        var randomType = types[Math.floor(Math.random() * types.length)];
        applyPowerUpEffect(randomType);
        
        // Mostrar resultado
        showQuizResult(false, randomType);
        
        // Continuar jogo
        gamePaused = false;
    }
}

function showQuizResult(isCorrect, powerupType) {
    var resultDiv = document.createElement('div');
    resultDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        z-index: 3000;
        font-family: 'Arial', sans-serif;
    `;
    
    if (isCorrect) {
        resultDiv.innerHTML = `
            <h2 style="color: #4CAF50; margin-bottom: 15px;">✅ CORRETO!</h2>
            <p>Você ganhou um power-up adicional: <strong>${powerupType}</strong></p>
        `;
    } else {
        resultDiv.innerHTML = `
            <h2 style="color: #f44336; margin-bottom: 15px;">❌ INCORRETO</h2>
            <p>Você ainda ganha o power-up que coletou!</p>
        `;
    }
    
    document.body.appendChild(resultDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        resultDiv.remove();
    }, 3000);
}

// Sistema de Boss
function updateBossSystem(dt) {
    // Spawn do boss
    if (!bossActive) {
        bossSpawnTimer += dt;
        if (bossSpawnTimer >= BOSS_SPAWN_INTERVAL) {
            spawnBoss();
            bossSpawnTimer = 0;
            bossActive = true;
        }
    }
    
    // Verificar se boss morreu
    var bossExists = enemies_list.some(function(enemy) {
        return enemy.isBoss && enemy.alive;
    });
    
    if (!bossExists && bossActive) {
        bossActive = false;
        bossSpawnTimer = 0; // Reset timer
    }
}

function spawnBoss() {
    // Mostrar aviso de boss chegando
    showBossWarning();
    
    // Limpar todos os inimigos da tela
    enemies_list = enemies_list.filter(function(enemy) {
        if (enemy.isBoss) return true; // Manter bosses existentes
        return false; // Remover todos os outros inimigos
    });
    
    // Limpar projéteis de inimigos
    enemy_projectiles_list = [];
    
    // Aguardar 3 segundos (tempo do aviso) antes de spawnar o boss
    setTimeout(function() {
        var difficulty = difficulty_modes[current_difficulty] || difficulty_modes["normal"];
        var level = player.level;
        
        // Stats do boss MUITO mais fortes
        var bossHealth = Math.floor(500 * difficulty.enemy_multiplier * (1 + level * 0.5));
        var bossDamage = Math.floor(40 * difficulty.enemy_multiplier);
        
        // Spawnar no centro da tela para máximo impacto
        var x = WIDTH / 2;
        var y = HEIGHT / 2;
        
        var boss = new BossObject(enemySprite, x, y, bossHealth, bossHealth);
        boss.base_damage = bossDamage;
        boss.base_speed = 0.1; // Mais rápido
        enemies_list.push(boss);
        
        // Efeito visual de spawn dramático
        createParticleExplosion(x, y, "#FF0000", 50);
        
        // Efeito de "wave" - múltiplas explosões
        for (var i = 0; i < 5; i++) {
            setTimeout(function() {
                var waveX = x + (Math.random() - 0.5) * 200;
                var waveY = y + (Math.random() - 0.5) * 200;
                createParticleExplosion(waveX, waveY, "#FFD700", 20);
            }, i * 200);
        }
        
        bossActive = true;
        console.log("BOSS SPAWNADO! Nível:", level, "Vida:", bossHealth);
    }, 3000); // 3 segundos de aviso
}

// Efeitos especiais dos power-ups
function updateSpecialPowerUps() {
    // Antivírus - Regenera vida por inimigo morto
    if (activePowerUps.antivirus) {
        // Esta lógica será chamada quando inimigo morrer
    }
    
    // VPN - Modo stealth (atravessar inimigos)
    if (activePowerUps.vpn) {
        player.stealth = true;
    } else {
        player.stealth = false;
    }
    
    // Cluster - Dois tipos de projéteis
    if (activePowerUps.cluster) {
        // Esta lógica será implementada no sistema de tiro
    }
    
    // Firewall - Onda de choque ao ser atingido
    if (activePowerUps.firewall) {
        // Esta lógica será chamada quando jogador receber dano
    }
    
    // Proxy - Teleporte (será implementado com tecla)
    if (activePowerUps.proxy) {
        // Esta lógica será implementada com tecla
    }
}

// Função para aplicar efeito do Antivírus quando inimigo morre
function applyAntivirusEffect() {
    if (activePowerUps.antivirus) {
        player.health = Math.min(player.health + 3, player_status.max_health);
        // Efeito visual
        createParticleExplosion(player.x, player.y, "#00FF00", 5);
    }
}

// Função para aplicar efeito do Firewall quando jogador recebe dano
function applyFirewallEffect() {
    if (activePowerUps.firewall) {
        // Criar onda de choque
        createShockwave(player.x, player.y, 100, 15);
    }
}

// Função para criar onda de choque
function createShockwave(x, y, radius, damage) {
    // Efeito visual
    createParticleExplosion(x, y, "#FF4500", 20);
    
    // Dano em área
    enemies_list.forEach(function(enemy) {
        var distance = Math.sqrt((enemy.x - x) ** 2 + (enemy.y - y) ** 2);
        if (distance <= radius) {
            enemy.take_damage(damage);
        }
    });
}

// Função para teleporte do Proxy
function useProxyTeleport() {
    if (activePowerUps.proxy) {
        // Teleportar para posição aleatória próxima
        var angle = Math.random() * Math.PI * 2;
        var distance = 100 + Math.random() * 100;
        
        var newX = player.x + Math.cos(angle) * distance;
        var newY = player.y + Math.sin(angle) * distance;
        
        // Limitar dentro da tela
        newX = Math.max(50, Math.min(WIDTH - 50, newX));
        newY = Math.max(50, Math.min(HEIGHT - 50, newY));
        
        player.x = newX;
        player.y = newY;
        
        // Efeito visual
        createParticleExplosion(newX, newY, "#00BFFF", 15);
        
        // Remover power-up após uso
        delete activePowerUps.proxy;
    }
}

// Event listeners para teclado
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});
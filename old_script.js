var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lastUpdateTime;

var WIDTH = window.innerWidth - 20;
var HEIGHT = window.innerHeight - 20;
canvas.width = WIDTH;
canvas.height = HEIGHT;

var scenario = {
    width: 1920,
    height: 1080,
}

// fetch player status configuration
var player_status = Object.assign({}, player_status_configurations[selected_player_status_configuration]);
var enemy_spawn = Object.assign({}, enemy_spawn_configurations[selected_enemy_spawn_configuration]);
var enemy_status = Object.assign({}, enemy_status_configurations[selected_enemy_status_configuration]);

// global variables
var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;
var time_since_last_enemy_spawn = 0;
var gamePaused = false;
var gameStarted = false;
var experienceMultiplier = 1; // Para o upgrade de experiência duplicada
const HEALTH_PER_HEART = 20; // Vida representada por cada coração no HUD
var lastPlayerHealthForHUD = -1; // Otimização para o HUD

// game objects
var player;
var enemies_list = [];
var projectiles_list = [];
var enemy_projectiles_list = [];
var particles_list = [];
var experience_orbs_list = [];
var gun_drones_list = [];

// spawner logic
//var spawner = new SpawnerObject();

// sprites
var playerSprite = new Image();
var projectileSprite = new Image();
var enemySprite = new Image();
var playerShootingSprite = new Image();
var playerShootingAndMovingSprite = new Image();
var xpSprite = new Image();
var heartSprite = new Image();
var backgroundSprite = new Image();
var gunDroneSprite = new Image();
var gunDroneProjectileSprite = new Image();
var tankSprite = new Image();
var bossSprite = new Image();

var camera = new CameraObject(scenario.width, scenario.height, WIDTH, HEIGHT);
var is_gamepad_connected = false;
var mouse = {
    x: 0,
    y: 0,
    mouseDown: false,
};
var keys_down = [];



function createParticleExplosion(x, y, color, count) {
    for (var i = 0; i < count; i++) {
        var angle = Math.random() * 2 * Math.PI;
        var speed = Math.random() * 100 + 50;
        particles_list.push(new ParticleObject(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color));
    }
}


// event listeners
canvas.addEventListener("mousemove", function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mousedown", function (e) {
    mouse.mouseDown = true;
});
canvas.addEventListener("mouseup", function (e) {
    mouse.mouseDown = false;
});
window.addEventListener("keydown", function (e) {
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
window.addEventListener("keyup", function (e) {
    keys_down = keys_down.filter(function (key) {
        return key !== e.key;
    });
});
// gamepad connection
window.addEventListener("gamepadconnected", function (e) {
    console.log("Controle conectado no índice %d: %s.", e.gamepad.index, e.gamepad.id);
    is_gamepad_connected = true;
});
window.addEventListener("gamepaddisconnected", function (e) {
    console.log("Controle desconectado do índice %d: %s", e.gamepad.index, e.gamepad.id);
    is_gamepad_connected = false;
});



// update function
function update(dt) {
    if (!gameStarted || gamePaused) return;

    camera.update(dt);
    //spawner.update(dt);

    time_since_last_enemy_spawn += dt;
    const gamepadState = pollGamepad();

    // Define o ângulo de mira: prioriza o controle, senão usa o mouse
    if (gamepadState.aimAngle !== null) {
        angle_between_player_and_mouse = gamepadState.aimAngle;
    } else {
        angle_between_player_and_mouse = angleBetweenPoints(player.x - camera.x, player.y - camera.y, mouse.x, mouse.y);
    }
    player.update(dt, gamepadState.moveVector);

    //projectile firing
    time_since_last_projectile += dt;
    if ((mouse.mouseDown || gamepadState.isShooting) && time_since_last_projectile >= player_status.time_between_projectiles) {
        projectiles_list.push(
            new ProjectileObject(
                projectileSprite, player.x, player.y, angle_between_player_and_mouse)
        );
        player.triggerShootingAnimation();
        time_since_last_projectile = 0;
    }
    //gun drone updating
    gun_drones_list.forEach(function (gun_drone) {
        gun_drone.update(dt);
    });

    //projectile updating
    projectiles_list.forEach(function (projectile) {
        projectile.update(dt);
    });
    // enemy projectile updating
    enemy_projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });

    //player collision
    for (var i = 0; i < enemies_list.length; i++) {
        if (aabbCircleCollision(player, enemies_list[i])) {
            player.take_damage(enemies_list[i].base_damage);
        }
    }

    //enemy projectile collision with player
    for (var i = 0; i < enemy_projectiles_list.length; i++) {
        if (enemy_projectiles_list[i].exists && aabbCircleCollision(player, enemy_projectiles_list[i])) {
            player.take_damage(enemy_projectiles_list[i].damage);
            enemy_projectiles_list[i].exists = false;
        }
    }

    //projectile collision
    for (var i = 0; i < projectiles_list.length; i++) {
        for (var j = 0; j < enemies_list.length; j++) {
            if (aabbCircleCollision(projectiles_list[i], enemies_list[j])) {
                createParticleExplosion(enemies_list[j].x, enemies_list[j].y, "#8A2BE2", randomIntBetween(10, 20)); // Cor roxa para explosão do livro
                projectiles_list[i].exists = false;
                enemies_list[j].take_damage(player_status.damage);
            }
        }
    }

    // enemy updating
    enemies_list.forEach(function (enemy) {
        enemy.update(dt);
        if (!enemy.alive) {
            experience_orbs_list.push(
                new ExperienceOrbObject(
                    xpSprite,
                    enemy.x,
                    enemy.y,
                    experience_configurations[selected_experience_configuration].base_orb_value * experience_configurations[selected_experience_configuration].base_orb_value_multiplier,
                )
            );
        }
    });

    // enemy projectile updating
    enemy_projectiles_list.forEach(function (projectile) {
        projectile.update(dt);
    });

    // update particles
    particles_list.forEach(function (p) {
        p.update(dt);
    });

    // update experience orbs
    experience_orbs_list.forEach(function (orb) {
        orb.update(dt, player.x, player.y);
        if (aabbCircleCollision(orb, player)) {
            player.gain_experience(orb.experience_value * experienceMultiplier);
            orb.exists = false;
        }
    });

    // remove enemies that are no longer exists
    enemies_list = enemies_list.filter(function (enemy) {
        return enemy.alive;
    });
    // remove projectiles that are no longer exists
    projectiles_list = projectiles_list.filter(function (projectile) {
        return projectile.exists;
    });
    // remove enemy projectiles that are no longer exists
    enemy_projectiles_list = enemy_projectiles_list.filter(function (projectile) {
        return projectile.exists;
    });
    // remove dead particles
    particles_list = particles_list.filter(function (p) {
        return p.lifespan > 0;
    });
    // remove experience orbs that are no longer exists
    experience_orbs_list = experience_orbs_list.filter(function (orb) {
        return orb.exists;
    });
}

// render function
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o fundo do cenário, movendo-o de acordo com a câmera para criar o efeito de scroll.
    // A imagem de fundo tem o mesmo tamanho do cenário.
    ctx.drawImage(backgroundSprite, -camera.x, -camera.y, scenario.width, scenario.height);
    if (gameStarted && !gamePaused) {
        //enemy rendering
        experience_orbs_list.forEach(function(orb) {
            orb.render(ctx, camera);
        });
        enemies_list.forEach(function (enemy){
            enemy.render(ctx, camera);
        });

        //player rendering
        player.render(ctx, camera);

        //gun drone rendering
        gun_drones_list.forEach(function (gun_drone) {
            gun_drone.render(ctx, camera);
        });

        //projectile rendering
        projectiles_list.forEach(function (projectile) {
            projectile.render(ctx, camera);
        });

        // enemy projectile rendering
        enemy_projectiles_list.forEach(function (projectile) {
            projectile.render(ctx, camera);
        });

        // particle rendering
        particles_list.forEach(function (p) {
            p.render(ctx, camera);
        });
// NOTE: Additional rendering systems from kaiq that need integration:
        // - Power-up rendering (powerups_list)
        // - Damage zones rendering (damage_zones_list)
        // - Player stealth effect rendering
        // - Question statistics display
        // - Enhanced boss rendering
        // - Atualizar HUD
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
    // Otimização: Só redesenha os corações se a vida ou a vida máxima mudou.
    const healthContainer = document.getElementById('healthDisplayContainer');
    const expectedHearts = Math.ceil(player_status.max_health / HEALTH_PER_HEART);

    if (player.health !== lastPlayerHealthForHUD || healthContainer.children.length !== expectedHearts) {
        lastPlayerHealthForHUD = player.health;
        healthContainer.innerHTML = ''; // Limpa corações anteriores

        const currentHealth = Math.max(0, player.health);

        for (let i = 0; i < expectedHearts; i++) {
            const heartCanvas = document.createElement('canvas');
            const heartSize = 24; // Tamanho do coração no HUD
            heartCanvas.width = heartSize;
            heartCanvas.height = heartSize;
            heartCanvas.style.marginRight = '2px';
            const htx = heartCanvas.getContext('2d');

            const healthStart = i * HEALTH_PER_HEART;

            // Desenha o coração de fundo (vazio) com baixa opacidade
            htx.globalAlpha = 0.3;
            htx.drawImage(heartSprite, 0, 0, heartSize, heartSize);
            htx.globalAlpha = 1.0;

            if (currentHealth > healthStart) {
                // Calcula a porcentagem de preenchimento para este coração
                const fillPercentage = Math.min(1, (currentHealth - healthStart) / HEALTH_PER_HEART);

                // Desenha a parte preenchida do coração por cima
                htx.drawImage(heartSprite, 0, 0, 32 * fillPercentage, 32, 0, 0, heartSize * fillPercentage, heartSize);
            }
            healthContainer.appendChild(heartCanvas);
        }
    }

    // Atualiza outras informações do HUD
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



let imagesToLoad = 11;
function onImageLoaded() {
    imagesToLoad--;
    if (imagesToLoad === 0) {
        initialize();
    }
}

playerSprite.onload = onImageLoaded;
projectileSprite.onload = onImageLoaded;
enemySprite.onload = onImageLoaded;
playerShootingSprite.onload = onImageLoaded;
playerShootingAndMovingSprite.onload = onImageLoaded;
xpSprite.onload = onImageLoaded;
heartSprite.onload = onImageLoaded;
backgroundSprite.onload = onImageLoaded;
gunDroneSprite.onload = onImageLoaded;
gunDroneProjectileSprite.onload = onImageLoaded;
tankSprite.onload = onImageLoaded;
bossSprite.onload = onImageLoaded;

playerSprite.src = "images/estudante.png";
projectileSprite.src = "images/lapis2.png";
enemySprite.src = "images/livro ptbr.png";
playerShootingSprite.src = "images/estudanteatirando.png";
playerShootingAndMovingSprite.src = "images/atirandoecorrendo.png";
xpSprite.src = "images/xp.png";
heartSprite.src = "images/heart.png";
backgroundSprite.src = "images/bg.png";
gunDroneSprite.src = "images/Dogpet.png";
gunDroneProjectileSprite.src = "images/petprojectile.png";
tankSprite.src = "images/tank.png";
bossSprite.src = "images/bossmath.png";
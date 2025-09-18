var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lastUpdateTime;

var WIDTH = window.innerWidth-20;
var HEIGHT = window.innerHeight-20;
canvas.width = WIDTH;
canvas.height = HEIGHT;

var scenario = {
    width: 1920,
    height: 1080,
}
var camera = new CameraObject(scenario.width, scenario.height, WIDTH, HEIGHT);

// fetch player status configuration - usar valores padrão inicialmente
var player_status = Object.assign({}, player_status_configurations[selected_player_status_configuration]);
var enemy_spawn = Object.assign({}, enemy_spawn_configurations[selected_enemy_spawn_configuration]);
var enemy_status = Object.assign({}, enemy_status_configurations[selected_enemy_status_configuration]);
var current_difficulty = "normal";

// global variables
var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;
var time_since_last_enemy_spawn = 0;
var gamePaused = false;
var gameStarted = false;

// Lista de projéteis de inimigos

// sprites
var playerSprite = new Image();
var projectileSprite = new Image();
var enemySprite = new Image();
var xpSprite = new Image();
var heartSprite = new Image();
var backgroundSprite = new Image();

// HUD elements
const HEALTH_PER_HEART = 20; // Vida representada por cada coração no HUD
var lastPlayerHealthForHUD = -1; // Otimização para o HUD

// game objects
var player;
var spawner = new SpawnerObject();
var enemies_list = [];
var projectiles_list = [];
var enemy_projectiles_list = [];
var particles_list = [];
var experience_orbs_list = [];
var gun_drones_list = [];
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
var playerShootingSprite = new Image();
var playerShootingAndMovingSprite = new Image();
var xpSprite = new Image();
var heartSprite = new Image();
var backgroundSprite = new Image();
var gunDroneSprite = new Image();
var gunDroneProjectileSprite = new Image();
var tankSprite = new Image();
var bossSprite = new Image();
// controller support
var is_gamepad_connected = false;

// control variables
var mouse = {
    x: 0,
    y: 0,
    mouseDown: false,
};
var keys_down = [];

// menu navigation with gamepad
var menuFocusIndex = 0;
var lastMenuElement = null;



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
    const gamepadState = pollGamepad();
    handleGamepadMenuInput(gamepadState);

    if (!gameStarted || gamePaused) return;
    camera.update(dt);
    spawner.update(dt);

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
        player.attack(angle_between_player_and_mouse);
        time_since_last_projectile = 0;
    }
    //gun drone updating
    gun_drones_list.forEach(function(gun_drone) {
        gun_drone.update(dt);
    });

    
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
            player.take_damage(enemy_projectiles_list[i].damage);
            enemy_projectiles_list[i].exists = false;
        }
    }

    //projectile collision
    for(var i = 0; i < projectiles_list.length; i++){
        for(var j = 0; j < enemies_list.length; j++){
            if(aabbCircleCollision(projectiles_list[i], enemies_list[j]) && projectiles_list[i].exists && enemies_list[j].alive){
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
                if (!projectiles_list[i].piercing_shot) {
                    projectiles_list[i].exists = false;	
                }
                
                enemies_list[j].take_damage(projectiles_list[i].damage);
            }
        }
    }

    // enemy updating
    enemies_list.forEach(function(enemy) {
        enemy.update(dt);
        if(!enemy.alive) {
            experience_orbs_list.push(
                new ExperienceOrbObject(xpSprite, enemy.x, enemy.y, experience_configurations[selected_experience_configuration].base_orb_value * experience_configurations[selected_experience_configuration].base_orb_value_multiplier)
            );
        }
    });

    // enemy projectile updating
    enemy_projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });

    // update particles
    particles_list.forEach(function(p) {
        p.update(dt);
    });

    // update experience orbs
    experience_orbs_list.forEach(function(orb) {
        orb.update(dt, player.x, player.y);
        if(aabbCircleCollision(orb, player)){
            player.gain_experience(orb.experience_value);
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
    
    // Sistema de Power-ups
    spawner.update(dt);

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
        // renderiza os inimigos que não são bosses
        enemies_list.forEach(function(enemy) {
            if(!enemy.isBoss) {
                enemy.render(ctx, camera);
            }
        });
        //damage zones rendering
        damage_zones_list.forEach(function(zone) {
            zone.render(ctx, camera);
        });
        //player rendering
        player.render(ctx, camera);
        //gun drone rendering
        gun_drones_list.forEach(function(gun_drone) {
            gun_drone.render(ctx, camera);
        });
    
        //projectile rendering
        projectiles_list.forEach(function(projectile) {
            projectile.render(ctx, camera);
        });
        
        //enemy projectile rendering
        enemy_projectiles_list.forEach(function(projectile) {
            projectile.render(ctx, camera);
        });
        // particle rendering
        particles_list.forEach(function(p) {
            p.render(ctx, camera);
        });
        
        // boss rendering
        enemies_list.forEach(function(enemy) {
            if (enemy.isBoss) {
                enemy.render(ctx, camera);
            }
        });
        
        // Atualizar HUD
        updateHUD();
        UpdateDebugHUD();
        
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
    
}

function UpdateDebugHUD() {
    // Atualiza informações do HUD
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
    enemy_projectiles_list = [];

    
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

function handleGamepadMenuInput(gamepadState) {
    // Botão Start (ou Options) sempre pausa/despausa o jogo se já começou
    if (gamepadState.justPressed.start && gameStarted) {
        togglePause();
    }

    // Ações do botão 'A' (confirmar)
    if (gamepadState.justPressed.a) {
        // 1. Tela de Início: Clica em "INICIAR JOGO"
        if (!gameStarted && document.getElementById('startScreen').style.display !== 'none') {
            document.getElementById('startButton').click();
            return;
        }

        // 2. Tela de Game Over: Clica em "JOGAR NOVAMENTE"
        if (document.getElementById('gameOverScreen').style.display !== 'none') {
            document.getElementById('restartButton').click();
            return;
        }

        // 3. Menus de Quiz ou Upgrade: Clica no botão focado
        const activeMenu = document.getElementById('powerUpQuiz') || document.getElementById('upgradeInterface') || document.getElementById('upgradeResult');
        if (activeMenu) {
            const focusableButtons = activeMenu.querySelectorAll('button');
            if (focusableButtons.length > 0 && focusableButtons[menuFocusIndex]) {
                focusableButtons[menuFocusIndex].click();
                return;
            }
        }
    }

    // Navegação com D-pad (Cima/Baixo) nos menus
    const activeMenu = document.getElementById('powerUpQuiz') || document.getElementById('upgradeInterface') || document.getElementById('upgradeResult');
    if (activeMenu) {
        const focusableButtons = Array.from(activeMenu.querySelectorAll('button'));

        if (lastMenuElement !== activeMenu) {
            if (lastMenuElement) {
                lastMenuElement.querySelectorAll('button').forEach(b => b.classList.remove('gamepad-focus'));
            }
            menuFocusIndex = 0;
            lastMenuElement = activeMenu;
        }

        if (focusableButtons.length > 0) {
            let newIndex = menuFocusIndex;
            if (gamepadState.justPressed.down) {
                newIndex = (menuFocusIndex + 1) % focusableButtons.length;
            }
            if (gamepadState.justPressed.up) {
                newIndex = (menuFocusIndex - 1 + focusableButtons.length) % focusableButtons.length;
            }

            if (newIndex !== menuFocusIndex || !focusableButtons.some(b => b.classList.contains('gamepad-focus'))) {
                focusableButtons.forEach(b => b.classList.remove('gamepad-focus'));
                menuFocusIndex = newIndex;
                focusableButtons[menuFocusIndex].classList.add('gamepad-focus');
            }
        }
    } else if (lastMenuElement) {
        lastMenuElement.querySelectorAll('button').forEach(b => b.classList.remove('gamepad-focus'));
        lastMenuElement = null;
        menuFocusIndex = 0;
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
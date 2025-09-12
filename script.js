var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lastUpdateTime;

var WIDTH = window.innerWidth-20;
var HEIGHT = window.innerHeight-20;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// base stats
var player_status = {
    speed: 0.4,
    max_health: 100,
    projectile_speed: 1,
    time_between_projectiles: 5,
    damage: 10,
    invincibility_time: 1000,
}

// global variables
var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;
<<<<<<< Updated upstream
=======
var time_since_last_enemy_spawn = 0;

// Variáveis do sistema de upgrade
var upgrade_interface_visible = false;
var available_upgrades = [];

// Variáveis do sistema de quiz
var quiz_interface_visible = false;
var current_quiz_question = null;
var quiz_category = "tecnologia";

// Funções para calcular stats baseados nos upgrades
function getPlayerDamage() {
    return player_status.damage + (player.upgrades.damage_boost * 5);
}

function getProjectileSpeed() {
    return player_status.projectile_speed + (player.upgrades.projectile_speed * 0.2);
}

function getFireRate() {
    return Math.max(10, player_status.time_between_projectiles - (player.upgrades.fire_rate * 15));
}

function isPiercingShot() {
    return player.upgrades.piercing_shot > 0;
}

function isDoubleShot() {
    return player.upgrades.double_shot > 0;
}

function getExplosionDamage() {
    return player.upgrades.explosion_damage * 15; // 15 de dano por nível
}

function getExplosionRadius() {
    return 80 + (player.upgrades.explosion_damage * 20); // 80 + 20 por nível
}

// Função para mostrar interface de upgrade
function showUpgradeInterface() {
    upgrade_interface_visible = true;
    generateAvailableUpgrades();
}

// Função para gerar upgrades disponíveis
function generateAvailableUpgrades() {
    available_upgrades = [];
    
    for(var upgradeType in upgrade_types) {
        var upgrade = upgrade_types[upgradeType];
        if(player.upgrades[upgradeType] < upgrade.max_level) {
            available_upgrades.push(upgradeType);
        }
    }
    
    // Se não há upgrades disponíveis, não mostra a interface
    if(available_upgrades.length === 0) {
        upgrade_interface_visible = false;
        return;
    }
    
    // Limita a 3 opções aleatórias
    if(available_upgrades.length > 3) {
        var shuffled = available_upgrades.sort(() => 0.5 - Math.random());
        available_upgrades = shuffled.slice(0, 3);
    }
}

// Função para aplicar upgrade
function applyUpgrade(upgradeType) {
    if(player.upgrades[upgradeType] < upgrade_types[upgradeType].max_level) {
        player.upgrades[upgradeType]++;
        upgrade_interface_visible = false;
    }
}

// Função para mostrar interface de quiz
function showQuizInterface() {
    quiz_interface_visible = true;
    generateQuizQuestion();
}

// Função para gerar pergunta do quiz
function generateQuizQuestion() {
    var questions = quiz_questions[quiz_category];
    current_quiz_question = questions[Math.floor(Math.random() * questions.length)];
}

// Função para responder quiz
function answerQuiz(optionIndex) {
    if(current_quiz_question && optionIndex === current_quiz_question.correct) {
        // Resposta correta - mostra interface de upgrade
        createParticleExplosion(player.x, player.y, "#00FF00", 20); // Explosão verde
        quiz_interface_visible = false;
        showUpgradeInterface();
    } else {
        // Resposta errada - perde vida e continua o jogo
        player.take_damage(10);
        createParticleExplosion(player.x, player.y, "#FF0000", 15); // Explosão vermelha
        quiz_interface_visible = false;
    }
    
    current_quiz_question = null;
    
    // Alterna categoria do quiz
    quiz_category = quiz_category === "tecnologia" ? "pirai" : "tecnologia";
}

// game objects
var player;
var enemies_list = [];
>>>>>>> Stashed changes
var projectiles_list = [];
var enemies_list = [];

// control variables
var mouse = {
    x: 0,
    y: 0,
    mouseDown: false,
};
var keys_down = [];

// player object
var player = {
    x: 400,
    y: 400,
    radius: 10,
    invincibility_time: 0,
    health: player_status.max_health,
    take_damage: function(damage){
        if(this.invincibility_time <= 0){
            this.health -= damage;
            if(this.health <= 0){
                this.health = 0;
            }
            this.invincibility_time = player_status.invincibility_time;
        }
    },
    render: function(ctx){
        ctx.save();
        if(this.invincibility_time > 0){
            ctx.fillStyle = "red";
        }else{
            ctx.fillStyle = "blue";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    },
    update: function(dt){
        //movement
        if(this.invincibility_time > 0){
            this.invincibility_time -= dt;
        }
        if(keys_down.includes("w")){
            this.y -= player_status.speed * dt;
        }
        if(keys_down.includes("s")){
            this.y += player_status.speed * dt;
        }
        if(keys_down.includes("a")){
            this.x -= player_status.speed * dt;
        }
        if(keys_down.includes("d")){
            this.x += player_status.speed * dt;
        }
        //boundary check (so player doesn't go off the screen)
        if(this.x < 0){
            this.x = 0;
        }
        if(this.x > WIDTH){
            this.x = WIDTH;
        }
        if(this.y < 0){
            this.y = 0;
        }
        if(this.y > HEIGHT){
            this.y = HEIGHT;
        }
    }
}; 

// enemy object
var enemy = function(x, y, health, max_health, radius, color){
    return {
        x: x,
        y: y,
        health: health,
        max_health: max_health,
        radius: radius,
        collision: false,
        color: color,
        base_speed: 0.1,
        base_damage: 10,
        take_damage: function(damage){
            this.health -= damage;
        },
        render: function(ctx){
            ctx.save();
            // enemy
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            // health bar
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.radius, this.y - this.radius - 15, this.radius * 2, 10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - this.radius, this.y - this.radius - 15, (this.health / this.max_health) * this.radius * 2, 10);
            ctx.restore();
        },
        update: function(dt){
        // Move enemy towards player by its base_speed * dt
        var dx = player.x - this.x;
        var dy = player.y - this.y;
        var distancesq = distSquared(this.x, this.y, player.x, player.y);
        if (distancesq > 0) {
            var moveDist = this.base_speed * dt;
            var angle = angleBetweenPoints(this.x, this.y, player.x, player.y);
            this.x += Math.cos(angle) * moveDist;
            this.y += Math.sin(angle) * moveDist;
        }



        },
        respawn: function(){
            this.x = randomIntBetween(0, WIDTH);
            this.y = randomIntBetween(0, HEIGHT);
            this.health = this.max_health;
        }
    }
};

// projectile object
var projectile = function(x, y, initial_angle) {
    return {
        x: x,
        y: y,
        radius: 5,
        initial_angle: initial_angle,
        exists: true,
        render: function(ctx){
            ctx.save();
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        },
        update: function(dt){
            this.x += Math.cos(this.initial_angle) * player_status.projectile_speed * dt;
            this.y += Math.sin(this.initial_angle) * player_status.projectile_speed * dt;
            if(outOfBounds(this.x, this.y, WIDTH, HEIGHT)){
                this.exists = false;
            }
        },
    }
}
<<<<<<< Updated upstream
    
=======

function createDeathExplosion(x, y) {
    // Explosão principal
    createParticleExplosion(x, y, "#FF4500", 25); // Laranja
    createParticleExplosion(x, y, "#FFD700", 15); // Dourado
    createParticleExplosion(x, y, "#FF0000", 10); // Vermelho
    
    // Dano de explosão aos inimigos próximos
    if(player.upgrades.explosion_damage > 0) {
        var explosionRadius = getExplosionRadius();
        var explosionDamage = getExplosionDamage();
        
        for(var i = 0; i < enemies_list.length; i++) {
            var enemy = enemies_list[i];
            var distance = Math.sqrt((enemy.x - x) * (enemy.x - x) + (enemy.y - y) * (enemy.y - y));
            
            if(distance <= explosionRadius) {
                enemy.take_damage(explosionDamage);
                // Efeito visual de dano por explosão
                createParticleExplosion(enemy.x, enemy.y, "#FF6600", 8);
            }
        }
    }
    
    // Explosão secundária com delay
    setTimeout(function() {
        createParticleExplosion(x + randomIntBetween(-20, 20), y + randomIntBetween(-20, 20), "#FFA500", 10);
    }, 100);
}


>>>>>>> Stashed changes
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
    
    // Seleção de upgrades
    if(upgrade_interface_visible) {
        if(e.key === "1" && available_upgrades[0]) {
            applyUpgrade(available_upgrades[0]);
        } else if(e.key === "2" && available_upgrades[1]) {
            applyUpgrade(available_upgrades[1]);
        } else if(e.key === "3" && available_upgrades[2]) {
            applyUpgrade(available_upgrades[2]);
        }
    }
    
    // Resposta do quiz
    if(quiz_interface_visible) {
        if(e.key === "1") {
            answerQuiz(0);
        } else if(e.key === "2") {
            answerQuiz(1);
        } else if(e.key === "3") {
            answerQuiz(2);
        } else if(e.key === "4") {
            answerQuiz(3);
        }
    }
});
window.addEventListener("keyup", function(e) {
    keys_down = keys_down.filter(function(key) {
        return key !== e.key;
    });
});


// update function
function update(dt) {
<<<<<<< Updated upstream
    angle_between_player_and_mouse = angleBetweenPoints(player.x, player.y, mouse.x, mouse.y);
    player.update(dt);

    //projectile firing
    time_since_last_projectile += dt;
    if (mouse.mouseDown && time_since_last_projectile >= player_status.time_between_projectiles) {
        projectiles_list.push(new projectile(player.x, player.y, angle_between_player_and_mouse));
=======
    // Pausa o jogo se a interface de upgrade ou quiz estiver visível
    if(upgrade_interface_visible || quiz_interface_visible) {
        return;
    }
    
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
    if ((mouse.mouseDown || gamepadState.isShooting) && time_since_last_projectile >= getFireRate()) {
        // Tiro duplo
        if (isDoubleShot()) {
            var angle_offset = 0.2; // Pequeno offset para os dois tiros
            projectiles_list.push(new ProjectileObject(projectileSprite, player.x, player.y, angle_between_player_and_mouse - angle_offset, isPiercingShot()));
            projectiles_list.push(new ProjectileObject(projectileSprite, player.x, player.y, angle_between_player_and_mouse + angle_offset, isPiercingShot()));
        } else {
            projectiles_list.push(new ProjectileObject(projectileSprite, player.x, player.y, angle_between_player_and_mouse, isPiercingShot()));
        }
>>>>>>> Stashed changes
        time_since_last_projectile = 0;
    }
    
    //projectile updating
    projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });
    

    //player collision
    for(var i = 0; i < enemies_list.length; i++){
        if(aabbCircleCollision(player, enemies_list[i])){
            player.take_damage(enemies_list[i].base_damage);
        }
    }

    //projectile collision
    for(var i = 0; i < projectiles_list.length; i++){
        for(var j = 0; j < enemies_list.length; j++){
            if(aabbCircleCollision(projectiles_list[i], enemies_list[j])){
<<<<<<< Updated upstream
                projectiles_list[i].exists = false;	
                enemies_list[j].take_damage(player_status.damage);
                if(enemies_list[j].health <= 0){
                    enemies_list[j].respawn();
=======
                // Verifica se o projétil perfurante já atingiu este inimigo
                if(projectiles_list[i].isPiercing && projectiles_list[i].enemiesHit.includes(j)){
                    continue;
                }
                
                createParticleExplosion(enemies_list[j].x, enemies_list[j].y, "#8A2BE2", randomIntBetween(10, 20)); // Cor roxa para explosão do livro
                
                // Adiciona inimigo à lista de atingidos se for perfurante
                if(projectiles_list[i].isPiercing){
                    projectiles_list[i].enemiesHit.push(j);
                } else {
                    projectiles_list[i].exists = false;
                }
                
                enemies_list[j].take_damage(getPlayerDamage());
                
                // Cria explosão quando inimigo morre
                if(enemies_list[j].health <= 0) {
                    createDeathExplosion(enemies_list[j].x, enemies_list[j].y);
>>>>>>> Stashed changes
                }
            }
        }
    }

    // enemy updating
    enemies_list.forEach(function(enemy) {
        enemy.update(dt);
    });

    // remove projectiles that are no longer exists
    projectiles_list = projectiles_list.filter(function(projectile) {
        return projectile.exists;
    });
}

// render function
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //enemy rendering
    enemies_list.forEach(function(enemy) {
        enemy.render(ctx);
    });
    //player rendering
    player.render(ctx);
    //projectile rendering
    projectiles_list.forEach(function(projectile) {
        projectile.render(ctx);
    });
    //debug text
<<<<<<< Updated upstream
    ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.fillText("Mouse: x=" + mouse.x + " y=" + mouse.y, 20, 40);
    ctx.fillText("Angle: " + angle_between_player_and_mouse, 20, 60);
    ctx.fillText("Projectiles: " + projectiles_list.length, 20, 80);
    ctx.fillText("Player Health: " + player.health, 20, 100);
=======
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Vida: " + player.health + "/" + player_status.max_health, 20, 30);
    ctx.fillText("Nível: " + player.level, 20, 55);
    ctx.fillText("Experiência: " + player.experience + "/" + player.experience_to_next_level, 20, 80);
    ctx.fillText("Projéteis: " + projectiles_list.length, 20, 105);
    
    // Mostra upgrades ativos
    ctx.fillStyle = "yellow";
    ctx.font = "16px Arial";
    var yOffset = 130;
    for(var upgradeType in player.upgrades) {
        if(player.upgrades[upgradeType] > 0) {
            var upgradeText = upgrade_types[upgradeType].name + ": " + player.upgrades[upgradeType];
            if(upgradeType === "explosion_damage" && player.upgrades[upgradeType] > 0) {
                upgradeText += " (Dano: " + getExplosionDamage() + ", Raio: " + getExplosionRadius() + ")";
            }
            ctx.fillText(upgradeText, 20, yOffset);
            yOffset += 20;
        }
    }
    
    // Interface de upgrade
    if(upgrade_interface_visible) {
        renderUpgradeInterface(ctx);
    }
    
    // Interface de quiz
    if(quiz_interface_visible) {
        renderQuizInterface(ctx);
    }
}

// Função para renderizar interface de upgrade
function renderUpgradeInterface(ctx) {
    // Fundo semi-transparente
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Título
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ESCOLHA SEU UPGRADE", WIDTH / 2, 100);
    
    // Opções de upgrade
    var startX = WIDTH / 2 - 200;
    var startY = 200;
    var cardWidth = 120;
    var cardHeight = 150;
    var spacing = 20;
    
    for(var i = 0; i < available_upgrades.length; i++) {
        var upgradeType = available_upgrades[i];
        var upgrade = upgrade_types[upgradeType];
        var x = startX + i * (cardWidth + spacing);
        var y = startY;
        
        // Card background
        ctx.fillStyle = "rgba(50, 50, 50, 0.9)";
        ctx.fillRect(x, y, cardWidth, cardHeight);
        
        // Card border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cardWidth, cardHeight);
        
        // Upgrade name
        ctx.fillStyle = "yellow";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(upgrade.name, x + cardWidth/2, y + 30);
        
        // Current level
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText("Nível: " + player.upgrades[upgradeType] + "/" + upgrade.max_level, x + cardWidth/2, y + 50);
        
        // Description
        ctx.fillStyle = "lightgray";
        ctx.font = "12px Arial";
        var words = upgrade.description.split(' ');
        var line = '';
        var lineY = y + 70;
        for(var j = 0; j < words.length; j++) {
            var testLine = line + words[j] + ' ';
            var metrics = ctx.measureText(testLine);
            if(metrics.width > cardWidth - 10 && j > 0) {
                ctx.fillText(line, x + cardWidth/2, lineY);
                line = words[j] + ' ';
                lineY += 15;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x + cardWidth/2, lineY);
        
        // Key number
        ctx.fillStyle = "lime";
        ctx.font = "20px Arial";
        ctx.fillText((i + 1).toString(), x + cardWidth/2, y + cardHeight - 10);
    }
    
    // Instructions
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Pressione 1, 2 ou 3 para escolher", WIDTH / 2, HEIGHT - 50);
    
    ctx.textAlign = "left";
}

// Função para renderizar interface do quiz
function renderQuizInterface(ctx) {
    // Fundo semi-transparente
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Título
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("QUIZ OBRIGATÓRIO - " + (quiz_category === "tecnologia" ? "TECNOLOGIA" : "PIRAÍ"), WIDTH / 2, 80);
    
    // Instrução
    ctx.fillStyle = "yellow";
    ctx.font = "18px Arial";
    ctx.fillText("Acertar = Escolher Upgrade | Errar = Perder Vida", WIDTH / 2, 110);
    
    if(current_quiz_question) {
        // Pergunta
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.fillText(current_quiz_question.question, WIDTH / 2, 170);
        
        // Opções
        var startY = 220;
        var optionHeight = 40;
        var optionWidth = 400;
        var startX = WIDTH / 2 - optionWidth / 2;
        
        for(var i = 0; i < current_quiz_question.options.length; i++) {
            var y = startY + i * (optionHeight + 10);
            
            // Background da opção
            ctx.fillStyle = "rgba(50, 50, 50, 0.9)";
            ctx.fillRect(startX, y, optionWidth, optionHeight);
            
            // Borda da opção
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(startX, y, optionWidth, optionHeight);
            
            // Texto da opção
            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.textAlign = "left";
            ctx.fillText((i + 1) + ". " + current_quiz_question.options[i], startX + 10, y + 25);
        }
        
        // Instruções
        ctx.fillStyle = "lime";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Pressione 1, 2, 3 ou 4 para responder", WIDTH / 2, HEIGHT - 50);
    }
    
    ctx.textAlign = "left";
>>>>>>> Stashed changes
}

// run function
function run() {
    var now = performance.now();
    var dt = (now - lastUpdateTime);
    lastUpdateTime = now;
    update(dt);
    render();
    requestAnimationFrame(run);
}

function initialize() {
    //initialize enemies
    for(var i = 0; i < 10; i++){
        enemies_list.push(new enemy(randomIntBetween(0, WIDTH), randomIntBetween(0, HEIGHT), 100, 100, 20, "blue"));
    }
    //initialize last update time
    lastUpdateTime = performance.now();
    run();
}
initialize();
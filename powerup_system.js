// ========================================
// SISTEMA DE POWER-UPS TEMPORÁRIOS
// ========================================
// 
// Este arquivo contém:
// - 10 tipos de power-ups temporários
// - Sistema de spawn automático
// - Efeitos visuais e de gameplay
// - Controles especiais (tecla T para teleporte)
// - Integração com sistema de quiz
//
// ========================================

// Sistema de Power-ups
var activePowerUps = {};
var powerupSpawnTimer = 0;
var POWERUP_SPAWN_INTERVAL = 10000; // 10 segundos

// Lista de power-ups no jogo
var powerups_list = [];

// Sistema de controle de perguntas já utilizadas
var usedQuestions = {
    easy: [],
    normal: [],
    hard: []
};

// Sistema de teclado para controles especiais
var keys = {};

// ========================================
// CLASSE POWER-UP OBJECT
// ========================================
function PowerUpObject(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = 20;
    this.exists = true;
    this.collected = false;
    this.pulseTimer = 0;
    
    // Cores e ícones para cada tipo
    this.colors = {
        speed: '#00FF00',
        damage: '#FF0000',
        health: '#FF69B4',
        fire_rate: '#FFA500',
        shield: '#00BFFF',
        antivirus: '#32CD32',
        vpn: '#8A2BE2',
        cluster: '#FFD700',
        firewall: '#FF4500',
        proxy: '#00FFFF'
    };
    
    this.icons = {
        speed: '⚡',
        damage: '💪',
        health: '❤️',
        fire_rate: '🔥',
        shield: '🛡️',
        antivirus: '🦠',
        vpn: '🔒',
        cluster: '💥',
        firewall: '🔥',
        proxy: '🌀'
    };
}

PowerUpObject.prototype.update = function(dt) {
    this.pulseTimer += dt;
};

PowerUpObject.prototype.render = function(ctx, camera) {
    if (!this.exists || this.collected) return;
    
    var screenX = this.x - camera.x;
    var screenY = this.y - camera.y;
    
    // Efeito de pulsação
    var pulseScale = 1 + Math.sin(this.pulseTimer * 0.005) * 0.2;
    var radius = this.radius * pulseScale;
    
    // Desenhar círculo de fundo
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = this.colors[this.type];
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Desenhar borda
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Desenhar ícone
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.icons[this.type], screenX, screenY);
    
    ctx.restore();
};

// ========================================
// SISTEMA DE POWER-UPS
// ========================================
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
    
    // Mostrar quiz para escolher power-up adicional
    showPowerUpQuiz();
}

function applyPowerUpEffect(type) {
    var duration = 8000; // 8 segundos
    // Usar valores padrão sem depender de difficulty_modes
    
    switch(type) {
        case 'speed':
            if (!activePowerUps.speed) {
                activePowerUps.speed = { duration: duration, originalSpeed: player_status.speed };
                player_status.speed *= 1.25;
            }
            break;
        case 'damage':
            if (!activePowerUps.damage) {
                activePowerUps.damage = { duration: duration, originalDamage: player_status.damage };
                player_status.damage = Math.floor(player_status.damage * 1.3);
            }
            break;
        case 'health':
            player.health = Math.min(player.health + 20, player_status.max_health);
            break;
        case 'fire_rate':
            if (!activePowerUps.fire_rate) {
                activePowerUps.fire_rate = { duration: duration, originalRate: player_status.time_between_projectiles };
                player_status.time_between_projectiles *= 0.8;
            }
            break;
        case 'shield':
            if (!activePowerUps.shield) {
                activePowerUps.shield = { duration: duration };
                player.damage_reduction += 1;
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

// ========================================
// EFEITOS ESPECIAIS DOS POWER-UPS
// ========================================
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

// ========================================
// SISTEMA DE QUIZ PARA POWER-UPS
// ========================================
function showPowerUpQuiz() {
    var difficulty = 'normal'; // Usar dificuldade normal como padrão
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
            font-family: "Pixelify Sans", sans-serif;
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
        // Mostrar interface de seleção de power-ups
        createPowerUpSelectionInterface();
    } else {
        // Resposta incorreta: aplica um power-up básico aleatório
        var types = ['speed', 'damage', 'health', 'fire_rate', 'shield'];
        var randomType = types[Math.floor(Math.random() * types.length)];
        applyPowerUpEffect(randomType);
        
        // Mostrar resultado
        showQuizResult(false, randomType);
        
        // Continuar jogo
        gamePaused = false;
    }
}

// Função para criar a interface de seleção de power-ups
function createPowerUpSelectionInterface() {
    gamePaused = true;

    var availablePowerUpTypes = ['speed', 'damage', 'fire_rate', 'shield', 'antivirus', 'vpn', 'firewall', 'proxy'];
    var choices = [];
    while (choices.length < 3 && availablePowerUpTypes.length > 0) {
        var randomIndex = Math.floor(Math.random() * availablePowerUpTypes.length);
        choices.push(availablePowerUpTypes.splice(randomIndex, 1)[0]);
    }

    var selectionDiv = document.createElement('div');
    selectionDiv.id = 'powerUpSelectionInterface';
    selectionDiv.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.9); display: flex; flex-direction: column;
        justify-content: center; align-items: center; z-index: 3000; color: white;
    `;

    selectionDiv.innerHTML = `
        <h1 style="color: #4CAF50; font-size: 2.5em; margin-bottom: 20px; display: flex; align-items: center; gap: 15px;">
            <img src="images/checksign.png" style="height: 2em; image-rendering: pixelated;">
            CORRETO!
            <img src="images/checksign.png" style="height: 2em; image-rendering: pixelated;">
        </h1>
        <h2 style="color: #FFD700; font-size: 1.8em; margin-bottom: 30px;">Escolha um Power-Up adicional:</h2>
    `;

    var optionsContainer = document.createElement('div');
    optionsContainer.style.cssText = 'display: flex; gap: 20px;';

    const powerUpInfo = new PowerUpObject(0, 0, 'speed'); // Objeto para acessar ícones e cores
    const powerUpDescriptions = {
        speed: 'Aumenta sua velocidade de movimento.',
        damage: 'Aumenta o dano dos seus ataques.',
        fire_rate: 'Aumenta sua cadência de tiro.',
        shield: 'Reduz o dano recebido.',
        antivirus: 'Recupera vida ao derrotar inimigos.',
        vpn: 'Permite atravessar inimigos sem sofrer dano.',
        firewall: 'Causa uma onda de choque ao receber dano.',
        proxy: 'Permite que você se teleporte (tecla T).'
    };

    choices.forEach(type => {
        var optionButton = document.createElement('button');
        optionButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1); color: white;
            border: 3px solid ${powerUpInfo.colors[type] || '#FFFFFF'}; padding: 20px; border-radius: 10px;
            cursor: pointer; font-size: 1em; transition: all 0.3s ease; font-family: "Pixelify Sans", sans-serif;
            width: 200px; display: flex; flex-direction: column; align-items: center; text-align: center;
        `;
        optionButton.innerHTML = `
            <span style="font-size: 2em; margin-bottom: 10px;">${powerUpInfo.icons[type] || '?'}</span>
            <h3 style="margin: 0 0 10px 0; color: #FFD700; text-transform: capitalize;">${type.replace('_', ' ')}</h3>
            <p style="margin: 0; font-size: 0.9em; color: #eee;">${powerUpDescriptions[type] || 'Um power-up misterioso!'}</p>
        `;
        optionButton.addEventListener('click', function() {
            selectionDiv.remove();
            applyPowerUpEffect(type);
            showQuizResult(true, type);
            gamePaused = false;
        });
        optionsContainer.appendChild(optionButton);
    });

    selectionDiv.appendChild(optionsContainer);
    document.body.appendChild(selectionDiv);
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
    `;
    
    if (isCorrect) {
        resultDiv.innerHTML = `
            <h2 style="color: #4CAF50; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <img src="images/checksign.png" style="height: 2.4em; image-rendering: pixelated;">
                CORRETO!
            </h2>
            <p>Você ganhou um power-up adicional: <strong>${powerupType}</strong></p>
        `;
    } else {
        resultDiv.innerHTML = `
            <h2 style="color: #f44336; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <img src="images/wrongsign.png" style="height: 2.4em; image-rendering: pixelated;">
                INCORRETO
            </h2>
            <p>Você ainda ganha o power-up que coletou!</p>
        `;
    }
    
    document.body.appendChild(resultDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        resultDiv.remove();
    }, 3000);
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================
function getUnusedQuestion(difficulty) {
    var availableQuestions = CompleteQuizSystem.questions[difficulty] || CompleteQuizSystem.questions['normal'];
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
    
    // Aplicar embaralhamento para evitar que jogador decore posições
    return CompleteQuizSystem.shuffleOptions(selectedQuestion);
}

// Event listeners para teclado
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
    
    // Controle do teleporte Proxy (tecla T)
    if (event.key === 't' || event.key === 'T') {
        useProxyTeleport();
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

console.log('Sistema de power-ups carregado!');

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
    
    // Mostrar resultado do power-up coletado (sem quiz)
    showPowerUpResult(powerup.type);
}

function showPowerUpResult(powerupType) {
    // Mapear tipos para nomes e descrições (apenas os básicos originais)
    var powerUpInfo = {
        'speed': { name: 'Velocidade', description: 'Aumenta velocidade de movimento em 30%' },
        'damage': { name: 'Dano', description: 'Aumenta dano dos projéteis em 5 pontos' },
        'health': { name: 'Vida', description: 'Restaura 2 pontos de vida' },
        'fire_rate': { name: 'Cadência', description: 'Reduz tempo entre disparos em 30%' },
        'shield': { name: 'Escudo', description: 'Protege contra 3 ataques inimigos' }
    };
    
    var info = powerUpInfo[powerupType] || { name: powerupType, description: 'Power-up coletado!' };
    
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
        border: 3px solid #FFD700;
    `;
    
    resultDiv.innerHTML = `
        <h2 style="color: #4CAF50; margin-bottom: 15px;">✅ POWER-UP COLETADO!</h2>
        <h3 style="color: #FFD700; margin-bottom: 10px;">${info.name}</h3>
        <p style="margin-bottom: 20px; font-size: 1.1em;">${info.description}</p>
        <button onclick="this.parentElement.remove(); gamePaused = false;" 
                style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1em;">
            CONTINUAR JOGO
        </button>
    `;
    
    document.body.appendChild(resultDiv);
    
    // Pausar jogo temporariamente
    gamePaused = true;
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (resultDiv.parentElement) {
            resultDiv.remove();
            gamePaused = false;
        }
    }, 5000);
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
        // Mostrar interface de seleção de power-ups
        showPowerUpSelection();
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

// ========================================
// SISTEMA DE SELEÇÃO DE POWER-UPS
// ========================================
function showPowerUpSelection() {
    // Pausar jogo
    gamePaused = true;
    
    // Lista de power-ups disponíveis (apenas os básicos originais)
    var availablePowerUps = [
        { type: 'speed', name: 'Velocidade', description: 'Aumenta velocidade de movimento em 30%', icon: '⚡', color: '#00FF00' },
        { type: 'damage', name: 'Dano', description: 'Aumenta dano dos projéteis em 5 pontos', icon: '💪', color: '#FF0000' },
        { type: 'health', name: 'Vida', description: 'Restaura 2 pontos de vida', icon: '❤️', color: '#FF69B4' },
        { type: 'fire_rate', name: 'Cadência', description: 'Reduz tempo entre disparos em 30%', icon: '🔥', color: '#FFA500' },
        { type: 'shield', name: 'Escudo', description: 'Protege contra 3 ataques inimigos', icon: '🛡️', color: '#00BFFF' }
    ];
    
    // Selecionar 3 power-ups aleatórios
    var selectedPowerUps = [];
    var available = [...availablePowerUps];
    
    for (var i = 0; i < 3; i++) {
        var randomIndex = Math.floor(Math.random() * available.length);
        selectedPowerUps.push(available[randomIndex]);
        available.splice(randomIndex, 1);
    }
    
    // Criar interface
    var powerUpDiv = document.createElement('div');
    powerUpDiv.id = 'powerUpSelection';
    powerUpDiv.style.cssText = `
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
        z-index: 4000;
        color: white;
        font-family: 'Arial', sans-serif;
        pointer-events: auto;
    `;
    
    // Título
    var title = document.createElement('h1');
    title.textContent = '🎁 ESCOLHA SEU POWER-UP! 🎁';
    title.style.cssText = 'color: #FFD700; font-size: 2.5em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);';
    powerUpDiv.appendChild(title);
    
    // Container dos power-ups
    var powerUpsContainer = document.createElement('div');
    powerUpsContainer.style.cssText = 'display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; max-width: 800px;';
    
    selectedPowerUps.forEach((powerUp, index) => {
        var powerUpCard = document.createElement('div');
        powerUpCard.style.cssText = `
            background: linear-gradient(135deg, ${powerUp.color}20, ${powerUp.color}40);
            border: 3px solid ${powerUp.color};
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 200px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            user-select: none;
            pointer-events: auto;
            position: relative;
            z-index: 1;
        `;
        
        powerUpCard.innerHTML = `
            <div style="font-size: 3em; margin-bottom: 10px;">${powerUp.icon}</div>
            <h3 style="margin: 10px 0; color: ${powerUp.color}; font-size: 1.1em; line-height: 1.3;">${powerUp.description}</h3>
            <div style="background: ${powerUp.color}30; padding: 8px; border-radius: 8px; margin-top: 10px; font-size: 0.8em; color: #fff;">
                Clique para escolher
            </div>
        `;
        
        // Efeitos hover
        powerUpCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });
        
        powerUpCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });
        
        // Selecionar power-up
        powerUpCard.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            selectPowerUp(powerUp.type, powerUp.name);
        });
        
        powerUpsContainer.appendChild(powerUpCard);
    });
    
    powerUpDiv.appendChild(powerUpsContainer);
    
    // Instruções
    var instructions = document.createElement('p');
    instructions.textContent = 'Escolha um power-up para receber!';
    instructions.style.cssText = 'font-size: 1.2em; color: #ccc; margin-top: 30px;';
    powerUpDiv.appendChild(instructions);
    
    
    // Botão de teste temporário
    var testButton = document.createElement('button');
    testButton.textContent = '🧪 TESTE - Forçar Seleção';
    testButton.style.cssText = `
        background: #FF6B6B;
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 20px;
        font-size: 1.1em;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    testButton.addEventListener('click', function() {
        console.log('🧪 Botão de teste clicado - testando seleção');
        selectPowerUp('speed', 'Velocidade');
    });
    powerUpDiv.appendChild(testButton);
    
    document.body.appendChild(powerUpDiv);
    console.log('✅ Interface de seleção adicionada ao DOM!');
}

function selectPowerUp(powerUpType, powerUpName) {
    // Aplicar power-up escolhido
    applyPowerUpEffect(powerUpType);
    
    // Remover interface
    var powerUpDiv = document.getElementById('powerUpSelection');
    if (powerUpDiv) {
        powerUpDiv.remove();
    }
    
    // Continuar jogo
    gamePaused = false;
    
    // Mostrar confirmação
    showPowerUpSelectionResult(powerUpName);
}

function showPowerUpSelectionResult(powerUpName) {
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
        border: 2px solid #4CAF50;
    `;
    
    resultDiv.innerHTML = `
        <h2 style="color: #4CAF50; margin-bottom: 15px;">🎉 POWER-UP ESCOLHIDO!</h2>
        <p>Você escolheu: <strong style="color: #FFD700;">${powerUpName}</strong></p>
        <p style="font-size: 0.9em; margin-top: 10px; color: #ccc;">Boa sorte na batalha!</p>
    `;
    
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
    var availableQuestions = QuestionPoolObject.questions[difficulty] || QuestionPoolObject.questions['normal'];
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
    return QuestionPoolObject.shuffleOptions(selectedQuestion);
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

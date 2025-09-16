// Sistema de Upgrades e Quiz para Vampiraí Survivors

// Usar o sistema completo de perguntas do arquivo JSON
var QuizSystem = CompleteQuizSystem;

// Sistema de Upgrades disponíveis
var availableUpgrades = [
    {
        name: "Tiro Perfurante",
        description: "Projéteis atravessam inimigos",
        type: "piercing_shot",
        icon: "💥"
    },
    {
        name: "Tiro Duplo",
        description: "Dispara dois projéteis simultaneamente",
        type: "double_shot",
        icon: "⚡"
    },
    {
        name: "Redução de Dano",
        description: "Reduz dano recebido em 1",
        type: "damage_reduction",
        icon: "🛡️"
    },
    {
        name: "Zonas de Dano",
        description: "Cria zonas que causam dano",
        type: "damage_zones",
        icon: "💢"
    },
    {
        name: "Velocidade",
        description: "Aumenta velocidade de movimento",
        type: "speed_boost",
        icon: "🏃"
    },
    {
        name: "Taxa de Tiro",
        description: "Aumenta velocidade de disparo",
        type: "fire_rate",
        icon: "🔥"
    },
    {
        name: "Dano",
        description: "Aumenta dano dos projéteis",
        type: "damage_boost",
        icon: "💪"
    },
    {
        name: "Vida",
        description: "Aumenta vida máxima",
        type: "health_boost",
        icon: "❤️"
    },
    {
        name: "Experiência",
        description: "Aumenta ganho de experiência",
        type: "experience_boost",
        icon: "⭐"
    },
    {
        name: "Magnetismo",
        description: "Aumenta alcance de coleta de XP",
        type: "magnet_range",
        icon: "🧲"
    },
    {
        name: "Bumerangue",
        description: "Projéteis retornam ao jogador",
        type: "boomerang",
        icon: "🪃"
    },
    {
        name: "Explosão",
        description: "Projéteis explodem ao atingir inimigos",
        type: "explosive",
        icon: "💥"
    },
    {
        name: "Congelamento",
        description: "Projéteis congelam inimigos temporariamente",
        type: "freeze",
        icon: "❄️"
    },
    {
        name: "Vida Extra",
        description: "Ganha +1 vida máxima permanentemente",
        type: "extra_life",
        icon: "💖"
    },
    {
        name: "Velocidade de Projétil",
        description: "Projéteis voam 50% mais rápido",
        type: "projectile_speed",
        icon: "⚡"
    },
    {
        name: "Regeneração",
        description: "Regenera 1 HP a cada 3 segundos",
        type: "regeneration",
        icon: "🔄"
    },
    {
        name: "Multiplicador de XP",
        description: "Ganha 2x mais experiência",
        type: "xp_multiplier",
        icon: "🌟"
    }
];

// Variáveis do sistema de upgrade
var upgradeScreenVisible = false;
var currentQuizQuestion = null;
var selectedUpgrade = null;

// Função para mostrar tela de upgrade
function showUpgradeScreen() {
    upgradeScreenVisible = true;
    gamePaused = true;
    
    // Usar o sistema completo de perguntas
    var difficulty = 'normal'; // Usar dificuldade normal como padrão
    currentQuizQuestion = getUnusedQuestion(difficulty);
    
    // Criar interface de upgrade
    createUpgradeInterface();
}

// Função para criar interface de upgrade
function createUpgradeInterface() {
    // Remover interface anterior se existir
    var existingInterface = document.getElementById('upgradeInterface');
    if (existingInterface) {
        existingInterface.remove();
    }
    
    // Criar div da interface
    var upgradeDiv = document.createElement('div');
    upgradeDiv.id = 'upgradeInterface';
    upgradeDiv.style.cssText = `
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
        z-index: 2000;
        color: white;
        font-family: 'Arial', sans-serif;
    `;
    
    // Título
    var title = document.createElement('h1');
    title.textContent = '🎉 LEVEL UP! 🎉';
    title.style.cssText = 'color: #FFD700; font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);';
    upgradeDiv.appendChild(title);
    
    // Pergunta do quiz
    var questionDiv = document.createElement('div');
    questionDiv.style.cssText = 'background: rgba(255, 107, 107, 0.2); padding: 20px; border-radius: 10px; margin-bottom: 30px; max-width: 600px; text-align: center;';
    
    var questionText = document.createElement('h2');
    questionText.textContent = currentQuizQuestion.question;
    questionText.style.cssText = 'margin-bottom: 20px; font-size: 1.5em;';
    questionDiv.appendChild(questionText);
    
    // Opções de resposta
    var optionsDiv = document.createElement('div');
    optionsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
    
    currentQuizQuestion.options.forEach((option, index) => {
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
            selectAnswer(index);
        });
        
        optionsDiv.appendChild(optionButton);
    });
    
    questionDiv.appendChild(optionsDiv);
    upgradeDiv.appendChild(questionDiv);
    
    // Instruções
    var instructions = document.createElement('p');
    instructions.textContent = 'Responda corretamente para ganhar um upgrade especial!';
    instructions.style.cssText = 'font-size: 1.2em; color: #ccc; margin-top: 20px;';
    upgradeDiv.appendChild(instructions);
    
    document.body.appendChild(upgradeDiv);
}

// Função para criar interface de seleção de upgrades
function createUpgradeSelectionInterface() {
    // Pausar jogo
    gamePaused = true;
    
    // Selecionar 3 upgrades aleatórios
    var selectedUpgrades = [];
    var available = [...availableUpgrades];
    
    for (var i = 0; i < 3; i++) {
        var randomIndex = Math.floor(Math.random() * available.length);
        selectedUpgrades.push(available[randomIndex]);
        available.splice(randomIndex, 1);
    }
    
    // Criar div da interface
    var upgradeDiv = document.createElement('div');
    upgradeDiv.id = 'upgradeInterface';
    upgradeDiv.style.cssText = `
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
        z-index: 2000;
        color: white;
        font-family: 'Arial', sans-serif;
    `;
    
    // Título
    var title = document.createElement('h1');
    title.textContent = '🎉 LEVEL UP! 🎉';
    title.style.cssText = 'color: #FFD700; font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);';
    upgradeDiv.appendChild(title);
    
    // Instruções
    var instructions = document.createElement('p');
    instructions.textContent = 'Escolha um upgrade para continuar:';
    instructions.style.cssText = 'font-size: 1.5em; margin-bottom: 30px; color: #ccc;';
    upgradeDiv.appendChild(instructions);
    
    // Container dos upgrades
    var upgradesContainer = document.createElement('div');
    upgradesContainer.style.cssText = 'display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; max-width: 900px;';
    
    // Criar interface
    var upgradeDiv = document.createElement('div');
    upgradeDiv.id = 'upgradeSelection';
    upgradeDiv.style.cssText = `
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
        z-index: 1000;
        font-family: 'Courier New', monospace;
    `;
    
    upgradeDiv.innerHTML = `
        <div style="background: #1a1a1a; padding: 30px; border-radius: 15px; border: 3px solid #ff6b6b; max-width: 600px; text-align: center;">
            <h2 style="color: #ff6b6b; margin-bottom: 20px; font-size: 1.8em;">🎯 ESCOLHA SEU UPGRADE!</h2>
            <p style="color: #ccc; margin-bottom: 30px; font-size: 1.1em;">Você acertou a pergunta! Escolha um upgrade:</p>
            
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                ${selectedUpgrades.map((upgrade, index) => `
                    <div class="upgrade-option" data-upgrade="${upgrade.type}" style="
                        background: #2a2a2a;
                        border: 2px solid #ff6b6b;
                        border-radius: 10px;
                        padding: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 150px;
                        text-align: center;
                    " onmouseover="this.style.background='#3a3a3a'; this.style.borderColor='#ffd700';" onmouseout="this.style.background='#2a2a2a'; this.style.borderColor='#ff6b6b';">
                        <div style="font-size: 2em; margin-bottom: 10px;">${upgrade.icon}</div>
                        <h3 style="color: #ffd700; margin-bottom: 10px; font-size: 1.2em;">${upgrade.name}</h3>
                        <p style="color: #ccc; font-size: 0.9em;">${upgrade.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(upgradeDiv);
    
    // Adicionar event listeners
    document.querySelectorAll('.upgrade-option').forEach(option => {
        option.addEventListener('click', function() {
            var upgradeType = this.dataset.upgrade;
            selectUpgrade(upgradeType);
        });
    });
    
    upgradeDiv.appendChild(upgradesContainer);
    document.body.appendChild(upgradeDiv);
}

// Função para aplicar upgrade
function applyUpgrade(upgradeType) {
    switch(upgradeType) {
        case 'piercing_shot':
            player_status.piercing_shot = true;
            break;
        case 'double_shot':
            player_status.double_shot = true;
            break;
        case 'damage_reduction':
            player.damage_reduction += 1;
            break;
        case 'damage_zones':
            player_status.damage_zones = true;
            break;
        case 'speed_boost':
            player_status.speed *= 1.2;
            break;
        case 'fire_rate':
            player_status.time_between_projectiles *= 0.8;
            break;
        case 'damage_boost':
            player_status.damage += 5;
            break;
        case 'health_boost':
            player_status.max_health += 20;
            player.health += 20;
            break;
        case 'experience_boost':
            player_status.experience_multiplier = 1.5;
            break;
        case 'magnet_range':
            player_status.magnet_max_distance += 50;
            break;
        case 'boomerang':
            player.boomerang = true;
            break;
        case 'explosive':
            player.explosive = true;
            break;
        case 'freeze':
            player.freeze = true;
            break;
        case 'extra_life':
            player.extra_lives += 1;
            player.max_health += 20;
            player.health += 20;
            break;
        case 'projectile_speed':
            player.projectile_speed_multiplier *= 1.5;
            break;
        case 'regeneration':
            player.regeneration = true;
            break;
        case 'xp_multiplier':
            player.xp_multiplier *= 2.0;
            break;
    }
}

// Função para selecionar upgrade
function selectUpgrade(upgradeType) {
    // Aplicar upgrade
    applyUpgrade(upgradeType);
    
    // Remover interface
    var upgradeDiv = document.getElementById('upgradeSelection');
    if (upgradeDiv) {
        upgradeDiv.remove();
    }
    
    // Despausar jogo
    gamePaused = false;
    
    // Mostrar resultado
    showUpgradeResult(true, upgradeType);
}

// Função para selecionar resposta
function selectAnswer(selectedIndex) {
    var isCorrect = selectedIndex === currentQuizQuestion.correct;
    
    // Remover interface atual
    var upgradeInterface = document.getElementById('upgradeInterface');
    if (upgradeInterface) {
        upgradeInterface.remove();
    }
    
    if (isCorrect) {
        // Se acertou, mostrar seleção de 3 upgrades
        createUpgradeSelectionInterface();
    } else {
        // Se errou, mostrar resultado e upgrade básico
        showUpgradeResult(false, null);
    }
}

// Função para mostrar resultado do upgrade
function showUpgradeResult(correct, upgradeType) {
    var resultDiv = document.createElement('div');
    resultDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${correct ? '#4CAF50' : '#F44336'};
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 1.5em;
        font-weight: bold;
        z-index: 1001;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    
    if (correct) {
        resultDiv.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px;">🎉</div>
            <div>UPGRADE SELECIONADO!</div>
            <div style="font-size: 0.8em; margin-top: 10px;">${upgradeType}</div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
            <div>RESPOSTA INCORRETA</div>
            <div style="font-size: 0.8em; margin-top: 10px;">Upgrade básico aplicado</div>
        `;
    }
    
    document.body.appendChild(resultDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        resultDiv.remove();
    }, 3000);
}

// Função para aplicar upgrade básico
function applyBasicUpgrade() {
    var basicUpgrades = ['health_boost', 'damage_boost', 'speed_boost'];
    var randomUpgrade = basicUpgrades[Math.floor(Math.random() * basicUpgrades.length)];
    applyUpgrade(randomUpgrade);
}

// Função para fechar tela de upgrade
function closeUpgradeScreen() {
    var resultDiv = document.getElementById('upgradeResult');
    if (resultDiv) {
        resultDiv.remove();
    }
    
    upgradeScreenVisible = false;
    gamePaused = false;
}

// Modificar a função levelUp no game_objects.js para usar o sistema de upgrade
function triggerUpgradeScreen() {
    showUpgradeScreen();
}

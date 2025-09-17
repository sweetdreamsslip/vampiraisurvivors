// Sistema de Upgrades e Quiz para Vampiraí Survivors


// usar global QuestionPoolObject

// Sistema de upgrades disponíveis
var availableUpgrades = {
    "tech_boost": {
        name: "Impulso Tecnológico",
        description: "Aumenta velocidade de movimento em 20%",
        effect: function() {
            player_status.speed *= 1.2;
        }
    },
    "speed_boost": {
        name: "Velocidade Supersônica",
        description: "Aumenta velocidade de movimento em 30%",
        effect: function() {
            player_status.speed *= 1.3;
        }
    },
    "health_boost": {
        name: "Vida Extra",
        description: "Aumenta vida máxima em 50 pontos",
        effect: function() {
            player_status.max_health += 50;
            player.health = player_status.max_health;
        }
    },
    "damage_boost": {
        name: "Dano Devastador",
        description: "Aumenta dano em 5 pontos",
        effect: function() {
            player_status.damage += 5;
        }
    },
    "projectile_speed": {
        name: "Projéteis Relâmpago",
        description: "Aumenta velocidade dos projéteis em 40%",
        effect: function() {
            player_status.projectile_speed *= 1.4;
        }
    },
    "fire_rate": {
        name: "Taxa de Tiro Rápida",
        description: "Reduz tempo entre disparos em 30%",
        effect: function() {
            player_status.time_between_projectiles *= 0.7;
        }
    },
    "magnet_range": {
        name: "Ímã de Experiência",
        description: "Aumenta alcance de atração de experiência em 50%",
        effect: function() {
            player_status.magnet_max_distance *= 1.5;
        }
    },
    "invincibility_time": {
        name: "Invencibilidade Estendida",
        description: "Aumenta tempo de invencibilidade em 50%",
        effect: function() {
            player_status.invincibility_time *= 1.5;
        }
    },
    "experience_boost": {
        name: "Experiência Duplicada",
        description: "Ganha 2x mais experiência",
        effect: function() {
            experienceMultiplier = 2;
        }
    }
};

// Variáveis do sistema de upgrade
var upgradeScreenVisible = false;
var currentQuizQuestion = null;
var selectedUpgrade = null;

// Função para mostrar tela de upgrade
function showUpgradeScreen() {
    upgradeScreenVisible = true;
    gamePaused = true;
    
    currentQuizQuestion = QuestionPoolObject.shuffleOptions(QuestionPoolObject.getRandomQuestion(quiz_difficulty));
    
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
    `;
    
    // Título
    var title = document.createElement('h1');
    title.style.cssText = 'color: #FFD700; font-size: 2.25em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; gap: 20px;';
    title.innerHTML = `
        <img src="images/lvl.png" alt="Ícone de Level Up" style="height: 1em; image-rendering: pixelated;">
        LEVEL UP!
        <img src="images/lvl.png" alt="Ícone de Level Up" style="height: 1em; image-rendering: pixelated;">
    `;
    upgradeDiv.appendChild(title);
    
    // Pergunta do quiz
    var questionDiv = document.createElement('div');
    questionDiv.style.cssText = 'background: #faf3e0; color: #000000; border: 6px solid #e4a83a; border-radius: 15px; box-shadow: 0 0 0 3px #402c1a; padding: 20px; margin-bottom: 30px; max-width: 600px; text-align: center;';
    
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
            background: transparent;
            color: #000000;
            font-weight: bold;
            border: 3px solid #402c1a;
            border-radius: 8px;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 1.1em;
            text-align: left;
            transition: all 0.2s ease;
        `;
        
        optionButton.addEventListener('mouseenter', function() {
            this.style.background = '#402c1a';
            this.style.color = '#faf3e0';
            this.style.transform = 'scale(1.02)';
        });
        
        optionButton.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.color = '#000000';
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

// Função para selecionar resposta
function selectAnswer(selectedIndex) {
    var isCorrect = selectedIndex === currentQuizQuestion.correct;
    
    // Remover interface atual
    var upgradeInterface = document.getElementById('upgradeInterface');
    if (upgradeInterface) {
        upgradeInterface.remove();
    }
    
    // Mostrar resultado
    showUpgradeResult(isCorrect);
}

// Função para mostrar resultado do upgrade
function showUpgradeResult(isCorrect) {
    var resultDiv = document.createElement('div');
    resultDiv.id = 'upgradeResult';
    resultDiv.style.cssText = `
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
    `;
    
    // Selecionar upgrade aleatório
    var upgradeKeys = Object.keys(availableUpgrades);
    var randomUpgradeKey = upgradeKeys[Math.floor(Math.random() * upgradeKeys.length)];
    var upgrade = availableUpgrades[randomUpgradeKey];
    
    // Aplicar upgrade
    upgrade.effect();
    
    if (isCorrect) {
        // Título de sucesso
        var title = document.createElement('h1');
        title.textContent = '✅ RESPOSTA CORRETA! ✅';
        title.style.cssText = 'color: #4CAF50; font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);';
        resultDiv.appendChild(title);
        
        // Informações do upgrade
        var upgradeInfo = document.createElement('div');
        upgradeInfo.style.cssText = 'background: rgba(76, 175, 80, 0.2); padding: 30px; border-radius: 15px; text-align: center; max-width: 500px;';
        
        var upgradeName = document.createElement('h2');
        upgradeName.textContent = upgrade.name;
        upgradeName.style.cssText = 'color: #FFD700; font-size: 2em; margin-bottom: 15px;';
        upgradeInfo.appendChild(upgradeName);
        
        var upgradeDesc = document.createElement('p');
        upgradeDesc.textContent = upgrade.description;
        upgradeDesc.style.cssText = 'font-size: 1.3em; margin-bottom: 20px;';
        upgradeInfo.appendChild(upgradeDesc);
        
        resultDiv.appendChild(upgradeInfo);
        
    } else {
        // Título de erro
        var title = document.createElement('h1');
        title.textContent = '❌ RESPOSTA INCORRETA ❌';
        title.style.cssText = 'color: #f44336; font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);';
        resultDiv.appendChild(title);
        
        // Resposta correta
        var correctAnswer = document.createElement('div');
        correctAnswer.style.cssText = 'background: rgba(244, 67, 54, 0.2); padding: 20px; border-radius: 10px; text-align: center; max-width: 500px;';
        
        var correctText = document.createElement('p');
        correctText.textContent = `Resposta correta: ${currentQuizQuestion.options[currentQuizQuestion.correct]}`;
        correctText.style.cssText = 'font-size: 1.3em; margin-bottom: 15px;';
        correctAnswer.appendChild(correctText);
        
        var explanation = document.createElement('p');
        explanation.textContent = 'Você ainda ganha um upgrade!';
        explanation.style.cssText = 'font-size: 1.1em; color: #FFD700;';
        correctAnswer.appendChild(explanation);
        
        resultDiv.appendChild(correctAnswer);
        
        // Informações do upgrade (mesmo para resposta incorreta)
        var upgradeInfo = document.createElement('div');
        upgradeInfo.style.cssText = 'background: rgba(76, 175, 80, 0.2); padding: 30px; border-radius: 15px; text-align: center; max-width: 500px; margin-top: 20px;';
        
        var upgradeName = document.createElement('h2');
        upgradeName.textContent = upgrade.name;
        upgradeName.style.cssText = 'color: #FFD700; font-size: 2em; margin-bottom: 15px;';
        upgradeInfo.appendChild(upgradeName);
        
        var upgradeDesc = document.createElement('p');
        upgradeDesc.textContent = upgrade.description;
        upgradeDesc.style.cssText = 'font-size: 1.3em; margin-bottom: 20px;';
        upgradeInfo.appendChild(upgradeDesc);
        
        resultDiv.appendChild(upgradeInfo);
    }
    
    // Botão para continuar
    var continueButton = document.createElement('button');
    continueButton.textContent = 'CONTINUAR JOGO';
    continueButton.style.cssText = `
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 15px 30px;
        font-size: 1.2em;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 30px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    continueButton.addEventListener('mouseenter', function() {
        this.style.background = '#ff5252';
        this.style.transform = 'scale(1.05)';
    });
    
    continueButton.addEventListener('mouseleave', function() {
        this.style.background = '#ff6b6b';
        this.style.transform = 'scale(1)';
    });
    
    continueButton.addEventListener('click', function() {
        closeUpgradeScreen();
    });
    
    resultDiv.appendChild(continueButton);
    document.body.appendChild(resultDiv);
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

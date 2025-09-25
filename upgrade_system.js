// Sistema de Upgrades e Quiz para Vampiraí Survivors


// usar global QuestionPoolObject

// Sistema de upgrades disponíveis
var availableUpgrades = {
    "tech_boost": {
        name: "Impulso Tecnológico",
        description: "Aumenta velocidade de movimento em 20%",
        icon: "images/movespeedupgrade.png",
        effect: function() {
            player_status.speed *= 1.2;
        }
    },
    "speed_boost": {
        name: "Velocidade Supersônica",
        description: "Aumenta velocidade de movimento em 30%",
        icon: "images/movespeedupgrade.png",
        effect: function() {
            player_status.speed *= 1.3;
        }
    },
    "health_boost": {
        name: "Vida Extra",
        description: "Aumenta vida máxima em 50 pontos",
        icon: "images/heart.png",
        effect: function() {
            player_status.max_health += 50;
            player.health = player_status.max_health;
        }
    },
    "damage_boost": {
        name: "Dano Devastador",
        description: "Aumenta dano em 5 pontos",
        icon: "images/tiroperfurante.png",
        effect: function() {
            player_status.damage += 5;
        }
    },
    "projectile_speed": {
        name: "Projéteis Relâmpago",
        description: "Aumenta velocidade dos projéteis em 40%",
        icon: "images/attackspeedupgrade.png",
        effect: function() {
            player_status.projectile_speed *= 1.4;
        }
    },
    "fire_rate": {
        name: "Taxa de Tiro Rápida",
        description: "Reduz tempo entre disparos em 30%",
        icon: "images/attackspeedupgrade.png",
        effect: function() {
            player_status.time_between_projectiles *= 0.7;
        }
    },
    "magnet_range": {
        name: "Ímã de Experiência",
        description: "Aumenta alcance de atração de experiência em 50%",
        icon: "images/magnetico.png",
        effect: function() {
            player_status.magnet_max_distance *= 1.5;
        }
    },
    "invincibility_time": {
        name: "Invencibilidade Estendida",
        description: "Aumenta tempo de invencibilidade em 50%",
        icon: "images/escudo.png",
        effect: function() {
            player_status.invincibility_time *= 1.5;
        }
    },
    "experience_boost": {
        name: "Experiência Duplicada",
        description: "Ganha 2x mais experiência",
        icon: "images/xpemdobro.png",
        effect: function() {
            experienceMultiplier = 2;
        }
    },
    "freezing_shot": {
        name: "Tiro Congelante",
        description: "25% de chance de congelar inimigos por 2 segundos.",
        icon: "images/tirocongelante.png",
        effect: function() {
            player_status.has_freezing_shot = true;
        }
    },
    "boomerang_shot": {
        name: "Tiro Bumerangue",
        description: "Projéteis perfuram e retornam para você.",
        icon: "images/bumerange.png",
        effect: function() {
            player_status.has_boomerang_shot = true;
        }
    },
    "gun_drone_unlock": {
        name: "Companheiro Canino",
        description: "Ganha um cão de guarda que atira nos inimigos.",
        icon: "images/Dogpeticon.png",
        effect: function() {
            if (gun_drones_list.length === 0) {
                gun_drones_list.push(new GunDroneObject(player.x + 60, player.y, 60));
            }
        }
    },
};

// Variáveis do sistema de upgrade
var upgradeScreenVisible = false;
var currentQuizQuestion = null;
var selectedUpgrade = null;
var quiz_difficulty = 'normal'; // Adicionado para compatibilidade

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
            font-family: "Pixelify Sans", sans-serif;
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

    if (isCorrect) {
        // Resposta correta: mostra a tela de seleção de upgrades.
        createUpgradeSelectionInterface();
    } else {
        // Resposta incorreta: mostra o resultado com um upgrade aleatório.
        showUpgradeResult(false);
    }
}

// Função para criar a interface de seleção de upgrades
function createUpgradeSelectionInterface() {
    gamePaused = true;

    // Selecionar 3 upgrades aleatórios e únicos
    var upgradeKeys = Object.keys(availableUpgrades);
    var selectedUpgrades = [];
    while (selectedUpgrades.length < 3 && upgradeKeys.length > 0) {
        var randomIndex = Math.floor(Math.random() * upgradeKeys.length);
        selectedUpgrades.push(upgradeKeys.splice(randomIndex, 1)[0]);
    }

    var selectionDiv = document.createElement('div');
    selectionDiv.id = 'upgradeSelectionInterface';
    selectionDiv.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9);
        display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 2000; color: white;
    `;

    selectionDiv.innerHTML = `
        <h1 style="color: #4CAF50; font-size: 2.5em; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 15px;">
            <img src="images/checksign.png" style="height: 2em; image-rendering: pixelated;">
            RESPOSTA CORRETA!
            <img src="images/checksign.png" style="height: 2em; image-rendering: pixelated;">
        </h1>
        <h2 style="color: #FFD700; font-size: 1.8em; margin-bottom: 30px;">Escolha seu upgrade:</h2>
    `;

    var optionsContainer = document.createElement('div');
    optionsContainer.style.cssText = 'display: flex; gap: 20px; justify-content: center; align-items: stretch;';

    selectedUpgrades.forEach(upgradeKey => {
        var upgrade = availableUpgrades[upgradeKey];
        var optionButton = document.createElement('button');
        optionButton.className = 'upgrade-option-button';
        optionButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1); color: white; border: 3px solid #FFD700;
            padding: 20px; border-radius: 10px; cursor: pointer; font-size: 1em;
            transition: all 0.3s ease; width: 220px; display: flex; flex-direction: column; font-family: "Pixelify Sans", sans-serif;
            justify-content: space-between; text-align: center; align-items: center;
        `;
        optionButton.innerHTML = `
            <img src="${upgrade.icon}" alt="${upgrade.name}" style="width: 64px; height: 64px; margin-bottom: 10px; image-rendering: pixelated;">
            <h3 style="margin: 0 0 10px 0; color: #FFD700; font-size: 1.3em;">${upgrade.name}</h3>
            <p style="margin: 0; font-size: 0.9em; color: #eee;">${upgrade.description}</p>
        `;
        optionButton.addEventListener('click', function() {
            upgrade.effect();
            selectionDiv.remove();
            showUpgradeResult(true, upgrade);
        });
        optionsContainer.appendChild(optionButton);
    });

    selectionDiv.appendChild(optionsContainer);
    document.body.appendChild(selectionDiv);
}

// Função para mostrar resultado do upgrade
function showUpgradeResult(isCorrect, chosenUpgrade = null) {
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

    var upgrade;
    if (chosenUpgrade) {
        upgrade = chosenUpgrade;
    } else {
        // Para respostas incorretas, seleciona e aplica um upgrade aleatório
        var upgradeKeys = Object.keys(availableUpgrades);
        var randomUpgradeKey = upgradeKeys[Math.floor(Math.random() * upgradeKeys.length)];
        upgrade = availableUpgrades[randomUpgradeKey];
        upgrade.effect();
    }

    if (isCorrect) {
        // Título de sucesso
        var title = document.createElement('h1');
        title.style.cssText = 'color: #4CAF50; font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 15px;';
        title.innerHTML = `
            <img src="images/checksign.png" style="height: 2em; image-rendering: pixelated;">
            UPGRADE ADQUIRIDO!
            <img src="images/checksign.png" style="height: 2em; image-rendering: pixelated;">
        `;
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
        title.style.cssText = 'color: #f44336; font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 15px;';
        title.innerHTML = `
            <img src="images/wrongsign.png" style="height: 2em; image-rendering: pixelated;">
            RESPOSTA INCORRETA
            <img src="images/wrongsign.png" style="height: 2em; image-rendering: pixelated;">
        `;
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
        font-family: "Pixelify Sans", sans-serif;
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

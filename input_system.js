/**
 * SISTEMA DE INPUT
 * Responsável por: controles, teclado, mouse, gamepad
 * 
 * Como usar:
 * - setupInputListeners() - configura todos os event listeners
 * - handleUpgradeInput(key) - processa input para upgrades
 * - handleQuizInput(key) - processa input para quiz
 */

// Função para configurar todos os event listeners
function setupInputListeners() {
    // Mouse events
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
    
    // Keyboard events
    window.addEventListener("keydown", function(e) {
        keys_down.push(e.key);
        
        // Seleção de upgrades
        if(isUpgradeInterfaceVisible()) {
            handleUpgradeInput(e.key);
        }
        
        // Resposta do quiz
        if(isQuizInterfaceVisible()) {
            handleQuizInput(e.key);
        }
    });
    
    window.addEventListener("keyup", function(e) {
        keys_down = keys_down.filter(function(key) {
            return key !== e.key;
        });
    });
}

// Função para processar input de upgrades
function handleUpgradeInput(key) {
    if(key === "1" && available_upgrades[0]) {
        applyUpgrade(available_upgrades[0]);
    } else if(key === "2" && available_upgrades[1]) {
        applyUpgrade(available_upgrades[1]);
    } else if(key === "3" && available_upgrades[2]) {
        applyUpgrade(available_upgrades[2]);
    }
}

// Função para processar input de quiz
function handleQuizInput(key) {
    if(key === "1") {
        answerQuiz(0);
    } else if(key === "2") {
        answerQuiz(1);
    } else if(key === "3") {
        answerQuiz(2);
    } else if(key === "4") {
        answerQuiz(3);
    }
}

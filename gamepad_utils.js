let previousButtons = [];

function pollGamepad() {
    const state = {
        moveVector: { x: 0, y: 0 },
        isShooting: false,
        aimAngle: null,
        buttons: {
            a: false, // A button (index 0)
            start: false, // Start button (index 9)
            up: false, // D-pad up (index 12)
            down: false, // D-pad down (index 13)
        },
        justPressed: { // To detect single presses
            a: false,
            start: false,
            up: false,
            down: false,
        }
    };

    if (!is_gamepad_connected) {
        if (previousButtons.length > 0) previousButtons = [];
        return state;
    }
    const gp = navigator.getGamepads()[0];
    if (!gp) {
        if (previousButtons.length > 0) previousButtons = [];
        return state;
    }

    // --- Movimento do Jogador (Analógico Esquerdo: eixos 0, 1) ---
    const leftStickX = gp.axes[0];
    const leftStickY = gp.axes[1];
    const moveDeadzone = 0.2;
    if (Math.abs(leftStickX) > moveDeadzone) state.moveVector.x = leftStickX;
    if (Math.abs(leftStickY) > moveDeadzone) state.moveVector.y = leftStickY;

    // --- Mira e Disparo (Analógico Direito: eixos 2, 3) ---
    const rightStickX = gp.axes[2];
    const rightStickY = gp.axes[3];
    const aimDeadzone = 0.25;
    if (Math.sqrt(rightStickX * rightStickX + rightStickY * rightStickY) > aimDeadzone) {
        state.aimAngle = Math.atan2(rightStickY, rightStickX);
        state.isShooting = true; // Atira quando o analógico de mira é movido
    }

    // --- Mira e Disparo com Botões de Face (prioriza o analógico direito) ---
    // Se o analógico de mira não estiver sendo usado, checa os botões de face.
    // Mapeamento: X (esquerda), Y (cima), B (direita), A (baixo)
    if (state.aimAngle === null) {
        const shootButtonA = gp.buttons[0]?.pressed; // A (baixo)
        const shootButtonB = gp.buttons[1]?.pressed; // B (direita)
        const shootButtonX = gp.buttons[2]?.pressed; // X (esquerda)
        const shootButtonY = gp.buttons[3]?.pressed; // Y (cima)

        if (shootButtonX) {
            state.aimAngle = Math.PI; // Esquerda
            state.isShooting = true;
        } else if (shootButtonY) {
            state.aimAngle = -Math.PI / 2; // Cima
            state.isShooting = true;
        } else if (shootButtonB) {
            state.aimAngle = 0; // Direita
            state.isShooting = true;
        } else if (shootButtonA) {
            state.aimAngle = Math.PI / 2; // Baixo
            state.isShooting = true;
        }
    }

    // --- Movimento pelo D-Pad (prioriza o analógico) ---
    // Se o analógico não estiver sendo usado para um eixo, checa o D-Pad.
    if (state.moveVector.x === 0) {
        if (gp.buttons[14] && gp.buttons[14].pressed) state.moveVector.x = -1; // Esquerda
        else if (gp.buttons[15] && gp.buttons[15].pressed) state.moveVector.x = 1; // Direita
    }
    if (state.moveVector.y === 0) {
        if (gp.buttons[12] && gp.buttons[12].pressed) state.moveVector.y = -1; // Cima
        else if (gp.buttons[13] && gp.buttons[13].pressed) state.moveVector.y = 1; // Baixo
    }

    // Normaliza o vetor de movimento para evitar que o movimento diagonal seja mais rápido
    const mag = Math.sqrt(state.moveVector.x * state.moveVector.x + state.moveVector.y * state.moveVector.y);
    if (mag > 1) {
        state.moveVector.x /= mag;
        state.moveVector.y /= mag;
    }

    // --- Button Presses for Menus ---
    const buttonMap = {
        a: 0,
        start: 9,
        up: 12,
        down: 13,
    };

    for (const btnName in buttonMap) {
        const btnIndex = buttonMap[btnName];
        if (gp.buttons[btnIndex]) {
            state.buttons[btnName] = gp.buttons[btnIndex].pressed;
            // Check if it was just pressed (pressed now, but not in the previous frame)
            if (state.buttons[btnName] && !(previousButtons[btnIndex]?.pressed)) {
                state.justPressed[btnName] = true;
            }
        }
    }
    // Store current button states for the next poll
    previousButtons = gp.buttons.map(b => ({ pressed: b.pressed, value: b.value }));

    return state;
}
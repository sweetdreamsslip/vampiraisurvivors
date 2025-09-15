function pollGamepad() {
    const state = {
        moveVector: { x: 0, y: 0 },
        isShooting: false,
        aimAngle: null
    };

    if (!is_gamepad_connected) return state;
    const gp = navigator.getGamepads()[0];
    if (!gp) return state;

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

    return state;
}
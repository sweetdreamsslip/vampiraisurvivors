/**
 * ARQUIVO PRINCIPAL DO JOGO
 * 
 * Este arquivo coordena todos os sistemas do jogo.
 * Para trabalhar em equipe, cada pessoa pode editar um arquivo específico:
 * 
 * - config.js: Configurações e dados (upgrades, quiz, etc.)
 * - game_objects.js: Objetos do jogo (player, enemy, projectile, etc.)
 * - upgrade_system.js: Sistema de upgrades
 * - quiz_system.js: Sistema de quiz
 * - explosion_system.js: Sistema de explosões
 * - level_system.js: Sistema de level up
 * - input_system.js: Sistema de controles
 * - render_system.js: Sistema de renderização
 * - game_loop.js: Loop principal do jogo
 * - utils.js: Funções utilitárias
 * - gamepad_utils.js: Utilitários de gamepad
 */

// Configuração do canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lastUpdateTime;

var WIDTH = window.innerWidth-20;
var HEIGHT = window.innerHeight-20;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Configurações base do jogador
var player_status = {
    speed: 0.4,
    max_health: 100,
    projectile_speed: 1,
    time_between_projectiles: 5,
    damage: 10,
    invincibility_time: 1000,
}

// Variáveis globais
var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;
var time_since_last_enemy_spawn = 0;

// Objetos do jogo
var player;
var enemies_list = [];
var projectiles_list = [];
var particles_list = [];
var experience_orbs_list = [];

// Controles
var mouse = {
    x: 0,
    y: 0,
    mouseDown: false,
};
var keys_down = [];

// Inicializar o jogo quando a página carregar
window.addEventListener('load', function() {
    initialize();
});

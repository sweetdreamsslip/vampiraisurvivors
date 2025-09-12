var player_status_configurations = {
    "default": {
        speed: 0.4,
        max_health: 100,
        projectile_speed: 0.7,
        time_between_projectiles: 100,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 200,
    },
    "debug": {
        speed: 1,
        max_health: 100,
        projectile_speed: 1,
        time_between_projectiles: 5,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 100,
    },
    "custom": {
        speed: 0.5,
        max_health: 100,
        projectile_speed: 1,
        time_between_projectiles: 100,
        damage: 10,
        invincibility_time: 1000,
        magnet_max_distance: 100,
    }
}


var enemy_spawn_configurations = {
    "default": {
        time_between_enemy_spawn: 500,
    },
    "debug": {
        time_between_enemy_spawn: 100,
    }
}

var selected_enemy_spawn_configuration = "default";
var selected_player_status_configuration = "default";

// Sistema de upgrades
var upgrade_types = {
    "piercing_shot": {
        name: "Tiro Perfurante",
        description: "Projéteis atravessam inimigos",
        max_level: 3,
        base_cost: 10
    },
    "double_shot": {
        name: "Tiro Duplo", 
        description: "Dispara dois projéteis simultaneamente",
        max_level: 3,
        base_cost: 15
    },
    "damage_boost": {
        name: "Dano Aumentado",
        description: "Aumenta o dano dos projéteis",
        max_level: 5,
        base_cost: 8
    },
    "fire_rate": {
        name: "Taxa de Tiro",
        description: "Aumenta a velocidade de disparo",
        max_level: 5,
        base_cost: 12
    },
    "projectile_speed": {
        name: "Velocidade do Projétil",
        description: "Aumenta a velocidade dos projéteis",
        max_level: 3,
        base_cost: 10
    },
    "explosion_damage": {
        name: "Dano de Explosão",
        description: "Causa dano aos inimigos próximos quando morrem",
        max_level: 5,
        base_cost: 15
    }
};

// Sistema de Quiz
var quiz_questions = {
    "tecnologia": [
        {
            question: "Qual linguagem de programação é conhecida por ser 'interpretada' e ter tipagem dinâmica?",
            options: ["Java", "Python", "C++", "Assembly"],
            correct: 1
        },
        {
            question: "O que significa HTTP em termos de protocolos web?",
            options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "Home Transfer Text Protocol", "Hyper Transfer Text Protocol"],
            correct: 0
        },
        {
            question: "Qual é a principal diferença entre GET e POST em requisições HTTP?",
            options: ["GET é mais rápido", "POST envia dados no corpo da requisição", "GET é mais seguro", "POST não funciona com HTTPS"],
            correct: 1
        },
        {
            question: "O que é um 'loop infinito' em programação?",
            options: ["Um loop que nunca termina", "Um loop muito rápido", "Um loop com muitos elementos", "Um loop que executa apenas uma vez"],
            correct: 0
        },
        {
            question: "Qual estrutura de dados é LIFO (Last In, First Out)?",
            options: ["Fila", "Pilha", "Lista", "Array"],
            correct: 1
        }
    ],
    "pirai": [
        {
            question: "Piraí é conhecida como a 'Capital da Informática' de qual estado?",
            options: ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Espírito Santo"],
            correct: 1
        },
        {
            question: "Qual é o principal setor econômico de Piraí?",
            options: ["Agricultura", "Tecnologia da Informação", "Indústria Têxtil", "Mineração"],
            correct: 1
        },
        {
            question: "Piraí fica localizada em qual região do Rio de Janeiro?",
            options: ["Região Metropolitana", "Norte Fluminense", "Sul Fluminense", "Costa Verde"],
            correct: 2
        },
        {
            question: "Qual é o nome do principal rio que banha Piraí?",
            options: ["Rio Paraíba do Sul", "Rio Piraí", "Rio Guandu", "Rio Macaé"],
            correct: 0
        },
        {
            question: "Piraí é conhecida por ter qual tipo de polo tecnológico?",
            options: ["Polo de Eletrônicos", "Polo de Software", "Polo de Telecomunicações", "Polo de Biotecnologia"],
            correct: 1
        }
    ]
};
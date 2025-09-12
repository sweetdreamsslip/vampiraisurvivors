/**
 * SISTEMA DE QUIZ
 * Responsável por: gerenciar perguntas, interface de quiz, validação de respostas
 * 
 * Como usar:
 * - showQuizInterface() - mostra interface de quiz
 * - answerQuiz(optionIndex) - processa resposta do jogador
 * - isQuizInterfaceVisible() - verifica se interface está visível
 * - renderQuizInterface(ctx) - renderiza interface do quiz
 */

// Variáveis do sistema de quiz
var quiz_interface_visible = false;
var current_quiz_question = null;
var quiz_category = "tecnologia";

// Função para mostrar interface de quiz
function showQuizInterface() {
    quiz_interface_visible = true;
    generateQuizQuestion();
}

// Função para gerar pergunta do quiz
function generateQuizQuestion() {
    var questions = quiz_questions[quiz_category];
    current_quiz_question = questions[Math.floor(Math.random() * questions.length)];
}

// Função para responder quiz
function answerQuiz(optionIndex) {
    if(current_quiz_question && optionIndex === current_quiz_question.correct) {
        // Resposta correta - mostra interface de upgrade
        createParticleExplosion(player.x, player.y, "#00FF00", 20); // Explosão verde
        quiz_interface_visible = false;
        showUpgradeInterface();
    } else {
        // Resposta errada - perde vida e continua o jogo
        player.take_damage(10);
        createParticleExplosion(player.x, player.y, "#FF0000", 15); // Explosão vermelha
        quiz_interface_visible = false;
    }
    
    current_quiz_question = null;
    
    // Alterna categoria do quiz
    quiz_category = quiz_category === "tecnologia" ? "pirai" : "tecnologia";
}

// Função para renderizar interface do quiz
function renderQuizInterface(ctx) {
    // Fundo semi-transparente
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Título
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("QUIZ OBRIGATÓRIO - " + (quiz_category === "tecnologia" ? "TECNOLOGIA" : "PIRAÍ"), WIDTH / 2, 80);
    
    // Instrução
    ctx.fillStyle = "yellow";
    ctx.font = "18px Arial";
    ctx.fillText("Acertar = Escolher Upgrade | Errar = Perder Vida", WIDTH / 2, 110);
    
    if(current_quiz_question) {
        // Pergunta
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.fillText(current_quiz_question.question, WIDTH / 2, 170);
        
        // Opções
        var startY = 220;
        var optionHeight = 40;
        var optionWidth = 400;
        var startX = WIDTH / 2 - optionWidth / 2;
        
        for(var i = 0; i < current_quiz_question.options.length; i++) {
            var y = startY + i * (optionHeight + 10);
            
            // Background da opção
            ctx.fillStyle = "rgba(50, 50, 50, 0.9)";
            ctx.fillRect(startX, y, optionWidth, optionHeight);
            
            // Borda da opção
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(startX, y, optionWidth, optionHeight);
            
            // Texto da opção
            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.textAlign = "left";
            ctx.fillText((i + 1) + ". " + current_quiz_question.options[i], startX + 10, y + 25);
        }
        
        // Instruções
        ctx.fillStyle = "lime";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Pressione 1, 2, 3 ou 4 para responder", WIDTH / 2, HEIGHT - 50);
    }
    
    ctx.textAlign = "left";
}

// Função para verificar se interface está visível
function isQuizInterfaceVisible() {
    return quiz_interface_visible;
}

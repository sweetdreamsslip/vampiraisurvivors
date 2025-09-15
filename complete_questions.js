// Sistema completo de perguntas do arquivo perguntas_jogo_completo.json
// Processadas e categorizadas por dificuldade

var CompleteQuizSystem = {
    questions: {
        easy: [
            // PIRAI - FÁCIL (competência 1)
            {
                question: "Qual é o nome do rio que corta a cidade de Piraí?",
                options: ["Rio Piraí", "Rio Paraíba do Sul", "Rio Guandu", "Rio Grande"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Piraí está localizado em qual estado do Brasil?",
                options: ["Rio de Janeiro", "Minas Gerais", "São Paulo", "Espírito Santo"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é a cor predominante na bandeira de Piraí?",
                options: ["Azul", "Verde", "Vermelho", "Amarelo"],
                correct: 0,
                category: "Piraí"
            },
            
            // MATEMÁTICA - FÁCIL (competência 1)
            {
                question: "Quanto é 5 x 7?",
                options: ["35", "36", "30", "42"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é a metade de 20?",
                options: ["10", "5", "15", "12"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quantos lados tem um quadrado?",
                options: ["4", "3", "5", "6"],
                correct: 0,
                category: "Matemática"
            },
            
            // TECNOLOGIA - FÁCIL (competência 1)
            {
                question: "Qual botão usamos para ligar o computador?",
                options: ["Botão Power", "Botão Reset", "Botão de Volume", "Botão de Ejetar CD"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Para que serve um QR Code?",
                options: ["Acessar informações rapidamente com o celular", "Proteger senha", "Armazenar fotos", "Fazer backup de dados"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Para que serve uma senha?",
                options: ["Proteger acesso a informações", "Aumentar a velocidade da internet", "Baixar aplicativos", "Formatar o computador"],
                correct: 0,
                category: "Tecnologia"
            },
            
            // CIÊNCIA - FÁCIL (competência 1)
            {
                question: "O que usamos para respirar?",
                options: ["Pulmões", "Estômago", "Coração", "Fígado"],
                correct: 0,
                category: "Ciência"
            }
        ],
        
        normal: [
            // PIRAI - NORMAL (competência 2)
            {
                question: "Qual é o nome do principal hospital público da cidade?",
                options: ["Hospital Flávio Leal", "Hospital da Posse", "Santa Casa de Barra do Piraí", "Hospital São João Batista"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é a cidade vizinha que mais influencia o comércio e a economia de Piraí?",
                options: ["Barra do Piraí", "Resende", "Volta Redonda", "Pinheiral"],
                correct: 0,
                category: "Piraí"
            },
            
            // MATEMÁTICA - NORMAL (competência 2)
            {
                question: "Qual é a raiz quadrada de 144?",
                options: ["12", "14", "10", "16"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Se você vê 5 bicicletas, quantas rodas tem no total?",
                options: ["10", "12", "15", "8"],
                correct: 0,
                category: "Matemática"
            },
            
            // TECNOLOGIA - NORMAL (competência 2)
            {
                question: "O que é nuvem (cloud)?",
                options: ["Armazenamento de dados pela internet", "Um antivírus", "Um servidor físico em casa", "Um programa de edição de fotos"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é um e-mail?",
                options: ["Um correio eletrônico", "Um aplicativo de mensagem instantânea", "Um antivírus", "Um documento digital"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é um link?",
                options: ["Uma conexão para acessar outra página ou recurso", "Um antivírus", "Um tipo de vírus", "Um banco de dados"],
                correct: 0,
                category: "Tecnologia"
            },
            
            // CIÊNCIA - NORMAL (competência 2)
            {
                question: "Quantos ossos tem o corpo humano?",
                options: ["206", "210", "201", "190"],
                correct: 0,
                category: "Ciência"
            }
        ],
        
        hard: [
            // PIRAI - DIFÍCIL (competência 3)
            {
                question: "Qual é o apelido popular da Praça São Sebastião em Piraí?",
                options: ["Praça da Preguiça", "Praça da Liberdade", "Praça Central", "Praça da Matriz"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Em que mês geralmente acontece a Piraí Fest?",
                options: ["Setembro", "Agosto", "Outubro", "Novembro"],
                correct: 2,
                category: "Piraí"
            },
            {
                question: "Qual o nome da igreja famosa dedicada a uma santa em Piraí?",
                options: ["Paróquia Senhora Sant'Ana.", "Igreja São Sebastião", "Igreja Nossa Senhora da Conceição", "Igreja São Benedito"],
                correct: 0,
                category: "Piraí"
            },
            
            // MATEMÁTICA - DIFÍCIL (competência 3)
            {
                question: "Quanto é (8 + 2) × 3?",
                options: ["30", "24", "28", "32"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Um produto custa R$ 200 e está com 10% de desconto. Qual é o valor final?",
                options: ["180", "190", "175", "185"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Se um trem sai às 14h e chega às 16h30, quanto tempo durou a viagem?",
                options: ["2h30min", "2h", "3h", "2h15min"],
                correct: 0,
                category: "Matemática"
            },
            
            // TECNOLOGIA - DIFÍCIL (competência 3)
            {
                question: "O que é programação?",
                options: ["Dar instruções para o computador executar tarefas", "Montar peças de hardware", "Instalar cabos de rede", "Criar senhas fortes"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que significa IA?",
                options: ["Inteligência Artificial", "Interface Analógica", "Internet Automática", "Inovação Avançada"],
                correct: 0,
                category: "Tecnologia"
            },
            
            // CIÊNCIA - DIFÍCIL (competência 3)
            {
                question: "O que é um eclipse solar?",
                options: ["Quando a Lua passa entre a Terra e o Sol", "Quando a Terra passa entre o Sol e a Lua", "Quando o Sol se apaga temporariamente", "Quando a Lua desaparece no céu"],
                correct: 0,
                category: "Ciência"
            }
        ]
    },
    
    getRandomQuestion: function(difficulty) {
        var questions = this.questions[difficulty] || this.questions['normal'];
        return questions[Math.floor(Math.random() * questions.length)];
    }
};

console.log('Sistema completo de perguntas carregado!');
// Sistema de perguntas carregado com sucesso
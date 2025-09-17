// ========================================
// SISTEMA DE PERGUNTAS COMPLETO
// ========================================

var CompleteQuizSystem = {
    questions: {
        easy: [
            // MATEMÁTICA - FÁCIL (competência 1)
            {
                question: "Quanto é 6 + 8?",
                options: ["14", "15", "12", "16"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Qual é o dobro de 12?",
                options: ["24", "22", "14", "26"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quantos segundos há em 1 minuto?",
                options: ["60", "100", "30", "90"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é 25 – 9?",
                options: ["16", "14", "12", "18"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Qual é o sucessor do número 49?",
                options: ["50", "51", "48", "52"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Se tenho 7 laranjas e como 2, quantas restam?",
                options: ["5", "4", "6", "3"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é a metade de 60?",
                options: ["30", "20", "25", "15"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é 3 × 6?",
                options: ["18", "12", "16", "20"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quantos lados tem um pentágono?",
                options: ["5", "6", "4", "7"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é 14 + 11?",
                options: ["25", "24", "23", "26"],
                correct: 0,
                category: "Matemática"
            },

            // CIÊNCIA - FÁCIL (competência 1)
            {
                question: "Qual planeta é conhecido como \"Planeta Vermelho\"?",
                options: ["Marte", "Vênus", "Júpiter", "Saturno"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "O que usamos para ouvir sons?",
                options: ["Ouvidos", "Olhos", "Nariz", "Boca"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é o astro que ilumina a noite?",
                options: ["Lua", "Estrela do mar", "Vênus", "Plutão"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual animal bota ovos e vive na água?",
                options: ["Peixe", "Cavalo", "Gato", "Cachorro"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "A água congela a quantos graus Celsius?",
                options: ["0°C", "10°C", "–10°C", "5°C"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é o maior planeta do Sistema Solar?",
                options: ["Júpiter", "Marte", "Terra", "Netuno"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual parte da planta é responsável por absorver água?",
                options: ["Raiz", "Folha", "Tronco", "Flor"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual animal produz lã?",
                options: ["Ovelha", "Cavalo", "Boi", "Porco"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual planeta está mais próximo do Sol?",
                options: ["Mercúrio", "Vênus", "Marte", "Terra"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Onde vivem os ursos polares?",
                options: ["Polo Norte", "Polo Sul", "África", "Austrália"],
                correct: 0,
                category: "Ciência"
            },

            // TECNOLOGIA - FÁCIL (competência 1)
            {
                question: "O que é um teclado?",
                options: ["Um dispositivo de digitação", "Um programa de computador", "Um tipo de vírus", "Um cabo de energia"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual ícone geralmente usamos para salvar arquivos?",
                options: ["Disquete", "Lápis", "Relógio", "Pasta"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual é a função da tecla \"Enter\"?",
                options: ["Confirmar comandos", "Apagar texto", "Desligar o PC", "Aumentar volume"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual dispositivo usamos para conectar na internet sem fio?",
                options: ["Roteador", "Impressora", "Scanner", "Pen drive"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que significa a sigla SMS?",
                options: ["Short Message Service", "Sistema de Memória Secundária", "Serviço de Música Simples", "Software de Mensagens Seguras"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual aplicativo usamos para ver vídeos no celular?",
                options: ["YouTube", "Word", "Excel", "Paint"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que significa \".jpg\" em um arquivo?",
                options: ["Formato de imagem", "Vídeo", "Música", "Texto"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual é a função da lixeira no computador?",
                options: ["Guardar arquivos apagados", "Salvar senhas", "Acelerar internet", "Proteger contra vírus"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é um aplicativo?",
                options: ["Um programa que executa tarefas", "Um cabo de rede", "Uma música", "Um antivírus"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual dispositivo usamos para armazenar arquivos e é removível?",
                options: ["Pen drive", "Monitor", "Teclado", "Roteador"],
                correct: 0,
                category: "Tecnologia"
            },

            // PIRAÍ - FÁCIL (competência 1)
            {
                question: "Piraí está em qual região do estado do Rio de Janeiro?",
                options: ["Sul Fluminense", "Região dos Lagos", "Norte Fluminense", "Metropolitana"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual fruta é tradicionalmente associada à economia de Piraí?",
                options: ["Banana", "Maçã", "Laranja", "Uva"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual rodovia liga Piraí a grandes centros como Rio e São Paulo?",
                options: ["Rodovia Presidente Dutra", "BR-101", "BR-040", "RJ-116"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual bairro é considerado central em Piraí?",
                options: ["Centro", "Arrozal", "Jaqueira", "Varjão"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual rio abastece parte da população de Piraí?",
                options: ["Rio Piraí", "Rio Grande", "Rio Guandu", "Rio Preto"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Em que data é comemorado o aniversário da cidade de Piraí?",
                options: ["17 de outubro", "10 de dezembro", "7 de setembro", "15 de novembro"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Piraí é conhecida pela festa da qual comida típica?",
                options: ["Peixe", "Pizza", "Macarrão", "Milho"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é a altitude aproximada da cidade de Piraí?",
                options: ["350 m", "500 m", "200 m", "100 m"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual desses municípios faz divisa com Piraí?",
                options: ["Volta Redonda", "Angra dos Reis", "Petrópolis", "Itaguaí"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é o clima predominante em Piraí?",
                options: ["Tropical", "Semiárido", "Polar", "Desértico"],
                correct: 0,
                category: "Piraí"
            }
        ],

        normal: [
            // MATEMÁTICA - NORMAL (competência 2)
            {
                question: "Quanto é 72 ÷ 9?",
                options: ["8", "7", "6", "9"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Qual é a raiz quadrada de 121?",
                options: ["11", "10", "12", "9"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Se um carro anda 90 km em 1h30min, qual é a velocidade média?",
                options: ["60 km/h", "70 km/h", "80 km/h", "75 km/h"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Qual é o perímetro de um triângulo com lados 5, 6 e 7 cm?",
                options: ["18", "20", "15", "16"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é 150 – 85?",
                options: ["65", "70", "60", "55"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Se uma caixa tem 36 chocolates e 9 pessoas dividem igualmente, quantos cada uma recebe?",
                options: ["4", "6", "5", "3"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é (20 × 3) – 25?",
                options: ["35", "45", "40", "30"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Um retângulo tem base 12 cm e altura 3 cm. Qual é a área?",
                options: ["36 cm²", "24 cm²", "40 cm²", "30 cm²"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Qual é o triplo de 18?",
                options: ["54", "56", "52", "48"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Qual é a centena seguinte depois de 900?",
                options: ["1000", "1100", "950", "990"],
                correct: 0,
                category: "Matemática"
            },

            // CIÊNCIA - NORMAL (competência 2)
            {
                question: "O que é a camada de ozônio?",
                options: ["Uma camada que protege a Terra dos raios solares", "Uma nuvem de fumaça", "Uma parte do oceano", "Uma camada de gelo"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é a função dos pulmões?",
                options: ["Realizar as trocas gasosas", "Bombear sangue", "Produzir hormônios", "Produzir energia"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "O que é energia solar?",
                options: ["Energia obtida da luz do Sol", "Energia das ondas do mar", "Energia do vento", "Energia do carvão"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é o planeta mais distante do Sol?",
                options: ["Netuno", "Saturno", "Urano", "Júpiter"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "O que é metamorfose?",
                options: ["Transformação de um ser vivo em outra fase", "Aumento de peso", "Redução de tamanho", "Divisão celular"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é o nome do gás liberado pelas plantas na fotossíntese?",
                options: ["Oxigênio", "Dióxido de carbono", "Hidrogênio", "Nitrogênio"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "O que é um ecossistema?",
                options: ["Conjunto de seres vivos e ambiente", "Apenas as plantas", "Apenas os animais", "Apenas a água"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é a principal fonte de energia dos seres humanos?",
                options: ["Alimentos", "Água", "Sol", "Vento"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual planeta tem os anéis mais visíveis?",
                options: ["Saturno", "Júpiter", "Netuno", "Urano"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é a função do coração?",
                options: ["Bombear sangue", "Produzir energia", "Filtrar impurezas", "Auxiliar respiração"],
                correct: 0,
                category: "Ciência"
            },

            // TECNOLOGIA - NORMAL (competência 2)
            {
                question: "O que é uma planilha eletrônica?",
                options: ["Programa para cálculos e tabelas", "Programa para edição de vídeos", "Programa antivírus", "Programa para fotos"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual é a função do navegador Chrome?",
                options: ["Acessar páginas da internet", "Editar textos", "Criar músicas", "Proteger arquivos"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é antivírus?",
                options: ["Programa que combate softwares maliciosos", "Aplicativo de fotos", "Impressora", "Sistema operacional"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que significa \"download\"?",
                options: ["Baixar arquivos da internet", "Enviar arquivos", "Apagar dados", "Conectar cabos"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é upload?",
                options: ["Enviar arquivos para a internet", "Baixar arquivos", "Excluir dados", "Formatar computador"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é um navegador de internet?",
                options: ["Programa para acessar páginas da web", "Programa para criar tabelas", "Programa de música", "Programa antivírus"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é rede social?",
                options: ["Plataforma de interação online", "Jogo eletrônico", "Programa de antivírus", "Impressora"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que significa PDF?",
                options: ["Portable Document Format", "Programa de Fotos Digitais", "Plano de Dados Fixos", "Pasta de Documentos Fácil"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é uma senha forte?",
                options: ["Conjunto difícil de adivinhar", "Palavra simples", "Nome próprio", "Número de telefone"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual é a principal função de um servidor?",
                options: ["Fornecer serviços a outros computadores", "Imprimir documentos", "Reproduzir músicas", "Criar planilhas"],
                correct: 0,
                category: "Tecnologia"
            },

            // PIRAÍ - NORMAL (competência 2)
            {
                question: "Qual distrito de Piraí é conhecido pela represa?",
                options: ["Ribeirão das Lajes", "Jaqueira", "Arrozal", "Varjão"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual município vizinho possui forte indústria siderúrgica?",
                options: ["Volta Redonda", "Miguel Pereira", "Itatiaia", "Vassouras"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Em que ano Piraí foi elevada à categoria de cidade?",
                options: ["1874", "1850", "1822", "1900"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é a principal rodovia estadual que passa por Piraí?",
                options: ["RJ-145", "RJ-116", "RJ-155", "RJ-115"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual setor econômico foi historicamente forte em Piraí?",
                options: ["Agricultura", "Mineração", "Turismo", "Siderurgia"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é a população aproximada de Piraí?",
                options: ["30 mil habitantes", "50 mil habitantes", "20 mil habitantes", "80 mil habitantes"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é a principal praça do Centro de Piraí?",
                options: ["Praça da Preguiça", "Praça São João", "Praça Tiradentes", "Praça 15"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é o nome da área de preservação ambiental localizada no centro de Piraí-RJ, conhecida por suas trilhas e contato com a natureza?",
                options: ["Parque da Mata do Amador", "Parque Lage", "Parque Nacional de Itatiaia", "Parque Barão de Mauá"],
                correct: 0,
                category: "Piraí"
            }
        ],

        hard: [
            // MATEMÁTICA - DIFÍCIL (competência 3)
            {
                question: "Qual é a raiz quadrada de 144?",
                options: ["12", "11", "13", "10"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é 15% de 200?",
                options: ["30", "25", "35", "20"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Qual é o valor de x na equação 2x + 5 = 17?",
                options: ["6", "5", "7", "4"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Qual é a área de um círculo com raio 7 cm? (π ≈ 3,14)",
                options: ["153,86 cm²", "154 cm²", "152 cm²", "155 cm²"],
                correct: 0,
                category: "Matemática"
            },
            {
                question: "Quanto é 8² + 6²?",
                options: ["100", "98", "102", "96"],
                correct: 0,
                category: "Matemática"
            },

            // CIÊNCIA - DIFÍCIL (competência 3)
            {
                question: "Qual é a velocidade da luz no vácuo?",
                options: ["300.000 km/s", "150.000 km/s", "450.000 km/s", "600.000 km/s"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é o processo pelo qual as plantas produzem seu próprio alimento?",
                options: ["Fotossíntese", "Respiração", "Digestão", "Fermentação"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é a unidade básica da vida?",
                options: ["Célula", "Átomo", "Molécula", "Órgão"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é o gás mais abundante na atmosfera terrestre?",
                options: ["Nitrogênio", "Oxigênio", "Dióxido de carbono", "Argônio"],
                correct: 0,
                category: "Ciência"
            },
            {
                question: "Qual é o processo de divisão celular que produz células idênticas?",
                options: ["Mitose", "Meiose", "Fotossíntese", "Respiração"],
                correct: 0,
                category: "Ciência"
            },

            // TECNOLOGIA - DIFÍCIL (competência 3)
            {
                question: "O que significa HTML?",
                options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Management Language"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual é a função de um firewall?",
                options: ["Proteger contra acessos não autorizados", "Acelerar a internet", "Armazenar arquivos", "Reproduzir vídeos"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que é um algoritmo?",
                options: ["Sequência de passos para resolver um problema", "Tipo de hardware", "Programa de computador", "Dispositivo de armazenamento"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "Qual é a diferença entre RAM e ROM?",
                options: ["RAM é volátil, ROM é permanente", "RAM é permanente, ROM é volátil", "Não há diferença", "RAM é mais rápida que ROM"],
                correct: 0,
                category: "Tecnologia"
            },
            {
                question: "O que significa CPU?",
                options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Computer Program Unit"],
                correct: 0,
                category: "Tecnologia"
            },

            // PIRAÍ - DIFÍCIL (competência 3)
            {
                question: "Qual é o nome do distrito de Piraí que abriga a Usina Hidrelétrica de Lajes?",
                options: ["Ribeirão das Lajes", "Jaqueira", "Arrozal", "Varjão"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é o nome da principal rodovia federal que corta Piraí?",
                options: ["BR-116 (Rodovia Presidente Dutra)", "BR-101", "BR-040", "BR-393"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é o nome do rio que dá nome à cidade de Piraí?",
                options: ["Rio Piraí", "Rio Grande", "Rio Guandu", "Rio Preto"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é o nome da principal festa popular de Piraí?",
                options: ["Festa do Peixe", "Festa da Banana", "Festa do Milho", "Festa da Cana"],
                correct: 0,
                category: "Piraí"
            },
            {
                question: "Qual é o nome do distrito de Piraí que possui uma estação ferroviária?",
                options: ["Arrozal", "Jaqueira", "Varjão", "Ribeirão das Lajes"],
                correct: 0,
                category: "Piraí"
            }
        ]
    },

    getRandomQuestion: function(difficulty) {
        var questions = this.questions[difficulty];
        if (!questions || questions.length === 0) {
            return null;
        }
        return questions[Math.floor(Math.random() * questions.length)];
    },

    shuffleOptions: function(question) {
        if (!question || !question.options) return question;
        
        var shuffled = question.options.slice();
        var correctAnswer = shuffled[question.correct];
        
        // Embaralha as opções
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        
        // Encontra a nova posição da resposta correta
        var newCorrect = shuffled.indexOf(correctAnswer);
        
        return {
            question: question.question,
            options: shuffled,
            correct: newCorrect,
            category: question.category
        };
    }
};

// Função para obter pergunta não usada (compatibilidade)
function getUnusedQuestion(difficulty) {
    return CompleteQuizSystem.getRandomQuestion(difficulty);
}

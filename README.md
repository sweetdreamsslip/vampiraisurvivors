# Vampirai Survivors - Jogo Educativo

## Estrutura do Projeto para Trabalho em Equipe

Este projeto foi organizado em módulos separados para facilitar o trabalho em equipe. Cada pessoa pode trabalhar em um arquivo específico sem conflitos.

### 📁 Estrutura de Arquivos

#### **Arquivos Principais**
- `index.html` - Página principal do jogo
- `main.js` - Coordenador principal (NÃO EDITAR)
- `style.css` - Estilos do jogo

#### **Arquivos de Configuração**
- `config.js` - Configurações, upgrades, perguntas do quiz
- `game_objects.js` - Definições dos objetos do jogo (player, enemy, projectile)

#### **Sistemas Modulares (Cada um pode ser editado independentemente)**

##### 🎯 **upgrade_system.js** - Sistema de Upgrades
**Responsável por:** Gerenciar upgrades do jogador
**Funções principais:**
- `showUpgradeInterface()` - Mostra interface de seleção
- `applyUpgrade(upgradeType)` - Aplica upgrade específico
- `getPlayerDamage()` - Calcula dano atual
- `getProjectileSpeed()` - Calcula velocidade dos projéteis
- `isPiercingShot()` - Verifica tiro perfurante
- `isDoubleShot()` - Verifica tiro duplo

##### 🧠 **quiz_system.js** - Sistema de Quiz
**Responsável por:** Perguntas e respostas educativas
**Funções principais:**
- `showQuizInterface()` - Mostra interface de quiz
- `answerQuiz(optionIndex)` - Processa resposta
- `generateQuizQuestion()` - Gera pergunta aleatória
- `renderQuizInterface(ctx)` - Renderiza interface

##### 💥 **explosion_system.js** - Sistema de Explosões
**Responsável por:** Efeitos visuais e dano em área
**Funções principais:**
- `createParticleExplosion(x, y, color, count)` - Cria explosão de partículas
- `createDeathExplosion(x, y)` - Explosão quando inimigo morre
- `getExplosionDamage()` - Calcula dano de explosão
- `getExplosionRadius()` - Calcula raio de explosão

##### 📈 **level_system.js** - Sistema de Level Up
**Responsável por:** Experiência e progressão
**Funções principais:**
- `initializePlayerLevel()` - Inicializa sistema de level
- `checkLevelUp()` - Verifica se subiu de nível
- `renderLevelInfo(ctx)` - Renderiza informações de nível

##### 🎮 **input_system.js** - Sistema de Controles
**Responsável por:** Teclado, mouse, gamepad
**Funções principais:**
- `setupInputListeners()` - Configura controles
- `handleUpgradeInput(key)` - Processa input de upgrades
- `handleQuizInput(key)` - Processa input de quiz

##### 🎨 **render_system.js** - Sistema de Renderização
**Responsável por:** Desenhar tudo na tela
**Funções principais:**
- `render()` - Função principal de renderização
- `renderHUD(ctx)` - Renderiza HUD
- `renderInterfaces(ctx)` - Renderiza interfaces

##### 🔄 **game_loop.js** - Game Loop
**Responsável por:** Loop principal do jogo
**Funções principais:**
- `initialize()` - Inicializa o jogo
- `update(dt)` - Atualiza lógica
- `run()` - Loop principal

#### **Utilitários**
- `utils.js` - Funções utilitárias (colisão, matemática, etc.)
- `gamepad_utils.js` - Suporte a gamepad

### 👥 **Como Trabalhar em Equipe**

#### **Divisão Sugerida de Responsabilidades:**

1. **Pessoa A - Gameplay Core**
   - `game_objects.js` - Objetos do jogo
   - `game_loop.js` - Lógica principal

2. **Pessoa B - Sistemas de Progressão**
   - `upgrade_system.js` - Sistema de upgrades
   - `level_system.js` - Sistema de level up

3. **Pessoa C - Interface e Quiz**
   - `quiz_system.js` - Sistema de quiz
   - `render_system.js` - Renderização

4. **Pessoa D - Efeitos e Controles**
   - `explosion_system.js` - Sistema de explosões
   - `input_system.js` - Controles

5. **Pessoa E - Configuração e Dados**
   - `config.js` - Configurações e perguntas
   - `style.css` - Estilos

#### **Regras para Evitar Conflitos:**

1. **NÃO edite** `main.js` - é o coordenador principal
2. **NÃO edite** `index.html` - estrutura principal
3. **Cada pessoa trabalha em seu(s) arquivo(s) específico(s)**
4. **Use funções bem definidas** - evite variáveis globais
5. **Teste localmente** antes de fazer commit
6. **Comunique mudanças** que afetem outros módulos

#### **Fluxo de Trabalho:**

1. **Clone o repositório**
2. **Escolha seu módulo** de responsabilidade
3. **Faça suas alterações** no arquivo específico
4. **Teste localmente** abrindo `index.html`
5. **Faça commit** apenas do seu arquivo
6. **Comunique** mudanças importantes para a equipe

### 🚀 **Como Executar**

1. Abra `index.html` no navegador
2. O jogo carregará automaticamente
3. Use WASD para mover, mouse para atirar
4. Colete experiência para subir de nível
5. Responda quizzes para ganhar upgrades

### 📝 **Notas Importantes**

- **Ordem de carregamento:** Os scripts são carregados em ordem específica no HTML
- **Dependências:** Alguns módulos dependem de outros (ex: quiz chama upgrade)
- **Interfaces:** Use as funções definidas para comunicação entre módulos
- **Debugging:** Use `console.log()` para debug, mas remova antes do commit

### 🔧 **Adicionando Novos Recursos**

Para adicionar um novo sistema:

1. Crie um novo arquivo `novo_sistema.js`
2. Defina funções bem documentadas
3. Adicione o script no `index.html` na ordem correta
4. Use as funções existentes para integração
5. Documente no README

### 📞 **Comunicação**

- Use comentários no código para explicar mudanças
- Documente funções novas
- Comunique mudanças que afetem outros módulos
- Teste integração antes de fazer commit

# 🎮 Vampiraí Survivors - Jogo Educativo

Um jogo de sobrevivência estilo "Vampire Survivors" com sistema educativo integrado, focado em conhecimento sobre Piraí, Matemática, Tecnologia e Ciência.

## 📁 Estrutura do Projeto (Limpa)

### 🎯 Arquivos Principais
- **`survivors.html`** - Interface principal do jogo
- **`script.js`** - Lógica principal do jogo e loop principal
- **`game_objects.js`** - Classes dos objetos do jogo (Player, Enemy, Projectile, etc.)
- **`config.js`** - Configurações de dificuldade e balanceamento
- **`upgrade_system.js`** - Sistema de upgrades e quiz
- **`complete_questions.js`** - Banco de perguntas do arquivo JSON
- **`boss_system.js`** - Sistema de boss
- **`utils.js`** - Funções utilitárias
- **`gamepad_utils.js`** - Suporte a gamepad

### 🎨 Recursos Visuais
- **`estudante.png`** - Sprite do jogador
- **`lapis2.png`** - Sprite dos projéteis
- **`livro ptbr.png`** - Sprite dos inimigos
- **`umaruchan.jpg`** - Imagem de fundo
- **`style.css`** - Estilos da interface

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Jogo
- [x] Movimento do jogador (WASD + Mouse/Gamepad)
- [x] Sistema de projéteis automáticos
- [x] Spawn de inimigos progressivo
- [x] Sistema de colisão
- [x] Sistema de vida e dano
- [x] Sistema de experiência e level up

### ✅ Sistema Educativo
- [x] 60 perguntas do arquivo JSON original
- [x] 4 categorias: Piraí, Matemática, Tecnologia, Ciência
- [x] 3 níveis de dificuldade: Fácil, Normal, Difícil
- [x] Quiz integrado ao level up
- [x] Sistema de recompensas por acerto

### ✅ Power-ups e Upgrades
- [x] 10 tipos de power-ups temporários
- [x] 5 power-ups temáticos de tecnologia
- [x] Sistema de seleção de upgrades
- [x] Efeitos visuais e sonoros

### ✅ Sistema de Boss
- [x] Boss com aura especial
- [x] Ataques em padrão
- [x] Barra de vida
- [x] Recompensas especiais

## 🎯 Próximos Passos Sugeridos

### 🔧 Melhorias Técnicas
1. **Otimização de Performance**
   - Implementar object pooling para projéteis
   - Otimizar sistema de partículas
   - Reduzir chamadas de renderização

2. **Sistema de Som**
   - Adicionar efeitos sonoros
   - Música de fundo
   - Feedback sonoro para ações

3. **Sistema de Salvamento**
   - Salvar progresso do jogador
   - Sistema de conquistas
   - Ranking de pontuação

### 🎮 Melhorias de Gameplay
4. **Mais Tipos de Inimigos**
   - Inimigos com padrões diferentes
   - Inimigos voadores
   - Inimigos com habilidades especiais

5. **Sistema de Armas**
   - Diferentes tipos de projéteis
   - Armas especiais
   - Sistema de combinação

6. **Ambientes Diversos**
   - Múltiplas fases
   - Diferentes cenários
   - Efeitos ambientais

### 📚 Melhorias Educativas
7. **Mais Conteúdo Educativo**
   - Adicionar mais perguntas do JSON
   - Sistema de dicas
   - Explicações detalhadas

8. **Sistema de Progressão**
   - Desbloqueio de conteúdo
   - Sistema de níveis educativos
   - Certificados de conclusão

### 🎨 Melhorias Visuais
9. **Interface Melhorada**
   - Animações mais fluidas
   - Efeitos visuais aprimorados
   - Interface responsiva

10. **Sprites e Arte**
    - Sprites mais detalhados
    - Animações de personagens
    - Efeitos de partículas melhorados

## 🛠️ Como Executar

1. Abra `survivors.html` em um navegador
2. Selecione a dificuldade
3. Clique em "INICIAR JOGO"
4. Use WASD para mover e mouse para mirar
5. Colete XP para subir de nível e responder quizzes

## 🎯 Controles

- **WASD** - Movimento
- **Mouse** - Mira e tiro automático
- **Gamepad** - Suporte completo
- **T** - Teleporte (quando tiver power-up Proxy)

## 📊 Sistema de Dificuldade

- **Fácil** - Para iniciantes e crianças
- **Normal** - Balanceado para jogadores médios
- **Difícil** - Para jogadores experientes

## 🏆 Power-ups Disponíveis

### Básicos
- ⚡ Velocidade
- 💥 Dano
- ❤️ Vida
- 🔥 Taxa de Tiro
- 🛡️ Escudo

### Temáticos
- 🛡️ Antivírus (regenera vida)
- 👻 VPN (modo stealth)
- 💥 Cluster (dois projéteis)
- 💢 Firewall (onda de choque)
- 🌀 Proxy (teleporte)

## 📈 Status do Projeto

**Fase Atual:** ✅ Funcional e Educativo
**Próxima Fase:** 🎯 Melhorias de Performance e Conteúdo
**Objetivo:** 🎓 Jogo educativo completo e envolvente

---

*Desenvolvido com foco em educação e diversão! 🎮📚*
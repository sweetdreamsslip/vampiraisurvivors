//var EnemyObject = function(spriteSheet, x, y, max_health, base_speed, base_damage);


function NormalBook(x, y){
    let book = new EnemyObject(
        enemySprite, // spriteSheet
        x, // x
        y, // y
        enemy_status.base_health, // max_health
        enemy_status.base_speed, // base_speed
        enemy_status.base_damage // base_damage
    );
    book.enemyType = "normal";
    return book;
}

function FastBook(x, y){
    let book = new EnemyObject(
        enemySprite, // spriteSheet
        x, // x
        y, // y
        enemy_status.base_health * 0.75, // max_health
        enemy_status.base_speed * 1.5, // base_speed
        enemy_status.base_damage * 0.75 // base_damage
    );
    book.enemyType = "fast";
    return book;
}

var DashEnemy = function(x, y){
    let enemy = new DashEnemyObject(
        enemySprite, 
        x, 
        y, 
        enemy_status.base_health * 0.75, 
        enemy_status.base_speed * 2, 
        enemy_status.base_damage * 0.75,
    );
    return enemy;
}

var FlyingEnemy = function(x, y){
    let enemy = new FlyingEnemyObject(
        flyingEnemySprite, 
        x, 
        y, 
        enemy_status.base_health, 
        enemy_status.base_speed, 
        enemy_status.base_damage,
    );
    // Define as propriedades da spritesheet para animação
    enemy.frameWidth = 32;
    enemy.frameHeight = 32;
    enemy.numColumns = 2;
    enemy.frameCount = 4;
    enemy.animationSpeed = 195; // Velocidade da animação (ms por frame) - 30% mais lento
    enemy.animationTimer = 0;   // Garante que o timer da animação inicie zerado
    enemy.currentFrame = 0;     // Garante que a animação comece do primeiro frame
    return enemy;
}

var TankEnemy = function(x, y){
    let enemy = new TankEnemyObject(
        tankSprite, 
        x, 
        y, 
        enemy_status.base_health, 
        enemy_status.base_speed, 
        enemy_status.base_damage,
    );
    return enemy;
}
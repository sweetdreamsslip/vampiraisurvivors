var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lastUpdateTime;

var WIDTH = window.innerWidth-20;
var HEIGHT = window.innerHeight-20;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// base stats
var player_status = {
    speed: 0.4,
    max_health: 100,
    projectile_speed: 1,
    time_between_projectiles: 5,
    damage: 10,
    invincibility_time: 1000,
}

// global variables
var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;
// game objects
var player;
var enemies_list = [];
var projectiles_list = [];
var particles_list = [];

// controller support
var is_gamepad_connected = false;

// control variables
var mouse = {
    x: 0,
    y: 0,
    mouseDown: false,
};
var keys_down = [];


function createParticleExplosion(x, y, color, count) {
    for (var i = 0; i < count; i++) {
        var angle = Math.random() * 2 * Math.PI;
        var speed = (Math.random() * 0.2) + 0.05; // random speed
        var lifespan = randomIntBetween(400, 700); // random lifespan
        particles_list.push(new ParticleObject(x, y, color, speed, angle, lifespan));
    }
}


// event listeners
canvas.addEventListener("mousemove", function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mousedown", function(e) {
    mouse.mouseDown = true;
});
canvas.addEventListener("mouseup", function(e) {
    mouse.mouseDown = false;
});
window.addEventListener("keydown", function(e) {
    keys_down.push(e.key);
});
window.addEventListener("keyup", function(e) {
    keys_down = keys_down.filter(function(key) {
        return key !== e.key;
    });
});
// gamepad connection
window.addEventListener("gamepadconnected", function(e) {
    console.log("Controle conectado no índice %d: %s.", e.gamepad.index, e.gamepad.id);
    is_gamepad_connected = true;
});
window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Controle desconectado do índice %d: %s", e.gamepad.index, e.gamepad.id);
    is_gamepad_connected = false;
});



// update function
function update(dt) {
    const gamepadState = pollGamepad();

    // Define o ângulo de mira: prioriza o controle, senão usa o mouse
    if (gamepadState.aimAngle !== null) {
        angle_between_player_and_mouse = gamepadState.aimAngle;
    } else {
        angle_between_player_and_mouse = angleBetweenPoints(player.x, player.y, mouse.x, mouse.y);
    }
    player.update(dt, gamepadState.moveVector);

    //projectile firing
    time_since_last_projectile += dt;
    if ((mouse.mouseDown || gamepadState.isShooting) && time_since_last_projectile >= player_status.time_between_projectiles) {
        projectiles_list.push(new ProjectileObject(player.x, player.y, angle_between_player_and_mouse));
        time_since_last_projectile = 0;
    }
    
    //projectile updating
    projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });
    

    //player collision
    for(var i = 0; i < enemies_list.length; i++){
        if(aabbCircleCollision(player, enemies_list[i])){
            player.take_damage(enemies_list[i].base_damage);
        }
    }

    //projectile collision
    for(var i = 0; i < projectiles_list.length; i++){
        for(var j = 0; j < enemies_list.length; j++){
            if(aabbCircleCollision(projectiles_list[i], enemies_list[j])){
                createParticleExplosion(enemies_list[j].x, enemies_list[j].y, enemies_list[j].color, randomIntBetween(10, 20));
                projectiles_list[i].exists = false;	
                enemies_list[j].take_damage(player_status.damage);
                if(enemies_list[j].health <= 0){
                    enemies_list[j].respawn();
                }
            }
        }
    }

    // enemy updating
    enemies_list.forEach(function(enemy) {
        enemy.update(dt);
    });

    // update particles
    particles_list.forEach(function(p) {
        p.update(dt);
    });

    // remove projectiles that are no longer exists
    projectiles_list = projectiles_list.filter(function(projectile) {
        return projectile.exists;
    });
    // remove dead particles
    particles_list = particles_list.filter(function(p) {
        return p.lifespan > 0;
    });
}

// render function
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //enemy rendering
    enemies_list.forEach(function(enemy) {
        enemy.render(ctx);
    });
    //player rendering
    player.render(ctx);
    //projectile rendering
    projectiles_list.forEach(function(projectile) {
        projectile.render(ctx);
    });
    // particle rendering
    particles_list.forEach(function(p) {
        p.render(ctx);
    });
    //debug text
    ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.fillText("Mouse: x=" + mouse.x + " y=" + mouse.y, 20, 40);
    ctx.fillText("Angle: " + angle_between_player_and_mouse, 20, 60);
    ctx.fillText("Projectiles: " + projectiles_list.length, 20, 80);
    ctx.fillText("Player Health: " + player.health, 20, 100);
    ctx.fillText("Particles: " + particles_list.length, 20, 120);
}

// run function
function run() {
    var now = performance.now();
    var dt = (now - lastUpdateTime);
    lastUpdateTime = now;
    update(dt);
    render();
    requestAnimationFrame(run);
}

function initialize() {
    //initialize player
    player = PlayerObject();
    //initialize enemies
    for(var i = 0; i < 10; i++){
        enemies_list.push(new EnemyObject(randomIntBetween(0, WIDTH), randomIntBetween(0, HEIGHT), 100, 100, 20, "blue"));
    }
    //initialize last update time
    lastUpdateTime = performance.now();
    run();
}
initialize();
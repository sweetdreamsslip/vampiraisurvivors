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
    health: 100,
    projectile_speed: 1,
    time_between_projectiles: 100,
    damage: 10,
}

// global variables
var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;
var projectiles_list = [];
var enemies_list = [];

// control variables
var mouse = {
    x: 0,
    y: 0,
    mouseDown: false,
};
var keys_down = [];

// player object
var player = {
    x: 400,
    y: 400,
    radius: 10,
    render: function(ctx){
        ctx.save();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    },
    update: function(dt){
        //movement
        if(keys_down.includes("w")){
            this.y -= player_status.speed * dt;
        }
        if(keys_down.includes("s")){
            this.y += player_status.speed * dt;
        }
        if(keys_down.includes("a")){
            this.x -= player_status.speed * dt;
        }
        if(keys_down.includes("d")){
            this.x += player_status.speed * dt;
        }
        //boundary check (so player doesn't go off the screen)
        if(this.x < 0){
            this.x = 0;
        }
        if(this.x > WIDTH){
            this.x = WIDTH;
        }
        if(this.y < 0){
            this.y = 0;
        }
        if(this.y > HEIGHT){
            this.y = HEIGHT;
        }
    }
}; 

// enemy object
var enemy = function(x, y, health, max_health, radius, color){
    return {
        x: x,
        y: y,
        health: health,
        max_health: max_health,
        radius: radius,
        collision: false,
        color: color,
        base_speed: 0.1,
        render: function(ctx){
            ctx.save();
            // enemy
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            // health bar
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.radius, this.y - this.radius - 15, this.radius * 2, 10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - this.radius, this.y - this.radius - 15, (this.health / this.max_health) * this.radius * 2, 10);
            ctx.restore();
        },
        update: function(dt){
        // Move enemy towards player by its base_speed * dt
        var dx = player.x - this.x;
        var dy = player.y - this.y;
        var distancesq = distSquared(this.x, this.y, player.x, player.y);
        if (distancesq > 0) {
            var moveDist = this.base_speed * dt;
            var angle = angleBetweenPoints(this.x, this.y, player.x, player.y);
            this.x += Math.cos(angle) * moveDist;
            this.y += Math.sin(angle) * moveDist;
        }



        },
        respawn: function(){
            this.x = randomIntBetween(0, WIDTH);
            this.y = randomIntBetween(0, HEIGHT);
            this.health = this.max_health;
        }
    }
};

// projectile object
var projectile = function(x, y, initial_angle) {
    return {
        x: x,
        y: y,
        radius: 5,
        initial_angle: initial_angle,
        exists: true,
        render: function(ctx){
            ctx.save();
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        },
        update: function(dt){
            this.x += Math.cos(this.initial_angle) * player_status.projectile_speed * dt;
            this.y += Math.sin(this.initial_angle) * player_status.projectile_speed * dt;
            if(outOfBounds(this.x, this.y, WIDTH, HEIGHT)){
                this.exists = false;
            }
        },
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


// update function
function update(dt) {
    angle_between_player_and_mouse = angleBetweenPoints(player.x, player.y, mouse.x, mouse.y);
    player.update(dt);

    //projectile firing
    time_since_last_projectile += dt;
    if (mouse.mouseDown && time_since_last_projectile >= player_status.time_between_projectiles) {
        projectiles_list.push(new projectile(player.x, player.y, angle_between_player_and_mouse));
        time_since_last_projectile = 0;
    }
    
    //projectile updating
    projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });
    
    //projectile collision
    for(var i = 0; i < projectiles_list.length; i++){
        for(var j = 0; j < enemies_list.length; j++){
            if(aabbCircleCollision(projectiles_list[i], enemies_list[j])){
                projectiles_list[i].exists = false;	
                enemies_list[j].health -= player_status.damage;
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

    // remove projectiles that are no longer exists
    projectiles_list = projectiles_list.filter(function(projectile) {
        return projectile.exists;
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
    //debug text
    ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.fillText("Mouse: x=" + mouse.x + " y=" + mouse.y, 20, 40);
    ctx.fillText("Angle: " + angle_between_player_and_mouse, 20, 60);
    ctx.fillText("Projectiles: " + projectiles_list.length, 20, 80);
}

// run function
function run() {
    var now = performance.now();
    var dt = (now - lastUpdateTime); // dt in seconds
    lastUpdateTime = now;
    update(dt);
    render();
    requestAnimationFrame(run);
}

function initialize() {
    //initialize enemies
    for(var i = 0; i < 10; i++){
        enemies_list.push(new enemy(randomIntBetween(0, WIDTH), randomIntBetween(0, HEIGHT), 100, 100, 20, "blue"));
    }
    //initialize last update time
    lastUpdateTime = performance.now();
    run();
}
initialize();
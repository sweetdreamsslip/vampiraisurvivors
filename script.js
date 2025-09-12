var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var lastUpdateTime;

var WIDTH = window.innerWidth-20;
var HEIGHT = window.innerHeight-20;
canvas.width = WIDTH;
canvas.height = HEIGHT;

//top-down game
var player_status = {
    speed: 0.4,
    health: 100,
    projectile_speed: 1,
    time_between_projectiles: 170,
    damage: 10,
}

var angle_between_player_and_mouse = 0;
var time_since_last_projectile = 0;


var mouse = {
    x: 0,
    y: 0,
    mouseDown: false,
};

var keys_down = [];

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
var enemy = {
    x: 200,
    y: 200,
    health: 100,
    max_health: 100,
    radius: 50,
    collision: false,
    color: "blue",
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

    },
    respawn: function(){
        this.x = randomIntBetween(0, WIDTH);
        this.y = randomIntBetween(0, HEIGHT);
        this.health = this.max_health;
    }
};

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

var createProjectile = function(x, y, initial_angle) {
    return projectile(x, y, initial_angle);
}
    
projectiles_list = [];


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
    console.log(keys_down);
});
window.addEventListener("keyup", function(e) {
    keys_down = keys_down.filter(function(key) {
        return key !== e.key;
    });
});


function update(dt) {
    angle_between_player_and_mouse = angleBetweenPoints(player.x, player.y, mouse.x, mouse.y);
    player.update(dt);
    enemy.collision = aabbCircleCollision(player, enemy);
    enemy.update(dt);
    time_since_last_projectile += dt;
    if (mouse.mouseDown && time_since_last_projectile >= player_status.time_between_projectiles) {
        projectiles_list.push(createProjectile(player.x, player.y, angle_between_player_and_mouse));
        time_since_last_projectile = 0;
        //mouse.mouseDown = false; // Prevent continuous firing while holding mouse
    }
    
    projectiles_list.forEach(function(projectile) {
        projectile.update(dt);
    });

    for(var i = 0; i < projectiles_list.length; i++){
        if(!projectiles_list[i].exists){
            projectiles_list.splice(i, 1);
            continue;
        }
        if(aabbCircleCollision(projectiles_list[i], enemy)){
            projectiles_list.splice(i, 1);
            enemy.health -= player_status.damage;
            if(enemy.health <= 0){
                enemy.respawn();
                enemy.health = 100;
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemy.render(ctx);
    player.render(ctx);
    projectiles_list.forEach(function(projectile) {
        projectile.render(ctx);
    });
    ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.fillText("Mouse: x=" + mouse.x + " y=" + mouse.y, 20, 40);
    ctx.fillText("Angle: " + angle_between_player_and_mouse, 20, 60);
    ctx.fillText("Projectiles: " + projectiles_list.length, 20, 80);
}

function run() {
    var now = performance.now();
    var dt = (now - lastUpdateTime); // dt in seconds
    lastUpdateTime = now;
    update(dt);
    render();
    requestAnimationFrame(run);
}

lastUpdateTime = performance.now();
run();

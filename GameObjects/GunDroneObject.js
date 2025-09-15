var GunDroneObject = function(x, y, distance_to_player) {
    return {
        x: x,
        y: y,
        distance_to_player: distance_to_player,
        current_distance_to_player: distance_to_player,
        distance_modulation_intensity: 10,
        distance_modulation_speed: 10,
        mod_temp: 0,
        exists: true,
        angle: 0,
        angular_speed: 0.002,
        time_since_last_projectile: 0,
        update: function(dt){
            this.angle += this.angular_speed * dt;
            this.mod_temp += dt/170;
            this.current_distance_to_player = (this.distance_modulation_intensity * Math.sin(this.mod_temp)) + this.distance_to_player;
            this.x = player.x + Math.cos(this.angle) * this.current_distance_to_player;
            this.y = player.y + Math.sin(this.angle) * this.current_distance_to_player;
            this.time_since_last_projectile += dt;
            if(this.time_since_last_projectile >= player_status.time_between_gun_drone_projectiles){
                console.log("gun drone projectile");
                projectiles_list.push(new ProjectileObject(projectileSprite, this.x, this.y, this.angle, player_status.gun_drone_damage));
                this.time_since_last_projectile = 0;
            }
        },
        render: function(ctx){
            ctx.save();
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    }
};
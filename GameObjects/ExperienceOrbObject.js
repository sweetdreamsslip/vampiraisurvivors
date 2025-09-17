var ExperienceOrbObject = function(spriteSheet, x, y, experience_value) {
    const scale = 1.5;
    return {
        x: x,
        y: y,
        max_speed: 1,
        radius: 16 * scale, // 32/2 * scale
        experience_value: experience_value,
        exists: true,

        // Sprite properties
        sprite: spriteSheet,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,

        render: function(ctx, camera){
            ctx.save();
            ctx.translate(-camera.x, -camera.y);
            ctx.translate(this.x, this.y);

            const renderWidth = this.frameWidth * this.scale;
            const renderHeight = this.frameHeight * this.scale;

            ctx.drawImage(
                this.sprite,
                0, 0, // source x, y
                this.frameWidth, this.frameHeight, // source width, height
                -renderWidth / 2, -renderHeight / 2, // destination x, y (centered)
                renderWidth, renderHeight // destination width, height
            );
            ctx.restore();
        },
        update: function(dt, destination_x, destination_y){
            let dist2 = distSquared(this.x, this.y, destination_x, destination_y);
            let distance_ratio = dist2 / (player_status.magnet_max_distance * player_status.magnet_max_distance);
            if(dist2 <= player_status.magnet_max_distance * player_status.magnet_max_distance){
                let direction = angleBetweenPoints(this.x, this.y, destination_x, destination_y);
                this.x += Math.cos(direction) * this.max_speed * dt * (1-distance_ratio);
                this.y += Math.sin(direction) * this.max_speed * dt * (1-distance_ratio);
            }
        }
    }
};
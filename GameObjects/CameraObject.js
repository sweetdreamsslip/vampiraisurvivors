var CameraObject = function(scenario_width, scenario_height, view_width, view_height) {
    return {
        x: 0,
        y: 0,
        scenario_width: scenario_width,
        scenario_height: scenario_height,
        view_width: view_width,
        view_height: view_height,

        update: function(dt) {
            this.x = player.x - this.view_width/2;
            this.y = player.y - this.view_height/2;
            if(this.x < 0) {
                this.x = 0;
            }
            if(this.y < 0) {
                this.y = 0;
            }
            if(this.x > this.scenario_width - this.view_width) {
                this.x = this.scenario_width - this.view_width;
            }
            if(this.y > this.scenario_height - this.view_height) {
                this.y = this.scenario_height - this.view_height;
            }
        },
    }
}
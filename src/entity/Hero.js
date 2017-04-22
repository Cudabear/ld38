Hero = function() {
    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, 'TestGuy');
    game.add.existing(this);

    game.physics.arcade.enable(this);
    console.log(this);
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.constants = { };
Hero.prototype.constants.speed = 150;

Hero.prototype.update = function() {
    this.handleInput();
}

Hero.prototype.handleInput = function() {
    if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.body.velocity.x = -this.constants.speed;
    } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.body.velocity.x = this.constants.speed;
    } else {
        this.body.velocity.x = 0;
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.body.velocity.y = -this.constants.speed;
    } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        this.body.velocity.y = this.constants.speed;
    } else {
        this.body.velocity.y = 0;
    }

    //correct for 2 buttons to keep speed the same as maxspeed
    if(this.body.velocity.y !== 0 && this.body.velocity.x !== 0) {
        this.body.velocity.y = this.constants.speed*Math.cos(45) * (this.body.velocity.y < 0 ? -1 : 1);
        this.body.velocity.x = this.constants.speed*Math.sin(45) * (this.body.velocity.x < 0 ? -1 : 1);
    }
}
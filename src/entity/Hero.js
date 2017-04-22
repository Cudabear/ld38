Hero = function() {
    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, 'TestGuy');
    game.add.existing(this);
    this.anchor.setTo(0.5);

    this.slashEffect = game.add.sprite(this.x, this.y, 'slash');
    this.slashEffect.anchor.setTo(0.5);
    game.physics.arcade.enable(this.slashEffect);
    this.slashEffect.body.immovable = true;
    this.slashAnim = this.slashEffect.animations.add('slash', null, 10);
    this.slashAnim.onComplete.add(this.onSlashComplete, this);
    this.slashEffect.exists = false;

    this.facing = 'north';
    this.invulnTimeCounter = 0;


    game.physics.arcade.enable(this);
    game.input.onDown.add(this.handleClick, this);

    this.healthBarEmpty = game.add.sprite(50, game.height - 50, 'healthbar', 1);
    this.healthBarFull = game.add.sprite(50, game.height - 50, 'healthbar', 0);
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.constants = { };
Hero.prototype.constants.speed = 150;
Hero.prototype.constants.maxHealth = 100;
Hero.prototype.constants.invulnTime = 50;
Hero.prototype.health = Hero.prototype.constants.maxHealth;

Hero.prototype.update = function() {
    this.handleInput();
    this.handlePhysics();

    if(this.invulnTimeCounter > 0){
        this.invulnTimeCounter--;
        this.tint = 0xFF0000;
    }else{
        this.tint = 0xFFFFFF;
    }
}

Hero.prototype.handlePhysics = function() {
    if(this.slashEffect.exists){
        this.slashEffect.x = this.x + (this.facing === 'left' ? -32 : 0) + (this.facing === 'right' ? 32 : 0);
        this.slashEffect.y = this.y + (this.facing === 'up' ? -32 : 0) + (this.facing === 'down' ? 32 : 0);

        if(this.facing === 'right') {
            this.slashEffect.rotation = Math.PI/2;
        }else if(this.facing === 'left') {
            this.slashEffect.rotation = Math.PI*3/2;
        }else if(this.facing === 'down') {
            this.slashEffect.rotation = Math.PI;
        }else if(this.facing === 'up') {
            this.slashEffect.rotation = 0;
        }
    }
}

Hero.prototype.handleInput = function() {
    if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.body.velocity.x = -this.constants.speed;
        this.facing = 'left';
    } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.body.velocity.x = this.constants.speed;
        this.facing = 'right';
    } else {
        this.body.velocity.x = 0;
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.body.velocity.y = -this.constants.speed;
        this.facing = 'up';
    } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        this.body.velocity.y = this.constants.speed;
        this.facing = 'down';
    } else {
        this.body.velocity.y = 0;
    }

    //correct for 2 buttons to keep speed the same as maxspeed
    if(this.body.velocity.y !== 0 && this.body.velocity.x !== 0) {
        this.body.velocity.y = this.constants.speed*Math.cos(45) * (this.body.velocity.y < 0 ? -1 : 1);
        this.body.velocity.x = this.constants.speed*Math.sin(45) * (this.body.velocity.x < 0 ? -1 : 1);
    }
}

Hero.prototype.handleClick = function() {
    this.slashEffect.exists = true;
    this.slashEffect.animations.play('slash');
}

Hero.prototype.onSlashComplete = function() {
    this.slashEffect.exists = false;
}

Hero.prototype.onSuccessfulSlash = function(me, enemy){
    if(!enemy.stunnedCounter) {
        enemy.getHit(this.slashEffect);
    }
}

Hero.prototype.getHit = function(attacker) {
    if(this.invulnTimeCounter === 0){
        this.damage(1);
        this.updateHealthbarCrop();
        this.invulnTimeCounter = this.constants.invulnTime;
    }
}

Hero.prototype.updateHealthbarCrop = function() {
    var width = this.healthBarEmpty.width*this.health/this.maxHealth;
    this.healthBarFull.crop({x: 0, y: 0, width: width, height: this.healthBarEmpty.height, right: width, bottom: this.healthBarEmpty.height});

    if(this.health === 0){
        this.healthBarEmpty.exists = false;
        this.healthBarFull.exists = false;
    }
}


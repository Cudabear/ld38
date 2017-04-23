Hero = function(mainState, spawnSide) {
    this.mainState = mainState;
    this.spawnSide = spawnSide;
    this.isHero = true;

    var spawnX = 0;
    var spawnY = 0;


    if(spawnSide.x && spawnSide.y){
        spawnX = spawnSide.x;
        spawnY = spawnSide.y;
    }else {
        if(spawnSide === 'west'){
            spawnX = game.world.width - 96;
            spawnY = game.world.centerY;
        }else if(spawnSide === 'east'){
            spawnX = 96;
            spawnY = game.world.centerY;
        }else if(spawnSide === 'north'){
            spawnX = game.world.centerX;
            spawnY = 96;
        }else if(spawnSide === 'south'){
            spawnX = game.world.centerX;
            spawnY = game.world.height - 96;
        }
    }

    Phaser.Sprite.call(this, game, spawnX, spawnY, 'hero');
    this.slashEffect = new SlashEffect(this);
    this.animations.add('stand-face-up', [1]);
    this.animations.add('stand-face-down', [0]);
    this.animations.add('stand-face-left', [2]);
    this.animations.add('stand-face-right', [3]);
    this.animations.add('walk-face-up', [4,5,6,7], 6);
    this.animations.add('walk-face-down', [8,9,10,11], 6);
    this.animations.add('walk-face-left', [16,17,18,19], 6);
    this.animations.add('walk-face-right', [12,13,14,15], 6);
    this.animations.add('attack-face-down', [21,20,20,20], 15);
    this.animations.add('attack-face-up', [22,22,23,23], 15);
    this.animations.add('attack-face-right', [24,24,25,25], 15);
    this.animations.add('attack-face-left', [26,26,27,27], 15);

    game.add.existing(this);
    this.anchor.setTo(0.5);

    this.facing = 'north';
    this.invulnTimeCounter = 0;


    game.physics.arcade.enable(this);
    game.input.onDown.add(this.handleClick, this);
    this.body.collideWorldBounds = true;

    this.stunnedCounter = 0;

    this.maxHealth = Hero.prototype.constants.maxHealth;
    this.healthBarEmpty = game.add.sprite(15, game.height - 39, 'healthbar', 1);
    this.healthBarFull = game.add.sprite(15, game.height - 39, 'healthbar', 0);
    this.updateHealthbarCrop();
    this.heroText = game.add.bitmapText(20, game.height - 120, 'font', 'Our Hero', 22);
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.constants = { };
Hero.prototype.constants.speed = 200;
Hero.prototype.constants.maxHealth = 15;
Hero.prototype.constants.invulnTime = 50;
Hero.prototype.constants.healthPotionHealAmount = 3;
Hero.prototype.health = Hero.prototype.constants.maxHealth;

Hero.prototype.update = function() {
    if(this.stunnedCounter === 0){
        if(!this.mainState.isDialog){
            this.handleInput();
        }else {
            this.body.velocity.setTo(0);
        }
    } else {
        this.stunnedCounter -= 1;
    }
    

    this.handlePhysics();

    if(this.invulnTimeCounter > 0){
        this.invulnTimeCounter--;
        this.tint = 0xFF0000;
    }else{
        this.tint = 0xFFFFFF;
    }
}

Hero.prototype.handlePhysics = function() {

}

Hero.prototype.handleInput = function() {
    if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        this.body.velocity.x = -this.constants.speed;
        this.facing = 'left';
    } else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.body.velocity.x = this.constants.speed;
        this.facing = 'right';
    } else {
        this.body.velocity.x = 0;
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        this.body.velocity.y = -this.constants.speed;
        this.facing = 'up';
    } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
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

    if(!this.slashEffect.exists){
        if(this.facing === 'up'){
            if(this.body.velocity.y === 0){
                this.animations.play('stand-face-up');
            }else{
                this.animations.play('walk-face-up');
            }
        }else if(this.facing === 'down'){
            if(this.body.velocity.y === 0){
                this.animations.play('stand-face-down');
            }else{
                this.animations.play('walk-face-down');
            }
        }else if(this.facing === 'left'){
            if(this.body.velocity.x === 0){
                this.animations.play('stand-face-left');
            }else{
                this.animations.play('walk-face-left');
            }
        }else if(this.facing === 'right'){
            if(this.body.velocity.x === 0){
                this.animations.play('stand-face-right');
            }else{
                this.animations.play('walk-face-right');
            }
        }
    }
}

Hero.prototype.handleClick = function() {
    if(!this.mainState.isDialog){
        var pointerDx = this.x - game.input.mousePointer.x;
        var pointerDy = this.y - game.input.mousePointer.y;

        if(Math.abs(pointerDx) > Math.abs(pointerDy)){
            if(pointerDx < 0){
                this.facing = 'right';
            } else {
                this.facing = 'left';
            }
        } else {
            if(pointerDy < 0){
                this.facing = 'down';
            } else{
                this.facing = 'up';
            }
        }
        this.slashEffect.doAttack();
        this.animations.play('attack-face-'+this.facing);
    }
}

Hero.prototype.onSlashComplete = function() {
    this.slashEffect.exists = false;
}

Hero.prototype.onSuccessfulSlash = function(me, enemy){
    if(!enemy.stunnedCounter) {
        enemy.getHit(this.slashEffect);
    }
}

Hero.prototype.getHit = function(attacker, damage) {
    if(this.invulnTimeCounter === 0){
        this.damage(damage || 1);
        this.updateHealthbarCrop();
        this.invulnTimeCounter = this.constants.invulnTime;
        Config.sfxObjects.hit.play();
    }

    if(!this.alive){
        this.mainState.acceptingNewDialog = true;
        this.mainState.setDialog(NpcDialog['dead'].dialog, NpcDialog['dead'].choice);
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

Hero.prototype.getExploaded = function(bomb, force){
    this.getHit(bomb);
    this.stunnedCounter = this.constants.invulnTime;
    this.body.velocity.x = force*Math.cos(game.physics.arcade.angleBetween(bomb, this));
    this.body.velocity.y = force*Math.sin(game.physics.arcade.angleBetween(bomb, this));
}

Hero.prototype.pickupHealth = function(){
    this.heal(this.constants.healthPotionHealAmount);
    this.updateHealthbarCrop();
}

Hero.prototype.getVitals = function() {
    return {
        health: this.health
    }
}

Hero.prototype.setVitals = function(vitals){
    this.health = vitals.health;
    this.updateHealthbarCrop();
}
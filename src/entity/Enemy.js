Enemy = function(type, target, map, collisionMap) {
    this.target = target;
    this.map = map;
    this.collisionMap = collisionMap;
    this.path = [ ];

    if(type === 'melee') {
        Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'TestEnemy');
        game.add.existing(this);
        this.anchor.setTo(0.5);

        game.physics.arcade.enable(this);
        this.body.acceleration.setTo(this.constants.acceleration);

        this.stunnedCounter = 0;
        this.attackWindupCounter = 0;

        this.slashEffect = game.add.sprite(this.x, this.y, 'slash');
        this.slashEffect.anchor.setTo(0.5);
        game.physics.arcade.enable(this.slashEffect);
        this.slashEffect.body.immovable = true;
        this.slashAnim = this.slashEffect.animations.add('slash', null, 10);
        this.slashAnim.onComplete.add(this.onSlashComplete, this);
        this.slashEffect.exists = false;


        this.calculatePath();
    }

    this.facing = 'north';

    this.healthBarEmpty = game.add.sprite(this.x, this.y, 'healthbar', 1);
    this.healthBarFull = game.add.sprite(this.x, this.y, 'healthbar', 0);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.constants = { };
Enemy.prototype.constants.speed = 50;
Enemy.prototype.constants.acceleration = 25;
Enemy.prototype.constants.stunTime = 25;
Enemy.prototype.constants.knockbackForce = 250;
Enemy.prototype.constants.attackWindupTime = 40;
Enemy.prototype.maxHealth = 10;
Enemy.prototype.health = Enemy.prototype.maxHealth;

Enemy.prototype.update = function() {
    if(this.stunnedCounter === 0){
        if(this.attackWindupCounter === 0 && game.physics.arcade.distanceBetween(this, this.target) > 50){
            this.traversePath();
            this.attackWindupTime = 0;
        } else {
            this.attemptAttack();
        }
    } else if(this.stunnedCounter > 0){
        this.stunnedCounter--;
        
        game.physics.arcade.collide(this, this.collisionMap);

        if(this.stunnedCounter === 0){
            this.calculatePath();
        }
    }

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

    this.healthBarFull.x = this.x - this.width/2 + 2;
    this.healthBarFull.y = this.y + this.height/2 + 3;
    this.healthBarEmpty.x = this.x - this.width/2 + 2;
    this.healthBarEmpty.y = this.y + this.height/2 + 3;
}

Enemy.prototype.calculatePath = function() {
    this.path = Config.plugins.AStar.findPath({x: Math.floor(this.x/this.map.tileWidth), y: Math.floor(this.y/this.map.tileHeight)},
        {x: Math.floor(this.target.x/this.map.tileWidth), y: Math.floor(this.target.y/this.map.tileHeight)}).nodes.reverse();
    this.currentNode = this.path.shift();
}

Enemy.prototype.traversePath = function() {
    if(this.currentNode || this.path.length){
        if(game.physics.arcade.distanceToXY(this, this.currentNode.x*this.map.tileWidth + this.map.tileWidth/2, this.currentNode.y*this.map.tileHeight + this.map.tileHeight/2) < 5) {
            this.currentNode = this.path.shift();
        } else {
            game.physics.arcade.moveToXY(this, this.currentNode.x*this.map.tileWidth + this.map.tileWidth/2, this.currentNode.y*this.map.tileHeight + this.map.tileHeight/2, this.constants.speed);
        }
    } else if(game.physics.arcade.distanceBetween(this, this.target) > this.map.tileWidth) {
        this.calculatePath();
    } else if(!this.path.length && game.physics.arcade.distanceBetween(this, this.target) > 5){
        game.physics.arcade.moveToObject(this, this.target, this.constants.speed);
    }
}

Enemy.prototype.getHit = function(attacker) {
    this.stunnedCounter = this.constants.stunTime;
    this.body.velocity.x = this.constants.knockbackForce*Math.cos(game.physics.arcade.angleBetween(attacker, this));
    this.body.velocity.y = this.constants.knockbackForce*Math.sin(game.physics.arcade.angleBetween(attacker, this));
    this.damage(1);
    this.updateHealthbarCrop();
}

Enemy.prototype.attemptAttack = function(){
    if(this.attackWindupCounter === 0){
        this.attackWindupCounter = this.constants.attackWindupTime;
        this.tint = 0x000000;
        this.body.velocity.setTo(0);

        var dxHero = this.x - this.target.x;
        var dyHero = this.y - this.target.y;

        if(Math.abs(dxHero) > Math.abs(dyHero)){
            if(dxHero < 0){
                this.facing = 'right';
            }else {
                this.facing = 'left';
            }
        } else {
            if(dyHero < 0){
                this.facing = 'down';
            } else {
                this.facing = 'up';
            }
        }

    } else {
        this.attackWindupCounter--;
        

        if(this.attackWindupCounter === 0){
            this.doAttack();
        }
    }
}

Enemy.prototype.doAttack = function() {
    this.slashEffect.exists = true;
    this.slashEffect.animations.play('slash');
    this.tint = 0xFFFFFF;
}

Enemy.prototype.updateHealthbarCrop = function() {
    var width = this.healthBarEmpty.width*this.health/this.maxHealth;
    this.healthBarFull.crop({x: 0, y: 0, width: width, height: this.healthBarEmpty.height, right: width, bottom: this.healthBarEmpty.height});

    if(this.health === 0){
        this.healthBarEmpty.exists = false;
        this.healthBarFull.exists = false;
    }
}

Enemy.prototype.onSlashComplete = function() {
    this.slashEffect.exists = false;
}

Enemy.prototype.onSuccessfulSlash = function(me, enemy){
    enemy.getHit(this.slashEffect);
}



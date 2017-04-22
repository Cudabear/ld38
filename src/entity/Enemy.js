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

        this.calculatePath();
    }
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.constants = { };
Enemy.prototype.constants.speed = 50;
Enemy.prototype.constants.acceleration = 25;
Enemy.prototype.constants.stunTime = 25;
Enemy.prototype.constants.knockbackForce = 250;

Enemy.prototype.update = function() {
    if(this.stunnedCounter === 0){
        this.traversePath();
    } else if(this.stunnedCounter > 0){
        this.stunnedCounter--;
        
        game.physics.arcade.collide(this, this.collisionMap);

        if(this.stunnedCounter === 0){
            this.calculatePath();
        }
    }
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
}

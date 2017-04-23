Enemy = function(type, x, y, mainState, target, enemies, map, collisionMap, dialog) {
    this.target = target;
    this.map = map;
    this.collisionMap = collisionMap;
    this.path = [ ];
    this.mobType = type;
    this.enemies = enemies;
    this.dialog = dialog;
    this.mainState = mainState;
    if(this.mobType === 'melee') {
        Phaser.Sprite.call(this, game, x, y, 'slime');
        this.attackDistance = this.constants.attackDistanceMelee;
        this.attackWindupTime = this.constants.attackWindupTimeMelee;
        this.attackCooldownTime = this.constants.cooldownTimeMelee;

        this.animations.add('walk-up', [0,1], 8, true);
        this.animations.add('walk-down', [2,3], 8, true);
        this.animations.add('walk-left', [4,5], 8, true);
        this.animations.add('walk-right', [6,7], 8, true);

        this.slashEffect = new SlashEffect(this);
    } else if(this.mobType === 'ranged'){
        Phaser.Sprite.call(this, game, x, y, 'TestEnemy');

        this.attackDistance = this.constants.attackDistanceRanged;
        this.attackWindupTime = this.constants.attackWindupTimeRanged;
        this.attackCooldownTime = this.constants.cooldownTimeRanged;
        this.sightLine = new Phaser.Line();

        this.weapon = game.add.weapon(30, 'arrow');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = this.constants.arrowFlySpeed;
        this.weapon.fireRate = 10;
        this.weapon.trackSprite(this, 0, 0, false);  
    } else if(this.mobType === 'aoe'){
        Phaser.Sprite.call(this, game, x, y, 'TestEnemy');

        this.attackDistance = this.constants.attackDistanceAOE;
        this.attackWindupTime = this.constants.attackWindupTimeAOE;
        this.attackCooldownTime = this.constants.cooldownTimeAOE;
        this.bombExplosionCounter = 0;

        this.bomb = game.add.sprite(this.x, this.y, 'bomb');
        this.bomb.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.bomb);
        this.bomb.exists = false;
    }

    if(this.dialog){
        this.speechbubble = game.add.sprite(x+32, y-32, 'speechbubble');
        this.speechbubble.anchor.setTo(0.5);
        this.mainState.setDialog(NpcDialog[this.dialog].dialog);
        this.dialog = false;
    }

    this.weaponTarget = new Phaser.Point();
    this.calculatePath();
    this.stunnedCounter = 0;
    this.attackWindupCounter = 0;
    this.cooldownCounter = 0;
    this.disableAI = false;

    game.add.existing(this);
    this.anchor.setTo(0.5);

    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

    this.facing = 'north';
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.constants = { };
Enemy.prototype.constants.speed = 75;
Enemy.prototype.constants.acceleration = 25;
Enemy.prototype.constants.stunTime = 12;
Enemy.prototype.constants.knockbackForce = 250;
Enemy.prototype.constants.attackWindupTimeMelee = 40;
Enemy.prototype.constants.attackWindupTimeRanged = 20;
Enemy.prototype.constants.attackWindupTimeAOE = 80;
Enemy.prototype.constants.cooldownTimeAOE = 300;
Enemy.prototype.constants.cooldownTimeMelee = 5;
Enemy.prototype.constants.cooldownTimeRanged = 20;
Enemy.prototype.constants.attackDistanceMelee = 50;
Enemy.prototype.constants.attackDistanceRanged = 150;
Enemy.prototype.constants.attackDistanceAOE = 100;
Enemy.prototype.constants.arrowFlySpeed = 300;
Enemy.prototype.constants.bombFlySpeed = 150;
Enemy.prototype.constants.bombExplosionTime = 100;
Enemy.prototype.constants.bombExplosionRadius = 100;
Enemy.prototype.constants.bombKnockback = 250;
Enemy.prototype.constants.bombDamage = 5;
Enemy.prototype.maxHealth = 5;
Enemy.prototype.health = Enemy.prototype.maxHealth;

Enemy.prototype.update = function() {
    if(!this.mainState.isDialog && this.alive && !this.disableAI){
        if(this.stunnedCounter === 0){
            var sightBlockingTiles = false;
            if(this.mobType === 'ranged'){
                this.sightLine.start.set(this.x, this.y);
                this.sightLine.end.set(this.target.x, this.target.y);
                sightBlockingTiles = this.collisionMap.getRayCastTiles(this.sightLine, 4, true);
            }

            if(this.attackDistance < 1000){
                if((sightBlockingTiles && sightBlockingTiles.length > 0 && this.attackWindupCounter === 0) || (this.attackWindupCounter === 0 && game.physics.arcade.distanceBetween(this, this.target) > this.attackDistance)){
                    this.traversePath();
                    this.tint = 0xFFFFFF;
                } else {
                    this.attemptAttack(sightBlockingTiles);
                } 
            } else{
                this.attemptAttack(false);
            }

            if(this.cooldownCounter > 0){
                this.cooldownCounter--;
            }
        } else if(this.stunnedCounter > 0){
            this.stunnedCounter--;
            
            game.physics.arcade.collide(this, this.collisionMap);

            if(this.stunnedCounter === 0){
                this.calculatePath();
            }
        }

        if(this.bomb && this.bomb.exists){
            if(game.physics.arcade.distanceBetween(this.bomb, this.weaponTarget) < 5){
                this.bomb.body.velocity.setTo(0);
            }

            if(this.bombExplosionCounter === 0){
                this.exploadBomb();
            } else {
                this.bombExplosionCounter--;
            }
        }

        if(this.speechbubble){
            this.speechbubble.exists = false;
        }
    } else if(!this.disableAI){
        this.body.velocity.setTo(0);
    }

    if(this.mobType === 'melee'){
        if(this.body.velocity.x < -1){
            this.animations.play('walk-left');
        }else if(this.body.velocity.x > 1){
            this.animations.play('walk-right');
        }else if(this.body.velocity.y < -1){
            this.animations.play('walk-up');
        }else if(this.body.velocity.y > 1){
            this.animations.play('walk-down');
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

Enemy.prototype.getHit = function(attacker, knockback, damage) {
    this.stunnedCounter = this.constants.stunTime;
    this.body.velocity.x = (knockback || this.constants.knockbackForce)*Math.cos(game.physics.arcade.angleBetween(attacker, this));
    this.body.velocity.y = (knockback || this.constants.knockbackForce)*Math.sin(game.physics.arcade.angleBetween(attacker, this));
    this.damage(damage || 1);
    this.attackWindupCounter = 0;
    this.tint = 0xFF0000;
    Config.sfxObjects.hit.play();

    if(!this.alive){
        var coinsToDrop = game.rnd.between(0, 10);

        for(var i = 0; i < coinsToDrop; i++){
            var coin = this.mainState.coins.create(this.x, this.y, 'coin');

            coin.body.velocity.setTo(game.rnd.between(-30, 30), game.rnd.between(-30, 30));
        }

        if(!game.rnd.between(0, 5)){
            var potion = this.mainState.potions.create(this.x, this.y, 'healthpotion');

            potion.body.velocity.setTo(game.rnd.between(-30, 30), game.rnd.between(-30, 30));   
        }
    }
}

Enemy.prototype.attemptAttack = function(sightBlockingTiles) {
    this.body.velocity.setTo(0);

    if(this.attackWindupCounter === 0 && (!sightBlockingTiles || !sightBlockingTiles.length) && this.cooldownCounter === 0){
        this.attackWindupCounter = this.attackWindupTime;
        this.tint = 0x000000;
        
        this.weaponTarget.set(this.target.x, this.target.y);
    } else if(this.attackWindupCounter > 0) {
        this.attackWindupCounter--;

        if(this.attackWindupCounter === 0){
            this.doAttack();
        }
    }
}

Enemy.prototype.doAttack = function() {
    if(this.mobType === 'melee'){
        this.slashEffect.doAttack();
    } else if(this.mobType === 'ranged'){
        this.weapon.fireAtXY(this.weaponTarget.x, this.weaponTarget.y);
        this.tint = 0xFFFFFF;
    } else if(this.mobType === 'aoe'){
        this.bomb.exists = true;
        this.bomb.position.set(this.x, this.y);
        game.physics.arcade.moveToXY(this.bomb, this.weaponTarget.x, this.weaponTarget.y, this.constants.bombFlySpeed);
        this.bombExplosionCounter = this.constants.bombExplosionTime;
        this.tint = 0xFFFFFF;
    }

    this.cooldownCounter = this.attackCooldownTime;
}

Enemy.prototype.onAttackComplete = function() {
    this.tint = 0xFFFFFF;
}

Enemy.prototype.onSuccessfulSlash = function(me, enemy){
    enemy.getHit(this.slashEffect);
}

Enemy.prototype.onSuccessfulArrow = function(enemy, arrow){
    enemy.getHit(arrow);
    arrow.kill();
}

Enemy.prototype.onFailedArrow = function(arrow, tile){
    arrow.kill();
}

Enemy.prototype.getExploaded = function(bomb, force){
    this.getHit(bomb, force);
}

Enemy.prototype.exploadBomb = function() {
    this.enemies.forEach(function(enemy){
        if(game.physics.arcade.distanceBetween(this.bomb, enemy) <= this.constants.bombExplosionRadius){
            enemy.getExploaded(this.bomb, this.constants.bombKnockback, this.constants.bombDamage);
        }
    }, this);

    if(game.physics.arcade.distanceBetween(this.bomb, this.target) <= this.constants.bombExplosionRadius){
        this.target.getExploaded(this.bomb, this.constants.bombKnockback, this.constants.bombDamage);
    }

    this.bomb.exists = false;
    

    game.camera.flash(0xFFFFFF, 150, false, 0.5);
    game.camera.shake(0.025, 100);
    Config.sfxObjects.explosion.play();
}



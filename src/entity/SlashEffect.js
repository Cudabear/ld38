SlashEffect = function(owner){
    Phaser.Sprite.call(this, game, owner.x, owner.y, 'slash');
    game.add.existing(this);
    this.slashAnim = this.animations.add('slash', null, 20);
    this.slashAnim.onComplete.add(this.onSlashComplete, this);
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.exists = false;
    this.pivot.y = owner.height;
    if(owner.isHero){
        this.pivot.y = 24;
    }

    this.owner = owner;
}

SlashEffect.prototype = Object.create(Phaser.Sprite.prototype);
SlashEffect.prototype.constructor = SlashEffect;
SlashEffect.prototype.update = function() {
    this.x = this.owner.x;
    this.y = this.owner.y;


        
    if(this.owner.mobType){
        this.rotation = game.physics.arcade.angleBetween(this, this.owner.weaponTarget) + Math.PI/2;
    } else {
        //this.rotation = game.physics.arcade.angleToPointer(this) + Math.PI/2;

        if(this.owner.facing == 'up'){
            this.rotation = 0;
        }else if(this.owner.facing == 'right'){
            this.rotation = Math.PI/2;
        }else if(this.owner.facing == 'down'){
            this.rotation = Math.PI;
        }else if(this.owner.facing == 'left'){
            this.rotation = Math.PI*3/2
        }
    }
}

SlashEffect.prototype.onSlashComplete = function() {
    this.exists = false;

    if(this.owner.onAttackComplete){
        this.owner.onAttackComplete();
    }
}

SlashEffect.prototype.doAttack = function() {
    this.exists = true;
    this.animations.play('slash');
    this.tint = 0xFFFFFF;
}
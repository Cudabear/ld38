SlashEffect = function(owner){
    Phaser.Sprite.call(this, game, owner.x, owner.y, 'slash');
    game.add.existing(this);
    this.slashAnim = this.animations.add('slash', null, 10);
    this.slashAnim.onComplete.add(this.onSlashComplete, this);
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.exists = false;

    this.owner = owner;
}

SlashEffect.prototype = Object.create(Phaser.Sprite.prototype);
SlashEffect.prototype.constructor = SlashEffect;
SlashEffect.prototype.update = function() {
    if(this.exists){
        this.x = this.owner.x + (this.owner.facing === 'left' ? -32 : 0) + (this.owner.facing === 'right' ? 32 : 0);
        this.y = this.owner.y + (this.owner.facing === 'up' ? -32 : 0) + (this.owner.facing === 'down' ? 32 : 0);

        if(this.owner.facing === 'right') {
            this.rotation = Math.PI/2;
        }else if(this.owner.facing === 'left') {
            this.rotation = Math.PI*3/2;
        }else if(this.owner.facing === 'down') {
            this.rotation = Math.PI;
        }else if(this.owner.facing === 'up') {
            this.rotation = 0;
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
Npc = function(mainState, hero, x, y, id) {
    this.hero = hero;
    this.mainState = mainState;

    Phaser.Sprite.call(this, game, x, y, 'TestEnemy');
    game.add.existing(this);
    this.anchor.setTo(0.5);

    this.dialog = NpcDialog[id].dialog;

    game.physics.arcade.enable(this);
    this.body.immovable = true;
}

Npc.prototype = Object.create(Phaser.Sprite.prototype);
Npc.prototype.constructor = Npc;
Npc.prototype.update = function() {
    this.handleInput();
}

Npc.prototype.handleInput = function() {
    if(game.input.keyboard.downDuration(Phaser.Keyboard.A, 5)) {
        if(game.physics.arcade.distanceBetween(this, this.hero) <= 50){
            this.mainState.setDialog(this.dialog);
        }
    }
}
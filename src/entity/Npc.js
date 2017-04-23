Npc = function(mainState, hero, x, y, id, key, flipped) {
    this.hero = hero;
    this.mainState = mainState;
    this.id = id;
    this.key = key || 'npcs';
    Phaser.Sprite.call(this, game, x, y, this.key);
    if(this.key === 'npcs'){
        this.frame = game.rnd.between(0,2);
    }

    game.add.existing(this);
    this.anchor.setTo(0.5);

    if(flipped){
        this.scale.x = -1;
    }

    this.dialog = NpcDialog[id].dialog;
    this.choice = NpcDialog[id].choice;
    this.important = NpcDialog[id].important || false;
    this.callback = NpcDialog[id].callback || false;

    game.physics.arcade.enable(this);
    this.body.immovable = true;
    game.input.onDown.add(this.handleClick, this);

    if(this.important){
        this.arrow = game.add.sprite(x, y-64, 'pointerArrow');
        this.arrow.anchor.setTo(0.5);
        this.arrow.animations.add('bounce', null, 3, true);
        this.arrow.animations.play('bounce');
    }
}

Npc.prototype = Object.create(Phaser.Sprite.prototype);
Npc.prototype.constructor = Npc;
Npc.prototype.update = function() {
    this.handleInput();
}

Npc.prototype.handleInput = function() {

}

Npc.prototype.handleClick = function() {
    if(game.physics.arcade.distanceBetween(this, this.hero) <= 50){
        this.mainState.setDialog(this.dialog, this.choice, this.callback);
        if(this.arrow){
            this.arrow.exists = false;
        }
        NpcDialog[this.id].important = false;
    }
}
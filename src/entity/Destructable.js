Destructable = function(mainState, key, x, y, isAlive) {
	this.key = key || 'pot';
	this.mainState = mainState;

	if(this.key === 'barrel'){
		this.key = 'pot';
	}

	Phaser.Sprite.call(this, game, x, y, this.key);
	game.add.existing(this);
    this.anchor.setTo(0.5);
    this.isAlive = isAlive;
    if(!this.isAlive){
    	this.frame = 1;
    }

    console.log('physics enabled');
	game.physics.arcade.enable(this);
	this.body.immovable = true;
}

Destructable.prototype = Object.create(Phaser.Sprite.prototype);
Destructable.prototype.constructor = Destructable;

Destructable.prototype.onCollide = function(slashEffect, me){
	if(this.isAlive){
		me.isAlive = false;
		me.frame = 1;
		Config.sfxObjects.hit.play();

		var coinsToDrop = game.rnd.between(0, 2);

	    for(var i = 0; i < coinsToDrop; i++){
	        var coin = this.mainState.coins.create(this.x, this.y, 'coin');

	        coin.body.velocity.setTo(game.rnd.between(-30, 30), game.rnd.between(-30, 30));
	    }

	    if(!game.rnd.between(0, 10)){
	        var potion = this.mainState.potions.create(this.x, this.y, 'healthpotion');

	        potion.body.velocity.setTo(game.rnd.between(-30, 30), game.rnd.between(-30, 30));   
	    }
	}
}
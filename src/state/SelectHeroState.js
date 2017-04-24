SelectHeroState = function(){

}

SelectHeroState.prototype = {
	create: function() {
		console.log('create select hero');

		Config.musicObjects.upbeatBgm.play('', 0, 1, true);

		this.splash = game.add.image(0, 0, 'splash');

		this.hero = game.add.sprite(game.world.centerX - 140, game.world.centerY+62, 'hero');
		this.hero.scale.setTo(2);
		this.hero.anchor.setTo(0.5);

		this.otherGuy = game.add.sprite(game.world.centerX + 120, game.world.centerY+37, 'otherhero');
		this.otherGuy.scale.setTo(2);
		this.otherGuy.anchor.setTo(0.5);
		this.otherGuyFadeTween = game.add.tween(this.otherGuy);
		this.otherGuyFadeTween.to({alpha: 0 }, 500);

		this.pointerArrow = game.add.sprite(this.hero.x, this.hero.y - 120, 'pointerArrow');
		this.pointerArrow.anchor.setTo(0.5);
		this.pointerArrow.animations.add('bounce', null, 3, true);
		this.pointerArrow.animations.play('bounce');
		this.pointerTween = game.add.tween(this.pointerArrow);
		this.pointerTween.to({x: this.otherGuy.x - 20 }, 1000).to({x: this.hero.x}, 200);

		this.otherPointer = game.add.sprite(this.otherGuy.x, -64, 'pointerArrow');
		this.otherPointer.anchor.setTo(0.5);
		this.otherPointerTween = game.add.tween(this.otherPointer);
		this.otherPointerTween.to({x: this.otherGuy.x, y: this.hero.y-120}, 1000);
		this.pointerFadeTween = game.add.tween(this.otherPointer);
		this.pointerFadeTween.to({alpha: 0}, 500);
		this.otherPointerTween.onComplete.add(function(){
			this.otherGuyFadeTween.start();
			this.pointerFadeTween.start();
			Config.sfxObjects.hit.play();
		}, this);

		this.alreadyAttemptedSelection = false;

		game.camera.onFadeComplete.addOnce(function(){
			game.state.start('initial');
		});
	},

	update: function() {
		if(game.input.keyboard.downDuration(Phaser.Keyboard.RIGHT, 5) || game.input.keyboard.downDuration(Phaser.Keyboard.D, 5) ) {
			if(!this.alreadyAttemptedSelection){
				Config.sfxObjects.select.play();
				this.pointerTween.start();
				this.otherPointerTween.start();
				this.alreadyAttemptedSelection = true;
			} else {
				Config.sfxObjects.hit.play();
			}
		}

		if(game.input.keyboard.downDuration(Phaser.Keyboard.LEFT, 5) || game.input.keyboard.downDuration(Phaser.Keyboard.A, 5)) {
			Config.sfxObjects.hit.play();
		}

		if(game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 5)) {
			Config.sfxObjects.select.play();
			game.camera.fade();
		}
	},

	render: function() {

	}
}
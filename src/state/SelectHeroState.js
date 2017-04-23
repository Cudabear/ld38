SelectHeroState = function(){

}

SelectHeroState.prototype = {
	create: function() {
		console.log('create select hero');

		Config.musicObjects.upbeatBgm.play('', 0, 1, true);

		this.hero = game.add.sprite(game.world.centerX - 120, game.world.centerY, 'hero');
		this.hero.scale.setTo(3);
		this.hero.anchor.setTo(0.5);

		this.otherGuy = game.add.sprite(game.world.centerX + 120, game.world.centerY, 'TestEnemy');
		this.otherGuy.scale.setTo(3);
		this.otherGuy.anchor.setTo(0.5);
		this.otherGuyFadeTween = game.add.tween(this.otherGuy);
		this.otherGuyFadeTween.to({alpha: 0 }, 500);

		this.instructionText = game.add.bitmapText(game.world.centerX, game.height - 100, 'font', 'use left and right arrows to select and A to choose', 32);

		this.instructionText.anchor.setTo(0.5);

		this.titleText = game.add.bitmapText(game.world.centerX, 100, 'font', 'Select your hero!', 32);
		this.titleText.anchor.setTo(0.5);

		this.statsText = game.add.bitmapText(150, game.world.centerY, 'font', 'Stats:\n\nMight: 3\nSpeed: 5\nSanity: 10\nKnowledge:1', 32);
		this.statsText.anchor.setTo(0.5);
		this.statsText.maxWidth = 250;

		this.pointerArrow = game.add.sprite(this.hero.x, this.hero.y - 128, 'pointerArrow');
		this.pointerArrow.anchor.setTo(0.5);
		this.pointerArrow.animations.add('bounce', null, 3, true);
		this.pointerArrow.animations.play('bounce');
		this.pointerTween = game.add.tween(this.pointerArrow);
		this.pointerTween.to({x: this.otherGuy.x - 20 }, 1000).to({x: this.hero.x}, 200);

		this.otherPointer = game.add.sprite(this.otherGuy.x, -64, 'pointerArrow');
		this.otherPointer.anchor.setTo(0.5);
		this.otherPointerTween = game.add.tween(this.otherPointer);
		this.otherPointerTween.to({x: this.otherGuy.x, y: game.world.centerY - 128}, 1000);
		this.pointerFadeTween = game.add.tween(this.otherPointer);
		this.pointerFadeTween.to({alpha: 0}, 500);
		this.otherPointerTween.onComplete.add(function(){
			this.otherGuyFadeTween.start();
			this.pointerFadeTween.start();
			Config.sfxObjects.hit.play();
			this.instructionText.setText('use A to continue');
			this.statsText.setText('Stats:\n\nMight: 3\nSpeed: 5\nSanity: 10\nKnowledge:1');
		}, this);

		this.alreadyAttemptedSelection = false;

		game.camera.onFadeComplete.addOnce(function(){
			game.state.start('initial');
		});
	},

	update: function() {
		if(game.input.keyboard.downDuration(Phaser.Keyboard.RIGHT, 5)) {
			if(!this.alreadyAttemptedSelection){
				Config.sfxObjects.select.play();
				this.pointerTween.start();
				this.otherPointerTween.start();
				this.statsText.setText('Stats:\n\nMight: 900\nSpeed: 455\nSanity: 1000\nKnowledge:980');
				this.alreadyAttemptedSelection = true;
			} else {
				Config.sfxObjects.hit.play();
			}
		}

		if(game.input.keyboard.downDuration(Phaser.Keyboard.LEFT, 5)) {
			Config.sfxObjects.hit.play();
		}

		if(game.input.keyboard.downDuration(Phaser.Keyboard.A, 5)) {
			Config.sfxObjects.select.play();
			game.camera.fade();
		}
	},

	render: function() {

	}
}
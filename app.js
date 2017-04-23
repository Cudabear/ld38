var game;

document.addEventListener("DOMContentLoaded", function(event){
	//create a new game and run it
	game = new Phaser.Game(Config.size.width, Config.size.height, Phaser.OPENGL, 'game', null, false, false);

	//add the game states
	game.state.add('SplashState', new SplashState());
	game.state.add('LoadState', new LoadState());
	game.state.add('BootupState', new BootupState());
	game.state.add('SelectHero', new SelectHeroState());
	game.state.add('initial', new MainState('Town', 'south'));
	game.state.add('town-revisit', new MainState('Town', {x: 830, y: 180}));
	game.state.add('room1', new MainState('Room1', 'south'));

    game.state.start('BootupState');
});
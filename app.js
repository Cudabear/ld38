var game;

document.addEventListener("DOMContentLoaded", function(event){
	//create a new game and run it
	game = new Phaser.Game(Config.size.width, Config.size.height, Phaser.OPENGL, 'game', null, false, false);

	//add the game states
	game.state.add('SplashState', new SplashState());
	game.state.add('LoadState', new LoadState());
	game.state.add('BootupState', new BootupState());
	game.state.add('SelectHero', new SelectHeroState());
	game.state.add('initial', new MainState('TestMap', 'south'));
	game.state.add('test', new MainState('TestMap', 'north'));
	game.state.add('test2', new MainState('TestMap2', 'south'));

    game.state.start('BootupState');
});
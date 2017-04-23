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
	game.state.add('room1', new MainState('Room1', 'south'));
	game.state.add('room2', new MainState('Room2', 'south'));
	game.state.add('room3', new MainState('Room3', 'south'));
	game.state.add('room4', new MainState('Room4', 'south'));
	game.state.add('room5', new MainState('Room5', 'south'));
	game.state.add('room6', new MainState('Room6', 'south'));
	game.state.add('room7', new MainState('Room7', 'south'));
	game.state.add('room8', new MainState('Room8', 'south'));
	game.state.add('room9', new MainState('Room9', {x: 883, y: 132}));
	game.state.add('room10', new MainState('Room10', 'south'));
	game.state.add('credits', new CreditState());

    game.state.start('BootupState');
});
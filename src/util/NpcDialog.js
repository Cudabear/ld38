NpcDialog = {
	'sample': {
		dialog: ['hi', 'my name is error']
	},
	'instructor': {
		dialog: ['here is some informative dialog to help you get started on your quest',
			'you can move with the WSAD keys, but you probably already knew that',
			'you can also move with the arrow keys, if you\'re weird like that.',
			'Use the left mouse button to attack.',
			'You attack in the direction of your mousepointer',
			'Good luck on your quest!' ],
		important: true
	},
	'room1': {
		dialog: ['Oooh boy, another one...',
			'I\'m getting sick and tired of this job']
	},
	'room3': {
		dialog: ['Haha, foolish adventurer!',
			'In order to progress, you\'ll need to pass my devilish MAZE!',
			'All the while, I\'ll safely be shooting arrows from way over here!']
	},
	'room3-2': {
		dialog: ['Oh shoot... that was all the arrows I had...',
			'Too many adventurers coming through at the same time...',
			'looks like you get off easy, this time!'],
		callback: function(mainState) {
			mainState.enemies.getAt(0).disableAI = true;
			game.physics.arcade.moveToXY(mainState.enemies.getAt(0), 194, 68, 140);
			game.time.events.add(1000, function() {
		        mainState.enemies.getAt(0).kill();
		       	mainState.map.putTile(768, 2, 11, mainState.mapCollision);
			    mainState.map.putTile(768, 3, 11, mainState.mapCollision);
			    mainState.map.putTile(null, 2, 11, mainState.mapDetail);
			    mainState.map.putTile(null, 3, 11, mainState.mapDetail);
		        game.camera.flash(0xFFFFFF, 150, false, 0.5);
    			game.camera.shake(0.025, 100);
		    }, this);
		}
	}
}
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
	'dead': {
		dialog: ['Oh, it seems you have succumbed to the elements of the dungeon.  Somehow, even though there\'s hardly anything left here.'],
		choice: {
			yes: "Give me another go!",
			yesCallback: function() {
				game.camera.onFadeComplete.addOnce(function(){
		            game.state.restart();
		        });
		        game.camera.fade();
			},
			no: "I\'m done, take me out of here!",
			noCallback: function(){
				game.camera.onFadeComplete.addOnce(function(){
		            game.state.start('SplashState');
		        });
		        game.camera.fade();
			}
		}
	},
	'lockedoor': {
		dialog: ['It\'s locked.  The monsters must have something to do with it.'],
	},
	'room1': {
		dialog: ['Oooh boy, another one...',
			'Do you think he\'ll actually fight us, or run away like those other weasles?']
	},
	'room3': {
		dialog: ['Haha, foolish adventurer!',
			'In order to progress, you\'ll need to pass my devilish MAZE!',
			'All the while, I\'ll safely be shooting arrows from way over here!']
	},
	'room3-2': {
		dialog: ['Oh shoot... running really low on slime...',
			'Too many adventurers coming through lately...',
			'looks like you get off easy, adventurer!!'],
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
    			Config.sfxObjects.hit.play();
		    }, this);
		}
	},
	'fakeDoor': {
		dialog: ['You chose the wrong door!'],
		callback: function(mainState){
			mainState.hero.getHit();
			NpcDialog['fakeDoor'].dialog = ['Did you really just do that again?'];
		},
		preserve: true
	},
	'fakeDoorWarning': {
		dialog: ['one of these doors is the correct one',
			'and one of them will hurt you.',
			'There\'s absolutely no way to tell which is which.',
			'Good luck!'],
		important: true
	},
	'room5-aoe': {
		dialog: ['can you believe someone actually fell for that STUPID trick?',
			'you didn\'t fall for it, did you?',
			'Anyway, the last guy dropped some bombs and I\'m itching to try them out.',
			'Wanna be my test subject?']
	},
	'room6-trap': {
		dialog: [
			'haha!, blow the trap and trap this fool!'
		],
		callback: function(mainState){
			mainState.map.putTile(144, 14, 18, mainState.mapDetail);
		    mainState.map.putTile(144, 15, 18, mainState.mapDetail);
		    mainState.map.putTile(144, 16, 18, mainState.mapDetail);
		    mainState.map.putTile(144, 17, 18, mainState.mapDetail);
	        game.camera.flash(0xFFFFFF, 150, false, 0.5);
			game.camera.shake(0.025, 100);
			game.time.events.add(5000, function() {
			    mainState.triggerTrigger(mainState.hero, {dialog: 'room6-help'})
		    }, this);
		    Config.sfxObjects.explosion.play();
		}
	},
	'room6-help': {
		dialog: ['were you the guy who dropped the bombs?',
			'if so, let me pay you back!'],
		callback: function(mainState) {
			mainState.map.putTile(768, 14, 18, mainState.mapCollision);
			mainState.map.putTile(768, 15, 18, mainState.mapCollision);
			mainState.map.putTile(768, 16, 18, mainState.mapCollision);
			mainState.map.putTile(768, 17, 18, mainState.mapCollision);
			mainState.map.putTile(null, 14, 18, mainState.mapDetail);
		    mainState.map.putTile(null, 15, 18, mainState.mapDetail);
		    mainState.map.putTile(null, 16, 18, mainState.mapDetail);
		    mainState.map.putTile(null, 17, 18, mainState.mapDetail);
			game.camera.flash(0xFFFFFF, 300, false, 0.90);
			game.camera.shake(0.025, 200);

			mainState.triggerCallback = false;

			mainState.enemies.forEach(function(enemy){
				enemy.kill();
			}, mainState);
			Config.sfxObjects.hit.play();

			var temp = new Npc(mainState, mainState.hero, 436, 168, 'room6-npc', true);
		}
	},
	'room6-npc': {
		dialog: ['hey are you okay?',
			'I\'m suprised there were so many here',
			'They really mass up when we\'re not looking',
			'Anyway, the boss is up ahead.  Good luck!'],
		important: true
	},
	'garbage': {
		dialog: ['you shouldnt ever see this!']
	},
	'room7-backline': {
		dialog: ['I\'m so excited to kill the boss',
			'It\'s my first time, how about you?']
	},
	'room7-bouncer': {
		dialog: ['There\'s been a huge influx of adventurers lately, so I was hired to keep the peace and make sure everyone gets a fair shot at fighting the boss.  Are you ready to wait in line?'],
		choice: {
			yes: 'I\'ll wait as long as it takes.',
			yesCallback: function(mainState) {
				mainState.triggerTrigger(mainState.hero, {dialog: 'room7-bouncer-yes'});
			},
			no: 'Screw this!',
			noCallback: function(mainState) {
				mainState.triggerTrigger(mainState.hero, {dialog: 'room7-bouncer-no'});
			}
		},
		important: true
	},
	'room7-bouncer-no': {
		dialog: ['Well fine.  But the line probably won\'t be any shorter',
			'by the time you come back.'],
		callback: function() {}
	},
	'room7-bouncer-yes': {
		dialog: ['Alright.  It\'s going to take a while, though.'],
		callback: function() {
			game.camera.onFadeComplete.addOnce(function(){
	            game.state.start('room8');
	        });
	        game.camera.fade();
		}
	},
	'boss-text': {
		dialog: ['...',
			'man, I\'m so tired...',
			'Oh?  Is someone there?',
			'Oh gosh, sorry, this is so unprofessional',
			'I thought I was done for the day.  It seems I was wrong',
			'*clears throat*',
			'YOU WILL RUE THE DAY YOU CHALLEN...*cough*',
			'*hack*',
			'*sputter*',
			'...',
			'look...',
			'I\'ve lost track of how many adventurers have challenged me today',
			'I\'m very tired.',
			'Can we skip the formality and I\'ll just let you at the treasure?'],
		choice: {
			yes: 'Treasure faster, sounds good!',
			yesCallback: function(mainState){
				mainState.triggerTrigger(mainState.hero, {dialog: 'room8-boss-yes'});
				mainState.npcs.getAt(0).dialog = NpcDialog['room8-boss-post-choice'].dialog;
				mainState.npcs.getAt(0).choice = null;
				mainState.choice = null;
				UserData.choice = 'loot';
			},
			no: 'I have to earn it, you vile beast!',
			noCallback: function(mainState){
				mainState.triggerTrigger(mainState.hero, {dialog: 'room8-boss-no'});
				mainState.npcs.getAt(0).dialog = NpcDialog['room8-boss-post-choice'].dialog;
				mainState.npcs.getAt(0).choice = null;
				mainState.choice = null;
				UserData.choice = 'leave';
			}
		}
	},
	'room8-boss-post-choice': {
		dialog: ['I\'m going to sleep.  Just get your loot and scram'],
		choice: null,
		callback: null
	},
	'room8-boss-yes': {
		dialog: ['Awesome. Look man, you\'re a lifesaver.  Just go through the',
			'door behind me and you cna have whatever\'s left.'],
		callback: function(mainState) {

		}

	},
	'room8-boss-no': {
		dialog: ['You know what?  I don\'t have time for you.'],
		callback: function(mainState) {
			mainState.hero.getHit();
			game.camera.flash(0xFFFFFF, 150, false, 0.50);
			game.camera.shake(0.025, 100);
			mainState.hero.stunnedCounter = 180;
			game.physics.arcade.moveToXY(mainState.hero, 515, 626, mainState.hero.speed, 1000)
			mainState.triggerCallback = false;
			game.time.events.add(1000, function() {
			    game.camera.onFadeComplete.addOnce(function(){
	           		game.state.start('room9');
	        	});
			    game.camera.fade();
		    }, this);
		}
	},
	'room9-lockedoor': {
		dialog: ['It\'s locked.'],
		preserve: true
	},
	'room9-bouncer': {
		dialog: ['huh, you again?',
			'You didn\'t take the free loot, did you?',
			'Well, that\'s a first for me.',
			'Look I\'m off for the day now, so it looks like you\'re out of luck.',
			'You\'ll have to try again another time.']
	},
	'room10-chest': {
		dialog: ['The treasure chest is ajar and unlocked.  As it opens, you see, unsurprisingly, it\'s mostly empty.  At the bottom, there is a rusted tin cup.',
			'You take the cup, estimating that it has to be worth at least $5.00.  And you\'re certainly not leaving empty handed.'],
		callback: function(mainState) {
			mainState.coinCount += 5;
			mainState.coinCounter.setText("$"+mainState.coinCount.toFixed(2));
			Config.sfxObjects.coin.play();
		},
		important: true
	}
}
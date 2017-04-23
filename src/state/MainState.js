MainState = function(tilemapKey, spawnSide){ 
    this.tilemapKey = tilemapKey;
    this.spawnSide = spawnSide;
}

MainState.prototype = {
    init: function(levelMapKey) {
        this.levelMapKey = levelMapKey;
    },

    preload: function() {
        console.log('preload main state');
    },

    create: function() {
        console.log('create main state', this.tilemapKey, this.spawnSide);

        game.physics.startSystem(Phaser.Physics.Arcade);

        game.input.onDown.add(this.handleClick, this);

        this.camera.flash(0x000000);

        if(this.tilemapKey === 'Room7' || this.tilemapKey === 'Room9'){
            Config.musicObjects.relaxedBgm.play();
            Config.musicObjects.upbeatBgm.stop();
        } else {
            if(!Config.musicObjects.upbeatBgm.isPlaying){
                Config.musicObjects.relaxedBgm.stop();
                Config.musicObjects.upbeatBgm.play();
            }
        }

        this.bottomBar = game.add.image(0, game.height - 128, 'bottombar');

        this.dialogArray = [ ];
        this.currentDialogLine = '';
        this.dialogText = game.add.bitmapText(153, game.height - 115, 'font', '', 32);
        this.dialogText.maxWidth = game.width - 190;

        this.map = game.add.tilemap(this.tilemapKey);
        this.map.addTilesetImage('TileSet');
        this.mapCollision = this.map.createLayer('Collision');
        this.mapCollision.alpha = 0;
        this.mapCollision.resizeWorld();
        this.map.setCollision(767, true, this.mapCollision);
        Config.plugins.AStar.setAStarMap(this.map, 'Collision', 'TileSet');
        this.mapBackground = this.map.createLayer('Background');
        this.mapForeground = this.map.createLayer('Foreground');
        this.mapDetail = this.map.createLayer('Detail');

        this.acceptingNewDialog = true;
        this.isDialog = false;

        this.coins = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);
        if(UserData.levelData[this.tilemapKey]){
            UserData.levelData[this.tilemapKey].coins.forEach(function(coin){
                this.coins.create(coin.x, coin.y, 'coin');
            }, this);
        }

        this.potions = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);
        if(UserData.levelData[this.tilemapKey]){
            UserData.levelData[this.tilemapKey].potions.forEach(function(potion){
                this.potions.create(potion.x, potion.y, 'healthpotion');
            }, this);
        }

        this.hero = new Hero(this, this.spawnSide);
        if(UserData.heroData){
            this.hero.setVitals(UserData.heroData);
        }

        this.enemies = game.add.group();
        if(!UserData.levelData[this.tilemapKey]){
            this.map.objects.Enemies.forEach(function(enemyObject){
                var temp = new Enemy(enemyObject.type, enemyObject.x, enemyObject.y, this, this.hero, this.enemies, this.map, this.mapCollision, enemyObject.properties ? enemyObject.properties.dialog : false);
                this.enemies.add(temp);
                
                if(enemyObject.properties && enemyObject.properties.range){
                    temp.attackDistance = parseInt(enemyObject.properties.range);
                }
            }, this);
        } else {
            UserData.levelData[this.tilemapKey].enemies.forEach(function(enemy){
                var temp = new Enemy(enemy.mobType, enemy.x, enemy.y, this, this.hero, this.enemies, this.map, this.mapCollision, enemy.dialog);
                this.enemies.add(temp);

                temp.health = enemy.health;
                if(enemy.range > 1000){
                    temp.attackDistance = parseInt(enemy.range);
                }
            }, this);
        }


        this.npcs = game.add.group();
        this.map.objects.Npcs.forEach(function(npcObject){
            console.log(npcObject.properties);
            this.npcs.add(new Npc(this, this.hero, npcObject.x, npcObject.y, npcObject.properties.id, npcObject.properties.key, npcObject.properties.flip));
            this.acceptingNewDialog = true;
        }, this);

        this.destructables = game.add.group();
        if(!UserData.levelData[this.tilemapKey]){
            this.map.objects.Destructables.forEach(function(destructable){
                this.destructables.add(new Destructable(this, destructable.type, destructable.x, destructable.y, true));
            }, this);
        } else {
            UserData.levelData[this.tilemapKey].destructables.forEach(function(destructable){
                this.destructables.add(new Destructable(this, destructable.key, destructable.x, destructable.y, destructable.isAlive));
            }, this);
        }


        this.doors = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);
        this.map.createFromObjects('Doors', 'door', 'arrow', 0, true, false, this.doors, Phaser.Sprite, false);
        this.doors.forEach(function(door){
            door.body.immovable = true;
            door.alpha = 0;
        }, this);

        this.triggers = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);
        if(!UserData.levelData[this.tilemapKey]){
            if(this.map.objects.Triggers){
                this.map.createFromObjects('Triggers', 'trigger', 'arrow', 0, true, false, this.triggers, Phaser.sprite, false);
            }
        } else {
            UserData.levelData[this.tilemapKey].triggers.forEach(function(trigger){
                var temp = this.triggers.create(trigger.x, trigger.y, 'arrow');
                temp.callback = trigger.callback;
                temp.dialog = trigger.dialog;
            }, this);
        }

        this.triggers.forEach(function(trigger){
            trigger.body.immovable = true;
            trigger.alpha = 0;
        }, this);

        this.coinCount = UserData.coinCount === undefined ? 0 : UserData.coinCount;
        this.coinCounter = game.add.bitmapText(20, game.height - 80, 'font', '$'+this.coinCount.toFixed(2), 32);
 
        this.choiceButton1 = game.add.image(game.world.centerX - 180, game.height - 119, 'choicebutton');
        this.choiceButton1.inputEnabled = true;
        this.choiceButton1.events.onInputDown.add(function(){
            this.isDialog = false;
            this.choice.yesCallback(this);
            this.choice = null;
            this.choiceLine1.setText('');
            this.choiceLine2.setText('');
            this.choiceButton1.exists = false;
            this.choiceButton2.exists = false;
        }, this);
        this.choiceButton1.exists = false;
        this.choiceLine1 = game.add.bitmapText(game.world.centerX - 175, game.height - 114, 'font', '', 32);
        this.choiceButton2 = game.add.image(game.world.centerX - 180, game.height - 63, 'choicebutton');
        this.choiceButton2.inputEnabled = true;
        this.choiceButton2.events.onInputDown.add(function(){
            this.isDialog = false;
            this.choice.noCallback(this);
            this.choice = null;
            this.choiceLine1.setText('');
            this.choiceLine2.setText('');
            this.choiceButton1.exists = false;
            this.choiceButton2.exists = false;
        }, this);
        this.choiceLine2 = game.add.bitmapText(game.world.centerX - 175, game.height - 58, 'font', '', 32);
        this.choiceButton2.exists = false;

        this.hero.bringToTop();
    },

    update: function() {
        this.handleInput();
        this.handlePhysics();
    },

    render: function() {

    },

    handleInput: function() {
        if(game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 5)) {
            if(this.isDialog){
                this.advanceDialog();
            } else {
                this.acceptingNewDialog = true;
            }
        }
    },

    handleClick: function() {

    },

    handlePhysics: function() {
        this.coins.forEach(function(coin){
            game.physics.arcade.collide(this.hero, coin, this.collectCoin, null, this);

            coin.body.velocity.x *= 0.985;
            coin.body.velocity.y *= 0.985;
        }, this);

        this.potions.forEach(function(potion){
            game.physics.arcade.collide(this.hero, potion, this.collectHealth, null, this);

            potion.body.velocity.x *= 0.985;
            potion.body.velocity.y *= 0.985;
        }, this);

        this.destructables.forEach(function(destructable){
            if(destructable.key === 'pot' && destructable.isAlive){
                game.physics.arcade.collide(this.hero, destructable);
            }

            if(this.hero.slashEffect.exists){
                game.physics.arcade.overlap(this.hero.slashEffect, destructable, destructable.onCollide, null, destructable);
            }
        }, this);

        game.physics.arcade.collide(this.hero, this.mapCollision);

        this.npcs.forEach(function(npc){
            game.physics.arcade.collide(this.hero, npc);
        }, this);

        game.physics.arcade.collide(this.hero, this.doors, this.changeRoom, null, this);
        game.physics.arcade.collide(this.hero, this.triggers, this.triggerTrigger, null, this);

        this.enemies.forEach(function(enemy){
            if(this.hero.slashEffect.exists){
                game.physics.arcade.overlap(this.hero.slashEffect, enemy, this.hero.onSuccessfulSlash, null, this.hero);
            }

            if(enemy.slashEffect && enemy.slashEffect.exists){
                game.physics.arcade.overlap(enemy.slashEffect, this.hero, enemy.onSuccessfulSlash, null, enemy);
            }

            if(enemy.weapon){
                game.physics.arcade.collide(enemy.weapon.bullets, this.hero, enemy.onSuccessfulArrow, null, enemy);

                if(enemy.attackDistance < 1000){
                    game.physics.arcade.collide(enemy.weapon.bullets, this.mapCollision, enemy.onFailedArrow, null, enemy);
                }
            }

            //game.physics.arcade.collide(this.hero, enemy);

            this.enemies.forEach(function(newEnemy){
                game.physics.arcade.collide(enemy, newEnemy);

                if(enemy.slashEffect && enemy.slashEffect.exists && enemy !== newEnemy){
                    game.physics.arcade.overlap(enemy.slashEffect, newEnemy, enemy.onSuccessfulSlash, null, enemy);
                }

                if(enemy.weapon && enemy !== newEnemy){
                    game.physics.arcade.collide(enemy.weapon.bullets, newEnemy, enemy.onSuccessfulArrow, null, enemy);
                }
            }, this);
        }, this);
    },

    setDialog(dialog,choice, callback){
        if(this.acceptingNewDialog) {
            this.acceptingNewDialog = false;
            this.isDialog = true;
            this.choice = choice;
            this.dialogArray = JSON.parse(JSON.stringify(dialog));
            if(callback){
                this.npcCallback = callback;
            }

            this.advanceDialog();
        }
    },

    advanceDialog(dialog){
        this.currentDialogLine = this.dialogArray.shift();

        if(this.currentDialogLine) {
            this.dialogText.setText(this.currentDialogLine);
        } else {
            this.dialogText.setText('');

            if(!this.choice){
                this.isDialog = false;
            } else{
                this.makeChoice();
            }

            if(!this.npcCallback){

            }else {
                this.npcCallback(this);
                this.npcCallback = null;
            }

            if(this.triggerCallback){
                this.triggerCallback(this);
            }
        }
    },

    makeChoice(){
        this.choiceLine1.setText(this.choice.yes);
        this.choiceLine2.setText(this.choice.no);
        this.choiceButton1.exists = true;
        this.choiceButton2.exists = true;
    },
    
    changeRoom(hero, door){
        if(!this.enemies.getFirstAlive()){
            door.kill();
            game.camera.onFadeComplete.addOnce(function(){
                game.state.start(door.toMap);
            });

            if(door.spawnPoint){
                var tempArray = door.spawnPoint.split(', ');
                game.state.states[door.toMap].spawnSide = {x: parseInt(tempArray[0]), y: parseInt(tempArray[1])};
            }

            game.camera.fade();
            UserData.heroData = this.hero.getVitals();
            UserData.coinCount = this.coinCount;

            var levelData = {
                enemies: [ ],
                coins: [ ],
                potions: [ ],
                triggers: [ ],
                destructables: [ ]
            };

            this.enemies.forEach(function(enemy) {
                if(enemy.alive){
                    levelData.enemies.push({
                        x: enemy.x,
                        y: enemy.y,
                        mobType: enemy.mobType,
                        dialog: enemy.dialog,
                        health: enemy.health,
                        range: enemy.attackDistance
                    });
                }
            }, this);

            this.coins.forEach(function(coin) {
                if(coin.alive){
                    levelData.coins.push({
                        x: coin.x,
                        y: coin.y   
                    });
                }
            }, this);

            this.potions.forEach(function(potion){
                if(potion.alive){
                    levelData.potions.push({
                        x: potion.x,
                        y: potion.y
                    });
                }
            }, this);

            this.triggers.forEach(function(trigger){
                if(trigger.exists){
                    levelData.triggers.push({
                        x: trigger.x,
                        y: trigger.y,
                        dialog: trigger.dialog,
                        callback: trigger.callback
                    });
                }
            }, this);

            this.destructables.forEach(function(destructable){
                levelData.destructables.push({
                    x: destructable.x,
                    y: destructable.y,
                    key: destructable.key,
                    isAlive: destructable.isAlive
                });
            });

            UserData.levelData[this.tilemapKey] = levelData;
        } else {
            this.acceptingNewDialog = true;
            this.setDialog(NpcDialog['lockedoor'].dialog);
        }
    },

    collectCoin(hero, coin){
        coin.kill();
        Config.sfxObjects.coin.play();
        this.coinCount += 0.01;
        this.coinCounter.setText('$'+this.coinCount.toFixed(2));
    },

    collectHealth(hero, health){
        health.kill();
        Config.sfxObjects.health.play();
        this.hero.pickupHealth();
    },

    triggerTrigger(hero, trigger){
        this.acceptingNewDialog = true;
        this.setDialog(NpcDialog[trigger.dialog].dialog);

        if(NpcDialog[trigger.dialog].callback){
            this.triggerCallback = NpcDialog[trigger.dialog].callback;
        }

        if(!NpcDialog[trigger.dialog].preserve){
            trigger.exists = false;
        }
    }
}
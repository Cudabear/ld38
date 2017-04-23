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

        this.dialogArray = [ ];
        this.currentDialogLine = '';
        this.dialogText = game.add.bitmapText(250, game.height - 100, 'font', '', 24);
        this.dialogText.maxWidth = game.width - 400;

        this.map = game.add.tilemap(this.tilemapKey);
        this.map.addTilesetImage('TileSet');
        this.mapCollision = this.map.createLayer('Collision');
        this.mapCollision.alpha = 0;
        this.mapCollision.resizeWorld();
        this.map.setCollision(767, true, this.mapCollision);
        Config.plugins.AStar.setAStarMap(this.map, 'Collision', 'TileSet');
        this.mapBackground = this.map.createLayer('Background');
        this.mapForeground = this.map.createLayer('Foreground');

        this.acceptingNewDialog = true;
        this.isDialog = false;

        this.hero = new Hero(this, this.spawnSide);
        if(UserData.heroData){
            this.hero.setVitals(UserData.heroData);
        }

        this.enemies = game.add.group();
        this.map.objects.Enemies.forEach(function(enemyObject){
            var temp = new Enemy(enemyObject.type, enemyObject.x, enemyObject.y, this, this.hero, this.enemies, this.map, this.mapCollision, enemyObject.properties ? enemyObject.properties.dialog : false);
            this.enemies.add(temp);
            
            if(enemyObject.properties && enemyObject.properties.range){
                temp.attackDistance = parseInt(enemyObject.properties.range);
            }
        }, this);


        this.npcs = game.add.group();
        this.map.objects.Npcs.forEach(function(npcObject){
            this.npcs.add(new Npc(this, this.hero, npcObject.x, npcObject.y, npcObject.properties.id));
            this.acceptingNewDialog = true;
        }, this);

        this.coins = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);

        this.potions = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);

        this.doors = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);
        this.map.createFromObjects('Doors', 'door', 'arrow', 0, true, false, this.doors, Phaser.Sprite, false);
        this.doors.forEach(function(door){
            door.body.immovable = true;
        }, this);

        this.triggers = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);
        if(this.map.objects.Triggers){
            this.map.createFromObjects('Triggers', 'trigger', 'arrow', 0, true, false, this.triggers, Phaser.sprite, false);
        }

        this.mapDetail = this.map.createLayer('Detail');

        this.coinCounter = game.add.bitmapText(game.width - 150, game.height - 100, 'font', '$0', 32);
        this.coinCounter.anchor.setTo(0.5);
        this.coinCount = 0;
    },

    update: function() {
        this.handleInput();
        this.handlePhysics();
    },

    render: function() {

    },

    handleInput: function() {

    },

    handleClick: function() {
        if(this.isDialog){
            this.advanceDialog();
        } else {
            this.acceptingNewDialog = true;
        }
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

    setDialog(dialog){
        if(this.acceptingNewDialog) {
            this.acceptingNewDialog = false;
            this.isDialog = true;
            this.dialogArray = JSON.parse(JSON.stringify(dialog));
            this.advanceDialog();
        }
    },

    advanceDialog(dialog){
        this.currentDialogLine = this.dialogArray.shift();

        if(this.currentDialogLine) {
            this.dialogText.setText(this.currentDialogLine);
        } else {
            this.dialogText.setText('');
            this.isDialog = false;

            if(this.triggerCallback){
                this.triggerCallback(this);
            }
        }
    },
    
    changeRoom(hero, door){
        game.camera.onFadeComplete.addOnce(function(){
            game.state.start(door.toMap);
        });
        
        game.camera.fade();
        UserData.heroData = this.hero.getVitals();
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

        trigger.exists = false;
    }
}
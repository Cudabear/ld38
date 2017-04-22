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

        this.map = game.add.tilemap(this.tilemapKey);
        this.map.addTilesetImage('TestSet');
        this.mapCollision = this.map.createLayer('Collision');
        this.mapCollision.alpha = 0;
        this.mapCollision.resizeWorld();
        this.map.setCollision(399, true, this.mapCollision);
        Config.plugins.AStar.setAStarMap(this.map, 'Collision', 'TestSet');
        this.mapBackground = this.map.createLayer('Background');
        this.mapForeground = this.map.createLayer('Foreground');

        this.hero = new Hero(this, this.spawnSide);

        this.enemies = game.add.group();
        this.map.objects.Enemies.forEach(function(enemyObject){
            this.enemies.add(new Enemy(enemyObject.type, enemyObject.x, enemyObject.y, this.hero, this.enemies, this.map, this.mapCollision));
        }, this);

        this.npcs = game.add.group();
        this.map.objects.NPCs.forEach(function(npcObject){
            this.npcs.add(new Npc(this, this.hero, npcObject.x, npcObject.y, npcObject.properties.id));
            this.acceptingNewDialog = true;
        }, this);


        this.dialogArray = [ ];
        this.currentDialogLine = '';
        this.dialogText = game.add.bitmapText(100, game.height - 100, 'font', '', 32);
        this.dialogText.maxWidth = game.width - 200;

        this.doors = game.add.group(game.world, null, false, true, Phaser.Physics.ARCADE);
        this.map.createFromObjects('Doors', 'door', 'arrow', 0, true, false, this.doors, Phaser.Sprite, false);
        this.doors.forEach(function(door){
            door.body.immovable = true;
        }, this);
    },

    update: function() {
        this.handleInput();
        this.handlePhysics();
    },

    render: function() {

    },

    handleInput: function() {
        if(game.input.keyboard.downDuration(Phaser.Keyboard.A, 5)) {
            if(this.isDialog){
                this.advanceDialog();
            } else {
                this.acceptingNewDialog = true;
            }
        }
    },

    handlePhysics: function() {
        game.physics.arcade.collide(this.hero, this.mapCollision);

        this.npcs.forEach(function(npc){
            game.physics.arcade.collide(this.hero, npc);
        }, this);

        game.physics.arcade.collide(this.hero, this.doors, this.changeRoom, null, this);

        this.enemies.forEach(function(enemy){
            if(this.hero.slashEffect.exists){
                game.physics.arcade.overlap(this.hero.slashEffect, enemy, this.hero.onSuccessfulSlash, null, this.hero);
            }

            if(enemy.slashEffect && enemy.slashEffect.exists){
                game.physics.arcade.overlap(enemy.slashEffect, this.hero, enemy.onSuccessfulSlash, null, enemy);
            }

            if(enemy.weapon){
                game.physics.arcade.collide(enemy.weapon.bullets, this.hero, enemy.onSuccessfulArrow, null, enemy);
                game.physics.arcade.collide(enemy.weapon.bullets, this.mapCollision, enemy.onFailedArrow, null, enemy);
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
            this.dialogArray = dialog;
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
        }
    },
    
    changeRoom(hero, door){
        game.state.start(door.toMap);
    }


}
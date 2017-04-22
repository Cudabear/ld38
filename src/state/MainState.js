MainState = function(){ }

MainState.prototype = {
    init: function(levelMapKey) {
        this.levelMapKey = levelMapKey;
    },

    preload: function() {
        console.log('preload main state');
    },

    create: function() {
        console.log('create main state');

        game.physics.startSystem(Phaser.Physics.Arcade);

        this.map = game.add.tilemap('TestMap');
        this.map.addTilesetImage('TestSet');
        this.mapCollision = this.map.createLayer('Collision');
        this.mapCollision.alpha = 0;
        this.mapCollision.resizeWorld();
        this.map.setCollision(399, true, this.mapCollision);
        Config.plugins.AStar.setAStarMap(this.map, 'Collision', 'TestSet');
        this.mapBackground = this.map.createLayer('Background');
        this.mapForeground = this.map.createLayer('Foreground');

        this.hero = new Hero(this);

        this.enemies = game.add.group();
        // for(var i = 0; i < 5; i++) {
        //     this.enemies.add(new Enemy('aoe', this.hero, this.enemies, this.map, this.mapCollision));
        // }
        // for(var i = 0; i < 5; i++) {
        //     this.enemies.add(new Enemy('ranged', this.hero, this.enemies, this.map, this.mapCollision));
        // }
        // for(var i = 0; i < 5; i++) {
        //     this.enemies.add(new Enemy('melee', this.hero, this.enemies, this.map, this.mapCollision));
        // }

        this.npcs = game.add.group();
        this.npcs.add(new Npc(this, this.hero));
        this.acceptingNewDialog = true;

        this.dialogArray = [ ];
        this.currentDialogLine = '';
        this.dialogText = game.add.bitmapText(100, game.height - 100, 'font', '', 32);
        this.dialogText.maxWidth = game.width - 200;
    },

    update: function() {
        this.handleInput();
        this.handlePhysics();
    },

    render: function() {
        this.enemies.forEach(function(enemy){
            game.debug.line(enemy.sightLine);
        });
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
        console.log(this.dialogText.text);
        if(this.currentDialogLine) {
            this.dialogText.setText(this.currentDialogLine);
        } else {
            this.dialogText.setText('');
            this.isDialog = false;
        }
    },


}
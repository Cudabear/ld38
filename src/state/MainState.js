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

        this.hero = new Hero();

        this.enemies = game.add.group();
        for(var i = 0; i < 1; i++) {
            this.enemies.add(new Enemy('ranged', this.hero, this.map, this.mapCollision));
        }

        this.enemies.add(new Enemy('melee', this.hero, this.map, this.mapCollision));
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

    },

    handlePhysics: function() {
        game.physics.arcade.collide(this.hero, this.mapCollision);

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


}
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
        console.log(this.map.layers[2])

        this.hero = new Hero();

        this.enemies = game.add.group();
        for(var i = 0; i < 15; i++) {
            this.enemies.add(new Enemy('melee', this.hero, this.map, this.mapCollision));
        }
    },

    update: function() {
        this.handleInput();
        this.handlePhysics();
    },

    render: function() {

    },

    handleInput: function() {

    },

    handlePhysics: function() {
        game.physics.arcade.collide(this.hero, this.mapCollision);

        if(this.hero.slashEffect.exists) {
            this.enemies.forEach(function(enemy){
                game.physics.arcade.overlap(this.hero.slashEffect, enemy, this.hero.onSuccessfulSlash, null, this.hero)
            }, this);
        }
        //game.physics.arcade.collide(this.hero, this.enemies);
    },


}
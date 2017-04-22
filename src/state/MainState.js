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

        //remove this line if not using lighting effects
        //game.plugins.add(Phaser.Plugin.PhaserIlluminated);

        this.map = game.add.tilemap('TestMap');
        this.map.addTilesetImage('TestSet');
        this.mapCollision = this.map.createLayer('Collision');
        this.mapCollision.alpha = 0;
        this.mapCollision.resizeWorld();
        this.map.setCollision(399, true, this.mapCollision);
        this.mapBackground = this.map.createLayer('Background');
        this.mapForeground = this.map.createLayer('Foreground');

        this.hero = new Hero();
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
    }
}
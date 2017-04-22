BootupState = function(){ }

BootupState.prototype = {
    preload: function(){
        console.log('preload bootup state');

        //configure the scaling to fit the window
        game.scale.minHeight = Config.size.height;
        game.scale.minWidth = Config.size.width;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.stage.smoothed = false;

        game.load.image('loadBar', 'res/img/wrapper/loadbar.png');
    },

    create: function(){
        console.log('create bootup state');

        //remove this line if not using lighting effects
        //game.plugins.add(Phaser.Plugin.PhaserIlluminated);
        Config.plugins.AStar = game.plugins.add(Phaser.Plugin.AStar);
    },

    update: function(){
        if(window.location.search.indexOf('forceSplash') == -1 && isDev()){
            console.log('Skipping splash and kicking off load state');
            game.state.start('LoadState');
        }else{
            console.log('Kicking off splash')
            game.state.start('SplashState');
        }
    },

    render: function(){

    }
}
CreditState = function(){

}

CreditState.prototype = {
    create: function() {
        if(!Config.musicObjects.relaxedBgm.isPlaying){
            Config.musicObjects.relaxedBgm.play();
            Config.musicObjects.upbeatBgm.stop();
        }

        var coinCount = UserData.coinCount || 0;
        this.text = game.add.bitmapText(game.world.centerX, game.world.centerY - 300, 'font', 'And thus, you finished your quest into the dungeon.', 32);
        this.text.anchor.setTo(0.5);
        this.text.alpha = 0;
        var goodMessage = "You chose wisely and took the free loot when you had the chance.\n  In return, you get $"+coinCount.toFixed(2);
        var badMessage = "For some reason you didn't take the free loot and you got nothing but what you found on the way,\n which was around around $"+ coinCount.toFixed(2);
        this.messageText = game.add.bitmapText(game.world.centerX, game.world.centerY - 220, 'font', UserData.choice === 'loot' ? goodMessage : badMessage, 32);
        this.messageText.anchor.setTo(0.5);
        this.messageText.alpha = 0;

        this.messageText2 = game.add.bitmapText(game.world.centerX, game.world.centerY -140, 'font', "Maybe next time you'll pick a dungeon that hasn't already been raided multiple times?", 32);
        this.messageText2.anchor.setTo(0.5);
        this.messageText2.alpha = 0;

        this.messageText3 = game.add.bitmapText(game.world.centerX, game.world.centerY -60, 'font', "Thanks for playing!  This game was made in 72 hours by @cudabear and @meldasilas for LD38!", 32);
        this.messageText3.anchor.setTo(0.5);
        this.messageText3.alpha = 0;

        this.messageText4 = game.add.bitmapText(game.world.centerX - 125, game.world.centerY + 80, 'font', "Created with PhaserJS CE", 32);
        this.messageText4.anchor.setTo(0.5);
        this.messageText4.alpha = 0;

        this.messageText6 = game.add.bitmapText(game.world.centerX, game.world.centerY + 200, 'font', "Music Credits: Opening Night and The Rise of Heroes by Shane Ivers https://www.silvermansound.com", 32);
        this.messageText6.anchor.setTo(0.5);
        this.messageText6.inputEnabled = true;
        this.messageText6.events.onInputDown.add(function(){
            window.open('https://www.silvermansound.com');
        });
        this.messageText6.alpha = 0;

        this.image = game.add.image(game.world.centerX + 125, game.world.centerY + 80, 'phaser');
        this.image.anchor.setTo(0.5);
        this.image.width = 150;
        this.image.height = 150;
        this.image.alpha = 0;
        this.image.inputEnabled = true;
        this.image.events.onInputDown.add(function(){
            window.open('http://www.phaser.io');
        });

        this.messageText5 = game.add.bitmapText(game.world.centerX, game.height - 50, 'font', 'Refresh the page to play again!', 32);
        this.messageText5.anchor.setTo(0.5);
        this.messageText5.alpha = 0;

        game.time.events.add(500, function() {
            this.text.alpha = 1;
        }, this);
        game.time.events.add(3500, function() {
            this.messageText.alpha = 1;
        }, this);
        game.time.events.add(6500, function() {
            this.messageText2.alpha = 1;
        }, this);
        game.time.events.add(9500, function() {
            this.messageText3.alpha = 1;
            this.messageText4.alpha = 1;
            this.messageText6.alpha = 1;
            this.image.alpha = 1;
        }, this);
        game.time.events.add(12000, function() {
            this.messageText5.alpha = 1;
        }, this);
    },

    update: function() {


    }
}
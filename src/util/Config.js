Config = {
    name: "ReplaceWithGameName",
    version: "0.0.0",
    size: {width: 1024, height: 768},
    sprites: [
        //{key: "SpriteKey", imagePath: "path/to/image"}
        {key: "phaser", imagePath: "res/img/wrapper/phaser-logo-small.png"},
        {key: "TileSet", imagePath: "res/img/sprites/tile-set.png"},
        {key: "arrow", imagePath: "res/img/sprites/arrow.png"},
        {key: "bomb", imagePath: "res/img/sprites/bomb.png"},
        {key: "speechbubble", imagePath: "res/img/sprites/speechbubble.png"},
        {key: "coin", imagePath: "res/img/sprites/coin.png"},
        {key: "healthpotion", imagePath: "res/img/sprites/healthpotion.png"},
        {key: "bottombar", imagePath: "res/img/sprites/bottom-bar.png"},
    ],
    spritesheets: [
        //{key: "SpriteKey", imagePath: "path/to/image", frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax, margin: margin, spacing: spacing}
        {key: "healthbar", imagePath: "res/img/sprites/health-bar.png", frameWidth: 111, frameHeight: 32}
    ],
    animSprites: [
        //{key: "SpriteKey", imagePath: "path/to/image", jsonPath: "path/to/json"}
        {key: "TestGuy", imagePath: "res/img/sprites/guy.png", jsonPath: "res/img/sprites/guyAnim.json"},
        {key: "TestEnemy", imagePath: "res/img/sprites/zombie1.png", jsonPath: "res/img/sprites/zombieAnim.json"},
        {key: "slash", imagePath: "res/img/sprites/slash.png", jsonPath: "res/img/sprites/slashAnim.json"},
        {key: "pointerArrow", imagePath: "res/img/sprites/pointerArrow.png", jsonPath: "res/img/sprites/pointerArrow.json"},
    ],
    //tilemaps are assumed to be Tiled JSON.
    tileMaps: [
        //{key: "MapKey", jsonPath: "path/to/json"}
        {key: "Town", jsonPath: "res/lvl/town.json"},
        {key: "Room1", jsonPath: "res/lvl/room1.json"},
        {key: "Room2", jsonPath: "res/lvl/room2.json"},
        {key: "Room3", jsonPath: "res/lvl/room3.json"},
        {key: "Room4", jsonPath: "res/lvl/room4.json"},
        {key: "Room5", jsonPath: "res/lvl/room5.json"},
        {key: "Room6", jsonPath: "res/lvl/room6.json"},
        {key: "Room7", jsonPath: "res/lvl/room7.json"},
        {key: "Room8", jsonPath: "res/lvl/room8.json"},
        {key: "Room9", jsonPath: "res/lvl/room9.json"},
        {key: "Room10", jsonPath: "res/lvl/room10.json"},
    ],
    fonts: [
        //{key: "FontKey", imagePath: "path/to/image", xmlPath: "path/to/XML"}
        {key: "font", imagePath: "res/img/font/font.png", xmlPath: "res/img/font/font.xml"}
    ],
    sfx: [
        //{key: "SfxKey", filePath: "path/to/audiofile"}
        {key: "hit", filePath: "res/sfx/hit.wav"},
        {key: "select", filePath: "res/sfx/select.wav"},
        {key: "coin", filePath: "res/sfx/coin.wav"},
        {key: "health", filePath: "res/sfx/health.wav"},
        {key: "explosion", filePath: "res/sfx/explosion.wav"},
    ],
    //music loops by default
    music: [
        //{key: "MusicKey", filePath: "path/to/audiofile"}
        {key: "upbeatBgm", filePath: "res/sfx/bgm.mp3"},
        {key: "relaxedBgm", filePath: "res/sfx/relaxed-bgm.mp3"}
    ],
    //will be populated by all the music objects after load
    musicObjects: { },
    //will be populated by all the sfx objects after load
    sfxObjects: { },
    //will be populated by all the plugins
    plugins: { }
}
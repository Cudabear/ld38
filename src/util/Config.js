Config = {
    name: "ReplaceWithGameName",
    version: "0.0.0",
    size: {width: 1024, height: 768},
    sprites: [
        //{key: "SpriteKey", imagePath: "path/to/image"}
        {key: "phaser", imagePath: "res/img/wrapper/phaser-logo-small.png"},
        {key: "TestSet", imagePath: "res/img/tileset.png"},
        {key: "arrow", imagePath: "res/img/arrow.png"},
        {key: "bomb", imagePath: "res/img/bomb.png"}
    ],
    spritesheets: [
        //{key: "SpriteKey", imagePath: "path/to/image", frameWidth: frameWidth, frameHeight: frameHeight, frameMax: frameMax, margin: margin, spacing: spacing}
        {key: "healthbar", imagePath: "res/img/healthbar.png", frameWidth: 28, frameHeight: 8}
    ],
    animSprites: [
        //{key: "SpriteKey", imagePath: "path/to/image", jsonPath: "path/to/json"}
        {key: "TestGuy", imagePath: "res/img/guy.png", jsonPath: "res/img/guyAnim.json"},
        {key: "TestEnemy", imagePath: "res/img/zombie1.png", jsonPath: "res/img/zombieAnim.json"},
        {key: "slash", imagePath: "res/img/slash.png", jsonPath: "res/img/slashAnim.json"},
        {key: "pointerArrow", imagePath: "res/img/pointerArrow.png", jsonPath: "res/img/pointerArrow.json"},
    ],
    //tilemaps are assumed to be Tiled JSON.
    tileMaps: [
        //{key: "MapKey", jsonPath: "path/to/json"}
        {key: "TestMap", jsonPath: "res/lvl/test.json"},
        {key: "TestMap2", jsonPath: "res/lvl/test2.json"}
    ],
    fonts: [
        //{key: "FontKey", imagePath: "path/to/image", xmlPath: "path/to/XML"}
        {key: "font", imagePath: "res/img/font.png", xmlPath: "res/img/font.xml"}
    ],
    sfx: [
        //{key: "SfxKey", filePath: "path/to/audiofile"}
        {key: "hit", filePath: "res/sfx/hit.wav"},
        {key: "select", filePath: "res/sfx/select.wav"}
    ],
    //music loops by default
    music: [
        //{key: "MusicKey", filePath: "path/to/audiofile"}
    ],
    //will be populated by all the music objects after load
    musicObjects: { },
    //will be populated by all the sfx objects after load
    sfxObjects: { },
    //will be populated by all the plugins
    plugins: { }
}
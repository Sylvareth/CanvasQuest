//GLOBAL BOX2D NAMESPACE VARIABLE
var box2d = {
    b2Vec2 : Box2D.Common.Math.b2Vec2,
    b2BodyDef : Box2D.Dynamics.b2BodyDef,
    b2Body : Box2D.Dynamics.b2Body,
    b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
    b2Fixture : Box2D.Dynamics.b2Fixture,
    b2World : Box2D.Dynamics.b2World,
    b2MassData : Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw,
    b2WorldManifold : Box2D.Collision.b2WorldManifold,
    b2ContactListener : Box2D.Dynamics.b2ContactListener
};

//===================================GLOBAL VARIABLES===================================//
//-----box2d-----//
var physics, physicsCanvas, player, playerTop, floor,contactListener, touchFloor, joint, rotJoint_1, rotCenter,
    rotPlatform, lastFrame = new Date().getTime(), destroyObjects = [], keypressed = false;

var darknessPickup_1,
    darknessPickup_2,
    darknessPickup_3,
    darknessPickup_4,
    darknessPickup_5,
    darknessPickup_6;

//-----easeljs-----//
var stageBack, stageFront,
    graphicsCanvasBack, graphicsCanvasFront,
    menuContext, displayMenu = true, code, preloadBitmap, loadingBar;
var lives = 3, darkness = 0;
var displayKey = false, displayDarknessPickup1 = true,
                        displayDarknessPickup2 = true,
                        displayDarknessPickup3 = true,
                        displayDarknessPickup4 = true,
                        displayDarknessPickup5 = true,
                        displayDarknessPickup6 = true;

//-----collision filtering-----//
var treasureChest, CATEGORY_PLAYER = 0x0001, CATEGORY_TREASURE = 0x0002, MASK_PLAYER = CATEGORY_TREASURE, MASK_TREASURE = CATEGORY_PLAYER;

//-----General properties-----//
var world, gravity, FPS = 60, SCALE = 30;

//---------SoundJS----------//
var audioPath = "Sound/";
var backgroundMusic, jumpSound, darknessSound, menuThemeInterval;
var playMenuTheme = true;

//=====================================PRELOADJS=====================================//
// Create the PreLoad manifest, containing all files to preload.
var preloader;
var manifest = [
    {id: "preloadTitle", src:"Images/Preload/preloader.png"},
    {id: "hoverSound", src: audioPath+"Menu/menu-hover.wav"},
    {id: "selectSound", src: audioPath+"Menu/menu-select.wav"},
    {id: "backSound", src:audioPath+"Menu/menu-back.wav"},
    {id: "menuTheme", src:audioPath+"Menu/menu-theme.wav"},
    {id: "jumpSound", src:audioPath+"Game/jump.wav"},
    {id: "darknessSound", src:audioPath+"Game/darkness-pickup.wav"},
    {id: "level-1", src:audioPath+"Game/lost-village.wav"},
    {id: "menuBg", src:"Images/Menu/menu-screen.png"},
    {id: "menuTitle", src:"Images/Menu/menu-title.png"},
    {id: "menuSpelen", src:"Images/Menu/menu-spelen.png"},
    {id: "menuInstructies", src:"Images/Menu/menu-instructies.png"},
    {id: "menuInstructiesTekst", src:"Images/Menu/instructies.png"},
    {id: "menuCredits", src: "Images/Menu/menu-credits.png"},
    {id: "menuCreditsTekst", src:"Images/Menu/credits.png"},
    {id: "menuSluiten", src: "Images/Menu/sluiten.png"},
    {id: "interfaceLife", src:"Images/Interface/heart.png"},
    {id: "interfaceDarkness", src:"Images/Interface/darkness.png"},
    {id: "interfaceKeyF", src:"Images/Interface/key-F.png"},
    {id: "levelOneBg", src:"Images/background.png"},
    {id: "gameFloorTexture1", src:"Images/floor-1.png", name:"objectGraphic"},
    {id: "gameHill1", src:"Images/block_grass.png", name:"objectGraphic"},
    {id: "gameStepStones1", src: "Images/rock.png", name:"objectGraphic"},
    {id: "gamePlatform1", src:"Images/platform_1.png", name:"objectGraphic"},
    {id: "gameTreasureChest", src:"Images/treasure-chest.png", name:"objectGraphic"},
    {id: "gameDarknessPickup", src:"Images/Interface/darkness.png", name:"objectGraphic"},
    {id: "gameTower", src:"Images/tower.png", name:"objectGraphic"},
    {id: "gameTowerBeam", src:"Images/beam.png", name:"objectGraphic"},
    {id: "gamePlayer", src:"Images/Characters/guy.png", name:"objectGraphic"}
];
var totalLoaded = 0;

function preload() {
    // DEFINE CANVAS
    physicsCanvas = document.getElementById('canvas-box2d');
    graphicsCanvasBack = document.getElementById('canvas-back');
    graphicsCanvasFront = document.getElementById('canvas-front');

    // SETUP STAGE
    stageBack = new createjs.Stage(graphicsCanvasBack);
    stageFront = new createjs.Stage(graphicsCanvasFront);
    stageFront.enableMouseOver(10);
    //--------Update Stage--------
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", handleTick);

    // PRELOAD STUFF
    var preloadImage = new Image();
    preloadImage.src = "Images/Preload/preloader.png";
    preloadImage.onload = function(e){
        preloadBitmap = new createjs.Bitmap(e.target);
        stageFront.addChild(preloadBitmap);
    };
    preloader = new createjs.LoadQueue(true);
    preloader.onFileLoad = handleFileLoad;
    preloader.addEventListener("complete", init);
    preloader.loadManifest(manifest, true);
}

function handleFileLoad(event){
    totalLoaded++;

    //CREATE LOADING BAR
    stageFront.removeChild(loadingBar);
    loadingBar = new createjs.Shape();
    loadingBar.graphics.beginFill("#FFF").drawRect(230, graphicsCanvasFront.height/2, 540*(totalLoaded/manifest.length), 30);
    stageFront.addChild(loadingBar);

    if(event.item.type == "image" && event.item.name == "objectGraphic"){
        window[event.item.id] = new Image();
        window[event.item.id].src = event.item.src;
    } else if(event.item.type == "image" && event.item.name != "objectGraphic"){
        var img = new Image();
        img.src = event.item.src;
        window[event.item.id] = new createjs.Bitmap(img);
    }
}

//===================================INITIALISE GAME===================================//
function init() {
    stageFront.removeChild(preloadBitmap, loadingBar);

    //===================================SOUNDJS=======================================//
    createjs.Sound.addEventListener("loadComplete", handleLoad);
    menuThemeInterval = setInterval(function(){
        backgroundMusic = createjs.Sound.play('menuTheme');
        backgroundMusic.play();
    },87000);

    createjs.Sound.registerManifest(manifest);

    function handleLoad() {
        backgroundMusic = createjs.Sound.play('menuTheme');
        if(backgroundMusic.playState == "playSucceeded" && playMenuTheme == true){
            backgroundMusic.play();
            playMenuTheme = false;
        }
    }

    //=================================MENU SCREEN====================================//
    menuContext = physicsCanvas.getContext('2d');

    var buttonX = [422,379,413];
    var buttonY = [200,306,409];
    stageFront.addChildAt(menuBg, 0); //AddChildAt 0 zodat achtergrond achteraan zit.

    menuTitle.y = 20;
    menuTitle.x = 258;
    menuSpelen.x = buttonX[0];
    menuSpelen.y = buttonY[0];
    menuInstructies.x = buttonX[1];
    menuInstructies.y = buttonY[1];
    menuCredits.x = buttonX[2];
    menuCredits.y = buttonY[2];
    menuSluiten.x = 830;
    menuSluiten.y = 160;
    interfaceKeyF.x = 900;
    interfaceKeyF.y = 20;
    stageFront.addChild(menuTitle, menuSpelen, menuInstructies, menuCredits);

    menuSpelen.onMouseOver = function(){
        createjs.Tween.get(menuSpelen).to({alpha: 0.5},200,createjs.Ease.backIn);
        createjs.Sound.play('hoverSound').setVolume(0.5);
    }

    menuSpelen.onMouseOut = function(){
        createjs.Tween.get(menuSpelen).to({alpha: 1},200,createjs.Ease.backOut);
    }

    menuSpelen.onClick = function(){
        stageFront.removeAllChildren();
        stageFront.update();
        startGame();
        displayMenu = false;

        //Create Interface
        interfaceLife.x = interfaceLife.y = 20;
        interfaceDarkness.x = 200;
        interfaceDarkness.y = interfaceLife.y;
        stageFront.addChild(interfaceLife, interfaceDarkness);

        createjs.Sound.play('selectSound').setVolume(0.5);
    }

    menuInstructies.onMouseOver = function(){
        createjs.Tween.get(menuInstructies).to({alpha: 0.5},200,createjs.Ease.backIn);
        createjs.Sound.play('hoverSound').setVolume(0.5);
    }

    menuInstructies.onMouseOut = function(){
        createjs.Tween.get(menuInstructies).to({alpha: 1},200,createjs.Ease.backOut)
    }

    menuInstructies.onClick = function(){
        createjs.Sound.play('selectSound').setVolume(0.5);
        menuInstructiesTekst.x = 100;
        menuInstructiesTekst.y = 130;

        stageFront.addChild(menuInstructiesTekst, menuSluiten);

        menuSluiten.onMouseOver = function(){
            createjs.Tween.get(menuSluiten).to({alpha: 0.5},200,createjs.Ease.backIn);
        }

        menuSluiten.onMouseOut = function(){
            createjs.Tween.get(menuSluiten).to({alpha: 1},200,createjs.Ease.backOut)
        }

        menuSluiten.onClick = function()
        {
            createjs.Sound.play('backSound').setVolume(0.5);
            stageFront.removeChild(menuInstructiesTekst, menuSluiten);
        }
    }

    menuCredits.onMouseOver = function(){
        createjs.Tween.get(menuCredits).to({alpha: 0.5},200,createjs.Ease.backIn);
        createjs.Sound.play('hoverSound').setVolume(0.5);
    }

    menuCredits.onMouseOut = function(){
        createjs.Tween.get(menuCredits).to({alpha: 1},200,createjs.Ease.backOut)
    }
    menuCredits.onClick = function(){
        createjs.Sound.play('selectSound').setVolume(0.5);
        menuCreditsTekst.x = 100;
        menuCreditsTekst.y = 130;
        stageFront.addChild(menuCreditsTekst, menuSluiten);

        menuSluiten.onMouseOver = function(){
            createjs.Tween.get(menuSluiten).to({alpha: 0.5},200,createjs.Ease.backIn);
        }

        menuSluiten.onMouseOut = function(){
            createjs.Tween.get(menuSluiten).to({alpha: 1},200,createjs.Ease.backOut)
        }

        menuSluiten.onClick = function()
        {
            createjs.Sound.play('backSound').setVolume(0.5);
            stageFront.removeChild(menuCreditsTekst, menuSluiten);
        }
    }
    //==================================================================================================//
}

// Handle the EaselJS Tick() function.
function handleTick()
{
    if(displayMenu == false)
    {
        var lifeText = new createjs.Text(lives, "72px Arial", "#000");
        lifeText.x = 100;
        lifeText.y = 10;

        var darknessText = new createjs.Text(darkness, "72px Arial", "#000");
        darknessText.x = 270;
        darknessText.y = 10;

        backgroundMusic.stop();
        clearInterval(menuThemeInterval);
        stageFront.addChild(lifeText, darknessText);
    }

    if(displayKey == true)
    {
        stageFront.addChild(interfaceKeyF);
    }

    stageBack.update();
    stageFront.update();
    stageFront.removeChild(lifeText);
    stageFront.removeChild(darknessText);
    stageFront.removeChild(interfaceKeyF);
}
//================================================================================================//

//===========================================START GAME===========================================//
function startGame(){
    //ADD BACKGROUND IMAGE
    levelOneBg.x = -150;
    stageBack.addChild(levelOneBg);

    //Setup and Start music
    var musicLevel1 = new createjs.Sound.play('level-1');
    musicLevel1.play();

    //Loop music
    setInterval(function(){
        var musicLevel1 = new createjs.Sound.play('level-1');
        musicLevel1.play();
    },48000);

    // Define physics object
    physics = new Physics(physicsCanvas);

    // CREATE WALLS
    new Body(physics, { type: "static", x: 0, y: 0, height: 50,  width: 0.5 });
    new Body(physics, { color: "black", type: "static", x:200, y: 0, height: 50,  width: 0.5});
    new Body(physics, { color: "red", type: "static", x: 200, y: -100, height: 0.5, width: 400 });

    // CREATE FLOOR OBJECTS
    floor = [   new Body(physics, { image: gameFloorTexture1, imgWidth: 140, imgHeight: 3.33, imgPosX: -70, imgPosY: -2.5, type: "static", x: 207, y:23, width: 138, height: 2}),
        new Body(physics, {image: gameFloorTexture1, imgWidth: 140, imgHeight: 3.33, imgPosX: -70, imgPosY: -2.5, type: "static", x: 69, y: 23, width: 138, height: 2}),
        new Body(physics, { type: "static", x: 10, y: 12, height: 0.5, width: 10}),
        new Body(physics, { image: gameStepStones1, imgWidth: 4, imgHeight: 1.8, imgPosX: -2, imgPosY: -1.1, type: "static", x: 64, y: 15, height: 1, width: 3}),
        new Body(physics, { image: gameStepStones1,imgWidth: 4, imgHeight: 1.8, imgPosX: -2, imgPosY: -1.1, type: "static", x: 58, y: 10, height: 1, width: 3}),
        new Body(physics, { image: gameStepStones1,imgWidth: 4, imgHeight: 1.8, imgPosX: -2, imgPosY: -1.1, type: "static", x: 98, y: 10, height: 1, width: 3}),
        new Body(physics, { image: gameStepStones1,imgWidth: 4, imgHeight: 1.8, imgPosX: -2, imgPosY: -1.1, type: "static", x: 108, y: 8, height: 1, width: 3}),
        new Body(physics, { image: gamePlatform1, imgWidth: 27, imgHeight: 9, imgPosX: -13, imgPosY: -2, type: "static", x: 78, y: 5.5, height: 0.7, width: 25}),
        new Body(physics, { image: gameHill1, imgWidth: 23, imgHeight: 6, imgPosX: -11, imgPosY: -3, type: "static", x: 80, y: 21, width: 20, height: 4 })

        //new Body(physics, { color: "pink", type: "static", shape: "polygon",
            //points: [ { x: -10, y: 20 }, { x: -10, y: 15 },{ x:10, y: 20 }   ],
            //x: 20, y: 5 })
    ];
    for(var i = 0; i < floor.length; i++)
    {
        floor[i].userData = ('floor');
    }

    // CREATE PLAYER
    player = new Body(physics, {shape: "circle", radius: 1, x: 5, y: 20, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    player.userData = ('player');
    playerTop = new Body(physics, {image: gamePlayer, imgHeight:4.7, imgWidth:2.5, imgPosX: -1.5, imgPosY:-1.7,
        shape: "block", x: 5, y: 18, width: 2, height: 3, friction:0, restitution: 0, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    player.SetFixedRotation(true);

    //CREATE INTERACTION OBJECTS
    treasureChest = new Body(physics, { image: gameTreasureChest , type: "static", imgWidth: 4, imgHeight: 2.2,
        imgPosX: -2, imgPosY: -1.3, x: 78, y:4, height: 2.2, width: 4, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    darknessPickup_1 = new Body(physics, {image: gameDarknessPickup, type: "static", imgWidth: 2, imgHeight: 2,
        imgPosX: -1, imgPosY: -1, x: 39, y: 20, height: 2, width: 2, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    darknessPickup_2 = new Body(physics, {image: gameDarknessPickup, type: "static", imgWidth: 2, imgHeight: 2,
        imgPosX: -1, imgPosY: -1, x: 64, y: 13, height: 2, width: 2, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    darknessPickup_3 = new Body(physics, {image: gameDarknessPickup, type: "static", imgWidth: 2, imgHeight: 2,
        imgPosX: -1, imgPosY: -1, x: 80, y: 17, height: 2, width: 2, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    darknessPickup_4 = new Body(physics, {image: gameDarknessPickup, type: "static", imgWidth: 2, imgHeight: 2,
        imgPosX: -1, imgPosY: -1, x: 90, y: 3.4, height: 2, width: 2, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    darknessPickup_5 = new Body(physics, {image: gameDarknessPickup, type: "static", imgWidth: 2, imgHeight: 2,
        imgPosX: -1, imgPosY: -1, x: 98, y: 8, height: 2, width: 2, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    darknessPickup_6 = new Body(physics, {image: gameDarknessPickup, type: "static", imgWidth: 2, imgHeight: 2,
        imgPosX: -1, imgPosY: -1, x: 120, y: 8, height: 2, width: 2, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});

    //CREATE ROTATING OBJECT
    rotPlatform = new Body(physics, { image: gameTowerBeam, imgWidth: 15, imgHeight:1, imgPosX: -7.5, imgPosY: -0.5, width: 15, height: 1, x: 120, y: 8});
    rotCenter = new Body(physics, { image: gameTower, type: "static", imgWidth: 15, imgHeight: 23, imgPosX: -7.5, imgPosY: -8.2, x: 120, y: 8, height: 1, width: 1});

    joint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    joint.Initialize(player,playerTop, new box2d.b2Vec2(5,20));
    world.CreateJoint(joint);

    rotJoint_1 = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    rotJoint_1.Initialize(rotCenter, rotPlatform, new box2d.b2Vec2(120, 8));
    rotJoint_1.enableMotor = true;
    rotJoint_1.motorSpeed = 1;
    rotJoint_1.maxMotorTorque = 110;
    world.CreateJoint(rotJoint_1);

    // CREATE OBJECTS
    new Body(physics, { shape: 'circle', imgWidth: 4, imgHeight: 4, radius: 2, x: 5, y: 6, restitution: 0.2, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});

    // KEYBOARD INPUT
    physics.handleKeyboard();

    // COLLISION DETECTION
    contactListener = new box2d.b2ContactListener();
    contactListener.PostSolve = function (contact) {
        var bodyA = contact.GetFixtureA().GetBody(),
            bodyB = contact.GetFixtureB().GetBody(),
            bAData = bodyA.userData,
            bBData = bodyB.userData;
        if(bAData == 'player' && bBData == 'floor' || bAData == 'floor' && bBData == 'player'){
            touchFloor = true;
        }else {
            touchFloor = false;
        }
    };

    //UPDATE WORLD
    requestAnimationFrame(gameLoop);
}
//===================================================================================================//

//=========================================GENERAL SETTINGS==========================================//
var Physics = function(element) {
    //DEFINE GRAVITY
    gravity = new box2d.b2Vec2(0,34);
    //DEFINE WORLD
    world = new box2d.b2World(gravity, true); //'TRUE' ALLOWS BODIES TO SLEEP WHEN FINISHED MOVING, THUS ENHANCING PERFORMANCE

    this.element = element;
    this.context = this.element.getContext("2d");
    this.scale = SCALE;
    console.log(this.context);

    //DEBUGDRAW
    //this.debugDraw();
};

//=============================================DEBUGDRAW==============================================//
Physics.prototype.debugDraw = function() {
    var debugDraw = new box2d.b2DebugDraw();
    debugDraw.SetSprite(physicsCanvas.getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
};

//===========================================STEP THE WORLD===========================================//
Physics.prototype.step = function() {
    var screenW = physicsCanvas.width;
    var screenH = physicsCanvas.height;
    var worldH = 340;
    var worldW = 517;

    //world.DrawDebugData();
    world.Step(1 / FPS, 8, 3); //FPS, Velocity Iterations, Position Iterations
    //world.ClearForces(); //Enkel nuttig als je forces gebruikt zoals ApplyForce();

    var obj = world.GetBodyList();

    //Move camera sideways while moving in x
    if((worldW - player.GetPosition().x) < screenW/2){
        levelOneBg.x -= player.GetLinearVelocity().x/8;
        if(player.GetLinearVelocity().x > 0)
            this.context.translate(-(player.GetLinearVelocity().x/2), 0);
        
        if (player.GetLinearVelocity().x < 0) {
            this.context.translate(-(player.GetLinearVelocity().x/2), 0);
        }
    }

    if(!keypressed && touchFloor)
        player.SetLinearVelocity(new box2d.b2Vec2(0,player.GetLinearVelocity().y));

    //console.log(worldH + player.GetPosition().y);

    //Move camera upwards while moving in y
//    if((worldH + player.GetPosition().y) < screenH/2){
//        if(player.GetLinearVelocity().y > 0)
//            this.context.translate(0, -(player.GetLinearVelocity().y/2));
//
//        if (player.GetLinearVelocity().y < 0) {
//            this.context.translate(0, -(player.GetLinearVelocity().y/2));
//        }
//    }

    if(player.GetPosition().x >= treasureChest.GetPosition().x-2
        && player.GetPosition().x <= treasureChest.GetPosition().x+2
        && player.GetPosition().y >= treasureChest.GetPosition().y-1.1
        && player.GetPosition().y <= treasureChest.GetPosition().y+1.1)
    {
        displayKey = true;
    } else displayKey = false;

    if(displayDarknessPickup1 == true)
    {
        if(player.GetPosition().x >= darknessPickup_1.GetPosition().x-1.5
            && player.GetPosition().x <= darknessPickup_1.GetPosition().x+1.5
            && player.GetPosition().y >= darknessPickup_1.GetPosition().y-1.5
            && player.GetPosition().y <= darknessPickup_1.GetPosition().y+1.5)
        {
            darkness += 100;
            darknessSound = createjs.Sound.play('darknessSound');
            darknessSound.setVolume(0.1);
            darknessSound.play();
            displayDarknessPickup1 = false;
            destroyObjects.push(darknessPickup_1);
        }
    }

    if(displayDarknessPickup2 == true)
    {
        if(player.GetPosition().x >= darknessPickup_2.GetPosition().x-1.5
            && player.GetPosition().x <= darknessPickup_2.GetPosition().x+1.5
            && player.GetPosition().y >= darknessPickup_2.GetPosition().y-1.5
            && player.GetPosition().y <= darknessPickup_2.GetPosition().y+1.5)
        {
            darkness += 100;
            darknessSound = createjs.Sound.play('darknessSound');
            darknessSound.setVolume(0.1);
            darknessSound.play();
            displayDarknessPickup2 = false;
            destroyObjects.push(darknessPickup_2);
        }
    }

    if(displayDarknessPickup3 == true)
    {
        if(player.GetPosition().x >= darknessPickup_3.GetPosition().x-1.5
            && player.GetPosition().x <= darknessPickup_3.GetPosition().x+1.5
            && player.GetPosition().y >= darknessPickup_3.GetPosition().y-1.5
            && player.GetPosition().y <= darknessPickup_3.GetPosition().y+1.5)
        {
            darkness += 100;
            darknessSound = createjs.Sound.play('darknessSound');
            darknessSound.setVolume(0.1);
            darknessSound.play();
            displayDarknessPickup3 = false;
            destroyObjects.push(darknessPickup_3);
        }
    }

    if(displayDarknessPickup4 == true)
    {
        if(player.GetPosition().x >= darknessPickup_4.GetPosition().x-1.5
            && player.GetPosition().x <= darknessPickup_4.GetPosition().x+1.5
            && player.GetPosition().y >= darknessPickup_4.GetPosition().y-1.5
            && player.GetPosition().y <= darknessPickup_4.GetPosition().y+1.5)
        {
            darkness += 100;
            darknessSound = createjs.Sound.play('darknessSound');
            darknessSound.setVolume(0.1);
            darknessSound.play();
            displayDarknessPickup4 = false;
            destroyObjects.push(darknessPickup_4);
        }
    }

    if(displayDarknessPickup5 == true)
    {
        if(player.GetPosition().x >= darknessPickup_5.GetPosition().x-1.5
            && player.GetPosition().x <= darknessPickup_5.GetPosition().x+1.5
            && player.GetPosition().y >= darknessPickup_5.GetPosition().y-1.5
            && player.GetPosition().y <= darknessPickup_5.GetPosition().y+1.5)
        {
            darkness += 100;
            darknessSound = createjs.Sound.play('darknessSound');
            darknessSound.setVolume(0.1);
            darknessSound.play();
            displayDarknessPickup5 = false;
            destroyObjects.push(darknessPickup_5);
        }
    }

    if(displayDarknessPickup6 == true)
    {
        if(player.GetPosition().x >= darknessPickup_6.GetPosition().x-1.5
            && player.GetPosition().x <= darknessPickup_6.GetPosition().x+1.5
            && player.GetPosition().y >= darknessPickup_6.GetPosition().y-1.5
            && player.GetPosition().y <= darknessPickup_6.GetPosition().y+1.5)
        {
            darkness += 100;
            darknessSound = createjs.Sound.play('darknessSound');
            darknessSound.setVolume(0.1);
            darknessSound.play();
            displayDarknessPickup6 = false;
            destroyObjects.push(darknessPickup_6);
        }
    }

    // Destroy objects in the destroyObjects array after each timestep
    for (var i in destroyObjects) {
        world.DestroyBody(destroyObjects[i]);
    }
    // Reset destroyObjects array
    destroyObjects.length = 0;

    //Stop player from rotating
    playerTop.SetAngle(0);
    playerTop.SetAngularVelocity(0);

    /* HIDE THIS BLOCK IF YOU WANT TO SEE DEBUG SHAPES */
        this.context.clearRect(-500, -2000, 12000, 4000); //Important for redrawing problems!
        this.context.save();
        this.context.scale(this.scale,this.scale);
        while(obj) {
            var body = obj.GetUserData();
            if(body) {  body.draw(this.context); }

            obj = obj.GetNext();
        }
        this.context.restore();
    /* HIDE THIS BLOCK IF YOU WANT TO SEE DEBUG SHAPES */

    world.SetContactListener(contactListener);
};

//=========================================BOX2D CENTRAL UPDATE FUNCTION========================================//
window.gameLoop = function() {
    var tm = new Date().getTime();
    var dt = (tm - lastFrame) / 1000;
    physics.step(dt);
    lastFrame = tm;
    requestAnimationFrame(gameLoop);
};

//====================================================EVENTS====================================================//
/*//DO SOMETHING ON CLICK
Physics.prototype.click = function(callback) {
    var self = this;

    function handleClick(e) {
        e.preventDefault();
        var point = {
            x: (e.offsetX || e.layerX) / self.scale, //Offset Chrome, Layer Firefox
            y: (e.offsetY || e.layerY) / self.scale
        };

        world.QueryPoint(function(fixture) {
            callback(fixture.GetBody(),
                fixture,
                point);
        },point);
    }

    physicsCanvas.addEventListener("click",handleClick);
    physicsCanvas.addEventListener("touchstart",handleClick);
};*/




//=============================================================================================================//

//START EVERYTHING
window.addEventListener("load",preload);
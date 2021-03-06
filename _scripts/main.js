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
var physics, physicsCanvas, player, playerTop,contactListener, touchFloor, joint, rotJoint_1, rotCenter, rotPlatform,
    lastFrame = new Date().getTime(), level1, timer = 1, portal, angle = 0;

// FLAGS
var keypressed = false,
    moving = false,
    movingRight = false,
    movingLeft = false,
    upperlevel = false,
    displayKey = false,
    displayTreasure = false,
    levelFinish = false;

// ARRAYS
var commoncollectibles = [],
    rarecollectibles = [],
    destroyObjects = [],
    treasureChest = [],
    floor = [];

//-----easeljs-----//
var stageBack, stageFront,
    graphicsCanvasBack, graphicsCanvasFront,
    menuContext, displayMenu = true, code, preloadBitmap, loadingBar;
var lives = 3, darkness = 0, darknessRare = 0, score = 0;

//-----collision filtering-----//
CATEGORY_PLAYER = 0x0001, CATEGORY_TREASURE = 0x0002, MASK_PLAYER = CATEGORY_TREASURE, MASK_TREASURE = CATEGORY_PLAYER;

//-----General properties-----//
var world, gravity, FPS = 60, SCALE = 30, timestep = 1/FPS;

//---------SoundJS----------//
var audioPath = "Sound/";
var backgroundMusic, jumpSound, darknessSound, chestSound, menuThemeInterval;
var playMenuTheme = true;

//=====================================PRELOADJS=====================================//
// Create the PreLoad manifest, containing all files to preload.
var preloader;
var manifest = [
    {id: "preloadTitle", src:"Images/Preload/preloader.png"},
    {id: "hoverSound", src:audioPath+"Menu/menu-hover.wav"},
    {id: "selectSound", src:audioPath+"Menu/menu-select.wav"},
    {id: "scoreSound", src:audioPath+"Game/score.wav"},
    {id: "treasureSound",src:audioPath+"Game/treasure.wav"},
    {id: "backSound", src:audioPath+"Menu/menu-back.wav"},
    {id: "menuTheme", src:audioPath+"Menu/menu-theme.wav"},
    {id: "jumpSound", src:audioPath+"Game/jump.wav"},
    {id: "darknessSound", src:audioPath+"Game/darkness-pickup.wav"},
    {id: "darknessrareSound", src:audioPath+"Game/darknessrare-pickup.wav"},
    {id: "chestSound", src:audioPath+"Game/chest.wav"},
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
    {id: "extralife", src:"Images/Interface/heart.png"},
    {id: "interfaceDarkness", src:"Images/Interface/darkness.png"},
    {id: "interfaceDarknessRare", src:"Images/Interface/darkness-rare.png"},
    {id: "interfaceKeyF", src:"Images/Interface/key-F.png"},
    {id: "pauseBg", src:"Images/Interface/pause-bg.png"},
    {id: "pauseTitle", src:"Images/Interface/pause.png"},
    {id: "finishBg", src:"Images/Interface/finish-bg.png"},
    {id: "results11", src:"Images/Interface/results-1-1.png"},
    {id: "nextLevel", src:"Images/Interface/nextlvl.png"},
    {id: "levelOneBg", src:"Images/background.png"},
    {id: "clouds", src:"Images/clouds.png"},
    {id: "gameFloorTexture1", src:"Images/floor-1.png", name:"objectGraphic"},
    {id: "gameHill1", src:"Images/Objects/block_grass.png", name:"objectGraphic"},
    {id: "gameRock0", src:"Images/Objects/rock0.png", name:"objectGraphic"},
    {id: "gameRock1", src:"Images/Objects/rock1.png", name:"objectGraphic"},
    {id: "gameRock2", src:"Images/Objects/rock2.png", name:"objectGraphic"},
    {id: "gameRock3", src:"Images/Objects/rock3.png", name:"objectGraphic"},
    {id: "gameRock4", src:"Images/Objects/rock4.png", name:"objectGraphic"},
    {id: "gameRock5", src:"Images/Objects/rock5.png", name:"objectGraphic"},
    {id: "gamePlatform1", src:"Images/Objects/platform_1.png", name:"objectGraphic"},
    {id: "gameTreasureChest", src:"Images/Objects/treasure-chest.png", name:"objectGraphic"},
    {id: "gameTreasureChestOpen", src:"Images/Objects/treasure-chest-open.png", name:"objectGraphic"},
    {id: "gameDarknessPickup", src:"Images/Interface/darkness.png", name:"objectGraphic"},
    {id: "gameDarknessRarePickup", src:"Images/Interface/darkness-rare.png", name:"objectGraphic"},
    {id: "gameTower", src:"Images/Objects/tower.png", name:"objectGraphic"},
    {id: "gameTowerBeam", src:"Images/Objects/beam.png", name:"objectGraphic"},
    {id: "gamePlayer", src:"Images/Characters/guy.png", name:"objectGraphic"},
    {id: "gameRockTexture", src:"Images/Objects/rocky-surface.png", name:"objectGraphic"},
    {id: "gamePalmtree", src:"Images/Objects/palmtree.png", name:"objectGraphic"},
    {id: "gamePortal", src:"Images/Objects/portal.png", name:"objectGraphic"}
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
    // INITIALISE JSON
    constructJSON();

    stageFront.removeChild(preloadBitmap, loadingBar);

    //===================================SOUNDJS=======================================//
    createjs.Sound.registerManifest(manifest);

    createjs.Sound.addEventListener("loadComplete", handleLoad);
    menuThemeInterval = setInterval(function(){
        backgroundMusic = createjs.Sound.play('menuTheme');
    },87000);

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
    stageFront.addChildAt(menuBg, 0); //AddChildAt 0 to make sure that the background doesn't cover up anything.

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
        interfaceLife.x = 20;
        interfaceDarkness.x = 200;
        interfaceDarknessRare.x = 430;
        interfaceDarknessRare.y = interfaceDarkness.y = interfaceLife.y = 20;
        stageFront.addChild(interfaceLife, interfaceDarkness, interfaceDarknessRare);

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

        var darknessText = new createjs.Text(darkness + "/" + commoncollectibles.length, "72px Arial", "#000");
        darknessText.x = 270;

        var darknessRareText = new createjs.Text(darknessRare + "/" + rarecollectibles.length , "72px Arial", "#000");
        darknessRareText.x = 500;
        lifeText.y = darknessText.y = darknessRareText.y = 10;

        backgroundMusic.stop();
        clearInterval(menuThemeInterval);
        stageFront.addChild(lifeText, darknessText, darknessRareText);

        if(!timestep && !levelFinish)
        {
            pauseTitle.x = graphicsCanvasFront.width/2 - 96;
            pauseTitle.y = graphicsCanvasFront.height/2 - 43;
            stageFront.addChild(pauseBg, pauseTitle);
        } else {
            stageFront.removeChild(pauseBg, pauseTitle);
        }

        if(levelFinish)
        {
            timestep = 0;
            results11.x = graphicsCanvasFront.width/2 - 289;
            results11.y = 20;
            timer++;
            stageFront.removeChild(lifeText, darknessText, darknessRareText, interfaceLife, interfaceDarkness, interfaceDarknessRare);

            score = 230 * darkness + 625 * darknessRare;
            var darknessCollected = new createjs.Text("Darkness collected: " + darkness + " (x 230)", "40px Arial", "#FFF");
            var darknessRareCollected = new createjs.Text("Rare Darkness collected: " + darknessRare + " (x 635)", "40px Arial", "#FFF");
            var yourScore = new createjs.Text("Your Score: " + score, "72px Arial", "#FFF");
            darknessCollected.y = 150;
            darknessRareCollected.y = 220;
            yourScore.y = 350;
            nextLevel.x = 650;
            nextLevel.y = 550;
            darknessCollected.x = darknessRareCollected.x = yourScore.x = 100;

            if(timer == 5)
            {
                stageFront.addChild(finishBg, results11);
            } else if(timer == 50)
            {
                stageFront.addChild(darknessCollected);
                createjs.Sound.play('scoreSound');
            } else if(timer == 100)
            {
                stageFront.addChild(darknessRareCollected);
                createjs.Sound.play('scoreSound');
            } else if(timer == 200)
            {
                nextLevel.alpha = 0.5;
                stageFront.addChild(yourScore, nextLevel);
                createjs.Sound.play('scoreSound');
            }

            nextLevel.onMouseOver = function(){
                createjs.Tween.get(nextLevel).to({alpha: 1},200,createjs.Ease.backIn);
                createjs.Sound.play('hoverSound').setVolume(0.5);
            }
            nextLevel.onMouseOut = function(){
                createjs.Tween.get(nextLevel).to({alpha: 0.5},200,createjs.Ease.backOut)
            }
            nextLevel.onClick = function(){
                createjs.Sound.play('selectSound').setVolume(0.5);
            }
        }
    }

    for(var i = 0; i < treasureChest.length; i++)
    {
        if(displayKey == true && treasureChest[i].display == true)
        {
            stageFront.addChild(interfaceKeyF);
        }
    }

    stageBack.update();
    stageFront.update();
    stageFront.removeChild(lifeText, darknessText, darknessRareText, interfaceKeyF, darknessCollected, darknessRareCollected);
}
//================================================================================================//

//===========================================START GAME===========================================//
function startGame(){
    //ADD BACKGROUND IMAGE
    levelOneBg.x = -150;
    clouds.y = -60;
    clouds.x = 40;
    stageBack.addChild(levelOneBg, clouds);

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
    level1 = level1JSON;

    //======================================CREATE OBJECTS========================================//
    // CREATE LEVEL BOUNDARIES
    for(i = 0; i<level1.walls.length; i++)
    {
        new Body(physics, level1.walls[i]);
    }

    // CREATE FLOOR OBJECTS
    for(var i = 0; i<level1.floor.length; i++)
    {
        var object = new Body(physics, level1.floor[i]);
        floor.push(object);
    }
    for(var i = 0; i < floor.length; i++)
    {
        floor[i].userData = ('floor');
    }

    // CREATE PLAYER
    player = new Body(physics, {shape: "circle", radius: 1, x: 5, y: 20, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    player.userData = ('player');
    playerTop = new Body(physics, {image: gamePlayer, imgHeight:4.7, imgWidth:2.5, imgPosX: -1.5, imgPosY:-1.7,
        shape: "block", x: 5, y: 18, width: 2, height: 3, categoryBits: CATEGORY_PLAYER, maskBits: MASK_PLAYER});
    player.SetFixedRotation(true);

    // CREATE INTERACTION OBJECTS
    for(var i = 0; i < level1.treasure.length; i++)
    {
        var object = new Body(physics, level1.treasure[i]);
            treasureChest.push(object);
    }
    for(var i = 0; i < treasureChest.length; i++)
    {
        treasureChest[i].display = true;
    }

    // CREATE COLLECTIBLES
    for(var i = 0; i < level1.collectibles.length; i++)
    {
        if(level1.collectibles[i].subtype == "common")
        {
            var object = new Body(physics, level1.collectibles[i]);
            commoncollectibles.push(object);
        } else if(level1.collectibles[i].subtype == "rare")
        {
            var object = new Body(physics, level1.collectibles[i]);
            rarecollectibles.push(object);
        }
    }

    for(var i = 0; i < commoncollectibles.length; i++)
    {
        commoncollectibles[i].display = true;
    }

    for(var i = 0; i < rarecollectibles.length; i++)
    {
        rarecollectibles[i].display = true;
    }

    //CREATE LEVEL PORTAL
    portal = new Body(physics, level1.portal[0]);

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

    new Body(physics, { shape:'circle', imgWidth:4, imgHeight:4, radius:2, x:5, y:6, restitution:0.2, categoryBits:CATEGORY_PLAYER, maskBits:MASK_PLAYER});
    //============================================================================================//

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
    //world.DrawDebugData();
    world.Step(timestep, 8, 3); //FPS, Velocity Iterations, Position Iterations
    //world.ClearForces(); //Enkel nuttig als je forces gebruikt zoals ApplyForce();

    var obj = world.GetBodyList();

    if(timestep)
    {
        clouds.x -= 0.15;

        // CAMERA PANNING IN X-AXIS
        var playerPositionX = player.GetPosition().x * 30;
        var playerPositionY = player.GetPosition().y * 30;
        var posX;
        var posY;
        posX = physicsCanvas.width/2-playerPositionX;
        posY = physicsCanvas.height/2-playerPositionY;
        if(posX < 0 && posX > -5000 ){
            levelOneBg.x -= player.GetLinearVelocity().x/8;
            clouds.x -= player.GetLinearVelocity().x/6;
            if(player.GetLinearVelocity().x >0)
                this.context.translate(-(player.GetLinearVelocity().x/2), 0);
            if (player.GetLinearVelocity().x < 0)
                this.context.translate(-(player.GetLinearVelocity().x/2), 0);
        }

        // CAMERA SWITCHING TO UPPER LEVEL IN Y-AXIS
        if(posY > 220 && upperlevel == false && touchFloor){
            this.context.translate(0, 500);
            upperlevel = true;
        } else if (posY < 200 && upperlevel == true)
        {
            this.context.translate(0, -500);
            upperlevel = false;
        }

        handlePickups();
        handlePlayer();

        // Destroy objects in the destroyObjects array after each timestep
        for (var i in destroyObjects) {
            world.DestroyBody(destroyObjects[i]);
        }
        // Reset destroyObjects array
        destroyObjects.length = 0;

        /* HIDE THIS BLOCK IF YOU WANT TO SEE DEBUG SHAPES */
        this.context.clearRect(-500, -2000, 7000, 4000); //Important for redrawing problems!
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
    }
}

function handlePickups()
{
    for(var i = 0; i < treasureChest.length; i++)
    {
        if(player.GetPosition().x >= treasureChest[i].GetPosition().x-2
            && player.GetPosition().x <= treasureChest[i].GetPosition().x+2
            && player.GetPosition().y >= treasureChest[i].GetPosition().y-1.1
            && player.GetPosition().y <= treasureChest[i].GetPosition().y+1.1
            && treasureChest[i].display == true)
        {
            displayKey = true;
        } else displayKey = false;
    }

    for(var i = 0; i < commoncollectibles.length; i++)
    {
        if(commoncollectibles[i].display == true)
        {
            if(player.GetPosition().x >= commoncollectibles[i].GetPosition().x-1.5
                && player.GetPosition().x <= commoncollectibles[i].GetPosition().x+1.5
                && player.GetPosition().y >= commoncollectibles[i].GetPosition().y-1.5
                && player.GetPosition().y <= commoncollectibles[i].GetPosition().y+1.5)
            {
                darkness += 1;
                darknessSound = createjs.Sound.play('darknessSound');
                darknessSound.setVolume(0.1);
                darknessSound.play();
                commoncollectibles[i].display = false;
                destroyObjects.push(commoncollectibles[i]);
            }
        }
    }

    for(var i = 0; i < rarecollectibles.length; i++)
    {
        if(rarecollectibles[i].display == true)
        {
            if(player.GetPosition().x >= rarecollectibles[i].GetPosition().x-1.5
                && player.GetPosition().x <= rarecollectibles[i].GetPosition().x+1.5
                && player.GetPosition().y >= rarecollectibles[i].GetPosition().y-1.5
                && player.GetPosition().y <= rarecollectibles[i].GetPosition().y+1.5)
            {
                darknessRare += 1;
                darknessSound = createjs.Sound.play('darknessrareSound');
                darknessSound.setVolume(0.1);
                darknessSound.play();
                rarecollectibles[i].display = false;
                destroyObjects.push(rarecollectibles[i]);
            }
        }
    }

    if(player.GetPosition().x >= portal.GetPosition().x-2
        && player.GetPosition().x <= portal.GetPosition().x+2
        && player.GetPosition().y >= portal.GetPosition().y-1
        && player.GetPosition().y <= portal.GetPosition().y+1
        && !levelFinish)
    {
        levelFinish = true;
    }
}

function handlePlayer()
{
    // FLUID PLAYER MOVEMENT
    if(movingRight)
    {
        player.SetLinearVelocity(new box2d.b2Vec2(10,player.GetLinearVelocity().y));
        playerTop.SetLinearVelocity(new box2d.b2Vec2(10,player.GetLinearVelocity().y));
        moving = true;
    } else if(movingLeft) {
        player.SetLinearVelocity(new box2d.b2Vec2(-10,player.GetLinearVelocity().y));
        playerTop.SetLinearVelocity(new box2d.b2Vec2(-10,player.GetLinearVelocity().y));
        moving = true;
    }

    // Make player stand still after jumping and touch ground (when no buttons are pressed)
    if(!moving && touchFloor)
    {
        player.SetLinearVelocity(new box2d.b2Vec2(0,player.GetLinearVelocity().y));
        player.SetAngularVelocity(0);
        playerTop.SetLinearVelocity(new box2d.b2Vec2(0,playerTop.GetLinearVelocity().y));
    }

    // Stop player from rotating
    playerTop.SetAngle(0);
    playerTop.SetAngularVelocity(0);
}

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

// START EVERYTHING
window.addEventListener("load",preload);

// PREVENT SCROLLING WITH KEYS
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
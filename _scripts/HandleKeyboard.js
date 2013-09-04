// HANDLE KEYBOARD ACTIONS
// Set double jump variable to true while on the ground. After one jump, doubleJump is reset for if the player touches
// the ground again. After 2 subsequent jumps, the variable is set to False, until the ground is touched again.
// Depending on the keycode of the key pressed, the character moves right, left or jumps. To allow the player to stop
// in midair, a downward action is added.

var doubleJump;
var vel;
var movingRight;

Physics.prototype.handleKeyboard = function() {
    doubleJump = true;
    vel = player.GetLinearVelocity();

    $(window).on('keydown', function(e) {
        code = e.keyCode;
        keypressed = true;

        if(code == 38)                  //Up Arrow
        {
            if(touchFloor)              //ONLY JUMP WHEN ON GROUND
            {
                jump();
                doubleJump = true;      //Reset double jump when floor is touched
            } else if(doubleJump)
            {
                jump();
                doubleJump = false;     //Disable double jump
            }
        }

        if(code == 39)   movingRight = true;    //Right Arrow
        if(code == 40)   stopMoving();          //Down Arrow
        if(code == 37)   movingLeft = true;     //Left Arrow
        if(code == 80)   pauseGame();           //P-Key
        if(code == 70)   openChest();           //F-Key
    });

    $(window).on('keyup', function(e){
        var code = e.keyCode;
        if(code == 39 && touchFloor == true || code == 37 && touchFloor == true) stopMoving();

        if(code == 39 && touchFloor == false || code == 37 && touchFloor == false) moving = false;

        keypressed = false;
        movingRight = false;
        movingLeft = false;
    });
};

function jump() {
    player.ApplyImpulse(new box2d.b2Vec2(vel.x,-100), player.GetWorldCenter());
    playerTop.ApplyImpulse(new box2d.b2Vec2(vel.x,-100), player.GetWorldCenter());
    jumpSound = createjs.Sound.play('jumpSound');
    jumpSound.setVolume(0.1);
    jumpSound.play();
};

function stopMoving(){
    player.SetLinearVelocity(new box2d.b2Vec2(0,player.GetLinearVelocity().y));
    player.SetAngularVelocity(0);
    playerTop.SetLinearVelocity(new box2d.b2Vec2(0,playerTop.GetLinearVelocity().y));
    playerTop.SetAngularVelocity(0);
};

function pauseGame()
{
    if(timestep)
    {
        timestep = 0;
    } else {
        timestep = 1/FPS;
    }
};

function openChest()
{
    var treasure;
    if(displayKey)
    {
        for(var i = 0; i < treasureChest.length; i++)
        {
            new Body(physics, { image: gameTreasureChestOpen , type: "static" , imgWidth: 4 , imgHeight: 2.2 ,
                imgPosX: -2 , imgPosY: -1.3 , x:level1.treasure[i].x , y:level1.treasure[i].y , height: 2.2 , width: 4 , categoryBits: CATEGORY_PLAYER , maskBits: MASK_PLAYER });
            createjs.Sound.play('chestSound');
            createjs.Sound.play('treasureSound');
            if(treasureChest[0])
            {
                treasure = extralife;
                stageFront.addChild(treasure);
                lives += 1;
                displayTreasure = true;
            }

            treasure.x = graphicsCanvasFront.width/2 - 34;
            treasure.y = graphicsCanvasFront.height/2 - 30;
            treasure.alpha = 0;
            createjs.Tween.get(treasure).to({alpha:1}, 500).wait(500)
                .to({x:treasure.x, y:-100},1000,createjs.Ease.sineOut).call(onComplete);
            function onComplete()
            {
                stageFront.removeChild(treasure);
            }
            destroyObjects.push(treasureChest[i]);
            treasureChest[i].display = false;
        }
    }
};
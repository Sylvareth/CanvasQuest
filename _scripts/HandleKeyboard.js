// HANDLE KEYBOARD ACTIONS
// Set double jump variable to true while on the ground. After one jump, doubleJump is reset for if the player touches
// the ground again. After 2 subsequent jumps, the variable is set to False, until the ground is touched again.
// Depending on the keycode of the key pressed, the character moves right, left or jumps. To allow the player to stop
// in midair, a downward action is added.

var doubleJump;
var vel;

Physics.prototype.handleKeyboard = function() {
    doubleJump = true;
    vel = player.GetLinearVelocity();

    $(window).on('keydown', function(e) {
        code = e.keyCode;
        keypressed = true;

        if(code == 38)                  // Up Arrow
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

        if(code == 39)   goRight();     //Right Arrow
        if(code == 40)   stopMoving();  //Down Arrow
        if(code == 37)   goLeft ();     //Left Arrow
    });

    $(window).on('keyup', function(e){
        var code = e.keyCode;
        if(code == 39 && touchFloor == true || code == 37 && touchFloor == true) stopMoving();

        keypressed = false;
    });
};

function goRight() {
    if(touchFloor);
    player.SetLinearVelocity(new box2d.b2Vec2(15,player.GetLinearVelocity().y));

    //player.ApplyImpulse(new box2d.b2Vec2(15,player.GetLinearVelocity().y), player.GetWorldCenter());
    //player.ApplyForce(new box2d.b2Vec2(50,player.GetLinearVelocity().y), player.GetWorldCenter());
};

function goLeft() {
    player.SetLinearVelocity(new box2d.b2Vec2(-15,player.GetLinearVelocity().y));
};

function jump() {
    player.ApplyImpulse(new box2d.b2Vec2(vel.x,-250), player.GetWorldCenter());

    jumpSound = createjs.Sound.play('jumpSound');
    jumpSound.setVolume(0.1);
    jumpSound.play();
};

function stopMoving(){
    player.SetLinearVelocity(new box2d.b2Vec2(0,player.GetLinearVelocity().y));
    player.SetAngularVelocity(0);
    playerTop.SetLinearVelocity(new box2d.b2Vec2(0,playerTop.GetLinearVelocity().y));
};
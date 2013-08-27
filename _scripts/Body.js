(function(window){

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
    };

    var Body = window.Body = function(physics,details) {
        this.details = details = details || {};

        // Create the definition
        this.definition = new box2d.b2BodyDef();

        // Set up the definition
        for(var k in this.definitionDefaults) {
            this.definition[k] = details[k] || this.definitionDefaults[k];
        }
        this.definition.position = new box2d.b2Vec2(details.x || 0, details.y || 0);
        this.definition.linearVelocity = new box2d.b2Vec2(details.vx || 0, details.vy || 0);
        this.definition.userData = this;
        this.definition.type = details.type == "static" ? box2d.b2Body.b2_staticBody :
            box2d.b2Body.b2_dynamicBody;

        // Create the Body
        this.body = world.CreateBody(this.definition);

        // Create the fixture
        this.fixtureDef = new box2d.b2FixtureDef();
        for(var l in this.fixtureDefaults) {
            this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
        }


        details.shape = details.shape || this.defaults.shape;

        switch(details.shape) {
            case "circle":
                details.radius = details.radius || this.defaults.radius;
                this.fixtureDef.shape = new box2d.b2CircleShape(details.radius);
                break;
            case "polygon":
                this.fixtureDef.shape = new box2d.b2PolygonShape();
                this.fixtureDef.shape.SetAsArray(details.points,details.points.length);
                break;
            case "block":
            default:
                details.width = details.width || this.defaults.width;
                details.height = details.height || this.defaults.height;

                this.fixtureDef.shape = new box2d.b2PolygonShape();
                this.fixtureDef.shape.SetAsBox(details.width/2,
                    details.height/2);
                break;
        }


        this.fixtureDef.filter.categoryBits = details.categoryBits || this.fixtureDefaults.categoryBits;
        this.fixtureDef.filter.maskBits = details.maskBits || this.fixtureDefaults.maskBits;

        this.body.CreateFixture(this.fixtureDef);
        return this.body;
    };


    Body.prototype.defaults = {
        shape: "block",
        width: 4,
        height: 4,
        radius: 1,
        imgWidth: 10
    };

    Body.prototype.fixtureDefaults = {
        density: 2,
        friction: 0,
        restitution: 0,
        categoryBits: 0x0002,
        maskBits: 0x0001
    };

    Body.prototype.definitionDefaults = {
        active: true,
        allowSleep: false,
        angle: 0,
        angularVelocity: 0,
        awake: true,
        bullet: false,
        fixedRotation: false
    };


    Body.prototype.draw = function(context) {
        var pos = this.body.GetPosition(),
            angle = this.body.GetAngle();

        context.save();
        context.translate(pos.x,pos.y);
        context.rotate(angle);


        if(this.details.color) {
            context.fillStyle = this.details.color;

            switch(this.details.shape) {
                case "circle":
                    context.beginPath();
                    context.arc(0,0,this.details.radius,0,Math.PI*2);
                    context.fill();
                    break;
                case "polygon":
                    var points = this.details.points;
                    context.beginPath();
                    context.moveTo(points[0].x,points[0].y);
                    for(var i=1;i<points.length;i++) {
                        context.lineTo(points[i].x,points[i].y);
                    }
                    context.fill();
                    break;
                case "block":
                    context.fillRect(-this.details.width/2,
                        -this.details.height/2,
                        this.details.width,
                        this.details.height);
                default:
                    break;
            }
        }

        if(this.details.image) {
            context.drawImage(this.details.image,
                this.details.imgPosX,
                this.details.imgPosY,
                this.details.imgWidth,
                this.details.imgHeight);
        }

        context.restore();

    }

    //MAKE IT AVAILABLE TO CALL IN MAIN.JS
    window.Body = Body;

})(window);
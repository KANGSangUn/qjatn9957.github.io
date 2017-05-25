const GAMETABLE = document.getElementById("table");
//GameTable size
const MAX_WIDTH = 600;
const MAX_HEIGHT = 600;
//Keyboard Input Value
const KEY_LEFT = 37;
const KEY_TOP = 38;
const KEY_RIGHT = 39;
const KEY_BOTTOM = 40;
//Bullet init Values
const B_RADIUS = 10;
const B_SPD_MIN = 1;
//Init Num of Bulle t
const INI_B_NUM = 10 - 1;

function Point(){
    this.xpos;
    this.ypos;
    switch(arguments.length){
        case 0: //no arguments
            this.xpos = 0;
            this.ypos = 0;
        case 1: //argument is a instance of Point
            if(arguments[0] instanceof Point){
                this.xpos = arguments[0].xpos;
                this.ypos = arguments[0].ypos;
            }
        break;
        case 2:
            //arguments[0] is a instance of Point
            if(arguments[0] instanceof Point){
                this.xpos = arguments[0].xpos;
                this.ypos = arguments[0].ypos;
            //arguments are type of number
            }else if( typeof arguments[0] == "number" && typeof arguments[1] == "number"){
                this.xpos = arguments[0];
                this.ypos = arguments[1];
            }
        break;
    }
}//Point class

function HitArea(argPoint, radius){
    Point.call(this, argPoint);
    //speed of x, y
    this.xSpeed;
    this.ySpeed;
    //location of target
    this.xTarget;
    this.yTarget;
    //hitArea radius
    this.radius;
    //hitArea color
    this.color;
    //spawn an object type of HitArea
    this.hitArea = document.createElement("div");

    this.setRadius = function(radius){
        this.radius = radius;
        this.hitArea.style.height = this.hitArea.style.width = this.radius + "px";
    };
    this.setColor = function(color){
        this.color = color;
        this.hitArea.style.backgroundColor = this.color;
    }
    //remove object in document
    this.remove = function(){
        this.setRadius(0);
    };
    this.getDistanceWith = function(argPoint){    //점과 점사이의 거리로 hitArea를 계산함
        return Math.sqrt(Math.pow(argPoint.xpos - this.xpos, 2) + Math.pow(argPoint.ypos - this.ypos, 2));
    };
    this.setColor(this.color);
    this.setRadius(radius);
    
}
HitArea.prototype = new Point();
HitArea.prototype.constructor = HitArea;

HitArea.prototype.move = function(argPoint){
        //set object's position
        this.xpos = argPoint.xpos;
        this.ypos = argPoint.ypos;
        //set attribute value
        this.hitArea.style.left = this.xpos + "px";
        this.hitArea.style.top = this.ypos + "px";
};
//HitArea class


function Player(argPoint, radius){
    HitArea.call(this, argPoint, radius);
    this.speed = 1;
    this.armor = 0;
    this.life = 3;
    this.hitArea.id = 'player';
    this.setRadius(10);
    this.setColor('green');
    GAMETABLE.appendChild(this.hitArea);
}
Player.prototype = new HitArea();
Player.prototype.constructor = Player;

Player.prototype.move = function(argPoint){
    if(argPoint.xpos > MAX_WIDTH - this.radius) argPoint.xpos = MAX_WIDTH - this.radius;
    if(argPoint.xpos < 0) argPoint.xpos = 0;
    if(argPoint.ypos > MAX_HEIGHT - this.radius) argPoint.ypos = MAX_HEIGHT - this.radius;
    if(argPoint.ypos < 0) argPoint.ypos = 0;
    HitArea.prototype.move.call(this, argPoint);
}
//Player class

// function Enemy(argPoint, radius, argHp){
//     HitArea.call(this, argPoint, radius);
//     this.hp = argHp;
//     GAMETABLE.appendChild(this.hitArea);
//     this.setRadius(radius);
//     this.setColor('red');
// }
// Enemy.prototype = new HitArea();
// Enemy.prototype.constructor = Enemy;
function Bullet(argPoint, radius){
    HitArea.call(this, argPoint, radius);
    this.hitArea.className = "bullet";
    GAMETABLE.appendChild(this.hitArea);
    this.type;

    this.bRemove = function(){
        if(this.xpos > MAX_WIDTH || this.xpos < 0 || this.ypos > MAX_HEIGHT || this.ypos < 0){
            this.remove();
            GAMETABLE.removeChild(this.hitArea);
            return true;
        }
    }
}
Bullet.prototype = new HitArea();
Bullet.prototype.constructor = Bullet;
//Bullet class

function ToPlayer(argPoint, radius, speed){
    Bullet.call(this, argPoint, radius);
    this.type = 'toPlayer';
    this.xTarget = playerObj.xpos;
    this.yTarget = playerObj.ypos;

    //set Bullet speed;
    this.xSpeed = (this.xTarget - this.xpos) / 1000 * speed;
    this.ySpeed = (this.yTarget - this.ypos) / 1000 * speed;
}
ToPlayer.prototype = new Bullet();
ToPlayer.prototype.constructor = ToPlayer;

ToPlayer.prototype.move = function(){
        HitArea.prototype.move.call(this, new Point(this.xpos + this.xSpeed, this.ypos + this.ySpeed));
}
//ToPlayer class
function XAxis(argPoint, radius, speed){
    Bullet.call(this, argPoint, radius);
    this.type = 'XAxis';
    this.yTarget = this.ypos == 0 ? MAX_HEIGHT : 0;

    //set Bullet speed;
    this.xSpeed = 0;
    this.ySpeed = (this.yTarget - this.ypos) / 1000 * speed;
}
XAxis.prototype = new Bullet();
XAxis.prototype.constructor = XAxis;

XAxis.prototype.move = function(){
    HitArea.prototype.move.call(this, new Point(this.xpos, this.ypos + this.ySpeed));
}
//XAxis class
function YAxis(argPoint, radius, speed){
    Bullet.call(this, argPoint, radius);
    this.type = 'YAxis';
    this.xTarget = this.xpos == 0 ? MAX_WIDTH : 0;

    //set Bullet speed;
    this.xSpeed = (this.xTarget - this.xpos) / 1000 * speed;
    this.ySpeed = 0;
}
YAxis.prototype = new Bullet();
YAxis.prototype.constructor = YAxis;

YAxis.prototype.move = function(){
    HitArea.prototype.move.call(this, new Point(this.xpos + this.xSpeed, this.ypos));
}
//YAxis class
function FollowPlayer(argPoint, radius, speed){
    Bullet.call(this, argPoint, radius);
    this.type = 'FollowPlayer';
    
    this.speed = speed;
    this.xTarget = playerObj.xpos;
    this.yTarget = playerObj.ypos;

    this.xSpeed = (this.xTarget - this.xpos) / 1000 * speed;
    this.ySpeed = (this.yTarget - this.ypos) / 1000 * speed;
    this.setColor('navy');
}
FollowPlayer.prototype = new Bullet();
FollowPlayer.prototype.constructor = FollowPlayer;

FollowPlayer.prototype.move = function(){
    HitArea.prototype.move.call(this, new Point(this.xpos + this.xSpeed, this.ypos + this.ySpeed));

    this.xTarget = playerObj.xpos;
    this.yTarget = playerObj.ypos;
    
    this.xSpeed += this.xpos < this.xTarget ? 0.005 : -0.005;
    this.ySpeed += this.ypos < this.yTarget ? 0.005 : -0.005;
};

ThunderBullet = function(argPoint, radius, speed){
    Bullet.call(this, argPoint, radius);
    this.type = 'ThunderBullet';

    this.speed = speed;

    this.xTarget = Math.random() * MAX_WIDTH;
    this.yTarget = Math.random() * MAX_HEIGHT;

    this.xSpeed = speed;
    this.ySpeed = speed;

    this.setColor('yellow');
};
ThunderBullet.prototype = new Bullet();
ThunderBullet.prototype.constructor = ThunderBullet;

ThunderBullet.prototype.move = function(){
    
    if(timeCount % 500 < 100){
        HitArea.prototype.move.call(this, new Point(this.xpos + this.xSpeed, this.ypos + this.ySpeed));
    }
};


//player Follow Object.move method
// FollowPlayer.prototype.move = function(){
//     HitArea.prototype.move.call(this, new Point(this.xpos + this.xSpeed, this.ypos + this.ySpeed));

//     this.xTarget = playerObj.xpos;
//     this.yTarget = playerObj.ypos;

//     this.xSpeed = (this.xTarget - this.xpos) / 1000 * this.speed;
//     this.ySpeed = (this.yTarget - this.ypos) / 1000 * this.speed;
// }
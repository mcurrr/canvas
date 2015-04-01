module.exports = Enemy;
Common = require("./parentClass.js");

var u = 0;
var speedLimit = 1;
var imgLoaded = false;

var img = new Image();
img.onload = function(){
	imgLoaded = true;
};
img.src = './img/brainI.png';

function Enemy (options) {
	this.step = 0;
	this.changeDirection = this.randomInt(1 ,7) * 70;
	var self = this;

	this.u = u++;
	speedLimit += 0.05;
	this.radius = this.randomInt(20, 30);

	this.side = this.randomInt(1, 4);

	switch (this.side) {
		case 1: 
			this.x = canvas2.width;
			this.y = this.randomInt(-this.radius * 2, canvas2.height);
			break;
		case 2: 
			this.x = -this.radius * 2;
			this.y = this.randomInt(-this.radius * 2, canvas2.height);
			break;
		case 3: 
			this.y = canvas2.height;
			this.x = this.randomInt(-this.radius * 2, canvas2.width);
			break;
		case 4: 
			this.y = -this.radius * 2;
			this.x = this.randomInt(-this.radius * 2, canvas2.width);
			break;
		default:
			this.x = 0;
			this.y = 0;
	};

	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = this.randomColor(0, 0, 0, 150, 0, 150, 1);
	this.speed = this.randomInt(30, 40);
	this.friction = 0.9;

	this.pre = {
		x: 0,
		y: 0
	};

	this.vec = {
		x: 0,
		y: 0
	};

	this.direction = {
		x: this.randomInt(40, 70),
		y: this.randomInt(50, 80)
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.update = function (dt) {
		self.moveRandom();
		self.boundaries();
	};

	this.draw = function (context) {
		context.save();
		context.shadowColor = 'rgba(0,0,0,.3)';
		context.shadowBlur = 0;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.translate(self.centerX, self.centerY);
		context.rotate(Math.PI/180 * (self.getDegrees() - 90));
		if (imgLoaded) {
			context.drawImage(img, -self.radius, -self.radius, self.radius * 2, self.radius * 2);
		}
		else {
			context.beginPath();
			context.arc(0, 0, self.radius, 0, 2 * Math.PI, false);
			context.fillStyle = self.color;
			context.fill();
		}
		context.restore();
	};
};

Enemy.prototype = Object.create(Common.prototype);

Enemy.prototype.moveRandom = function () {
	if (!(this.step % this.changeDirection)) {
		this.direction = {
			x: this.randomInt(-50, 50),
			y: this.randomInt(-50, 50)
		};
		this.speed = this.randomInt(30, 40);
	}
	this.step++;
	this.pre.x = this.x;
	this.pre.y = this.y;
	this.x += 0.001 * this.speed * this.direction.x;
	this.y += 0.001 * this.speed * this.direction.y;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
};


Enemy.prototype.boundaries = function () {
	if (this.x <= -this.radius * 2 || this.x >= canvas2.width) {
		this.direction.x *= -1;
	}
	if (this.y <= -this.radius * 2 || this.y >= canvas2.height) {
		this.direction.y *= -1;
	}
};

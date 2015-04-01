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
	this.changeDirection = randomInt(1 ,7) * 70;
	var self = this;

	this.u = u++;
	speedLimit += 0.05;
	this.radius = randomInt(20, 30);

	this.side = randomInt(1, 4);

	switch (this.side) {
		case 1: 
			this.x = canvas2.width;
			this.y = randomInt(-this.radius * 2, canvas2.height);
			break;
		case 2: 
			this.x = -this.radius * 2;
			this.y = randomInt(-this.radius * 2, canvas2.height);
			break;
		case 3: 
			this.y = canvas2.height;
			this.x = randomInt(-this.radius * 2, canvas2.width);
			break;
		case 4: 
			this.y = -this.radius * 2;
			this.x = randomInt(-this.radius * 2, canvas2.width);
			break;
		default:
			this.x = 0;
			this.y = 0;
	};

	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = randomColor(0, 0, 0, 150, 0, 150, 1);
	this.speed = randomInt(30, 40);
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
		x: randomInt(40, 70),
		y: randomInt(50, 80)
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
			x: randomInt(-50, 50),
			y: randomInt(-50, 50)
		};
		this.speed = randomInt(30, 40);
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

// Enemy.prototype.grow = function () {
// 	this.radius += 0.01;
// };

// Enemy.prototype.reload = function (player) {
// 	var del = find(enemies, this);
// 	if (del != -1) {
// 		enemies.splice(del, 1, enemies[del] = new Enemy());
// 	}
// 	else {
// 		console.log('error!');
// 	}
// };

// Enemy.prototype.remove = function () {
// 	var del = find(enemies, this);
// 	if (del != -1) {
// 		enemies[del] = undefined;
// 	}
// 	else {
// 		console.log('error!');
// 	}
// };

// Enemy.prototype.getDegrees = function () {
// 	var degrees = 0;
// 	this.vec.x = this.x - this.pre.x;
// 	this.vec.y = this.y - this.pre.y;
// 	degrees = (Math.asin(this.vec.y / Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y)) * 180 / Math.PI);

// 	if (this.vec.x > 0 && this.vec.y > 0) {
// 		degrees = degrees;
// 	}
// 		if (this.vec.x < 0 && this.vec.y > 0) {
// 		degrees = 180 - degrees;
// 	}
// 		if (this.vec.x < 0 && this.vec.y < 0) {
// 		degrees = 180 + (degrees * -1);
// 	}
// 		if (this.vec.x > 0 && this.vec.y < 0) {
// 		degrees = 360 - (degrees * -1);
// 	}
// 	return degrees;
// };

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function find(array, value) {
	for(var i=0; i<array.length; i++) {
		if (value !== undefined && array[i] !== undefined) {
			if (array[i].u == value.u) return i;
			}
		}
	return -1;
};

function randomColor (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = randomInt(rmin, rmax);
	var g = randomInt(gmin, gmax);
	var b = randomInt(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
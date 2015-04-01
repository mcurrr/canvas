module.exports = Player;
Common = require("./parentClass.js");

var imgLoaded = false;
var img = new Image();
img.onload = function(){
	imgLoaded = true;
};
img.src = './img/zombi.png';

function Player (options) {
	var self = this;

	this.width = 30;
	this.height = 30;
	this.radius = this.width/1.6;
	this.x = canvas2.width/2;
	this.y = canvas2.height/2;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = "#000";
	this.speed = 3;
	this.friction = 0.95;
	this.ang = 0;
	this.angle = function () {
		if (this.ang < 360) {
			return this.ang += 6;
		}
		else {
			return this.ang = 0;
		}
	};

	this.pre = {
		x: 0,
		y: 0
	};

	this.dtX = 0;
	this.dtY = 0;

	this.vec = {
		x: 0,
		y: 0
	};

	this.velocity = {
		x: 0.9,
		y: 0.9
	};

	this.update = function () {
		self.input();
		self.move();
		self.boundaries();
		self.angle();
	};

	this.draw = function (context) {
		context.save();
		context.shadowColor = '#888';
		context.shadowBlur = 0;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.translate(self.centerX, self.centerY);
		context.rotate(Math.PI/180 * self.ang);
		if (imgLoaded) {
			context.drawImage(img, -self.radius * 1.5, -self.radius * 1.5, self.radius * 3, self.radius * 3);
		}
		else {
			context.fillStyle = self.color;
			context.fillRect(-self.radius, -self.radius, self.radius * 2, self.radius * 2);
		}
		context.restore();
	};
};

Player.prototype = Object.create(Common.prototype);

Player.prototype.move = function () {
	this.pre.x = this.x;
	this.pre.y = this.y;
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.dtX = this.x - this.pre.x;
	this.dtY = this.y - this.pre.y;
	this.velocity.x *= this.friction;
	this.velocity.y *= this.friction;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
};

Player.prototype.boundaries = function () {
	if (this.x <= 0) {
		this.x = 0;
	}

	if (this.y <= 0) {
		this.y = 0;
	}

	if (this.x >= canvas2.width - this.width) {
		this.x = canvas2.width - this.width;
	}

	if (this.y >= canvas2.height - this.height) {
		this.y = canvas2.height - this.height;
	}
};

Player.prototype.input = function () {
	if (65 in keys) {
		this.x -= this.speed;
		this.velocity.x = -2;
		this.direction = "left";
	}
	if (68 in keys) {
		this.x += this.speed;
		this.velocity.x = 2;
		this.direction = "right";
	}
	if (87 in keys) {
		this.y -= this.speed;
		this.velocity.y = -2;
		this.direction = "up";
	}
	if (83 in keys) {
		this.y += this.speed;
		this.velocity.y = 2;
		this.direction = "down";
	}
};

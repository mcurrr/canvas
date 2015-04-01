module.exports = Bullet;
Common = require("./parentClass.js");

var u = 0;

function Bullet (options) {
	var self = this;

	this.u = u++;
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.pre = {
		x: 0,
		y: 0
	};
	this.vec = {
		x: 0,
		y: 0
	};
	this.radius = options.radius || 3;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = options.color || "#000";
	this.speed = options.speed || 35;

	this.target = {
		x: options.target.x,
		y: options.target.y
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.dx = (this.target.x - this.centerX);
	this.dy = (this.target.y - this.centerY);
	this.mag = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

	/*
	Update the bullet position
	*/

	this.update = function (dt) {
		self.velocity.x = (self.dx / self.mag) * self.speed;
		self.velocity.y = (self.dy / self.mag) * self.speed;
		self.pre.x = self.x;
		self.pre.y = self.y;
		self.x += self.velocity.x;
		self.y += self.velocity.y;
		self.centerX = self.x + self.radius;
		self.centerY = self.y + self.radius;
		self.boundaries();
	};

	/*
	Draw the bullet to the screen
	*/

	this.draw = function (context) {
		context.save();
		context.shadowColor = '#666';
		context.shadowBlur = 10;
		context.shadowOffsetX = 10;
		context.shadowOffsetY = 10;
		context.beginPath();
		context.arc(self.centerX, self.centerY, self.radius, 0, 2 * Math.PI, false);
		context.fillStyle = self.color;
		context.fill();
		context.restore();
	};
};

Bullet.prototype = Object.create(Common.prototype);

Bullet.prototype.boundaries = function () {
	if (this.centerX - this.radius < 0) {
		this.remove(bullets);
		missed += 1;
	}

	if (this.centerY - this.radius < 0) {
		this.remove(bullets);
		missed += 1;
	}

	if (this.centerX + this.radius > canvas2.width) {
		this.remove(bullets);
		missed += 1;
	}

	if (this.centerY + this.radius > canvas2.height) {
		this.remove(bullets);
		missed += 1;
	}
};

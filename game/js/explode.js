module.exports = Explode;
Common = require("./parentClass.js");

var u = 0;

function Explode (options) {
	var self = this;

	this.u = u++;
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.angle = options.angle || 0;
	this.Oradius = options.Oradius || 10;
	this.radius = this.randomInt(2, Math.floor(this.Oradius / 2));
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	// this.color = options.color || "#000"; //particle version
	this.color = this.randomColor(100, 255, 0, 0, 0, 0, 0.8); //bloody version
	this.speed = this.randomInt(7, 10);
	this.scale = 1;
	this.scaleSpeed = this.randomInt(2, 4);

	this.velocity = {
		x: this.speed * Math.cos(this.angle * Math.PI / 180),
		y: this.speed * Math.sin(this.angle * Math.PI / 180)
	};

	this.update = function (dt) {
		this.radius -= this.scaleSpeed / 2;
		if (this.radius <= 0) {
			this.radius = 0;
			this.remove(explodes);
		}
		self.move();
	};

	this.draw = function (context) {
		context.save();
		context.scale(self.scale, self.scale);
		context.beginPath();
		context.arc(self.centerX, self.centerY, self.radius, 0, 2 * Math.PI, false);
		context.fillStyle = self.color;
		context.fill();
		context.restore();
	};

};

Explode.prototype = Object.create(Common.prototype);

Explode.prototype.move = function () {
	this.centerX += this.velocity.x;
	this.centerY += this.velocity.y;
};

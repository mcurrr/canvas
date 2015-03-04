module.exports = Explode;
var u = 0;

function Explode (options) {
	var self = this;

	this.u = u++;
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.angle = options.angle || 0;
	this.Oradius = options.Oradius || 10;
	this.radius = randomInt(2, Math.floor(this.Oradius / 2));
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = options.color || "#000";
	this.speed = randomInt(5, 10);
	this.scale = 1;
	this.scaleSpeed = randomInt(1, 4);

	this.velocity = {
		x: this.speed * Math.cos(this.angle * Math.PI / 180),
		y: this.speed * Math.sin(this.angle * Math.PI / 180)
	};

	this.update = function (dt) {
		this.radius -= this.scaleSpeed / 5;
		if (this.radius <= 0) {
			this.radius = 0;
			this.remove();
		}
		self.move();
	};

	this.draw = function (context) {
		context.save();
		context.shadowColor = '#666';
		context.shadowBlur = 10;
		context.shadowOffsetX = 10;
		context.shadowOffsetY = 10;
		context.scale(self.scale, self.scale);
		context.beginPath();
		context.arc(self.centerX, self.centerY, self.radius, 0, 2 * Math.PI, false);
		context.fillStyle = self.color;
		context.fill();
		context.restore();
	};

};

Explode.prototype.move = function () {
	this.centerX += this.velocity.x;
	this.centerY += this.velocity.y;
};

Explode.prototype.remove = function () {
	var del = find(explodes, this);
	if (del != -1) {
		explodes.splice(del, 1);
	}
	else {
		console.log("imposibru!");
	}
};

function find(array, value) {
	for(var i=0; i<array.length; i++) {
		if (value !== undefined && array[i] !== undefined) {
			if (array[i].u == value.u) return i;
			}
		}
	return -1;
};

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
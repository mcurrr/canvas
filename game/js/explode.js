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
	// this.color = options.color || "#000"; //particle version
	this.color = randomColor(100, 255, 0, 0, 0, 0, 0.8); //bloody version
	this.speed = randomInt(7, 10);
	this.scale = 1;
	this.scaleSpeed = randomInt(2, 4);

	this.velocity = {
		x: this.speed * Math.cos(this.angle * Math.PI / 180),
		y: this.speed * Math.sin(this.angle * Math.PI / 180)
	};

	this.update = function (dt) {
		this.radius -= this.scaleSpeed / 2;
		if (this.radius <= 0) {
			this.radius = 0;
			this.remove();
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

function randomColor (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = randomInt(rmin, rmax);
	var g = randomInt(gmin, gmax);
	var b = randomInt(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
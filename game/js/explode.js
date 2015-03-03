module.exports = Explode;
var angle = 0;

function Explode (options) {
	var self = this;

	this.centerX = options.centerX;
	this.centerY = options.centerY;
	this.radius = randomInt(2, 10);
	this.color = options.color || "#000";
	this.speed = randomInt(20, 50);
	this.scale = randomInt(1, 4);
	this.velocity = {
		x: this.speed * Math.cos(this.angle * Math.PI / 180),
		y: this.speed * Math.sin(this.angle * Math.PI / 180)
	};
	this.angle = angle;
	if (angle >= 360) {
		angle = 0;
	} 
	else {
		angle += 36;
	}

	this.update = function (dt) {
		this.scale -= this.scale;
		if (this.scale <= 0) {
			this.scale = 0;
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

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
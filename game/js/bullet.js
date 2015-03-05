module.exports = Bullet;
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
		context.lineWidth = 1;
		context.strokeStyle = '#fff';
		context.stroke();
		context.restore();
	};
};

Bullet.prototype.boundaries = function () {
	if (this.centerX - this.radius < 0) {
		this.remove();
	}

	if (this.centerY - this.radius < 0) {
		this.remove();
	}

	if (this.centerX + this.radius > canvas2.width) {
		this.remove();
	}

	if (this.centerY + this.radius > canvas2.height) {
		this.remove();
	}
};

Bullet.prototype.remove = function () {
	// console.clear();
	// statistic = 'Accuracy: ' + Math.floor(killed / (bullets[0].u + 1) * 100) + '%';
	// console.log(statistic);
	var del = find(bullets, this);
	if (del != -1) {
		bullets.splice(del, 1);
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

Bullet.prototype.getDegrees = function () {
	var degrees = 0;
	this.vec.x = this.x - this.pre.x;
	this.vec.y = this.y - this.pre.y;
	degrees = (Math.asin(this.vec.y / Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y)) * 180 / Math.PI);

	if (this.vec.x > 0 && this.vec.y > 0) {
		degrees = degrees;
	}
		if (this.vec.x < 0 && this.vec.y > 0) {
		degrees = 180 - degrees;
	}
		if (this.vec.x < 0 && this.vec.y < 0) {
		degrees = 180 + (degrees * -1);
	}
		if (this.vec.x > 0 && this.vec.y < 0) {
		degrees = 360 - (degrees * -1);
	}
	return degrees;
};
module.exports = Enemy;
var u = 0;

function Enemy (options) {
	var self = this;

	this.u = u++;
	this.radius = 15;
	this.x = randomInt(canvas.width - this.radius * 10, canvas.width - this.radius*3);
	this.y = randomInt(0, canvas.height - this.radius * 2);
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = randomColor(0, 255, 0, 150, 0, 150, 0.8);
	this.speed = 20;
	this.friction = 0.9;

	this.direction = {
		x: randomInt(-10, -70),
		y: randomInt(-50, 50)
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.update = function (dt) {
		self.move();
		self.grow();
		self.boundaries();
		self.speed += 0.005;
	};

	this.draw = function (context) {
		context.save();
		// context.translate(self.x, self.y);
		context.beginPath();
		context.arc(self.centerX, self.centerY, self.radius, 0, 2 * Math.PI, false);
		context.fillStyle = self.color;
		context.fill();
		context.restore();
	};
};

Enemy.prototype.move = function () {
	this.x += 0.001 * this.speed * this.direction.x;
	this.y += 0.001 * this.speed * this.direction.y;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
};

Enemy.prototype.grow = function () {
	this.radius += 0.01;
};

Enemy.prototype.boundaries = function () {
	if (this.x <= 0 || this.centerX + this.radius >= canvas.width) {
		this.direction.x *= -1;
	}
	if (this.y <= 0 || this.centerY + this.radius >= canvas.height) {
		this.direction.y *= -1;
	}
};

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

Enemy.prototype.reload = function () {
	var del = find(enemies, this);
	if (del != -1) {
		enemies.splice(del, 1, enemies[del] = new Enemy());
	}
	else {
		console.log('error!');
	}
};

Enemy.prototype.remove = function () {
	var del = find(enemies, this);
	if (del != -1) {
		enemies[del] = undefined;
	}
	else {
		console.log('error!');
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

function randomColor (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = randomInt(rmin, rmax);
	var g = randomInt(gmin, gmax);
	var b = randomInt(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};

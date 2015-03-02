module.exports = Enemy;
var u = 0;

function Enemy (options) {
	var self = this;

	this.u = u++;
	this.width = 25;
	this.height = 25;
	this.x = randomInt(canvas.width - this.width * 4, canvas.width - this.width * 2);
	this.y = randomInt(0, canvas.height - this.height);
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
	this.color = randomColor(0, 255, 0, 255, 0, 255, 0.8);
	this.speed = 20;
	this.friction = 0.9;

	this.direction = {
		x: randomInt(-5, -10),
		y: randomInt(-5, 5)
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.update = function (dt) {
		self.move();
		// self.grow();
		self.boundaries();
		self.speed += 0.01;
	};

	this.draw = function (context) {
			context.fillStyle = self.color;
			context.fillRect (self.x, self.y, self.width, self.height);
	};
};

Enemy.prototype.move = function () {
	this.x += Math.round(0.01 * this.speed * this.direction.x);
	this.y += Math.round(0.01 * this.speed * this.direction.y);
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
};

Enemy.prototype.grow = function () {
	this.width += 0.01;
	this.height += 0.01;
};

Enemy.prototype.boundaries = function () {
	if (this.x <= 0 || this.x >= canvas.width-this.width) {
		this.direction.x *= -1;
	}
	if (this.y <= 0 || this.y >= canvas.height-this.height) {
		this.direction.y *= -1;
	}
};

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
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
}
 
function randomColor (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = randomInt(rmin, rmax);
	var g = randomInt(gmin, gmax);
	var b = randomInt(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
module.exports = Boss;

var BossBullet = require("./bossBullet.js");

function Boss (options) {
	var self = this;

	this.width = 35;
	this.height = 35;
	this.x = randomInt(canvas.width - this.width * 2, canvas.width - this.width * 1);
	this.y = randomInt(0, canvas.height - this.height);
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
	this.color = "#000";
	this.speed = 50;

	this.direction = {
		x: randomInt(-5, -10),
		y: randomInt(-5, 5)
	};

	this.ang = 0;
	this.angle = function () {
		if (this.ang < 360) {
			return this.ang += 20;
		}
		else {
			return this.ang = 0;
		}
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

Boss.prototype.generateDirection = function () {
	this.direction = {
		x: randomInt(-5, 5),
		y: randomInt(-5, 5)
	};
};

Boss.prototype.move = function () {
	this.x += Math.round(0.01 * this.speed * this.direction.x);
	this.y += Math.round(0.01 * this.speed * this.direction.y);
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
};

Boss.prototype.grow = function () {
	this.width += 0.01;
	this.height += 0.01;
};

Boss.prototype.boundaries = function () {
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

Boss.prototype.remove = function () {
	var del = find(enemies, this);
	if (del != -1) {
		enemies[del] = undefined;
	}
	else {
		console.log('error!');
	}
};

Boss.prototype.shoot = function () {
	for (var j = 0; j < 12; j++) {
		bossBullets[bossBullets.length] = new BossBullet({
			x: boss.x + boss.width / 2,
			y: boss.y + boss.height / 2,
		});
	}
};

window.bossAction = setInterval (function () {
	boss.generateDirection();
	boss.angle();
	setTimeout( function() {boss.move()}, 1000);
	setTimeout( function() {boss.angle()}, 3000);
	setTimeout( function() {boss.shoot()}, 1000);
}, 5000);

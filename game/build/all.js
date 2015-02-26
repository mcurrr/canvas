(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Player = require("./player");
var Bullet = require("./bullet");
var Enemy = require("./enemy");

window.canvas = document.getElementById("game");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var killed = 0;

window.keys = {};
window.bullets = [];

window.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
	e.preventDefault();
});

window.addEventListener("keyup", function(e) {
	delete keys[e.keyCode];
});

window.addEventListener("click", function (e) {
	if (player !== undefined) {
		bullets[bullets.length] = new Bullet({
			x: player.x + player.width / 2,
			y: player.y + player.height / 2,
			target: {x: e.clientX, y: e.clientY}
		});
		var statistic = 'Accuracy: ' + Math.floor(killed / bullets[bullets.length - 1].u * 100) + '%';
		console.clear();
		console.log(statistic);
	}
});

window.player = new Player ();

window.enemies = [];

for (var i = 0; i < 50; i++) {
	enemies[enemies.length] = new Enemy ();
}

function isColliding (a, b) {
	return !((a.X < b.x) || (a.Y < b.y) || (b.X < a.x) || (b.Y < a.y));
};

function enemiesCollide(value) {
	for(var i=0; i<enemies.length; i++) {
		if (enemies[i].u == value.u) {
			continue;
		}
		else {
			if(isColliding(enemies[i], value)) {
				if (((enemies[i].direction.x > 0 && enemies[i].direction.y < 0) &&
					 (value.direction.x > 0 && value.direction.y > 0)) ||
					 ((enemies[i].direction.x < 0 && enemies[i].direction.y < 0) &&
					 (value.direction.x < 0 && value.direction.y > 0))) {
						value.direction.y *= -1;
						enemies[i].direction.y *= -1;
				}
				else if (((enemies[i].direction.y > 0 && enemies[i].direction.x < 0) &&
					 (value.direction.y > 0 && value.direction.x > 0)) ||
					 ((enemies[i].direction.y < 0 && enemies[i].direction.x < 0) &&
					 (value.direction.y < 0 && value.direction.x > 0))) {
						value.direction.x *= -1;
						enemies[i].direction.x *= -1;
				}
				else {
					value.direction.x *= -1;
					value.direction.y *= -1;
					enemies[i].direction.x *= -1;
					enemies[i].direction.y *= -1;
				}
			}
		}
	};
};


function draw () {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#ef4e12";
	context.fillRect (0, 0, canvas.width, canvas.height);
	if (player !== undefined) {
		player.draw(context);
		bullets.forEach(function (bullet) {
			bullet.draw(context);
		});
	}
	enemies.forEach(function (enemy) {
		enemy.draw(context);
	});
};

function update() {
	if (player !== undefined) {
		player.update();
	}

	enemies.forEach(function (enemy) {
		if (player !== undefined) {
			if (isColliding (player, enemy)) {
				enemy.reload();
				player = undefined;
				bullets = undefined;
				console.clear();
				console.log('game over');
			}
			if (bullets !== undefined) {
				bullets.forEach(function (bullet) {
					if (isColliding (bullet, enemy)) {
						bullet.remove();
						enemy.reload();
						++killed;
					}
				});
			}
		}
		enemiesCollide (enemy);
		enemy.update();
	});
	if (bullets !== undefined) {
		bullets.forEach(function (bullet) {
			bullet.update();
		});
	}
};

function loop() {
	update();
	draw();
	requestAnimationFrame(loop);
};

loop();
},{"./bullet":2,"./enemy":3,"./player":4}],2:[function(require,module,exports){
module.exports = Bullet;
var u = 0;

function Bullet (options) {
	var self = this;

	this.u = u++;
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.width = options.width || 6;
	this.height = options.height || 6;
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
	this.color = options.color || "#fff";
	this.speed = options.speed || 10;

	this.target = {
		x: options.target.x,
		y: options.target.y
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.dx = (this.target.x - this.x);
	this.dy = (this.target.y - this.y);
	this.mag = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

	/*
	Update the bullet position
	*/

	this.update = function (dt) {
		self.velocity.x = (self.dx / self.mag) * self.speed;
		self.velocity.y = (self.dy / self.mag) * self.speed;
		self.x += self.velocity.x;
		self.y += self.velocity.y;
		self.X = self.x + self.width;
		self.Y = self.y + self.height;
		self.boundaries();
	};

	/*
	Draw the bullet to the screen
	*/

	this.draw = function (context) {
		context.fillStyle = self.color;
		context.fillRect(
			self.x - self.width / 2,
			self.y - self.height / 2,
			self.width,
			self.height
		);
	};
};

Bullet.prototype.boundaries = function () {
	if (this.x < 0) {
		this.remove();
	}

	if (this.y < 0) {
		this.remove();
	}

	if (this.x > canvas.width) {
		this.remove();
	}

	if (this.y > canvas.height) {
		this.remove();
	}
};

Bullet.prototype.remove = function () {
	var del = find(bullets, this);
	if (del != -1) {
		bullets.splice(bullets[del], 1);
	}
	else {
	}
};

function find(array, value) {
	for(var i=0; i<array.length; i++) {
		if (array[i].u == value.u) return i;
		}
	return -1;
}
},{}],3:[function(require,module,exports){
module.exports = Enemy;
var u = 0;

function Enemy (options) {
	var self = this;

	this.u = u++;
	this.width = 25;
	this.height = 25;
	this.x = randomInt(canvas.width - this.width*2, canvas.width);
	this.y = randomInt(0, canvas.height);
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
	if (this.x <= this.width/2 || this.x >= canvas.width - this.width/2) {
		this.direction.x *= -1;
	}
	if (this.y <= this.height/2 || this.y >= canvas.height - this.height/2) {
		this.direction.y *= -1;
	}
};

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

Enemy.prototype.reload = function () {
	var del = find(enemies, this);
	if (del != -1) {
		enemies.splice(enemies[del], 1, enemies[del] = new Enemy());
	}
	else {
	}
};

function find(array, value) {
	for(var i=0; i<array.length; i++) {
		if (array[i].u == value.u) return i;
		}
	return -1;
}
 
function randomColor (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = randomInt(rmin, rmax);
	var g = randomInt(gmin, gmax);
	var b = randomInt(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
},{}],4:[function(require,module,exports){
module.exports = Player;

function Player (options) {
	var self = this;

	this.width = 20;
	this.height = 20;
	this.x = canvas.width/3;
	this.y = canvas.height/2;
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
	this.color = "#fff";
	this.speed = 5;
	this.friction = 0.95;
	this.ang = 0;
	this.angel = function () {
		if (this.ang < 360) {
			return this.ang++;
		}
		else {
			return this.ang = 0;
		}
	};

	this.velocity = {
		x: 0.9,
		y: 0.9
	};

	this.update = function (dt) {
		self.input();
		self.move();
		self.boundaries();
		self.angel();
	};

	this.draw = function (context) {
		context.save();
		context.translate(self.x + self.width/2, self.y + self.height/2);
		context.rotate(Math.PI/180 * self.ang);
		context.fillStyle = self.color;
		context.fillRect(-self.width/2, -self.height/2, self.width, self.height);
		context.restore();
	};
};

Player.prototype.move = function () {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.velocity.x *= this.friction;
	this.velocity.y *= this.friction;
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
};

Player.prototype.boundaries = function () {
	if (this.x <= 0) {
		this.x = 0;
	}

	if (this.y <= 0) {
		this.y = 0;
	}

	if (this.x >= canvas.width - this.width) {
		this.x = canvas.width - this.width;
	}

	if (this.y >= canvas.height - this.height) {
		this.y = canvas.height - this.height;
	}
};

Player.prototype.input = function () {
	if (37 in keys) {
		player.x -= player.speed;
		player.direction = "left";
	}
	if (39 in keys) {
		player.x += player.speed;
		player.direction = "right";
	}
	if (38 in keys) {
		player.y -= player.speed;
		player.direction = "up";
	}
	if (40 in keys) {
		player.y += player.speed;
		player.direction = "down";
	}
	if (37 in keys && 40 in keys) {
		player.direction = "left-down";
	}
	if (39 in keys && 40 in keys) {
		player.direction = "right-down";
	}
	if (37 in keys && 38 in keys) {
		player.direction = "left-up";
	}
	if (39 in keys && 38 in keys) {
		player.direction = "right-up";
	}
};
},{}]},{},[1]);

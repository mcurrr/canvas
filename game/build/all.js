(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Player = require("./player");
var Bullet = require("./bullet");
var Enemy = require("./enemy");
var Timer = require("./timer.js");

window.canvas = document.getElementById("game");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.killed = 0;

window.keys = {};
window.bullets = [];

window.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
	// e.preventDefault();
});

window.addEventListener("keyup", function(e) {
	delete keys[e.keyCode];
});

	window.statistic = 'Accuracy: 0%';
	console.log(statistic);

window.addEventListener("click", function (e) {
	if (player !== undefined) {
		bullets[bullets.length] = new Bullet({
			x: player.x + player.width / 2,
			y: player.y + player.height / 2,
			target: {x: e.clientX, y: e.clientY}
		});
	}
});

window.player = new Player ();
window.timer = new Timer();
window.enemies = [];

for (var i = 0; i < 50; i++) {
	enemies[enemies.length] = new Enemy ();
}

function isColliding (a, b) {
	return !((a.X < b.x) || (a.Y < b.y) || (b.X < a.x) || (b.Y < a.y));
};

function enemiesCollide(value) {
	for(var i=0; i<enemies.length; i++) {
		if (enemies[i] === undefined) {
			continue;
		}
		else {
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
		if (enemy !== undefined) {
			enemy.draw(context);
		}
	});
	timer.draw(context);
};

function update() {
	if (player !== undefined) {
		player.update();
		timer.update();
	}

	enemies.forEach(function (enemy) {
		if (player !== undefined && enemy !== undefined) {
			if (isColliding (player, enemy)) {
				enemy.remove();
				player = undefined;
				bullets = undefined;
				console.clear();
				console.log('game over');
			}
			else {
			}
			if (bullets !== undefined) {
				bullets.forEach(function (bullet) {
					if (isColliding (bullet, enemy)) {
						++killed;
						bullet.remove();
						enemy.remove();
					}
				});
			}
		}
		if (enemy !== undefined) {
			enemiesCollide (enemy);
			enemy.update();
		}
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
},{"./bullet":2,"./enemy":3,"./player":4,"./timer.js":5}],2:[function(require,module,exports){
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
	console.clear();
	statistic = 'Accuracy: ' + Math.floor(killed / (bullets[0].u + 1) * 100) + '%';
	console.log(statistic);
	var del = find(bullets, this);
	if (del != -1) {
		bullets.splice(bullets[del], 1);
	}
	else {
	}
};

},{}],3:[function(require,module,exports){
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
	this.speed = 3;
	this.friction = 0.95;
	this.ang = 0;
	this.angle = function () {
		if (this.ang < 360) {
			return this.ang += 6;
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
		self.angle();
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
	if (65 in keys) {
		this.x -= this.speed;
		this.velocity.x = -2;
		this.direction = "left";
	}
	if (68 in keys) {
		this.x += this.speed;
		this.velocity.x = 2;
		this.direction = "right";
	}
	if (87 in keys) {
		this.y -= this.speed;
		this.velocity.y = -2;
		this.direction = "up";
	}
	if (83 in keys) {
		this.y += this.speed;
		this.velocity.y = 2;
		this.direction = "down";
	}
};
 
},{}],5:[function(require,module,exports){
module.exports = Timer;

function Timer (options) {
	var self = this;

	this.color = "#fff";
	this.start = new Date();

	this.update = function () {
		self.now = new Date();
		self.plaing = self.now - self.start;
	};

	this.formateTime = function () {
		self.milliseconds = Math.floor(new Date(self.plaing).getMilliseconds() / 100);
		self.seconds = new Date(self.plaing).getSeconds();
		if (self.seconds < 10) {self.seconds = '0' + self.seconds;}
		self.minutes = new Date(self.plaing).getMinutes();
		if (self.minutes < 10) {self.minutes = '0' + self.minutes;}
		return self.minutes + ' : ' + self.seconds + ' . ' + self.milliseconds;
	};

	this.draw = function (context) {
		context.fillStyle = self.color;
		context.font = '20px sans-serif';
		context.fillText (self.formateTime(), 10, 30);
	};
};
},{}]},{},[1]);

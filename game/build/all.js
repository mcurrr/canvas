(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Player = require("./player");
var Bullet = require("./bullet");
var Enemy = require("./enemy");
var Timer = require("./timer.js");
var Explode = require("./explode.js");

window.canvas = document.getElementById("game");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.killed = 0;
window.keys = {};
window.bullets = [];
window.enemies = [];
window.explodes = [];
window.player = new Player ();
window.timer = new Timer();

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

function generateEnemy () {
	enemies[enemies.length] = new Enemy ();
};

function generateEnemies () {
	for (var i = 0; enemies.length < 30; i++) {
		generateEnemy();
		for(var i=0; i<enemies.length; i++) {
			if (enemies[i].u != enemies[enemies.length - 1].u) {
				if(isColliding(enemies[i], enemies[enemies.length - 1])) {
					enemies.splice(enemies.length-1, 1);
				}
			}
		};
	};
};

function generateExplode (obj1, obj2) {
	for (var i = 0, ang = obj2.getDegrees() - 90; i < 20; i++, ang += 9) {
		explodes[explodes.length] = new Explode ({
			x: obj1.x,
			y: obj1.y,
			color: obj1.color,
			Oradius: obj1.radius,
			angle: ang
		});
	};
};

generateEnemies();

function isColliding (a, b) {
	var distX = a.centerX - b.centerX;
	var distY = a.centerY - b.centerY;
	var dist = Math.sqrt(distX * distX + distY * distY);
	if (dist <= a.radius + b.radius) {
		return true;
	}
	else {
		return false;
	}
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
	context.fillStyle = "#F7A688";
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
	explodes.forEach(function (explode) {
		if (explode !== undefined) {
			explode.draw(context);
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
				generateExplode(enemy, player);
				enemy.remove();
				generateExplode(player, enemy);
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
						generateExplode(enemy, bullet);
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
	if (explodes !== undefined) {
		explodes.forEach(function (explode) {
			if (explode !== undefined) {
				explode.update();
			}
		});
	}
};

function loop() {
	update();
	draw();
	requestAnimationFrame(loop);
};

loop();
},{"./bullet":2,"./enemy":3,"./explode.js":4,"./player":5,"./timer.js":6}],2:[function(require,module,exports){
module.exports = Bullet;
var u = 0;

function Bullet (options) {
	var self = this;

	this.u = u++;
	this.pre = {
		x: 0,
		y: 0
	};
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.vec = {
		x: 0,
		y: 0
	};
	this.radius = options.radius || 3;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
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

	if (this.centerX + this.radius > canvas.width) {
		this.remove();
	}

	if (this.centerY + this.radius > canvas.height) {
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
},{}],3:[function(require,module,exports){
module.exports = Enemy;
var u = 0;

function Enemy (options) {
	var self = this;

	this.u = u++;
	this.radius = 25;
	this.x = randomInt(canvas.width - this.radius * 10, canvas.width - this.radius*3);
	this.y = randomInt(0, canvas.height - this.radius * 2);
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = randomColor(0, 0, 0, 150, 0, 150, 0.8);
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
		// self.grow();
		self.boundaries();
		self.speed += 0.005;
	};

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

},{}],4:[function(require,module,exports){
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

function randomColor (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = randomInt(rmin, rmax);
	var g = randomInt(gmin, gmax);
	var b = randomInt(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
},{}],5:[function(require,module,exports){
module.exports = Player;

function Player (options) {
	var self = this;

	this.width = 20;
	this.height = 20;
	this.radius = this.width/1.6;
	this.x = canvas.width/4;
	this.y = canvas.height/2;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
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
		context.shadowColor = '#888';
		context.shadowBlur = 10;
		context.shadowOffsetX = 10;
		context.shadowOffsetY = 10;
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
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
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
 
},{}],6:[function(require,module,exports){
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

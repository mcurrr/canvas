(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Player = require("./player");
var Bullet = require("./bullet");
var Enemy = require("./enemy");
var Timer = require("./timer.js");
var Explode = require("./explode.js");

window.canvas0 = document.getElementById("layer0");
var context0 = canvas0.getContext("2d");
canvas0.width = window.innerWidth;
canvas0.height = window.innerHeight;

var img = new Image();
img.src = './img/background.png';
img.onload = function () {
	var pattern = context0.createPattern(img, 'repeat');
	context0.fillStyle = pattern;
	context0.fillRect(0, 0, canvas0.width, canvas0.height);
};

window.canvas1 = document.getElementById("layer1");
var context1 = canvas1.getContext("2d");
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;

window.canvas2 = document.getElementById("layer2");
var context2 = canvas2.getContext("2d");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

window.killed = 0;
window.keys = {};
window.bullets = [];
window.enemies = [];
window.explodes = [];
window.player = new Player ();
window.timer = new Timer();

window.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
	delete keys[e.keyCode];
});

window.statistic = 'Accuracy: 0%';
console.log(statistic);

window.addEventListener("mousedown", function (e) {
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
	for (var i = 0; enemies.length < 10; i++) {
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
	if (obj1 instanceof Player) {
		var ang = 0;
	}
	else {
		var ang = obj2.getDegrees() - 45;
	}
	for (var i = 0; i < 20; i++) {
		if (obj1 instanceof Player) {
			ang += 18;
		}
		else {
			ang += 4.5;
		}
		explodes[explodes.length] = new Explode ({
			x: obj1.x,
			y: obj1.y,
			color: obj1.color,
			Oradius: obj1.radius,
			angle: ang
		});
	};
};

generateEnemies(player);

window.getPlayerX = function (player) {
	return player.x;
};

window.getPlayerY = function (player) {
	return player.y;
};

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

function drawLayer1 () {
	explodes.forEach(function (explode) {
		if (explode !== undefined) {
			explode.draw(context1);
		}
	});
};

function drawLayer2 () {
	context2.clearRect(0, 0, canvas2.width, canvas2.height);
	if (player !== undefined) {
		player.draw(context2);
		bullets.forEach(function (bullet) {
			bullet.draw(context2);
		});
	}
	enemies.forEach(function (enemy) {
		if (enemy !== undefined) {
			enemy.draw(context2);
		}
	});
	explodes.forEach(function (explode) {
		if (explode !== undefined) {
			explode.draw(context2);
		}
	});
	timer.draw(context2, canvas2);
};

function update() {
	if (player !== undefined) {
		player.update();
		timer.update();
	}

	enemies.forEach(function (enemy) {
		if (player !== undefined && enemy !== undefined) {
			if (isColliding (player, enemy)) {
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
						enemy.reload(player);
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
	drawLayer1();
	drawLayer2();
	requestAnimationFrame(loop);
};

loop();

},{"./bullet":2,"./enemy":3,"./explode.js":4,"./player":5,"./timer.js":6}],2:[function(require,module,exports){
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
	if (this.centerX < 0) {
		this.remove();
	}

	if (this.centerY < 0) {
		this.remove();
	}

	if (this.centerX > canvas2.width) {
		this.remove();
	}

	if (this.centerY > canvas2.height) {
		this.remove();
	}
};

Bullet.prototype.remove = function () {
	// statistic = 'Accuracy: ' + Math.floor(killed / (bullets[0].u + 1) * 100) + '%';
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

	this.side = randomInt(1, 4);

	switch (this.side) {
		case 1: 
			this.x = canvas2.width;
			this.y = randomInt(-this.radius * 2, canvas2.height);
			break;
		case 2: 
			this.x = -this.radius * 2;
			this.y = randomInt(-this.radius * 2, canvas2.height);
			break;
		case 3: 
			this.y = canvas2.height;
			this.x = randomInt(-this.radius * 2, canvas2.width);
			break;
		case 4: 
			this.y = -this.radius * 2;
			this.x = randomInt(-this.radius * 2, canvas2.width);
			break;
		default:
			this.x = 0;
			this.y = 0;
	};

	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = randomColor(0, 0, 0, 150, 0, 150, 1);
	this.speed = randomInt(20 , 30)/10;
	this.friction = 0.9;

	this.pre = {
		x: 0,
		y: 0
	};

	this.vec = {
		x: 0,
		y: 0
	};

	this.direction = {
		x: randomInt(-50, 50),
		y: randomInt(-50, 50)
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.update = function (dt) {
		self.moveRandom();
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
		// context.restore();
	};
};

Enemy.prototype.moveRandom = function () {
	this.pre.x = this.x;
	this.pre.y = this.y;
	this.x += 0.001 * this.speed * this.direction.x;
	this.y += 0.001 * this.speed * this.direction.y;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
};


Enemy.prototype.grow = function () {
	this.radius += 0.01;
};

Enemy.prototype.boundaries = function () {
	if (this.x <= -this.radius * 2 || this.x >= canvas2.width) {
		this.direction.x *= -1;
	}
	if (this.y <= -this.radius * 2 || this.y >= canvas2.height) {
		this.direction.y *= -1;
	}
};

Enemy.prototype.reload = function (player) {
	var del = find(enemies, this);
	if (del != -1) {
		enemies.splice(del, 1, enemies[del] = new Enemy({
			targetPlayer: {x: player.x, y: player.y}
		}));
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

Enemy.prototype.getDegrees = function () {
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

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
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
},{}],5:[function(require,module,exports){
module.exports = Player;

function Player (options) {
	var self = this;

	this.width = 30;
	this.height = 30;
	this.radius = this.width/1.6;
	this.x = canvas2.width/2;
	this.y = canvas2.height/2;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = "#000";
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

	this.pre = {
		x: 0,
		y: 0
	};

	this.vec = {
		x: 0,
		y: 0
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
	this.pre.x = this.x;
	this.pre.y = this.y;
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

	if (this.x >= canvas2.width - this.width) {
		this.x = canvas2.width - this.width;
	}

	if (this.y >= canvas2.height - this.height) {
		this.y = canvas2.height - this.height;
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

Player.prototype.getDegrees = function () {
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
},{}],6:[function(require,module,exports){
module.exports = Timer;

function Timer (options) {
	var self = this;

	this.color = "rgba(0, 0, 0, 0.7)";
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

	this.draw = function (context, canvas) {
		context.fillStyle = self.color;
		context.font = '80px sans-serif';
		context.shadowColor = '#000';
		context.shadowBlur = 15;
		context.shadowOffsetX = 20;
		context.shadowOffsetY = 20;
		context.fillText (self.formateTime(), canvas.width/2 - 150, canvas.height/2);
	};
};
},{}]},{},[1]);

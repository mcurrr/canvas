(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	Bullet = require("./bullet"),
	Enemy = require("./enemy"),
	Player = require("./player"),
	Timer = require("./timer"),
	Explode = require("./explode"),
	Sound = require("./sounds");

$(document).ready(function() {

	window.isItNewGame = true;
	window.stopped = true;
	var isMusicOff = false;
	var resizeEnd;
	var isSoundOff = false;
	window.checkAudio = 0;
	window.statistic = 0;
	window.killed = 0;
	window.missed = 0;
	window.winHeight = window.innerHeight;
	$('#canvas').css({'height': winHeight});

	$start = $('#canvasStart');
	$pause = $('#canvasPause');
	$pause.hide();
	$reset = $('#canvasReset');
	$reset.hide();
	$loading = $('#canvasLoading');
	$loading.hide();
	$musicBan = $('#musicBan');
	$musicBan.hide();
	$soundBan = $('#soundBan');
	$soundBan.hide();
	$infoModal = $('#canvasInfoModal');
	$killed = $('#canvasKilled');
	$accuracy = $('#canvasAccuracy');

	helpMsg = 'Welcome to upside down universe!' +
			  ' Use \'w\', \'s\', \'a\', \'d\' buttons and mouse clicks' + 
			  ' to protect your zombie from brain\'s attack.' + 
				' Don\'t let them get him! Stay \'alive\' for as long as it possible.';

	window.sizer = document.getElementById('canvas_size');
	window.width = sizer.offsetWidth;
	window.height = sizer.offsetHeight;
	window.canvas0 = document.getElementById("layer0");
	var context0 = canvas0.getContext("2d");
	window.canvas1 = document.getElementById("layer1");
	var context1 = canvas1.getContext("2d");
	window.canvas2 = document.getElementById("layer2");
	var context2 = canvas2.getContext("2d");

	function sizeCalculate() {
		width = sizer.offsetWidth;
		height = sizer.offsetHeight;
		canvas0.width = width;
		canvas0.height = height;
		canvas1.width = width;
		canvas1.height = height;
		canvas2.width = width;
		canvas2.height = height;
	};

	sizeCalculate();

	var img = new Image();
	img.src = './img/background.png';
	img.onload = function () {
		var pattern = context0.createPattern(img, 'repeat');
		window.drawLayer0 = function() {
			context0.fillStyle = pattern;
			context0.fillRect(0, 0, canvas0.width, canvas0.height);
		};
		drawLayer0();
	};

	window.init = function() {
		context1.clearRect(0, 0, canvas1.width, canvas1.height);
		context2.clearRect(0, 0, canvas2.width, canvas2.height);
		img.onload();
		isItNewGame = false;
		window.backgroundSound = new Audio('./audio/smooth_criminal.mp3');
		backgroundSound.load();
		backgroundSound.loop = true;
		backgroundSound.volume = .025;
		killed = 0;
		missed = 0;
		statistic = 0;
		window.keys = {};
		window.bullets = [];
		window.enemies = [];
		window.explodes = [];
		window.player = new Player ();
		window.poolShot = [];
		window.poolSplash = [];
		window.bulletSound = new Sound(20);
		bulletSound.init("bulletSound");
		window.explosionSound = new Sound(20);
		explosionSound.init("explosionSound");
		generateEnemies();
	};

	function hideGears() {
		$loading.hide();
		if (!isItNewGame) {
			if (!stopped) {
				canvasPause();
			}
			$pause.show();
		}
		else {
			$start.show();
		}
	};

	function generateEnemy () {
		enemies[enemies.length] = new Enemy ();
	};

	function generateEnemies () {
		for (var i = 0; enemies.length < 25; i++) {
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

	function getShotSound() {
		for (var i = 0; i < poolShot.length; i++) {
			if (poolShot[i].currentTime == 0 || poolShot[i].ended) {
				poolShot[i].play();
				return true;
			}
		}
	};

	function getExplosionSound() {
		for (var i = 0; i < poolSplash.length; i++) {
			if (poolSplash[i].currentTime == 0 || poolSplash[i].ended) {
				poolSplash[i].play();
				return true;
			}
		}
	};


	function isColliding(a, b) {
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
					if (!isSoundOff) {
						getExplosionSound();
					}
					player = undefined;
					bullets = undefined;
					isItNewGame = true;
					setTimeout(function() {
						stopped = true;
						backgroundSound.pause();
						backgroundSound.currentTime = 0;
						$pause.hide();
						$start.hide();
						$reset.show();
					}, 1000);
				}
				else {
				}
				if (bullets !== undefined) {
					bullets.forEach(function (bullet) {
						if (isColliding (bullet, enemy)) {
							++killed;
							if (!isSoundOff) {
								getExplosionSound();
							}
							bullet.remove(bullets);
							generateExplode(enemy, bullet);
							enemy.reload(enemies, Enemy);
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
	if (!killed) {
		statistic = 0;
	}
	else {
		statistic = (Math.round((killed / (killed + missed))*1000))/10;
	}
	$killed.text("Enemies killed: " + killed);
	$accuracy.text("Accuracy: " + statistic + "%");
	};

	function getMousePosition(canvas, e) {
		var rect = canvas.getBoundingClientRect();
			return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	};

	function checkReadyState () {
		if (backgroundSound.readyState === 4) {
			window.clearInterval(checkAudio);
			$loading.hide();
			window.timer = new Timer();
			if (!isMusicOff) {
				backgroundSound.play();
			}
			loop();
		}
	};

	window.loop = function() {
		if (!stopped) {
			update();
			drawLayer1();
			drawLayer2();
			requestAnimationFrame(loop);
		}
	};

	/*---------------------------------------------------------------------
							CONTROLS
	--------------------------------------------------------------------*/

	window.canvasStart = function() {
		$pause.hide();
		$reset.hide();
		$start.hide();
		if (stopped) {
			if (isItNewGame) {
				init();
				$loading.show();
				checkAudio = window.setInterval(function() {
					checkReadyState()
				}, 1000);
				stopped = false;
			}
			else {
				if (!isMusicOff) {
					backgroundSound.play();
				}
				timer.unpause();
				stopped = false;
				loop();
			}
		}
	};

	window.canvasPause = function() {
		if (!isItNewGame) {
			if (stopped) {
				canvasStart();
				timer.unpause();
			}
			else {
				stopped = true;
				timer.pause();
				if (!isMusicOff) {
					backgroundSound.pause();
				}
			$pause.show();
			}
			console.log('pause');
		}
	};

	window.canvasReset = function() {
		if (!stopped) {
			canvasPause();
		}
		$pause.hide();
		$reset.hide();
		$start.show();
		context1.clearRect(0, 0, canvas1.width, canvas1.height);
		context2.clearRect(0, 0, canvas2.width, canvas2.height);
		isItNewGame = true;
	};

	window.canvasMusicOff = function() {
		if (isMusicOff) {
			isMusicOff = false;
			backgroundSound.play();
		}
		else {
			isMusicOff = true;
			if (!!checkAudio) {
				backgroundSound.pause();
			}
		}
		$musicBan.toggle();
	};

	window.canvasSoundOff = function() {
		if (isSoundOff) {
			isSoundOff = false;
		}
		else {
			isSoundOff = true;
		}
		$soundBan.toggle();
	};

	/*===============================================================
					TRIGGERS
	===============================================================*/

	window.addEventListener("keydown", function(e) {
		keys[e.keyCode] = true;
	});

	window.addEventListener("keyup", function(e) {
		delete keys[e.keyCode];
	});

	canvas2.addEventListener("mousedown", function (e) {
		if (player !== undefined) {
			if (!stopped) {
				bullets[bullets.length] = new Bullet({
					x: player.x + player.width / 2,
					y: player.y + player.height / 2,
					target: getMousePosition(canvas0, e)
				});
				if (!isSoundOff) {
					getShotSound();
				}
			}
		}
	});

	window.addEventListener('resize', function() {
		$loading.show();
		$reset.hide();
		if (!isItNewGame) {
			if (!stopped) {
				canvasPause();
			}
			$pause.hide();
		}
		else {
			$start.hide();
		}
		winHeight = window.innerHeight;
		$('#canvas').css({'height': winHeight});
		sizeCalculate();
		drawLayer0();
		clearTimeout(resizeEnd);
		resizeEnd = setTimeout(hideGears, 200);
	});
});
},{"./bullet":2,"./enemy":3,"./explode":4,"./player":6,"./sounds":7,"./timer":8}],2:[function(require,module,exports){
module.exports = Bullet;
Common = require("./parentClass.js");

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
		context.restore();
	};
};

Bullet.prototype = Object.create(Common.prototype);

Bullet.prototype.boundaries = function () {
	if (this.centerX - this.radius < 0) {
		this.remove(bullets);
		missed += 1;
	}

	if (this.centerY - this.radius < 0) {
		this.remove(bullets);
		missed += 1;
	}

	if (this.centerX + this.radius > canvas2.width) {
		this.remove(bullets);
		missed += 1;
	}

	if (this.centerY + this.radius > canvas2.height) {
		this.remove(bullets);
		missed += 1;
	}
};

},{"./parentClass.js":5}],3:[function(require,module,exports){
module.exports = Enemy;
Common = require("./parentClass.js");

var u = 0;
var speedLimit = 1;
var imgLoaded = false;

var img = new Image();
img.onload = function(){
	imgLoaded = true;
};
img.src = './img/brainI.png';

function Enemy (options) {
	this.step = 0;
	this.changeDirection = this.randomInt(1 ,7) * 70;
	var self = this;

	this.u = u++;
	speedLimit += 0.05;
	this.radius = this.randomInt(20, 30);

	this.side = this.randomInt(1, 4);

	switch (this.side) {
		case 1: 
			this.x = canvas2.width;
			this.y = this.randomInt(-this.radius * 2, canvas2.height);
			break;
		case 2: 
			this.x = -this.radius * 2;
			this.y = this.randomInt(-this.radius * 2, canvas2.height);
			break;
		case 3: 
			this.y = canvas2.height;
			this.x = this.randomInt(-this.radius * 2, canvas2.width);
			break;
		case 4: 
			this.y = -this.radius * 2;
			this.x = this.randomInt(-this.radius * 2, canvas2.width);
			break;
		default:
			this.x = 0;
			this.y = 0;
	};

	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	this.color = this.randomColor(0, 0, 0, 150, 0, 150, 1);
	this.speed = this.randomInt(30, 40);
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
		x: this.randomInt(40, 70),
		y: this.randomInt(50, 80)
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.update = function (dt) {
		self.moveRandom();
		self.boundaries();
	};

	this.draw = function (context) {
		context.save();
		context.shadowColor = 'rgba(0,0,0,.3)';
		context.shadowBlur = 0;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.translate(self.centerX, self.centerY);
		context.rotate(Math.PI/180 * (self.getDegrees() - 90));
		if (imgLoaded) {
			context.drawImage(img, -self.radius, -self.radius, self.radius * 2, self.radius * 2);
		}
		else {
			context.beginPath();
			context.arc(0, 0, self.radius, 0, 2 * Math.PI, false);
			context.fillStyle = self.color;
			context.fill();
		}
		context.restore();
	};
};

Enemy.prototype = Object.create(Common.prototype);

Enemy.prototype.moveRandom = function () {
	if (!(this.step % this.changeDirection)) {
		this.direction = {
			x: this.randomInt(-50, 50),
			y: this.randomInt(-50, 50)
		};
		this.speed = this.randomInt(30, 40);
	}
	this.step++;
	this.pre.x = this.x;
	this.pre.y = this.y;
	this.x += 0.001 * this.speed * this.direction.x;
	this.y += 0.001 * this.speed * this.direction.y;
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
};


Enemy.prototype.boundaries = function () {
	if (this.x <= -this.radius * 2 || this.x >= canvas2.width) {
		this.direction.x *= -1;
	}
	if (this.y <= -this.radius * 2 || this.y >= canvas2.height) {
		this.direction.y *= -1;
	}
};

},{"./parentClass.js":5}],4:[function(require,module,exports){
module.exports = Explode;
Common = require("./parentClass.js");

var u = 0;

function Explode (options) {
	var self = this;

	this.u = u++;
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.angle = options.angle || 0;
	this.Oradius = options.Oradius || 10;
	this.radius = this.randomInt(2, Math.floor(this.Oradius / 2));
	this.centerX = this.x + this.radius;
	this.centerY = this.y + this.radius;
	// this.color = options.color || "#000"; //particle version
	this.color = this.randomColor(100, 255, 0, 0, 0, 0, 0.8); //bloody version
	this.speed = this.randomInt(7, 10);
	this.scale = 1;
	this.scaleSpeed = this.randomInt(2, 4);

	this.velocity = {
		x: this.speed * Math.cos(this.angle * Math.PI / 180),
		y: this.speed * Math.sin(this.angle * Math.PI / 180)
	};

	this.update = function (dt) {
		this.radius -= this.scaleSpeed / 2;
		if (this.radius <= 0) {
			this.radius = 0;
			this.remove(explodes);
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

Explode.prototype = Object.create(Common.prototype);

Explode.prototype.move = function () {
	this.centerX += this.velocity.x;
	this.centerY += this.velocity.y;
};

},{"./parentClass.js":5}],5:[function(require,module,exports){
module.exports = Common;

function Common() {};

Common.prototype.getDegrees = function () {
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

Common.prototype.remove = function (arr) {
	var del = this.find(arr, this);
	if (del != -1) {
		arr.splice(del, 1);
	}
	else {
		console.log("imposibru!");
	}
};

Common.prototype.reload = function (arr, constr) {
	var del = this.find(arr, this);
	if (del != -1) {
		arr.splice(del, 1, arr[del] = new constr());
	}
	else {
		console.log('error!');
	}
};

Common.prototype.grow = function () {
	this.radius += 0.01;
};

Common.prototype.randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

Common.prototype.find = function (array, value) {
	for(var i=0; i<array.length; i++) {
		if (value !== undefined && array[i] !== undefined) {
			if (array[i].u == value.u) return i;
			}
		}
	return -1;
};

Common.prototype.randomColor = function (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = this.randomInt(rmin, rmax);
	var g = this.randomInt(gmin, gmax);
	var b = this.randomInt(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
},{}],6:[function(require,module,exports){
module.exports = Player;
Common = require("./parentClass.js");

var imgLoaded = false;
var img = new Image();
img.onload = function(){
	imgLoaded = true;
};
img.src = './img/zombi.png';

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

	this.dtX = 0;
	this.dtY = 0;

	this.vec = {
		x: 0,
		y: 0
	};

	this.velocity = {
		x: 0.9,
		y: 0.9
	};

	this.update = function () {
		self.input();
		self.move();
		self.boundaries();
		self.angle();
	};

	this.draw = function (context) {
		context.save();
		context.shadowColor = '#888';
		context.shadowBlur = 0;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.translate(self.centerX, self.centerY);
		context.rotate(Math.PI/180 * self.ang);
		if (imgLoaded) {
			context.drawImage(img, -self.radius * 1.5, -self.radius * 1.5, self.radius * 3, self.radius * 3);
		}
		else {
			context.fillStyle = self.color;
			context.fillRect(-self.radius, -self.radius, self.radius * 2, self.radius * 2);
		}
		context.restore();
	};
};

Player.prototype = Object.create(Common.prototype);

Player.prototype.move = function () {
	this.pre.x = this.x;
	this.pre.y = this.y;
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.dtX = this.x - this.pre.x;
	this.dtY = this.y - this.pre.y;
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

},{"./parentClass.js":5}],7:[function(require,module,exports){
module.exports = Sound;

function Sound (maxSize) {
	var size = maxSize;

	this.init = function (objStr) {
		if (objStr == "bulletSound") {
			for (var i= 0; i < size; i++) {
				bulletSound = new Audio("./audio/shot.mp3");
				bulletSound.volume = 0.02;
				bulletSound.load();
				poolShot[i] = bulletSound;
			}
		}
		else if (objStr == "explosionSound") {
			for (var i= 0; i < size; i++) {
				explosionSound = new Audio("./audio/squish.mp3");
				explosionSound.volume = 0.2;
				explosionSound.load();
				poolSplash[i] = explosionSound;
			}
		}
	};
};
},{}],8:[function(require,module,exports){
module.exports = Timer;

function Timer (options) {
	var self = this;

	this.color = "rgba(0, 0, 0, 0.7)";
	this.start = new Date();
	this.total = 0;

	this.update = function () {
		self.now = new Date();
		self.playing = self.now - self.start + self.total;
	};

	this.formateTime = function () {
		self.milliseconds = Math.floor(new Date(self.playing).getMilliseconds() / 100);
		self.seconds = new Date(self.playing).getSeconds();
		if (self.seconds < 10) {self.seconds = '0' + self.seconds;}
		self.minutes = new Date(self.playing).getMinutes();
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

Timer.prototype.pause = function() {
	this.total = this.playing;
	this.now = this.start;
};

Timer.prototype.unpause = function() {
	this.start = new Date();
	this.now = new Date();
};
},{}]},{},[1]);

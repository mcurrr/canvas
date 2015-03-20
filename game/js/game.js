	Bullet = require("./bullet"),
	Enemy = require("./enemy"),
	Player = require("./player"),
	Timer = require("./timer"),
	Explode = require("./explode"),
	Sound = require("./sounds");

window.loading = document.getElementById("loading");
loading.style.display = "none";

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

window.isItNewGame = true;
window.stopped = true;
var isMusicOff = false;
var isSoundOff = false;
window.killed = 0;

function init() {
	context1.clearRect(0, 0, canvas1.width, canvas1.height);
	context2.clearRect(0, 0, canvas2.width, canvas2.height);
	img.onload();
	isItNewGame = false;
	window.backgroundSound = new Audio('./audio/smooth_criminal.mp3');
	backgroundSound.load();
	backgroundSound.loop = true;
	backgroundSound.volume = .025;
	killed = 0;
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
	window.statistic = 'Accuracy: 0%';
	console.log(statistic);
	generateEnemies();
};

window.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
	delete keys[e.keyCode];
});


window.addEventListener("mousedown", function (e) {
	if (player !== undefined) {
		bullets[bullets.length] = new Bullet({
			x: player.x + player.width / 2,
			y: player.y + player.height / 2,
			target: {x: e.clientX, y: e.clientY}
		});
	if (!isSoundOff) {
		getShotSound();
	}
	}
});

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

function getShotSound () {
	for (var i = 0; i < poolShot.length; i++) {
		if (poolShot[i].currentTime == 0 || poolShot[i].ended) {
			poolShot[i].play();
			return true;
		}
	}
};

function getExplosionSound () {
	for (var i = 0; i < poolSplash.length; i++) {
		if (poolSplash[i].currentTime == 0 || poolSplash[i].ended) {
			poolSplash[i].play();
			return true;
		}
	}
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
				if (!isSoundOff) {
					getExplosionSound();
				}
				player = undefined;
				bullets = undefined;
				console.clear();
				console.log('game over');
				isItNewGame = true;
				setTimeout(function() {
					stopped = true;
					backgroundSound.pause();
					backgroundSound.currentTime = 0;
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
						bullet.remove();
						generateExplode(enemy, bullet);
						enemy.reload();
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


function checkReadyState () {
	if (backgroundSound.readyState === 4) {
		window.clearInterval(checkAudio);
		loading.style.display = "none";
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

window.onStart = function() {
	if (stopped) {
		if (isItNewGame) {
			init();
			loading.style.display = "block";
			window.checkAudio = window.setInterval(function() {
				checkReadyState()
			}, 1000);
			stopped = false;
		}
		else {
			if (!isMusicOff) {
				backgroundSound.play();
			}
			stopped = false;
			loop();
		}
	}
};

window.onPause = function() {
	if (!isItNewGame) {
		if (stopped) {
			stopped = false;
		}
		else {
			stopped = true;
		}
		backgroundSound.pause();
	}
};

window.onMusicOff = function() {
	if (isMusicOff) {
		backgroundSound.play();
		isMusicOff = false;
	}
	else {
		backgroundSound.pause();
		isMusicOff = true;
	}
};

window.onSoundOff = function() {
	if (isSoundOff) {
		isSoundOff = false;
	}
	else {
		isSoundOff = true;
	}
};
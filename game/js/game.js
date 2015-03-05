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
	enemies[enemies.length] = new Enemy (/*{
		targetPlayer: {x: player.x, y: player.y}
	}*/);
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
	if (obj2 instanceof Player) {
		var ang = 0;
	}
	else {
		var ang = obj2.getDegrees() - 45;
	}
	for (var i = 0; i < 20; i++) {
		if (obj2 instanceof Player) {
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

function drawLayer0 () {
	// context0.fillStyle = "rgba(216, 111, 51, 1)";
	// context0.fillRect (0, 0, canvas0.width, canvas0.height);

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
				generateExplode(enemy, player);
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
	drawLayer0();
	drawLayer1();
	drawLayer2();
	requestAnimationFrame(loop);
};

loop();

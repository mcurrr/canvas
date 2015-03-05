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
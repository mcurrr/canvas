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
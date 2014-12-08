var Game = require("gameloop-canvas");
var Keyboard = require("crtrdg-keyboard");
var Mouse = require("crtrdg-mouse");

var Player = require("./player");
var Bullet = require("./bullet");
var Enemy = require("./enemy");

var game = Game({
	canvas: "game",
	width: window.innerWidth,
	height: window.innerHeight
});

var keyboard = new Keyboard (game);
var mouse = new Mouse (game);

var bullets = [];

mouse.on("click", function (e) {
	if (player.exists) {
		bullets[bullets.length] = new Bullet(game, {
			x: player.x + player.width / 2,
			y: player.y + player.height / 2,
			target: {x: e.x, y: e.y}
		});
	}
});

game.on("update", function (dt) {
	enemies.forEach(function (enemy) {
		if (player.boundingBox.intersects(enemy.boundingBox)) {
			if (enemy.exists) {
				enemy.direction.x *= -1;
				enemy.direction.y *= -1;
			}
		}

		bullets.forEach(function (bullet) {
			if (bullet.boundingBox.intersects(enemy.boundingBox)) {
				if (enemy.exists) {
					bullet.remove();
					enemy.remove();
					enemies[enemies.length] = new Enemy(game);
				}
			}
		});
	});
});

game.on("draw", function (context) {
	context.fillStyle = "#ef4e12";
	context.fillRect (0, 0, game.width, game.height);
});

var player = new Player (game, {keys: keyboard.keysDown});

var enemies = [];

for (var i = 0; i < 5; i++) {
	enemies[enemies.length] = new Enemy(game);
}

game.start();
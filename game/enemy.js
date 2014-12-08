var Entity = require("crtrdg-entity");
var aabb = require("aabb-2d");
var inherits = require("inherits");

module.exports = Enemy;
inherits(Enemy, Entity);

function Enemy (game, options) {
	var self = this;

	this.game = game;
	this.addTo(game);
	this.width = 25;
	this.height = 25;
	this.x = game.width - this.width;
	this.y = randomInt(this.height + 150, game.height - 150);
	this.color = "#eee";
	this.speed = 2;
	this.friction = 0.9;

	this.direction = {
		x: randomInt(-5, -15),
		y: randomInt(-10, 10)
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.boundingBox = aabb([this.x, this.y], [this.width, this.height]);

	this.game.on("update", function (dt) {
		if (self.exists) {
			self.move();
			// self.grow();
			self.boundaries();
			self.boundingBox = aabb([self.x, self.y], [this.width, this.height]);
		}
	});

	this.game.on("draw", function (context) {
		if (self.exists) {
			for (var w = 0; w < 3; w++) {
				context.save();
				context.translate(self.x, self.y);
				context.rotate(Math.PI/180 * randomInt(-180, 180));
				context.storkeStyle = self.color;
				context.strokeRect(-self.width/2, -self.height/2, self.width, self.height);
				context.restore();
			};
		}
	});
};

Enemy.prototype.move = function () {
	this.x += 0.1 * this.speed * this.direction.x;
	this.y += 0.1 * this.speed * this.direction.y;
};

Enemy.prototype.grow = function () {
	this.width += 1;
	this.height += 1;
};

Enemy.prototype.boundaries = function () {
	if (this.x <= 0 || this.x >= this.game.width - this.width) {
		this.direction.x *= -1;
	}

	if (this.y <= 0 || this.y >= this.game.height - this.height) {
		this.direction.y *= -1;
	}
};

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
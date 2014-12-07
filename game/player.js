var Entity = require("crtrdg-entity");
var aabb = require("aabb-2d");
var inherits = require("inherits");

module.exports = Player;
inherits(Player, Entity);

function Player (game, options) {
	var self = this;

	this.game = game;
	this.addTo(game);
	this.keys = options.keys;
	this.width = 20;
	this.height = 20;
	this.x = game.width / 2;
	this.y = game.height / 2;
	this.color = "#fff";
	this.speed = 5;
	this.friction = 0.95;

	this.velocity = {
		x: 0,
		y: 0
	};

	this.boundingBox = aabb([this.x, this.y], [this.width, this.height]);

	this.game.on("update", function (dt) {
		if (self.exists) {
			self.input();
			self.move();
			self.boundaries();
			self.boundingBox = aabb([self.x, self.y], [self.width, self.height]);
		}
	});

	this.game.on("draw", function (context) {
		if (self.exists) {
			context.strokeStyle = "#fff";
			context.strokeRect (self.x, self.y, self.width, self.height);
		}
	});
};

Player.prototype.move = function () {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.velocity.x *= this.friction;
	this.velocity.y *= this.friction;
};

Player.prototype.boundaries = function () {
	if (this.x <= 0) {
		this.x = 0;
	}

	if (this.y <= 0) {
		this.y = 0;
	}

	if (this.x >= this.game.width - this.width) {
		this.x = this.game.width - this.width;
	}

	if (this.y >= this.game.height - this.height) {
		this.y = this.game.height - this.height;
	}
};

Player.prototype.input = function () {
	if ("A" in this.keys) {
		this.velocity.x = -this.speed;
	}

	if ("D" in this.keys) {
		this.velocity.x = this.speed;
	}

	if ("W" in this.keys) {
		this.velocity.y = -this.speed;
	}

	if ("S" in this.keys) {
		this.velocity.y = this.speed;
	}
};
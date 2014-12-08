var Entity = require("crtrdg-entity");
var aabb = require("aabb-2d");
var inherits = require("inherits");

module.exports = Bullet;
inherits(Bullet, Entity);

function Bullet (game, options) {
	var self = this;

	this.game = game;
	this.addTo(game);
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.width = options.width || 6;
	this.height = options.height || 6;
	this.color = options.color || "#fff";
	this.speed = options.speed || 20;

	this.target = {
		x: options.target.x,
		y: options.target.y
	};

	this.velocity = {
		x: 0,
		y: 0
	};

	this.dx = (this.target.x - this.x);
	this.dy = (this.target.y - this.y);
	this.mag = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

	this.boundingBox = aabb([this.x, this.y], [this.width, this.height]);

	/*
	Update the bullet position
	*/

	this.game.on("update", function (dt) {
		if (self.exists) {
			self.velocity.x = (self.dx / self.mag) * self.speed;
			self.velocity.y = (self.dy / self.mag) * self.speed;
			self.x += self.velocity.x;
			self.y += self.velocity.y;
			self.boundaries();
			self.boundingBox = aabb([self.x, self.y], [self.width, self.height]);
		}
	});

	/*
	Draw the bullet to the screen
	*/

	this.game.on("draw", function (context) {
		if (self.exists) {
			context.strokeStyle = self.color;
			context.strokeRect(
				self.x - self.width / 2,
				self.y - self.height / 2,
				self.width,
				self.height
			);
		}
	});
};

Bullet.prototype.boundaries = function () {
	if (this.x < 0) {
		this.remove();
	}

	if (this.y < 0) {
		this.remove();
	}

	if (this.x > this.game.width) {
		this.remove();
	}

	if (this.y > this.game.height) {
		this.remove();
	}
};
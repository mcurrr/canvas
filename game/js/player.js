module.exports = Player;

function Player (options) {
	var self = this;

	this.width = 20;
	this.height = 20;
	this.x = canvas.width/3;
	this.y = canvas.height/2;
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
	this.color = "#fff";
	this.speed = 5;
	this.friction = 0.95;
	this.ang = 0;
	this.angel = function () {
		if (this.ang < 360) {
			return this.ang++;
		}
		else {
			return this.ang = 0;
		}
	};

	this.velocity = {
		x: 0.9,
		y: 0.9
	};

	this.update = function (dt) {
		self.input();
		self.move();
		self.boundaries();
		self.angel();
	};

	this.draw = function (context) {
		context.save();
		context.translate(self.x + self.width/2, self.y + self.height/2);
		context.rotate(Math.PI/180 * self.ang);
		context.fillStyle = self.color;
		context.fillRect(-self.width/2, -self.height/2, self.width, self.height);
		context.restore();
	};
};

Player.prototype.move = function () {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.velocity.x *= this.friction;
	this.velocity.y *= this.friction;
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
};

Player.prototype.boundaries = function () {
	if (this.x <= 0) {
		this.x = 0;
	}

	if (this.y <= 0) {
		this.y = 0;
	}

	if (this.x >= canvas.width - this.width) {
		this.x = canvas.width - this.width;
	}

	if (this.y >= canvas.height - this.height) {
		this.y = canvas.height - this.height;
	}
};

Player.prototype.input = function () {
	if (37 in keys) {
		player.x -= player.speed;
		player.direction = "left";
	}
	if (39 in keys) {
		player.x += player.speed;
		player.direction = "right";
	}
	if (38 in keys) {
		player.y -= player.speed;
		player.direction = "up";
	}
	if (40 in keys) {
		player.y += player.speed;
		player.direction = "down";
	}
	if (37 in keys && 40 in keys) {
		player.direction = "left-down";
	}
	if (39 in keys && 40 in keys) {
		player.direction = "right-down";
	}
	if (37 in keys && 38 in keys) {
		player.direction = "left-up";
	}
	if (39 in keys && 38 in keys) {
		player.direction = "right-up";
	}
};
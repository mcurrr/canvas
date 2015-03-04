module.exports = BossBullet;
var u = 0;
var angle = 0;

function BossBullet (options) {
	var self = this;

	this.u = u++;
	this.angle = angle += 30; 
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.width = options.width || 6;
	this.height = options.height || 6;
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
	this.color = options.color || "#000";
	this.speed = options.speed || 20;

	this.velocity = {
		x: 0,
		y: 0
	};

	/*
	Update the bullet position
	*/

	this.update = function (dt) {
		self.velocity.x = Math.cos(self.angle) * self.speed;
		self.velocity.y = Math.cos(self.angle) * self.speed;
		self.x += self.velocity.x;
		self.y += self.velocity.y;
		self.X = self.x + self.width;
		self.Y = self.y + self.height;
		self.boundaries();
	};

	/*
	Draw the bullet to the screen
	*/

	this.draw = function (context) {
		context.fillStyle = self.color;
		context.fillRect(
			self.x - self.width / 2,
			self.y - self.height / 2,
			self.width,
			self.height
		);
	};
};

BossBullet.prototype.boundaries = function () {
	if (this.x < 0) {
		this.remove();
	}

	if (this.y < 0) {
		this.remove();
	}

	if (this.x > canvas.width) {
		this.remove();
	}

	if (this.y > canvas.height) {
		this.remove();
	}
};

BossBullet.prototype.remove = function () {
	var del = find(bossBullets, this);
	if (del != -1) {
		bossBullets.splice(bossBullets[del], 1);
	}
	else {
	}
};

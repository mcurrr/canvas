module.exports = Bullet;
var u = 0;

function Bullet (options) {
	var self = this;

	this.u = u++;
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.width = options.width || 6;
	this.height = options.height || 6;
	this.X = this.x + this.width;
	this.Y = this.y + this.height;
	this.color = options.color || "#fff";
	this.speed = options.speed || 10;

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

	/*
	Update the bullet position
	*/

	this.update = function (dt) {
		self.velocity.x = (self.dx / self.mag) * self.speed;
		self.velocity.y = (self.dy / self.mag) * self.speed;
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

Bullet.prototype.boundaries = function () {
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

Bullet.prototype.remove = function () {
	console.clear();
	statistic = 'Accuracy: ' + Math.floor(killed / (bullets[0].u + 1) * 100) + '%';
	console.log(statistic);
	var del = find(bullets, this);
	if (del != -1) {
		bullets.splice(bullets[del], 1);
	}
	else {
	}
};

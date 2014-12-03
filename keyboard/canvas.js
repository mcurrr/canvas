var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function Box(options) {
	this.x = options.x || 10;
	this.y = options.y || 10;
	this.width = options.width || 100;
	this.height = options.height || 100;
	this.color = options.color || "#000000";
	this.speed = options.speed || 5;
	this.direction = options.direction || "right";
};

var player = new Box ({
	x: 10,
	y: 10,
	width: 50,
	height: 50,
	color: "#000",
	speed: 5
});

var enemy = new Box ({
	x: randomNumber(0, canvas.width),
	y: randomNumber(0, canvas.height),
	width: 30,
	height: 30,
	color: "red",
});

var bullets = [];
var keys = {};

function randomNumber (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function input (player) {
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

	if (32 in keys) {
		bullets[bullets.length] = new Box ({
			x: player.x + player.width / 2,
			y: player.y + player.height / 2,
			width: 4,
			height: 4,
			color: "#000",
			speed: 10,
			direction: player.direction
		});
	}
};

function boundaries (box) {
	if (box.x <= 0) {
		box.x = 0;
	}
	if (box.x + box.width >= canvas.width) {
		box.x = canvas.width - box.width;
	}
	if (box.y <= 0) {
		box.y = 0;
	}
	if (box.y + box.height >= canvas.height) {
		box.y = canvas.height - box.height;
	}
};

function drawBox (box) {
	context.fillStyle = box.color;
	context.fillRect(box.x, box.y, box.width, box.height);
};

window.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
	console.log(player.direction);
	console.log(bullets[bullets.length-1].direction);
	e.preventDefault();
});

window.addEventListener("keyup", function(e) {
	delete keys[e.keyCode];
});

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawBox(player);
	drawBox(enemy);
	bullets.forEach(function(b) {
		drawBox(b);
	});
};

function update() {
	input(player);
	boundaries(player);
	bullets.forEach(function(b) {
		if (b.direction == "left") {
			b.x -= b.speed;
		}
		if (b.direction == "right") {
			b.x += b.speed;
		}
		if (b.direction == "up") {
			b.y -= b.speed;
		}
		if (b.direction == "down") {
			b.y += b.speed;
		}
		if (b.direction == "left-down") {
			b.y += b.speed;
			b.x -= b.speed;
		}
		if (b.direction == "right-down") {
			b.y += b.speed;
			b.x += b.speed;
		}
		if (b.direction == "left-up") {
			b.y -= b.speed;
			b.x -= b.speed;
		}
		if (b.direction == "right-up") {
			b.y -= b.speed;
			b.x += b.speed;
		}
	});
};

function loop() {
	update();
	draw();
	requestAnimationFrame(loop);
};

loop();
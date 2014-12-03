var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

function Box(options) {
	this.x = 900;
	this.y = 400;
	this.width = 100;
	this.height = 100;
};

var boxes = [];
var totalBoxes = 1000;

for (var i=0; i<totalBoxes; i++) {
	boxes[i] = new Box;
	boxes[i].color = randomColor(0, 255, 0, 255, 0, 255, .5);
}

function loop() {
	update();
	draw();
	requestAnimationFrame(loop);
};

function update() {
	boxes.forEach(function(box, i) {
		box.x += randomNumber(-5, 5);
		box.y += randomNumber(-5, 5);
	});
};

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	boxes.forEach(function(box, i) {
		context.fillStyle = box.color;
		context.fillRect(box.x, box.y, box.width, box.height);
	});
};

function randomNumber (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function randomColor (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = randomNumber(rmin, rmax);
	var g = randomNumber(gmin, gmax);
	var b = randomNumber(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};

loop();
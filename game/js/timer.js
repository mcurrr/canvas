module.exports = Timer;

function Timer (options) {
	var self = this;

	this.color = "rgba(0, 0, 0, 0.7)";
	this.start = new Date();
	this.total = 0;

	this.update = function () {
		self.now = new Date();
		self.playing = self.now - self.start + self.total;
	};

	this.formateTime = function () {
		self.milliseconds = Math.floor(new Date(self.playing).getMilliseconds() / 100);
		self.seconds = new Date(self.playing).getSeconds();
		if (self.seconds < 10) {self.seconds = '0' + self.seconds;}
		self.minutes = new Date(self.playing).getMinutes();
		if (self.minutes < 10) {self.minutes = '0' + self.minutes;}
		return self.minutes + ' : ' + self.seconds + ' . ' + self.milliseconds;
	};

	this.draw = function (context, canvas) {
		context.fillStyle = self.color;
		context.font = '80px sans-serif';
		context.shadowColor = '#000';
		context.shadowBlur = 15;
		context.shadowOffsetX = 20;
		context.shadowOffsetY = 20;
		context.fillText (self.formateTime(), canvas.width/2 - 150, canvas.height/2);
	};
};

Timer.prototype.pause = function() {
	this.total = this.playing;
	this.now = this.start;
};

Timer.prototype.unpause = function() {
	this.start = new Date();
	this.now = new Date();
};
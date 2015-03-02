module.exports = Timer;

function Timer (options) {
	var self = this;

	this.color = "#fff";
	this.start = new Date();

	this.update = function () {
		self.now = new Date();
		self.plaing = self.now - self.start;
	};

	this.formateTime = function () {
		self.milliseconds = Math.floor(new Date(self.plaing).getMilliseconds() / 100);
		self.seconds = new Date(self.plaing).getSeconds();
		if (self.seconds < 10) {self.seconds = '0' + self.seconds;}
		self.minutes = new Date(self.plaing).getMinutes();
		if (self.minutes < 10) {self.minutes = '0' + self.minutes;}
		return self.minutes + ' : ' + self.seconds + ' . ' + self.milliseconds;
	};

	this.draw = function (context) {
		context.fillStyle = self.color;
		context.font = '20px sans-serif';
		context.fillText (self.formateTime(), 10, 30);
	};
};
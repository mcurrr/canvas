module.exports = Common;

function Common() {};

Common.prototype.getDegrees = function () {
	var degrees = 0;
	this.vec.x = this.x - this.pre.x;
	this.vec.y = this.y - this.pre.y;
	degrees = (Math.asin(this.vec.y / Math.sqrt(this.vec.x * this.vec.x + this.vec.y * this.vec.y)) * 180 / Math.PI);

	if (this.vec.x > 0 && this.vec.y > 0) {
		degrees = degrees;
	}
		if (this.vec.x < 0 && this.vec.y > 0) {
		degrees = 180 - degrees;
	}
		if (this.vec.x < 0 && this.vec.y < 0) {
		degrees = 180 + (degrees * -1);
	}
		if (this.vec.x > 0 && this.vec.y < 0) {
		degrees = 360 - (degrees * -1);
	}
	return degrees;
};

Common.prototype.remove = function (arr) {
	var del = this.find(arr, this);
	if (del != -1) {
		arr.splice(del, 1);
	}
	else {
		console.log("imposibru!");
	}
};

Common.prototype.reload = function (arr, constr) {
	var del = this.find(arr, this);
	if (del != -1) {
		arr.splice(del, 1, arr[del] = new constr());
	}
	else {
		console.log('error!');
	}
};

Common.prototype.grow = function () {
	this.radius += 0.01;
};

Common.prototype.randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

Common.prototype.find = function (array, value) {
	for(var i=0; i<array.length; i++) {
		if (value !== undefined && array[i] !== undefined) {
			if (array[i].u == value.u) return i;
			}
		}
	return -1;
};

Common.prototype.randomColor = function (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
	var r = this.randomInt(rmin, rmax);
	var g = this.randomInt(gmin, gmax);
	var b = this.randomInt(bmin, bmax);
	return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
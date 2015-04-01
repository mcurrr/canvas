define('funcs', function() {

	function randomInt (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	function find(array, value) {
		for(var i=0; i<array.length; i++) {
			if (value !== undefined && array[i] !== undefined) {
				if (array[i].u == value.u) return i;
				}
			}
		return -1;
	};

	function randomColor (rmin, rmax, gmin, gmax, bmin, bmax, alpha) {
		var r = randomInt(rmin, rmax);
		var g = randomInt(gmin, gmax);
		var b = randomInt(bmin, bmax);
		return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
	};

});
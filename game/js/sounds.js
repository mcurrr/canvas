module.exports = Sound;

function Sound (maxSize) {
	var size = maxSize;

	this.init = function (objStr) {
		if (objStr == "bulletSound") {
			for (var i= 0; i < size; i++) {
				bulletSound = new Audio("./audio/shot.mp3");
				bulletSound.volume = 0.02;
				bulletSound.load();
				poolShot[i] = bulletSound;
			}
		}
		else if (objStr == "explosionSound") {
			for (var i= 0; i < size; i++) {
				explosionSound = new Audio("./audio/squish.mp3");
				explosionSound.volume = 0.2;
				explosionSound.load();
				poolSplash[i] = explosionSound;
			}
		}
	};
};
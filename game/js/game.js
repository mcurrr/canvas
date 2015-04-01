	Bullet = require("./bullet"),
	Enemy = require("./enemy"),
	Player = require("./player"),
	Timer = require("./timer"),
	Explode = require("./explode"),
	Sound = require("./sounds");

$(document).ready(function() {

	window.isItNewGame = true;
	window.stopped = true;
	var isMusicOff = false;
	var resizeEnd;
	var isSoundOff = false;
	window.checkAudio = 0;
	window.statistic = 0;
	window.killed = 0;
	window.missed = 0;
	window.winHeight = window.innerHeight;
	$('#canvas').css({'height': winHeight});

	$start = $('#canvasStart');
	$pause = $('#canvasPause');
	$pause.hide();
	$reset = $('#canvasReset');
	$reset.hide();
	$loading = $('#canvasLoading');
	$loading.hide();
	$musicBan = $('#musicBan');
	$musicBan.hide();
	$soundBan = $('#soundBan');
	$soundBan.hide();
	$infoModal = $('#canvasInfoModal');
	$killed = $('#canvasKilled');
	$accuracy = $('#canvasAccuracy');

	helpMsg = 'Welcome to upside down universe!' +
			  ' Use \'w\', \'s\', \'a\', \'d\' buttons and mouse clicks' + 
			  ' to protect your zombie from brain\'s attack.' + 
				' Don\'t let them get him! Stay \'alive\' for as long as it possible.';

	window.sizer = document.getElementById('canvas_size');
	window.width = sizer.offsetWidth;
	window.height = sizer.offsetHeight;
	window.canvas0 = document.getElementById("layer0");
	var context0 = canvas0.getContext("2d");
	window.canvas1 = document.getElementById("layer1");
	var context1 = canvas1.getContext("2d");
	window.canvas2 = document.getElementById("layer2");
	var context2 = canvas2.getContext("2d");

	function sizeCalculate() {
		width = sizer.offsetWidth;
		height = sizer.offsetHeight;
		canvas0.width = width;
		canvas0.height = height;
		canvas1.width = width;
		canvas1.height = height;
		canvas2.width = width;
		canvas2.height = height;
	};

	sizeCalculate();

	var img = new Image();
	img.src = './img/background.png';
	img.onload = function () {
		var pattern = context0.createPattern(img, 'repeat');
		window.drawLayer0 = function() {
			context0.fillStyle = pattern;
			context0.fillRect(0, 0, canvas0.width, canvas0.height);
		};
		drawLayer0();
	};

	window.init = function() {
		context1.clearRect(0, 0, canvas1.width, canvas1.height);
		context2.clearRect(0, 0, canvas2.width, canvas2.height);
		img.onload();
		isItNewGame = false;
		window.backgroundSound = new Audio('./audio/smooth_criminal.mp3');
		backgroundSound.load();
		backgroundSound.loop = true;
		backgroundSound.volume = .025;
		killed = 0;
		missed = 0;
		statistic = 0;
		window.keys = {};
		window.bullets = [];
		window.enemies = [];
		window.explodes = [];
		window.player = new Player ();
		window.poolShot = [];
		window.poolSplash = [];
		window.bulletSound = new Sound(20);
		bulletSound.init("bulletSound");
		window.explosionSound = new Sound(20);
		explosionSound.init("explosionSound");
		generateEnemies();
	};

	function hideGears() {
		$loading.hide();
		if (!isItNewGame) {
			if (!stopped) {
				canvasPause();
			}
			$pause.show();
		}
		else {
			$start.show();
		}
	};

	function generateEnemy () {
		enemies[enemies.length] = new Enemy ();
	};

	function generateEnemies () {
		for (var i = 0; enemies.length < 25; i++) {
			generateEnemy();
			for(var i=0; i<enemies.length; i++) {
				if (enemies[i].u != enemies[enemies.length - 1].u) {
					if(isColliding(enemies[i], enemies[enemies.length - 1])) {
						enemies.splice(enemies.length-1, 1);
					}
				}
			};
		};
	};

	function generateExplode (obj1, obj2) {
		if (obj1 instanceof Player) {
			var ang = 0;
		}
		else {
			var ang = obj2.getDegrees() - 45;
		}
		for (var i = 0; i < 20; i++) {
			if (obj1 instanceof Player) {
				ang += 18;
			}
			else {
				ang += 4.5;
			}
			explodes[explodes.length] = new Explode ({
				x: obj1.x,
				y: obj1.y,
				color: obj1.color,
				Oradius: obj1.radius,
				angle: ang
			});
		};
	};

	function getShotSound() {
		for (var i = 0; i < poolShot.length; i++) {
			if (poolShot[i].currentTime == 0 || poolShot[i].ended) {
				poolShot[i].play();
				return true;
			}
		}
	};

	function getExplosionSound() {
		for (var i = 0; i < poolSplash.length; i++) {
			if (poolSplash[i].currentTime == 0 || poolSplash[i].ended) {
				poolSplash[i].play();
				return true;
			}
		}
	};


	function isColliding(a, b) {
		var distX = a.centerX - b.centerX;
		var distY = a.centerY - b.centerY;
		var dist = Math.sqrt(distX * distX + distY * distY);
		if (dist <= a.radius + b.radius) {
			return true;
		}
		else {
			return false;
		}
	};

	function enemiesCollide(value) {
		for(var i=0; i<enemies.length; i++) {
			if (enemies[i] === undefined) {
				continue;
			}
			else {
				if (enemies[i].u == value.u) {
					continue;
				}
				else {
					if(isColliding(enemies[i], value)) {
						value.direction.x *= -1;
						value.direction.y *= -1;
						enemies[i].direction.x *= -1;
						enemies[i].direction.y *= -1;
					}
				}
			}
		};
	};

	function drawLayer1 () {
		explodes.forEach(function (explode) {
			if (explode !== undefined) {
				explode.draw(context1);
			}
		});
	};

	function drawLayer2 () {
		context2.clearRect(0, 0, canvas2.width, canvas2.height);
		if (player !== undefined) {
			player.draw(context2);
			bullets.forEach(function (bullet) {
				bullet.draw(context2);
			});
		}
		enemies.forEach(function (enemy) {
			if (enemy !== undefined) {
				enemy.draw(context2);
			}
		});
		explodes.forEach(function (explode) {
			if (explode !== undefined) {
				explode.draw(context2);
			}
		});
		timer.draw(context2, canvas2);
	};

	function update() {
		if (player !== undefined) {
			player.update();
			timer.update();
		}

		enemies.forEach(function (enemy) {
			if (player !== undefined && enemy !== undefined) {
				if (isColliding (player, enemy)) {
					generateExplode(player, enemy);
					if (!isSoundOff) {
						getExplosionSound();
					}
					player = undefined;
					bullets = undefined;
					isItNewGame = true;
					setTimeout(function() {
						stopped = true;
						backgroundSound.pause();
						backgroundSound.currentTime = 0;
						$pause.hide();
						$start.hide();
						$reset.show();
					}, 1000);
				}
				else {
				}
				if (bullets !== undefined) {
					bullets.forEach(function (bullet) {
						if (isColliding (bullet, enemy)) {
							++killed;
							if (!isSoundOff) {
								getExplosionSound();
							}
							bullet.remove(bullets);
							generateExplode(enemy, bullet);
							enemy.reload(enemies, Enemy);
						}
					});
				}
			}
			if (enemy !== undefined) {
				enemiesCollide (enemy);
				enemy.update();
			}
		});
		if (bullets !== undefined) {
			bullets.forEach(function (bullet) {
				bullet.update();
			});
		}
		if (explodes !== undefined) {
			explodes.forEach(function (explode) {
				if (explode !== undefined) {
					explode.update();
				}
			});
		}
	if (!killed) {
		statistic = 0;
	}
	else {
		statistic = (Math.round((killed / (killed + missed))*1000))/10;
	}
	$killed.text("Enemies killed: " + killed);
	$accuracy.text("Accuracy: " + statistic + "%");
	};

	function getMousePosition(canvas, e) {
		var rect = canvas.getBoundingClientRect();
			return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	};

	function checkReadyState () {
		if (backgroundSound.readyState === 4) {
			window.clearInterval(checkAudio);
			$loading.hide();
			window.timer = new Timer();
			if (!isMusicOff) {
				backgroundSound.play();
			}
			loop();
		}
	};

	window.loop = function() {
		if (!stopped) {
			update();
			drawLayer1();
			drawLayer2();
			requestAnimationFrame(loop);
		}
	};

	/*---------------------------------------------------------------------
							CONTROLS
	--------------------------------------------------------------------*/

	window.canvasStart = function() {
		$pause.hide();
		$reset.hide();
		$start.hide();
		if (stopped) {
			if (isItNewGame) {
				init();
				$loading.show();
				checkAudio = window.setInterval(function() {
					checkReadyState()
				}, 1000);
				stopped = false;
			}
			else {
				if (!isMusicOff) {
					backgroundSound.play();
				}
				timer.unpause();
				stopped = false;
				loop();
			}
		}
	};

	window.canvasPause = function() {
		if (!isItNewGame) {
			if (stopped) {
				canvasStart();
				timer.unpause();
			}
			else {
				stopped = true;
				timer.pause();
				if (!isMusicOff) {
					backgroundSound.pause();
				}
			$pause.show();
			}
			console.log('pause');
		}
	};

	window.canvasReset = function() {
		if (!stopped) {
			canvasPause();
		}
		$pause.hide();
		$reset.hide();
		$start.show();
		context1.clearRect(0, 0, canvas1.width, canvas1.height);
		context2.clearRect(0, 0, canvas2.width, canvas2.height);
		isItNewGame = true;
	};

	window.canvasMusicOff = function() {
		if (isMusicOff) {
			isMusicOff = false;
			backgroundSound.play();
		}
		else {
			isMusicOff = true;
			if (!!checkAudio) {
				backgroundSound.pause();
			}
		}
		$musicBan.toggle();
	};

	window.canvasSoundOff = function() {
		if (isSoundOff) {
			isSoundOff = false;
		}
		else {
			isSoundOff = true;
		}
		$soundBan.toggle();
	};

	/*===============================================================
					TRIGGERS
	===============================================================*/

	window.addEventListener("keydown", function(e) {
		keys[e.keyCode] = true;
	});

	window.addEventListener("keyup", function(e) {
		delete keys[e.keyCode];
	});

	canvas2.addEventListener("mousedown", function (e) {
		if (player !== undefined) {
			if (!stopped) {
				bullets[bullets.length] = new Bullet({
					x: player.x + player.width / 2,
					y: player.y + player.height / 2,
					target: getMousePosition(canvas0, e)
				});
				if (!isSoundOff) {
					getShotSound();
				}
			}
		}
	});

	window.addEventListener('resize', function() {
		$loading.show();
		$reset.hide();
		if (!isItNewGame) {
			if (!stopped) {
				canvasPause();
			}
			$pause.hide();
		}
		else {
			$start.hide();
		}
		winHeight = window.innerHeight;
		$('#canvas').css({'height': winHeight});
		sizeCalculate();
		drawLayer0();
		clearTimeout(resizeEnd);
		resizeEnd = setTimeout(hideGears, 200);
	});
});
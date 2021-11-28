const player1 = {
	name: 'Player One',
	score: 0,
	button: document.querySelector("#p1Button"),
	display: document.querySelector("#p1Display"),
	gameCount: 0,
	gameDisplay: document.querySelector("#p1GameDisplay"),
	setCount: 0,
	setDisplay: document.querySelector('#p1SetsDisplay'),
	newName: document.querySelector('#p1Name'),
	nameGame: document.querySelector('#p1NameGame'),
	nameSets: document.querySelector('#p1NameSets')

};

const player2 = {
	name: 'Player Two',
	score: 0,
	button: document.querySelector("#p2Button"),
	display: document.querySelector("#p2Display"),
	gameCount: 0,
	gameDisplay: document.querySelector("#p2GameDisplay"),
	setCount: 0,
	setDisplay: document.querySelector('#p2SetsDisplay'),
	newName: document.querySelector('#p2Name'),
	nameGame: document.querySelector('#p2NameGame'),
	nameSets: document.querySelector('#p2NameSets')
};

const resetButton = document.querySelector("#reset");
const resetGamesButton = document.querySelector("#resetGames");
const resetSetsButton = document.querySelector('#resetSets')
const playTo = document.querySelector("#playTo");
const winBy2Box = document.querySelector("#winBy2");
const gameCountOff = document.querySelector("#gameCountOff");
const gameCountOn = document.querySelector("#gameCountOn");
const gameCountCol = document.querySelector(".game-count-col");
const customPlayTo = document.querySelector("#customPlayTo");
const padelModeOn = document.querySelector("#padelModeOn");
const padelModeOff = document.querySelector("#padelModeOff");
const padelSetsContainer = document.querySelector('#padelSetsContainer');
const playingToDisplay = document.querySelectorAll('.playing-to');
const note = document.querySelector('.note');
const image = document.querySelector('img');
const defaults = document.querySelector('#defaults');

let winningScore = 5;
let winningGames = 6;
const padelScores = [0, 15, 30, 40, "game"];
const padelScoresDeuce = [0, 15, 30, 40, 'A', 'game'];
let isGameOver = false;
let winBy2 = false;
let padelMode = false;
let deuce = false;

const fireworksEle = document.querySelector("body");
const fireworks = new Fireworks(fireworksEle, {});


// Core game functionality
function updateScores(player, opponent) {
	if (!isGameOver) {
		player.score++;

		if (padelMode) {
			if (!deuce) {
				winningScore = 4;
				player.display.textContent = padelScores[player.score];
			}
			else {
				player.display.textContent = padelScoresDeuce[player.score];
				if (player.score === winningScore) {
					win(player, opponent);
				}
			}
			if (player.score === winningScore && !deuce) {
				win(player, opponent);
				player.display.textContent = padelScores[player.score];
			}
			else if (player.score === winningScore - 1 && player.score === opponent.score) {
				deuce = true;
				winningScore = 5;
				player1.score = 3;
				player2.score = 3;
				player.display.textContent = padelScoresDeuce[player.score];
				opponent.display.textContent = padelScoresDeuce[opponent.score];

			}
		}
		else {
			if (player.score === winningScore) {
				win(player, opponent);
			}
			else if (winBy2 === true) {
				if (player.score === winningScore - 1 && player.score === opponent.score) {
					winningScore++;
				}
			}

			player.display.textContent = player.score;
		}
	}
}

player1.button.addEventListener("click", function () {
	updateScores(player1, player2);
});

player2.button.addEventListener("click", function () {
	updateScores(player2, player1);
});

function win(player, opponent) {
	isGameOver = true;
	player.display.classList.add("has-text-success");
	opponent.display.classList.add("has-text-danger");
	player.button.disabled = true;
	opponent.button.disabled = true;
	player.display.textContent = player.score;
	player.gameCount++;
	player.gameDisplay.textContent = player.gameCount;
	if (padelMode) {
		padelWin(player, opponent);
	}
	else {
		fireworks.start();
	}
}

resetButton.addEventListener("click", reset);

// Score card reset
function reset() {
	isGameOver = false;
	deuce = false;

	for (let p of [player1, player2]) {
		if (padelMode && p.gameCount === 6) {
			gameCountReset();
		}
		if (padelMode && p.setCount === 2) {
			setCountReset();
		}

		p.score = 0;
		p.display.textContent = p.score;
		p.display.classList.remove("has-text-success", "has-text-danger");
		p.button.disabled = false;
		if (playTo.disabled === true) {
			winningScore = parseInt(customPlayTo.value);
		}
		else {
			winningScore = parseInt(playTo.value);
		}
	}


	fireworks.stop();
}

playTo.addEventListener("change", function () {
	winningScore = parseInt(this.value);
	reset();
});

// Additional settings and options

winBy2Box.addEventListener("change", function () {
	if (winBy2Box.checked === true) {
		winBy2 = true;
	}
	else {
		winBy2 = false;
	}
	reset();
});

resetGamesButton.addEventListener("click", gameCountReset);

// reset game count
function gameCountReset() {
	for (let p of [player1, player2]) {
		p.gameCount = 0;
		p.gameDisplay.textContent = p.gameCount;
	}
	reset();
}

resetSetsButton.addEventListener('click', setCountReset);

// reset sets in padel mode
function setCountReset() {
	for (let p of [player1, player2]) {
		p.setCount = 0;
		p.setDisplay.textContent = p.setCount;
	}
	gameCountReset();
}

gameCountOff.addEventListener("change", function () {
	gameCountReset();
	gameCountCol.classList.add("is-invisible");
});

gameCountOn.addEventListener("change", function () {
	gameCountReset();
	gameCountCol.classList.remove("is-invisible");
});

customPlayTo.addEventListener("input", function () {
	reset();
	winningScore = parseInt(this.value);
	if (!winningScore) {
		winningScore = parseInt(playTo.value);
		playTo.disabled = false;
	} else {
		playTo.disabled = true;
	}
});

padelModeOn.addEventListener("change", function () {
	let answer = confirm("Initiate padel mode?");
	if (!answer) {
		padelModeOff.checked = true;
		return;
	}
	padelMode = true;
	playTo.disabled = true;
	customPlayTo.disabled = true;
	gameCountReset();
	padelSetsContainer.classList.remove("is-hidden");
	gameCountOff.disabled = true;
	gameCountOn.disabled = true;
	winBy2Box.disabled = true;
	note.textContent = 'Note: Settings disabled in padel mode.';
	resetButton.classList.remove('is-danger');
	resetButton.classList.add('is-warning');
	resetButton.textContent = 'Next/ Reset';
	playingToDisplay.forEach(element => {
		element.classList.add('is-hidden');
	});
	image.classList.add('img-change');
	image.src = "Images/padel.jpg";
	setTimeout(() => {
		image.classList.remove('img-change');
	}, 4000);
});

padelModeOff.addEventListener("change", function () {
	restoreDefaults();
	image.classList.add('img-change');
	image.src = "Images/scoreKeeper.jpg";
	setTimeout(() => {
		image.classList.remove('img-change');
	}, 4000);
});

function padelWin(player, opponent) {
	if (deuce) {
		player.display.textContent = padelScoresDeuce[player.score];
	}
	else if (player.gameCount === winningGames) {
		player.setCount++;
		player.setDisplay.textContent = player.setCount;
		winningGames = 6;
		if (player.setCount === 2) {
			fireworks.start();
			if (!player.newName.value) {
				alert(`${player.name} wins!`);
			} else {
				alert(`${player.newName.value} wins!`);
			}
		}
	}
	else if (player.gameCount === winningGames - 1 && player.gameCount === opponent.gameCount) {
		winningGames = 7;
	}
}

// Edit player names
player1.newName.addEventListener("input", function () {
	nameChange(player1);
});

player2.newName.addEventListener("input", function () {
	nameChange(player2);
});


function nameChange(player) {
	if (player.newName.value === '') {
		player.button.textContent = `+1 ${player.name}`;
		player.nameGame.textContent = player.name;
		player.nameSets.textContent = player.name;
	} else {
		player.button.textContent = `+1 ${player.newName.value}`;
		player.nameGame.textContent = player.newName.value;
		player.nameSets.textContent = player.newName.value;
	}
}

defaults.addEventListener("click", restoreDefaults);

function restoreDefaults() {
	padelMode = false;
	playTo.disabled = false;
	customPlayTo.disabled = false;
	customPlayTo.value = null;
	gameCountOff.disabled = false;
	gameCountOn.disabled = false;
	winBy2Box.disabled = false;
	winBy2Box.checked = false;
	playTo.value = 5;
	winningScore = parseInt(playTo.value);
	gameCountOn.checked = true;
	gameCountCol.classList.remove("is-invisible");
	note.textContent = 'Note: changing settings will reset current game.';
	padelSetsContainer.classList.add("is-hidden");
	resetButton.classList.remove('is-warning');
	resetButton.classList.add('is-danger');
	resetButton.textContent = 'Reset';
	playingToDisplay.forEach(element => {
		element.classList.remove('is-hidden');
	});
	gameCountReset();
}

// keyboard functionality
document.addEventListener('keydown', function (e) {
	if (e.key === 'ArrowRight') {
		updateScores(player2, player1);
	}
	else if (e.key === 'ArrowLeft') {
		updateScores(player1, player2);
	}
	else if (e.key === 'Shift') {
		reset();
	}
})


// NOTE: Stopwatch code below taken and used with permission from https://code-boxx.com/simple-javascript-stopwatch/
// Minor additions and modifications made to create the switch button and associated functionality- see comments below
var sw = {
	// (A) INITIALIZE
	etime: null, // HTML time display
	erst: null, // HTML reset button
	ego: null, // HTML start/stop button
	// Switch button modification
	eswitchButton: null,

	init: function () {
		// (A1) GET HTML ELEMENTS
		sw.etime = document.getElementById("sw-time");
		sw.erst = document.getElementById("sw-rst");
		sw.ego = document.getElementById("sw-go");
		// Switch button modification
		sw.eswitchButton = document.querySelector("#switchButton");

		// (A2) ENABLE BUTTON CONTROLS
		sw.erst.addEventListener("click", sw.reset);
		sw.erst.disabled = false;
		sw.ego.addEventListener("click", sw.start);
		sw.ego.disabled = false;
		// Switch button modification
		sw.eswitchButton.addEventListener("click", sw.switchButton);
		sw.eswitchButton.disabled = false;
	},

	// (B) TIMER ACTION
	timer: null, // timer object
	now: 0, // current elapsed time
	tick: function () {
		// (B1) CALCULATE HOURS, MINS, SECONDS
		sw.now++;
		var remain = sw.now;
		var hours = Math.floor(remain / 3600);
		remain -= hours * 3600;
		var mins = Math.floor(remain / 60);
		remain -= mins * 60;
		var secs = remain;

		// (B2) UPDATE THE DISPLAY TIMER
		if (hours < 10) {
			hours = "0" + hours;
		}
		if (mins < 10) {
			mins = "0" + mins;
		}
		if (secs < 10) {
			secs = "0" + secs;
		}
		sw.etime.innerHTML = hours + ":" + mins + ":" + secs;
	},

	// (C) START!
	start: function () {
		sw.timer = setInterval(sw.tick, 1000);
		sw.ego.value = "Stop";
		sw.ego.removeEventListener("click", sw.start);
		sw.ego.addEventListener("click", sw.stop);
	},

	// (D) STOP
	stop: function () {
		clearInterval(sw.timer);
		sw.timer = null;
		sw.ego.value = "Start";
		sw.ego.removeEventListener("click", sw.stop);
		sw.ego.addEventListener("click", sw.start);
	},

	// (E) RESET
	reset: function () {
		if (sw.timer != null) {
			sw.stop();
		}
		sw.now = -1;
		sw.tick();
	},

	// Switch button modification
	switchButton: function () {
		sw.reset();
		sw.start();
	},
};
window.addEventListener("load", sw.init);

let tournamentPlayers = [];
let tournamentRounds = [];

// Variables Speed Speedy
let speedyPlayerCount = 3;
let speedyMaxImage = 30;
let speedyScores = [];
let currentSpeedyImage = null;
let speedyCountdownInterval = null;
let speedyCountdownValue = 0;
let isSpeedyWaiting = false;

function goTo(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function clearSpeedyCountdown() {
  if (speedyCountdownInterval) {
    clearInterval(speedyCountdownInterval);
    speedyCountdownInterval = null;
  }
  speedyCountdownValue = 0;
  isSpeedyWaiting = false;
  const countdownEl = document.getElementById("speedyCountdown");
  if (countdownEl) countdownEl.style.display = "none";
}

function leaveSpeedyGame() {
  clearSpeedyCountdown();
  goTo("modeJeux");
}

/**************************
- MODE SPEED SPEEDY (CHRONO 3, 2, 1 ENTRE CHAQUE IMAGE)
 **************************/
function startSpeedyGame(playerCount, maxImage, titleText) {
  clearSpeedyCountdown();
  speedyPlayerCount = playerCount;
  speedyMaxImage = maxImage;
  speedyScores = Array(playerCount).fill(0);
  currentSpeedyImage = null;

  document.getElementById("speedyTitle").textContent = titleText;

  const startBtn = document.getElementById("speedyStartBtn");
  const startHint = document.getElementById("speedyStartHint");
  const imgEl = document.getElementById("speedyCardImage");

  if (playerCount === 4) {
    startBtn.style.display = "block";
    startBtn.textContent = "Démarrer";
    startBtn.disabled = false;
    imgEl.style.display = "none";
    startHint.style.display = "block";
  } else {
    startBtn.style.display = "none";
    startHint.style.display = "none";
    showRandomSpeedyImageNow();
  }

  renderSpeedyPlayers();
  goTo("pageSpeedyGame");
}

function showRandomSpeedyImageNow() {
  let nextNum = Math.floor(Math.random() * speedyMaxImage) + 1;
  if (nextNum === currentSpeedyImage && speedyMaxImage > 1) {
    nextNum = (nextNum % speedyMaxImage) + 1;
  }
  currentSpeedyImage = nextNum;

  const imgEl = document.getElementById("speedyCardImage");
  const countdownEl = document.getElementById("speedyCountdown");
  const startHint = document.getElementById("speedyStartHint");

  countdownEl.style.display = "none";
  if (startHint) startHint.style.display = "none";
  imgEl.src = `${nextNum}.png`;
  imgEl.alt = `Image ${nextNum}`;
  imgEl.style.display = "block";
}

function startThreeSecondCountdown() {
  clearSpeedyCountdown();
  isSpeedyWaiting = true;
  speedyCountdownValue = 3;
  renderSpeedyPlayers();

  const imgEl = document.getElementById("speedyCardImage");
  const countdownEl = document.getElementById("speedyCountdown");
  const startHint = document.getElementById("speedyStartHint");
  const startBtn = document.getElementById("speedyStartBtn");

  if (startHint) startHint.style.display = "none";
  if (speedyPlayerCount === 4 && startBtn) {
    startBtn.disabled = true;
  }

  imgEl.style.display = "none";
  countdownEl.style.display = "flex";
  countdownEl.textContent = String(speedyCountdownValue);

  speedyCountdownInterval = setInterval(() => {
    speedyCountdownValue--;
    if (speedyCountdownValue > 0) {
      countdownEl.textContent = String(speedyCountdownValue);
    } else {
      clearSpeedyCountdown();
      showRandomSpeedyImageNow();
      if (speedyPlayerCount === 4 && startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Image suivante";
      }
      renderSpeedyPlayers();
    }
  }, 1000);
}

function triggerSpeedy4Image() {
  if (isSpeedyWaiting) return;
  startThreeSecondCountdown();
}

function awardPointTo(playerIndex) {
  if (speedyPlayerCount === 4) {
    speedyScores[playerIndex]++;
    renderSpeedyPlayers();
    return;
  }

  if (isSpeedyWaiting) return;
  speedyScores[playerIndex]++;
  startThreeSecondCountdown();
}

function renderSpeedyPlayers() {
  const listEl = document.getElementById("speedyPlayersList");
  listEl.innerHTML = "";

  for (let i = 0; i < speedyPlayerCount; i++) {
    const label = `J${i + 1}`;
    const fullLabel = `Joueur ${i + 1}`;
    const pts = speedyScores[i] || 0;

    const row = document.createElement("div");
    row.className = "speedy-player-row";

    const info = document.createElement("div");
    info.className = "speedy-player-info";
    info.innerHTML = `<strong title="${fullLabel}">${label}</strong><span>${pts}</span>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "speedy-point-btn";
    btn.textContent = "+1";
    btn.disabled = speedyPlayerCount !== 4 && isSpeedyWaiting;
    btn.onclick = () => awardPointTo(i);

    row.appendChild(info);
    row.appendChild(btn);
    listEl.appendChild(row);
  }
}

/**************************
- AUTRES (PDF / TOURNOI)
 **************************/
function openPDF() { window.open("regles.pdf", "_blank"); }

function startTournament() {
  let num = parseInt(prompt("Nombre de joueurs (3 à 8) ?"));
  if (isNaN(num) || num < 3 || num > 8) return alert("Nombre invalide");
  tournamentPlayers = [];
  for (let i = 0; i < num; i++) tournamentPlayers.push(prompt("Nom joueur " + (i + 1)));
  tournamentPlayers.sort(() => Math.random() - 0.5);
  if (tournamentPlayers.length % 2 === 1) tournamentPlayers.unshift(tournamentPlayers.pop());
  generateBracket(tournamentPlayers);
}

function generateBracket(players) {
  goTo("tournament");
  tournamentRounds = [];
  let firstRound = [];
  for (let i = 0; i < players.length; i += 2) firstRound.push([players[i], players[i + 1] || ""]);
  tournamentRounds.push(firstRound);
  let matches = firstRound.length;
  while (matches > 1) {
    matches = Math.ceil(matches / 2);
    let round = [];
    for (let i = 0; i < matches; i++) round.push(["", ""]);
    tournamentRounds.push(round);
  }
  renderBracket();
}

function renderBracket() {
  const container = document.getElementById("tournamentBracket");
  container.innerHTML = "";
  tournamentRounds.forEach((round, rIdx) => {
    const roundDiv = document.createElement("div");
    roundDiv.className = "round";
    round.forEach((match, mIdx) => {
      const matchDiv = document.createElement("div");
      matchDiv.className = "match";
      match.forEach((team, tIdx) => {
        const teamDiv = document.createElement("div");
        teamDiv.className = "team";
        teamDiv.textContent = team || "—";
        teamDiv.onclick = () => selectWinner(rIdx, mIdx, tIdx);
        matchDiv.appendChild(teamDiv);
      });
      roundDiv.appendChild(matchDiv);
    });
    container.appendChild(roundDiv);
  });
}

function selectWinner(rIdx, mIdx, tIdx) {
  const winner = tournamentRounds[rIdx][mIdx][tIdx];
  if (!winner || rIdx + 1 >= tournamentRounds.length) {
    if (winner) alert("Vainqueur du tournoi : " + winner);
    return;
  }
  tournamentRounds[rIdx + 1][Math.floor(mIdx / 2)][mIdx % 2] = winner;
  renderBracket();
}
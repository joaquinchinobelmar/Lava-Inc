// ¿Quién lava la loza? — lógica principal: participantes, sorteo, historial y pantallas.
import { loadList, saveList } from './js/storage.js';
import { drawWheel, spinWheel } from './js/wheel.js';
import { initIntro } from './js/intro.js';
import { drawSprite, SCREAM_FACE, SCREAM_PALETTE } from './js/pixelart.js';
import * as sound from './js/sounds.js';

const DEFAULT_PARTICIPANTS = ['Cristóbal', 'Chino', 'Mauricio', 'Denis', 'Paul', 'Mikey', 'Jeff', 'Tristán'];
const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 12; // más que esto y los nombres no caben en la ruleta
const HISTORY_SHOWN = 10;    // cuántos sorteos recientes se muestran
const SUSPENSE_PAUSE = 700;  // ms de silencio antes del susto
const SCREAMER_DURATION = 1400;

const TAUNTS = [
  'LA ESPONJA TE ESPERA...',
  'LA LOZA NO SE LAVA SOLA, PO',
  'LA OLLA DEL ARROZ PEGADO ES TODA TUYA',
  'SE TE VIENE UNA NOCHE LARGA, CABRO',
  'EL DESTINO HA HABLADO. Y HUELE A CLORO.',
  'NI LLORANDO TE SALVAS',
  'PONTE LOS GUANTES, CAMPEÓN',
  'TUS COMPAÑEROS TE AGRADECEN TU SACRIFICIO',
];

// Referencias a los elementos del HTML
const el = {
  app: document.getElementById('app'),
  wheel: document.getElementById('wheel'),
  spinBtn: document.getElementById('spin-btn'),
  muteBtn: document.getElementById('mute-btn'),
  addForm: document.getElementById('add-form'),
  nameInput: document.getElementById('name-input'),
  formError: document.getElementById('form-error'),
  participantList: document.getElementById('participant-list'),
  scoreboard: document.getElementById('scoreboard'),
  historyList: document.getElementById('history-list'),
  clearHistoryBtn: document.getElementById('clear-history-btn'),
  screamer: document.getElementById('screamer'),
  screamerFace: document.getElementById('screamer-face'),
  result: document.getElementById('result'),
  resultName: document.getElementById('result-name'),
  resultTaunt: document.getElementById('result-taunt'),
  resultClose: document.getElementById('result-close'),
};

const state = {
  participants: loadParticipants(),
  history: loadList('history', []).filter((entry) => entry && typeof entry.name === 'string'),
  spinning: false,
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

// ---------- Participantes ----------

function loadParticipants() {
  const saved = loadList('participants', []).filter((name) => typeof name === 'string');
  return saved.length >= MIN_PARTICIPANTS ? saved : [...DEFAULT_PARTICIPANTS];
}

// Devuelve un mensaje de error, o '' si se pudo agregar
function addParticipant(rawName) {
  const name = rawName.trim();
  if (!name) return 'ESCRIBE UN NOMBRE';
  if (state.participants.length >= MAX_PARTICIPANTS) return `MÁXIMO ${MAX_PARTICIPANTS} JUGADORES`;
  if (isDuplicate(name)) return 'ESE YA ESTÁ EN LA RULETA';
  state.participants.push(name);
  saveList('participants', state.participants);
  return '';
}

function isDuplicate(name) {
  return state.participants.some((p) => p.toLowerCase() === name.toLowerCase());
}

function removeParticipant(index) {
  if (state.spinning || state.participants.length <= MIN_PARTICIPANTS) return;
  state.participants.splice(index, 1);
  saveList('participants', state.participants);
  sound.playRemove();
  renderGame();
}

function handleAddSubmit(event) {
  event.preventDefault();
  if (state.spinning) return;
  const error = addParticipant(el.nameInput.value);
  el.formError.textContent = error;
  if (error) return;
  el.nameInput.value = '';
  sound.playAdd();
  renderGame();
}

function renderParticipants() {
  const canRemove = state.participants.length > MIN_PARTICIPANTS && !state.spinning;
  const items = state.participants.map((name, i) => createParticipantItem(name, i, canRemove));
  el.participantList.replaceChildren(...items);
}

function createParticipantItem(name, index, canRemove) {
  const item = document.createElement('li');
  item.className = 'participant';
  const label = document.createElement('span');
  label.textContent = name; // textContent (no innerHTML) para que un nombre raro no rompa la página
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'X';
  removeBtn.disabled = !canRemove;
  removeBtn.setAttribute('aria-label', `Quitar a ${name}`);
  removeBtn.addEventListener('click', () => removeParticipant(index));
  item.append(label, removeBtn);
  return item;
}

// ---------- Ruleta ----------

function renderGame() {
  renderParticipants();
  drawWheel(el.wheel, state.participants);
  el.spinBtn.disabled = state.spinning || state.participants.length < MIN_PARTICIPANTS;
}

// Vuelve a dibujar la ruleta cuando carga la fuente pixelada (si no, los nombres salen con otra letra)
function drawWheelWhenFontReady() {
  drawWheel(el.wheel, state.participants);
  document.fonts?.load('8px "Press Start 2P"')
    .then(() => drawWheel(el.wheel, state.participants))
    .catch(() => {});
}

function setSpinning(value) {
  state.spinning = value;
  el.app.classList.toggle('is-spinning', value);
  el.nameInput.disabled = value;
  el.clearHistoryBtn.disabled = value;
  renderGame();
}

async function handleSpin() {
  if (state.spinning || state.participants.length < MIN_PARTICIPANTS) return;
  setSpinning(true);
  sound.playClick();
  const names = [...state.participants];
  const loser = names[await spinWheel(el.wheel, names)];
  recordLoss(loser);
  await wait(SUSPENSE_PAUSE);
  await showScreamer();
  showResult(loser);
}

// ---------- Historial ----------

function recordLoss(name) {
  state.history.push({ name, date: new Date().toISOString() });
  saveList('history', state.history);
  renderHistory();
}

// Cuenta cuántas veces perdió cada uno, de más a menos: [['Paul', 3], ['Jeff', 1]]
function countLosses() {
  const counts = {};
  state.history.forEach(({ name }) => {
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function renderHistory() {
  renderScoreboard();
  renderHistoryList();
}

function renderScoreboard() {
  const ranking = countLosses();
  if (!ranking.length) {
    el.scoreboard.replaceChildren(createEmptyRow('NADIE HA PERDIDO... TODAVÍA'));
    return;
  }
  const rows = ranking.map(([name, count], i) => createRow(`${i === 0 ? '👑 ' : ''}${name}`, `${count}`));
  el.scoreboard.replaceChildren(...rows);
}

function renderHistoryList() {
  const recent = state.history.slice(-HISTORY_SHOWN).reverse(); // el más nuevo primero
  if (!recent.length) {
    el.historyList.replaceChildren(createEmptyRow('SIN SORTEOS AÚN'));
    return;
  }
  el.historyList.replaceChildren(...recent.map(({ name, date }) => createRow(name, formatDate(date))));
}

function createRow(left, right) {
  const row = document.createElement('li');
  const leftSpan = document.createElement('span');
  const rightSpan = document.createElement('span');
  leftSpan.textContent = left;
  rightSpan.textContent = right;
  row.append(leftSpan, rightSpan);
  return row;
}

function createEmptyRow(text) {
  const row = document.createElement('li');
  row.className = 'empty';
  row.textContent = text;
  return row;
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString('es-CL', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

function clearHistory() {
  if (!confirm('¿BORRAR TODO EL HISTORIAL? Los pecados quedarán olvidados.')) return;
  state.history = [];
  saveList('history', state.history);
  renderHistory();
}

// ---------- Screamer y pantalla del perdedor ----------

async function showScreamer() {
  el.screamer.hidden = false;
  sound.playScream();
  await wait(SCREAMER_DURATION);
  el.screamer.hidden = true;
}

function showResult(name) {
  el.resultName.textContent = name;
  el.resultTaunt.textContent = randomItem(TAUNTS);
  el.result.hidden = false;
  el.resultClose.focus();
  sound.playNooo();
  sound.playSadTrombone(1.3);
}

function closeResult() {
  el.result.hidden = true;
  setSpinning(false);
  el.spinBtn.focus();
}

function handleMute() {
  const muted = sound.toggleMute();
  el.muteBtn.textContent = muted ? '🔇' : '🔊';
  el.muteBtn.setAttribute('aria-pressed', String(muted));
}

// ---------- Inicio ----------

function init() {
  drawSprite(el.screamerFace, SCREAM_FACE, SCREAM_PALETTE);
  el.spinBtn.addEventListener('click', handleSpin);
  el.addForm.addEventListener('submit', handleAddSubmit);
  el.clearHistoryBtn.addEventListener('click', clearHistory);
  el.resultClose.addEventListener('click', closeResult);
  el.muteBtn.addEventListener('click', handleMute);
  renderGame();
  renderHistory();
  initIntro(() => {
    el.app.hidden = false;
    drawWheelWhenFontReady();
  });
}

init();

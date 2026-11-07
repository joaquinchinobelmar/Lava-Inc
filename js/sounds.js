// Efectos de sonido 8 bits generados con la Web Audio API del navegador (sin archivos).
// La onda "square" (cuadrada) es el sonido típico de las consolas antiguas.

const NOTES = {
  E4: 329.63, F4: 349.23, FS4: 369.99, G4: 392.0,
  C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5,
};

// Un WAV de silencio cortísimo (10 ms), escrito en base64 para no necesitar un archivo
const SILENT_WAV = 'data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==';

let audioCtx = null;
let masterGain = null; // volumen general (sirve para silenciar)
let muted = false;
let silentLoop = null; // se guarda aquí para que el navegador no lo borre mientras suena

// Los celulares bloquean el audio hasta que el usuario toca la pantalla,
// por eso esto se llama en el "TOCA PARA EMPEZAR" y cada vez que se gira la ruleta.
export function unlockAudio() {
  if (!audioCtx) {
    ignoreSilentSwitch();
    createContext();
  }
  // En iPhone el estado puede ser "suspended" o "interrupted" (ej: después de bloquear la pantalla)
  if (audioCtx && audioCtx.state !== 'running') audioCtx.resume();
}

// En iPhone, si el botón lateral de silencio está activado, Safari calla la Web Audio API.
// Pidiendo el modo "playback" (como un video) el sonido sale igual.
function ignoreSilentSwitch() {
  if (navigator.audioSession) {
    navigator.audioSession.type = 'playback'; // iOS 16.4 o más nuevo
    return;
  }
  // Truco para iPhones más antiguos: mientras suena un <audio> (aunque sea silencio), iOS usa el modo "playback"
  silentLoop = new Audio(SILENT_WAV);
  silentLoop.loop = true;
  silentLoop.play().catch(() => {});
}

function createContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
}

export function toggleMute() {
  muted = !muted;
  if (masterGain) masterGain.gain.value = muted ? 0 : 1;
  return muted;
}

// Toca una nota. "slideTo" hace que la nota se deslice a otra frecuencia (efecto "boing").
function playTone({ freq, start = 0, duration = 0.1, type = 'square', volume = 0.15, slideTo, destination = masterGain }) {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime + start;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(t0);
  osc.stop(t0 + duration);
}

// Ruido blanco (como la estática de la tele), para el grito del screamer
function playNoise({ start = 0, duration = 0.5, volume = 0.3, destination = masterGain }) {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime + start;
  const length = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  source.connect(gain);
  gain.connect(destination);
  source.start(t0);
}

// Toca una lista de notas seguidas: [['C5', duración], ...]
function playMelody(notes, start = 0, type = 'square') {
  let time = start;
  notes.forEach(([note, length]) => {
    playTone({ freq: NOTES[note], start: time, duration: length * 0.9, type });
    time += length;
  });
}

export function playIntroJingle(start = 0) {
  playMelody([['C5', 0.15], ['E5', 0.15], ['G5', 0.15], ['C6', 0.3], ['G5', 0.15], ['C6', 0.6]], start);
}

export function playBoing(start = 0) {
  playTone({ freq: 150, slideTo: 700, duration: 0.3, start, volume: 0.12 });
}

export function playClick() {
  playTone({ freq: 880, duration: 0.06, volume: 0.1 });
}

export function playTick() {
  playTone({ freq: 1400, duration: 0.03, volume: 0.05 });
}

export function playAdd() {
  playTone({ freq: 400, slideTo: 1200, duration: 0.15, volume: 0.1 });
}

export function playRemove() {
  playTone({ freq: 600, slideTo: 100, duration: 0.25, volume: 0.1 });
}

// Chillido con vibrato: un segundo oscilador (LFO) mueve la frecuencia arriba y abajo muy rápido,
// así suena como una garganta gritando y no como un pito.
function playShriek({ freq, slideTo, duration, type, volume, destination }) {
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const lfo = audioCtx.createOscillator();
  const lfoDepth = audioCtx.createGain();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration * 0.25); // sube de golpe
  lfo.frequency.value = 25;  // 25 temblores por segundo
  lfoDepth.gain.value = 120; // cuántos Hz sube y baja
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.setValueAtTime(volume, t0 + duration * 0.8); // se mantiene fuerte casi hasta el final
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  lfo.connect(lfoDepth);
  lfoDepth.connect(osc.frequency);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(t0);
  lfo.start(t0);
  osc.stop(t0 + duration);
  lfo.stop(t0 + duration);
}

// Distorsión: "aplasta" la onda contra el máximo, como un parlante reventado.
// Así todo suena al volumen más alto posible sin pasarse.
function createDistortion(amount) {
  const shaper = audioCtx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1; // de -1 a 1
    curve[i] = Math.tanh(amount * x);
  }
  shaper.curve = curve;
  shaper.connect(masterGain);
  return shaper;
}

// El grito del screamer: chillidos + rugido grave + estática, todo distorsionado. ¡Fuerte a propósito!
export function playScream(duration = 1.4) {
  if (!audioCtx) return;
  const scream = createDistortion(6);
  playNoise({ duration, volume: 0.7, destination: scream });
  playShriek({ freq: 600, slideTo: 2200, duration, type: 'sawtooth', volume: 0.6, destination: scream });
  playShriek({ freq: 850, slideTo: 3000, duration, type: 'square', volume: 0.5, destination: scream });
  playTone({ freq: 180, slideTo: 70, duration, type: 'sawtooth', volume: 0.6, destination: scream }); // rugido de demonio
}

// Un "¡NOOO!" robótico que va bajando
export function playNooo() {
  playTone({ freq: 500, slideTo: 110, duration: 1.1, type: 'sawtooth', volume: 0.2 });
  playTone({ freq: 505, slideTo: 112, duration: 1.1, type: 'square', volume: 0.1 });
}

// Trombón triste: "wa, wa, wa, waaaa"
export function playSadTrombone(start = 0) {
  playMelody([['G4', 0.4], ['FS4', 0.4], ['F4', 0.4], ['E4', 1.2]], start, 'sawtooth');
}

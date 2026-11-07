// Efectos de sonido 8 bits generados con la Web Audio API del navegador (sin archivos).
// La onda "square" (cuadrada) es el sonido típico de las consolas antiguas.

const NOTES = {
  E4: 329.63, F4: 349.23, FS4: 369.99, G4: 392.0,
  C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5,
};

let audioCtx = null;
let masterGain = null; // volumen general (sirve para silenciar)
let muted = false;

// Los celulares bloquean el audio hasta que el usuario toca la pantalla,
// por eso esto se llama en el "TOCA PARA EMPEZAR".
export function unlockAudio() {
  if (!audioCtx) createContext();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
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
function playTone({ freq, start = 0, duration = 0.1, type = 'square', volume = 0.15, slideTo }) {
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
  gain.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + duration);
}

// Ruido blanco (como la estática de la tele), para el grito del screamer
function playNoise({ start = 0, duration = 0.5, volume = 0.3 }) {
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
  gain.connect(masterGain);
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

// El grito del screamer: estática + chillido que sube. ¡Fuerte a propósito!
export function playScream() {
  playNoise({ duration: 1.2, volume: 0.6 });
  playTone({ freq: 900, slideTo: 2000, duration: 1.2, type: 'sawtooth', volume: 0.4 });
  playTone({ freq: 950, slideTo: 1800, duration: 1.2, type: 'square', volume: 0.3 });
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

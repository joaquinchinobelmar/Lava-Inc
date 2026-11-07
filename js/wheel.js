// Ruleta dibujada en un canvas chico que el CSS agranda → se ve pixelada, estilo 8 bits.
import { playTick } from './sounds.js';

const TWO_PI = Math.PI * 2;
const SPIN_DURATION = 5500; // ms que dura el giro
const MIN_TURNS = 5;        // vueltas completas antes de frenar
const BULB_COUNT = 24;      // ampolletas del borde, tipo show de TV

// Colores de los gajos (paleta tipo consola antigua) con el color de texto que se lee mejor encima
const COLORS = [
  { fill: '#e40058', text: '#fcfcfc' },
  { fill: '#fcbc3c', text: '#000000' },
  { fill: '#00b800', text: '#000000' },
  { fill: '#3cbcfc', text: '#000000' },
  { fill: '#f878f8', text: '#000000' },
  { fill: '#f83800', text: '#fcfcfc' },
  { fill: '#6844fc', text: '#fcfcfc' },
  { fill: '#58f898', text: '#000000' },
];

let rotation = 0; // ángulo actual de la ruleta, en radianes

// "mod" que siempre da positivo (el % de JavaScript puede dar negativos)
const mod = (n, m) => ((n % m) + m) % m;

// Frena fuerte al final: da suspenso
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export function drawWheel(canvas, names) {
  const ctx = canvas.getContext('2d');
  const center = canvas.width / 2;
  const radius = center - 16;
  const slice = TWO_PI / names.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRim(ctx, center, radius);
  names.forEach((name, i) => {
    // -PI/2 para que el primer gajo empiece arriba, donde está la flecha
    const startAngle = rotation + i * slice - Math.PI / 2;
    drawSlice(ctx, { center, radius, startAngle, slice, color: colorFor(i, names.length), name });
  });
  drawHub(ctx, center);
  drawPixelTriangle(ctx, center, 0, 12, '#000000');
  drawPixelTriangle(ctx, center, 2, 9, '#f83800');
}

// Evita que el último gajo quede del mismo color que el primero (están pegados)
function colorFor(index, total) {
  const isLast = index === total - 1;
  const sameAsFirst = index % COLORS.length === 0;
  return COLORS[(isLast && sameAsFirst && index > 0 ? index + 1 : index) % COLORS.length];
}

function drawRim(ctx, center, radius) {
  fillCircle(ctx, center, radius + 8, '#000000');
  fillCircle(ctx, center, radius + 6, '#c88400');
  // Las ampolletas se prenden y apagan mientras la ruleta gira
  const phase = Math.floor(rotation * 3) % 2;
  for (let i = 0; i < BULB_COUNT; i++) {
    const angle = (i / BULB_COUNT) * TWO_PI;
    const x = Math.round(center + Math.cos(angle) * (radius + 3));
    const y = Math.round(center + Math.sin(angle) * (radius + 3));
    ctx.fillStyle = i % 2 === phase ? '#fcfcfc' : '#fcbc3c';
    ctx.fillRect(x - 2, y - 2, 4, 4);
  }
}

function drawSlice(ctx, { center, radius, startAngle, slice, color, name }) {
  ctx.beginPath();
  ctx.moveTo(center, center);
  ctx.arc(center, center, radius, startAngle, startAngle + slice);
  ctx.closePath();
  ctx.fillStyle = color.fill;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000000';
  ctx.stroke();

  // Nombre escrito desde el borde hacia el centro
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(startAngle + slice / 2);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = color.text;
  ctx.fillText(name.toUpperCase(), radius - 10, 1);
  ctx.restore();
}

function drawHub(ctx, center) {
  fillCircle(ctx, center, 14, '#000000');
  fillCircle(ctx, center, 10, '#fcbc3c');
}

function fillCircle(ctx, center, radius, color) {
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, TWO_PI);
  ctx.fillStyle = color;
  ctx.fill();
}

// Flecha de arriba hecha con rectángulos, para que se vea "pixelada"
function drawPixelTriangle(ctx, centerX, top, halfWidth, color) {
  ctx.fillStyle = color;
  for (let row = 0; row < halfWidth; row++) {
    ctx.fillRect(centerX - halfWidth + row, top + row * 2, (halfWidth - row) * 2, 2);
  }
}

// Qué gajo está debajo de la flecha con cierta rotación
function indexAtPointer(angle, slice) {
  return Math.floor(mod(-angle, TWO_PI) / slice);
}

// Elige al perdedor al azar y anima la ruleta hasta que la flecha quede en su gajo.
// Devuelve una Promise con el índice del perdedor.
export function spinWheel(canvas, names) {
  const slice = TWO_PI / names.length;
  const loserIndex = Math.floor(Math.random() * names.length);
  // Un poco de azar dentro del gajo para que no caiga siempre justo al medio
  const offset = (Math.random() - 0.5) * slice * 0.8;
  const targetAngle = mod(-(loserIndex + 0.5) * slice - offset, TWO_PI);
  const start = rotation;
  const end = start + MIN_TURNS * TWO_PI + mod(targetAngle - start, TWO_PI);

  return new Promise((resolve) => {
    const startTime = performance.now();
    let lastIndex = indexAtPointer(start, slice);

    function frame(now) {
      const progress = Math.min((now - startTime) / SPIN_DURATION, 1);
      rotation = start + (end - start) * easeOutQuart(progress);
      drawWheel(canvas, names);

      // "tic" cada vez que la flecha pasa a otro gajo
      const currentIndex = indexAtPointer(rotation, slice);
      if (currentIndex !== lastIndex) {
        playTick();
        lastIndex = currentIndex;
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        rotation = mod(rotation, TWO_PI);
        resolve(loserIndex);
      }
    }
    requestAnimationFrame(frame);
  });
}

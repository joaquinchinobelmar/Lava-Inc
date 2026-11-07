// Pantalla de inicio: "LAVA-INC" en 8 bits con la esponja saltando (unos 4 segundos).
import { drawSprite, SPONGE, SPONGE_PALETTE } from './pixelart.js';
import { unlockAudio, playBoing, playIntroJingle } from './sounds.js';

const INTRO_DURATION = 4000; // ms que dura la animación después de tocar
const EXIT_DURATION = 400;   // ms del fundido de salida (igual que en style.css)
const BOUNCES = 3;           // "boings" sincronizados con los saltos de la esponja

export function initIntro(onFinish) {
  const intro = document.getElementById('intro');
  drawSprite(document.getElementById('intro-sponge'), SPONGE, SPONGE_PALETTE);

  const start = () => startIntro(intro, onFinish);
  intro.addEventListener('click', start, { once: true });
  intro.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') intro.click();
  });
  intro.focus();
}

function startIntro(intro, onFinish) {
  unlockAudio(); // tiene que ser justo después del toque, si no el celular no deja sonar
  intro.classList.add('playing');
  for (let i = 0; i < BOUNCES; i++) playBoing(i);
  playIntroJingle(2.4);
  setTimeout(() => finishIntro(intro, onFinish), INTRO_DURATION);
}

function finishIntro(intro, onFinish) {
  intro.classList.add('leaving');
  setTimeout(() => {
    intro.hidden = true;
    onFinish();
  }, EXIT_DURATION);
}

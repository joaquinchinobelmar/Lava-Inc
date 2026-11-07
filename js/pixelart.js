// Dibujos pixel art hechos con texto: cada letra es un color y cada "." es transparente.

// Esponja de cocina con cara (parte verde arriba = la parte que raspa)
export const SPONGE = [
  '.KKKKKKKKKKKKKK.',
  'KGGGGGGGGGGGGGGK',
  'KGgGGGgGGGGgGGGK',
  'KKKKKKKKKKKKKKKK',
  'KYYYYYYYYYYYOYYK',
  'KYOYYYYYYYYYYYYK',
  'KYYWWWYYYYWWWYYK',
  'KYYWKWYYYYWKWYYK',
  'KYYWWWYYOYWWWYYK',
  'KYPPYYYYYYYYPPYK',
  'KYYKYYYYYYYYKYYK',
  'KYYYKRRRRRRKYYYK',
  'KYOYYKRRRRKYYYYK',
  'KYYYYYKKKKYYYOYK',
  'KYYOYYYYYYYYYYYK',
  '.KKKKKKKKKKKKKK.',
];

export const SPONGE_PALETTE = {
  K: '#000000', // contorno
  G: '#00b800', // parte que raspa
  g: '#007800', // textura de la parte que raspa
  Y: '#fcbc3c', // esponja
  O: '#c88400', // hoyitos de la esponja
  W: '#fcfcfc', // ojos
  P: '#f878f8', // mejillas
  R: '#e40058', // boca
};

// Cara terrorífica para el screamer
export const SCREAM_FACE = [
  '....KKKKKKKK....',
  '..KKSSSSSSSSKK..',
  '.KSSSSSSSSSSSSK.',
  'KSSSSSSSSSSSSSSK',
  'KSKKKKSSSSKKKKSK',
  'KSKKRKSSSSKRKKSK',
  'KSKKKKSSSSKKKKSK',
  'KSSKKSSSSSSKKSSK',
  'KSSSSSSKKSSSSSSK',
  'KSSKKKKKKKKKKSSK',
  'KSKWKWKWKWKWKKSK',
  'KSKKKKKKKKKKKKSK',
  'KSKRKKKKKKKKRKSK',
  'KSKKWKWKWKWKWKSK',
  '.KSSKKKKKKKKSSK.',
  '..KKSSSSSSSSKK..',
];

export const SCREAM_PALETTE = {
  K: '#000000', // ojos y boca
  S: '#b8f8b8', // piel verde zombie
  R: '#f80000', // pupilas y sangre
  W: '#fcfcfc', // dientes
};

// Pinta un sprite en un canvas: 1 píxel del canvas = 1 letra del dibujo.
// El CSS lo agranda con "image-rendering: pixelated" para que se vea en 8 bits.
export function drawSprite(canvas, sprite, palette) {
  canvas.width = sprite[0].length;
  canvas.height = sprite.length;
  const ctx = canvas.getContext('2d');
  sprite.forEach((row, y) => {
    [...row].forEach((code, x) => {
      if (!palette[code]) return;
      ctx.fillStyle = palette[code];
      ctx.fillRect(x, y, 1, 1);
    });
  });
}

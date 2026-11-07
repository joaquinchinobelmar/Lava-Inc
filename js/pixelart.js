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

// Cara del screamer: niña poseída en 32x32 (pelo enmarañado, ojos amarillos, cortes y vómito verde)
export const SCREAM_FACE = [
  '..........HHHHHHHHHHHH..........',
  '.......HHHHHHhHHHHHHhHHHHH......',
  '.....HHHHHhHHHHHHHHHHHHhHHHH....',
  '....HHHHhHHHHHHHHHHHHHHHHhHHH...',
  '...HHHhHHHHHHSSHHSSSHHHHHHhHHH..',
  '...HHhHHHHHSSSSHSSSSSSHHHHHhHH..',
  '..HHHhHHHHSSSSSSSSSRSSSHHHHhHHH.',
  '..HHhHHHHSSSSSSSSSRSSSSSHHHHhHH.',
  '..HHhHHHSSSSSSSSSRSSSSSSSHHHhHH.',
  '..HhHHHHSDDDDDSSSSSSDDDDDSHHHhH.',
  '.HHhHHHHDDDDDDDSSSDDDDDDDDHHHhHH',
  '.HHhHHHHDDYYKYDSsSDYKYYDDDHHHhHH',
  '.HhHHHHHDYYYYYYDsDYYYYYYDHHHHhHH',
  '.HhHHHHHDYYYYRYDsDYRYYYYDHHHhHHH',
  '.HhHHHHHSDDYYYDSsSDYYYDDSHHHhHHH',
  '.HhHHHHHSRDDDDSSsSSDDDDSSHHHHhHH',
  '.HhHHHHHSSRSSSSssSSSSSSRSHHHHhHH',
  'HHhHHHHHSSSRSSKssKSSSSRSSHHHHhHH',
  'HHhHHHHHSsSSRSSSSSSSSSRSsHHHHhHH',
  'HhHHHHHHSsSSrrrrrrrrrrSSsHHHHHhH',
  'HhHHHHHHSsSrrKTKTKTKTrrSsHHHHHhH',
  'HhHHHHHHSsSrKKKKKKKKKKrSsHHHHHhH',
  'HhHHHHHHSssrKKKKKKKKKKrssHHHHHhH',
  'HhHHHHHHSssrKKKKKKKKKKrssHHHHhHH',
  'HHhHHHHHHSsrKKTKTKTKTKrsSHHHHhHH',
  '.HhHHHHHHSSrrrGGGGGrrrSSHHHHhHH.',
  '.HhHHHHHHHSSSsGGgGGSsSSHHHHHhHH.',
  '.HhHHHHHHHHSSsSGgGGsSSHHHHHHhHH.',
  '..HhHHH.HHHHSSSGGgSSSHHHH.HHhH..',
  '..HhHH..HHH.HH.GgG.HHHHH..HHhH..',
  '..HH.H...H.....GG...H.H...H.HH..',
  '...H.H.........G.....H.......H..',
];

export const SCREAM_PALETTE = {
  H: '#2a1608', // pelo
  h: '#5a3418', // mechas del pelo
  S: '#c4c8a0', // piel pálida
  s: '#8c9070', // sombras de la piel
  D: '#3c2440', // ojeras
  Y: '#e8e078', // ojos amarillos
  K: '#000000', // pupilas, nariz y boca
  R: '#c00020', // cortes
  r: '#600818', // labios
  T: '#d8cc98', // dientes
  G: '#88c000', // vómito verde
  g: '#4c7000', // vómito oscuro
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

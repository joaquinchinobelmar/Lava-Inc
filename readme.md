# ¿Quién lava la loza? 🍽️ — by LAVA-INC

Web app dramática en **estilo 8 bits** para decidir quién del depa lava la loza.
Una ruleta gira con suspenso, aparece un **screamer** 😱 y después la pantalla con la víctima.
Proyecto de práctica para la DurHack 2026.

🔗 **Demo:** _(pendiente: link de Vercel)_

## Qué hace
- **Intro animada** de LAVA-INC con una esponja pixel art (unos 4 s). Se toca la pantalla para empezar, porque los celulares no dejan sonar audio sin un toque.
- **Ruleta** con desaceleración, ampolletas y "tic" en cada gajo.
- Vienen 8 jugadores por defecto: Cristóbal, Chino, Mauricio, Denis, Paul, Mikey, Jeff y Tristán. Se pueden agregar y quitar (mínimo 2, máximo 12).
- **Screamer** al elegir al perdedor (⚠️ suena fuerte; hay botón 🔊/🔇 para silenciar).
- Pantalla dramática con el nombre del perdedor, una frase de burla, un "¡NOOO!" y un trombón triste.
- **Historial**: marcador de derrotas ("Salón de la vergüenza") y últimos 10 sorteos con fecha.
- Todo se guarda en `localStorage` (si falla, la app igual funciona).
- Sonidos 8 bits generados con la Web Audio API, sin archivos de audio.

## Cómo correrlo
Hay que usar un servidor local, porque los módulos de JavaScript no funcionan abriendo `index.html` con doble clic:
```
python3 -m http.server 8000
```
y abrir http://localhost:8000

## Estructura
```
index.html      estructura de la página
style.css       estilos 8 bits y animaciones
app.js          lógica principal: participantes, sorteo, historial, pantallas
js/wheel.js     dibujo y giro de la ruleta (canvas)
js/intro.js     pantalla de inicio
js/sounds.js    efectos de sonido (Web Audio API)
js/pixelart.js  sprites de la esponja y del screamer
js/storage.js   guardar/leer en localStorage
```

Fuente: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts).

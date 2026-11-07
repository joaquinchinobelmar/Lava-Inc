# CLAUDE.md — ¿Quién lava la loza? 🍽️

## Qué es este proyecto
Una web app chistosa y dramática para decidir quién del depa lava la loza (o cualquier otra tarea).
Una ruleta gira con suspenso exagerado, elige a la "víctima" y guarda un historial de quién ha perdido más veces.

Es un proyecto de práctica para la **DurHack 2026**. Lo hacemos dos personas en pocas horas, así que la prioridad es:
1. Que funcione y se pueda jugar en el demo.
2. Que sea divertido y se vea bien.
3. Que el código sea simple de entender para los dos.

## Stack
- **HTML + CSS + JavaScript vanilla.** Sin frameworks ni build step.
- Sin backend: el historial se guarda en `localStorage`.
- Deploy en **Vercel** como sitio estático, conectado al repo de GitHub. Cada push a `main` despliega solo.
- **No agregar dependencias** (npm, librerías, CDNs) sin preguntar primero.

## Estructura
```
/
├── index.html      # estructura de la página
├── style.css       # estilos y animaciones
├── app.js          # lógica: participantes, ruleta, historial
├── sounds/         # efectos de sonido (opcional)
├── README.md       # descripción, capturas y link de Vercel
└── CLAUDE.md
```
Si `app.js` pasa de unas 300 líneas, se puede dividir en módulos ES (`<script type="module">`).

## Funcionalidades

### MVP (lo primero, en este orden)
1. Agregar y quitar participantes por nombre (mínimo 2).
2. Botón grande **"¿QUIÉN LAVA?"** que hace girar una ruleta (canvas o CSS) con desaceleración.
3. Al detenerse: pantalla dramática con el nombre del perdedor.
4. Historial: lista de sorteos con fecha y un marcador de cuántas veces perdió cada uno.
5. Todo persiste en `localStorage` (participantes + historial). Si `localStorage` falla, la app igual funciona sin guardar.

### Extras (solo cuando el MVP esté listo y deployado)
- Sonido de redoble mientras gira y un "¡NOOO!" al final.
- Frases de burla aleatorias para el perdedor ("La esponja te espera…").
- Modo **"Justicia"**: el que ha perdido menos veces tiene más probabilidad de salir.
- Botón para cambiar la tarea (loza, basura, baño…).
- Botón "Compartir resultado" que copia un texto al portapapeles.
- Confeti 🎉 para los que se salvaron.

## Estilo y tono
- Exagerado, dramático y con humor, tipo show de televisión.
- Textos de la interfaz en **español** (chileno se permite: "cabros", "la loza", etc.).
- Mobile first: tiene que verse bien en celular, porque el demo probablemente será en uno.
- Botones grandes y colores fuertes. Usar variables CSS en `:root` para los colores.

## Convenciones de código
- Nombres de variables y funciones en inglés (`spinWheel`, `addParticipant`). Comentarios en español.
- Funciones cortas, una responsabilidad cada una.
- Nada de código muerto ni `console.log` olvidados en `main`.
- Envolver lecturas y escrituras de `localStorage` en `try/catch`.

## Flujo de Git (practicamos como en la hackathon)
- Nunca commitear directo a `main`. Trabajar en ramas: `feat/ruleta`, `feat/historial`, `fix/...`.
- Commits chicos con mensajes claros en español: `feat: agrega historial de sorteos`.
- Abrir Pull Request y revisar la URL de preview que genera Vercel antes de hacer merge.
- Antes de empezar algo nuevo: `git pull` en `main`.

## Cómo probar localmente
Abrir `index.html` en el navegador, o levantar un servidor simple:
```
npx serve .
```
o
```
python3 -m http.server 8000
```

## Instrucciones para Claude
- Antes de cambios grandes, explica brevemente el plan y espera confirmación.
- Prioriza el MVP. No implementes extras si el MVP no está terminado.
- Haz cambios chicos y fáciles de revisar; un PR por funcionalidad.
- Explica el código de forma simple: uno de nosotros estudia ingeniería mecánica y está aprendiendo.
- Si algo puede romper el deploy en Vercel, avisa.
- Mantén el `README.md` al día cuando agregues funcionalidades.
// Guardar y leer listas en localStorage.
// Todo va en try/catch: si el navegador no deja guardar (modo incógnito, etc.), la app sigue funcionando.

const PREFIX = 'lavainc.';

export function loadList(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFIX + key));
    return Array.isArray(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

export function saveList(key, list) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(list));
  } catch {
    // Sin guardado: la app funciona igual, solo que no recuerda al recargar
  }
}

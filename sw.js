// Service worker : le jeu se joue sans réseau, et prend toujours la dernière version quand il y en a.
// - à l'installation, tout le jeu est mis en cache (la version et la liste des fichiers sont écrites par outils/construire.mjs) ;
// - ensuite, le réseau d'abord : chaque fichier est redemandé (vérification rapide, le serveur répond « inchangé » si
//   rien n'a bougé) et le cache est rafraîchi ; sans réseau, ou s'il tarde plus de 3 s, le cache répond.
const VERSION = "ffd6f1bf3029";
const FICHIERS = ["./","index.html","jeu.js","styles.css","images/decor/scene.png","images/logo/logo.png","images/roto/r-coup-leger.png","images/roto/r-garde.png","images/roto/r-marche.png","images/roto/r-estoc.png","images/roto/r-parade.png","images/roto/r-saut.png","images/roto/r-coup-fort.png","images/roto/r-touche.png","images/roto/r-mort.png","images/roto/r-sa-garde.png","images/roto/r-sa-attaque.png","images/roto/r-la-garde.png","images/roto/r-la-marche.png","images/roto/r-la-attaque.png","images/roto/r-la-touche.png","images/roto/r-la-mort.png","images/roto/r-ni-garde.png","images/roto/r-ni-course.png","images/roto/r-ni-lancer.png","images/roto/r-ni-bond.png","images/roto/r-ni-touche.png","images/roto/r-ni-mort.png","images/roto/r-sa-marche.png","images/roto/r-sa-touche.png","images/roto/r-sa-mort.png","icones/icone-180.png","icones/icone-192.png","icones/icone-512.png","icones/icone-masquable-512.png","manifest.webmanifest"];
const CACHE = 'lady-snowblood-' + VERSION;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((cles) => Promise.all(cles.filter((c) => c.startsWith('lady-snowblood-') && c !== CACHE).map((c) => caches.delete(c))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(servir(r));
});

const trop = (ms) => new Promise((_, non) => setTimeout(() => non(new Error('réseau trop lent')), ms));
async function servir(r) {
  const c = await caches.open(CACHE);
  try {
    const reponse = await Promise.race([fetch(r.url, { cache: 'no-cache', credentials: 'same-origin' }), trop(3000)]);
    if (reponse.ok) { c.put(r.url, reponse.clone()); return reponse; }
  } catch {}
  // hors ligne : le cache ; une ouverture de page (même avec #acte=2…) reçoit la page du jeu
  return (await c.match(r.url, { ignoreSearch: true }))
    || (r.mode === 'navigate' && await c.match('index.html'))
    || Response.error();
}

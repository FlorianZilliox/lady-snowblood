// Service worker : le jeu se joue sans réseau, et prend toujours la dernière version quand il y en a.
// - à l'installation, tout le jeu est mis en cache (la version et la liste des fichiers sont écrites par outils/construire.mjs) ;
// - ensuite, le réseau d'abord : chaque fichier est redemandé (vérification rapide, le serveur répond « inchangé » si
//   rien n'a bougé) et le cache est rafraîchi ; sans réseau, ou s'il tarde plus de 3 s, le cache répond.
const VERSION = "62bfb1961c1b";
const FICHIERS = ["./","index.html","jeu.js","styles.css","images/decor/scene.png","images/effets/e-k-coupes.png","images/effets/e-k-combo2.png","images/effets/e-k-final.png","images/effets/e-k-estoc.png","images/effets/e-k-balayage.png","images/gundam/g-r-garde.png","images/gundam/g-r-garde-titre.png","images/gundam/g-r-marche.png","images/gundam/g-r-course.png","images/gundam/g-r-coup-leger.png","images/gundam/g-r-k-combo2.png","images/gundam/g-r-k-coupe-epaule.png","images/gundam/g-r-revers.png","images/gundam/g-r-estoc.png","images/gundam/g-r-estoc-fort.png","images/gundam/g-r-k-balayage.png","images/gundam/g-r-k-final.png","images/gundam/g-r-coup-fort.png","images/gundam/g-r-plonge-fin.png","images/gundam/g-r-k-fort.png","images/gundam/g-r-bond-coupe.png","images/gundam/g-r-k-montante.png","images/gundam/g-r-k-pied-tournant.png","images/gundam/g-r-k-dash-coupe.png","images/gundam/g-r-k-haute.png","images/gundam/g-r-moulinet.png","images/gundam/g-r-k-pied.png","images/gundam/g-r-k-coup-poing.png","images/gundam/g-r-poing-direct.png","images/gundam/g-r-k-saut.png","images/gundam/g-r-k-salto.png","images/gundam/g-r-k-saute-coupe.png","images/gundam/g-r-k-pied-saute.png","images/gundam/g-r-k-chute.png","images/gundam/g-r-mort.png","images/gundam/g-r-touche.png","images/gundam/g-r-k-releve.png","images/gundam/g-r-k-releve-final.png","images/gundam/g-r-k-charge.png","images/gundam/g-r-parade.png","images/interface/portrait-boss.png","images/logo/logo.png","images/proto/r-w-garde.png","images/proto/r-w-pret.png","images/proto/r-w-marche.png","images/proto/r-w-ruee.png","images/proto/r-w-lourd.png","images/proto/r-w-fente.png","images/proto/r-w-droit.png","images/proto/r-w-pied.png","images/proto/r-w-accroupie.png","images/proto/r-w-tornade.png","images/proto/r-w-saut.png","images/proto/r-w-retombee.png","images/proto/r-w-intro.png","images/proto/r-w-bloc.png","images/proto/r-w-touche.png","images/proto/r-w-souleve.png","images/proto/r-w-chute.png","images/proto/r-w-mort1.png","images/proto/r-w-mort2.png","images/proto/r-w-gisant.png","images/proto/r-w-victoire.png","images/roto/r-coup-leger.png","images/roto/r-garde.png","images/roto/r-marche.png","images/roto/r-estoc.png","images/roto/r-parade.png","images/roto/r-saut.png","images/roto/r-coup-fort.png","images/roto/r-touche.png","images/roto/r-mort.png","images/roto/r-sa-garde.png","images/roto/r-sa-attaque.png","images/roto/r-ni-garde.png","images/roto/r-ni-course.png","images/roto/r-ni-lancer.png","images/roto/r-ni-bond.png","images/roto/r-ni-touche.png","images/roto/r-ni-mort.png","images/roto/r-sa-marche.png","images/roto/r-sa-touche.png","images/roto/r-sa-mort.png","images/roto/r-k-garde.png","images/roto/r-k-marche.png","images/roto/r-k-course.png","images/roto/r-k-coupes.png","images/roto/r-k-chute.png","images/roto/r-k-releve.png","images/roto/r-k-saut.png","images/roto/r-k-salto.png","images/roto/r-k-pied.png","images/roto/r-k-pied-saute.png","images/roto/r-k-combo2.png","images/roto/r-k-final.png","images/roto/r-k-montante.png","images/roto/r-k-haute.png","images/roto/r-k-charge.png","images/roto/r-k-saute-coupe.png","images/roto/r-k-balayage.png","images/roto/r-k-dash-coupe.png","images/roto/r-k-fort.png","images/roto/r-k-estoc.png","images/roto/r-k-coupe-epaule.png","images/roto/r-k-pied-tournant.png","images/roto/r-k-releve-final.png","images/roto/r-k-coup-poing.png","images/roto/r-f-marche.png","images/roto/r-f-course.png","images/roto/r-f-garde.png","images/roto/r-f-coupe1.png","images/roto/r-f-coupe3.png","images/roto/r-f-chute.png","images/roto/r-f-releve.png","images/roto/r-b-marche.png","images/roto/r-b-course.png","images/roto/r-b-garde.png","images/roto/r-b-lancer.png","images/roto/r-b-coup.png","images/roto/r-b-chute.png","images/roto/r-b-mort.png","images/roto/r-f-coupe2.png","images/roto/r-f-envol.png","images/roto/r-f-grande-coupe.png","images/roto/r-f-parade.png","images/roto/r-f-pied.png","images/roto/r-f-poings.png","images/roto/r-f-revers.png","images/roto/r-x-arc.png","images/roto/r-x-garde.png","images/roto/r-x-course.png","images/roto/r-x-grande-griffe.png","images/roto/r-x-foreuse.png","images/roto/r-x-chute.png","images/roto/r-x-marche.png","images/roto/r-x-griffe.png","images/roto/r-x-tourbillon.png","images/roto/r-x-rafale.png","images/roto/r-x-pied.png","images/roto/r-x-plongeon.png","images/roto/r-x-touche.png","images/roto/r-x-releve.png","images/roto/r-x-intro.png","images/roto/r-x-marche2.png","icones/icone-180.png","icones/icone-192.png","icones/icone-512.png","icones/icone-masquable-512.png","manifest.webmanifest"];
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

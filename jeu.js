// src/js/etat.js
var J = {};

// src/js/config.js
var ESSAI = /#essai/.test(location.hash);
var ARENE = 704;
var DECOR_HAUT = 20;
var SOL = 301;
var GRAVITE = 1450;
var ENCRE = "#050505";
var OS = "#f2f1ec";
var BRUME = "#8a8a86";
var SANG = ["#2a0306", "#5c0710", "#8e0c18", "#b8141f", "#dc2a2a"];
var PV_MAX = 7;
var SOIN_TOUS = 25;
var FUREUR_PAR_MORT = 0.14;
var FUREUR_PAR_PARADE = 0.2;
var HEROINE = { vitesse: 90, saut: 520, reculParade: 64 };
var ANIMS = {
  "r-garde": { ips: 6, boucle: "aller-retour" },
  // le dessin unique de repos (respire) ; la garde de Kagetsura : voir r-k-garde
  "r-k-garde": { cadence: [7, 7, 7, 7, 7, 7, 7, 7, 7], boucle: true },
  // les 9 images de la garde de Kagetsura : elle respire, le sabre bouge
  "r-marche": { ips: 10, boucle: true },
  // foulée ≈ 9 px par image : 10 images/s × 9 = 90 px/s, les pieds ne glissent pas
  "r-course": { ips: 14, boucle: true },
  // la chaîne de la planche de Kagetsura : coupe (X) → deuxième coupe (X X) → coupe haute (X X X) → finale (X X X X)
  "r-coup-leger": { cadence: [2, 3, 3, 3, 3, 6, 3, 5], frappe: [3, 5], suite: 7, retour: ["r-k-saut", 11, 12], portee: 80, degats: 1, pas: 12, coupe: "lateral" },
  "r-k-combo2": { cadence: [2, 2, 2, 3, 6, 4, 5], frappe: [3, 4], suite: 5, portee: 86, degats: 1, pas: 16, coupe: "lateral" },
  // la coupe haute (7 images) : garde haute, le sabre monte, elle bondit… et la finale s'enchaîne d'elle-même (puis)
  "r-k-fort": { cadence: [3, 3, 3, 4, 4, 3, 4], frappe: [5, 6], suite: 6, puis: "r-k-final", portee: 70, degats: 1, pas: 24, coupe: "vertical" },
  // le bond tranchant : la même planche sans le sabre au-dessus de la tête — l'accroupi (4, 5) puis le bond (6), et la finale
  "r-bond-coupe": { de: 4, cadence: [4, 4, 5], frappe: [2, 2], suite: 2, puis: "r-k-final", portee: 80, degats: 1, pas: 34, coupe: "vertical" },
  "r-k-final": { cadence: [3, 3, 7, 4, 4, 6], frappe: [1, 2], suite: 3, retour: ["r-k-releve-final", 1, 2, 3], portee: 96, degats: 2, pas: 24, tranche: true, coupe: "vertical" },
  "r-estoc": { cadence: [2, 2, 3, 5, 5, 4, 4], frappe: [3, 4], suite: 4, portee: 100, degats: 1, pas: 30, coupe: "estoc" },
  // l'estoc (7 images), dans la série X
  "r-estoc-fort": { cadence: [2, 2, 3, 6, 6, 4, 4], frappe: [3, 4], suite: 4, portee: 110, degats: 2, pas: 40, tranche: true, coupe: "estoc" },
  // le même, en coup fort : plus long, plus lourd, il brise une garde
  // le revers : la fin de la tournoyante (images 4 à 7) — un coup horizontal vif, sans le tour du sabre au-dessus de la tête
  "r-revers": { cadence: [3, 4, 4, 4], frappe: [0, 1], suite: 2, portee: 90, degats: 1, pas: 14, coupe: "lateral", de: 4 },
  // la coupe d'épaule (5 images) : lame à l'horizontale, elle glisse en avant en tranchant — le pas fait le coup
  "r-k-coupe-epaule": { cadence: [2, 3, 4, 3, 4], frappe: [1, 3], suite: 3, portee: 96, degats: 1, pas: 38, coupe: "lateral" },
  // ↓ + X : le coup de poing (11 images) — elle se baisse main au sol (images 1 à 4 : une esquive, un shuriken haut passe
  // au-dessus d'elle), se relève et frappe du poing (7 à 9)
  "r-k-coup-poing": { de: 1, cadence: [3, 3, 3, 3, 3, 3, 4, 4, 3, 4], frappe: [6, 8], suite: 8, esquive: [0, 3], portee: 62, degats: 1, pas: 22, repousse: true, coupe: "pied" },
  "r-poing-direct": { de: 5, cadence: [2, 3, 4, 4, 3, 4], frappe: [2, 4], suite: 4, portee: 62, degats: 1, pas: 16, repousse: true, coupe: "pied" },
  // le même sans l'esquive : le direct, vif
  // le coup de pied retourné (8 images) : elle pivote, la jambe fouette à hauteur de tête
  "r-k-pied-tournant": { cadence: [3, 3, 3, 3, 4, 5, 3, 4], frappe: [4, 6], suite: 6, retour: ["r-k-saut", 11, 12], portee: 78, degats: 1, pas: 18, repousse: true, coupe: "pied" },
  "r-coup-fort": { cadence: [4, 3, 7, 4, 4, 5], frappe: [1, 2], suite: 3, retour: ["r-k-releve-final", 1, 2, 3], portee: 96, degats: 2, pas: 20, tranche: true, coupe: "vertical" },
  // V : la finale, seule
  "r-k-balayage": { cadence: [4, 3, 6, 3, 5, 4], frappe: [0, 4], suite: 4, retour: ["r-k-releve-final", 1, 2, 3], portee: 110, degats: 1, pas: 14, bas: true, coupe: "lateral" },
  // le balayage horizontal : ses arcs font le coup (images 0, 2, 4)
  "r-k-montante": { cadence: [3, 2, 3, 6, 4, 4, 4], frappe: [1, 3], suite: 4, retour: ["r-k-saut", 11, 12], portee: 80, degats: 2, pas: 8, tranche: true, coupe: "vertical" },
  "r-k-dash-coupe": { cadence: [3, 3, 7, 4, 5], frappe: [1, 2], suite: 3, retour: ["r-k-releve-final", 1, 2, 3], portee: 100, degats: 2, pas: 60, tranche: true, coupe: "vertical" },
  "r-k-pied": { cadence: [3, 3, 5, 5, 3, 3, 3, 4], frappe: [2, 5], suite: 5, portee: 70, degats: 1, pas: 14, repousse: true, coupe: "pied" },
  "r-k-haute": { cadence: [3, 3, 4, 5, 5, 3, 3, 4], frappe: [2, 5], suite: 5, portee: 100, degats: 2, pas: 12, tranche: true, coupe: "vertical" },
  "r-moulinet": { cadence: [4, 4, 4, 4, 4, 4, 5, 8] },
  // la tournoyante jouée en parade, ample, sans frappe
  "r-k-saut": { ips: 12 },
  // les images suivent le vol (heroine.js) : appel, montée, sommet, descente, réception
  "r-k-salto": { ips: 20 },
  // joué sur la durée du vol
  // la coupe plongeante (X en l'air) : un appel (image 5), puis elle fond en avant et vers le bas sur l'image 8 (heroine.js,
  // état « plonge », fantômes et sillage de lame), et s'écrase au sol dans la coupe accroupie de la finale (r-plonge-fin)
  "r-k-saute-coupe": { de: 5, cadence: [3, 3, 6, 6], frappe: [1, 2], portee: 96, degats: 2, pas: 0, tranche: true, coupe: "vertical" },
  "r-plonge-fin": { de: 2, cadence: [6, 3, 3, 4], frappe: [0, 1], suite: 2, retour: ["r-k-releve-final", 1, 2, 3], portee: 100, degats: 2, pas: 6, tranche: true, coupe: "vertical" },
  "r-k-pied-saute": { cadence: [2, 2, 2, 3, 4, 4, 4, 5, 5, 5], frappe: [4, 9], portee: 70, degats: 1, pas: 0, coupe: "pied" },
  "r-k-chute": { ips: 12 },
  "r-k-releve": { ips: 8 },
  "r-k-releve-final": { ips: 10 },
  // le relevé après une coupe accroupie (joué par l'état « retour » : images 1, 2, 3)
  "r-k-charge": { ips: 10, boucle: "aller-retour" },
  "r-saut": { ips: 10 },
  // l'attaque sautée de repli (sans planche de Kagetsura) : la grande coupe descendante, jouée vite
  "r-coup-air": { image: "r-coup-fort", de: 3, a: 11, ips: 26, frappe: [0.3, 0.75], portee: 96, degats: 2, pas: 0, tranche: true },
  "r-parade": { ips: 14 },
  "r-touche": { cadence: [3, 5, 7] },
  "r-mort": { ips: 5, tiens: { 3: 2 } }
};
for (const a of Object.values(ANIMS)) {
  if (!a.cadence) continue;
  const total = a.cadence.reduce((s, d) => s + d, 0), avant2 = (i) => a.cadence.slice(0, i).reduce((s, d) => s + d, 0) / total;
  a.ips = 60;
  a.total = total;
  a.suiteCadence = a.cadence.flatMap((d, i) => Array(d).fill((a.de || 0) + i));
  if (a.frappe && Number.isInteger(a.frappe[0])) a.frappe = [avant2(a.frappe[0]), avant2(a.frappe[1] + 1)];
  if (Number.isInteger(a.suite)) a.suite = avant2(a.suite);
}
function suiteImages(anim, n) {
  const a = ANIMS[anim] || {}, s = [];
  if (a.suiteCadence) return n < a.suiteCadence[a.suiteCadence.length - 1] + 1 ? a.suiteCadence.map((k) => Math.min(k, n - 1)) : a.suiteCadence;
  if (a.de != null) {
    for (let k = a.de; k <= a.a; k++) s.push(k);
    return s;
  }
  for (let k = 0; k < n; k++) for (let r = 0; r <= ((a.tiens || {})[k] || 0); r++) s.push(k);
  if (a.boucle === "aller-retour") return [...s, ...s.slice(1, -1).reverse()];
  return s;
}
var COMBO = ["r-coup-leger", "r-estoc", "r-coup-fort", "r-k-combo2", "r-k-final", "r-k-balayage", "r-k-montante", "r-k-dash-coupe", "r-k-pied", "r-k-haute", "r-k-fort", "r-bond-coupe", "r-estoc-fort", "r-revers", "r-k-coupe-epaule", "r-k-pied-tournant", "r-k-coup-poing", "r-poing-direct"];
var CHAINES = { sabre: [0, 3, 14, 13, 1, 5], fort: [4, 12, 15, 7, 5, 11], corps: [17, 8, 16, 15] };
var CORPS_A_CORPS = 46;
var REPRISE_FORT = 1.5;
var REPRISE_LEGER = 2.5;
var MOULINET = { morts: 6, libre: 110, fureur: 0.2, sang: 0.15, repos: 15 };
var FENETRE_PARFAITE = 0.16;
var TAMPON = 0.4;
var ENNEMIS = {
  sabreur: { vitesse: 84, ipsMarche: 12, distance: 64, armer: 0.3, frappe: 0.2, portee: 74, sautable: 70, repos: 0.4, bond: 210, bloque: 0.3 },
  // agressif : il presse, arme vite, se remet vite
  ninja: { vitesse: 100, ipsMarche: 12, distance: 240, armer: 0.42, frappe: 0.12, portee: 0, sautable: 0, repos: 0.5, bond: 0, bloque: 0 },
  // le colosse : le boss, tous les 30 morts (BOSS_TOUS_LES) ; il encaisse BOSS_PV coups la première fois, un de plus à chaque venue
  boss: { vitesse: 92, ipsMarche: 12, distance: 70, armer: 0.28, frappe: 0.2, portee: 80, sautable: 80, repos: 0.32, bond: 220, bloque: 0.5 }
};
var BOSS_TOUS_LES = 30;
var BOSS_PV = 4;
var BOSS_REPIT = 5;

// src/js/ecran.js
var cvs = document.getElementById("ecran");
var ctx = cvs.getContext("2d", { alpha: false });
var jeu = document.getElementById("jeu");
J.W = 640;
J.HAUT = 360;
cvs.width = J.W;
cvs.height = J.HAUT;
function disposer() {
  const vv = window.visualViewport, vw = vv ? vv.width : innerWidth, vh = vv ? vv.height : innerHeight;
  const dpr = window.devicePixelRatio || 1;
  let k = Math.min(vw * dpr / J.W, vh * dpr / J.HAUT);
  if (k >= 2) k = Math.floor(k);
  const l = J.W * k / dpr, h = J.HAUT * k / dpr;
  Object.assign(cvs.style, {
    width: l + "px",
    height: h + "px",
    left: Math.round((vw - l) / 2 * dpr) / dpr + "px",
    top: Math.round((vh - h) / 2 * dpr) / dpr + "px"
  });
  ctx.imageSmoothingEnabled = false;
}
addEventListener("resize", disposer);
window.visualViewport?.addEventListener("resize", disposer);
screen.orientation?.addEventListener?.("change", disposer);

// src/js/son.js
J.actx = null;
J.muet = false;
J.bruitBuf = null;
J.maitre = null;
try {
  J.muet = localStorage.getItem("lady-snowblood-muet") === "1";
} catch {
}
function reveillerSon() {
  if (!J.actx) {
    try {
      J.actx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "playback" });
    } catch {
      try {
        J.actx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return;
      }
    }
    const reprendre = () => {
      if (J.actx && J.actx.state !== "running" && document.visibilityState === "visible") J.actx.resume().catch(() => {
      });
    };
    J.actx.addEventListener?.("statechange", reprendre);
    document.addEventListener("visibilitychange", reprendre);
  }
  if (J.actx.state === "suspended") J.actx.resume();
}
function sortie() {
  if (!J.maitre) {
    J.maitre = J.actx.createGain();
    J.maitre.gain.value = J.muet ? 0 : 0.36;
    J.maitre.connect(J.actx.destination);
  }
  return J.maitre;
}
function majVolume() {
  if (J.maitre) J.maitre.gain.value = J.muet ? 0 : 0.36;
}
function bruit() {
  if (!J.bruitBuf) {
    J.bruitBuf = J.actx.createBuffer(1, J.actx.sampleRate * 2, J.actx.sampleRate);
    const d = J.bruitBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = J.actx.createBufferSource();
  s.buffer = J.bruitBuf;
  return s;
}
function env(g, t, a, d, v) {
  g.gain.setValueAtTime(1e-4, t);
  g.gain.exponentialRampToValueAtTime(v, t + a);
  g.gain.exponentialRampToValueAtTime(1e-4, t + a + d);
}
function osc(type, f0, f1, t, d, v, out) {
  const o = J.actx.createOscillator(), g = J.actx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + d);
  env(g, t, 4e-3, d, v);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + d + 0.05);
  o.onended = () => {
    o.disconnect();
    g.disconnect();
  };
}
function souffle(filtre, f0, f1, t, d, v, out, q = 1, attaque = 6e-3) {
  const s = bruit(), f = J.actx.createBiquadFilter(), g = J.actx.createGain();
  f.type = filtre;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + d);
  env(g, t, attaque, d, v);
  s.connect(f).connect(g).connect(out);
  s.start(t, Math.random());
  s.stop(t + d + 0.1);
  s.onended = () => {
    s.disconnect();
    f.disconnect();
    g.disconnect();
  };
}
var BRUITAGES = false;
function sfx(nom, delai = 0) {
  if (!BRUITAGES) return;
  if (J.muet || !J.actx || J.actx.state !== "running") return;
  const t = J.actx.currentTime + delai, out = sortie();
  switch (nom) {
    case "lame":
      souffle("bandpass", 900, 3800, t, 0.13, 0.55, out, 2.5);
      break;
    // le sabre fend l'air
    case "lourd":
      souffle("bandpass", 500, 2600, t, 0.22, 0.7, out, 1.6);
      break;
    case "chair":
      souffle("lowpass", 2400, 300, t, 0.16, 0.9, out, 1);
      osc("square", 140, 60, t, 0.07, 0.12, out);
      break;
    case "sang":
      souffle("highpass", 1800, 900, t + 0.04, 0.55, 0.28, out, 0.7, 0.02);
      break;
    // la gerbe
    case "fer":
      [1, 2.76, 5.4, 8.9].forEach((m, i) => osc("triangle", 820 * m, 820 * m * 0.99, t, 0.5 - i * 0.1, [0.25, 0.14, 0.08, 0.05][i], out));
      break;
    case "parade":
      [1, 2.4, 4.1].forEach((m, i) => osc("sine", 1300 * m, 1290 * m, t, 0.9 - i * 0.2, [0.3, 0.15, 0.08][i], out));
      souffle("highpass", 5e3, 3e3, t, 0.08, 0.5, out);
      break;
    case "shuriken":
      souffle("bandpass", 3e3, 5200, t, 0.18, 0.25, out, 6);
      break;
    case "aie":
      souffle("lowpass", 1600, 200, t, 0.2, 0.8, out);
      osc("sine", 300, 180, t, 0.18, 0.12, out);
      break;
    case "chute":
      souffle("lowpass", 500, 80, t, 0.3, 0.7, out);
      break;
    case "taiko":
      osc("sine", 110, 42, t, 0.6, 0.9, out);
      souffle("lowpass", 400, 60, t, 0.25, 0.6, out);
      break;
    case "fureur":
      osc("sawtooth", 70, 35, t, 1.4, 0.18, out);
      souffle("bandpass", 300, 2400, t, 1.1, 0.4, out, 0.8, 0.3);
      break;
    case "soin":
      [523, 659, 784].forEach((f, i) => osc("sine", f, f, t + i * 0.09, 0.4, 0.12, out));
      break;
    case "glas":
      [1, 2, 2.76, 5.4].forEach((m, i) => osc("sine", 82 * m, 82 * m * 0.995, t, 3.2 - i * 0.5, [0.5, 0.2, 0.14, 0.06][i], out));
      break;
    case "choix":
      osc("square", 660, 660, t, 0.04, 0.05, out);
      break;
  }
}
var THEMES = ["theme", "theme2"];
var M = { meta: {}, brut: {}, dec: {}, charge: false, voix: null, etat: null, piste: null, bus: null, filtre: null, volume: BRUITAGES ? 0.55 : 0.95, fx: null };
function chargerMusique() {
  if (M.charge || !J.actx) return;
  M.charge = true;
  for (const t of THEMES) fetch(`son/${t}.mp3.json`).then((r) => r.json()).then((m) => {
    M.meta[t] = m;
    if (M.etat && !M.voix) relancer();
  }).catch(() => {
  });
}
function relancer() {
  const e = M.etat, p = M.piste;
  M.etat = null;
  musique(e, p);
}
var cle = (t, seg) => `${t}/${seg}`;
function decoder(t, seg) {
  const k = cle(t, seg), m = M.meta[t];
  if (!m || !m.segments[seg]) return null;
  if (M.dec[k]) return M.dec[k];
  M.dec[k] = fetch("son/" + m.segments[seg].fichier).then((r) => r.arrayBuffer()).then((ab) => {
    J.evt && (J.evt.musique = true);
    return new Promise((ok, ko) => J.actx.decodeAudioData(ab, ok, ko));
  }).then((buf) => ({ buf, seg: m.segments[seg], mesure: m.mesure, phase: m.phase - m.segments[seg].debut })).catch(() => {
    delete M.dec[k];
    return null;
  });
  return M.dec[k];
}
function liberer(garder) {
  for (const k of Object.keys(M.dec)) if (!garder.includes(k)) delete M.dec[k];
}
function bus() {
  if (!M.bus) {
    M.filtre = J.actx.createBiquadFilter();
    M.filtre.type = "lowpass";
    M.filtre.frequency.value = 18e3;
    M.filtre.Q.value = 0.5;
    M.bus = J.actx.createGain();
    M.bus.gain.value = M.volume;
    M.filtre.connect(M.bus).connect(sortie());
  }
  return M.filtre;
}
function position(v) {
  let pos = v.debut + (J.actx.currentTime - v.t0);
  if (v.boucle && pos > v.boucle[1]) pos = v.boucle[0] + (pos - v.boucle[0]) % (v.boucle[1] - v.boucle[0]);
  return pos;
}
function prochaineMesure(v) {
  if (!v) return J.actx.currentTime + 0.05;
  const p = position(v), k = Math.ceil((p - v.phase) / v.mesure + 1e-3);
  return J.actx.currentTime + (v.phase + k * v.mesure - p);
}
function voix(S2, depart, t, fondu) {
  const src = J.actx.createBufferSource(), g = J.actx.createGain();
  src.buffer = S2.buf;
  const boucle2 = S2.seg.boucle;
  if (boucle2) {
    src.loop = true;
    src.loopStart = boucle2[0];
    src.loopEnd = boucle2[1];
  }
  g.gain.setValueAtTime(fondu ? 1e-4 : 1, t);
  if (fondu) g.gain.exponentialRampToValueAtTime(1, t + fondu);
  src.connect(g).connect(bus());
  src.start(t, depart);
  src.onended = () => {
    src.disconnect();
    g.disconnect();
  };
  return { s: src, g, t0: t, debut: depart, boucle: boucle2, mesure: S2.mesure, phase: S2.phase, k: null };
}
function couper(v, t, fondu) {
  if (!v) return;
  v.g.gain.setValueAtTime(Math.max(1e-4, v.g.gain.value), t);
  v.g.gain.exponentialRampToValueAtTime(1e-4, t + fondu);
  v.s.stop(t + fondu + 0.05);
}
function musique(etat, piste = "theme", bientot = null) {
  if (!J.actx) return;
  chargerMusique();
  if (etat === "fin" || etat === "ouverture") piste = "theme";
  const seg = etat === "fin" ? "coda" : etat, k = etat ? cle(piste, seg) : null;
  const kb = bientot ? cle(piste, bientot) : null;
  if (kb && kb !== M.bientot && M.meta[piste]) {
    M.bientot = kb;
    decoder(piste, bientot);
  }
  if (etat === M.etat && piste === M.piste) return;
  const avant2 = M.etat, avantPiste = M.piste;
  M.etat = etat;
  M.piste = piste;
  if (!etat) {
    couper(M.voix, J.actx.currentTime, 1.2);
    M.voix = null;
    liberer([]);
    return;
  }
  if (etat === "nuit" && avant2 === "ouverture" && avantPiste === piste && M.voix) {
    M.voix.k = cle(piste, "ouverture");
    return;
  }
  if (!M.meta[piste]) return;
  const attendu = { etat, piste };
  Promise.resolve(decoder(piste, seg)).then((S2) => {
    if (!S2 || M.etat !== attendu.etat || M.piste !== attendu.piste) return;
    const ancien = M.voix, B = S2.seg.boucle, mes = S2.mesure;
    let v;
    if (etat === "fin") {
      const t = J.actx.currentTime + 0.05;
      couper(ancien, t, 2.5);
      v = voix(S2, 0, t, ancien ? 2.5 : 0.5);
    } else if (etat === "ouverture" || !ancien) {
      couper(ancien, J.actx.currentTime, 0.4);
      v = voix(S2, etat === "ouverture" ? 0 : B[0], J.actx.currentTime + 0.05, etat === "ouverture" ? 0 : 1);
    } else if (false) {
      const t = J.actx.currentTime + 0.05;
      couper(ancien, t, 2.5);
      v = voix(S2, 0, t, 2.5);
    } else {
      const t = prochaineMesure(ancien), f = avantPiste !== piste ? mes * 2 : etat === "boss" ? mes / 2 : mes;
      couper(ancien, t, f);
      v = voix(S2, B[0], t, f);
    }
    v.k = cle(piste, seg);
    M.voix = v;
    liberer([v.k, M.bientot].filter(Boolean));
  });
}
function majMusique(lent, gel, iai2, pause) {
  if (!M.filtre) return;
  const fx = `${lent || gel ? 1 : 0}${iai2 ? 1 : 0}${pause ? 1 : 0}`;
  if (fx === M.fx) return;
  M.fx = fx;
  const t = J.actx.currentTime, etouffe = lent || gel;
  M.filtre.frequency.cancelScheduledValues(t);
  M.filtre.frequency.setTargetAtTime(etouffe ? 900 : 18e3, t, etouffe ? 0.04 : 0.25);
  M.bus.gain.cancelScheduledValues(t);
  M.bus.gain.setTargetAtTime(iai2 ? 1e-4 : pause ? M.volume * 0.35 : M.volume, t, iai2 ? 0.01 : 0.15);
}
function etatMusique() {
  const v = M.voix;
  if (!J.actx) return { contexte: false };
  const pos = v ? position(v) : null;
  return { contexte: J.actx.state, chargee: Object.keys(M.meta).sort().join("+"), decodes: Object.keys(M.dec).sort().join(" "), etat: M.etat, piste: M.piste, position: pos && Math.round(pos * 100) / 100, niveau: M.bus && Math.round(M.bus.gain.value * 100) / 100, filtre: M.filtre && Math.round(M.filtre.frequency.value) };
}

// src/js/entrees.js
var clavier = {};
var boutons = {};
var tenu = (k) => !!(clavier[k] || boutons[k]);
J.appuis = /* @__PURE__ */ new Set();
var KONAMI = ["up", "up", "down", "down", "left", "right", "left", "right", "fort", "sabre"];
var saisie = [];
var konamiEnCours = () => saisie.length >= 8 && KONAMI.slice(0, saisie.length).join() === saisie.join();
function appui(k) {
  reveillerSon();
  if (J.pause) {
    J.pause = false;
    return;
  }
  J.appuis.add(k);
  if (KONAMI.includes(k)) {
    saisie.push(k);
    if (saisie.length > KONAMI.length) saisie.shift();
    if (saisie.join() === KONAMI.join()) {
      saisie = [];
      J.appuis.add("konami");
    }
  }
  const t = performance.now();
  if (k === "left" || k === "right") {
    if (t - (dernier[k] || -1e9) < 260 || t - (relaches[k] || -1e9) < 340) {
      J.appuis.add("dash-" + k);
      dernier[k] = -1e9;
      relaches[k] = -1e9;
    } else dernier[k] = t;
  }
}
function relache(k) {
  relaches[k] = performance.now();
}
var dernier = {};
var relaches = {};
var tactile = matchMedia("(pointer: coarse)").matches;
function vibrer(ms) {
  if (tactile && navigator.vibrate) try {
    navigator.vibrate(ms);
  } catch {
  }
}
var PAR_CODE = {
  KeyX: "sabre",
  Space: "sabre",
  Enter: "sabre",
  NumpadEnter: "sabre",
  KeyJ: "sabre",
  KeyC: "fort",
  KeyK: "fort",
  KeyV: "fort",
  KeyL: "fort",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down"
};
var PAR_CARACTERE = { z: "up", q: "left", s: "down", d: "right", w: "up", a: "left" };
var lire = (e) => PAR_CODE[e.code] || PAR_CARACTERE[(e.key || "").toLowerCase()];
var enfoncees = /* @__PURE__ */ new Map();
addEventListener("keydown", (e) => {
  const t = (e.key || "").toLowerCase();
  if (e.code === "KeyM" || t === "m") {
    if (!e.repeat) basculerSon();
    return;
  }
  if ((e.code === "KeyP" || t === "p" || e.key === "Escape") && !e.repeat) {
    J.pause = !J.pause && J.etat === "jeu";
    return;
  }
  if ((e.code === "KeyW" || t === "w") && !e.repeat) {
    appui("boss");
    return;
  }
  if ((e.code === "KeyO" || t === "o") && !e.repeat) {
    J.compteur = !J.compteur;
    return;
  }
  if (e.metaKey || e.ctrlKey) return;
  const k = lire(e);
  if (!k) return;
  e.preventDefault();
  if (!e.repeat && !enfoncees.has(e.code)) appui(k);
  enfoncees.set(e.code, k);
  clavier[k] = true;
});
addEventListener("keyup", (e) => {
  const k = enfoncees.get(e.code) || lire(e);
  enfoncees.delete(e.code);
  if (k && ![...enfoncees.values()].includes(k)) {
    clavier[k] = false;
    relache(k);
  }
});
function relacher() {
  enfoncees.clear();
  for (const k in clavier) clavier[k] = false;
  for (const k in boutons) boutons[k] = 0;
  croix.fin();
  actions.fin();
}
addEventListener("blur", relacher);
function basculerSon() {
  J.muet = !J.muet;
  majVolume();
  try {
    localStorage.setItem("lady-snowblood-muet", J.muet ? "1" : "0");
  } catch {
  }
}
var montrerManette = () => jeu.classList.toggle("tactile", tactile);
montrerManette();
var DIRECTIONS = ["left", "right", "up", "down"];
var croix = (() => {
  const zone = document.getElementById("croix"), dessin = zone.querySelector(".croix-dessin"), pommeau = zone.querySelector(".pommeau"), bras = {};
  DIRECTIONS.forEach((k) => {
    bras[k] = zone.querySelector(`[data-dir="${k}"]`);
  });
  const FLOTTANT = false, SUIVI = false, MORT = 12, RAYON = 42, ENTREE = { left: 0.383, right: 0.383, up: 0.5, down: 0.5 }, SORTIE = { left: 0.25, right: 0.25, up: 0.3, down: 0.3 };
  const PICHENETTE = { px: 40, ms: 160 };
  let doigt = null, actives = /* @__PURE__ */ new Set(), cx = 0, cy = 0, maison = null;
  let entree = null;
  const poser = (nouvelles, e) => {
    for (const k of DIRECTIONS) {
      const avant2 = actives.has(k), apres = nouvelles.has(k);
      if (apres && !avant2) {
        appui(k);
        if ((k === "left" || k === "right") && e) entree = { k, t: performance.now(), x: e.clientX, fait: false };
      }
      if (avant2 && !apres) {
        relache(k);
        if (entree && entree.k === k) entree = null;
      }
      boutons[k] = apres ? 1 : 0;
      bras[k].classList.toggle("on", apres);
    }
    actives = nouvelles;
  };
  const placer = () => {
    const z = zone.getBoundingClientRect(), w2 = maison.width / 2, h2 = maison.height / 2;
    const tx = Math.max(z.left + w2 - maison.cx, Math.min(z.right - w2 - maison.cx, cx - maison.cx));
    const ty = Math.max(z.top + h2 - maison.cy, Math.min(z.bottom - h2 - maison.cy, cy - maison.cy));
    dessin.style.transform = `translate(${Math.round(tx)}px, ${Math.round(ty)}px)`;
  };
  const lire2 = (e) => {
    let dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy);
    if (SUIVI && d > RAYON) {
      cx += dx * (1 - RAYON / d);
      cy += dy * (1 - RAYON / d);
      dx = e.clientX - cx;
      dy = e.clientY - cy;
      d = RAYON;
      placer();
    }
    const s = /* @__PURE__ */ new Set();
    if (d > MORT) {
      const c = dx / d, n = dy / d, comp = { left: -c, right: c, up: -n, down: n };
      for (const k of DIRECTIONS) if (comp[k] > (actives.has(k) ? SORTIE[k] : ENTREE[k])) s.add(k);
    }
    poser(s, e);
    if (pommeau) {
      const r = dessin.getBoundingClientRect().width * 0.19, k = d > r ? r / d : 1;
      pommeau.classList.remove("retour");
      pommeau.style.transform = `translate(${Math.round(dx * k)}px, ${Math.round(dy * k)}px)`;
    }
    if (entree && !entree.fait && performance.now() - entree.t < PICHENETTE.ms && (e.clientX - entree.x) * (entree.k === "right" ? 1 : -1) > PICHENETTE.px) {
      entree.fait = true;
      J.appuis.add("dash-" + entree.k);
    }
  };
  zone.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (doigt !== null) return;
    doigt = e.pointerId;
    zone.setPointerCapture(e.pointerId);
    if (!maison) {
      const r = dessin.getBoundingClientRect();
      maison = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, width: r.width, height: r.height };
    }
    if (FLOTTANT) {
      cx = e.clientX;
      cy = e.clientY;
      dessin.classList.remove("retour");
      placer();
    } else {
      cx = maison.cx;
      cy = maison.cy;
    }
    poser(/* @__PURE__ */ new Set(), e);
    if (!FLOTTANT) lire2(e);
  });
  zone.addEventListener("pointermove", (e) => {
    if (e.pointerId === doigt) lire2(e);
  });
  const lever = (e) => {
    if (e.pointerId === doigt) api.fin();
  };
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((t) => zone.addEventListener(t, lever));
  addEventListener("resize", () => {
    maison = null;
  });
  const api = { fin() {
    doigt = null;
    poser(/* @__PURE__ */ new Set());
    entree = null;
    dessin.classList.add("retour");
    dessin.style.transform = "";
    if (pommeau) {
      pommeau.classList.add("retour");
      pommeau.style.transform = "";
    }
  } };
  return api;
})();
var actions = (() => {
  const zone = document.getElementById("actions"), liste = [...zone.querySelectorAll("[data-k]")];
  const doigts = /* @__PURE__ */ new Map();
  let centres = [];
  const compter = () => {
    for (const b of liste) {
      let n = 0;
      for (const v of doigts.values()) if (v === b) n++;
      boutons[b.dataset.k] = n;
      b.classList.toggle("on", n > 0);
    }
  };
  const viser = (e) => {
    let meilleur = null, dmin = Infinity;
    for (const { b, x, y } of centres) {
      const d = Math.hypot(e.clientX - x, e.clientY - y);
      if (d < dmin) {
        dmin = d;
        meilleur = b;
      }
    }
    return meilleur;
  };
  const suivre = (e) => {
    const b = viser(e), avant2 = doigts.get(e.pointerId);
    if (b !== avant2) {
      doigts.set(e.pointerId, b);
      if (b) {
        appui(b.dataset.k);
        vibrer(8);
      }
      compter();
    }
  };
  zone.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    zone.setPointerCapture(e.pointerId);
    centres = liste.map((b) => {
      const r = b.getBoundingClientRect();
      return { b, x: r.left + r.width / 2, y: r.top + r.height / 2, rayon: r.width * 0.8 };
    });
    doigts.set(e.pointerId, null);
    suivre(e);
  });
  zone.addEventListener("pointermove", (e) => {
    if (doigts.has(e.pointerId)) suivre(e);
  });
  const lever = (e) => {
    if (doigts.delete(e.pointerId)) compter();
  };
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((t) => zone.addEventListener(t, lever));
  zone.addEventListener("contextmenu", (e) => e.preventDefault());
  return { fin() {
    doigts.clear();
    compter();
  } };
})();
jeu.addEventListener("touchstart", (e) => {
  if (e.cancelable) e.preventDefault();
}, { passive: false });
jeu.addEventListener("touchmove", (e) => {
  if (e.cancelable) e.preventDefault();
}, { passive: false });
document.addEventListener("gesturestart", (e) => e.preventDefault());
jeu.addEventListener("contextmenu", (e) => e.preventDefault());
addEventListener("pointerup", reveillerSon, true);
addEventListener("touchend", reveillerSon, true);
addEventListener("pointerdown", (e) => {
  if (e.pointerType === "touch" && !tactile) {
    tactile = true;
    montrerManette();
  }
}, true);
document.getElementById("ecran").addEventListener("pointerdown", (e) => {
  reveillerSon();
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width * J.W, y = (e.clientY - r.top) / r.height * J.HAUT;
  if (x > J.W - 20 && y < 20) basculerSon();
  else if (J.pause) J.pause = false;
  else if (J.etat !== "jeu") appui("sabre");
});

// src/js/appareil.js
J.pause = false;
var installee = matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches || navigator.standalone === true;
var portrait = matchMedia("(orientation: portrait) and (pointer: coarse)");
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  const avaitUnControleur = !!navigator.serviceWorker.controller;
  let aRecharger = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (avaitUnControleur) aRecharger = true;
  });
  setInterval(() => {
    if (aRecharger && J.etat === "titre") location.reload();
  }, 1e3);
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").then((inscription) => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") inscription.update().catch(() => {
      });
    });
  }).catch(() => {
  }));
}
var verrou = null;
async function garderEcranAllume() {
  if (!("wakeLock" in navigator) || verrou || document.visibilityState !== "visible") return;
  try {
    verrou = await navigator.wakeLock.request("screen");
    verrou.addEventListener("release", () => {
      verrou = null;
    });
  } catch {
  }
}
function mettreEnPause() {
  if (J.etat === "jeu") J.pause = true;
  relacher();
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    mettreEnPause();
    J.actx?.suspend?.().catch(() => {
    });
  } else garderEcranAllume();
});
addEventListener("pagehide", mettreEnPause);
portrait.addEventListener?.("change", (e) => {
  if (e.matches) mettreEnPause();
});
var pleinEcranDemande = false;
addEventListener("pointerup", (e) => {
  garderEcranAllume();
  if (pleinEcranDemande || installee || e.pointerType !== "touch") return;
  pleinEcranDemande = true;
  const el = document.documentElement;
  if (!document.fullscreenElement && el.requestFullscreen) {
    el.requestFullscreen({ navigationUI: "hide" }).then(() => screen.orientation?.lock?.("landscape")).catch(() => {
    });
  }
}, true);
var enPause = () => J.pause || portrait.matches;

// donnees:donnees.js
var ART = { "decor/scene": { "taille": [704, 396], "decalage": [0, 0], "hauteurAvantRognage": 396, "raccord": false, "src": "images/decor/scene.png" }, "decor/banniere": { "taille": [3456, 172], "decalage": [0, 0], "hauteurAvantRognage": 172, "raccord": false, "cellule": [54, 172], "images": 64, "pieds": [0, 172], "decor": { "x": 650, "y": 104, "ips": 10 }, "src": "images/decor/banniere.png" }, "decor/cascades": { "taille": [21456, 50], "decalage": [0, 0], "hauteurAvantRognage": 50, "raccord": false, "cellule": [447, 50], "images": 48, "pieds": [0, 50], "decor": { "x": 145, "y": 250, "ips": 12 }, "src": "images/decor/cascades.png" }, "decor/lune": { "taille": [9200, 95], "decalage": [0, 0], "hauteurAvantRognage": 95, "raccord": false, "cellule": [115, 95], "images": 80, "pieds": [0, 95], "decor": { "x": 453, "y": 20, "ips": 10 }, "src": "images/decor/lune.png" }, "decor/lanterne": { "taille": [1408, 22], "decalage": [0, 0], "hauteurAvantRognage": 22, "raccord": false, "cellule": [22, 22], "images": 64, "pieds": [0, 22], "decor": { "x": 22, "y": 224, "ips": 10 }, "src": "images/decor/lanterne.png" }, "decor/fenetres": { "taille": [4096, 38], "decalage": [0, 0], "hauteurAvantRognage": 38, "raccord": false, "cellule": [64, 38], "images": 64, "pieds": [0, 38], "decor": { "x": 538, "y": 94, "ips": 10 }, "src": "images/decor/fenetres.png" }, "effets/e-k-coupes": { "taille": [512, 106], "decalage": [0, 0], "hauteurAvantRognage": 106, "raccord": false, "cellule": [64, 106], "images": 8, "ancres": [[-31, 121], [-31, 121], [-31, 121], [-31, 121], [-31, 121], [-31, 121], [-31, 121], [-31, 121]], "pieds": [-31, 121], "src": "images/effets/e-k-coupes.png" }, "effets/e-k-combo2": { "taille": [343, 38], "decalage": [0, 0], "hauteurAvantRognage": 38, "raccord": false, "cellule": [49, 38], "images": 7, "ancres": [[-45, 55], [-45, 55], [-45, 55], [-45, 55], [-45, 55], [-45, 55], [-45, 55]], "pieds": [-45, 55], "src": "images/effets/e-k-combo2.png" }, "effets/e-k-final": { "taille": [522, 107], "decalage": [0, 0], "hauteurAvantRognage": 107, "raccord": false, "cellule": [87, 107], "images": 6, "ancres": [[-4, 120], [-4, 120], [-4, 120], [-4, 120], [-4, 120], [-4, 120]], "pieds": [-4, 120], "src": "images/effets/e-k-final.png" }, "effets/e-k-estoc": { "taille": [749, 62], "decalage": [0, 0], "hauteurAvantRognage": 62, "raccord": false, "cellule": [107, 62], "images": 7, "ancres": [[3, 90], [3, 90], [3, 90], [3, 90], [3, 90], [3, 90], [3, 90]], "pieds": [3, 90], "src": "images/effets/e-k-estoc.png" }, "effets/e-k-balayage": { "taille": [774, 43], "decalage": [0, 0], "hauteurAvantRognage": 43, "raccord": false, "cellule": [129, 43], "images": 6, "ancres": [[78, 72], [78, 72], [78, 72], [78, 72], [78, 72], [78, 72]], "pieds": [78, 72], "src": "images/effets/e-k-balayage.png" }, "gundam/g-r-garde": { "taille": [188, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [94, 97], "images": 2, "pieds": [39, 96], "ancres": [[39, 96], [39, 96]], "gundam": true, "src": "images/gundam/g-r-garde.png" }, "gundam/g-r-garde-titre": { "taille": [188, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [94, 97], "images": 2, "pieds": [39, 96], "ancres": [[39, 96], [39, 96]], "gundam": true, "src": "images/gundam/g-r-garde-titre.png" }, "gundam/g-r-marche": { "taille": [744, 103], "decalage": [0, 0], "hauteurAvantRognage": 103, "raccord": false, "cellule": [93, 103], "images": 8, "pieds": [39, 102], "ancres": [[39, 102], [39, 102], [39, 102], [39, 102], [39, 102], [39, 102], [39, 102], [39, 102]], "gundam": true, "src": "images/gundam/g-r-marche.png" }, "gundam/g-r-course": { "taille": [744, 103], "decalage": [0, 0], "hauteurAvantRognage": 103, "raccord": false, "cellule": [93, 103], "images": 8, "pieds": [39, 102], "ancres": [[39, 102], [39, 102], [39, 102], [39, 102], [39, 102], [39, 102], [39, 102], [39, 102]], "gundam": true, "src": "images/gundam/g-r-course.png" }, "gundam/g-r-coup-leger": { "taille": [944, 99], "decalage": [0, 0], "hauteurAvantRognage": 99, "raccord": false, "cellule": [118, 99], "images": 8, "pieds": [59, 98], "ancres": [[59, 98], [59, 98], [59, 98], [59, 98], [59, 98], [59, 98], [59, 98], [59, 98]], "gundam": true, "src": "images/gundam/g-r-coup-leger.png" }, "gundam/g-r-k-combo2": { "taille": [714, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [102, 97], "images": 7, "pieds": [58, 96], "ancres": [[58, 96], [58, 96], [58, 96], [58, 96], [58, 96], [58, 96], [58, 96]], "gundam": true, "src": "images/gundam/g-r-k-combo2.png" }, "gundam/g-r-k-coupe-epaule": { "taille": [590, 99], "decalage": [0, 0], "hauteurAvantRognage": 99, "raccord": false, "cellule": [118, 99], "images": 5, "pieds": [59, 98], "ancres": [[59, 98], [59, 98], [59, 98], [59, 98], [59, 98]], "gundam": true, "src": "images/gundam/g-r-k-coupe-epaule.png" }, "gundam/g-r-revers": { "taille": [704, 92], "decalage": [0, 0], "hauteurAvantRognage": 92, "raccord": false, "cellule": [88, 92], "images": 8, "pieds": [33, 91], "ancres": [[33, 91], [33, 91], [33, 91], [33, 91], [33, 91], [33, 91], [33, 91], [33, 91]], "gundam": true, "src": "images/gundam/g-r-revers.png" }, "gundam/g-r-estoc": { "taille": [854, 89], "decalage": [0, 0], "hauteurAvantRognage": 89, "raccord": false, "cellule": [122, 89], "images": 7, "pieds": [44, 88], "ancres": [[44, 88], [44, 88], [44, 88], [44, 88], [44, 88], [44, 88], [44, 88]], "gundam": true, "src": "images/gundam/g-r-estoc.png" }, "gundam/g-r-estoc-fort": { "taille": [854, 89], "decalage": [0, 0], "hauteurAvantRognage": 89, "raccord": false, "cellule": [122, 89], "images": 7, "pieds": [44, 88], "ancres": [[44, 88], [44, 88], [44, 88], [44, 88], [44, 88], [44, 88], [44, 88]], "gundam": true, "src": "images/gundam/g-r-estoc-fort.png" }, "gundam/g-r-k-balayage": { "taille": [612, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [102, 97], "images": 6, "pieds": [58, 96], "ancres": [[58, 96], [58, 96], [58, 96], [58, 96], [58, 96], [58, 96]], "gundam": true, "src": "images/gundam/g-r-k-balayage.png" }, "gundam/g-r-k-final": { "taille": [846, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [141, 109], "images": 6, "pieds": [54, 108], "ancres": [[54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108]], "gundam": true, "src": "images/gundam/g-r-k-final.png" }, "gundam/g-r-coup-fort": { "taille": [846, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [141, 109], "images": 6, "pieds": [54, 108], "ancres": [[54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108]], "gundam": true, "src": "images/gundam/g-r-coup-fort.png" }, "gundam/g-r-plonge-fin": { "taille": [846, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [141, 109], "images": 6, "pieds": [54, 108], "ancres": [[54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108]], "gundam": true, "src": "images/gundam/g-r-plonge-fin.png" }, "gundam/g-r-k-fort": { "taille": [539, 111], "decalage": [0, 0], "hauteurAvantRognage": 111, "raccord": false, "cellule": [77, 111], "images": 7, "pieds": [37, 110], "ancres": [[37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110]], "gundam": true, "src": "images/gundam/g-r-k-fort.png" }, "gundam/g-r-bond-coupe": { "taille": [539, 111], "decalage": [0, 0], "hauteurAvantRognage": 111, "raccord": false, "cellule": [77, 111], "images": 7, "pieds": [37, 110], "ancres": [[37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110]], "gundam": true, "src": "images/gundam/g-r-bond-coupe.png" }, "gundam/g-r-k-montante": { "taille": [539, 111], "decalage": [0, 0], "hauteurAvantRognage": 111, "raccord": false, "cellule": [77, 111], "images": 7, "pieds": [37, 110], "ancres": [[37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110]], "gundam": true, "src": "images/gundam/g-r-k-montante.png" }, "gundam/g-r-k-pied-tournant": { "taille": [616, 111], "decalage": [0, 0], "hauteurAvantRognage": 111, "raccord": false, "cellule": [77, 111], "images": 8, "pieds": [37, 110], "ancres": [[37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110], [37, 110]], "gundam": true, "src": "images/gundam/g-r-k-pied-tournant.png" }, "gundam/g-r-k-dash-coupe": { "taille": [705, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [141, 109], "images": 5, "pieds": [54, 108], "ancres": [[54, 108], [54, 108], [54, 108], [54, 108], [54, 108]], "gundam": true, "src": "images/gundam/g-r-k-dash-coupe.png" }, "gundam/g-r-k-haute": { "taille": [1128, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [141, 109], "images": 8, "pieds": [54, 108], "ancres": [[54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108]], "gundam": true, "src": "images/gundam/g-r-k-haute.png" }, "gundam/g-r-moulinet": { "taille": [1128, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [141, 109], "images": 8, "pieds": [54, 108], "ancres": [[54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108], [54, 108]], "gundam": true, "src": "images/gundam/g-r-moulinet.png" }, "gundam/g-r-k-pied": { "taille": [704, 92], "decalage": [0, 0], "hauteurAvantRognage": 92, "raccord": false, "cellule": [88, 92], "images": 8, "pieds": [33, 91], "ancres": [[33, 91], [33, 91], [33, 91], [33, 91], [33, 91], [33, 91], [33, 91], [33, 91]], "gundam": true, "src": "images/gundam/g-r-k-pied.png" }, "gundam/g-r-k-coup-poing": { "taille": [1045, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [95, 97], "images": 11, "pieds": [39, 96], "ancres": [[39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96]], "gundam": true, "src": "images/gundam/g-r-k-coup-poing.png" }, "gundam/g-r-poing-direct": { "taille": [1045, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [95, 97], "images": 11, "pieds": [39, 96], "ancres": [[39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96]], "gundam": true, "src": "images/gundam/g-r-poing-direct.png" }, "gundam/g-r-k-saut": { "taille": [1300, 104], "decalage": [0, 0], "hauteurAvantRognage": 104, "raccord": false, "cellule": [100, 104], "images": 13, "pieds": [39, 103], "ancres": [[39, 103], [39, 103], [39, 103], [39, 103], [39, 103], [39, 103], [39, 103], [39, 103], [39, 103], [39, 103], [39, 103], [39, 103], [39, 103]], "gundam": true, "src": "images/gundam/g-r-k-saut.png" }, "gundam/g-r-k-salto": { "taille": [1740, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [145, 109], "images": 12, "pieds": [33, 108], "ancres": [[33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108]], "gundam": true, "src": "images/gundam/g-r-k-salto.png" }, "gundam/g-r-k-saute-coupe": { "taille": [1305, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [145, 109], "images": 9, "pieds": [33, 108], "ancres": [[33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108], [33, 108]], "gundam": true, "src": "images/gundam/g-r-k-saute-coupe.png" }, "gundam/g-r-k-pied-saute": { "taille": [940, 104], "decalage": [0, 0], "hauteurAvantRognage": 104, "raccord": false, "cellule": [94, 104], "images": 10, "pieds": [33, 103], "ancres": [[33, 103], [33, 103], [33, 103], [33, 103], [33, 103], [33, 103], [33, 103], [33, 103], [33, 103], [33, 103]], "gundam": true, "src": "images/gundam/g-r-k-pied-saute.png" }, "gundam/g-r-k-chute": { "taille": [1272, 105], "decalage": [0, 0], "hauteurAvantRognage": 105, "raccord": false, "cellule": [159, 105], "images": 8, "pieds": [64, 104], "ancres": [[64, 104], [64, 104], [64, 104], [64, 104], [64, 104], [64, 104], [64, 104], [64, 104]], "gundam": true, "src": "images/gundam/g-r-k-chute.png" }, "gundam/g-r-mort": { "taille": [1272, 105], "decalage": [0, 0], "hauteurAvantRognage": 105, "raccord": false, "cellule": [159, 105], "images": 8, "pieds": [64, 104], "ancres": [[64, 104], [64, 104], [64, 104], [64, 104], [64, 104], [64, 104], [64, 104], [64, 104]], "gundam": true, "src": "images/gundam/g-r-mort.png" }, "gundam/g-r-touche": { "taille": [288, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [96, 97], "images": 3, "pieds": [55, 96], "ancres": [[55, 96], [55, 96], [55, 96]], "gundam": true, "src": "images/gundam/g-r-touche.png" }, "gundam/g-r-k-releve": { "taille": [285, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [95, 97], "images": 3, "pieds": [39, 96], "ancres": [[39, 96], [39, 96], [39, 96]], "gundam": true, "src": "images/gundam/g-r-k-releve.png" }, "gundam/g-r-k-releve-final": { "taille": [760, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [95, 97], "images": 8, "pieds": [39, 96], "ancres": [[39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96], [39, 96]], "gundam": true, "src": "images/gundam/g-r-k-releve-final.png" }, "gundam/g-r-k-charge": { "taille": [1260, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [105, 97], "images": 12, "pieds": [49, 96], "ancres": [[49, 96], [49, 96], [49, 96], [49, 96], [49, 96], [49, 96], [49, 96], [49, 96], [49, 96], [49, 96], [49, 96], [49, 96]], "gundam": true, "src": "images/gundam/g-r-k-charge.png" }, "gundam/g-r-parade": { "taille": [128, 81], "decalage": [0, 0], "hauteurAvantRognage": 81, "raccord": false, "cellule": [64, 81], "images": 2, "pieds": [31, 80], "ancres": [[31, 80], [31, 80]], "gundam": true, "src": "images/gundam/g-r-parade.png" }, "interface/portrait-boss": { "taille": [32, 32], "decalage": [0, 0], "hauteurAvantRognage": 32, "raccord": false, "src": "images/interface/portrait-boss.png" }, "logo/logo": { "taille": [441, 127], "decalage": [6, 12], "hauteurAvantRognage": 150, "raccord": false, "src": "images/logo/logo.png" }, "proto/r-w-garde": { "taille": [889, 116], "decalage": [0, 0], "hauteurAvantRognage": 116, "raccord": false, "cellule": [127, 116], "images": 7, "pieds": [23, 101], "ancres": [[23, 101], [23, 101], [23, 101], [23, 101], [23, 101], [23, 101], [23, 101]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 77, "corps": 102, "haut": 82, "bas": 65, "cx": 40 }, { "avant": 79, "corps": 93, "haut": 98, "bas": 75, "cx": 41 }, { "avant": 79, "corps": 97, "haut": 86, "bas": 70, "cx": 43 }, { "avant": 77, "corps": 97, "haut": 91, "bas": 73, "cx": 43 }, { "avant": 76, "corps": 97, "haut": 89, "bas": 73, "cx": 43 }, { "avant": 60, "corps": 97, "haut": 79, "bas": 68, "cx": 43 }, { "avant": 64, "corps": 97, "haut": 80, "bas": 63, "cx": 43 }], "lames": null, "src": "images/proto/r-w-garde.png" }, "proto/r-w-pret": { "taille": [944, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [118, 109], "images": 8, "pieds": [12, 92], "ancres": [[12, 92], [12, 92], [12, 92], [12, 92], [12, 92], [12, 92], [12, 92], [12, 92]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 91, "corps": 91, "haut": 81, "bas": 7, "cx": 40 }, { "avant": 102, "corps": 101, "haut": 38, "bas": 15, "cx": 45 }, { "avant": 103, "corps": 96, "haut": 55, "bas": 14, "cx": 42 }, { "avant": 103, "corps": 96, "haut": 55, "bas": 15, "cx": 42 }, { "avant": 102, "corps": 96, "haut": 55, "bas": 15, "cx": 42 }, { "avant": 103, "corps": 96, "haut": 55, "bas": 12, "cx": 42 }, { "avant": 95, "corps": 91, "haut": 75, "bas": 22, "cx": 40 }, { "avant": 97, "corps": 79, "haut": 81, "bas": 17, "cx": 34 }], "lames": null, "src": "images/proto/r-w-pret.png" }, "proto/r-w-marche": { "taille": [444, 120], "decalage": [0, 0], "hauteurAvantRognage": 120, "raccord": false, "cellule": [74, 120], "images": 6, "pieds": [43, 114], "ancres": [[43, 114], [43, 114], [43, 114], [43, 114], [43, 114], [43, 114]], "depot": true, "regarde": "droite", "proto": true, "ancre": "torse", "allonge": [{ "avant": 27, "corps": 28, "haut": 91, "bas": 11, "cx": -7 }, { "avant": 25, "corps": 28, "haut": 96, "bas": 17, "cx": -5 }, { "avant": 24, "corps": 28, "haut": 98, "bas": 11, "cx": -2 }, { "avant": 24, "corps": 29, "haut": 97, "bas": 10, "cx": -6 }, { "avant": 25, "corps": 28, "haut": 101, "bas": 10, "cx": -1 }, { "avant": 26, "corps": 28, "haut": 96, "bas": 11, "cx": -1 }], "lames": null, "src": "images/proto/r-w-marche.png" }, "proto/r-w-ruee": { "taille": [900, 120], "decalage": [0, 0], "hauteurAvantRognage": 120, "raccord": false, "cellule": [150, 120], "images": 6, "pieds": [74, 118], "ancres": [[74, 118], [74, 118], [74, 118], [74, 118], [74, 118], [74, 118]], "depot": true, "regarde": "droite", "proto": true, "ancre": "centre", "allonge": [{ "avant": 73, "corps": 73, "haut": 105, "bas": 49, "cx": 0 }, { "avant": 62, "corps": 47, "haut": 75, "bas": 39, "cx": 0 }, { "avant": 56, "corps": 61, "haut": 100, "bas": 70, "cx": 0 }, { "avant": 71, "corps": 70, "haut": 96, "bas": 55, "cx": 0 }, { "avant": 58, "corps": 56, "haut": 76, "bas": 41, "cx": 0 }, { "avant": 57, "corps": 66, "haut": 116, "bas": 65, "cx": 0 }], "lames": [[97.9, 50.6, 147, 41], [84.9, 65.1, 134.9, 62.7], [82.4, 48.2, 130, 33], [96.4, 54.3, 145, 42.5], [82.5, 66.6, 132, 59.5], [85.6, 42.6, 130, 19.6]], "src": "images/proto/r-w-ruee.png" }, "proto/r-w-lourd": { "taille": [1421, 124], "decalage": [0, 0], "hauteurAvantRognage": 124, "raccord": false, "cellule": [203, 124], "images": 7, "pieds": [18, 107], "ancres": [[18, 107], [18, 107], [18, 107], [18, 107], [18, 107], [18, 107], [18, 107]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 114, "corps": 113, "haut": 77, "bas": 32, "cx": 51 }, { "avant": 77, "corps": 121, "haut": 89, "bas": 48, "cx": 55 }, { "avant": 182, "corps": 181, "haut": 105, "bas": 64, "cx": 85 }, { "avant": 166, "corps": 148, "haut": 87, "bas": 47, "cx": 65 }, { "avant": 100, "corps": 111, "haut": 87, "bas": 48, "cx": 50 }, { "avant": 79, "corps": 109, "haut": 89, "bas": 48, "cx": 49 }, { "avant": 117, "corps": 116, "haut": 90, "bas": 36, "cx": 52 }], "lames": [[81.4, 60.3, 131.2, 65.2], [54, 67.1, 95, 38.5], [151.2, 33.4, 200, 22.5], [133.7, 45, 182.8, 35.7], [70.1, 54, 118, 39.5], [52.5, 61.3, 97, 38.5], [85.3, 49.3, 135, 44]], "src": "images/proto/r-w-lourd.png" }, "proto/r-w-fente": { "taille": [609, 105], "decalage": [0, 0], "hauteurAvantRognage": 105, "raccord": false, "cellule": [203, 105], "images": 3, "pieds": [12, 91], "ancres": [[12, 91], [12, 91], [12, 91]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 133, "corps": 133, "haut": 84, "bas": 62, "cx": 61 }, { "avant": 102, "corps": 109, "haut": 87, "bas": 49, "cx": 49 }, { "avant": 188, "corps": 187, "haut": 77, "bas": 25, "cx": 88 }], "lames": [[96.3, 29.8, 143.6, 13.5], [56.3, 76.7, 62.4, 27], [150, 40, 200, 40]], "src": "images/proto/r-w-fente.png" }, "proto/r-w-droit": { "taille": [875, 127], "decalage": [0, 0], "hauteurAvantRognage": 127, "raccord": false, "cellule": [175, 127], "images": 5, "pieds": [14, 112], "ancres": [[14, 112], [14, 112], [14, 112], [14, 112], [14, 112]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 157, "corps": 154, "haut": 109, "bas": 80, "cx": 71 }, { "avant": 143, "corps": 139, "haut": 102, "bas": 79, "cx": 64 }, { "avant": 149, "corps": 145, "haut": 105, "bas": 81, "cx": 66 }, { "avant": 124, "corps": 124, "haut": 100, "bas": 66, "cx": 57 }, { "avant": 101, "corps": 101, "haut": 97, "bas": 47, "cx": 45 }], "lames": [[123.6, 33.4, 171, 17.5], [110, 38.5, 157, 21.5], [115.9, 35.8, 163, 19], [90.8, 45.4, 138, 29], [66, 50, 115, 40]], "src": "images/proto/r-w-droit.png" }, "proto/r-w-pied": { "taille": [1218, 137], "decalage": [0, 0], "hauteurAvantRognage": 137, "raccord": false, "cellule": [174, 137], "images": 7, "pieds": [52, 121], "ancres": [[52, 121], [52, 121], [52, 121], [52, 121], [52, 121], [52, 121], [52, 121]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 81, "corps": 96, "haut": 101, "bas": 84, "cx": 42 }, { "avant": 105, "corps": 101, "haut": 97, "bas": 52, "cx": 45 }, { "avant": 59, "corps": 118, "haut": 118, "bas": 65, "cx": 35 }, { "avant": 63, "corps": 113, "haut": 118, "bas": 65, "cx": 31 }, { "avant": 31, "corps": 39, "haut": 107, "bas": 31, "cx": -2 }, { "avant": 105, "corps": 101, "haut": 97, "bas": 52, "cx": 45 }, { "avant": 81, "corps": 96, "haut": 101, "bas": 84, "cx": 42 }], "lames": null, "src": "images/proto/r-w-pied.png" }, "proto/r-w-accroupie": { "taille": [632, 135], "decalage": [0, 0], "hauteurAvantRognage": 135, "raccord": false, "cellule": [158, 135], "images": 4, "pieds": [57, 119], "ancres": [[57, 119], [57, 119], [57, 119], [57, 119]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 42, "corps": 93, "haut": 116, "bas": 36, "cx": 28 }, { "avant": 23, "corps": 59, "haut": 112, "bas": 30, "cx": 4 }, { "avant": 25, "corps": 64, "haut": 113, "bas": 32, "cx": 4 }, { "avant": 100, "corps": 98, "haut": 108, "bas": 91, "cx": 44 }], "lames": [[53.8, 64.4, 99, 43], [52, 65, 79.1, 23.1], [55, 61.2, 80.4, 18.1], [112.7, 42.7, 157, 19.5]], "src": "images/proto/r-w-accroupie.png" }, "proto/r-w-tornade": { "taille": [1200, 119], "decalage": [0, 0], "hauteurAvantRognage": 119, "raccord": false, "cellule": [120, 119], "images": 10, "pieds": [28, 105], "ancres": [[28, 105], [28, 105], [28, 105], [28, 105], [28, 105], [28, 105], [28, 105], [28, 105], [28, 105], [28, 105]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 68, "corps": 75, "haut": 68, "bas": 14, "cx": 31 }, { "avant": 68, "corps": 75, "haut": 68, "bas": 14, "cx": 31 }, { "avant": 80, "corps": 90, "haut": 55, "bas": 12, "cx": 39 }, { "avant": 80, "corps": 90, "haut": 55, "bas": 12, "cx": 39 }, { "avant": 80, "corps": 90, "haut": 58, "bas": 15, "cx": 39 }, { "avant": 80, "corps": 90, "haut": 58, "bas": 15, "cx": 39 }, { "avant": 78, "corps": 44, "haut": 82, "bas": 29, "cx": 9 }, { "avant": 88, "corps": 52, "haut": 71, "bas": 28, "cx": 18 }, { "avant": 34, "corps": 46, "haut": 77, "bas": 34, "cx": 14 }, { "avant": 38, "corps": 46, "haut": 74, "bas": 16, "cx": 15 }], "lames": [null, null, null, null, null, null, [58.4, 51.3, 105.6, 68], [66, 54.7, 115.8, 50.8], null, null], "src": "images/proto/r-w-tornade.png" }, "proto/r-w-saut": { "taille": [775, 233], "decalage": [0, 0], "hauteurAvantRognage": 233, "raccord": false, "cellule": [155, 233], "images": 5, "pieds": [84, 146], "ancres": [[84, 146], [84, 146], [84, 146], [84, 146], [84, 146]], "depot": true, "regarde": "droite", "proto": true, "ancre": "centre", "allonge": [{ "avant": -38, "corps": 50, "haut": 43, "bas": 34, "cx": 0 }, { "avant": -4, "corps": 54, "haut": 84, "bas": 25, "cx": 0 }, { "avant": 67, "corps": 68, "haut": 137, "bas": 91, "cx": 0 }, { "avant": 67, "corps": 68, "haut": 137, "bas": 91, "cx": 0 }, { "avant": 65, "corps": 66, "haut": 144, "bas": 96, "cx": 0 }], "lames": null, "src": "images/proto/r-w-saut.png" }, "proto/r-w-retombee": { "taille": [1206, 195], "decalage": [0, 0], "hauteurAvantRognage": 195, "raccord": false, "cellule": [201, 195], "images": 6, "pieds": [86, 139], "ancres": [[86, 139], [86, 139], [86, 139], [86, 139], [86, 139], [86, 139]], "depot": true, "regarde": "droite", "proto": true, "ancre": "centre", "allonge": [{ "avant": 27, "corps": 53, "haut": 135, "bas": 91, "cx": 0 }, { "avant": 30, "corps": 60, "haut": 91, "bas": 71, "cx": 0 }, { "avant": 69, "corps": 84, "haut": 59, "bas": 31, "cx": 0 }, { "avant": 23, "corps": 50, "haut": 58, "bas": 7, "cx": 0 }, { "avant": 17, "corps": 46, "haut": 59, "bas": 0, "cx": 0 }, { "avant": 0, "corps": 48, "haut": 27, "bas": 0, "cx": 0 }], "lames": [[80.2, 63.7, 113, 26], [85.6, 100.4, 86.6, 50.4], [107.5, 78.3, 155, 94], [77.8, 67.5, 109, 106.5], [85.3, 74.3, 87.8, 124.2], [86, 75.5, 86, 125.5]], "src": "images/proto/r-w-retombee.png" }, "proto/r-w-intro": { "taille": [1204, 113], "decalage": [0, 0], "hauteurAvantRognage": 113, "raccord": false, "cellule": [86, 113], "images": 14, "pieds": [12, 106], "ancres": [[12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106], [12, 106]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 53, "corps": 55, "haut": 92, "bas": 12, "cx": 22 }, { "avant": 52, "corps": 63, "haut": 91, "bas": 10, "cx": 26 }, { "avant": 52, "corps": 63, "haut": 91, "bas": 10, "cx": 26 }, { "avant": 41, "corps": 71, "haut": 87, "bas": 10, "cx": 30 }, { "avant": 41, "corps": 71, "haut": 87, "bas": 10, "cx": 30 }, { "avant": 52, "corps": 71, "haut": 93, "bas": 10, "cx": 30 }, { "avant": 52, "corps": 71, "haut": 93, "bas": 10, "cx": 30 }, { "avant": 53, "corps": 71, "haut": 87, "bas": 10, "cx": 30 }, { "avant": 53, "corps": 71, "haut": 87, "bas": 10, "cx": 30 }, { "avant": 53, "corps": 71, "haut": 90, "bas": 10, "cx": 30 }, { "avant": 53, "corps": 71, "haut": 90, "bas": 10, "cx": 30 }, { "avant": 43, "corps": 71, "haut": 90, "bas": 10, "cx": 30 }, { "avant": 43, "corps": 71, "haut": 90, "bas": 10, "cx": 30 }, { "avant": 52, "corps": 71, "haut": 93, "bas": 10, "cx": 30 }], "lames": null, "src": "images/proto/r-w-intro.png" }, "proto/r-w-bloc": { "taille": [994, 126], "decalage": [0, 0], "hauteurAvantRognage": 126, "raccord": false, "cellule": [142, 126], "images": 7, "pieds": [39, 111], "ancres": [[39, 111], [39, 111], [39, 111], [39, 111], [39, 111], [39, 111], [39, 111]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 92, "corps": 101, "haut": 107, "bas": 58, "cx": 38 }, { "avant": 76, "corps": 92, "haut": 89, "bas": 60, "cx": 40 }, { "avant": 82, "corps": 91, "haut": 98, "bas": 60, "cx": 39 }, { "avant": 79, "corps": 91, "haut": 96, "bas": 60, "cx": 39 }, { "avant": 76, "corps": 91, "haut": 92, "bas": 60, "cx": 39 }, { "avant": 75, "corps": 91, "haut": 90, "bas": 60, "cx": 39 }, { "avant": 74, "corps": 91, "haut": 89, "bas": 60, "cx": 39 }], "lames": null, "src": "images/proto/r-w-bloc.png" }, "proto/r-w-touche": { "taille": [572, 89], "decalage": [0, 0], "hauteurAvantRognage": 89, "raccord": false, "cellule": [143, 89], "images": 4, "pieds": [48, 73], "ancres": [[48, 73], [48, 73], [48, 73], [48, 73]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 39, "corps": 74, "haut": 64, "bas": 6, "cx": 14 }, { "avant": 39, "corps": 76, "haut": 63, "bas": 12, "cx": 17 }, { "avant": 34, "corps": 73, "haut": 70, "bas": 15, "cx": 16 }, { "avant": 93, "corps": 90, "haut": 38, "bas": 12, "cx": 37 }], "lames": null, "src": "images/proto/r-w-touche.png" }, "proto/r-w-souleve": { "taille": [1038, 171], "decalage": [0, 0], "hauteurAvantRognage": 171, "raccord": false, "cellule": [173, 171], "images": 6, "pieds": [58, 156], "ancres": [[58, 156], [58, 156], [58, 156], [58, 156], [58, 156], [58, 156]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 60, "corps": 53, "haut": 122, "bas": 105, "cx": -2 }, { "avant": 47, "corps": 57, "haut": 109, "bas": 81, "cx": 8 }, { "avant": 80, "corps": 113, "haut": 103, "bas": 52, "cx": 38 }, { "avant": 85, "corps": 87, "haut": 101, "bas": 48, "cx": 23 }, { "avant": 39, "corps": 63, "haut": 105, "bas": 80, "cx": 12 }, { "avant": 62, "corps": 58, "haut": 79, "bas": 47, "cx": 7 }], "lames": null, "src": "images/proto/r-w-souleve.png" }, "proto/r-w-chute": { "taille": [1288, 104], "decalage": [0, 0], "hauteurAvantRognage": 104, "raccord": false, "cellule": [184, 104], "images": 7, "pieds": [95, 94], "ancres": [[95, 94], [95, 94], [95, 94], [95, 94], [95, 94], [95, 94], [95, 94]], "depot": true, "regarde": "droite", "proto": true, "ancre": "centre", "allonge": [{ "avant": 62, "corps": 62, "haut": 75, "bas": 1, "cx": 0 }, { "avant": 39, "corps": 40, "haut": 84, "bas": 4, "cx": 0 }, { "avant": -10, "corps": 87, "haut": 79, "bas": 0, "cx": 0 }, { "avant": -11, "corps": 60, "haut": 89, "bas": 0, "cx": 0 }, { "avant": 22, "corps": 46, "haut": 73, "bas": 0, "cx": 0 }, { "avant": 56, "corps": 52, "haut": 62, "bas": -7, "cx": 0 }, { "avant": 56, "corps": 56, "haut": 62, "bas": 31, "cx": 0 }], "lames": null, "src": "images/proto/r-w-chute.png" }, "proto/r-w-mort1": { "taille": [1015, 113], "decalage": [0, 0], "hauteurAvantRognage": 113, "raccord": false, "cellule": [145, 113], "images": 7, "pieds": [72, 111], "ancres": [[72, 111], [72, 111], [72, 111], [72, 111], [72, 111], [72, 111], [72, 111]], "depot": true, "regarde": "droite", "proto": true, "ancre": "centre", "allonge": [{ "avant": 34, "corps": 63, "haut": 79, "bas": 54, "cx": 0 }, { "avant": 16, "corps": 64, "haut": 87, "bas": 54, "cx": 0 }, { "avant": 41, "corps": 71, "haut": 98, "bas": 69, "cx": 0 }, { "avant": 41, "corps": 71, "haut": 98, "bas": 69, "cx": 0 }, { "avant": 41, "corps": 67, "haut": 97, "bas": 70, "cx": 0 }, { "avant": 41, "corps": 71, "haut": 98, "bas": 69, "cx": 0 }, { "avant": 41, "corps": 67, "haut": 97, "bas": 70, "cx": 0 }], "lames": null, "src": "images/proto/r-w-mort1.png" }, "proto/r-w-mort2": { "taille": [966, 114], "decalage": [0, 0], "hauteurAvantRognage": 114, "raccord": false, "cellule": [161, 114], "images": 6, "pieds": [80, 111], "ancres": [[80, 111], [80, 111], [80, 111], [80, 111], [80, 111], [80, 111]], "depot": true, "regarde": "droite", "proto": true, "ancre": "centre", "allonge": [{ "avant": 41, "corps": 71, "haut": 98, "bas": 69, "cx": 0 }, { "avant": 17, "corps": 74, "haut": 89, "bas": 66, "cx": 0 }, { "avant": 7, "corps": 79, "haut": 23, "bas": 11, "cx": 0 }, { "avant": 4, "corps": 69, "haut": 38, "bas": 22, "cx": 0 }, { "avant": 2, "corps": 60, "haut": 82, "bas": 18, "cx": 0 }, { "avant": 2, "corps": 61, "haut": 85, "bas": 20, "cx": 0 }], "lames": null, "src": "images/proto/r-w-mort2.png" }, "proto/r-w-gisant": { "taille": [525, 66], "decalage": [0, 0], "hauteurAvantRognage": 66, "raccord": false, "cellule": [175, 66], "images": 3, "pieds": [87, 60], "ancres": [[87, 60], [87, 60], [87, 60]], "depot": true, "regarde": "droite", "proto": true, "ancre": "centre", "allonge": [{ "avant": -5, "corps": 86, "haut": 26, "bas": 1, "cx": 0 }, { "avant": 7, "corps": 79, "haut": 23, "bas": 11, "cx": 0 }, { "avant": 32, "corps": 82, "haut": 17, "bas": -2, "cx": 0 }], "lames": null, "src": "images/proto/r-w-gisant.png" }, "proto/r-w-victoire": { "taille": [1079, 151], "decalage": [0, 0], "hauteurAvantRognage": 151, "raccord": false, "cellule": [83, 151], "images": 13, "pieds": [18, 144], "ancres": [[18, 144], [18, 144], [18, 144], [18, 144], [18, 144], [18, 144], [18, 144], [18, 144], [18, 144], [18, 144], [18, 144], [18, 144], [18, 144]], "depot": true, "regarde": "droite", "proto": true, "ancre": "arriere", "allonge": [{ "avant": 33, "corps": 49, "haut": 130, "bas": 10, "cx": 17 }, { "avant": 34, "corps": 49, "haut": 129, "bas": 10, "cx": 17 }, { "avant": 54, "corps": 59, "haut": 102, "bas": 10, "cx": 22 }, { "avant": 42, "corps": 53, "haut": 103, "bas": 10, "cx": 18 }, { "avant": 41, "corps": 53, "haut": 105, "bas": 10, "cx": 18 }, { "avant": 43, "corps": 53, "haut": 105, "bas": 10, "cx": 18 }, { "avant": 54, "corps": 58, "haut": 86, "bas": 9, "cx": 23 }, { "avant": 57, "corps": 63, "haut": 81, "bas": 9, "cx": 26 }, { "avant": 55, "corps": 63, "haut": 97, "bas": 10, "cx": 26 }, { "avant": 52, "corps": 59, "haut": 137, "bas": 9, "cx": 24 }, { "avant": 48, "corps": 57, "haut": 140, "bas": 9, "cx": 23 }, { "avant": 55, "corps": 57, "haut": 90, "bas": 10, "cx": 23 }, { "avant": 47, "corps": 62, "haut": 66, "bas": 9, "cx": 25 }], "lames": null, "src": "images/proto/r-w-victoire.png" }, "roto/r-coup-leger": { "taille": [1390, 105], "decalage": [0, 0], "hauteurAvantRognage": 105, "raccord": false, "cellule": [139, 105], "images": 10, "pieds": [54, 98], "lames": [[39.7, 29.1, 26.2, 8.9], null, [38.6, 37.9, 19.6, 28.1], [38.9, 38.3, 20.1, 28.2], [58, 67.4, 79.1, 60.2], [52.3, 64.3, 33.9, 56.1], [89.5, 47.8, 136.4, 51.4], [88.4, 48.1, 113, 49.3], null, [27.9, 28, 12.1, 23.3]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "src": "images/roto/r-coup-leger.png" }, "roto/r-garde": { "taille": [1053, 108], "decalage": [0, 0], "hauteurAvantRognage": 108, "raccord": false, "cellule": [117, 108], "images": 9, "pieds": [72, 107], "bustes": [67, 67.8, 68.6, 68.3, 68.2, 67.5, 66.4, 66.7, 66.2], "lames": [[67.5, 36.2, 106.7, 10.1], [68.6, 35.8, 101.7, 2.3], [68.4, 36.5, 106.8, 9.3], [69, 36, 112.3, 17.7], [79.3, 35.2, 113.5, 28.7], [93.1, 42.4, 111.4, 44.1], [95.6, 45.7, 108, 47.4], [67.5, 41, 114.5, 41.3], [66.9, 36.4, 109.1, 15.6]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "ancres": [[67, 107], [68, 107], [69, 107], [68, 107], [68, 107], [68, 107], [66, 107], [67, 107], [66, 107]], "src": "images/roto/r-garde.png" }, "roto/r-marche": { "taille": [992, 106], "decalage": [0, 0], "hauteurAvantRognage": 106, "raccord": false, "cellule": [124, 106], "images": 8, "pieds": [66, 98], "bustes": [57.8, 56.4, 57.7, 58, 59.2, 62.6, 63.9, 58.5], "lames": [[70.7, 29.4, 117.4, 23.9], [68.8, 28.2, 115.4, 22.2], [69.7, 25.7, 116.1, 17.6], [69.3, 24.4, 115.5, 15.8], [71.4, 24.4, 117.5, 14.6], [75.2, 24.5, 121.4, 15.5], [73.1, 27.4, 119.6, 20.5], [70.2, 29.2, 116.8, 23.1]], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "ancres": [[58, 98], [56, 98], [58, 98], [58, 98], [59, 98], [63, 98], [64, 98], [58, 98]], "src": "images/roto/r-marche.png" }, "roto/r-estoc": { "taille": [1660, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [166, 97], "images": 10, "pieds": [64, 94], "lames": [[60.9, 33.5, 107.1, 42.5], [80.4, 39.4, 127.4, 38.7], [98.5, 41.8, 145.5, 41.1], [106.3, 42, 143.2, 42], [118.3, 43, 165.3, 40.1], [146.5, 39.9, 164.5, 40.7], [144.1, 40.3, 164.5, 40.6], null, null, [96.9, 41.8, 143.9, 41.1]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "src": "images/roto/r-estoc.png" }, "roto/r-parade": { "taille": [625, 103], "decalage": [0, 0], "hauteurAvantRognage": 103, "raccord": false, "cellule": [125, 103], "images": 5, "pieds": [69, 101], "lames": [[75.2, 24.4, 97.7, 9.6], [88.5, 51.9, 77.7, 34.8], [75.3, 38.7, 83, 71.3], [74.2, 37.6, 78.2, 84.5], [65.3, 42.6, 85.7, 84.9]], "indices": [0, 1, 2, 3, 4], "src": "images/roto/r-parade.png" }, "roto/r-saut": { "taille": [984, 163], "decalage": [0, 0], "hauteurAvantRognage": 163, "raccord": false, "cellule": [123, 163], "images": 8, "pieds": [50, 154], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-saut.png" }, "roto/r-coup-fort": { "taille": [3196, 112], "decalage": [0, 0], "hauteurAvantRognage": 112, "raccord": false, "cellule": [188, 112], "images": 17, "pieds": [87, 106], "lames": [null, [101.8, 33.9, 147.9, 43.4], [99.9, 32.2, 135.2, 37.2], null, [86.5, 22.7, 41.2, 10.2], [119.5, 32.2, 83.3, 2.1], [115.4, 29.9, 95.5, 10.8], [143, 66.2, 185, 44.8], null, [64.9, 84.3, 44.1, 90.7], [64.3, 84.7, 44.1, 90.7], null, null, [68.6, 81.3, 49.2, 86.8], null, [119.3, 68.8, 139.9, 69.6], [102, 56.1, 148.9, 59.6]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], "src": "images/roto/r-coup-fort.png" }, "roto/r-touche": { "taille": [804, 118], "decalage": [0, 0], "hauteurAvantRognage": 118, "raccord": false, "cellule": [134, 118], "images": 6, "pieds": [82, 111], "lames": [[30.7, 68.3, 2.3, 82.9], [30.7, 68.3, 2.3, 82.9], null, [36.1, 52.9, 12.8, 36.1], [53.8, 45.5, 60.5, 16.7], [63.9, 42.1, 94.2, 6]], "indices": [0, 1, 2, 3, 4, 5], "src": "images/roto/r-touche.png" }, "roto/r-mort": { "taille": [1456, 96], "decalage": [0, 0], "hauteurAvantRognage": 96, "raccord": false, "cellule": [182, 96], "images": 8, "pieds": [91, 85], "lames": [[62.9, 19.2, 109.6, 13.9], [53.1, 33.8, 26.3, 25.3], [62.5, 52.5, 30.1, 65.9], null, [90.7, 78.1, 71.8, 56.9], [115.9, 68.3, 131.3, 23.8], [123.2, 71, 141.2, 40.7], [95.1, 78.1, 139.8, 63.3]], "indices": [0, 1, 2, 3, 4, 10, 11, 12], "src": "images/roto/r-mort.png" }, "roto/r-sa-garde": { "taille": [1060, 101], "decalage": [0, 0], "hauteurAvantRognage": 101, "raccord": false, "cellule": [106, 101], "images": 10, "pieds": [49, 99], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[51, 97], [50, 97], [49, 96], [48, 97], [47, 97], [46, 98], [47, 99], [50, 99], [51, 98], [51, 96]], "src": "images/roto/r-sa-garde.png" }, "roto/r-sa-attaque": { "taille": [1720, 141], "decalage": [0, 0], "hauteurAvantRognage": 141, "raccord": false, "cellule": [215, 141], "images": 8, "pieds": [92, 133], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-sa-attaque.png" }, "roto/r-ni-garde": { "taille": [1250, 90], "decalage": [0, 0], "hauteurAvantRognage": 90, "raccord": false, "cellule": [125, 90], "images": 10, "pieds": [71, 89], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[73, 85], [72, 86], [70, 86], [70, 87], [71, 88], [71, 89], [71, 89], [71, 88], [71, 87], [72, 86]], "src": "images/roto/r-ni-garde.png" }, "roto/r-ni-course": { "taille": [750, 90], "decalage": [0, 0], "hauteurAvantRognage": 90, "raccord": false, "cellule": [150, 90], "images": 5, "pieds": [69, 86], "indices": [0, 1, 2, 3, 4], "ancres": [[73, 88], [82, 88], [72, 86], [62, 87], [57, 87]], "src": "images/roto/r-ni-course.png" }, "roto/r-ni-lancer": { "taille": [1376, 120], "decalage": [0, 0], "hauteurAvantRognage": 120, "raccord": false, "cellule": [172, 120], "images": 8, "pieds": [66, 113], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-ni-lancer.png" }, "roto/r-ni-bond": { "taille": [1155, 135], "decalage": [0, 0], "hauteurAvantRognage": 135, "raccord": false, "cellule": [165, 135], "images": 7, "pieds": [86, 130], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-ni-bond.png" }, "roto/r-ni-touche": { "taille": [938, 87], "decalage": [0, 0], "hauteurAvantRognage": 87, "raccord": false, "cellule": [134, 87], "images": 7, "pieds": [76, 82], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-ni-touche.png" }, "roto/r-ni-mort": { "taille": [1539, 142], "decalage": [0, 0], "hauteurAvantRognage": 142, "raccord": false, "cellule": [171, 142], "images": 9, "pieds": [88, 133], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "src": "images/roto/r-ni-mort.png" }, "roto/r-sa-marche": { "taille": [1240, 121], "decalage": [0, 0], "hauteurAvantRognage": 121, "raccord": false, "cellule": [124, 121], "images": 10, "pieds": [54, 120], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[54, 118], [54, 116], [52, 115], [50, 119], [53, 120], [58, 116], [61, 116], [56, 118], [51, 115], [51, 120]], "src": "images/roto/r-sa-marche.png" }, "roto/r-sa-touche": { "taille": [1001, 113], "decalage": [0, 0], "hauteurAvantRognage": 113, "raccord": false, "cellule": [143, 113], "images": 7, "pieds": [68, 106], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-sa-touche.png" }, "roto/r-sa-mort": { "taille": [1710, 126], "decalage": [0, 0], "hauteurAvantRognage": 126, "raccord": false, "cellule": [190, 126], "images": 9, "pieds": [102, 120], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "src": "images/roto/r-sa-mort.png" }, "roto/r-k-garde": { "taille": [1188, 100], "decalage": [0, 0], "hauteurAvantRognage": 100, "raccord": false, "cellule": [132, 100], "images": 9, "pieds": [75, 99], "lames": [null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "ancres": [[79, 95], [75, 97], [71, 94], [75, 98], [76, 94], [73, 96], [75, 95], [75, 96], [76, 96]], "src": "images/roto/r-k-garde.png" }, "roto/r-k-marche": { "taille": [840, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [105, 109], "images": 8, "pieds": [46, 108], "bustes": [41.9, 47.1, 43.3, 40.2, 42.9, 48.6, 43.3, 41], "lames": [null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "ancres": [[42, 108], [47, 108], [43, 108], [40, 108], [43, 108], [49, 108], [43, 108], [41, 108]], "src": "images/roto/r-k-marche.png" }, "roto/r-k-course": { "taille": [890, 91], "decalage": [0, 0], "hauteurAvantRognage": 91, "raccord": false, "cellule": [178, 91], "images": 5, "pieds": [85, 89], "bustes": [101.4, 106.1, 105.3, 103.1, 95.9], "lames": [null, null, null, null, null], "indices": [0, 1, 2, 3, 4], "ancres": [[109, 89], [83, 89], [94, 89], [115, 89], [96, 89]], "src": "images/roto/r-k-course.png" }, "roto/r-k-coupes": { "taille": [1496, 113], "decalage": [0, 0], "hauteurAvantRognage": 113, "raccord": false, "cellule": [187, 113], "images": 8, "pieds": [95, 111], "bustes": [97, 94.8, 102.1, 97, 116.8, 125.9, 112, 132.2], "lames": [null, null, null, null, [169.6, 56.6, 190.2, 29.7], null, [159.6, 93.1, 169.7, 91.9], null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "depot": true, "src": "images/roto/r-k-coupes.png" }, "roto/r-k-chute": { "taille": [1400, 116], "decalage": [0, 0], "hauteurAvantRognage": 116, "raccord": false, "cellule": [175, 116], "images": 8, "pieds": [89, 103], "bustes": [94.8, 78.8, 94.6, 49.8, 87.8, 128.2, 89.4, 89.3], "lames": [null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-k-chute.png" }, "roto/r-k-releve": { "taille": [399, 80], "decalage": [0, 0], "hauteurAvantRognage": 80, "raccord": false, "cellule": [133, 80], "images": 3, "pieds": [74, 78], "bustes": [69.7, 78.3, 69.2], "lames": [null, null, null], "indices": [0, 1, 2], "src": "images/roto/r-k-releve.png" }, "roto/r-k-saut": { "taille": [962, 108], "decalage": [0, 0], "hauteurAvantRognage": 108, "raccord": false, "cellule": [74, 108], "images": 13, "pieds": [38, 107], "bustes": [41.6, 44.9, 44.4, 44.7, 45, 41.3, 42, 40.6, 50.3, 49.4, 41.4, 43.7, 43.3], "lames": [null, null, null, null, null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "src": "images/roto/r-k-saut.png" }, "roto/r-k-salto": { "taille": [1440, 123], "decalage": [0, 0], "hauteurAvantRognage": 123, "raccord": false, "cellule": [120, 123], "images": 12, "pieds": [61, 118], "bustes": [93.2, 75.2, 73.8, 50.1, 54.3, 55.4, 68.5, 38.1, 44.5, 46.1, 64.3, 67.9], "lames": [null, null, null, null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "src": "images/roto/r-k-salto.png" }, "roto/r-k-pied": { "taille": [1112, 103], "decalage": [0, 0], "hauteurAvantRognage": 103, "raccord": false, "cellule": [139, 103], "images": 8, "pieds": [72, 101], "bustes": [78.2, 64.4, 59.5, 69.7, 69.2, 68.5, 61.1, 59.9], "lames": [null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-k-pied.png" }, "roto/r-k-pied-saute": { "taille": [1300, 115], "decalage": [0, 0], "hauteurAvantRognage": 115, "raccord": false, "cellule": [130, 115], "images": 10, "pieds": [51, 112], "bustes": [50.2, 55.3, 42.2, 41.8, 46.8, 46.7, 60.8, 61.3, 63.7, 61.7], "lames": [null, null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "src": "images/roto/r-k-pied-saute.png" }, "roto/r-k-combo2": { "taille": [882, 100], "decalage": [0, 0], "hauteurAvantRognage": 100, "raccord": false, "cellule": [126, 100], "images": 7, "pieds": [32, 98], "bustes": [47, 52.2, 48.6, 48.9, 49.3, 46.8, 49.1], "lames": [[94.8, 80.9, 104.2, 79.8], [68.2, 81.9, 82.2, 81.9], [68.2, 81.2, 96.8, 81.2], [96.1, 80.9, 105.5, 79.8], [96.1, 80.9, 105.5, 79.8], [108.3, 74.8, 122.9, 70.2], [101.3, 42.7, 114, 29.6]], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-k-combo2.png" }, "roto/r-k-final": { "taille": [822, 113], "decalage": [0, 0], "hauteurAvantRognage": 113, "raccord": false, "cellule": [137, 113], "images": 6, "pieds": [48, 111], "bustes": [66.4, 64.8, 90.4, 61.4, 75.1, 61.3], "lames": [[97, 48.9, 117.7, 26.7], [97.8, 49.6, 133.2, 6.1], null, [96.4, 95.6, 107.5, 95.6], null, [73.6, 93.6, 97.1, 93.6]], "indices": [0, 1, 2, 3, 4, 5], "depot": true, "src": "images/roto/r-k-final.png" }, "roto/r-k-montante": { "taille": [959, 140], "decalage": [0, 0], "hauteurAvantRognage": 140, "raccord": false, "cellule": [137, 140], "images": 7, "pieds": [60, 139], "bustes": [76.9, 69.9, 76.9, 75.5, 75.3, 71.8, 101.3], "lames": [[30.8, 47.7, -2.8, 18.6], [36.8, 47.1, 32.1, -8.7], [42.5, 49.9, 79.1, 7.5], [40.4, 53.2, 96.2, 48.5], null, [37.5, 107.2, 33.3, 65.4], [51.4, 66.6, -4.5, 69]], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "src": "images/roto/r-k-montante.png" }, "roto/r-k-haute": { "taille": [1128, 152], "decalage": [0, 0], "hauteurAvantRognage": 152, "raccord": false, "cellule": [141, 152], "images": 8, "pieds": [84, 150], "bustes": [94.6, 95.4, 93.5, 87.5, 93.2, 93.5, 92.4, 87.6], "lames": [[45.9, 64.9, 16.6, 98.7], [45.6, 58, -10.2, 62.8], [48.2, 51.4, 14.7, 22.3], [56.4, 45.2, 51.6, -10.6], [62.2, 46.6, 91.4, 12.8], [62.1, 55.4, 117.9, 50.5], null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-k-haute.png" }, "roto/r-k-charge": { "taille": [948, 142], "decalage": [0, 0], "hauteurAvantRognage": 142, "raccord": false, "cellule": [79, 142], "images": 12, "pieds": [44, 140], "bustes": [40.9, 40.9, 41.5, 41, 40.9, 40.4, 40.9, 30.1, 40.9, 29.5, 40.9, 46.2], "lames": [[19.9, 54.3, 25.8, -1.3], [19.9, 54.3, 25.8, -1.3], [19.9, 50.3, 25.8, -5.4], [19.9, 54.3, 25.8, -1.3], [19.9, 54.3, 25.8, -1.3], [19.9, 54.3, 25.8, -1.3], [19.9, 54.3, 25.8, -1.3], null, [19.9, 54.3, 25.8, -1.3], [20.9, 56.3, 24.7, 0.4], [19.9, 54.3, 25.8, -1.3], [28.2, 32.1, 4.8, 37.7]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "src": "images/roto/r-k-charge.png" }, "roto/r-k-saute-coupe": { "taille": [1188, 139], "decalage": [0, 0], "hauteurAvantRognage": 139, "raccord": false, "cellule": [132, 139], "images": 9, "pieds": [75, 137], "bustes": [62.9, 71.4, 64.5, 71.5, 71, 85.2, 83.8, 85.5, 99.9], "lames": [[51.5, 53.6, 55.1, -2.2], [50.3, 51.8, 56.2, -3.9], [51.5, 53.6, 55.2, -2.3], [50.3, 51.8, 56.2, -3.9], [50.6, 51.3, 56, -4.4], [51.1, 38.2, 13.6, 79.9], [36, 87.7, 48.6, 33.1], [40.2, 87.9, 48.3, 32.5], [43.7, 36.9, -9.1, 55.3]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "src": "images/roto/r-k-saute-coupe.png" }, "roto/r-k-balayage": { "taille": [966, 85], "decalage": [0, 0], "hauteurAvantRognage": 85, "raccord": false, "cellule": [161, 85], "images": 6, "pieds": [80, 83], "bustes": [86.2, 102.6, 85.9, 102.6, 119.3, 120.4], "lames": [null, null, null, null, null, [33, 12.8, 25.2, 14]], "indices": [0, 1, 2, 3, 4, 5], "depot": true, "src": "images/roto/r-k-balayage.png" }, "roto/r-k-dash-coupe": { "taille": [795, 114], "decalage": [0, 0], "hauteurAvantRognage": 114, "raccord": false, "cellule": [159, 114], "images": 5, "pieds": [50, 111], "bustes": [77.1, 64.7, 62.7, 62.7, 62.8], "lames": [[126.1, 24.6, 77.5, -3.3], [99.3, 49.6, 134.5, 6.1], [71.8, 97.3, 127.6, 93.1], [71.8, 97.3, 127.6, 93.1], [71.8, 97.8, 127.6, 93.1]], "indices": [0, 1, 2, 3, 4], "src": "images/roto/r-k-dash-coupe.png" }, "roto/r-k-fort": { "taille": [1099, 125], "decalage": [0, 0], "hauteurAvantRognage": 125, "raccord": false, "cellule": [157, 125], "images": 7, "pieds": [82, 123], "bustes": [128.2, 85.9, 92.2, 90.8, 89.1, 90.3, 105.6], "lames": [null, null, [71.7, 15.5, 15.9, 20.6], [59.1, 25, 31.1, 53.7], [44.1, 72.8, 56.6, 18.2], [48, 72.9, 55.9, 17.5], [51, 23.2, -1.9, 41.6]], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "src": "images/roto/r-k-fort.png" }, "roto/r-k-estoc": { "taille": [1057, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [151, 97], "images": 7, "pieds": [47, 95], "bustes": [54.1, 57.9, 65, 64.8, 78.5, 85.3, 68.1], "lames": [[13.8, 6.4, 5.9, 8.3], [29.1, 16.6, 18, 16.6], null, [88, 15.9, 77.9, 8.6], [129.1, 42.3, 137.8, 42.3], null, null], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "src": "images/roto/r-k-estoc.png" }, "roto/r-k-coupe-epaule": { "taille": [585, 98], "decalage": [0, 0], "hauteurAvantRognage": 98, "raccord": false, "cellule": [117, 98], "images": 5, "pieds": [42, 98], "bustes": [56.8, 57.1, 57.1, 57.1, 46], "lames": [[90.3, 36.1, 117.1, 6.1], [90.5, 36.3, 114.8, 9.7], [90.8, 36.6, 118.8, 4.9], [90.8, 36.6, 118.8, 4.9], null], "indices": [0, 1, 2, 3, 4], "depot": true, "src": "images/roto/r-k-coupe-epaule.png" }, "roto/r-k-pied-tournant": { "taille": [1056, 106], "decalage": [0, 0], "hauteurAvantRognage": 106, "raccord": false, "cellule": [132, 106], "images": 8, "pieds": [53, 104], "bustes": [58.8, 46.3, 40.5, 46.3, 58.5, 57.6, 65, 46.3], "lames": [[46.6, 13, 42.3, 4.3], null, null, null, null, null, [38.5, 60.7, 32.7, 67.4], null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "depot": true, "src": "images/roto/r-k-pied-tournant.png" }, "roto/r-k-releve-final": { "taille": [1192, 115], "decalage": [0, 0], "hauteurAvantRognage": 115, "raccord": false, "cellule": [149, 115], "images": 8, "pieds": [62, 113], "bustes": [73.3, 73.8, 75.6, 69.7, 67.7, 108.3, 66, 64.6], "lames": [[87.4, 96.5, 143.1, 91.5], [87.4, 97.1, 143.1, 91.9], [111, 51.7, 146.1, 8.1], [79.7, 10.8, 25.2, -1.8], null, null, null, [46, 10.4, -9.8, 15.5]], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "depot": true, "src": "images/roto/r-k-releve-final.png" }, "roto/r-k-coup-poing": { "taille": [1386, 107], "decalage": [0, 0], "hauteurAvantRognage": 107, "raccord": false, "cellule": [126, 107], "images": 11, "pieds": [40, 104], "bustes": [43.7, 44.9, 44.9, 45.5, 45.6, 43.8, 44.9, 45.9, 45.2, 44.9, 44.7], "lames": [null, null, null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "depot": true, "src": "images/roto/r-k-coup-poing.png" }, "roto/r-f-marche": { "taille": [1168, 129], "decalage": [0, 0], "hauteurAvantRognage": 129, "raccord": false, "cellule": [146, 129], "images": 8, "pieds": [55, 127], "bustes": [55.4, 60.5, 60.4, 56.2, 55.2, 61.8, 59, 55.2], "lames": [null, null, null, null, [46.4, 71.9, 24.1, 71.9], null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "ancres": [[96, 127], [60, 127], [56, 127], [56, 127], [54, 127], [74, 127], [56, 127], [61, 127]], "depot": true, "src": "images/roto/r-f-marche.png" }, "roto/r-f-course": { "taille": [775, 102], "decalage": [0, 0], "hauteurAvantRognage": 102, "raccord": false, "cellule": [155, 102], "images": 5, "pieds": [74, 100], "bustes": [96.9, 89.3, 90.3, 86.9, 90.2], "lames": [[73, 20, 53, 11.9], null, [39.1, 6.3, 17.1, 1.5], [77.1, 16.4, 40.1, 12], [56, 13.9, 41, 11.8]], "indices": [0, 1, 2, 3, 4], "ancres": [[97, 100], [62, 100], [71, 100], [94, 100], [91, 100]], "depot": true, "src": "images/roto/r-f-course.png" }, "roto/r-f-garde": { "taille": [768, 122], "decalage": [0, 0], "hauteurAvantRognage": 122, "raccord": false, "cellule": [96, 122], "images": 8, "pieds": [27, 121], "bustes": [44.9, 43, 41.9, 41.9, 43.2, 44.5, 44.8, 45], "lames": [null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "ancres": [[45, 121], [43, 121], [42, 121], [42, 121], [43, 121], [44, 121], [45, 121], [45, 121]], "depot": true, "src": "images/roto/r-f-garde.png" }, "roto/r-f-coupe1": { "taille": [1820, 121], "decalage": [0, 0], "hauteurAvantRognage": 121, "raccord": false, "cellule": [130, 121], "images": 14, "pieds": [25, 117], "bustes": [44.8, 44.2, 47.6, 47.4, 44.2, 46.5, 45.8, 50.5, 41.8, 55.4, 41.7, 45.8, 41.1, 40.8], "lames": [null, null, null, null, null, [44.3, 52.3, 69.8, 62.5], null, [84.6, 52.9, 126.6, 70], [39, 44.1, 79.7, 60.8], [33, 44.9, 71.9, 61.2], [38.8, 42.6, 81.9, 57.3], [38.8, 42.5, 81.7, 56.8], [39.9, 43.4, 81, 56.9], [40, 43.9, 81, 57.1]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], "depot": true, "src": "images/roto/r-f-coupe1.png" }, "roto/r-f-coupe3": { "taille": [1422, 133], "decalage": [0, 0], "hauteurAvantRognage": 133, "raccord": false, "cellule": [158, 133], "images": 9, "pieds": [58, 126], "bustes": [100.9, 67.6, 84.9, 67.6, 77.7, 67.4, 68.1, 68.8, 98.5], "lames": [[133.5, 71.5, 149.4, 56.5], [67, 104.9, 106, 106.9], [141.6, 92.6, 153.7, 50.1], [62.7, 103.9, 108, 107.8], [66, 105.1, 107, 107.9], [68, 105.8, 107, 108.1], [70, 104.2, 107, 106.3], [70, 101.9, 112, 104.6], [132.7, 73.3, 147.6, 54.4]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "depot": true, "src": "images/roto/r-f-coupe3.png" }, "roto/r-f-chute": { "taille": [1584, 120], "decalage": [0, 0], "hauteurAvantRognage": 120, "raccord": false, "cellule": [176, 120], "images": 9, "pieds": [86, 115], "bustes": [98.4, 85.2, 87.3, 98.4, 65.4, 80.7, 125.3, 88.9, 83.6], "lames": [null, null, null, null, null, [77.1, 85.9, 86.9, 115.2], [122.7, 88.1, 144.7, 99], [93.3, 104.1, 119.5, 112.7], null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "depot": true, "src": "images/roto/r-f-chute.png" }, "roto/r-f-releve": { "taille": [396, 105], "decalage": [0, 0], "hauteurAvantRognage": 105, "raccord": false, "cellule": [132, 105], "images": 3, "pieds": [59, 101], "bustes": [57.4, 65.4, 73.3], "lames": [null, null, null], "indices": [0, 1, 2], "depot": true, "src": "images/roto/r-f-releve.png" }, "roto/r-b-marche": { "taille": [952, 118], "decalage": [0, 0], "hauteurAvantRognage": 118, "raccord": false, "cellule": [119, 118], "images": 8, "pieds": [48, 115], "bustes": [48.1, 48.9, 48.7, 44.3, 46, 46.5, 48.7, 48], "lames": [null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "ancres": [[49, 115], [49, 115], [47, 115], [42, 115], [83, 115], [47, 115], [49, 115], [48, 115]], "depot": true, "src": "images/roto/r-b-marche.png" }, "roto/r-b-course": { "taille": [1395, 100], "decalage": [0, 0], "hauteurAvantRognage": 100, "raccord": false, "cellule": [155, 100], "images": 9, "pieds": [81, 95], "bustes": [90.1, 77.7, 76.8, 79, 76.9, 74.2, 77.4, 73.7, 75.5], "lames": [[85.2, 56, 65.4, 58.8], [89, 50.3, 48.1, 51.4], [90, 50.3, 49.1, 51.9], [89.4, 51.2, 55.5, 52.9], [87.5, 54.5, 53.7, 51.8], [86.1, 53.4, 52.4, 51.6], [89.4, 53.2, 55.5, 54.2], [85, 51.6, 52.1, 52.9], null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "ancres": [[77, 95], [79, 95], [77, 95], [75, 95], [77, 95], [55, 95], [78, 95], [43, 95], [93, 95]], "depot": true, "src": "images/roto/r-b-course.png" }, "roto/r-b-garde": { "taille": [600, 116], "decalage": [0, 0], "hauteurAvantRognage": 116, "raccord": false, "cellule": [60, 116], "images": 10, "pieds": [38, 109], "bustes": [34, 33.9, 33.9, 34, 34, 34, 34, 34.1, 34.1, 34.1], "lames": [[40.5, 51.6, 40.5, 103.1], [40.5, 51.6, 40.8, 103.1], [40.2, 51.6, 41, 92.1], [40.3, 51.6, 41.3, 103.1], [40.6, 51.6, 40.4, 103.1], [40.6, 51.6, 40.7, 103.1], [40.5, 51.6, 40.5, 103.1], [40.5, 51.6, 40.5, 103.1], [40.5, 51.6, 40.5, 103.1], [40.5, 51.6, 40.5, 103.1]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[34, 109], [34, 109], [34, 109], [34, 109], [34, 109], [34, 109], [34, 109], [34, 109], [34, 109], [34, 109]], "depot": true, "src": "images/roto/r-b-garde.png" }, "roto/r-b-lancer": { "taille": [792, 121], "decalage": [0, 0], "hauteurAvantRognage": 121, "raccord": false, "cellule": [132, 121], "images": 6, "pieds": [43, 113], "bustes": [56.3, 54.2, 55.7, 57.7, 42.2, 42.8], "lames": [[50.8, 64.4, 49.4, 115.9], [49.9, 64.4, 48.4, 115.9], [50.8, 64.4, 49.4, 115.9], [44.2, 62.7, 48.4, 95.1], [29.6, 77.1, 23.9, 99.5], [39.2, 71.3, 32.5, 98.8]], "indices": [0, 1, 2, 3, 4, 5], "depot": true, "src": "images/roto/r-b-lancer.png" }, "roto/r-b-coup": { "taille": [1672, 131], "decalage": [0, 0], "hauteurAvantRognage": 131, "raccord": false, "cellule": [152, 131], "images": 11, "pieds": [58, 124], "bustes": [62.7, 66.7, 81.8, 69.4, 63.6, 57.3, 51, 63.3, 62.3, 58, 63.1], "lames": [[54.7, 85.5, 40.6, 111.8], null, null, [69.4, 75.6, 39.9, 87.7], null, null, null, null, [73.2, 68.6, 59.9, 104.3], [73.6, 67.2, 76.8, 105.7], null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "depot": true, "src": "images/roto/r-b-coup.png" }, "roto/r-b-chute": { "taille": [1107, 98], "decalage": [0, 0], "hauteurAvantRognage": 98, "raccord": false, "cellule": [123, 98], "images": 9, "pieds": [58, 94], "bustes": [72.7, 58.1, 56.4, 52, 48.1, 46.9, 53.9, 54, 57.8], "lames": [null, [52, 81.9, 86.1, 72], null, null, [47.4, 68.8, 22, 78.2], null, null, null, [56.5, 60, 48, 80.7]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "depot": true, "src": "images/roto/r-b-chute.png" }, "roto/r-b-mort": { "taille": [1469, 137], "decalage": [0, 0], "hauteurAvantRognage": 137, "raccord": false, "cellule": [113, 137], "images": 13, "pieds": [65, 127], "bustes": [63.4, 65.7, 71.1, 61.9, 64.7, 65.4, 63.1, 71.8, 71.5, 56.6, 55.2, 62.3, 62], "lames": [null, null, null, null, null, null, null, null, null, [53.9, 103.4, 22.5, 111.1], null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "depot": true, "src": "images/roto/r-b-mort.png" }, "roto/r-f-coupe2": { "taille": [2262, 141], "decalage": [0, 0], "hauteurAvantRognage": 141, "raccord": false, "cellule": [174, 141], "images": 13, "pieds": [51, 136], "bustes": [67.4, 74, 72.8, 70.8, 68.6, 73.9, 66.7, 68.8, 72.6, 56.3, 80.2, 80.2, 89.5], "lames": [[77.9, 66.9, 119.8, 85.5], null, null, null, [78, 44.3, 96, 46.3], [90, 61.2, 104.1, 63.3], null, [8.4, 68.6, 27.3, 36.2], [36.3, 14.5, 4.1, 35.2], [24, 11.8, 6, 15.2], [133.5, 26, 104.8, 11.5], [109.9, 11.3, 133, 22.9], [141.7, 77.8, 172.9, 51]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "depot": true, "src": "images/roto/r-f-coupe2.png" }, "roto/r-f-envol": { "taille": [2210, 160], "decalage": [0, 0], "hauteurAvantRognage": 160, "raccord": false, "cellule": [170, 160], "images": 13, "pieds": [55, 152], "bustes": [62.2, 62.2, 60, 63, 50.3, 52.9, 51, 65.4, 53.4, 41.8, 45, 56.2, 53.2], "lames": [[89.7, 76.6, 116.5, 90], [77.9, 6.4, 96.2, 10.3], [59.1, 12.5, 78.1, 15.5], null, [11.5, 33.8, 20.3, 12.7], [4.1, 67.1, 3.4, 51], [23.8, 82.1, 5.6, 59.4], null, [56.8, 110.4, 22.6, 94.8], [102, 103, 99.2, 143.2], null, [126.1, 86.9, 148.9, 84.3], [126.9, 100.9, 167.8, 69]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "depot": true, "src": "images/roto/r-f-envol.png" }, "roto/r-f-grande-coupe": { "taille": [1880, 146], "decalage": [0, 0], "hauteurAvantRognage": 146, "raccord": false, "cellule": [188, 146], "images": 10, "pieds": [70, 138], "bustes": [86.3, 88.3, 92.8, 75.2, 99.4, 113.4, 98.8, 90.7, 81.7, 108.4], "lames": [null, [37.2, 65.6, 49.4, 42.2], [43.8, 14.7, 9.4, 37], [32.9, 16.7, 3.8, 24.3], [81.1, 9.7, 110.1, 20.7], [161.2, 87.2, 185.6, 66.7], [115.4, 100.3, 156.6, 117.9], [119.7, 103.6, 146.8, 115.4], [123.4, 97.9, 178.3, 116], [117.9, 94.1, 79, 96.4]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "depot": true, "src": "images/roto/r-f-grande-coupe.png" }, "roto/r-f-parade": { "taille": [1650, 121], "decalage": [0, 0], "hauteurAvantRognage": 121, "raccord": false, "cellule": [150, 121], "images": 11, "pieds": [41, 118], "bustes": [63.8, 61.7, 69.7, 62.6, 64.9, 63.3, 64.7, 61.8, 68.2, 85.8, 68.1], "lames": [null, null, [79.3, 79.3, 105.6, 52.6], null, [58.2, 64.8, 31.4, 37.6], [52.2, 72.4, 14.4, 56.4], [55, 79.9, 15, 76.4], [78.5, 85.8, 96.2, 75.3], [133.8, 22.4, 148, 28], null, [60.9, 7, 106, 2.1]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "depot": true, "src": "images/roto/r-f-parade.png" }, "roto/r-f-pied": { "taille": [695, 119], "decalage": [0, 0], "hauteurAvantRognage": 119, "raccord": false, "cellule": [139, 119], "images": 5, "pieds": [63, 113], "bustes": [50.7, 60.9, 63.4, 68.6, 81.4], "lames": [[52, 68.4, 84.3, 78.8], [75.9, 61.4, 107.7, 80.8], [57.3, 61.7, 28.4, 80.9], [61.7, 54.9, 36, 54.8], null], "indices": [0, 1, 2, 3, 4], "depot": true, "src": "images/roto/r-f-pied.png" }, "roto/r-f-poings": { "taille": [1547, 119], "decalage": [0, 0], "hauteurAvantRognage": 119, "raccord": false, "cellule": [119, 119], "images": 13, "pieds": [28, 115], "bustes": [45.1, 45.3, 45.2, 45.6, 45.1, 47.3, 45.1, 47, 47.1, 45.9, 53.5, 54, 53.4], "lames": [null, null, null, null, null, null, null, null, null, null, [40.6, 80.7, 12.2, 108.3], [40.8, 81.5, 11.9, 108.6], [40.8, 81.5, 11.9, 108.6]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "depot": true, "src": "images/roto/r-f-poings.png" }, "roto/r-f-revers": { "taille": [1573, 130], "decalage": [0, 0], "hauteurAvantRognage": 130, "raccord": false, "cellule": [143, 130], "images": 11, "pieds": [32, 125], "bustes": [66.5, 59.3, 66.6, 59.3, 59.3, 59.4, 59.6, 58.7, 50.2, 53.9, 52.3], "lames": [null, [53, 7.9, 81.9, 1.7], [34.1, 10.3, 55.9, 5.5], [40, 9.1, 77.9, 2.6], [50, 14.5, 97, 18.5], null, [87.2, 18.1, 119.1, 24.7], null, [119.1, 30.6, 132.3, 5.2], null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "depot": true, "src": "images/roto/r-f-revers.png" }, "roto/r-x-arc": { "taille": [890, 183], "decalage": [0, 0], "hauteurAvantRognage": 183, "raccord": false, "cellule": [178, 183], "images": 5, "pieds": [42, 169], "indices": [0, 1, 2, 3, 4], "depot": true, "ancres": [[42, 175], [42, 173], [42, 179], [42, 179], [42, 179]], "src": "images/roto/r-x-arc.png" }, "roto/r-x-garde": { "taille": [1092, 142], "decalage": [0, 0], "hauteurAvantRognage": 142, "raccord": false, "cellule": [156, 142], "images": 7, "pieds": [66, 136], "indices": [0, 1, 2, 3, 4, 5, 6], "ancres": [[66, 136], [66, 136], [66, 136], [66, 136], [66, 136], [66, 136], [66, 136]], "depot": true, "src": "images/roto/r-x-garde.png" }, "roto/r-x-course": { "taille": [1932, 135], "decalage": [0, 0], "hauteurAvantRognage": 135, "raccord": false, "cellule": [322, 135], "images": 6, "pieds": [179, 128], "indices": [0, 1, 2, 3, 4, 5], "ancres": [[179, 128], [179, 128], [179, 128], [179, 129], [179, 128], [179, 128]], "depot": true, "src": "images/roto/r-x-course.png" }, "roto/r-x-grande-griffe": { "taille": [1456, 123], "decalage": [0, 0], "hauteurAvantRognage": 123, "raccord": false, "cellule": [208, 123], "images": 7, "pieds": [19, 114], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "ancres": [[19, 119], [19, 116], [19, 119], [19, 118], [19, 120], [19, 119], [19, 115]], "src": "images/roto/r-x-grande-griffe.png" }, "roto/r-x-foreuse": { "taille": [1392, 186], "decalage": [0, 0], "hauteurAvantRognage": 186, "raccord": false, "cellule": [232, 186], "images": 6, "pieds": [71, 162], "indices": [0, 1, 2, 3, 4, 5], "depot": true, "ancres": [[71, 162], [71, 183], [71, 167], [71, 167], [71, 157], [71, 168]], "src": "images/roto/r-x-foreuse.png" }, "roto/r-x-chute": { "taille": [1491, 119], "decalage": [0, 0], "hauteurAvantRognage": 119, "raccord": false, "cellule": [213, 119], "images": 7, "pieds": [83, 103], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "ancres": [[83, 106], [83, 109], [83, 115], [83, 111], [83, 112], [83, 108], [83, 103]], "src": "images/roto/r-x-chute.png" }, "roto/r-x-marche": { "taille": [1880, 131], "decalage": [0, 0], "hauteurAvantRognage": 131, "raccord": false, "cellule": [235, 131], "images": 8, "pieds": [67, 122], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "ancres": [[67, 122], [67, 122], [67, 122], [67, 122], [67, 123], [67, 122], [67, 122], [67, 122]], "depot": true, "src": "images/roto/r-x-marche.png" }, "roto/r-x-griffe": { "taille": [1208, 119], "decalage": [0, 0], "hauteurAvantRognage": 119, "raccord": false, "cellule": [151, 119], "images": 8, "pieds": [16, 115], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "depot": true, "ancres": [[16, 116], [16, 115], [16, 115], [16, 117], [16, 115], [16, 116], [16, 114], [16, 114]], "src": "images/roto/r-x-griffe.png" }, "roto/r-x-tourbillon": { "taille": [1004, 210], "decalage": [0, 0], "hauteurAvantRognage": 210, "raccord": false, "cellule": [251, 210], "images": 4, "pieds": [67, 197], "indices": [0, 1, 2, 3], "depot": true, "ancres": [[67, 208], [67, 202], [67, 198], [67, 192]], "src": "images/roto/r-x-tourbillon.png" }, "roto/r-x-rafale": { "taille": [876, 175], "decalage": [0, 0], "hauteurAvantRognage": 175, "raccord": false, "cellule": [219, 175], "images": 4, "pieds": [83, 164], "indices": [0, 1, 2, 3], "depot": true, "ancres": [[83, 160], [83, 172], [83, 167], [83, 164]], "src": "images/roto/r-x-rafale.png" }, "roto/r-x-pied": { "taille": [1656, 254], "decalage": [0, 0], "hauteurAvantRognage": 254, "raccord": false, "cellule": [207, 254], "images": 8, "pieds": [111, 233], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "depot": true, "ancres": [[111, 242], [111, 228], [111, 244], [111, 249], [111, 240], [111, 245], [111, 238], [111, 239]], "src": "images/roto/r-x-pied.png" }, "roto/r-x-plongeon": { "taille": [1056, 154], "decalage": [0, 0], "hauteurAvantRognage": 154, "raccord": false, "cellule": [176, 154], "images": 6, "pieds": [73, 144], "indices": [0, 1, 2, 3, 4, 5], "depot": true, "ancres": [[73, 140], [73, 150], [73, 151], [73, 149], [73, 151], [73, 145]], "src": "images/roto/r-x-plongeon.png" }, "roto/r-x-touche": { "taille": [1572, 167], "decalage": [0, 0], "hauteurAvantRognage": 167, "raccord": false, "cellule": [262, 167], "images": 6, "pieds": [72, 157], "indices": [0, 1, 2, 3, 4, 5], "depot": true, "ancres": [[72, 149], [72, 151], [72, 150], [72, 160], [72, 158], [72, 162]], "src": "images/roto/r-x-touche.png" }, "roto/r-x-releve": { "taille": [840, 142], "decalage": [0, 0], "hauteurAvantRognage": 142, "raccord": false, "cellule": [120, 142], "images": 7, "pieds": [20, 135], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "ancres": [[20, 138], [20, 138], [20, 139], [20, 137], [20, 140], [20, 136], [20, 137]], "src": "images/roto/r-x-releve.png" }, "roto/r-x-intro": { "taille": [1365, 131], "decalage": [0, 0], "hauteurAvantRognage": 131, "raccord": false, "cellule": [195, 131], "images": 7, "pieds": [20, 122], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "ancres": [[20, 123], [20, 127], [20, 127], [20, 128], [20, 126], [20, 128], [20, 129]], "src": "images/roto/r-x-intro.png" }, "roto/r-x-marche2": { "taille": [2499, 179], "decalage": [0, 0], "hauteurAvantRognage": 179, "raccord": false, "cellule": [357, 179], "images": 7, "pieds": [185, 168], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "ancres": [[185, 168], [185, 169], [185, 168], [185, 168], [185, 168], [185, 168], [185, 168]], "src": "images/roto/r-x-marche2.png" } };

// src/js/outils.js
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var rand = (a, b) => a + Math.random() * (b - a);
var frac = (x) => x - Math.floor(x);
var hash = (n) => frac(Math.sin(n * 127.1 + 311.7) * 43758.5453);
var memoire = { toiles: 0, octets: 0 };
var toile = (w, h) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  memoire.toiles++;
  memoire.octets += w * h * 4;
  return c;
};

// src/js/sprites.js
var S = {};
var images = /* @__PURE__ */ new Map();
function chargerImage(src) {
  if (!images.has(src)) images.set(src, new Promise((ok) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => ok(null);
    i.src = src;
  }));
  return images.get(src);
}
async function chargerSprites() {
  await Promise.all(Object.entries(ART).map(async ([cle2, d]) => {
    const img = await chargerImage(d.src);
    if (!img) return;
    const nom = cle2.split("/")[1];
    if (!d.cellule) {
      S[nom] = { img, w: img.width, h: img.height, decalage: d.decalage || [0, 0] };
      return;
    }
    const [cw, ch] = d.cellule, n = d.images;
    const lecture = toile(img.width, img.height), g = lecture.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const px = g.getImageData(0, 0, lecture.width, lecture.height);
    const c = img;
    const ancres = [], hauts = [];
    for (let k = 0; k < n; k++) {
      let bas = -1;
      for (let y = ch - 1; y >= 0 && bas < 0; y--) for (let x = 0; x < cw; x++) if (px.data[(y * c.width + k * cw + x) * 4 + 3] > 0) {
        bas = y;
        break;
      }
      let somme = 0, nb = 0, haut = ch;
      for (let y = Math.max(0, bas - 4); y <= bas; y++) for (let x = 0; x < cw; x++) if (px.data[(y * c.width + k * cw + x) * 4 + 3] > 0) {
        somme += x;
        nb++;
      }
      for (let y = 0; y < ch && haut === ch; y++) for (let x = 0; x < cw; x++) if (px.data[(y * c.width + k * cw + x) * 4 + 3] > 0) {
        haut = y;
        break;
      }
      ancres.push(d.ancres ? d.ancres[k] : d.pieds ? d.pieds : [nb ? Math.round(somme / nb) : cw >> 1, bas < 0 ? ch : bas + 1]);
      hauts.push(bas + 1 - haut);
    }
    S[nom] = { img: c, px, cw, ch, n, ancres, hauts, decor: d.decor || null, lames: d.lames || null, regarde: d.regarde || "droite", depot: !!d.depot, blanc: null, souillures: [], allonge: d.allonge || null, ancre: d.ancre || "pieds" };
  }));
}
function poserCase(g, img, s, k, versGauche, dx, dy, y0 = 0, h = s.ch) {
  if (!versGauche) {
    g.drawImage(img, k * s.cw, y0, s.cw, h, dx, dy + y0, s.cw, h);
    return;
  }
  g.scale(-1, 1);
  g.drawImage(img, k * s.cw, y0, s.cw, h, -(dx + s.cw), dy + y0, s.cw, h);
  g.scale(-1, 1);
}
var blanche = toile(256, 256);
var gb = blanche.getContext("2d");
var NIVEAUX = 12;
var ROUGES = [[70, 6, 12], [112, 10, 20], [150, 16, 26], [178, 30, 34]];
function bruitTache(x, y) {
  const v = (a, b, t) => {
    const i = Math.floor(a / t), j = Math.floor(b / t), fx = a / t - i, fy = b / t - j;
    const h = (p, q) => hash(p * 57 + q * 131);
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    return (h(i, j) * (1 - sx) + h(i + 1, j) * sx) * (1 - sy) + (h(i, j + 1) * (1 - sx) + h(i + 1, j + 1) * sx) * sy;
  };
  return v(x, y, 7) * 0.55 + v(x + 40, y, 3) * 0.3 + hash(x * 13 + y * 7) * 0.15;
}
function souiller(s, niveau) {
  const seuil = 0.14 + niveau / NIVEAUX * 0.48;
  const c = toile(s.img.width, s.img.height), g = c.getContext("2d");
  const d = new ImageData(new Uint8ClampedArray(s.px.data), s.img.width, s.img.height), p = d.data;
  for (let k = 0; k < s.n; k++) {
    const [ax, ay] = s.ancres[k];
    for (let y = 0; y < s.ch; y++) for (let x = 0; x < s.cw; x++) {
      const i = (y * s.img.width + k * s.cw + x) * 4;
      if (p[i + 3] === 0) continue;
      const lum = p[i];
      if (lum < 120) continue;
      const bas = (ay - y) / 80;
      const n = bruitTache(x - ax, y - ay) + (bas < 0.35 ? -0.08 : 0) + (bas > 0.75 ? 0.1 : 0);
      if (n < seuil) {
        const r = ROUGES[Math.min(3, Math.floor(lum / 256 * 4 + (seuil - n) * 3))];
        p[i] = r[0];
        p[i + 1] = r[1];
        p[i + 2] = r[2];
      }
    }
  }
  g.putImageData(d, 0, 0);
  return { img: c };
}
function dessiner(nom, k, x, y, dir, o = {}) {
  const s = S[nom];
  if (!s) return false;
  k = Math.max(0, Math.min(s.n - 1, k | 0));
  let src = s;
  if (o.blanc) {
    k = Math.max(0, Math.min(s.n - 1, k | 0));
    const [ax2, ay2] = s.ancres[k], vg = dir < 0 === (s.regarde === "droite");
    if (blanche.width < s.cw || blanche.height < s.ch) {
      blanche.width = Math.max(blanche.width, s.cw);
      blanche.height = Math.max(blanche.height, s.ch);
    }
    gb.globalCompositeOperation = "source-over";
    gb.clearRect(0, 0, s.cw, s.ch);
    poserCase(gb, s.img, s, k, vg, 0, 0);
    gb.globalCompositeOperation = "source-in";
    gb.fillStyle = "#f2f1ec";
    gb.fillRect(0, 0, s.cw, s.ch);
    gb.globalCompositeOperation = "source-over";
    const dx2 = vg ? Math.round(x) - (s.cw - ax2) : Math.round(x) - ax2;
    if (o.alpha != null) ctx.globalAlpha = o.alpha;
    ctx.drawImage(blanche, 0, 0, s.cw, s.ch, dx2, Math.round(y) - ay2, s.cw, s.ch);
    if (o.alpha != null) ctx.globalAlpha = 1;
    return true;
  } else if (o.souillure > 0.02) {
    let niv = Math.min(NIVEAUX, Math.ceil(o.souillure * NIVEAUX));
    while (niv > 0 && !s.souillures[niv]) niv--;
    if (niv > 0) src = s.souillures[niv];
  }
  const [ax, ay] = s.ancres[k];
  const versGauche = dir < 0 === (s.regarde === "droite");
  const dx = versGauche ? Math.round(x) - (s.cw - ax) : Math.round(x) - ax;
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  poserCase(ctx, src.img, s, k, versGauche, dx, Math.round(y) - ay);
  if (o.alpha != null) ctx.globalAlpha = 1;
  return true;
}
var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
var trames = {};
function trame(niveau, couleur = "#000") {
  const cle2 = niveau + couleur;
  if (trames[cle2]) return trames[cle2];
  const c = toile(4, 4), g = c.getContext("2d");
  g.fillStyle = couleur;
  for (let i = 0; i < 16; i++) if (BAYER[i] < niveau) g.fillRect(i % 4, i >> 2, 1, 1);
  return trames[cle2] = c;
}
var motifs = {};
function motif(g, niveau, couleur = "#000") {
  const cle2 = niveau + couleur;
  return motifs[cle2] || (motifs[cle2] = g.createPattern(trame(niveau, couleur), "repeat"));
}
var tampon = toile(400, 260);
var gt = tampon.getContext("2d");
function dessinerFondu(nom, k, x, y, dir, reste, o = {}) {
  const s = S[nom];
  if (!s || reste <= 0) return;
  k = Math.max(0, Math.min(s.n - 1, k | 0));
  const niveau = Math.max(1, Math.min(15, Math.round(reste * 16)));
  const cw = Math.min(s.cw, tampon.width), ch = Math.min(s.ch, tampon.height);
  gt.clearRect(0, 0, cw, ch);
  gt.globalCompositeOperation = "source-over";
  const [ax, ay] = s.ancres[k], versGauche = dir < 0 === (s.regarde === "droite");
  poserCase(gt, s.img, s, k, versGauche, 0, 0);
  gt.globalCompositeOperation = "destination-in";
  const dx = versGauche ? Math.round(x) - (s.cw - ax) : Math.round(x) - ax, dy = Math.round(y) - ay;
  gt.fillStyle = motif(gt, niveau);
  gt.save();
  gt.translate(-(dx % 4 + 4) % 4, -(dy % 4 + 4) % 4);
  gt.fillRect(0, 0, cw + 4, ch + 4);
  gt.restore();
  gt.globalCompositeOperation = "source-over";
  ctx.drawImage(tampon, 0, 0, s.cw, s.ch, dx, dy, s.cw, s.ch);
}
function lameA(nom, k, x, y, dir) {
  const s = S[nom], l = s?.lames?.[k];
  if (!l) return null;
  const [ax, ay] = s.ancres[k], sens = dir < 0 === (s.regarde === "droite") ? -1 : 1;
  return [[x + sens * (l[0] - ax), y + (l[1] - ay)], [x + sens * (l[2] - ax), y + (l[3] - ay)]];
}
function dessinerTrainee(liste, cam, maintenant, vie) {
  if (liste.length < 2) return;
  const pas = 6, polaire = ([a2, b2]) => [a2, Math.atan2(b2[1] - a2[1], b2[0] - a2[0]), Math.hypot(b2[0] - a2[0], b2[1] - a2[1])];
  const pointes = [];
  for (let i = 1; i < liste.length; i++) {
    const [a0, t0, l0] = polaire(liste[i - 1].seg), [a1, t1, l1] = polaire(liste[i].seg);
    let dt = t1 - t0;
    if (dt > Math.PI) dt -= 2 * Math.PI;
    if (dt < -Math.PI) dt += 2 * Math.PI;
    const age = Math.max(0, 1 - (maintenant - liste[i].t) / vie);
    ctx.fillStyle = motif(ctx, Math.max(2, Math.round(10 * age)), "#f2f1ec");
    let prec = null;
    for (let k = 0; k <= pas; k++) {
      const f = k / pas, ang = t0 + dt * f, l = l0 + (l1 - l0) * f, ax = a0[0] + (a1[0] - a0[0]) * f, ay = a0[1] + (a1[1] - a0[1]) * f;
      const pointe = [ax + Math.cos(ang) * l, ay + Math.sin(ang) * l], milieu = [ax + Math.cos(ang) * l * 0.6, ay + Math.sin(ang) * l * 0.6];
      if (prec) {
        ctx.beginPath();
        ctx.moveTo(Math.round(prec[0][0] - cam), Math.round(prec[0][1]));
        ctx.lineTo(Math.round(pointe[0] - cam), Math.round(pointe[1]));
        ctx.lineTo(Math.round(milieu[0] - cam), Math.round(milieu[1]));
        ctx.lineTo(Math.round(prec[1][0] - cam), Math.round(prec[1][1]));
        ctx.closePath();
        ctx.fill();
      }
      prec = [pointe, milieu];
      pointes.push([pointe, age]);
    }
  }
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  for (let i = 1; i < pointes.length; i++) {
    ctx.globalAlpha = pointes[i][1];
    ctx.beginPath();
    ctx.moveTo(Math.round(pointes[i - 1][0][0] - cam), Math.round(pointes[i - 1][0][1]));
    ctx.lineTo(Math.round(pointes[i][0][0] - cam), Math.round(pointes[i][0][1]));
    ctx.stroke();
  }
  ctx.restore();
  const [a, b] = liste[liste.length - 1].seg;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(Math.round(a[0] - cam) + 0.5, Math.round(a[1]) + 0.5);
  ctx.lineTo(Math.round(b[0] - cam) + 0.5, Math.round(b[1]) + 0.5);
  ctx.stroke();
}
function preparerSouillures(noms, paliers) {
  const file = [];
  for (const niv of paliers) for (const n of noms) if (S[n]) file.push([n, niv]);
  const suite = () => {
    const t0 = performance.now();
    while (file.length && performance.now() - t0 < 6) {
      const [n, niv] = file.shift();
      const s = S[n];
      if (!s.souillures[niv]) s.souillures[niv] = souiller(s, niv);
    }
    if (!file.length) {
      prets.souillures = true;
      libererPixels();
    }
    if (file.length) setTimeout(suite, 16);
  };
  setTimeout(suite, 500);
}
function preparerSignatures(noms) {
  const file = [];
  for (const n of noms) if (S[n] && S[n].n) for (let k = 0; k < S[n].n; k++) file.push([n, k]);
  const suite = () => {
    const t0 = performance.now();
    while (file.length && performance.now() - t0 < 5) {
      const [n, k] = file.shift();
      signature(S[n], k);
    }
    if (!file.length) {
      prets.signatures = true;
      libererPixels();
    }
    if (file.length) setTimeout(suite, 16);
  };
  setTimeout(suite, 900);
}
function imageCentrale(nom) {
  const s = S[nom];
  if (!s) return 0;
  if (s.centrale != null) return s.centrale;
  let meilleur = 0, dmin = Infinity;
  for (let a = 0; a < s.n; a++) {
    const sa = signature(s, a);
    let d = 0;
    for (let b = 0; b < s.n; b++) {
      const sb = signature(s, b);
      for (let i = 0; i < sa.length; i++) d += Math.abs(sa[i] - sb[i]);
    }
    if (d < dmin) {
      dmin = d;
      meilleur = a;
    }
  }
  return s.centrale = meilleur;
}
function dessinerRespire(nom, x, y, dir, t, o = {}) {
  const s = S[nom];
  if (!s) return false;
  const k = imageCentrale(nom), [ax, ay] = s.ancres[k], h = s.hauts[k];
  const expire = Math.sin(t * Math.PI * 2 / 2.6) > 0.35 ? 1 : 0;
  const coupe = Math.round(ay - h * 0.55);
  if (!expire) return dessiner(nom, k, x, y, dir, o);
  const versGauche = dir < 0 === (s.regarde === "droite");
  let src = s;
  if (o.souillure > 0.02) {
    let niv = Math.min(NIVEAUX, Math.ceil(o.souillure * NIVEAUX));
    while (niv > 0 && !s.souillures[niv]) niv--;
    if (niv > 0) src = s.souillures[niv];
  }
  const dx = versGauche ? Math.round(x) - (s.cw - ax) : Math.round(x) - ax, dy = Math.round(y) - ay;
  poserCase(ctx, src.img, s, k, versGauche, dx, dy, coupe, s.ch - coupe);
  poserCase(ctx, src.img, s, k, versGauche, dx, dy + 1, 0, coupe);
  return true;
}
var nbImages = (nom) => S[nom]?.n || 1;
var hauteur = (nom, k = 0) => S[nom]?.hauts[Math.min(k, S[nom].n - 1)] || 70;
var prets = { souillures: false, signatures: false };
function libererPixels() {
  if (!prets.souillures || !prets.signatures) return;
  for (const s of Object.values(S)) if (s && s.px && s.sigs && s.sigs.length >= s.n) s.px = null;
}
function signature(s, k) {
  s.sigs = s.sigs || [];
  if (s.sigs[k]) return s.sigs[k];
  const [ax, ay] = s.ancres[k], out = new Float32Array(12 * 16);
  for (let y = 0; y < s.ch; y++) for (let x = 0; x < s.cw; x++) {
    if (s.px.data[(y * s.img.width + k * s.cw + x) * 4 + 3] === 0) continue;
    const gx = Math.floor((x - ax + 90) / 15), gy = Math.floor((ay - y) / 10);
    if (gx >= 0 && gx < 12 && gy >= 0 && gy < 16) out[gy * 12 + gx]++;
  }
  return s.sigs[k] = out;
}
function plusProche(depuis, kDepuis, vers) {
  const a = S[depuis], b = S[vers];
  if (!a || !b) return 0;
  const sa = signature(a, kDepuis);
  let meilleur = 0, dmin = Infinity;
  for (let k = 0; k < b.n; k++) {
    const sb = signature(b, k);
    let d = 0;
    for (let i = 0; i < sa.length; i++) d += Math.abs(sa[i] - sb[i]);
    if (d < dmin) {
      dmin = d;
      meilleur = k;
    }
  }
  return meilleur;
}

// src/js/heroine-images.js
function assemblerHeroine() {
  for (const nom of Object.keys(S)) if (nom.startsWith("e-k-") && S["r-k-" + nom.slice(4)]) S["r-k-" + nom.slice(4)].effet = nom;
  if (S["r-coup-fort"]) S["r-coup-air"] = S["r-coup-fort"];
  if (!/#ancien/.test(location.hash)) {
    for (const [nouveau, ancien] of [["r-k-marche", "r-marche"], ["r-k-coupes", "r-coup-leger"]])
      if (S[nouveau]) S[ancien] = S[nouveau];
  }
  const extrait = (nom, de, n) => {
    const s = S[nom];
    if (!s) return null;
    const c = document.createElement("canvas");
    c.width = s.cw * n;
    c.height = s.ch;
    c.getContext("2d").drawImage(s.img, de * s.cw, 0, s.cw * n, s.ch, 0, 0, s.cw * n, s.ch);
    const px = c.getContext("2d").getImageData(0, 0, c.width, c.height);
    return { ...s, img: c, px, n, ancres: s.ancres.slice(de, de + n), hauts: s.hauts.slice(de, de + n), lames: s.lames?.slice(de, de + n) || null, sigs: null, centrale: null, souillures: [] };
  };
  if (!/#ancien/.test(location.hash)) {
    if (S["r-k-coupes"]) S["r-garde-titre"] = extrait("r-k-coupes", 0, 2);
    if (S["r-k-garde"]?.depot && S["r-k-garde"].n === 9) {
      S["r-garde"] = S["r-k-garde"];
      S["r-garde"].vivante = true;
      ANIMS["r-garde"] = ANIMS["r-k-garde"];
    } else if (S["r-k-coupes"]) S["r-garde"] = extrait("r-k-coupes", 0, 2);
    if (S["r-k-course"]) S["r-course"] = S["r-k-course"];
    if (S["r-k-estoc"]) S["r-estoc"] = S["r-k-estoc"];
    else if (S["r-k-combo2"]) S["r-estoc"] = S["r-k-combo2"];
    if (S["r-k-final"]) {
      S["r-coup-fort"] = S["r-k-final"];
      S["r-plonge-fin"] = S["r-k-final"];
    }
    if (S["r-k-haute"]) S["r-moulinet"] = S["r-k-haute"];
    if (S["r-k-fort"]) S["r-bond-coupe"] = S["r-k-fort"];
    if (S["r-k-haute"]) S["r-revers"] = S["r-k-haute"];
    if (S["r-k-coup-poing"]) S["r-poing-direct"] = S["r-k-coup-poing"];
    if (S["r-estoc"]) S["r-estoc-fort"] = S["r-estoc"];
    if (S["r-k-fort"]) S["r-parade"] = extrait("r-k-fort", 0, 2);
    else if (S["r-k-charge"]) S["r-parade"] = extrait("r-k-charge", 0, 2);
    if (S["r-k-chute"]) {
      S["r-touche"] = extrait("r-k-chute", 0, 3);
      S["r-mort"] = S["r-k-chute"];
    }
  }
}
var originaux = {};
function basculerGundam() {
  J.gundam = !J.gundam;
  for (const nom of Object.keys(S)) {
    if (!nom.startsWith("g-")) continue;
    const cible = nom.slice(2);
    if (J.gundam) {
      if (!(cible in originaux)) originaux[cible] = S[cible];
      S[cible] = S[nom];
    } else if (cible in originaux) S[cible] = originaux[cible];
  }
  return J.gundam;
}

// src/js/decor.js
var DEVANT = SOL + 6;
J.vent = 0;
var BOUCLES = ["lune", "fenetres", "cascades", "lanterne", "banniere"];
function dessinerFond(cam) {
  const s = S.scene;
  if (s) ctx.drawImage(s.img, Math.round(-cam), -DECOR_HAUT);
  else {
    ctx.fillStyle = "#2a2a28";
    ctx.fillRect(0, 0, J.W, J.HAUT);
  }
  if (!s) return;
  for (const nom of BOUCLES) {
    const b = S[nom];
    if (!b || !b.decor) continue;
    const x = Math.round(b.decor.x - cam);
    if (x > J.W || x + b.cw < 0) continue;
    const k = Math.floor(J.temps * (b.decor.ips || 10)) % b.n;
    ctx.drawImage(b.img, k * b.cw, 0, b.cw, b.ch, x, b.decor.y - DECOR_HAUT, b.cw, b.ch);
  }
}
function dessinerDevant(cam) {
  const s = S.scene;
  if (s) ctx.drawImage(s.img, 0, DEVANT + DECOR_HAUT, s.w, s.h - DEVANT - DECOR_HAUT, Math.round(-cam), DEVANT, s.w, s.h - DEVANT - DECOR_HAUT);
}

// src/js/ambiance.js
function creerAmbiance(W, H, sol, { cinemascope = 0 } = {}) {
  const A = { W, H, sol, t: 0, vent: 0, flocons: [], rafales: [], souffles: [], cinemascope };
  const couche = (n, z) => {
    for (let i = 0; i < n; i++) A.flocons.push(nouveau(z, true));
  };
  function nouveau(z, partout) {
    return {
      x: rand(-40, W + 40),
      y: partout ? rand(-10, H) : rand(-30, -4),
      z,
      v: [10, 26, 55][z] * rand(0.7, 1.3),
      ph: rand(0, 6.28),
      g: z === 2 ? Math.random() < 0.35 ? 3 : 2 : 1,
      a: [0.45, 0.75, 0.9][z] * rand(0.6, 1)
    };
  }
  couche(140, 0);
  couche(90, 1);
  couche(28, 2);
  const brume = toile(W * 2, 60), gb2 = brume.getContext("2d"), d = gb2.createImageData(W * 2, 60);
  const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = 0; y < 60; y++) for (let x = 0; x < W * 2; x++) {
    const n = 0.5 + 0.5 * Math.sin(x * 0.021 + Math.sin(x * 7e-3) * 3) * Math.sin(y * 0.09 + x * 4e-3);
    const dens = n * Math.sin(Math.PI * y / 60) * 0.55;
    if (dens * 16 > B[(y & 3) * 4 + (x & 3)] + 1) {
      const i = (y * W * 2 + x) * 4;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = 200;
      d.data[i + 3] = 70;
    }
  }
  gb2.putImageData(d, 0, 0);
  A.brume = brume;
  const vig = toile(W, H), gv = vig.getContext("2d"), dv = gv.createImageData(W, H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = (x - W / 2) / (W / 2), dy = (y - H * 0.45) / (H / 2), r = Math.sqrt(dx * dx * 0.8 + dy * dy);
    const f = Math.max(0, r - 0.72) * 1.9;
    if (f * 16 > B[(y & 3) * 4 + (x & 3)]) {
      const i = (y * W + x) * 4;
      dv.data[i + 3] = Math.min(200, 110 + f * 90);
    }
  }
  gv.putImageData(dv, 0, 0);
  A.vignette = vig;
  return A;
}
function majAmbiance(A, dt) {
  A.t += dt;
  const t = A.t;
  const bourrasque = Math.max(0, Math.sin(t * 0.13) - 0.55) * 90;
  A.vent = Math.sin(t * 0.31) * 12 + Math.sin(t * 1.1) * 5 + bourrasque;
  for (const f of A.flocons) {
    const k = [0.5, 0.8, 1.3][f.z];
    f.y += f.v * dt;
    f.x += (A.vent * k + Math.sin(t * 1.4 + f.ph) * 9 * k) * dt;
    if (f.y > (f.z === 0 ? A.sol - 4 : A.H + 4) || f.x > A.W + 50 || f.x < -50) Object.assign(f, { x: rand(-40, A.W + 40), y: rand(-30, -4) });
  }
  if (Math.random() < dt * (0.6 + bourrasque / 25)) A.rafales.push({ x: A.vent > 0 ? -60 : A.W + 60, y: A.sol + rand(-6, 4), l: rand(40, 140), v: 0, t: 0, vie: rand(1.5, 3) });
  for (let i = A.rafales.length - 1; i >= 0; i--) {
    const r = A.rafales[i];
    r.t += dt;
    r.x += (A.vent * 3 + Math.sign(A.vent || 1) * 60) * dt;
    if (r.t > r.vie) A.rafales.splice(i, 1);
  }
  for (let i = A.souffles.length - 1; i >= 0; i--) {
    const s = A.souffles[i];
    s.t += dt;
    s.x += (s.dir * 10 + A.vent * 0.5) * dt;
    s.y -= 6 * dt;
    if (s.t > 1.4) A.souffles.splice(i, 1);
  }
}
function souffler(A, x, y, dir) {
  for (let i = 0; i < 6; i++) A.souffles.push({ x: x + dir * i * 1.5, y: y + rand(-1, 1), dir, t: -i * 0.04, r: rand(1, 2.5) });
}
function neige(ctx2, A, z, cam) {
  const par = z === 0 ? 0.1 : z === 1 ? 0.3 : 0.8, paquets = [[], [], [], []], demi = [];
  for (const f of A.flocons) if (f.z === z) {
    const x = Math.round(f.x - cam * par), y = Math.round(f.y), n = Math.min(3, f.a * 4 | 0);
    if (f.g === 3) {
      paquets[n].push(x, y + 1, 3, 1, x + 1, y, 1, 3);
      demi.push(x, y, 3, 3);
    } else paquets[n].push(x, y, f.g, f.g);
  }
  ctx2.fillStyle = "#f2f1ec";
  for (let n = 0; n < 4; n++) {
    const p = paquets[n];
    if (!p.length) continue;
    ctx2.globalAlpha = (n + 0.5) / 4;
    ctx2.beginPath();
    for (let i = 0; i < p.length; i += 4) ctx2.rect(p[i], p[i + 1], p[i + 2], p[i + 3]);
    ctx2.fill();
  }
  if (demi.length) {
    ctx2.globalAlpha = 0.4;
    ctx2.beginPath();
    for (let i = 0; i < demi.length; i += 4) ctx2.rect(demi[i], demi[i + 1], demi[i + 2], demi[i + 3]);
    ctx2.fill();
  }
  ctx2.globalAlpha = 1;
}
function ambianceFond(ctx2, A, cam = 0) {
  neige(ctx2, A, 0, cam);
  neige(ctx2, A, 1, cam);
  const bx = -((A.t * 7 + cam * 0.6) % A.W);
  ctx2.globalAlpha = 0.9;
  ctx2.drawImage(A.brume, Math.round(bx), A.sol - 44);
  ctx2.globalAlpha = 1;
}
function ambianceDevant(ctx2, A, cam = 0) {
  ctx2.fillStyle = "#e8e7e2";
  for (const r of A.rafales) {
    const f = Math.sin(Math.PI * r.t / r.vie);
    for (let k = 0; k < r.l; k += 2) {
      const h = hash(k * 7 + Math.floor(r.x));
      if (h < 0.45 * f) {
        ctx2.globalAlpha = 0.5 * f * (1 - k / r.l);
        ctx2.fillRect(Math.round(r.x - k * Math.sign(A.vent || 1)), Math.round(r.y - h * 6 + Math.sin(k * 0.3 + A.t * 8) * 2), 1, 1);
      }
    }
  }
  for (const s of A.souffles) if (s.t > 0) {
    ctx2.globalAlpha = Math.max(0, 0.55 * (1 - s.t / 1.4));
    ctx2.fillStyle = "#dcdbd6";
    const r = Math.round(s.r + s.t * 3);
    ctx2.fillRect(Math.round(s.x - r / 2), Math.round(s.y - r / 2), r, r);
  }
  ctx2.globalAlpha = 1;
  neige(ctx2, A, 2, cam);
  ctx2.drawImage(A.vignette, 0, 0);
  if (!A.grains) {
    A.grains = [];
    for (let j = 0; j < 3; j++) {
      const c = document.createElement("canvas");
      c.width = A.W;
      c.height = A.H;
      const g = c.getContext("2d");
      g.fillStyle = "rgba(0,0,0,0.18)";
      for (let i = 0; i < 260; i++) g.fillRect(Math.random() * A.W | 0, Math.random() * A.H | 0, 1, 1);
      g.fillStyle = "rgba(255,255,255,0.07)";
      for (let i = 0; i < 120; i++) g.fillRect(Math.random() * A.W | 0, Math.random() * A.H | 0, 1, 1);
      A.grains.push(c);
    }
  }
  ctx2.drawImage(A.grains[Math.random() * A.grains.length | 0], 0, 0);
  if (A.cinemascope) {
    ctx2.fillStyle = "#000";
    ctx2.fillRect(0, 0, A.W, A.cinemascope);
    ctx2.fillRect(0, A.H - A.cinemascope, A.W, A.cinemascope);
  }
}

// src/js/sang.js
var HAUT_TACHES = 44;
var Y_TACHES = SOL - 12;
J.taches = null;
J.gouttes = [];
J.morceaux = [];
J.jets = [];
function viderSang() {
  J.taches = toile(ARENE, HAUT_TACHES);
  J.gouttes.length = 0;
  J.morceaux.forEach(rendre);
  J.morceaux.length = 0;
  J.jets.length = 0;
}
function gerbe(x, y, dir, n = 40, force = 1, haut = 0.6, retour2 = 0.35) {
  for (let i = 0; i < n; i++) {
    const arriere = Math.random() < retour2, v = rand(60, 320) * force * (arriere ? 0.55 : 1), a = rand(-haut, 0.35);
    J.gouttes.push({
      x,
      y,
      vx: Math.cos(a) * v * (arriere ? -dir : dir) + rand(-30, 30),
      vy: Math.sin(a) * v - rand(20, 140) * force,
      t: 0,
      c: SANG[1 + (Math.random() * 4 | 0)],
      g: Math.random() < 0.18 ? 2 : 1,
      prof: rand(-4, 12)
    });
  }
  if (J.gouttes.length > 500) J.gouttes.splice(0, J.gouttes.length - 500);
}
function jet(x, y, dir, duree2 = 1.1, angle = -1.35) {
  J.jets.push({ x, y, dir, t: 0, duree: duree2, angle, suit: null });
}
function tacher(x, prof, c, g) {
  const t = J.taches.getContext("2d");
  t.fillStyle = c;
  const y = Math.round(12 + prof), l = g + (Math.random() * 4 | 0);
  t.fillRect(Math.round(x - l / 2), y, l, g > 1 && Math.random() < 0.5 ? 2 : 1);
  if (Math.random() < 0.25) {
    t.fillStyle = SANG[1];
    t.fillRect(Math.round(x + rand(-4, 4)), y + (Math.random() < 0.5 ? 1 : -1), 1, 1);
  }
}
var reserve = /* @__PURE__ */ new Map();
function prendre(w, h) {
  const l = reserve.get(w + "x" + h);
  J.evt && (J.evt.toile = true);
  if (l && l.length) {
    const c = l.pop(), g = c.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 1;
    g.clearRect(0, 0, w, h);
    return c;
  }
  return toile(w, h);
}
function rendre(m) {
  if (!m || !m.img || !m.img.width) return;
  const k = m.img.width + "x" + m.img.height;
  let l = reserve.get(k);
  if (!l) reserve.set(k, l = []);
  if (l.length < 24) l.push(m.img);
}
function trancher(nom, k, x, dir, ligne, pente, elan) {
  const s = S[nom];
  if (!s) return [];
  const versGauche = dir < 0 === (s.regarde === "droite");
  const [ax0, ay] = s.ancres[k];
  const ax = versGauche ? s.cw - ax0 : ax0;
  const h = s.hauts[k], yCoupe = ay - h * ligne;
  const morceau = (dessus) => {
    const c = prendre(s.cw, s.ch), g = c.getContext("2d");
    g.save();
    g.beginPath();
    const y0 = yCoupe - pente * s.cw / 2, y1 = yCoupe + pente * s.cw / 2;
    if (dessus) {
      g.moveTo(0, 0);
      g.lineTo(s.cw, 0);
      g.lineTo(s.cw, y1);
      g.lineTo(0, y0);
    } else {
      g.moveTo(0, y0);
      g.lineTo(s.cw, y1);
      g.lineTo(s.cw, s.ch);
      g.lineTo(0, s.ch);
    }
    g.closePath();
    g.clip();
    poserCase(g, s.img, s, k, versGauche, 0, 0);
    g.restore();
    g.globalCompositeOperation = "source-atop";
    g.fillStyle = SANG[2];
    for (let px = 0; px < s.cw; px++) {
      const yy = Math.round(y0 + (y1 - y0) * px / s.cw);
      g.fillRect(px, dessus ? yy - 2 : yy, 1, 2);
    }
    return c;
  };
  const haut = { img: morceau(true), x, y: SOL, ox: ax, oy: yCoupe, pivot: [ax, yCoupe], rot: 0, vx: elan[0], vy: elan[1], vr: elan[2], t: 0, pose: false, dessus: true };
  const bas = { img: morceau(false), x, y: SOL, ox: ax, oy: ay, pivot: [ax, ay], rot: 0, vx: 0, vy: 0, vr: 0, t: 0, pose: false, debout: 0.55 + Math.random() * 0.4, dessus: false };
  haut.y = SOL - h * ligne;
  J.morceaux.push(haut, bas);
  if (J.morceaux.length > 60) J.morceaux.splice(0, 2).forEach(rendre);
  return [haut, bas];
}
function gisant(nom, k, x, dir) {
  const s = S[nom];
  if (!s) return;
  const versGauche = dir < 0 === (s.regarde === "droite");
  const c = prendre(s.cw, s.ch);
  poserCase(c.getContext("2d"), s.img, s, k, versGauche, 0, 0);
  const [ax0, ay] = s.ancres[k];
  J.morceaux.push({ img: c, x, y: SOL, ox: versGauche ? s.cw - ax0 : ax0, oy: ay, pivot: [0, 0], rot: 0, vx: 0, vy: 0, vr: 0, t: 0, pose: true, dessus: false });
  if (J.morceaux.length > 60) J.morceaux.splice(0, 1).forEach(rendre);
}
function majSang(dt) {
  const H = J.H;
  for (let i = J.gouttes.length - 1; i >= 0; i--) {
    const g = J.gouttes[i];
    g.t += dt;
    g.vy += GRAVITE * 0.8 * dt;
    g.x += g.vx * dt;
    g.y += g.vy * dt;
    g.vx *= 1 - 0.8 * dt;
    if (H && H.pv > 0 && Math.abs(g.x - H.x) < 16 && g.y > SOL - 110 && g.y < SOL - 8 && g.vy > -50 && Math.random() < 0.35) {
      H.souillure = Math.min(0.4, H.souillure + 5e-3);
      J.gouttes.splice(i, 1);
      continue;
    }
    if (g.y >= SOL + g.prof && g.vy > 0) {
      if (g.x > 0 && g.x < ARENE) tacher(g.x, g.prof, g.c, g.g);
      J.gouttes.splice(i, 1);
    }
  }
  for (let i = J.jets.length - 1; i >= 0; i--) {
    const j = J.jets[i];
    j.t += dt;
    if (j.suit) {
      j.x = j.suit.x + j.dx;
      j.y = j.suit.y + j.dy;
    }
    const force = 1 - j.t / j.duree;
    if (force <= 0) {
      J.jets.splice(i, 1);
      continue;
    }
    const pulse = 0.6 + 0.4 * Math.sin(j.t * 22);
    for (let n = 0; n < 3; n++) {
      const a = j.angle + rand(-0.25, 0.25), v = rand(180, 360) * force * pulse;
      J.gouttes.push({ x: j.x, y: j.y, vx: Math.cos(a) * v * j.dir * 0.5, vy: Math.sin(a) * v, t: 0, c: SANG[2 + (Math.random() * 3 | 0)], g: Math.random() < 0.3 ? 2 : 1, prof: rand(-4, 12) });
    }
  }
  for (let i = J.morceaux.length - 1; i >= 0; i--) if (J.morceaux[i].t > RESTE + DISPARITION) rendre(J.morceaux.splice(i, 1)[0]);
  for (const m of J.morceaux) {
    m.t += dt;
    if (m.pose) continue;
    if (m.debout != null) {
      if (m.t > m.debout) {
        m.vr = m.vr || (Math.random() < 0.5 ? -1 : 1) * 2.2;
        m.rot += m.vr * dt;
        m.vr *= 1 + 3 * dt;
        if (Math.abs(m.rot) > 1.45) {
          m.rot = Math.sign(m.rot) * 1.52;
          m.pose = true;
          J.secousse = 0.05;
        }
      }
      continue;
    }
    m.vy += GRAVITE * dt;
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    m.rot += m.vr * dt;
    if (m.y >= SOL - 4 && m.vy > 0) {
      if (Math.abs(m.vy) > 160) {
        m.vy *= -0.3;
        m.vx *= 0.5;
        m.vr *= 0.5;
        gerbe(m.x, SOL - 4, Math.sign(m.vx) || 1, 8, 0.5);
      } else {
        m.y = SOL - 4;
        m.pose = true;
        m.rot = Math.round(m.rot / (Math.PI / 2)) * (Math.PI / 2) + rand(-0.2, 0.2);
      }
    }
  }
}
function dessinerTaches(cam) {
  if (J.taches) ctx.drawImage(J.taches, Math.round(-cam), Y_TACHES);
}
var RESTE = 4;
var DISPARITION = 0.8;
function dessinerMorceaux(cam) {
  for (const m of J.morceaux) {
    const reste = m.t < RESTE ? 1 : 1 - (m.t - RESTE) / DISPARITION;
    if (reste <= 0) continue;
    if (reste < 1) ctx.globalAlpha = reste;
    const x = Math.round(m.x - cam), y = Math.round(m.y);
    if (!m.rot) ctx.drawImage(m.img, x - m.ox, y - m.oy);
    else {
      ctx.translate(x, y);
      ctx.rotate(m.rot);
      ctx.drawImage(m.img, -m.ox, -m.oy);
      ctx.rotate(-m.rot);
      ctx.translate(-x, -y);
    }
    if (reste < 1) ctx.globalAlpha = 1;
  }
}
function dessinerGouttes(cam) {
  const par = /* @__PURE__ */ new Map();
  for (const g of J.gouttes) {
    let l = par.get(g.c);
    if (!l) par.set(g.c, l = []);
    l.push(g);
  }
  for (const [c, l] of par) {
    ctx.fillStyle = c;
    ctx.beginPath();
    for (const g of l) ctx.rect(Math.round(g.x - cam), Math.round(g.y), g.g, g.g);
    ctx.fill();
  }
}

// src/js/effets.js
J.etincelles = [];
J.projectiles = [];
function etincelles(x, y, n = 10) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, 6.28), v = rand(80, 300);
    J.etincelles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, t: 0, vie: rand(0.12, 0.3) });
  }
}
function majEffets(dt) {
  for (let i = J.etincelles.length - 1; i >= 0; i--) {
    const e = J.etincelles[i];
    e.t += dt;
    e.vy += GRAVITE * 0.5 * dt;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    if (e.t > e.vie) J.etincelles.splice(i, 1);
  }
}
function dessinerEtincelles(cam) {
  for (const e of J.etincelles) {
    ctx.fillStyle = e.t < e.vie * 0.5 ? "#ffffff" : "#bdbdb6";
    ctx.fillRect(Math.round(e.x - cam), Math.round(e.y), 1, 1);
    ctx.fillRect(Math.round(e.x - cam - e.vx * 0.012), Math.round(e.y - e.vy * 0.012), 1, 1);
  }
}
function eclat(x, y, f) {
  const r = Math.round(2 + f * 7);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(Math.round(x) - r, Math.round(y), 2 * r + 1, 1);
  ctx.fillRect(Math.round(x), Math.round(y) - r, 1, 2 * r + 1);
  ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
}
function etoile(x, y, r, tour, couleur) {
  ctx.fillStyle = couleur;
  if (tour) {
    ctx.fillRect(x - r, y - 1, 2 * r + 1, 3);
    ctx.fillRect(x - 1, y - r, 3, 2 * r + 1);
  } else {
    for (let i = -r; i <= r; i++) {
      const e = Math.abs(i) < 2 ? 1 : 0;
      ctx.fillRect(x + i - e, y + i, 2 * e + 1, 1);
      ctx.fillRect(x + i - e, y - i, 2 * e + 1, 1);
    }
  }
}
function dessinerShuriken(p, cam, sol) {
  const x = Math.round(p.x - cam), y = Math.round(p.y), tour = Math.floor(p.t * 20) % 2, sens = Math.sign(p.vx) || 1;
  for (let k = 4; k >= 1; k--) {
    ctx.globalAlpha = 0.55 - k * 0.11;
    etoile(x - sens * k * 8, y, 5, (tour + k) % 2, "#f2f1ec");
  }
  ctx.globalAlpha = 1;
  if (sol != null) {
    ctx.fillStyle = "rgba(0, 0, 0, .45)";
    ctx.fillRect(x - 6, sol - 1, 13, 2);
  }
  etoile(x, y, 7, tour, "#111");
  etoile(x, y, 5, tour, "#f2f1ec");
  ctx.fillStyle = "#111";
  ctx.fillRect(x - 1, y - 1, 3, 3);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + sens * 3, y - 3, 1, 1);
}

// src/js/heroine.js
function nouvelleHeroine() {
  J.H = {
    x: ARENE / 2,
    y: 0,
    vx: 0,
    vy: 0,
    dir: 1,
    etat: "garde",
    t: 0,
    anim: "r-garde",
    k: 0,
    combo: 0,
    touches: /* @__PURE__ */ new Set(),
    pv: PV_MAX,
    fureur: 0,
    souillure: 0,
    invul: 0,
    tampon: null,
    paradeDepuis: 9,
    bloque: 0,
    marques: [],
    trainee: [],
    fantomes: [],
    court: false,
    presse: {},
    enchaine: 0,
    combo: 0
  };
}
var SOUILLURE_MAX = 0.3;
var FONDU = 0.12;
var TRAINEE = 0.16;
var DASH = 0.26;
var DECOLLAGE = 0.05;
var RETOUR = 2 / 60;
var VOL = 2 * HEROINE.saut / GRAVITE;
var PLONGE = { appel: 0.05, vx: 340, vy: 430 };
var duree = (anim) => suiteImages(anim, nbImages(anim)).length / ANIMS[anim].ips;
function changer(H, etat, anim) {
  const avant2 = H.anim, kAvant = H.k;
  if (avant2 && anim && anim !== avant2) H.fondu = { anim: avant2, k: kAvant, x: H.x, y: H.y, dir: H.dir, t: 0 };
  H.etat = etat;
  H.t = 0;
  if (anim) H.anim = anim;
  if (ANIMS[anim]?.boucle && avant2 && avant2 !== anim) {
    const k = plusProche(avant2, kAvant, anim), suite = suiteImages(anim, nbImages(anim));
    H.t = Math.max(0, suite.indexOf(k)) / ANIMS[anim].ips;
  }
}
var auSol = (H) => H.y <= 0;
var repli = { 3: 0, 4: 2, 5: 0, 6: 2, 7: 1, 8: 1, 9: 2, 10: 4, 11: 4, 12: 1, 13: 0, 14: 0, 15: 8, 16: 5, 17: 0 };
var coupDispo = (n) => S[COMBO[n]] ? n : repli[n] ?? 0;
function lancerCoup(H, n, E) {
  n = coupDispo(n);
  if (!H.enchaine) {
    H.legers = 0;
    H.lourds = 0;
  }
  if (CHAINES.sabre.includes(n)) H.legers++;
  else H.lourds++;
  if (CHAINES.fort.includes(n)) {
    H.rangFort = CHAINES.fort.indexOf(n);
    H.fortT = J.temps;
  }
  if (CHAINES.sabre.includes(n)) {
    H.rangLeger = CHAINES.sabre.indexOf(n);
    H.legerT = J.temps;
  }
  if (CHAINES.corps.includes(n)) {
    H.rangCorps = CHAINES.corps.indexOf(n);
    H.corpsT = J.temps;
  }
  if (E.L && !E.R) H.dir = -1;
  else if (E.R && !E.L) H.dir = 1;
  H.combo = n;
  H.touches.clear();
  H.relache = false;
  changer(H, "coup", COMBO[n]);
  sfx(ANIMS[COMBO[n]].tranche ? "lourd" : "lame");
}
function coupSuivant(H, bouton) {
  if (bouton === "sabre") {
    if (H.legers >= CHAINES.sabre.length || H.lourds) return -1;
    if (collee(H)) return coupCorps(H);
    return CHAINES.sabre[(H.departLeger + H.legers) % CHAINES.sabre.length];
  }
  if (H.lourds >= 2) return -1;
  const c = CHAINES.fort, n = c[Math.min(c.length - 1, H.legers + H.lourds)];
  return coupDispo(n) === H.combo ? c[(c.indexOf(n) + 1) % c.length] : n;
}
var collee = (H) => J.ennemis.some((e) => e.etat !== "mort" && !e.retirer && (e.x - H.x) * H.dir > -8 && (e.x - H.x) * H.dir < CORPS_A_CORPS);
function coupCorps(H) {
  const c = CHAINES.corps.filter((n) => S[COMBO[n]]);
  if (!c.length) return -1;
  const recent = J.temps - (H.corpsT ?? -99) < REPRISE_LEGER, i = recent ? (c.indexOf(H.rangCorps == null ? -1 : CHAINES.corps[H.rangCorps]) + 1) % c.length : 0;
  return c[i];
}
function choisirCoup(H, E, touche) {
  if (touche === "sabre") {
    if (collee(H)) return coupCorps(H);
    const c2 = CHAINES.sabre, reprise2 = J.temps - (H.legerT ?? -99) < REPRISE_LEGER;
    H.departLeger = reprise2 ? (H.rangLeger + 1) % c2.length : H.etat === "marche" ? 2 : 0;
    return c2[H.departLeger];
  }
  if (H.court) return 7;
  const c = CHAINES.fort, reprise = J.temps - (H.fortT ?? -99) < REPRISE_FORT;
  return reprise ? c[(H.rangFort + 1) % c.length] : c[0];
}
function majHeroine(dt, E) {
  const H = J.H;
  if (H.fondu && (H.fondu.t += dt) > FONDU) H.fondu = null;
  H.t += dt;
  H.invul = Math.max(0, H.invul - dt);
  H.paradeDepuis += dt;
  const A = E.appuis;
  for (const k of ["sabre", "fort", "up"]) if (A.has(k)) {
    H.tampon = { k, t: 0 };
    H.presse[k] = J.temps;
  }
  if ((A.has("sabre") || A.has("fort")) && Math.abs((H.presse.sabre ?? -9) - (H.presse.fort ?? -9)) < 0.15 && H.fureur >= 1) H.tampon = { k: "fureur", t: 0 };
  if (H.tampon && (H.tampon.t += dt) > TAMPON) H.tampon = null;
  const veut = (k) => H.tampon && H.tampon.k === k;
  const prendre2 = () => {
    H.tampon = null;
  };
  if (A.has("down")) H.paradeDepuis = 0;
  const relacheFort = H.fortTenu && !E.fort;
  H.fortTenu = !!E.fort;
  if ((E.sabre && E.fort || veut("fureur")) && H.fureur >= 1 && !["fureur", "mort", "touche"].includes(H.etat)) {
    prendre2();
    fureur(H, E);
  }
  const libre = H.etat === "garde" || H.etat === "marche";
  if (!auSol(H) || H.vy < 0) {
    H.vy += GRAVITE * dt;
    H.y -= H.vy * dt;
    if (H.y <= 0) {
      H.y = 0;
      H.vy = 0;
      if (H.etat === "plonge") {
        H.vx = 0;
        H.combo = 4;
        H.enchaine = 1;
        H.legers = 0;
        H.lourds = 1;
        H.touches.clear();
        changer(H, "coup", "r-plonge-fin");
        sfx("lourd");
        J.gel = Math.max(J.gel, 0.08);
        J.secousse = Math.max(J.secousse, 0.14);
      } else if (H.etat === "saut" || H.etat === "coup-air") {
        retour(H, ["r-k-saut", 11, 12]);
        sfx("chute");
      }
    }
  }
  switch (H.etat) {
    case "garde":
    case "marche": {
      if (veut("fureur") && H.fureur >= 1) {
        prendre2();
        fureur(H, E);
        break;
      }
      if (relacheFort && moulinetPossible(H, E)) {
        moulinet(H);
        break;
      }
      for (const t of ["sabre", "fort"]) if (veut(t)) {
        prendre2();
        H.enchaine = 0;
        lancerCoup(H, choisirCoup(H, E, t), E);
        break;
      }
      if (H.etat === "coup") break;
      if (veut("up")) {
        prendre2();
        sauter(H, E);
        break;
      }
      if (E.parade && !veut("sabre") && !veut("fort")) {
        changer(H, "parade", "r-parade");
        break;
      }
      if (A.has("dash-left") || A.has("dash-right")) {
        dasher(H, A.has("dash-left") ? -1 : 1);
        break;
      }
      const d = (E.R ? 1 : 0) - (E.L ? 1 : 0);
      if (d && H.court && d === H.dir) {
        H.vx = d * HEROINE.vitesse * 1.9;
        if (H.etat !== "marche") changer(H, "marche", "r-marche");
      } else if (d) {
        H.court = false;
        H.dir = d;
        H.vx = d * HEROINE.vitesse;
        if (H.etat !== "marche") changer(H, "marche", "r-marche");
      } else if (H.court && S["r-course"]) {
        H.court = false;
        H.vx = 0;
        retour(H, ["r-marche", 0, 1]);
      } else {
        H.court = false;
        H.vx = 0;
        if (H.etat !== "garde") changer(H, "garde", "r-garde");
      }
      break;
    }
    case "iai": {
      H.vx = 0;
      H.charge += dt;
      if (Math.floor(H.charge * 3) !== Math.floor((H.charge - dt) * 3)) sfx("choix");
      if (!E.sabre || H.charge > 1.8) {
        if (H.charge < 0.35) {
          changer(H, "garde", "r-garde");
          break;
        }
        iai(H);
      }
      break;
    }
    case "iai-coupe": {
      if (H.t >= (H.anim === "r-coup-fort" ? 8 / 16 : duree(H.anim))) changer(H, "garde", "r-garde");
      break;
    }
    case "dash": {
      const f = H.t / DASH;
      H.vx = H.dir * HEROINE.vitesse * 7 * (1 - f * 0.7);
      if (Math.floor(H.t / 0.035) !== H.fantomesN) {
        H.fantomesN = Math.floor(H.t / 0.035);
        H.fantomes.push({ anim: H.anim, k: H.k, x: H.x, y: H.y, dir: H.dir, t: 0 });
      }
      if (veut("sabre") && f > 0.3) {
        prendre2();
        lancerCoup(H, 1, E);
        break;
      }
      if (veut("fort") && f > 0.3) {
        prendre2();
        lancerCoup(H, 7, E);
        break;
      }
      if (f >= 1) {
        H.court = E.L && H.dir < 0 || E.R && H.dir > 0;
        changer(H, H.court ? "marche" : "garde", H.court ? "r-marche" : "r-garde");
      }
      break;
    }
    case "coup": {
      const a2 = ANIMS[H.anim], f = H.t / duree(H.anim);
      if (a2.esquive) {
        const ki = H.k - (a2.de || 0);
        if (ki >= a2.esquive[0] && ki <= a2.esquive[1]) H.invul = Math.max(H.invul, 0.03);
      }
      H.vx = f > a2.frappe[0] * 0.7 && f < a2.frappe[1] ? H.dir * a2.pas / (duree(H.anim) * (a2.frappe[1] - a2.frappe[0] * 0.7)) : 0;
      if (f > a2.frappe[1]) {
        if (f > a2.suite) {
          const bouton = ["sabre", "fort"].find((b) => veut(b));
          if (bouton) {
            const n2 = coupSuivant(H, bouton);
            if (n2 >= 0) {
              prendre2();
              H.enchaine++;
              lancerCoup(H, n2, E);
              break;
            }
          }
        }
        if (E.parade && H.paradeDepuis < H.t) {
          changer(H, "parade", "r-parade");
          break;
        }
        if (veut("up")) {
          prendre2();
          sauter(H, E);
          break;
        }
        if (veut("fureur") && H.fureur >= 1) {
          prendre2();
          fureur(H, E);
          break;
        }
      }
      if (!E.sabre) H.relache = true;
      if (E.sabre && !H.relache && H.combo === 0 && !H.enchaine && H.t > 0.2 && f < a2.frappe[0]) {
        changer(H, "iai", S["r-k-charge"] ? "r-k-charge" : "r-coup-fort");
        H.charge = 0;
        sfx("fer");
        break;
      }
      if (f >= 1) {
        if (a2.puis && S[a2.puis]) {
          H.combo = COMBO.indexOf(a2.puis);
          changer(H, "coup", a2.puis);
          break;
        }
        H.combo = 0;
        H.enchaine = 0;
        if (moulinetPossible(H, E)) {
          moulinet(H);
          break;
        }
        if (a2.retour && S[a2.retour[0]]) retour(H, a2.retour);
        else if (a2.retour) retour(H, ["r-k-saut", 11, 12]);
        else changer(H, "garde", "r-garde");
      }
      break;
    }
    case "saut": {
      if (H.t < DECOLLAGE) {
        H.vx = 0;
        break;
      }
      if (!H.envol) {
        H.envol = true;
        H.vy = -HEROINE.saut;
        H.y = 0.01;
        H.vx = H.elan;
        if (H.salto) H.anim = "r-k-salto";
      }
      const d = (E.R ? 1 : 0) - (E.L ? 1 : 0);
      if (d) {
        H.dir = d;
        H.vx = d * HEROINE.vitesse * 1.1;
      }
      if (veut("fort") && S["r-k-pied-saute"]) {
        prendre2();
        H.touches.clear();
        changer(H, "coup-air", "r-k-pied-saute");
        sfx("lame");
      } else if ((veut("sabre") || veut("fort")) && S["r-k-saute-coupe"]) {
        prendre2();
        H.touches.clear();
        changer(H, "plonge", "r-k-saute-coupe");
        H.fantomesN = -1;
        sfx("lourd");
      } else if (veut("sabre") || veut("fort")) {
        prendre2();
        H.touches.clear();
        changer(H, "coup-air", "r-coup-air");
        sfx("lourd");
      }
      break;
    }
    case "coup-air": {
      if (H.anim === "r-k-pied-saute" && H.k >= 6) H.vx = H.dir * 250;
      if (H.t >= duree(H.anim) && auSol(H)) changer(H, "garde", "r-garde");
      break;
    }
    case "plonge": {
      if (H.t < PLONGE.appel) {
        H.vx *= 0.5;
        break;
      }
      H.vx = H.dir * PLONGE.vx;
      H.vy = Math.max(H.vy, PLONGE.vy);
      if (Math.floor(H.t / 0.035) !== H.fantomesN) {
        H.fantomesN = Math.floor(H.t / 0.035);
        H.fantomes.push({ anim: H.anim, k: H.k, x: H.x, y: H.y, dir: H.dir, t: 0 });
      }
      break;
    }
    case "moulinet": {
      H.vx = 0;
      if (H.t >= duree(H.anim)) changer(H, "garde", "r-garde");
      break;
    }
    case "retour": {
      H.vx *= 0.5;
      const d = (E.R ? 1 : 0) - (E.L ? 1 : 0), presse = veut("sabre") || veut("fort") || veut("up");
      if (H.t >= RETOUR * H.retourImages.length || H.t >= RETOUR && (d || presse)) {
        H.combo = 0;
        H.enchaine = 0;
        if (moulinetPossible(H, E) && !d && !presse) moulinet(H);
        else changer(H, "garde", "r-garde");
      }
      break;
    }
    case "parade": {
      H.vx = 0;
      if (E.L && !E.R) H.dir = -1;
      else if (E.R && !E.L) H.dir = 1;
      if (H.bloque > 0) {
        H.bloque -= dt;
        break;
      }
      if (!E.parade) {
        changer(H, "garde", "r-garde");
        break;
      }
      for (const t of ["sabre", "fort"]) if (veut(t)) {
        prendre2();
        lancerCoup(H, choisirCoup(H, E, t), E);
        break;
      }
      break;
    }
    case "touche": {
      H.vx *= 1 - 6 * dt;
      if (H.t >= duree("r-touche")) changer(H, "garde", "r-garde");
      break;
    }
    case "fureur":
      majFureur(H, dt);
      break;
    case "chute": {
      H.vx *= 1 - 4 * dt;
      if (H.t >= duree("r-k-chute") + 0.35) changer(H, "releve", S["r-k-releve"] ? "r-k-releve" : "r-garde");
      break;
    }
    case "releve": {
      H.vx = 0;
      if (H.t >= duree(H.anim)) changer(H, "garde", "r-garde");
      break;
    }
    case "mort":
      H.vx *= 1 - 5 * dt;
      break;
  }
  H.x = Math.max(24, Math.min(ARENE - 24, H.x + H.vx * dt));
  const a = ANIMS[H.anim], n = nbImages(H.anim), suite = suiteImages(H.anim, n);
  const i = Math.floor(H.t * a.ips);
  if (H.etat === "saut" && H.anim === "r-k-salto") H.k = Math.min(n - 1, Math.floor((H.t - DECOLLAGE) / VOL * n));
  else if (H.etat === "saut" && H.anim === "r-k-saut") H.k = imageSaut(H);
  else if (H.etat === "saut") H.k = Math.min(n - 1, Math.floor((H.vy < 0 ? 0.1 + 0.4 * (1 + H.vy / HEROINE.saut) : 0.5 + Math.min(0.5, H.vy / 900)) * n));
  else if (H.etat === "retour") H.k = H.retourImages[Math.min(H.retourImages.length - 1, Math.floor(H.t / RETOUR))];
  else if (H.etat === "plonge") H.k = H.t < PLONGE.appel ? 5 : 8;
  else if (H.etat === "parade") H.k = H.bloque > 0 ? Math.min(n - 1, 2 + Math.floor((0.3 - H.bloque) / 0.3 * (n - 2))) : Math.min(1, i);
  else if (H.etat === "fureur" && H.phase === "ruee") H.k = Math.min(n - 1, 4);
  else if (H.etat === "fureur") H.k = suite[Math.min(suite.length - 1, Math.floor(H.tp * a.ips))];
  else if (H.etat === "chute" || H.etat === "releve") H.k = Math.min(n - 1, Math.floor(H.t * a.ips));
  else if (H.etat === "dash") H.k = S["r-course"] ? 1 : Math.min(n - 1, 5);
  else if (H.etat === "iai") H.k = H.anim === "r-coup-fort" ? 4 : suite[Math.floor(H.charge * a.ips) % suite.length];
  else if (H.etat === "iai-coupe") H.k = H.anim === "r-coup-fort" ? Math.min(n - 1, 9 + Math.floor(H.t * 16)) : Math.min(n - 1, Math.floor(H.t * a.ips));
  else if (H.etat === "marche" && H.court) H.k = S["r-course"] ? Math.floor(H.t * 14) % nbImages("r-course") : suite[Math.floor(H.t * a.ips * 2) % suite.length];
  else H.k = a.boucle ? suite[i % suite.length] : suite[Math.min(suite.length - 1, i)];
  for (let j = H.fantomes.length - 1; j >= 0; j--) if ((H.fantomes[j].t += dt) > 0.22) H.fantomes.splice(j, 1);
  H.traineeT = (H.traineeT || 0) + dt;
  for (let j = H.trainee.length - 1; j >= 0; j--) if (H.traineeT - H.trainee[j].t > TRAINEE) H.trainee.splice(j, 1);
  if ((H.etat === "coup" || H.etat === "coup-air") && a.frappe) {
    const fr = H.t / duree(H.anim);
    if (fr > a.frappe[0] - 0.18 && fr < a.frappe[1] + 0.08) {
      const seg = lameA(H.anim, H.k, H.x, SOL - H.y, H.dir);
      if (seg && (!H.trainee.length || H.trainee[H.trainee.length - 1].k !== H.k)) H.trainee.push({ seg, t: H.traineeT, k: H.k });
    }
  } else if (H.etat === "moulinet") {
    const seg = lameA(H.anim, H.k, H.x, SOL - H.y, H.dir);
    if (seg && (!H.trainee.length || H.trainee[H.trainee.length - 1].k !== H.k)) H.trainee.push({ seg, t: H.traineeT, k: H.k });
  } else if (H.etat === "plonge" && H.t >= PLONGE.appel) {
    const seg = lameA(H.anim, H.k, H.x, SOL - H.y, H.dir);
    if (seg) H.trainee.push({ seg, t: H.traineeT, k: H.k });
  }
}
function iai(H) {
  const parfait = H.charge > 0.85 && H.charge < 1.2, portee = parfait ? 230 : 70 + 110 * Math.min(1, H.charge);
  const x0 = H.x, x1 = Math.max(24, Math.min(ARENE - 24, H.x + H.dir * portee));
  const touches = J.ennemis.filter((e) => e.etat !== "mort" && !e.retirer && e.x - Math.min(x0, x1) >= -20 && e.x - Math.max(x0, x1) <= 20);
  touches.forEach((e) => {
    e.fige = 9;
    e.jeton = false;
  });
  H.x = x1;
  H.invul = Math.max(H.invul, 0.5);
  J.coupe = 0.07;
  J.coupeX0 = x0;
  J.coupeX1 = x1;
  changer(H, "iai-coupe", S["r-k-dash-coupe"] ? "r-k-dash-coupe" : "r-coup-fort");
  sfx("lourd");
  sfx("parade", 0.05);
  J.gel = 0.12;
  J.lent = parfait ? 1.1 : 0.45;
  if (parfait) J.eclair = 0.15;
  setTimeout(() => J.coupFureur(touches), parfait ? 450 : 260);
}
function dasher(H, d) {
  H.dir = d;
  changer(H, "dash", "r-marche");
  H.fantomesN = -1;
  H.invul = Math.max(H.invul, 0.12);
  sfx("lame");
}
function retour(H, [planche, ...images2]) {
  H.retourImages = images2;
  changer(H, "retour", planche);
}
function moulinetPossible(H, E) {
  if (!S["r-moulinet"] || J.serie < MOULINET.morts || H.moulinetSerie === J.serie || E.sabre || E.fort || J.temps - (H.moulinetT ?? -99) < MOULINET.repos) return false;
  return !J.ennemis.some((e) => e.etat !== "mort" && (Math.abs(e.x - H.x) < MOULINET.libre || e.etat === "armer" || e.etat === "frappe"));
}
function moulinet(H) {
  H.moulinetSerie = J.serie;
  H.moulinetT = J.temps;
  H.vx = 0;
  H.touches.clear();
  H.souillure = Math.max(0, H.souillure - MOULINET.sang);
  H.fureur = Math.min(1, H.fureur + MOULINET.fureur);
  changer(H, "moulinet", "r-moulinet");
  sfx("lame");
  sfx("lame", 0.25);
}
function sauter(H, E) {
  const d = (E.R ? 1 : 0) - (E.L ? 1 : 0);
  H.envol = false;
  H.elan = d * HEROINE.vitesse * 1.1;
  H.vx = 0;
  H.vy = 0;
  H.salto = !!(d && S["r-k-salto"]);
  changer(H, "saut", S["r-k-saut"] ? "r-k-saut" : "r-saut");
  sfx("lame");
}
function imageSaut(H) {
  if (H.t < DECOLLAGE) return 2;
  const v = H.vy / HEROINE.saut;
  if (v < -0.55) return 6;
  if (v < -0.2) return 7;
  if (v < 0) return 8;
  if (v < 0.25) return 9;
  return 10;
}
function fureur(H) {
  H.fureur = 0;
  H.marques = [];
  H.phase = "ruee";
  H.tp = 0;
  H.invul = 1.6;
  changer(H, "fureur", "r-estoc");
  sfx("fureur");
  J.lent = 0.5;
  J.eclair = 0.12;
}
function majFureur(H, dt) {
  H.tp += dt;
  if (H.phase === "ruee") {
    H.vx = H.dir * 720;
    for (const e of J.ennemis) if (!H.marques.includes(e) && e.etat !== "mort" && Math.abs(e.x - H.x) < 30) {
      H.marques.push(e);
      e.fige = 9;
    }
    if (H.tp > 0.36 || H.x <= 30 || H.x >= ARENE - 30) {
      H.phase = "coupe";
      H.tp = 0;
      H.anim = "r-coup-fort";
      H.vx = 0;
    }
  } else {
    H.vx = 0;
    const d = duree("r-coup-fort");
    if (H.tp > d * 0.55 && H.marques.length) {
      J.coupFureur(H.marques);
      H.marques = [];
    }
    if (H.tp >= d) changer(H, "garde", "r-garde");
  }
}
function blesserHeroine(source, dirCoup) {
  const H = J.H;
  if (H.pv <= 0 || H.invul > 0) return "rien";
  const face = Math.sign(source.x - H.x) === H.dir || source.x === H.x;
  if (H.etat === "parade" && face) {
    etincelles(H.x + H.dir * 22, SOL - H.y - 62, 14);
    if (H.paradeDepuis < FENETRE_PARFAITE) {
      H.fureur = Math.min(1, H.fureur + FUREUR_PAR_PARADE);
      J.parfaites++;
      sfx("parade");
      J.lent = 0.45;
      J.gel = 0.12;
      H.bloque = 0.3;
      vibrer(30);
      return "parfait";
    }
    sfx("fer");
    H.bloque = 0.3;
    H.x -= H.dir * HEROINE.reculParade * 0.4;
    J.gel = 0.06;
    return "pare";
  }
  H.pv -= source.degats || 1;
  H.invul = source.enchaine ? 0.5 : 1.1;
  H.souillure = Math.min(SOUILLURE_MAX, H.souillure + 0.06);
  gerbe(H.x, SOL - H.y - 70, dirCoup, 30, 0.8);
  sfx("aie");
  sfx("chair");
  vibrer(60);
  J.gel = 0.12;
  J.secousse = 0.2;
  J.rouge = 0.25;
  H.vx = dirCoup * 160;
  H.vy = 0;
  if (H.pv <= 0) {
    changer(H, "mort", "r-mort");
    J.lent = 1.6;
    J.grandMoment = 2.4;
    sfx("glas", 0.3);
    H.vx = dirCoup * 60;
    H.y = 0;
  } else if (S["r-k-chute"] && (H.y > 0 || H.pv <= 2 || source.coupe === "pied")) {
    changer(H, "chute", "r-k-chute");
    H.invul = 2.2;
    H.vx = dirCoup * 120;
  } else changer(H, "touche", "r-touche");
  return "touche";
}
function lameActive() {
  const H = J.H;
  if (H.etat === "plonge") {
    if (H.t < PLONGE.appel) return null;
    const l2 = lameA(H.anim, H.k, H.x, SOL - H.y, H.dir), pointe2 = l2 ? Math.max(Math.abs(l2[0][0] - H.x), Math.abs(l2[1][0] - H.x)) : 0;
    return { portee: Math.max(70, pointe2 + 22), degats: 2, tranche: true, coupe: "vertical", anim: H.anim, air: true };
  }
  if (H.etat !== "coup" && H.etat !== "coup-air") return null;
  const a = ANIMS[H.anim], f = H.t / duree(H.anim);
  if (f < a.frappe[0] - 0.06 || f > a.frappe[1] + 0.06) return null;
  const l = lameA(H.anim, H.k, H.x, SOL - H.y, H.dir);
  const pointe = l ? Math.max(Math.abs(l[0][0] - H.x), Math.abs(l[1][0] - H.x)) : 0;
  return { ...a, portee: Math.max(a.portee, pointe + 22), anim: H.anim, air: H.etat === "coup-air" };
}
function dessinerHeroine(cam) {
  const H = J.H;
  const eclair = H.invul > 1 && H.etat === "touche";
  for (const g of H.fantomes) dessinerFondu(g.anim, g.k, g.x - cam, SOL - g.y, g.dir, 0.55 * (1 - g.t / 0.22));
  const f = H.fondu, frappe = H.etat === "coup" || H.etat === "coup-air" || H.etat === "plonge";
  const opt = eclair ? { blanc: true } : { souillure: H.souillure };
  const anim = (H.etat === "dash" || H.etat === "marche" && H.court) && S["r-course"] ? "r-course" : H.anim;
  const dessine = H.anim === "r-garde" && H.etat === "garde" && !eclair && !(S["r-garde"].vivante && J.etat !== "titre" && J.etat !== "prologue") ? dessinerRespire((J.etat === "titre" || J.etat === "prologue") && S["r-garde-titre"] ? "r-garde-titre" : "r-garde", H.x - cam, SOL - H.y, H.dir, J.temps, opt) : dessiner(anim, H.k, H.x - cam, SOL - H.y, H.dir, opt);
  if (!dessine) {
    J.ctx.fillStyle = "#eee";
    J.ctx.fillRect(Math.round(H.x - cam - 10), Math.round(SOL - H.y - 120), 20, 120);
  }
  if (frappe && S[anim]?.effet) dessiner(S[anim].effet, H.k, H.x - cam, SOL - H.y, H.dir);
  if (H.trainee.length) dessinerTrainee(H.trainee, cam, H.traineeT, TRAINEE);
  if (H.etat === "iai") {
    const l = lameA(H.anim, H.k, H.x, SOL - H.y, H.dir), c = Math.min(1, H.charge / 1);
    if (l) {
      const f2 = H.charge * 1.7 % 1;
      eclat(l[0][0] + (l[1][0] - l[0][0]) * f2 - cam, l[0][1] + (l[1][1] - l[0][1]) * f2, c);
    }
    if (H.charge > 0.85 && H.charge < 1.2) eclat(H.x - cam + H.dir * 8, SOL - H.y - 70, 1);
  }
}

// src/js/ennemis.js
var ANIM = { sabreur: { marche: "marche", attaque: "attaque" }, ninja: { marche: "course", attaque: "lancer" } };
var ANIM_F = {
  marche: "marche",
  course: "course",
  garde: "garde",
  attaque: "coupe1",
  attaque2: "coupe3",
  chute: "chute",
  releve: "releve",
  mort: "chute",
  touche: "chute",
  // les attaques à venir (a-refaire/sabreur-*, rendues dans ChatGPT puis montées par depot.py) : dès que la planche existe, le catalogue l'emploie
  charge: "grande-coupe",
  degaine: "coupe1",
  reversC: "revers",
  feinte: "garde",
  revers: "revers",
  grande: "grande-coupe",
  envol: "envol",
  montante: "coupe2",
  parade: "parade",
  poings: "poings",
  crochet: "poings",
  pied: "pied"
};
var ATTAQUES = {
  attaque: { contexte: ["debout", "relance"], poids: 1, suite: ["revers", "crochet", "montante", "grande"] },
  // coupe1 : le dégainé horizontal
  revers: { contexte: ["debout", "relance"], poids: 1, suite: ["grande", "attaque", "pied", "envol"] },
  // la large coupe de revers
  grande: { contexte: ["debout"], poids: 0.6, tempo: 1.2, bond: 260, portee: 90, suite: ["revers", "montante", "envol"] },
  // l'immense coupe : lente, longue
  charge: { contexte: ["course"], poids: 1, bond: 210, freine: true, enCourant: true, portee: 92, suite: ["revers", "montante", "crochet"] },
  // (Florian, 28/09 : « tous les trois étaient dans la même pose, bras en l'air » — la course n'avait qu'UNE attaque ; il en a quatre)
  degaine: { contexte: ["course"], poids: 1, bond: 200, freine: true, enCourant: true, portee: 90, suite: ["revers", "grande", "crochet"] },
  // B : le dégainé en pleine course, lame à l'horizontale
  reversC: { contexte: ["course"], poids: 1, bond: 190, freine: true, enCourant: true, portee: 90, suite: ["attaque", "montante", "pied"] },
  // C : le revers en arrivant, large coupe latérale
  feinte: { contexte: ["course"], poids: 0.8 },
  // E : il freine, se met en garde, puis frappe (casse le rythme)   // en pleine course : la lame monte sur les derniers mètres et s'abat en arrivant ; il freine après le coup
  envol: { contexte: ["air"], poids: 1, sautable: 220, bond: 40, saut: -330, coupe: "vertical", suite: ["revers"] },
  // la coupe tournoyante en s'élevant : contre ses sauts
  montante: { contexte: ["air", "debout"], poids: 0.5, sautable: 220, coupe: "vertical", suite: ["grande", "revers"] },
  // la montante verticale
  parade: { contexte: ["riposte"], poids: 1, tempo: 0.5, suite: ["revers", "grande"] },
  // après le moulinet de parade : la riposte
  poings: { contexte: ["contact"], poids: 1, portee: 40, bond: 40, coupe: "poing", tempo: 0.7, suite: ["crochet", "pied"] },
  // le direct (au corps à corps)
  crochet: { contexte: ["contact", "relance"], poids: 0.8, portee: 54, bond: 110, coupe: "poing", tempo: 0.8, suite: ["pied", "revers"] },
  // le grand crochet (même planche : sa fin)
  pied: { contexte: ["contact"], poids: 0.7, portee: 48, bond: 60, coupe: "pied", tempo: 0.5, suite: ["grande", "attaque"] }
  // le coup de pied haut : il renverse
};
var ATTAQUES_X = {
  griffe: { contexte: ["debout", "relance", "contact"], poids: 1.2, tempo: 0.7, portee: 72, bond: 40, suite: ["griffe", "grande", "rafale", "pied"] },
  grande: { contexte: ["debout", "relance"], poids: 1, portee: 88, bond: 120, suite: ["tourbillon", "griffe", "arc"] },
  arc: { contexte: ["air", "debout"], poids: 0.8, sautable: 240, saut: -300, bond: 60, coupe: "vertical", suite: ["griffe", "tourbillon"] },
  tourbillon: { contexte: ["debout", "contact", "relance"], poids: 0.8, portee: 80, bond: 60, suite: ["griffe", "pied"] },
  pied: { contexte: ["contact", "relance"], poids: 0.9, portee: 62, bond: 30, coupe: "pied", tempo: 0.6, suite: ["griffe", "foreuse"] },
  plongeon: { contexte: ["loin", "air"], poids: 1, portee: 96, bond: 250, freine: true, saut: -360, coupe: "vertical", suite: ["griffe", "tourbillon"] },
  foreuse: { contexte: ["course", "loin"], poids: 1.2, portee: 84, bond: 330, saut: -130, freine: true, enCourant: true, suite: ["griffe", "grande"] },
  // il décolle : la vrille se fait en l'air
  rafale: { contexte: ["contact", "relance"], poids: 0.9, portee: 68, bond: 30, suite: ["grande", "pied"] }
};
var STYLES_X = {
  pression: {
    distance: 48,
    poids: { griffe: 2, rafale: 1.6, pied: 1.2, grande: 0.8, tourbillon: 0.6, arc: 0.4, plongeon: 0.2, foreuse: 0.6 },
    patterns: [["griffe", "griffe", "rafale"], ["griffe", "pied", "grande"], ["rafale", "griffe", "tourbillon"], ["pied", "griffe", "griffe", "grande"]]
  },
  contre: {
    distance: 96,
    poids: { griffe: 1, grande: 1.2, tourbillon: 0.8, arc: 1.2, pied: 0.5, rafale: 0.4, plongeon: 0.4, foreuse: 0.8 },
    patterns: [["grande", "griffe"], ["griffe", "tourbillon"], ["arc", "griffe"]]
  },
  voltige: {
    distance: 150,
    poids: { plongeon: 2, foreuse: 1.6, arc: 1.2, tourbillon: 0.8, griffe: 0.6, grande: 0.5, rafale: 0.2, pied: 0.3 },
    patterns: [["plongeon", "tourbillon"], ["foreuse", "griffe", "arc"], ["arc", "plongeon"], ["plongeon", "griffe", "grande"]]
  }
};
var STYLES = Object.keys(STYLES_X);
function changerStyle(e, force) {
  const autres = STYLES.filter((s) => s !== e.style);
  e.style = force || autres[Math.floor(Math.random() * autres.length)];
  e.styleT = 6 + Math.random() * 4;
  e.pattern = null;
}
var catalogue = (e) => e.type === "boss" ? ATTAQUES_X : ATTAQUES;
var ANIM_B = { marche: "marche", course: "course", garde: "garde", attaque: "lancer", attaque2: "coup", chute: "chute", mort: "mort", touche: "chute", bond: "chute" };
var PREFIXE = { sabreur: "sa", ninja: "ni", boss: "sa" };
var ANIM_X = {
  bloc: "bloc",
  garde: "garde",
  marche: "marche2",
  course: "course",
  griffe: "griffe",
  grande: "grande-griffe",
  arc: "arc",
  tourbillon: "tourbillon",
  pied: "pied",
  plongeon: "plongeon",
  foreuse: "foreuse",
  rafale: "rafale",
  touche: "touche",
  chute: "chute",
  releve: "releve",
  intro: "intro",
  attaque: "griffe",
  mort: "chute"
};
var REPLI_X = {
  griffe: "coupe1",
  grande: "grande-coupe",
  arc: "envol",
  tourbillon: "revers",
  pied: "pied",
  plongeon: "envol",
  foreuse: "grande-coupe",
  rafale: "poings",
  touche: "chute",
  intro: "garde",
  attaque: "coupe1",
  mort: "chute",
  chute: "chute",
  releve: "releve",
  garde: "garde",
  marche: "marche",
  course: "course"
};
var escrimeur = (e) => e.type === "sabreur" || e.type === "boss";
var SEQ = {
  sabreur: {
    attaque: { armer: [0, 1, 2, 3, 4, 5, 6], frappe: [7, 8, 9], repos: [10, 11, 12, 13] },
    // coupe1 : le dégainé
    revers: { armer: [0, 1, 2, 3], frappe: [4, 5, 6, 7], repos: [9, 10] },
    // (8, pose isolée, sautée)
    grande: { armer: [0, 1, 2, 3], frappe: [4, 5, 6], repos: [7, 8] },
    // (9, la ruée floue, sautée)
    charge: { armer: [], frappe: [2, 3, 4, 5, 6], tranche: 2, repos: [7, 8] },
    degaine: { armer: [], frappe: [6, 7, 8, 9], tranche: 1, repos: [10, 11, 12, 13] },
    // la lame sort du fourreau dans la foulée
    reversC: { armer: [], frappe: [3, 4, 5, 6, 7], tranche: 1, repos: [9, 10] },
    // l'armé : il court encore (planche de course) ; puis la grande coupe : lame levée (2-3), abattue (4-6) — elle ne tranche qu'à partir de 4
    envol: { armer: [0, 1], frappe: [2, 3, 4, 5, 6, 7, 8], repos: [9, 10, 11, 12] },
    montante: { armer: [4, 5, 6], frappe: [7, 8, 9, 10], repos: [11, 12] },
    // 0-3 : des gardes quasi immobiles, sautées
    parade: { bloque: [2, 3, 4, 5, 6, 7], armer: [7], frappe: [8, 9], repos: [10] },
    // le moulinet à la parade, puis la riposte
    poings: { armer: [0], frappe: [1, 2], repos: [3, 4] },
    crochet: { armer: [9], frappe: [10, 11, 12], repos: [] },
    pied: { armer: [2], frappe: [0, 1], repos: [3, 4] }
    // l'anticipation : la pose tournée (2) avant la jambe tendue (0)
  },
  ninja: {
    attaque: { armer: [0, 1, 2], frappe: [3], repos: [4, 5] },
    // le lancer
    attaque2: { armer: [0, 1, 2], frappe: [3, 4], repos: [5, 6, 7, 8, 9, 10] }
    // le coup de chakram
  },
  boss: {
    // lues sur la planche Wolverine (rangée par rangée) et les planches montées ; les doublons de pose de l'original sont sautés
    griffe: { armer: [0], frappe: [1, 2, 3], repos: [6, 7] },
    // 0 bras en arrière ; 1-5 la même pose griffes devant (tenue) ; 6-7 il se redresse
    grande: { armer: [0, 1], frappe: [2, 3], repos: [5, 6] },
    // 0 bras bas, 1 bras levé ; 2 la fente, 3 le suivi ; 5-6 il se relève (4 : un bout de poing détaché sur l'original)
    arc: { armer: [0, 1], frappe: [2, 3, 4], repos: [] },
    // 0-1 accroupi ; 2-4 la montée griffes en l'air (il saute)
    tourbillon: { armer: [], frappe: [1, 2, 3], repos: [] },
    // 0 (un bond dessiné géant par ChatGPT) écarté ; 1-3 la toupie accroupie
    pied: { armer: [0, 1], frappe: [2, 3], repos: [6, 7] },
    // 0 penché, 1 accroupi ; 2-5 la jambe en l'air (tenue) ; 6-7 il revient
    plongeon: { armer: [0, 1], frappe: [2, 3], repos: [4, 5] },
    // 0-1 le bond bras levés ; 2 la plongée griffes devant, 3 l'impact ; 4-5 ramassé
    foreuse: { armer: [0, 1], frappe: [2, 3, 4, 5], tranche: 1, repos: [] },
    // 0-1 l'appel (sauf en pleine course : il court) ; 2-5 la vrille
    rafale: { armer: [0, 1], frappe: [2, 3], repos: [] }
    // 0-1 bras levés ; 2-3 griffes devant
  }
};
var SEQ_PAR_BANDE = { "r-f-coupe1": "attaque", "r-f-revers": "revers", "r-f-grande-coupe": "grande", "r-f-envol": "envol", "r-f-coupe2": "montante", "r-f-parade": "parade", "r-f-poings": "poings", "r-f-pied": "pied" };
function seqDe(e) {
  const propre = SEQ[e.type]?.[e.attaque];
  if (propre && (e.type !== "boss" || e.anim.startsWith("r-x-"))) return propre;
  const emprunt = SEQ.sabreur[SEQ_PAR_BANDE[e.anim]];
  if (emprunt) return emprunt;
  const n = nbImages(e.anim), a = Math.max(1, Math.round(n * 0.4)), b = Math.max(a + 1, Math.round(n * 0.7)), r = (i, j) => Array.from({ length: Math.max(0, j - i) }, (_, k) => i + k);
  return { armer: r(0, a), frappe: r(a, b), repos: r(b, n) };
}
function coupSuivant2(e, H, dist) {
  if (J.forcerAttaque && S[nomAnim(e, J.forcerAttaque)]) return J.forcerAttaque;
  if (e.type === "boss" && e.pattern && e.pattern.length && H.y <= 30) {
    const k = e.pattern.shift(), c = catalogue(e)[k] || {};
    const convient = c.contexte.includes("relance") || dist < 60 && c.contexte.includes("contact") || dist >= 90 && c.contexte.includes("loin") || c.contexte.includes("debout");
    if (S[nomAnim(e, k)] && convient) return k;
    e.pattern = null;
  }
  if (H.y > 30) return choisirAttaque(e, "air", e.attaque);
  const suites = ((catalogue(e)[e.attaque] || {}).suite || []).filter((k) => S[nomAnim(e, k)] && (dist < 44 || !["poings", "crochet", "pied"].includes(k) || k === "crochet"));
  return suites.length ? suites[Math.floor(Math.random() * suites.length)] : choisirAttaque(e, "relance", e.attaque);
}
function choisirAttaque(e, contexte, sauf) {
  if (J.forcerAttaque && S[nomAnim(e, J.forcerAttaque)]) return J.forcerAttaque;
  const st = e.type === "boss" ? STYLES_X[e.style || "pression"] : null;
  if (st && contexte !== "air" && Math.random() < 0.6) {
    const p = st.patterns[Math.floor(Math.random() * st.patterns.length)].filter((k) => S[nomAnim(e, k)]);
    if (p.length && catalogue(e)[p[0]].contexte.includes(contexte)) {
      e.pattern = p.slice(1);
      e.chaine = Math.max(e.chaine || 0, p.length);
      return p[0];
    }
  }
  const choix = Object.entries(catalogue(e)).filter(([k, a]) => k !== sauf && a.contexte.includes(contexte) && S[nomAnim(e, k)]);
  if (!choix.length) return "attaque";
  const poids = ([k, a]) => a.poids * (st ? st.poids[k] ?? 1 : 1);
  let r = Math.random() * choix.reduce((s, c) => s + poids(c), 0);
  for (const c of choix) {
    r -= poids(c);
    if (r <= 0) return c[0];
  }
  return choix[choix.length - 1][0];
}
var TRAINEE2 = 0.2;
var RELEVE = { "r-b-chute": [4, 8] };
var REPRISE = { "r-b-course": 1 };
var falcon = () => !!S["r-f-marche"];
var byakki = () => !!S["r-b-marche"];
var REPLI_X_PROPRE = { touche: "chute", intro: "garde", mort: "chute", releve: "chute", marche: "marche", bloc: "garde" };
var ANIM_W = {
  garde: "pret",
  pret: "pret",
  marche: "marche",
  ruee: "ruee",
  lourd: "lourd",
  fente: "fente",
  droit: "droit",
  pied: "pied",
  accroupie: "accroupie",
  tornade: "tornade",
  saut: "saut",
  retombee: "retombee",
  intro: "intro",
  bloc: "bloc",
  touche: "touche",
  souleve: "souleve",
  chute: "chute",
  mort: "mort1",
  mort1: "mort1",
  mort2: "mort2",
  gisant: "gisant",
  releve: "chute",
  victoire: "victoire"
};
var nomAnim = (e, g) => e.type === "boss" ? ANIM_W[g] && S[`r-w-${ANIM_W[g]}`] ? `r-w-${ANIM_W[g]}` : S[`r-x-${ANIM_X[g] || g}`] ? `r-x-${ANIM_X[g] || g}` : S[`r-x-${REPLI_X_PROPRE[g]}`] ? `r-x-${REPLI_X_PROPRE[g]}` : `r-f-${REPLI_X[g] || ANIM_F[g] || g}` : e.type === "sabreur" && falcon() && ANIM_F[g] ? `r-f-${ANIM_F[g]}` : e.type === "ninja" && byakki() && ANIM_B[g] ? `r-b-${ANIM_B[g]}` : `r-${PREFIXE[e.type]}-${(ANIM[e.type] || {})[g] || g}`;
var prochainId = 1;
J.ennemis = [];
function apparaitre(type, cote) {
  const cfg = ENNEMIS[type];
  J.ennemis.push({
    id: prochainId++,
    type,
    cfg,
    x: cote < 0 ? Math.max(-50, J.cam - 40) : Math.min(ARENE + 50, J.cam + J.W + 40),
    y: 0,
    vy: 0,
    vx: 0,
    dir: -cote,
    etat: "approche",
    t: 0,
    recharge: rand(0.6, 1.6),
    k: 0,
    anim: nomAnim({ type }, "marche"),
    fige: 0,
    rang: 0,
    jeton: false,
    eclair: 0
  });
  const e = J.ennemis[J.ennemis.length - 1];
  if (type === "boss") {
    e.pvMax = e.pv = BOSS_PV + (J.bossN || 0);
    e.etat = "entree";
    e.invul = 9;
    e.anim = nomAnim(e, "marche");
    for (const o of J.ennemis) if (o !== e && o.type !== "boss" && o.etat !== "mort") {
      o.retrait = true;
      o.jeton = false;
    }
    J.boss = e;
  }
  return e;
}
function changer2(e, etat, g) {
  const avant2 = e.vu || e.anim, kAvant = e.vu ? e.kVu : e.k, apres = g ? nomAnim(e, g) : avant2;
  const boucle2 = (n) => n === nomAnim(e, "garde") || n === nomAnim(e, "marche"), course = (n) => n === nomAnim(e, "course");
  let duree2 = 0;
  if (e.type === "boss") {
    e.fondu = null;
  } else if (avant2 && g && apres !== avant2 && etat !== "frappe" && etat !== "chute" && etat !== "mort" && !course(apres)) {
    if ((etat === "garde" || etat === "approche") && !course(avant2)) duree2 = 0.12;
    else if (etat === "armer" && !course(avant2)) duree2 = 0.07;
    else if (etat === "bond" || etat === "releve" || etat === "esquive") duree2 = 0.1;
    else if (etat === "bloque" && boucle2(avant2)) duree2 = 0.07;
  }
  if (duree2) e.fondu = { anim: avant2, k: Math.min(kAvant, nbImages(avant2) - 1), dir: e.dir, t: 0, duree: duree2 };
  const tgAvant = e.etat === "repos" && avant2 === nomAnim(e, "garde") ? e.tg : null;
  e.etat = etat;
  e.t = 0;
  e.depuis = 0;
  if (g) e.anim = nomAnim(e, g);
  if (e.type === "boss" && g && avant2 && avant2 !== e.anim && S[avant2]?.allonge && S[e.anim]?.allonge && S[avant2].ancre !== S[e.anim].ancre) {
    const c0 = S[avant2].allonge[Math.min(kAvant, S[avant2].n - 1)].cx, c1 = S[e.anim].allonge[0].cx;
    e.x += e.dir * (c0 - c1);
  }
  if (g && e.anim !== avant2 && etat !== "garde" && etat !== "approche") e.k = 0;
  if (etat === "garde" && tgAvant != null) {
    e.t = tgAvant;
    return;
  }
  if ((etat === "garde" || etat === "approche") && avant2 && avant2 !== e.anim && e.type !== "boss") {
    const k = plusProche(avant2, kAvant, e.anim);
    e.t = etat === "garde" ? k / (e.type === "boss" ? 6 : 7) : 0;
    if (etat === "approche") e.pas = k + 0.3;
  }
}
var vivant = (e) => e.etat !== "mort";
var vitesseJeu = () => 1 + Math.min(0.5, J.chrono / 300);
var BOSS_COUPS = {
  lourd: { armer: [0, 1], armerT: 0.42, frappe: [2, 3], frappeT: 0.22, suite: [4, 5], suiteT: 0.16, retour: [6], retourT: 0.16, degats: 2, bond: 40 },
  fente: { armer: [0], armerT: 0.22, frappe: [1, 2], frappeT: 0.2, retour: [1, 0], retourT: 0.2, degats: 1, bond: 90 },
  droit: { armer: [4, 3], armerT: 0.3, frappe: [0, 1, 2], frappeT: 0.24, retour: [3, 4], retourT: 0.26, degats: 2 },
  pied: { armer: [0, 1], armerT: 0.24, frappe: [2, 3], frappeT: 0.2, retour: [4, 5, 6], retourT: 0.3, degats: 1, coupe: "pied" },
  accroupie: { armer: [3], armerT: 0.18, frappe: [0, 1, 2], frappeT: 0.24, retour: [3], retourT: 0.16, degats: 1 },
  tornade: { armer: [0, 1], armerT: 0.34, frappe: [2, 3, 4, 5, 6, 7], frappeT: 0.46, contact: [6, 7], retour: [8, 9], retourT: 0.3, degats: 2, bond: 230, coupe: "lateral", ouvert: 0.6 },
  // T1 (Raiga, choix de Florian) : il se ramasse, fonce bas, se relève et frappe devant ; puis ouvert 0,6 s
  ruee: { armer: [0], armerT: 0.2, frappe: [1, 2, 3], frappeT: 0.5, retour: [4, 5], retourT: 0.3, degats: 1, saut: -300, bond: 470 }
};
var BOSS_FOULEE = 12;
var bossPhase = (e) => e.pv <= Math.ceil(e.pvMax / 2) ? 2 : 1;
var bossCoup = (e) => BOSS_COUPS[e.attaque] || BOSS_COUPS.lourd;
function allongeDe(nom, k) {
  const s = S[nom], a = s && s.allonge ? s.allonge[Math.max(0, Math.min(k, s.n - 1))] : null;
  return a ? { avant: Math.max(a.avant, a.corps), corps: a.corps, haut: a.haut, bas: a.bas } : { avant: 80, corps: 60, haut: 120, bas: 0 };
}
var cxDe = (nom, k) => {
  const s = S[nom], a = s && s.allonge ? s.allonge[Math.max(0, Math.min(k, s.n - 1))] : null;
  return a ? a.cx : 0;
};
var centreX = (e) => e.x + e.dir * cxDe(e.anim, e.k);
var porteeCoup = (e, coup) => {
  const C = BOSS_COUPS[coup], nom = nomAnim(e, coup);
  return Math.max(...C.frappe.map((k) => allongeDe(nom, k).avant)) - cxDe(nomAnim(e, "pret"), 0);
};
var distanceVoulue = (e) => porteeCoup(e, "lourd") - 45;
function bossChoisir(e, H, dist) {
  const p = bossPhase(e), r = Math.random(), voulu = distanceVoulue(e);
  if (J.forcerAttaque && (BOSS_COUPS[J.forcerAttaque] || J.forcerAttaque === "plongee")) return J.forcerAttaque;
  if (H.pv <= 0 || H.etat === "chute" || H.etat === "releve") return null;
  if (dist <= voulu + 20) {
    const c = r < 0.2 ? "pied" : "accroupie";
    return r < 0.4 && dist <= porteeCoup(e, c) + 10 ? c : "lourd";
  }
  if (dist >= 130 && dist <= porteeCoup(e, "tornade") + BOSS_COUPS.tornade.bond * BOSS_COUPS.tornade.frappeT * 0.8 && r < (p === 2 ? 0.35 : 0.25) && (e.tornadeT || 0) <= 0) return "tornade";
  if (dist >= 280 && r < (p === 2 ? 0.7 : 0.5)) return "plongee";
  if (dist >= 170 && dist <= 300 && r < (p === 2 ? 0.5 : 0.35)) return "ruee";
  return null;
}
function bossArmer(e, coup) {
  e.touche = false;
  e.blocs = 0;
  if (coup === "plongee") {
    e.attaque = "plongee";
    changer2(e, "armer", "retombee");
    e.degats = 2;
    e.coupe = "vertical";
    return;
  }
  const C = BOSS_COUPS[coup];
  e.attaque = coup;
  e.degats = C.degats;
  e.coupe = C.coupe || "lateral";
  e.enchaine = !!(e.chaine && e.chaine.length);
  if (coup === "tornade") e.tornadeT = 3;
  changer2(e, "armer", coup);
}
function bossEnchaine(e, H, dist) {
  if (!e.chaine || !e.chaine.length || H.pv <= 0 || H.etat === "chute" || H.etat === "releve" || e.dir !== Math.sign(H.x - e.x)) {
    e.chaine = null;
    return false;
  }
  let coup = e.chaine[0];
  const c = Math.random() < 0.5 ? "pied" : "accroupie";
  if (!e.insere && Math.random() < 0.6 && dist <= porteeCoup(e, c) + 10) {
    e.insere = true;
    coup = c;
  } else e.chaine.shift();
  if (dist > porteeCoup(e, coup) + 40) {
    e.chaine = null;
    return false;
  }
  bossArmer(e, coup);
  return true;
}
function bossLire(e, H, dist) {
  if (H.etat !== "coup" || H.t > 0.1 || dist > 130 || (e.lecture || 0) > 0 || e.dir !== -H.dir) return false;
  e.lecture = 0.9;
  const p = bossPhase(e), lourd = !!ANIMS[H.anim]?.tranche;
  if (Math.random() < (lourd ? p === 2 ? 0.6 : 0.4 : p === 2 ? 0.85 : 0.65)) {
    changer2(e, "bloque", "bloc");
    e.pare = 0.5;
    e.riposte = false;
    e.vx = 0;
    return true;
  }
  return false;
}
function bossContact(e, H) {
  const al = allongeDe(e.anim, e.k), devant = (H.x - e.x) * e.dir - 16;
  if (devant < -8 || devant > al.avant + 6) return false;
  const bas = e.y + al.bas - 6, haut = e.y + al.haut + 8, hH = hauteur(H.anim, H.k) || 88;
  return H.y < haut && H.y + hH > bas;
}
function bossFrappe(e, H, C) {
  if (e.touche || C.contact && !C.contact.includes(e.k) || !bossContact(e, H)) return;
  e.touche = true;
  const r = blesserHeroine(e, e.dir);
  if (r === "touche") {
    J.gel = Math.max(J.gel, e.degats >= 2 ? 0.14 : 0.08);
    J.secousse = Math.max(J.secousse, 0.3);
  }
  if (r === "parfait") {
    e.chaine = null;
    changer2(e, "touche", "touche");
    e.vx = -e.dir * 120;
    e.eclair = 0.1;
    e.long = 0.7;
  }
  if (r === "pare") {
    e.vx = -e.dir * 90;
  }
}
function bossImage(e) {
  const n = nbImages(e.anim), C = bossCoup(e), t = e.t;
  const seq = (liste, T) => liste && liste.length ? liste[Math.min(liste.length - 1, Math.floor(t / Math.max(0.01, T) * liste.length))] : e.k;
  let k;
  switch (e.etat) {
    case "entree":
    case "marche":
      k = Math.floor(e.pas || 0) % n;
      break;
    case "intro":
      k = Math.floor(t * 8);
      break;
    case "garde":
      k = Math.floor(t * 6) % n;
      break;
    // « prêt à l'attaque », il se penche et provoque
    case "armer":
      k = e.attaque === "plongee" ? Math.min(1, Math.floor(t * 6)) : seq(C.armer, C.armerT);
      break;
    case "frappe":
      k = seq(C.frappe, C.frappeT);
      break;
    case "suite":
      k = seq(C.suite, C.suiteT);
      break;
    case "retour":
      k = seq(C.retour, C.retourT);
      break;
    case "saut":
      k = t < 0.1 ? 0 : t < 0.2 ? 1 : 2 + Math.min(2, Math.floor((t - 0.2) * 6));
      break;
    case "plonge":
      k = t < 0.12 ? 2 : t < 0.3 ? 3 : 4;
      break;
    case "atterrit":
      k = 5;
      break;
    case "bloque":
      k = e.anim === "r-w-bloc" ? Math.floor(t * 8) % n : 1;
      break;
    // garde griffes sorties : elle respire
    case "touche":
      k = e.souleve ? Math.min(5, Math.floor(t * 10)) : Math.min(3, Math.floor(t * 10));
      break;
    // à genoux → accroupi ; soulevé : l'autre planche
    case "chute":
      k = Math.floor(t * 12);
      break;
    case "releve":
      k = 3;
      break;
    case "mort":
      k = e.anim === "r-w-mort1" ? Math.min(n - 1, Math.floor(t * 8)) : e.anim === "r-w-mort2" ? Math.floor(t * 12) : Math.floor(t * 5);
      break;
    // envoyé en l'air → culbute → face contre terre
    case "victoire":
      k = Math.floor(t * 7) % (n + 8);
      break;
    // V2 : la provocation, rejouée après un temps
    default:
      k = e.k;
  }
  return Math.max(0, Math.min(n - 1, k));
}
function majBoss(e, dt) {
  const H = J.H, cfg = e.cfg, dx = H.x - centreX(e), dist = Math.abs(dx), face = () => {
    e.dir = Math.sign(dx) || e.dir;
  };
  e.recharge -= dt;
  if (e.lecture > 0) e.lecture -= dt;
  if (e.pare > 0) e.pare -= dt;
  if (e.tornadeT > 0) e.tornadeT -= dt;
  if (e.ouvert > 0) e.ouvert -= dt;
  const n = nbImages(e.anim), p = bossPhase(e), C = bossCoup(e), vitesse = cfg.vitesse * (p === 2 ? 1.5 : 1.25);
  const marcher = (v) => {
    e.vx = e.dir * v;
    e.pas = (e.pas || 0) + Math.abs(e.vx) * dt / BOSS_FOULEE;
  };
  switch (e.etat) {
    case "entree": {
      face();
      marcher(vitesse * 0.9);
      if (dist < 240 || e.t > 4) {
        changer2(e, "intro", "intro");
        e.vx = 0;
      }
      break;
    }
    case "intro": {
      e.vx = 0;
      if (e.t >= 5 / 8 && !e.snikt) {
        e.snikt = true;
        sfx("taiko");
        J.secousse = Math.max(J.secousse, 0.2);
      }
      if (e.t >= n / 8 + 0.2) {
        changer2(e, "garde", "garde");
        e.pret = true;
        e.invul = 0;
        e.recharge = 0.9;
      }
      break;
    }
    case "garde": {
      face();
      e.vx = 0;
      if (e.anim !== nomAnim(e, "garde")) e.anim = nomAnim(e, "garde");
      if (H.pv <= 0 && e.t > 0.6 && S["r-w-victoire"]) {
        changer2(e, "victoire", "victoire");
        break;
      }
      if (bossLire(e, H, dist)) break;
      const coup = e.recharge <= 0 && e.t >= 0.15 ? bossChoisir(e, H, dist) : null;
      if (coup) {
        if (coup === "lourd") {
          e.chaine = ["fente", "droit"];
          e.insere = false;
        }
        bossArmer(e, coup);
        break;
      }
      if (dist > distanceVoulue(e) + 30 && e.t >= 0.25 && H.pv > 0) {
        changer2(e, "marche", "marche");
        e.pas = 0;
      }
      break;
    }
    case "marche": {
      face();
      marcher(vitesse);
      if (bossLire(e, H, dist)) break;
      const coup = e.recharge <= 0 ? bossChoisir(e, H, dist) : null;
      if (coup) {
        if (coup === "lourd") {
          e.chaine = ["fente", "droit"];
          e.insere = false;
        }
        bossArmer(e, coup);
        break;
      }
      if (dist <= distanceVoulue(e) || H.pv <= 0) changer2(e, "garde", "garde");
      break;
    }
    case "armer": {
      e.vx = 0;
      if (e.attaque === "plongee") {
        if (e.t >= 0.3) {
          changer2(e, "saut", "saut");
          e.vy = -560;
          e.y = 0.01;
          e.vx = e.dir * Math.max(60, Math.min(300, (dist - 70) / 0.8));
        }
        break;
      }
      if (e.t >= C.armerT) {
        changer2(e, "frappe");
        sfx("lame");
        if (C.saut && e.y === 0) {
          e.vy = C.saut;
          e.y = 0.01;
        }
        if (e.attaque === "ruee") e.bond = Math.max(120, Math.min(C.bond, (dist - 110) / 0.42));
      }
      break;
    }
    case "frappe": {
      e.vx = e.dir * (e.attaque === "ruee" ? e.bond : C.bond || 0) * (e.attaque === "ruee" && e.y === 0 ? 0.3 : 1);
      bossFrappe(e, H, C);
      if (e.etat !== "frappe") break;
      if (e.t >= C.frappeT && e.y === 0) changer2(e, C.suite ? "suite" : "retour");
      else if (e.attaque === "ruee" && e.y === 0 && e.t > 0.25) changer2(e, "retour");
      break;
    }
    case "suite": {
      e.vx *= 1 - 6 * dt;
      bossFrappe(e, H, C);
      if (e.etat === "suite" && e.t >= C.suiteT) changer2(e, "retour");
      break;
    }
    case "retour": {
      e.vx *= 1 - 8 * dt;
      if (e.t >= C.retourT) {
        if (bossEnchaine(e, H, dist)) break;
        changer2(e, "garde", "garde");
        e.recharge = (C.ouvert || 0) + (p === 2 ? rand(0.4, 0.8) : rand(0.8, 1.3));
        e.ouvert = C.ouvert || 0;
      }
      break;
    }
    case "saut": {
      if (e.vy >= -40 || e.t > 0.6) {
        changer2(e, "plonge", "retombee");
        e.vx = e.dir * 140;
      }
      break;
    }
    case "plonge": {
      if (e.t < 0.12) e.vx = e.dir * 160;
      else {
        e.vx = e.dir * 90;
        if (e.vy < 320) e.vy = 320;
      }
      bossFrappe(e, H, C);
      if (e.y === 0 && e.t > 0.15) {
        changer2(e, "atterrit", "retombee");
        e.vx = 0;
        sfx("taiko");
        J.secousse = Math.max(J.secousse, 0.3);
      }
      break;
    }
    case "atterrit": {
      e.vx = 0;
      if (e.t < 0.12) bossFrappe(e, H, C);
      if (e.etat === "atterrit" && e.t >= 0.3) {
        changer2(e, "garde", "garde");
        e.recharge = p === 2 ? 0.5 : 0.9;
        e.ouvert = 0.4;
      }
      break;
    }
    case "bloque": {
      face();
      e.vx *= 1 - 10 * dt;
      if (e.t > 0.32 && e.pare <= 0) {
        if (e.riposte && dist < porteeCoup(e, "fente") + 10 && H.pv > 0 && (p === 2 || Math.random() < 0.6)) {
          e.riposte = false;
          e.chaine = ["droit"];
          bossArmer(e, "fente");
        } else {
          e.riposte = false;
          changer2(e, "garde", "garde");
          e.recharge = Math.min(e.recharge, 0.3);
        }
      }
      break;
    }
    case "touche": {
      e.vx *= 1 - 7 * dt;
      if (e.t > (e.long || (e.souleve ? 0.6 : 0.45))) {
        e.long = 0;
        e.souleve = false;
        changer2(e, "garde", "garde");
        e.recharge = 0.35;
      }
      break;
    }
    case "chute": {
      e.vx *= 1 - 5 * dt;
      if (e.t >= n / 12 + 0.6) {
        changer2(e, "releve", "chute");
        e.invul = 0.2;
      }
      break;
    }
    case "releve": {
      e.vx = 0;
      if (e.t >= 0.35) {
        changer2(e, "garde", "garde");
        e.recharge = 0.4;
      }
      break;
    }
    case "victoire": {
      e.vx = 0;
      break;
    }
    case "mort": {
      if (e.anim === "r-w-mort1") {
        if (e.y === 0 && e.t > 0.2) {
          changer2(e, "mort", "mort2");
          e.vx = e.vx * 0.6;
        }
      } else if (e.anim === "r-w-mort2") {
        e.vx *= 1 - 3 * dt;
        if (e.t >= n / 12) {
          changer2(e, "mort", "gisant");
          e.vx = 0;
        }
      } else {
        e.vx = 0;
        if (e.t >= 1.4) {
          gisant(e.anim, n - 1, e.x, e.dir);
          e.retirer = true;
        }
      }
      break;
    }
    default:
      changer2(e, "garde", "garde");
  }
  e.k = bossImage(e);
  if (e.y === 0 && !["frappe", "suite", "plonge", "chute", "mort", "touche"].includes(e.etat) && H.pv > 0) {
    const c = centreX(e), d = H.x - c;
    if (Math.abs(d) < 60) {
      e.x -= (Math.sign(d) || e.dir) * (60 - Math.abs(d));
      if (e.vx * (Math.sign(d) || e.dir) > 0) e.vx = 0;
    }
  }
}
function majEnnemis(dt) {
  const H = J.H;
  for (const cote of [-1, 1]) {
    const liste = J.ennemis.filter((e) => vivant(e) && Math.sign(e.x - H.x) === cote && e.type !== "ninja").sort((a, b) => Math.abs(a.x - H.x) - Math.abs(b.x - H.x));
    liste.forEach((e, i) => {
      e.rang = i;
    });
  }
  let attaquants = J.ennemis.filter((e) => e.jeton).length;
  for (const e of J.ennemis) {
    e.t += dt;
    e.depuis = (e.depuis || 0) + dt;
    e.eclair = Math.max(0, e.eclair - dt);
    if (e.fondu && (e.fondu.t += dt) > (e.fondu.duree || 0.12)) e.fondu = null;
    if (e.fige > 0) {
      e.fige -= dt;
      if (e.fige < 5) e.fige = Math.max(0, e.fige);
      continue;
    }
    const cfg = e.cfg, dx = H.x - e.x, dist = Math.abs(dx), v = vitesseJeu();
    const peutTourner = e.etat === "approche" || e.etat === "garde";
    if (peutTourner) e.dir = Math.sign(dx) || e.dir;
    if (e.y > 0 || e.vy < 0) {
      e.vy += GRAVITE * dt;
      e.y -= e.vy * dt;
      if (e.y <= 0) {
        e.y = 0;
        e.vy = 0;
        if (e.type === "boss") J.secousse = Math.max(J.secousse, 0.12);
        if (e.etat === "bond") {
          const r = RELEVE[nomAnim(e, "chute")];
          if (r) {
            changer2(e, "releve", "chute");
            e.depart = r[0];
            e.cadence = 14;
            e.retour = false;
            e.vx = 0;
          } else changer2(e, "garde", "garde");
        }
      }
    }
    if (e.invul > 0) e.invul -= dt;
    if (e.retrait && (e.etat === "approche" || e.etat === "garde")) {
      e.dir = Math.sign(dx) || e.dir;
      e.vx = -e.dir * cfg.vitesse * 2.2;
      e.charge = false;
      if (e.etat !== "approche" || e.anim !== nomAnim(e, "course")) changer2(e, "approche", "course");
      if (Math.abs(e.x - (J.cam + J.W / 2)) > J.W / 2 + 90) e.retirer = true;
      e.pas = (e.pas || 0) + Math.abs(e.vx) * dt / 22;
      e.k = Math.floor(e.pas) % nbImages(e.anim);
      e.x += e.vx * dt;
      e.vu = e.anim;
      e.kVu = e.k;
      continue;
    }
    if (e.type === "boss") {
      majBoss(e, dt);
    } else switch (e.etat) {
      case "entree": {
        e.dir = Math.sign(dx) || e.dir;
        e.vx = e.dir * cfg.vitesse * 0.85;
        if (dist < 230 || e.t > 4) {
          changer2(e, "intro", "intro");
          e.vx = 0;
          sfx("taiko");
          J.secousse = Math.max(J.secousse, 0.25);
        }
        break;
      }
      case "intro": {
        e.vx = 0;
        if (e.t >= Math.max(0.8, nbImages(e.anim) / 9)) {
          changer2(e, "garde", "garde");
          e.recharge = 1.3;
          e.invul = 0;
          e.pret = true;
        }
        break;
      }
      // pret : sa jauge apparaît, le combat commence (elle a le temps de reprendre la main avant son premier coup)
      case "esquive": {
        e.vx = -e.dir * 480;
        e.invul = Math.max(e.invul || 0, 0.06);
        if (e.t > 0.24 && e.y === 0) {
          changer2(e, "garde", "garde");
          e.recharge = 0;
          e.chaine = 3;
          e.pattern = e.style === "voltige" ? ["plongeon", "griffe"] : ["grande", "griffe"];
        }
        break;
      }
      case "touche": {
        e.vx *= 1 - 7 * dt;
        if (e.t > 0.32) {
          changer2(e, "garde", "garde");
          e.recharge = 0.1;
        }
        break;
      }
      case "approche":
      case "garde": {
        if (e.type === "boss") {
          if (!e.style) changerStyle(e);
          if ((e.styleT -= dt) <= 0) changerStyle(e);
          if (e.esquiveT > 0) e.esquiveT -= dt;
          if (H.etat === "coup" && H.t < 0.1 && dist < 110 && (e.lecture || 0) <= 0) {
            e.lecture = 0.7;
            const lourd = !!ANIMS[H.anim]?.tranche, talent = e.style === "contre" ? 0.8 : e.style === "voltige" ? 0.65 : 0.55;
            if (Math.random() < talent) {
              if (lourd && e.style !== "pression" && (e.esquiveT || 0) <= 0) {
                e.esquiveT = 1.2;
                changer2(e, "esquive", "arc");
                if (e.y === 0) {
                  e.vy = -190;
                  e.y = 0.01;
                }
                break;
              }
              e.pare = 0.45;
            }
          }
          if (e.lecture > 0) e.lecture -= dt;
          if (e.pare > 0) e.pare -= dt;
        }
        e.feinte = e.feinte ?? rand(0, 6.28);
        const porteeReelle = cfg.portee + cfg.bond * cfg.frappe * 0.7 - 4;
        const premierOccupe = e.rang === 1 && J.ennemis.some((o) => o !== e && o.type !== "ninja" && o.rang === 0 && Math.sign(o.x - H.x) === Math.sign(e.x - H.x) && ["armer", "frappe", "repos", "chute", "releve"].includes(o.etat));
        let voulu = (e.type === "ninja" ? cfg.distance : e.type === "boss" ? STYLES_X[e.style].distance : Math.min(cfg.distance, porteeReelle - 12)) + (premierOccupe ? 26 : e.rang * 48) + (e.rang > 0 ? Math.sin(J.temps * 1.3 + e.feinte) * 14 : 0);
        if (e.type === "ninja") {
          for (const o of J.ennemis) if (o.type !== "ninja" && o.etat !== "mort" && Math.sign(o.x - H.x) === Math.sign(e.x - H.x)) voulu = Math.max(voulu, Math.abs(o.x - H.x) + 60);
        }
        const bouche = e.type !== "ninja" && J.ennemis.some((o) => o !== e && o.type !== "ninja" && o.etat !== "mort" && Math.sign(o.x - H.x) === Math.sign(e.x - H.x) && Math.abs(o.x - H.x) < Math.abs(e.x - H.x) && Math.abs(e.x - H.x) - Math.abs(o.x - H.x) < 46);
        e.recharge -= dt;
        if (e.type === "ninja" && dist < 120 && e.y === 0 && H.pv > 0) {
          e.surpris = (e.surpris || 0) + dt;
          e.vx = 0;
          if (e.etat !== "garde") changer2(e, "garde", "garde");
          if (e.surpris < 0.25) break;
          const libreN = J.ennemis.filter((o) => o.type === "ninja" && o.jeton).length < 1;
          if (byakki() && dist < 70 && e.recharge <= 0 && libreN && !(J.lent > 0)) {
            e.jeton = true;
            attaquants++;
            e.vx = 0;
            e.touche = false;
            e.attaque = "attaque2";
            e.tempo = 0.7;
            changer2(e, "armer", "attaque2");
            break;
          }
          e.surpris = 0;
          fuir(e);
          break;
        }
        if (e.type === "ninja") e.surpris = 0;
        const stable = e.depuis > 0.3;
        if (dist > voulu + 10 && bouche) {
          e.vx = 0;
          if (e.etat !== "garde" && stable) changer2(e, "garde", "garde");
        } else if (dist > voulu + 10) {
          const aCourse = S[nomAnim(e, "course")] && nomAnim(e, "course") !== nomAnim(e, "marche");
          const fuit = H.vx * Math.sign(H.x - e.x) > 40;
          const peutCharger = e.type === "ninja" ? dist > voulu + 90 : e.type === "boss" ? dist > 170 && e.recharge <= 0.3 : e.rang === 0 && e.recharge <= 0.5 && attaquants < J.jetons && dist < 240;
          if (aCourse && (peutCharger || fuit)) e.charge = true;
          if (e.charge && dist > 320 && e.type !== "ninja") e.charge = false;
          const court = e.charge;
          e.elan = Math.min(1, Math.max(0, (e.elan || 0) + (court ? dt / 0.12 : -dt / 0.15)));
          e.vx = e.dir * cfg.vitesse * v * (1 + 1.2 * e.elan);
          const g = court ? "course" : "marche";
          if ((e.etat !== "approche" || e.anim !== nomAnim(e, g)) && (stable || e.charge)) changer2(e, "approche", g);
        } else if (dist < voulu - 14 && e.type !== "boss") {
          e.vx = -e.dir * cfg.vitesse * 0.7;
          if (e.etat !== "approche" && stable) changer2(e, "approche", "marche");
        } else if (stable || e.etat === "garde") {
          e.vx = 0;
          e.charge = false;
          if (e.etat !== "garde") changer2(e, "garde", "garde");
        }
        if (e.etat === "garde") e.vx = 0;
        const enCourse = e.charge && e.etat === "approche" && e.anim === nomAnim(e, "course") && (e.elan || 0) > 0.6;
        const vH = Math.max(0, H.vx * Math.sign(e.x - H.x)), fonce = vH > 160 && H.y < 30;
        const aPortee = e.type === "ninja" ? dist < 330 && e.x > 10 && e.x < ARENE - 10 : dist < (enCourse ? 150 : e.type === "boss" ? 215 : porteeReelle) + vH * 0.2;
        const libre = e.type === "ninja" ? J.ennemis.filter((o) => o.type === "ninja" && o.jeton).length < 1 : e.type === "boss" || attaquants < J.jetons;
        const ouverte = e.type !== "ninja" && ouverture(H);
        const relais = e.type === "sabreur" && e.rang === 1 && premierOccupe;
        if (aPortee && (e.recharge <= 0 || ouverte || e.charge || fonce && escrimeur(e)) && libre && !(e.etat === "garde" && e.t < 0.07) && (e.rang === 0 || e.type === "ninja" || relais) && H.pv > 0 && H.etat !== "fureur" && !(J.lent > 0)) {
          e.charge = false;
          e.jeton = true;
          attaquants++;
          e.vx = 0;
          e.touche = false;
          e.glisse = 0;
          e.lance = false;
          if (escrimeur(e) && enCourse && e.type === "sabreur") {
            const pris = J.ennemis.filter((o) => o !== e && o.arrivee && (o.etat === "armer" || o.etat === "frappe")).map((o) => o.attaque);
            const l = ["charge", "degaine", "reversC", "feinte"].filter((k2) => S[nomAnim(e, k2)] && k2 !== e.derniereArrivee && !pris.includes(k2));
            const c = l.length ? l : ["charge"], poids = c.map((k2) => ATTAQUES[k2].poids);
            let r = Math.random() * poids.reduce((a, b) => a + b, 0), k = c[c.length - 1];
            for (let i = 0; i < c.length; i++) {
              r -= poids[i];
              if (r <= 0) {
                k = c[i];
                break;
              }
            }
            e.attaque = k;
            e.derniereArrivee = k;
            e.arrivee = true;
          } else if (escrimeur(e)) {
            e.attaque = choisirAttaque(e, enCourse ? "course" : H.y > 30 ? "air" : dist < 44 ? "contact" : e.type === "boss" && dist > 130 ? "loin" : "debout");
            e.arrivee = false;
          } else e.attaque = "attaque";
          if (e.attaque === "feinte") {
            e.jeton = false;
            attaquants--;
            e.arrivee = false;
            changer2(e, "garde", "garde");
            e.recharge = rand(0.45, 0.85);
            e.chaine = 0;
            break;
          }
          changer2(e, "armer", (catalogue(e)[e.attaque] || {}).enCourant && enCourse ? "course" : e.attaque);
          const A = catalogue(e)[e.attaque] || {};
          e.tempo = (enCourse && escrimeur(e) ? 0.5 : ouverte || fonce ? 0.6 : Math.random() < (e.type === "boss" ? 0.2 : 0.1) ? 1.4 : 1) * (A.tempo || 1);
          e.lance = enCourse && escrimeur(e);
          if (e.type !== "boss" || !e.pattern) e.chaine = e.type === "boss" ? 3 + Math.floor(Math.random() * 3) : e.type === "sabreur" ? 2 + Math.floor(Math.random() * 3) : 1;
        }
        break;
      }
      case "armer": {
        const pas = Math.min(e.glisse || 0, 110 * dt);
        e.glisse = (e.glisse || 0) - pas;
        e.vx = pas / dt * e.dir;
        if (e.type === "sabreur" && e.attaque === "attaque2" && e.t < 0.14) {
          e.vx += e.dir * 70;
          if (e.y === 0 && e.t < dt) {
            e.vy = -110;
            e.y = 0.01;
          }
        }
        if (e.lance) e.vx += e.dir * cfg.vitesse * v * 2.2;
        const enCharge = !!(catalogue(e)[e.attaque] || {}).enCourant && e.anim === nomAnim(e, "course");
        const vH = Math.max(0, H.vx * Math.sign(e.x - H.x));
        if (vH > 160 && (e.tempo || 1) > 0.6 && !enCharge) e.tempo = 0.6;
        if (enCharge ? Math.abs(H.x - e.x) <= 96 + 0.13 * vH || e.t >= 0.6 : e.t >= cfg.armer * (e.tempo || 1) / v) {
          changer2(e, "frappe", e.anim === nomAnim(e, "course") ? e.attaque : void 0);
          if (e.type === "ninja" && e.attaque !== "attaque2") lancer(e);
          else sfx("lame");
          const A = catalogue(e)[e.attaque];
          if (A && A.saut && e.y === 0) {
            e.vy = A.saut;
            e.y = 0.01;
          }
        }
        break;
      }
      case "frappe": {
        const A = catalogue(e)[e.attaque] || {}, apresCoup = Math.floor(e.t * 15) > (seqDe(e).tranche || 0);
        e.vx = e.dir * (e.type === "ninja" && e.attaque === "attaque2" ? 90 : (A.bond ?? cfg.bond) * (apresCoup && A.freine ? 0.3 : 1));
        const sqF = seqDe(e), tranche = Math.floor(e.t * 15) >= (sqF.tranche || 0);
        if ((e.type !== "ninja" || e.attaque === "attaque2") && !e.touche && tranche) {
          const devant = (H.x - e.x) * e.dir;
          const portee = e.type === "ninja" ? 64 : A.portee ?? cfg.portee, sautable = e.type === "ninja" ? 60 : e.attaque === "attaque2" ? 30 : A.sautable ?? cfg.sautable;
          if (devant > -10 && devant < portee && H.y < sautable) {
            e.touche = true;
            e.coupe = A.coupe || "lateral";
            const r = blesserHeroine(e, e.dir);
            if (e.type === "boss" && r === "touche") {
              J.gel = Math.max(J.gel, ["grande", "foreuse", "plongeon", "tourbillon"].includes(e.attaque) ? 0.14 : 0.08);
              J.secousse = Math.max(J.secousse, 0.3);
            }
            if (r === "parfait") {
              briser(e);
              break;
            }
            if (r === "pare") {
              e.vx = -e.dir * 120;
              e.x -= e.dir * 14;
            }
          }
        }
        if (e.t >= Math.max(cfg.frappe, seqDe(e).frappe.length / 15)) changer2(e, "repos");
        break;
      }
      case "repos": {
        e.vx *= 1 - 8 * dt;
        if ((e.chaine || 0) > 1 && e.t >= 0.04 && Math.abs(H.x - e.x) < porteeReelleDe(e) + 36 && H.pv > 0 && H.etat !== "chute" && H.etat !== "releve") {
          e.chaine--;
          e.tempo = 0.7;
          e.lance = false;
          if ((H.x - e.x) * e.dir < -16) e.dir = -e.dir;
          e.attaque = escrimeur(e) ? coupSuivant2(e, H, Math.abs(H.x - e.x)) : "attaque";
          if (Math.abs(H.x - e.x) > porteeReelleDe(e) - 10) e.glisse = e.type === "boss" ? 8 : 18;
          changer2(e, "armer", e.attaque);
          e.touche = false;
          break;
        }
        if (e.t >= cfg.repos / v) {
          e.jeton = false;
          e.chaine = 0;
          e.recharge = (e.type === "boss" ? rand(0.3, 0.6) : rand(0.15, 0.5)) / v;
          changer2(e, "garde", "garde");
        }
        break;
      }
      case "brise": {
        e.vx *= 1 - 6 * dt;
        if (e.t > 1.1) {
          e.jeton = false;
          e.recharge = 1;
          changer2(e, "garde", "garde");
        }
        break;
      }
      case "bloque": {
        e.vx *= 1 - 10 * dt;
        if (e.t > 0.35) {
          if (e.riposte && (e.type === "boss" || attaquants < J.jetons) && Math.abs(H.x - e.x) < porteeReelleDe(e) && H.pv > 0) {
            e.jeton = true;
            attaquants++;
            e.touche = false;
            e.attaque = e.type === "boss" ? "griffe" : "parade";
            e.tempo = 0.5;
            e.lance = false;
            e.glisse = 0;
            e.chaine = e.type === "boss" ? 3 : 1;
            changer2(e, "armer", e.attaque);
          } else changer2(e, "garde", "garde");
          e.riposte = false;
        }
        break;
      }
      case "bond":
        break;
      case "chute": {
        e.vx *= 1 - 5 * dt;
        const r = RELEVE[e.anim], sol = r ? r[0] : nbImages(e.anim) - 1, cad = r ? 12 : 15;
        if (e.t >= (sol + 1) / cad + 0.5) {
          e.jeton = false;
          e.recharge = 0.6;
          if (r) {
            changer2(e, "releve", "chute");
            e.depart = r[1];
            e.cadence = 8;
          } else {
            changer2(e, "releve", S[nomAnim(e, "releve")] ? "releve" : "chute");
            e.depart = 0;
            e.cadence = 8;
            e.retour = !S[nomAnim(e, "releve")];
          }
        }
        break;
      }
      case "releve": {
        e.vx = 0;
        if (e.t >= (nbImages(e.anim) - (e.depart || 0)) / (e.cadence || 8)) changer2(e, "garde", "garde");
        break;
      }
      case "mort": {
        e.vx *= 1 - 5 * dt;
        if (e.t * (e.anim === nomAnim(e, "chute") ? 14 : 10) >= nbImages(e.anim) + 3) {
          gisant(e.anim, nbImages(e.anim) - 1, e.x, e.dir);
          e.retirer = true;
        }
        break;
      }
    }
    if (e.etat !== "mort" && e.fige <= 0) for (const o of J.ennemis) {
      if (o === e || o.etat === "mort" || o.fige > 0 || Math.sign(o.x - H.x) !== Math.sign(e.x - H.x) || o.type === "ninja" !== (e.type === "ninja")) continue;
      const ecart = Math.abs(o.x - e.x), mini = 40;
      if (ecart < mini && Math.abs(e.x - H.x) > Math.abs(o.x - H.x)) {
        e.x += Math.sign(e.x - o.x || -e.dir) * Math.min(mini - ecart, 120 * dt);
        if (e.vx * e.dir > 0) e.vx = 0;
      }
    }
    e.x += e.vx * dt;
    if (e.etat !== "approche" && e.etat !== "mort") e.x = Math.max(-30, Math.min(ARENE + 30, e.x));
    if (e.type !== "boss") {
      const n = nbImages(e.anim), f = e.cfg;
      const sq = seqDe(e);
      if (e.etat === "armer") {
        if (e.anim === nomAnim(e, "course")) {
          e.pas = (e.pas || 0) + Math.abs(e.vx) * dt / 22;
          e.k = Math.floor(e.pas) % n;
        } else if (!sq.armer.length) e.k = sq.frappe[0];
        else {
          const L = sq.armer, duree2 = f.armer * (e.tempo || 1) / v;
          const nb = Math.min(L.length, Math.max(4, Math.round(duree2 * 0.78 * 20))), premiere = L.length - nb, cadence = Math.min(24, nb / (0.78 * duree2));
          e.k = L[Math.max(0, Math.min(L.length - 1, premiere + Math.floor(e.t * cadence + 1e-4)))];
        }
      } else if (e.etat === "frappe") e.k = sq.frappe[Math.min(sq.frappe.length - 1, Math.floor(e.t * 15))];
      else if (e.etat === "repos") {
        const i = Math.floor(e.t * 12);
        if (i < sq.repos.length && e.anim === nomAnim(e, e.attaque || "attaque")) e.k = sq.repos[i];
        else {
          if (e.anim !== nomAnim(e, "garde")) {
            const kf = Math.min(e.k, n - 1);
            e.fondu = { anim: e.anim, k: kf, dir: e.dir, t: 0, duree: 0.12 };
            e.anim = nomAnim(e, "garde");
            e.tg = plusProche(nomAnim(e, e.attaque || "attaque"), kf, e.anim) / 7;
          }
          e.tg += dt;
          e.k = Math.floor(e.tg * 7) % nbImages(e.anim);
        }
      } else if (e.etat === "touche") e.k = Math.min(1, Math.floor(e.t * 10));
      else if (e.etat === "intro") e.k = Math.min(n - 1, Math.floor(e.t * (e.anim === nomAnim(e, "garde") ? 6 : 9)));
      else if (e.etat === "esquive") e.k = 0;
      else if (e.etat === "entree") {
        e.pas = (e.pas || 0) + Math.abs(e.vx) * dt / (12 * (e.type === "boss" ? 1.4 : 1));
        e.k = Math.floor(e.pas) % n;
      } else if (e.etat === "brise") e.k = Math.min(n - 1, 2, Math.floor(e.t * 10));
      else if (e.etat === "bloque") {
        const m = SEQ.sabreur.parade.bloque;
        e.k = e.anim === nomAnim(e, "parade") ? m[Math.min(m.length - 1, Math.floor(e.t * 16))] : Math.min(n - 1, 1 + Math.floor(e.t * 7));
      } else if (e.etat === "mort") {
        if (e.type === "sabreur" && e.anim === "r-f-chute") {
          e.k = e.t < 0.05 ? e.t < 0.02 ? 0 : 1 : Math.min(n - 1, 3 + Math.floor((e.t - 0.05) * 14));
        } else e.k = Math.min(n - 1, Math.floor(e.t * (e.anim === nomAnim(e, "chute") ? 14 : 10)));
      } else if (e.etat === "chute") {
        const r = RELEVE[e.anim], sol = r ? r[0] : n - 1, cad = r ? 12 : 15, bref = e.type === "sabreur" && e.anim === "r-f-chute" && e.t >= 0.05, k = bref ? 3 + Math.floor((e.t - 0.05) * cad) : e.t < 0.05 && e.type === "sabreur" && e.anim === "r-f-chute" ? 1 : Math.floor(e.t * cad);
        e.k = k <= sol ? k : r ? sol + Math.floor((e.t - (sol + 1) / cad) * 5) % (r[1] - sol) : sol;
      } else if (e.etat === "releve") {
        const k2 = e.retour ? Math.max(0, n - 1 - Math.floor(e.t * 8)) : Math.min(n - 1, (e.depart || 0) + Math.floor(e.t * (e.cadence || 8)));
        if (k2 !== e.k && e.t > 0) e.fondu = { anim: e.anim, k: e.k, dir: e.dir, t: 0, duree: 0.1 };
        e.k = k2;
      } else if (e.etat === "bond") e.k = RELEVE[e.anim] ? Math.min(RELEVE[e.anim][0] - 1, 1 + Math.floor(e.t * 8)) : Math.min(n - 1, Math.floor(e.t * 16));
      else if (e.etat === "approche") {
        const foulee = (e.anim.endsWith("course") ? e.type === "ninja" ? 18 : 22 : Math.sign(e.vx) === -e.dir ? 8 : 12) * (e.type === "boss" ? 1.4 : 1);
        e.pas = (e.pas || 0) + Math.abs(e.vx) * dt / foulee;
        const reprise = REPRISE[e.anim] || 0, kk = Math.floor(e.pas);
        const k = kk < n ? kk : reprise + (kk - reprise) % (n - reprise);
        e.k = Math.sign(e.vx) === -e.dir ? n - 1 - k : k;
      } else e.k = Math.floor(e.t * 7) % n;
    }
    e.vu = e.anim;
    e.kVu = e.k;
    e.traineeT = (e.traineeT || 0) + dt;
    e.trainee = e.trainee || [];
    for (let j = e.trainee.length - 1; j >= 0; j--) if (e.traineeT - e.trainee[j].t > TRAINEE2) e.trainee.splice(j, 1);
    const boss = e.type === "boss";
    const sqT = e.attaque && !boss ? seqDe(e) : null, menace = sqT && sqT.armer.length ? sqT.armer[sqT.armer.length - 1] : -1;
    const enCoup = boss ? e.etat === "frappe" || e.etat === "suite" : e.etat === "frappe" || e.etat === "armer" && e.anim !== nomAnim(e, "course") && e.k === menace || e.etat === "repos" && e.t < 0.08;
    if (enCoup && e.type !== "ninja" && (boss || !["pied", "poing"].includes((catalogue(e)[e.attaque] || {}).coupe))) {
      let seg = lameA(e.anim, e.k, e.x, SOL - e.y, e.dir);
      if (seg) seg = [seg[0], [seg[0][0] + (seg[1][0] - seg[0][0]) * 1.05, seg[0][1] + (seg[1][1] - seg[0][1]) * 1.05]];
      if (seg && (!e.trainee.length || e.trainee[e.trainee.length - 1].k !== e.k || e.trainee[e.trainee.length - 1].anim !== e.anim)) e.trainee.push({ seg, t: e.traineeT, k: e.k, anim: e.anim });
    }
  }
  for (let i = J.ennemis.length - 1; i >= 0; i--) if (J.ennemis[i].retirer) J.ennemis.splice(i, 1);
  const coup = lameActive();
  if (coup) {
    for (const e of J.ennemis) {
      if (!vivant(e) || H.touches.has(e.id) || e.fige > 0) continue;
      const devant = (e.x - H.x) * H.dir;
      if (devant < -14 || devant > coup.portee) continue;
      if (e.y > 90 + H.y) continue;
      H.touches.add(e.id);
      frapper(e, coup);
    }
    for (let i = J.projectiles.length - 1; i >= 0; i--) {
      const p = J.projectiles[i], devant = (p.x - H.x) * H.dir;
      if (devant > -10 && devant < coup.portee && p.y > SOL - H.y - 120) {
        etincelles(p.x, p.y, 8);
        sfx("fer");
        J.projectiles.splice(i, 1);
      }
    }
  }
  for (let i = J.projectiles.length - 1; i >= 0; i--) {
    const p = J.projectiles[i];
    p.t += dt;
    p.x += p.vx * dt;
    const corps = hauteur(H.anim, H.k);
    if (Math.abs(p.x - H.x) < 12 && p.y > SOL - H.y - corps && p.y < SOL - H.y) {
      const r = blesserHeroine(p, Math.sign(p.vx));
      if (r !== "rien") {
        J.projectiles.splice(i, 1);
        if (r !== "touche") {
          etincelles(p.x, p.y, 8);
        }
        continue;
      }
    }
    if (p.x < -40 || p.x > ARENE + 40) J.projectiles.splice(i, 1);
  }
}
var porteeReelleDe = (e) => e.cfg.portee + e.cfg.bond * e.cfg.frappe * 0.7 - 4;
function ouverture(H) {
  if (H.etat === "retour" || H.etat === "releve") return true;
  if (H.etat === "iai") return H.charge > 0.5;
  if (H.etat !== "coup") return false;
  const a = ANIMS[H.anim];
  if (!a || !a.frappe) return false;
  const f = H.t / (suiteImages(H.anim, nbImages(H.anim)).length / a.ips);
  return !!a.tranche && f > a.frappe[1];
}
function fuir(e) {
  const vers = e.x < ARENE / 2 ? -1 : 1;
  const bord = vers < 0 ? e.x < 40 : e.x > ARENE - 40;
  if (bord) return;
  e.dir = -vers;
  e.vy = byakki() ? -260 : -460;
  e.y = 0.01;
  e.vx = vers * 230;
  changer2(e, "bond", "bond");
}
function lancer(e) {
  const bas = Math.random() < 0.35;
  J.projectiles.push({ x: e.x + e.dir * 18, y: SOL - (bas ? 26 : 74), vx: e.dir * 290, t: 0 });
  sfx("shuriken");
}
function briser(e) {
  e.jeton = false;
  changer2(e, "brise", "touche");
  e.vx = -e.dir * 90;
  e.eclair = 0.1;
}
function frapper(e, coup) {
  const H = J.H;
  if (e.type === "boss") {
    if (e.invul > 0) return;
    const deFace = e.dir === -H.dir, enGarde = ["garde", "marche", "bloque"].includes(e.etat);
    if (deFace && enGarde && (e.blocs || 0) < 3 && !(e.ouvert > 0)) {
      const p = bossPhase(e), chance = e.etat === "bloque" || e.pare > 0 ? 1 : coup.tranche ? p === 2 ? 0.5 : 0.35 : p === 2 ? 0.8 : 0.65;
      if (Math.random() < chance) {
        e.pare = 0;
        e.blocs = (e.blocs || 0) + 1;
        changer2(e, "bloque", "bloc");
        e.t = 0;
        e.vx = H.dir * (coup.tranche ? 110 : 50);
        e.riposte = !coup.tranche;
        etincelles(e.x - H.dir * 16, SOL - 80, 18);
        sfx("fer");
        J.gel = coup.tranche ? 0.1 : 0.07;
        H.x -= H.dir * (coup.tranche ? 6 : 12);
        return;
      }
    }
    e.blocs = 0;
    e.pv--;
    e.invul = 0.45;
    e.eclair = 0.1;
    e.jeton = false;
    e.chaine = 0;
    e.pattern = null;
    sfx("chair");
    vibrer(20);
    gerbe(e.x, SOL - 80, H.dir, 18, 0.7);
    J.gel = coup.tranche ? 0.1 : 0.06;
    if (e.pv <= 0) {
      J.boss = null;
      J.bossN = (J.bossN || 0) + 1;
      J.serie += 2;
      J.tues += 4;
      if (S["r-w-mort1"]) {
        e.jeton = false;
        J.tues++;
        J.serie++;
        J.serieT = 2.2;
        H.fureur = Math.min(1, H.fureur + FUREUR_PAR_MORT);
        sfx("chair");
        sfx("sang");
        vibrer(25);
        gerbe(e.x, SOL - 80, H.dir, 30, 0.9);
        changer2(e, "mort", "mort1");
        e.vx = H.dir * 260;
        e.vy = -430;
        e.y = 0.01;
        e.dir = -H.dir;
        e.eclair = 0.1;
      } else tuer(e, coup.tranche ? "fend" : Math.random() < 0.5 ? "decapite" : "tranche", H.dir);
      J.gel = 0.3;
      J.lent = 1.4;
      J.grandMoment = 2.2;
      J.secousse = 0.6;
      sfx("taiko");
      sfx("taiko", 0.5);
      H.fureur = 1;
      J.gloire = 3.2;
      return;
    }
    if (coup.tranche && Math.random() < 0.35 && S[nomAnim(e, "chute")]) {
      e.vx = H.dir * 170;
      changer2(e, "chute", "chute");
      return;
    }
    e.vx = H.dir * (coup.tranche ? 140 : 90);
    e.souleve = !!coup.tranche && !!S["r-w-souleve"];
    changer2(e, "touche", e.souleve ? "souleve" : "touche");
    return;
  }
  if (e.type === "sabreur" && (e.etat === "garde" || e.etat === "approche") && e.dir === -H.dir && !coup.tranche && Math.random() < e.cfg.bloque + Math.min(0.25, J.chrono / 600)) {
    const moulinet2 = !!S[nomAnim(e, "parade")];
    changer2(e, "bloque", moulinet2 ? "parade" : "garde");
    e.k = moulinet2 ? 2 : Math.min(nbImages(e.anim) - 1, 1);
    e.vx = H.dir * 140;
    e.riposte = moulinet2;
    etincelles(e.x - H.dir * 16, SOL - 70, 16);
    sfx("fer");
    J.gel = 0.07;
    H.x -= H.dir * 10;
    return;
  }
  const sens = coup.coupe || "lateral";
  if (sens === "pied" && S[nomAnim(e, "chute")] && (nomAnim(e, "chute") !== nomAnim(e, "mort") || e.type === "sabreur" && falcon())) {
    e.jeton = false;
    e.vx = H.dir * 200;
    e.eclair = 0.08;
    sfx("chair");
    J.gel = Math.max(J.gel, 0.06);
    changer2(e, "chute", "chute");
    return;
  }
  const rafale = J.temps - (J.derniereMort ?? -9) < 0.4;
  tuer(e, sens === "vertical" ? "fend" : sens === "estoc" ? "transperce" : sens === "pied" ? "coupe" : Math.random() < 0.4 ? "decapite" : "tranche", H.dir);
  J.gel = (coup.tranche ? 0.11 : 0.06) * (rafale ? 0.5 : 1);
  if (coup.tranche) J.secousse = Math.max(J.secousse, 0.14);
}
function tuer(e, maniere, dirH) {
  J.evt && (J.evt.mort = true);
  const H = J.H, h = hauteur(e.anim, e.k);
  e.jeton = false;
  J.tues++;
  J.serie++;
  J.serieT = 2.2;
  H.fureur = Math.min(1, H.fureur + FUREUR_PAR_MORT);
  if (J.tues % SOIN_TOUS === 0 && H.pv < PV_MAX) {
    H.pv++;
    sfx("soin");
  }
  sfx("chair");
  sfx("sang");
  vibrer(25);
  J.gel = Math.max(J.gel, J.temps - (J.derniereMort ?? -9) < 0.4 ? 0.05 : 0.1);
  J.derniereMort = J.temps;
  const cou = SOL - e.y - h * 0.8;
  if (maniere === "decapite") {
    const [tete, corps] = trancher(e.anim, e.k, e.x, e.dir, 0.8, rand(-0.12, 0.12), [dirH * rand(50, 150), -rand(300, 460), rand(-14, 14)]);
    jet(e.x, cou, dirH, 1, -1.45 + rand(-0.2, 0.2));
    gerbe(e.x, cou, dirH, 50, 1, 0.9);
    e.retirer = true;
  } else if (maniere === "tranche") {
    const ligne = rand(0.42, 0.58);
    trancher(e.anim, e.k, e.x, e.dir, ligne, rand(-0.3, 0.3) * dirH, [dirH * rand(80, 170), -rand(140, 240), dirH * rand(2, 6)]);
    gerbe(e.x, SOL - h * ligne, dirH, 90, 1.2, 0.7);
    jet(e.x, SOL - h * ligne, dirH, 0.6, -0.9);
    J.secousse = 0.12;
    e.retirer = true;
  } else if (maniere === "fend") {
    const ligne = rand(0.5, 0.6);
    trancher(e.anim, e.k, e.x, e.dir, ligne, dirH * rand(2.2, 3.2), [dirH * rand(20, 60), -rand(60, 120), dirH * rand(2, 5)]);
    gerbe(e.x, SOL - h * 0.9, dirH, 60, 1, 1.4);
    gerbe(e.x, SOL - h * 0.45, dirH, 50, 1, 0.6);
    jet(e.x, SOL - h * 0.85, dirH, 0.5, -1.3);
    J.secousse = 0.12;
    e.retirer = true;
  } else if (maniere === "transperce") {
    gerbe(e.x + dirH * 8, SOL - h * 0.55, dirH, 70, 1.1, 0.35);
    changer2(e, "mort", "mort");
    e.vx = dirH * 70;
    e.eclair = 0.08;
  } else {
    gerbe(e.x, SOL - h * 0.6, dirH, 60, 1, 0.8);
    changer2(e, "mort", "mort");
    e.vx = dirH * 110;
    e.eclair = 0.08;
  }
}
J.coupFureur = (liste) => {
  J.eclair = 0.2;
  J.lent = 0.8;
  sfx("parade");
  liste.forEach((e, i) => setTimeout(() => {
    if (!e.retirer) {
      e.fige = 0;
      tuer(e, i % 2 ? "tranche" : "decapite", J.H.dir);
    }
  }, i * 90));
};
function dessinerEnnemis(cam) {
  const ordre = [...J.ennemis].sort((a, b) => (b.type === "ninja") - (a.type === "ninja"));
  for (const e of ordre) {
    const blanc = e.eclair > 0;
    const repos = e.etat === "garde" && !blanc && e.anim === nomAnim(e, "garde");
    if (repos && e.type !== "boss") {
      const n = nbImages(e.anim), t = J.temps + e.id * 0.37;
      if (e.type === "ninja") {
        const p = Math.max(1, 2 * n - 2), i = Math.floor(t * 5) % p;
        e.k = i < n ? i : p - i;
      } else e.k = Math.floor(t * 7) % n;
      e.kVu = e.k;
    }
    if (!(repos && e.type === "boss" ? dessinerRespire(e.anim, e.x - cam, SOL - e.y, e.dir, J.temps + e.id * 0.7) : dessiner(e.anim, e.k, e.x - cam, SOL - e.y, e.dir, { blanc }))) {
      J.ctx.fillStyle = "#111";
      J.ctx.fillRect(Math.round(e.x - cam - 12), Math.round(SOL - e.y - 110), 24, 110);
    }
    if (e.fondu && !blanc) dessinerFondu(e.fondu.anim, e.fondu.k, e.x - cam, SOL - e.y, e.fondu.dir, 1 - e.fondu.t / (e.fondu.duree || 0.12));
    if (e.trainee && e.trainee.length > 1 && !blanc) dessinerTrainee(e.trainee, cam, e.traineeT, TRAINEE2);
    if (e.type === "boss" && S["g" + e.anim.slice(1)] && !blanc) dessiner("g" + e.anim.slice(1), e.k, e.x - cam, SOL - e.y, e.dir);
    if (e.etat === "armer") {
      const f = e.t / (e.cfg.armer * (e.tempo || 1) / vitesseJeu());
      if (f > 0.55) eclat(e.x - cam + e.dir * 26, SOL - e.y - hauteur(e.anim, e.k) * 0.72, (f - 0.55) / 0.45);
    }
  }
  for (const p of J.projectiles) dessinerShuriken(p, cam, SOL);
}

// src/js/directeur.js
function nouveauDirecteur() {
  J.chrono = 0;
  J.prochain = 1.2;
  J.vague = 45;
  J.jetons = 1;
  J.respire = 0;
  J.boss = null;
  J.bossN = 0;
  J.prochainBoss = BOSS_TOUS_LES;
  J.repit = 0;
  J.cinema = null;
}
function lancerBoss(naturel = true) {
  if (naturel) J.prochainBoss += BOSS_TOUS_LES;
  const cote = J.H.x - J.cam < J.W / 2 ? 1 : -1;
  apparaitre("boss", cote);
  J.cinema = { t: 0, fin: null };
  sfx("taiko");
}
function majDirecteur(dt) {
  if (J.majDirecteurOff) return;
  const t = J.chrono += dt;
  J.jetons = t < 25 ? 1 : t < 90 ? 2 : 3;
  if (J.boss && (J.boss.etat === "mort" || J.boss.retirer || !J.ennemis.includes(J.boss))) {
    J.boss = null;
    J.repit = BOSS_REPIT;
  }
  if (J.boss) return;
  if (J.repit > 0) {
    J.repit -= dt;
    return;
  }
  if (J.tues >= J.prochainBoss && J.H.pv > 0) {
    if (J.ennemis.some((e) => e.etat !== "mort")) return;
    lancerBoss();
    return;
  }
  const vivants = J.ennemis.filter((e) => e.etat !== "mort").length;
  const plafond = Math.min(10, 3 + Math.floor(t / 18));
  if ((J.vague -= dt) <= 0) {
    J.vague = rand(40, 55);
    J.respire = 7;
    sfx("taiko");
    sfx("taiko", 0.35);
    sfx("taiko", 0.6);
    for (let i = 0; i < 4; i++) apparaitre(choisir(t), i % 2 ? 1 : -1);
    return;
  }
  if (J.respire > 0) {
    J.respire -= dt;
    return;
  }
  if ((J.prochain -= dt) > 0 || vivants >= plafond) return;
  J.prochain = Math.max(0.7, 2.4 - t / 60) * rand(0.7, 1.3);
  const g = J.ennemis.filter((e) => e.x < J.H.x).length, d = J.ennemis.length - g;
  const vide = g === 0 !== (d === 0);
  apparaitre(choisir(t), vide ? g === 0 ? -1 : 1 : Math.random() < 0.7 ? g <= d ? -1 : 1 : Math.random() < 0.5 ? -1 : 1);
}
function choisir(t) {
  const n = (type) => J.ennemis.filter((e) => e.type === type).length;
  const r = Math.random();
  if (t > 20 && r < 0.22 && n("ninja") < 2) return "ninja";
  return "sabreur";
}

// src/js/texte.js
var GLYPHES = {
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 23, 17, 17, 15],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  J: [7, 2, 2, 2, 2, 18, 12],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 17, 25, 21, 19, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  Q: [14, 17, 17, 17, 21, 18, 13],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [15, 16, 16, 14, 1, 1, 30],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
  0: [14, 17, 19, 21, 25, 17, 14],
  1: [4, 12, 4, 4, 4, 4, 14],
  2: [14, 17, 1, 2, 4, 8, 31],
  3: [31, 2, 4, 2, 1, 17, 14],
  4: [2, 6, 10, 18, 31, 2, 2],
  5: [31, 16, 30, 1, 1, 17, 14],
  6: [6, 8, 16, 30, 17, 17, 14],
  7: [31, 1, 2, 4, 8, 8, 8],
  8: [14, 17, 17, 14, 17, 17, 14],
  9: [14, 17, 17, 15, 1, 2, 12],
  " ": [0, 0, 0, 0, 0, 0, 0],
  "!": [4, 4, 4, 4, 4, 0, 4],
  "?": [14, 17, 1, 2, 4, 0, 4],
  ".": [0, 0, 0, 0, 0, 0, 4],
  ",": [0, 0, 0, 0, 4, 4, 8],
  ":": [0, 0, 4, 0, 0, 4, 0],
  "-": [0, 0, 0, 14, 0, 0, 0],
  "+": [0, 4, 4, 31, 4, 4, 0],
  "/": [1, 1, 2, 4, 8, 16, 16],
  "'": [4, 4, 8, 0, 0, 0, 0],
  "×": [0, 17, 10, 4, 10, 17, 0],
  "·": [0, 0, 0, 4, 0, 0, 0],
  "(": [2, 4, 8, 8, 8, 4, 2],
  ")": [8, 4, 2, 2, 2, 4, 8],
  "=": [0, 0, 31, 0, 31, 0, 0],
  "←": [0, 4, 8, 31, 8, 4, 0],
  "→": [0, 4, 2, 31, 2, 4, 0],
  "↑": [4, 14, 21, 4, 4, 4, 0],
  "↓": [0, 4, 4, 4, 21, 14, 4]
};
var ACCENTS = { "É": ["E", [2, 4]], "È": ["E", [8, 4]], "Ê": ["E", [4, 10]], "À": ["A", [8, 4]], "Â": ["A", [4, 10]], "Ç": ["C", null, [4, 8]] };
function motifGlyphe(ch) {
  const a = ACCENTS[ch];
  return { base: GLYPHES[a ? a[0] : ch] || GLYPHES["?"], dessus: a && a[1], dessous: a && a[2] };
}
var cacheTexte = /* @__PURE__ */ new Map();
function rendreTexte(s, couleur, k, style) {
  const cle2 = s + "|" + couleur + "|" + k + "|" + style;
  let c = cacheTexte.get(cle2);
  if (c) return c;
  if (cacheTexte.size > 300) cacheTexte.clear();
  const marge = style === "contour" ? k : 0;
  c = toile(s.length * 6 * k + 2 * marge + k, 12 * k + 2 * marge);
  const g = c.getContext("2d");
  const couleurs = Array.isArray(couleur) ? couleur : null;
  const tracer = (ox, oy, teinte) => {
    [...s].forEach((ch, n) => {
      const { base, dessus, dessous } = motifGlyphe(ch);
      const x0 = ox + n * 6 * k, y0 = oy + 2 * k;
      const ligne = (bits, r) => {
        for (let b = 0; b < 5; b++) if (bits & 16 >> b) {
          g.fillStyle = teinte || (couleurs ? couleurs[clamp(r, 0, 6)] : couleur);
          g.fillRect(x0 + b * k, y0 + r * k, k, k);
        }
      };
      base.forEach((bits, r) => ligne(bits, r));
      if (dessus) {
        ligne(dessus[0], -2);
        ligne(dessus[1], -1);
      }
      if (dessous) {
        ligne(dessous[0], 7);
        ligne(dessous[1], 8);
      }
    });
  };
  if (style === "contour") {
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1], [1, 2], [0, 2], [-1, 2]])
      tracer(marge + dx * k, marge + dy * k, ENCRE);
  } else if (style === "ombre") tracer(k, k, ENCRE);
  tracer(marge, marge, null);
  cacheTexte.set(cle2, c);
  return c;
}
function texte(s, x, y, couleur = OS, k = 1, style = "ombre", aligne = "gauche") {
  const c = rendreTexte(s, couleur, k, style);
  const lx = aligne === "centre" ? x - Math.floor(c.width / 2) : aligne === "droite" ? x - c.width : x;
  ctx.drawImage(c, Math.round(lx), Math.round(y - 2 * k));
}

// src/js/interface.js
var peint = (nom) => S[nom] || null;
function image(nom, x, y, o = {}) {
  const s = S[nom];
  if (!s) return false;
  const w = o.w || s.w, h = o.h || s.h;
  if (o.aligne === "centre") x -= Math.floor(w / 2);
  else if (o.aligne === "droite") x -= w;
  if (o.part != null) {
    const l = Math.round(w * Math.max(0, Math.min(1, o.part)));
    if (l <= 0) return true;
    ctx.drawImage(s.img, 0, 0, Math.round(s.w * l / w), s.h, Math.round(x), Math.round(y), l, h);
    return true;
  }
  ctx.drawImage(s.img, Math.round(x), Math.round(y), w, h);
  return true;
}
var portrait2 = null;
var portraitBoss = null;
function fairePortraitBoss() {
  if (S["portrait-boss"]) {
    const c2 = toile(34, 34), g2 = c2.getContext("2d");
    g2.fillStyle = "#1a1a19";
    g2.fillRect(0, 0, 34, 34);
    g2.drawImage(S["portrait-boss"].img, 1, 1);
    g2.strokeStyle = SANG[3];
    g2.strokeRect(0.5, 0.5, 33, 33);
    return c2;
  }
  const s = S["r-x-intro"] || S["r-x-marche"] || S["r-x-garde"];
  if (!s) return null;
  const k = 0, [ax, ay] = s.ancres[k], W = s.img.width;
  let haut = -1, somme = 0, nb = 0;
  for (let y = 0; y < s.ch && haut < 0; y++) for (let x = 0; x < s.cw; x++) if (s.px.data[(y * W + k * s.cw + x) * 4 + 3] > 0) {
    haut = y;
    break;
  }
  for (let y = haut; y < Math.min(s.ch, haut + 22); y++) for (let x = 0; x < s.cw; x++) if (s.px.data[(y * W + k * s.cw + x) * 4 + 3] > 0) {
    somme += x;
    nb++;
  }
  const cx = nb ? Math.round(somme / nb) : ax;
  const c = toile(34, 34), g = c.getContext("2d");
  g.fillStyle = "#1a1a19";
  g.fillRect(0, 0, 34, 34);
  g.drawImage(s.img, k * s.cw + cx - 17, haut + 2, 34, 34, 0, 0, 34, 34);
  g.strokeStyle = SANG[3];
  g.strokeRect(0.5, 0.5, 33, 33);
  return c;
}
function faireportrait() {
  const s = S["r-garde"];
  if (!s) return null;
  const c = toile(34, 34), g = c.getContext("2d");
  g.fillStyle = "#1a1a19";
  g.fillRect(0, 0, 34, 34);
  const [ax, ay] = s.ancres[0], h = s.hauts[0];
  g.drawImage(s.img, ax - 20, ay - h - 2, 34, 34, -2, 1, 34, 34);
  g.strokeStyle = BRUME;
  g.strokeRect(0.5, 0.5, 33, 33);
  return c;
}
function hud() {
  const H = J.H;
  if (peint("portrait") && peint("vie-pleine") && peint("jauge-vide")) return hudPeint(H);
  portrait2 = portrait2 || faireportrait();
  if (portrait2) ctx.drawImage(portrait2, 10, 10);
  for (let i = 0; i < PV_MAX; i++) {
    const x = 52 + i * 13, y = 12;
    ctx.fillStyle = ENCRE;
    ctx.fillRect(x, y, 10, 10);
    ctx.fillStyle = "#3a3a38";
    ctx.fillRect(x + 1, y + 1, 8, 8);
    if (i < H.pv) {
      ctx.fillStyle = SANG[3];
      ctx.fillRect(x + 1, y + 1, 8, 8);
      ctx.fillStyle = SANG[4];
      ctx.fillRect(x + 2, y + 2, 3, 2);
    }
  }
  const l = 150, x0 = 52, y0 = 28, plein = H.fureur >= 1;
  ctx.fillStyle = ENCRE;
  ctx.fillRect(x0, y0, l + 2, 6);
  ctx.fillStyle = "#3a3a38";
  ctx.fillRect(x0 + 1, y0 + 1, l, 4);
  ctx.fillStyle = plein && Math.floor(J.temps * 6) % 2 ? "#ffffff" : OS;
  ctx.fillRect(x0 + 1, y0 + 1, Math.round(l * H.fureur), 4);
  ctx.fillStyle = ENCRE;
  ctx.fillRect(x0 + l + 2, y0 + 1, 6, 4);
  ctx.fillRect(x0 + l + 8, y0 + 2, 3, 2);
  if (plein) texte("X+C", x0 + l + 16, y0 - 1, OS, 1, "ombre");
  compteurs();
}
function barreBoss() {
  const b = J.boss;
  if (!b || !b.pvMax || !b.pret || b.etat === "mort") return false;
  portraitBoss = portraitBoss || fairePortraitBoss();
  const xp = J.W - 10 - 34;
  if (portraitBoss) ctx.drawImage(portraitBoss, xp, 10);
  for (let i = 0; i < b.pvMax; i++) {
    const x = xp - 8 - 10 - i * 13, y = 12;
    ctx.fillStyle = ENCRE;
    ctx.fillRect(x, y, 10, 10);
    ctx.fillStyle = "#3a3a38";
    ctx.fillRect(x + 1, y + 1, 8, 8);
    if (i < b.pv) {
      ctx.fillStyle = SANG[3];
      ctx.fillRect(x + 1, y + 1, 8, 8);
      ctx.fillStyle = SANG[4];
      ctx.fillRect(x + 2, y + 2, 3, 2);
    }
  }
  return true;
}
function cinema(c) {
  const e = (u) => u * u * (3 - 2 * u);
  const h = Math.round(46 * e(Math.min(1, c.t / 0.5)) * (c.fin == null ? 1 : 1 - e(Math.min(1, (c.t - c.fin) / 0.5))));
  if (h <= 0) return;
  ctx.fillStyle = ENCRE;
  ctx.fillRect(0, 0, J.W, h);
  ctx.fillRect(0, J.HAUT - h, J.W, h);
  if (c.t > 0.9 && c.fin == null && h > 30) texte("LE COLOSSE", Math.floor(J.W / 2), J.HAUT - h + Math.floor(h / 2) - 7, OS, 2, "plein", "centre");
}
function gloire(t) {
  const a = Math.min(1, t / 0.6) * Math.min(1, (3.2 - t) * 2);
  const e = (u) => u * u * (3 - 2 * u), h = Math.round(30 * e(Math.min(1, (3.2 - t) / 0.4)) * e(Math.min(1, t / 0.3)));
  ctx.fillStyle = ENCRE;
  ctx.fillRect(0, 0, J.W, h);
  ctx.fillRect(0, J.HAUT - h, J.W, h);
  ctx.globalAlpha = a;
  texte("LE COLOSSE EST TOMBÉ", Math.floor(J.W / 2), 120, OS, 3, "ombre", "centre");
  texte("LE CLAN REVIENT", Math.floor(J.W / 2), 156, SANG[4], 1, "ombre", "centre");
  ctx.globalAlpha = 1;
}
function compteurs() {
  const d = barreBoss() ? 40 : 0;
  texte(String(J.tues), J.W - 14, 12 + d, OS, 3, "ombre", "droite");
  const m = Math.floor(J.chrono / 60), s = Math.floor(J.chrono % 60);
  texte(`${m}:${String(s).padStart(2, "0")}`, J.W - 14, 38 + d, BRUME, 1, "ombre", "droite");
  if (J.serie >= 3 && J.serieT > 0) texte(`${J.serie} D'UN TRAIT`, J.W - 14, 52 + d, SANG[4], 1, "ombre", "droite");
}
function hudPeint(H) {
  const p = S.portrait;
  image("portrait", 8, 8);
  const x0 = 8 + p.w + 6, plein = H.fureur >= 1;
  for (let i = 0; i < PV_MAX; i++) image(i < H.pv ? "vie-pleine" : "vie-perdue", x0 + i * (S["vie-pleine"].w + 2), 9);
  const jy = 9 + S["vie-pleine"].h + 4;
  image("jauge-vide", x0, jy);
  const luit = plein && Math.floor(J.temps * 6) % 2;
  if (!luit || true) image("jauge-pleine", x0, jy, { part: H.fureur });
  if (plein && luit) {
    ctx.globalAlpha = 0.5;
    image("jauge-pleine", x0, jy - 1);
    ctx.globalAlpha = 1;
  }
  if (plein) texte("X+C", x0 + S["jauge-vide"].w + 6, jy + Math.floor(S["jauge-vide"].h / 2) - 4, OS, 1, "ombre");
  const d = barreBoss() ? 40 : 0;
  const c = S.cartouche;
  if (c) {
    image("cartouche", J.W - 8, 6 + d, { aligne: "droite" });
    texte(String(J.tues), J.W - 8 - Math.floor(c.w / 2), 6 + d + Math.floor(c.h / 2) - 10, OS, 3, "ombre", "centre");
  } else texte(String(J.tues), J.W - 14, 12 + d, OS, 3, "ombre", "droite");
  const yb = 6 + d + (c ? c.h : 30) + 4;
  const m = Math.floor(J.chrono / 60), s = Math.floor(J.chrono % 60);
  texte(`${m}:${String(s).padStart(2, "0")}`, J.W - 14, yb, BRUME, 1, "ombre", "droite");
  if (J.serie >= 3 && J.serieT > 0) {
    const b = S["bandeau-serie"];
    if (b) {
      image("bandeau-serie", J.W - 8, yb + 12, { aligne: "droite" });
      texte(`${J.serie} D'UN TRAIT`, J.W - 8 - Math.floor(b.w / 2), yb + 12 + Math.floor(b.h / 2) - 4, OS, 1, "ombre", "centre");
    } else texte(`${J.serie} D'UN TRAIT`, J.W - 14, yb + 14, SANG[4], 1, "ombre", "droite");
  }
}

// src/js/titre.js
var record = 0;
try {
  record = +localStorage.getItem("lady-snowblood-record") || 0;
} catch {
}
var lireRecord = () => record;
var erreur = null;
try {
  erreur = localStorage.getItem("lady-snowblood-erreur");
  localStorage.removeItem("lady-snowblood-erreur");
} catch {
}
function noterRecord(n) {
  if (n > record) {
    record = n;
    try {
      localStorage.setItem("lady-snowblood-record", String(n));
    } catch {
    }
    return true;
  }
  return false;
}
function voile(a) {
  ctx.fillStyle = `rgba(5,5,5,${a})`;
  ctx.fillRect(0, 0, J.W, J.HAUT);
}
function colonne(s, x, y, couleur = BRUME) {
  const lettres = s.replace(/ /g, "").length, h = lettres * 9 + (s.split(" ").length - 1) * 4 + 12;
  if (S.colonne) image("colonne", x, y - 8, { aligne: "centre", h: Math.max(S.colonne.h, h + 4), w: S.colonne.w });
  else {
    ctx.fillStyle = "rgba(5,5,5,0.5)";
    ctx.fillRect(x - 8, y - 6, 16, h);
  }
  let yy = y;
  for (const ch of s) {
    if (ch === " ") {
      yy += 4;
      continue;
    }
    texte(ch, x, yy, couleur, 1, "ombre", "centre");
    yy += 9;
  }
}
function sceau(s, x, y) {
  const w = Math.max(24, s.length * 6 + 10), h = 24;
  if (S.sceau) image("sceau", x, y, { aligne: "centre", w: Math.max(S.sceau.w, w), h: Math.max(S.sceau.h, h) });
  else {
    ctx.fillStyle = SANG[3];
    ctx.fillRect(x - w / 2, y, w, h);
    ctx.strokeStyle = SANG[4];
    ctx.strokeRect(x - w / 2 + 1.5, y + 1.5, w - 3, h - 3);
  }
  texte(s, x, y + (S.sceau ? Math.floor(Math.max(S.sceau.h, h) / 2) - 3 : 8), OS, 1, "plein", "centre");
}
function bandeau(y, h, a = 0.62) {
  ctx.fillStyle = `rgba(5,5,5,${a})`;
  ctx.fillRect(0, y, J.W, h);
}
function ecranTitre() {
  voile(0.35);
  const L = S.logo;
  if (L) ctx.drawImage(L.img, Math.round(J.W / 2 - L.w / 2), Math.max(6, 132 - L.h));
  else {
    texte("LADY SNOWBLOOD", J.W / 2, 70, OS, 5, "ombre", "centre");
    ctx.fillStyle = SANG[3];
    ctx.fillRect(J.W / 2 - 150, 116, 300, 2);
  }
  if (Math.floor(J.temps * 1.6) % 2 === 0) texte("APPUYER SUR X", J.W / 2, 166, OS, 2, "ombre", "centre");
  colonne("TENIR LA NUIT", 24, 150);
  if (record) {
    const y = 150;
    colonne("RECORD", J.W - 26, y);
    sceau(String(record), J.W - 26, y + 6 * 9 + 10);
  }
  bandeau(J.HAUT - 22, 22, 0.45);
  texte("X  LÉGER      C  FORT      ↑  SAUT      ↓  PARADE", J.W / 2, J.HAUT - 15, BRUME, 1, "ombre", "centre");
  if (erreur) texte(("ERREUR " + erreur).toUpperCase().slice(0, 100), 6, J.HAUT - 32, "#8a8a86", 1, "ombre");
}
var CARTES = [
  ["LE CLAN A TUÉ SON MARI.", OS],
  ["CETTE NUIT, IL VIENT L'ACHEVER.", OS],
  ["ELLE L'ATTEND SUR LA NEIGE, SABRE À LA MAIN.", OS],
  ["ELLE MOURRA. MAIS PAS SEULE.", SANG[4]]
];
var CARTE = 2;
var FONDU2 = 0.3;
var dureePrologue = () => CARTES.length * CARTE;
var carteSuivante = (t) => Math.min(dureePrologue(), (Math.floor(t / CARTE) + 1) * CARTE);
function prologue(t) {
  const i = Math.min(CARTES.length - 1, Math.floor(t / CARTE)), u = t - i * CARTE;
  const a = Math.max(0, Math.min(1, u / FONDU2, (CARTE - u) / FONDU2));
  if (a <= 0) return;
  const [phrase, couleur] = CARTES[i], y = 96;
  ctx.globalAlpha = a;
  bandeau(y - 14, 40);
  texte(phrase, J.W / 2, y, couleur, 2, "ombre", "centre");
  ctx.globalAlpha = 1;
  if (i < CARTES.length - 1 && Math.floor(t * 2) % 2 === 0) texte("X : SUITE", J.W - 10, J.HAUT - 14, BRUME, 1, "ombre", "droite");
}
function ecranFin(t, nouveau) {
  voile(Math.min(0.55, t * 0.2));
  if (t < 1.2) return;
  const r = S.rouleau, haut = 44;
  if (r) image("rouleau", J.W / 2, haut, { aligne: "centre" });
  else bandeau(haut + 18, 168);
  const cx = J.W / 2, y0 = haut + 42, teinte = r ? ENCRE : OS, sourd = r ? "#4a4a47" : BRUME, rouge = r ? SANG[2] : SANG[4];
  texte("ELLE EST TOMBÉE.", cx, y0, teinte, 3, r ? "plein" : "ombre", "centre");
  texte(`${J.tues} OMBRE${J.tues > 1 ? "S" : ""} AVANT ELLE.`, cx, y0 + 34, rouge, 2, r ? "plein" : "ombre", "centre");
  const m = Math.floor(J.chrono / 60), s = Math.floor(J.chrono % 60);
  texte(`TENU ${m}:${String(s).padStart(2, "0")}    PARADES PARFAITES ${J.parfaites}    PLUS LONGUE SÉRIE ${J.meilleureSerie}`, cx, y0 + 72, sourd, 1, r ? "plein" : "ombre", "centre");
  texte(nouveau ? "NOUVEAU RECORD" : `RECORD : ${lireRecord()}`, cx, y0 + 92, nouveau ? rouge : sourd, 1, r ? "plein" : "ombre", "centre");
  if (t > 2.2 && Math.floor(t * 1.6) % 2 === 0) texte("X POUR RECOMMENCER", cx, y0 + 130, OS, 2, "ombre", "centre");
}
function ecranPause() {
  voile(0.5);
  if (S["lune-pause"]) {
    image("lune-pause", J.W / 2, 120, { aligne: "centre" });
    texte("PAUSE", J.W / 2, 128 + S["lune-pause"].h, OS, 3, "ombre", "centre");
  } else texte("PAUSE", J.W / 2, 160, OS, 3, "ombre", "centre");
}

// src/js/main.js
var VITESSE = 1.25;
J.ctx = ctx;
J.temps = 0;
J.gel = 0;
J.lent = 0;
J.grandMoment = 0;
J.secousse = 0;
J.eclair = 0;
J.rouge = 0;
J.cam = (ARENE - J.W) / 2;
J.etat = "titre";
J.tues = 0;
J.serie = 0;
J.serieT = 0;
J.meilleureSerie = 0;
J.parfaites = 0;
function nouvellePartie() {
  nouvelleHeroine();
  viderSang();
  nouveauDirecteur();
  J.ennemis.length = 0;
  J.projectiles.length = 0;
  J.etincelles.length = 0;
  J.tues = 0;
  J.serie = 0;
  J.meilleureSerie = 0;
  J.parfaites = 0;
  J.etat = "prologue";
  J.etatT = 0;
  J.nouveauRecord = false;
}
var avant = 0;
function boucle(tms) {
  requestAnimationFrame(boucle);
  if (J.manuel) return;
  try {
    image2(tms);
  } catch (e) {
    noterErreur(e);
  }
}
function noterErreur(e) {
  const m = String(e && (e.stack || e.message) || e).split("\n").slice(0, 3).join(" | ").slice(0, 240);
  if (J.derniereErreur === m) return;
  J.derniereErreur = m;
  try {
    localStorage.setItem("lady-snowblood-erreur", (/* @__PURE__ */ new Date()).toISOString().slice(0, 16) + " " + m);
  } catch {
  }
}
addEventListener("error", (e) => noterErreur(e.error || e.message));
addEventListener("unhandledrejection", (e) => noterErreur(e.reason));
function image2(tms) {
  const debut = performance.now();
  const reel = Math.min(0.05, (tms - avant) / 1e3 || 0);
  avant = tms;
  J.temps += reel;
  const A = J.appuis;
  const E = { L: tenu("left"), R: tenu("right"), U: tenu("up"), parade: tenu("down"), bas: tenu("down"), sabre: tenu("sabre"), fort: tenu("fort"), appuis: A };
  if (A.has("konami")) {
    const on = basculerGundam();
    sfx("taiko");
    sfx(on ? "fureur" : "parade", 0.2);
    A.delete("sabre");
    A.delete("fort");
  }
  if (J.etat === "titre" && (A.has("sabre") || A.has("fort")) && !konamiEnCours()) {
    nouvellePartie();
    sfx("taiko");
  } else if (J.etat === "fin" && J.etatT > 1.5 && (A.has("sabre") || A.has("fort"))) {
    nouvellePartie();
  }
  const pause = J.etat === "jeu" && enPause();
  if (!pause) {
    J.etatT = (J.etatT || 0) + reel;
    let dt = reel * VITESSE;
    if (J.lent > 0) {
      J.lent -= reel;
      dt *= 0.3;
    }
    if (J.gel > 0) {
      J.gel -= reel;
      dt = 0;
    }
    majAmbiance(AMB, reel);
    if (J.cinema) {
      J.cinema.t += reel;
      if (J.cinema.fin == null && (J.boss?.pret || !J.boss || J.boss.etat === "mort")) J.cinema.fin = J.cinema.t;
      if (J.cinema.fin != null && J.cinema.t - J.cinema.fin > 0.5) J.cinema = null;
    }
    if (A.has("boss") && J.etat === "jeu" && !J.boss && !J.cinema) lancerBoss(false);
    if (J.gloire > 0) J.gloire -= reel;
    if (J.H && J.H.etat === "garde" && J.H.pv > 0 && (J.souffleT = (J.souffleT ?? 2) - reel) <= 0) {
      souffler(AMB, J.H.x - J.cam + J.H.dir * 14, SOL - J.H.y - 104, J.H.dir);
      J.souffleT = 2.2 + Math.random();
    }
    if (dt > 0) {
      if (J.etat === "prologue") {
        majHeroine(dt, { ...E, appuis: /* @__PURE__ */ new Set() });
        if (A.has("sabre") || A.has("fort")) J.etatT = carteSuivante(J.etatT);
        if (J.etatT >= dureePrologue()) {
          J.etat = "jeu";
          J.etatT = 0;
        }
      } else if (J.etat === "jeu" || J.etat === "fin") {
        majHeroine(dt, J.etat === "jeu" && !J.cinema ? E : { appuis: /* @__PURE__ */ new Set() });
        if (J.etat === "jeu") majDirecteur(dt);
        majEnnemis(dt);
        if (J.etat === "jeu" && J.H.pv <= 0 && J.H.t > 2.5) {
          J.etat = "fin";
          J.etatT = 0;
          J.nouveauRecord = noterRecord(J.tues);
        }
      } else if (J.H) majHeroine(dt, { appuis: /* @__PURE__ */ new Set() });
      majSang(dt);
      majEffets(dt);
      if ((J.serieT -= dt) <= 0) {
        J.meilleureSerie = Math.max(J.meilleureSerie, J.serie);
        J.serie = 0;
      }
    }
    J.secousse = Math.max(0, J.secousse - reel);
    J.coupe = Math.max(0, (J.coupe || 0) - reel);
    J.eclair = Math.max(0, J.eclair - reel);
    J.rouge = Math.max(0, J.rouge - reel);
  }
  const theme = J.boss || J.cinema ? (J.bossN || 0) % 2 ? "theme" : "theme2" : "theme2";
  const bossProche = J.etat === "jeu" && !J.boss && J.tues >= (J.prochainBoss || 30) - 6;
  musique(J.etat === "titre" || J.etat === "prologue" ? "nuit" : J.etat === "fin" || J.H && J.H.pv <= 0 ? "fin" : J.etat === "jeu" ? J.boss || J.cinema ? "boss" : "nuit" : null, theme, bossProche ? "boss" : null);
  majMusique(J.grandMoment > 0, false, J.coupe > 0, pause);
  if (J.grandMoment > 0) J.grandMoment -= reel;
  A.clear();
  if (J.H) J.cam += (clamp(J.H.x - J.W / 2, 0, ARENE - J.W) - J.cam) * Math.min(1, reel * 5);
  dessiner2();
  if (ESSAI) {
    (J.mesures ||= []).push(performance.now() - debut);
    if (J.mesures.length > 600) J.mesures.shift();
  }
  if (J.compteur) compteur(tms, performance.now() - debut, reel);
  if (J.gel > 0 && J.evt) J.evt.gel = true;
  J.evtPrec = J.evt;
  J.evt = {};
}
var CPT = { n: 0, t0: 0, calc: 0, pire: 0, sautees: 0, texte: "", causes: {} };
J.evt = {};
if (/[?&]compteur/.test(location.search)) J.compteur = true;
function compteur(tms, calcul, reel) {
  CPT.n++;
  CPT.calc += calcul;
  CPT.pire = Math.max(CPT.pire, calcul);
  if (reel > 0.025) {
    CPT.sautees++;
    const e = J.evtPrec || {}, c = e.mort ? "MORT" : e.toile ? "TOILE" : e.musique ? "MUSIQUE" : e.gel ? "GEL" : "?";
    CPT.causes[c] = (CPT.causes[c] || 0) + 1;
  }
  if (tms - CPT.t0 >= 1e3) {
    const causes = Object.entries(CPT.causes).map(([k, v]) => `${k} ${v}`).join(" ");
    CPT.texte = `${CPT.n} I/S  ${(CPT.calc / Math.max(1, CPT.n)).toFixed(1)} MS (PIRE ${CPT.pire.toFixed(1)})  ${CPT.sautees} SAUTEES${causes ? " : " + causes : ""}`;
    CPT.causes = {};
    CPT.n = 0;
    CPT.calc = 0;
    CPT.pire = 0;
    CPT.sautees = 0;
    CPT.t0 = tms;
  }
  if (CPT.texte) texte(CPT.texte, 8, J.HAUT - 14, OS, 1, "ombre");
}
function dessiner2() {
  const sx = J.secousse > 0 ? Math.round((Math.random() - 0.5) * 6) : 0, sy = J.secousse > 0 ? Math.round((Math.random() - 0.5) * 4) : 0;
  const cam = Math.round(J.cam) - sx;
  ctx.save();
  ctx.translate(0, sy);
  dessinerFond(cam);
  ambianceFond(ctx, AMB, cam);
  if (J.taches) dessinerTaches(cam);
  dessinerMorceaux(cam);
  if (J.etat !== "titre") dessinerEnnemis(cam);
  if (J.H) dessinerHeroine(cam);
  dessinerGouttes(cam);
  dessinerEtincelles(cam);
  dessinerDevant(cam);
  ambianceDevant(ctx, AMB, cam);
  ctx.restore();
  if (J.H?.etat === "iai") {
    const c = Math.min(1, J.H.charge / 1.2);
    ctx.globalAlpha = 0.45 * c;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, J.W, J.HAUT);
    ctx.globalAlpha = 1;
    dessinerHeroine(Math.round(J.cam));
  }
  if (J.coupe > 0) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, J.W, J.HAUT);
    ctx.fillStyle = "#fff";
    ctx.fillRect(Math.round(Math.min(J.coupeX0, J.coupeX1) - J.cam), SOL - 58, Math.round(Math.abs(J.coupeX1 - J.coupeX0)), 2);
  }
  if (J.eclair > 0 && !(J.coupe > 0)) {
    ctx.globalAlpha = Math.min(0.7, J.eclair * 5);
    ctx.fillStyle = OS;
    ctx.fillRect(0, 0, J.W, J.HAUT);
    ctx.globalAlpha = 1;
  }
  if (J.rouge > 0) {
    ctx.globalAlpha = J.rouge * 1.6;
    ctx.fillStyle = SANG[2];
    ctx.fillRect(0, 0, J.W, 4);
    ctx.fillRect(0, J.HAUT - 4, J.W, 4);
    ctx.fillRect(0, 0, 4, J.HAUT);
    ctx.fillRect(J.W - 4, 0, 4, J.HAUT);
    ctx.globalAlpha = 1;
  }
  if (J.etat === "titre") ecranTitre();
  else if (J.etat === "prologue") prologue(J.etatT);
  else {
    hud();
    if (J.cinema) cinema(J.cinema);
    if (J.gloire > 0) gloire(J.gloire);
    if (J.etat === "fin") ecranFin(J.etatT, J.nouveauRecord);
  }
  if (J.etat === "jeu" && enPause()) ecranPause();
  if (!S["r-garde"]) texte("IMAGES ABSENTES : LANCER  python3 outils/rotoscoper.py monter garde ga", J.W / 2, 20, SANG[4], 1, "ombre", "centre");
}
window.__musique = etatMusique;
window.__lady = () => ({ etat: J.etat, x: J.H && Math.round(J.H.x), pv: J.H?.pv, h: J.H?.etat, anim: J.H?.anim, k: J.H?.k, fureur: J.H?.fureur, tues: J.tues, ennemis: J.ennemis.map((e) => `${e.type}:${e.etat}:${Math.round(e.x)}`), chrono: J.chrono });
if (ESSAI) window.__essai = {
  J,
  S,
  apparaitre,
  tuer,
  jouer: nouvellePartie,
  memoire,
  dessinerSprite: dessiner,
  poser(x) {
    J.H.x = x;
  },
  fureur() {
    J.H.fureur = 1;
  },
  invincible() {
    J.H.pv = 999;
  },
  calme() {
    J.majDirecteurOff = true;
  },
  // le banc d'essai des animations (outils/tests/animations.mjs) : le jeu avance image par image, entrées scriptées
  manuel(on = true) {
    J.manuel = on;
    if (on) avant = 0;
  },
  pas(s = 1 / 60) {
    if (!avant) avant = 1e3;
    image2(avant + s * 1e3);
  },
  rendu: () => ctx.canvas.toDataURL(),
  appuyer(k) {
    appui(k);
    clavier[k] = true;
  },
  lacher(k) {
    clavier[k] = false;
  },
  direct() {
    J.etat = "jeu";
    J.etatT = 0;
    J.majDirecteurOff = true;
    J.forcerAttaque = null;
    J.H.pv = 999;
    J.H.x = ARENE / 2;
    J.cam = (ARENE - J.W) / 2;
    if (J.gundam) basculerGundam();
  },
  // chaque scénario du banc repart avec l'héroïne
  blesser(dir = 1) {
    blesserHeroine({ x: J.H.x + dir * 40, type: "sabreur" }, -dir);
  },
  touches: () => ({ ...boutons }),
  // l'état de la manette tactile (outils/tests/croix.mjs)
  etat: () => ({
    etat: J.H.etat,
    anim: J.H.anim,
    k: J.H.k,
    x: J.H.x,
    y: J.H.y,
    cam: J.cam,
    dir: J.H.dir,
    tues: J.tues,
    nb: J.ennemis.length,
    repit: +(J.repit || 0).toFixed(2),
    cinema: J.cinema ? [+J.cinema.t.toFixed(2), J.cinema.fin] : null,
    ennemi: J.ennemis[0] ? { type: J.ennemis[0].type, etat: J.ennemis[0].etat, anim: J.ennemis[0].anim, k: J.ennemis[0].k, x: J.ennemis[0].x, y: J.ennemis[0].y, dir: J.ennemis[0].dir, pv: J.ennemis[0].pv, fondu: J.ennemis[0].fondu ? [J.ennemis[0].fondu.anim, J.ennemis[0].fondu.k] : null } : null
  })
};
disposer();
var AMB = creerAmbiance(J.W, J.HAUT, SOL);
nouvelleHeroine();
await chargerSprites();
assemblerHeroine();
preparerSouillures(["r-garde", "r-course", "r-marche", "r-coup-leger", "r-estoc", "r-coup-fort", "r-k-combo2", "r-k-final", "r-revers", "r-k-coupe-epaule", "r-k-balayage", "r-k-montante", "r-k-haute", "r-k-dash-coupe", "r-bond-coupe", "r-k-pied-tournant"], [1, 4]);
preparerSignatures(Object.keys(S).filter((n) => /^r-/.test(n)));
if (S["bouton-leger"] && S["bouton-fort"]) {
  document.body.classList.add("peint");
  for (const [k, nom] of [["sabre", "bouton-leger"], ["fort", "bouton-fort"]]) {
    const el = document.querySelector(`.rond[data-k="${k}"]`);
    if (el) el.style.backgroundImage = `url(${S[nom].img.src})`;
  }
}
requestAnimationFrame(boucle);
export {
  noterErreur
};
//# sourceMappingURL=jeu.js.map

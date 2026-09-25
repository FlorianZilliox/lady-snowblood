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
  "r-k-final": { cadence: [3, 3, 7, 4, 4, 6], frappe: [1, 2], suite: 3, retour: ["r-k-saut", 11, 12], portee: 96, degats: 2, pas: 24, tranche: true, coupe: "vertical" },
  "r-estoc": { cadence: [2, 2, 3, 5, 5, 4, 4], frappe: [3, 4], suite: 4, portee: 100, degats: 1, pas: 30, coupe: "estoc" },
  // C : l'estoc (7 images)
  "r-coup-fort": { cadence: [4, 3, 7, 4, 4, 5], frappe: [1, 2], suite: 3, retour: ["r-k-saut", 11, 12], portee: 96, degats: 2, pas: 20, tranche: true, coupe: "vertical" },
  // V : la finale, seule
  "r-k-balayage": { cadence: [4, 3, 6, 3, 5, 4], frappe: [0, 4], suite: 4, portee: 110, degats: 1, pas: 14, bas: true, coupe: "lateral" },
  // le balayage horizontal : ses arcs font le coup (images 0, 2, 4)
  "r-k-montante": { cadence: [3, 2, 3, 6, 4, 4, 4], frappe: [1, 3], suite: 4, retour: ["r-k-saut", 11, 12], portee: 80, degats: 2, pas: 8, tranche: true, coupe: "vertical" },
  "r-k-dash-coupe": { cadence: [3, 3, 7, 4, 5], frappe: [1, 2], suite: 3, retour: ["r-k-saut", 11, 12], portee: 100, degats: 2, pas: 60, tranche: true, coupe: "vertical" },
  "r-k-pied": { cadence: [3, 3, 5, 5, 3, 3, 3, 4], frappe: [2, 5], suite: 5, portee: 70, degats: 1, pas: 14, repousse: true, coupe: "pied" },
  "r-k-haute": { cadence: [3, 3, 4, 5, 5, 3, 3, 4], frappe: [2, 5], suite: 5, portee: 100, degats: 2, pas: 12, tranche: true, coupe: "vertical" },
  "r-k-saut": { ips: 12 },
  // les images suivent le vol (heroine.js) : appel, montée, sommet, descente, réception
  "r-k-salto": { ips: 20 },
  // joué sur la durée du vol
  // la coupe plongeante (X en l'air) : un appel (image 5), puis elle fond en avant et vers le bas sur l'image 8 (heroine.js,
  // état « plonge », fantômes et sillage de lame), et s'écrase au sol dans la coupe accroupie de la finale (r-plonge-fin)
  "r-k-saute-coupe": { de: 5, cadence: [3, 3, 6, 6], frappe: [1, 2], portee: 96, degats: 2, pas: 0, tranche: true, coupe: "vertical" },
  "r-plonge-fin": { de: 2, cadence: [6, 3, 3, 4], frappe: [0, 1], suite: 2, retour: ["r-k-saut", 11, 12], portee: 100, degats: 2, pas: 6, tranche: true, coupe: "vertical" },
  "r-k-pied-saute": { cadence: [2, 2, 2, 3, 4, 4, 4, 5, 5, 5], frappe: [4, 9], portee: 70, degats: 1, pas: 0, coupe: "pied" },
  "r-k-chute": { ips: 12 },
  "r-k-releve": { ips: 8 },
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
var COMBO = ["r-coup-leger", "r-estoc", "r-coup-fort", "r-k-combo2", "r-k-final", "r-k-balayage", "r-k-montante", "r-k-dash-coupe", "r-k-pied", "r-k-haute", "r-k-fort"];
var CHAINES = { sabre: [0, 3, 1, 5], fort: [10, 6, 9, 7] };
var FENETRE_PARFAITE = 0.16;
var TAMPON = 0.4;
var ENNEMIS = {
  sabreur: { vitesse: 72, ipsMarche: 15, distance: 70, armer: 0.42, frappe: 0.16, portee: 74, sautable: 70, repos: 0.6, bond: 190, bloque: 0.22 },
  lancier: { vitesse: 70, ipsMarche: 13, distance: 128, armer: 0.52, frappe: 0.18, portee: 130, sautable: 40, repos: 0.95, bond: 60, bloque: 0 },
  ninja: { vitesse: 190, ipsMarche: 12, distance: 240, armer: 0.42, frappe: 0.12, portee: 0, sautable: 0, repos: 0.5, bond: 0, bloque: 0 }
};

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
      J.actx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return;
    }
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
function sfx(nom, delai = 0) {
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

// src/js/entrees.js
var clavier = {};
var boutons = {};
var tenu = (k) => !!(clavier[k] || boutons[k]);
J.appuis = /* @__PURE__ */ new Set();
function appui(k) {
  reveillerSon();
  if (J.pause) {
    J.pause = false;
    return;
  }
  J.appuis.add(k);
  const t = performance.now();
  if (k === "left" || k === "right") {
    if (t - (dernier[k] || -1e9) < 260) {
      J.appuis.add("dash-" + k);
      dernier[k] = -1e9;
    } else dernier[k] = t;
  }
}
var dernier = {};
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
  if (k && ![...enfoncees.values()].includes(k)) clavier[k] = false;
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
  const zone = document.getElementById("croix"), bras = {};
  DIRECTIONS.forEach((k) => {
    bras[k] = zone.querySelector(`[data-dir="${k}"]`);
  });
  let doigt = null, actives = /* @__PURE__ */ new Set(), r = null;
  const poser = (nouvelles) => {
    for (const k of DIRECTIONS) {
      const avant2 = actives.has(k), apres = nouvelles.has(k);
      if (apres && !avant2) appui(k);
      boutons[k] = apres ? 1 : 0;
      bras[k].classList.toggle("on", apres);
    }
    actives = nouvelles;
  };
  const lire2 = (e) => {
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy);
    const s = /* @__PURE__ */ new Set();
    if (d > r.width * 0.12) {
      const c = dx / d, n = dy / d, SEUIL = 0.383;
      if (c < -SEUIL) s.add("left");
      if (c > SEUIL) s.add("right");
      if (n < -SEUIL) s.add("up");
      if (n > SEUIL) s.add("down");
    }
    poser(s);
  };
  zone.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (doigt !== null) return;
    doigt = e.pointerId;
    zone.setPointerCapture(e.pointerId);
    r = zone.querySelector(".croix-dessin").getBoundingClientRect();
    lire2(e);
  });
  zone.addEventListener("pointermove", (e) => {
    if (e.pointerId === doigt) lire2(e);
  });
  const lever = (e) => {
    if (e.pointerId === doigt) api.fin();
  };
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((t) => zone.addEventListener(t, lever));
  const api = { fin() {
    doigt = null;
    poser(/* @__PURE__ */ new Set());
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
    for (const { b, x, y, rayon } of centres) {
      const d = Math.hypot(e.clientX - x, e.clientY - y);
      if (d < rayon && d < dmin) {
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
var ART = { "decor/scene": { "taille": [704, 396], "decalage": [0, 0], "hauteurAvantRognage": 396, "raccord": false, "src": "images/decor/scene.png" }, "effets/e-k-coupes": { "taille": [512, 106], "decalage": [0, 0], "hauteurAvantRognage": 106, "raccord": false, "cellule": [64, 106], "images": 8, "ancres": [[-31, 121], [-31, 121], [-31, 121], [-31, 121], [-31, 121], [-31, 121], [-31, 121], [-31, 121]], "pieds": [-31, 121], "src": "images/effets/e-k-coupes.png" }, "effets/e-k-combo2": { "taille": [343, 38], "decalage": [0, 0], "hauteurAvantRognage": 38, "raccord": false, "cellule": [49, 38], "images": 7, "ancres": [[-45, 55], [-45, 55], [-45, 55], [-45, 55], [-45, 55], [-45, 55], [-45, 55]], "pieds": [-45, 55], "src": "images/effets/e-k-combo2.png" }, "effets/e-k-final": { "taille": [522, 107], "decalage": [0, 0], "hauteurAvantRognage": 107, "raccord": false, "cellule": [87, 107], "images": 6, "ancres": [[-4, 120], [-4, 120], [-4, 120], [-4, 120], [-4, 120], [-4, 120]], "pieds": [-4, 120], "src": "images/effets/e-k-final.png" }, "effets/e-k-estoc": { "taille": [749, 62], "decalage": [0, 0], "hauteurAvantRognage": 62, "raccord": false, "cellule": [107, 62], "images": 7, "ancres": [[3, 90], [3, 90], [3, 90], [3, 90], [3, 90], [3, 90], [3, 90]], "pieds": [3, 90], "src": "images/effets/e-k-estoc.png" }, "effets/e-k-balayage": { "taille": [774, 43], "decalage": [0, 0], "hauteurAvantRognage": 43, "raccord": false, "cellule": [129, 43], "images": 6, "ancres": [[78, 72], [78, 72], [78, 72], [78, 72], [78, 72], [78, 72]], "pieds": [78, 72], "src": "images/effets/e-k-balayage.png" }, "logo/logo": { "taille": [441, 127], "decalage": [6, 12], "hauteurAvantRognage": 150, "raccord": false, "src": "images/logo/logo.png" }, "roto/r-coup-leger": { "taille": [1390, 105], "decalage": [0, 0], "hauteurAvantRognage": 105, "raccord": false, "cellule": [139, 105], "images": 10, "pieds": [54, 98], "lames": [[39.7, 29.1, 26.2, 8.9], null, [38.6, 37.9, 19.6, 28.1], [38.9, 38.3, 20.1, 28.2], [58, 67.4, 79.1, 60.2], [52.3, 64.3, 33.9, 56.1], [89.5, 47.8, 136.4, 51.4], [88.4, 48.1, 113, 49.3], null, [27.9, 28, 12.1, 23.3]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "src": "images/roto/r-coup-leger.png" }, "roto/r-garde": { "taille": [1053, 108], "decalage": [0, 0], "hauteurAvantRognage": 108, "raccord": false, "cellule": [117, 108], "images": 9, "pieds": [72, 107], "bustes": [67, 67.8, 68.6, 68.3, 68.2, 67.5, 66.4, 66.7, 66.2], "lames": [[67.5, 36.2, 106.7, 10.1], [68.6, 35.8, 101.7, 2.3], [68.4, 36.5, 106.8, 9.3], [69, 36, 112.3, 17.7], [79.3, 35.2, 113.5, 28.7], [93.1, 42.4, 111.4, 44.1], [95.6, 45.7, 108, 47.4], [67.5, 41, 114.5, 41.3], [66.9, 36.4, 109.1, 15.6]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "ancres": [[67, 107], [68, 107], [69, 107], [68, 107], [68, 107], [68, 107], [66, 107], [67, 107], [66, 107]], "src": "images/roto/r-garde.png" }, "roto/r-marche": { "taille": [992, 106], "decalage": [0, 0], "hauteurAvantRognage": 106, "raccord": false, "cellule": [124, 106], "images": 8, "pieds": [66, 98], "bustes": [57.8, 56.4, 57.7, 58, 59.2, 62.6, 63.9, 58.5], "lames": [[70.7, 29.4, 117.4, 23.9], [68.8, 28.2, 115.4, 22.2], [69.7, 25.7, 116.1, 17.6], [69.3, 24.4, 115.5, 15.8], [71.4, 24.4, 117.5, 14.6], [75.2, 24.5, 121.4, 15.5], [73.1, 27.4, 119.6, 20.5], [70.2, 29.2, 116.8, 23.1]], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "ancres": [[58, 98], [56, 98], [58, 98], [58, 98], [59, 98], [63, 98], [64, 98], [58, 98]], "src": "images/roto/r-marche.png" }, "roto/r-estoc": { "taille": [1660, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [166, 97], "images": 10, "pieds": [64, 94], "lames": [[60.9, 33.5, 107.1, 42.5], [80.4, 39.4, 127.4, 38.7], [98.5, 41.8, 145.5, 41.1], [106.3, 42, 143.2, 42], [118.3, 43, 165.3, 40.1], [146.5, 39.9, 164.5, 40.7], [144.1, 40.3, 164.5, 40.6], null, null, [96.9, 41.8, 143.9, 41.1]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "src": "images/roto/r-estoc.png" }, "roto/r-parade": { "taille": [625, 103], "decalage": [0, 0], "hauteurAvantRognage": 103, "raccord": false, "cellule": [125, 103], "images": 5, "pieds": [69, 101], "lames": [[75.2, 24.4, 97.7, 9.6], [88.5, 51.9, 77.7, 34.8], [75.3, 38.7, 83, 71.3], [74.2, 37.6, 78.2, 84.5], [65.3, 42.6, 85.7, 84.9]], "indices": [0, 1, 2, 3, 4], "src": "images/roto/r-parade.png" }, "roto/r-saut": { "taille": [984, 163], "decalage": [0, 0], "hauteurAvantRognage": 163, "raccord": false, "cellule": [123, 163], "images": 8, "pieds": [50, 154], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-saut.png" }, "roto/r-coup-fort": { "taille": [3196, 112], "decalage": [0, 0], "hauteurAvantRognage": 112, "raccord": false, "cellule": [188, 112], "images": 17, "pieds": [87, 106], "lames": [null, [101.8, 33.9, 147.9, 43.4], [99.9, 32.2, 135.2, 37.2], null, [86.5, 22.7, 41.2, 10.2], [119.5, 32.2, 83.3, 2.1], [115.4, 29.9, 95.5, 10.8], [143, 66.2, 185, 44.8], null, [64.9, 84.3, 44.1, 90.7], [64.3, 84.7, 44.1, 90.7], null, null, [68.6, 81.3, 49.2, 86.8], null, [119.3, 68.8, 139.9, 69.6], [102, 56.1, 148.9, 59.6]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], "src": "images/roto/r-coup-fort.png" }, "roto/r-touche": { "taille": [804, 118], "decalage": [0, 0], "hauteurAvantRognage": 118, "raccord": false, "cellule": [134, 118], "images": 6, "pieds": [82, 111], "lames": [[30.7, 68.3, 2.3, 82.9], [30.7, 68.3, 2.3, 82.9], null, [36.1, 52.9, 12.8, 36.1], [53.8, 45.5, 60.5, 16.7], [63.9, 42.1, 94.2, 6]], "indices": [0, 1, 2, 3, 4, 5], "src": "images/roto/r-touche.png" }, "roto/r-mort": { "taille": [1456, 96], "decalage": [0, 0], "hauteurAvantRognage": 96, "raccord": false, "cellule": [182, 96], "images": 8, "pieds": [91, 85], "lames": [[62.9, 19.2, 109.6, 13.9], [53.1, 33.8, 26.3, 25.3], [62.5, 52.5, 30.1, 65.9], null, [90.7, 78.1, 71.8, 56.9], [115.9, 68.3, 131.3, 23.8], [123.2, 71, 141.2, 40.7], [95.1, 78.1, 139.8, 63.3]], "indices": [0, 1, 2, 3, 4, 10, 11, 12], "src": "images/roto/r-mort.png" }, "roto/r-sa-garde": { "taille": [1060, 101], "decalage": [0, 0], "hauteurAvantRognage": 101, "raccord": false, "cellule": [106, 101], "images": 10, "pieds": [49, 99], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[51, 97], [50, 97], [49, 96], [48, 97], [47, 97], [46, 98], [47, 99], [50, 99], [51, 98], [51, 96]], "src": "images/roto/r-sa-garde.png" }, "roto/r-sa-attaque": { "taille": [1720, 141], "decalage": [0, 0], "hauteurAvantRognage": 141, "raccord": false, "cellule": [215, 141], "images": 8, "pieds": [92, 133], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-sa-attaque.png" }, "roto/r-la-garde": { "taille": [1800, 106], "decalage": [0, 0], "hauteurAvantRognage": 106, "raccord": false, "cellule": [180, 106], "images": 10, "pieds": [85, 101], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[92, 101], [90, 105], [86, 100], [79, 99], [79, 100], [82, 103], [82, 102], [82, 101], [86, 102], [92, 98]], "src": "images/roto/r-la-garde.png" }, "roto/r-la-marche": { "taille": [1870, 106], "decalage": [0, 0], "hauteurAvantRognage": 106, "raccord": false, "cellule": [187, 106], "images": 10, "pieds": [80, 103], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[86, 98], [77, 102], [70, 103], [72, 101], [77, 105], [84, 102], [87, 101], [84, 100], [80, 102], [83, 102]], "src": "images/roto/r-la-marche.png" }, "roto/r-la-attaque": { "taille": [1341, 96], "decalage": [0, 0], "hauteurAvantRognage": 96, "raccord": false, "cellule": [149, 96], "images": 9, "pieds": [65, 90], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "src": "images/roto/r-la-attaque.png" }, "roto/r-la-touche": { "taille": [1449, 110], "decalage": [0, 0], "hauteurAvantRognage": 110, "raccord": false, "cellule": [207, 110], "images": 7, "pieds": [95, 102], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-la-touche.png" }, "roto/r-la-mort": { "taille": [1872, 122], "decalage": [0, 0], "hauteurAvantRognage": 122, "raccord": false, "cellule": [208, 122], "images": 9, "pieds": [104, 113], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "src": "images/roto/r-la-mort.png" }, "roto/r-ni-garde": { "taille": [1250, 90], "decalage": [0, 0], "hauteurAvantRognage": 90, "raccord": false, "cellule": [125, 90], "images": 10, "pieds": [71, 89], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[73, 85], [72, 86], [70, 86], [70, 87], [71, 88], [71, 89], [71, 89], [71, 88], [71, 87], [72, 86]], "src": "images/roto/r-ni-garde.png" }, "roto/r-ni-course": { "taille": [750, 90], "decalage": [0, 0], "hauteurAvantRognage": 90, "raccord": false, "cellule": [150, 90], "images": 5, "pieds": [69, 86], "indices": [0, 1, 2, 3, 4], "ancres": [[73, 88], [82, 88], [72, 86], [62, 87], [57, 87]], "src": "images/roto/r-ni-course.png" }, "roto/r-ni-lancer": { "taille": [1376, 120], "decalage": [0, 0], "hauteurAvantRognage": 120, "raccord": false, "cellule": [172, 120], "images": 8, "pieds": [66, 113], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-ni-lancer.png" }, "roto/r-ni-bond": { "taille": [1155, 135], "decalage": [0, 0], "hauteurAvantRognage": 135, "raccord": false, "cellule": [165, 135], "images": 7, "pieds": [86, 130], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-ni-bond.png" }, "roto/r-ni-touche": { "taille": [938, 87], "decalage": [0, 0], "hauteurAvantRognage": 87, "raccord": false, "cellule": [134, 87], "images": 7, "pieds": [76, 82], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-ni-touche.png" }, "roto/r-ni-mort": { "taille": [1539, 142], "decalage": [0, 0], "hauteurAvantRognage": 142, "raccord": false, "cellule": [171, 142], "images": 9, "pieds": [88, 133], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "src": "images/roto/r-ni-mort.png" }, "roto/r-sa-marche": { "taille": [1240, 121], "decalage": [0, 0], "hauteurAvantRognage": 121, "raccord": false, "cellule": [124, 121], "images": 10, "pieds": [54, 120], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "ancres": [[54, 118], [54, 116], [52, 115], [50, 119], [53, 120], [58, 116], [61, 116], [56, 118], [51, 115], [51, 120]], "src": "images/roto/r-sa-marche.png" }, "roto/r-sa-touche": { "taille": [1001, 113], "decalage": [0, 0], "hauteurAvantRognage": 113, "raccord": false, "cellule": [143, 113], "images": 7, "pieds": [68, 106], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-sa-touche.png" }, "roto/r-sa-mort": { "taille": [1710, 126], "decalage": [0, 0], "hauteurAvantRognage": 126, "raccord": false, "cellule": [190, 126], "images": 9, "pieds": [102, 120], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "src": "images/roto/r-sa-mort.png" }, "roto/r-k-garde": { "taille": [1188, 100], "decalage": [0, 0], "hauteurAvantRognage": 100, "raccord": false, "cellule": [132, 100], "images": 9, "pieds": [75, 99], "lames": [null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "ancres": [[79, 95], [75, 97], [71, 94], [75, 98], [76, 94], [73, 96], [75, 95], [75, 96], [76, 96]], "src": "images/roto/r-k-garde.png" }, "roto/r-k-marche": { "taille": [840, 109], "decalage": [0, 0], "hauteurAvantRognage": 109, "raccord": false, "cellule": [105, 109], "images": 8, "pieds": [46, 108], "bustes": [41.9, 47.1, 43.3, 40.2, 42.9, 48.6, 43.3, 41], "lames": [null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "ancres": [[42, 108], [47, 108], [43, 108], [40, 108], [43, 108], [49, 108], [43, 108], [41, 108]], "src": "images/roto/r-k-marche.png" }, "roto/r-k-course": { "taille": [890, 91], "decalage": [0, 0], "hauteurAvantRognage": 91, "raccord": false, "cellule": [178, 91], "images": 5, "pieds": [85, 89], "bustes": [101.4, 106.1, 105.3, 103.1, 95.9], "lames": [null, null, null, null, null], "indices": [0, 1, 2, 3, 4], "ancres": [[109, 89], [83, 89], [94, 89], [115, 89], [96, 89]], "src": "images/roto/r-k-course.png" }, "roto/r-k-coupes": { "taille": [1184, 118], "decalage": [0, 0], "hauteurAvantRognage": 118, "raccord": false, "cellule": [148, 118], "images": 8, "pieds": [53, 115], "bustes": [54.8, 52.6, 59.9, 54.8, 74.6, 83.8, 69.8, 90], "lames": [null, null, null, null, [127.4, 61.4, 148, 34.6], null, [117.4, 97.9, 127.5, 96.7], null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-k-coupes.png" }, "roto/r-k-chute": { "taille": [1400, 116], "decalage": [0, 0], "hauteurAvantRognage": 116, "raccord": false, "cellule": [175, 116], "images": 8, "pieds": [89, 103], "bustes": [94.8, 78.8, 94.6, 49.8, 87.8, 128.2, 89.4, 89.3], "lames": [null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-k-chute.png" }, "roto/r-k-releve": { "taille": [399, 80], "decalage": [0, 0], "hauteurAvantRognage": 80, "raccord": false, "cellule": [133, 80], "images": 3, "pieds": [74, 78], "bustes": [69.7, 78.3, 69.2], "lames": [null, null, null], "indices": [0, 1, 2], "src": "images/roto/r-k-releve.png" }, "roto/r-k-saut": { "taille": [962, 108], "decalage": [0, 0], "hauteurAvantRognage": 108, "raccord": false, "cellule": [74, 108], "images": 13, "pieds": [38, 107], "bustes": [41.6, 44.9, 44.4, 44.7, 45, 41.3, 42, 40.6, 50.3, 49.4, 41.4, 43.7, 43.3], "lames": [null, null, null, null, null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "src": "images/roto/r-k-saut.png" }, "roto/r-k-salto": { "taille": [1440, 123], "decalage": [0, 0], "hauteurAvantRognage": 123, "raccord": false, "cellule": [120, 123], "images": 12, "pieds": [61, 118], "bustes": [93.2, 75.2, 73.8, 50.1, 54.3, 55.4, 68.5, 38.1, 44.5, 46.1, 64.3, 67.9], "lames": [null, null, null, null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "src": "images/roto/r-k-salto.png" }, "roto/r-k-pied": { "taille": [1112, 103], "decalage": [0, 0], "hauteurAvantRognage": 103, "raccord": false, "cellule": [139, 103], "images": 8, "pieds": [72, 101], "bustes": [78.2, 64.4, 59.5, 69.7, 69.2, 68.5, 61.1, 59.9], "lames": [null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-k-pied.png" }, "roto/r-k-pied-saute": { "taille": [1300, 115], "decalage": [0, 0], "hauteurAvantRognage": 115, "raccord": false, "cellule": [130, 115], "images": 10, "pieds": [51, 112], "bustes": [50.2, 55.3, 42.2, 41.8, 46.8, 46.7, 60.8, 61.3, 63.7, 61.7], "lames": [null, null, null, null, null, null, null, null, null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "src": "images/roto/r-k-pied-saute.png" }, "roto/r-k-combo2": { "taille": [882, 100], "decalage": [0, 0], "hauteurAvantRognage": 100, "raccord": false, "cellule": [126, 100], "images": 7, "pieds": [32, 98], "bustes": [47, 52.2, 48.6, 48.9, 49.3, 46.8, 49.1], "lames": [[94.8, 80.9, 104.2, 79.8], [68.2, 81.9, 82.2, 81.9], [68.2, 81.2, 96.8, 81.2], [96.1, 80.9, 105.5, 79.8], [96.1, 80.9, 105.5, 79.8], [108.3, 74.8, 122.9, 70.2], [101.3, 42.7, 114, 29.6]], "indices": [0, 1, 2, 3, 4, 5, 6], "src": "images/roto/r-k-combo2.png" }, "roto/r-k-final": { "taille": [822, 113], "decalage": [0, 0], "hauteurAvantRognage": 113, "raccord": false, "cellule": [137, 113], "images": 6, "pieds": [48, 111], "bustes": [66.4, 64.8, 90.4, 61.4, 75.1, 61.3], "lames": [[97, 48.9, 117.7, 26.7], [97.8, 49.6, 133.2, 6.1], null, [96.4, 95.6, 107.5, 95.6], null, [73.6, 93.6, 97.1, 93.6]], "indices": [0, 1, 2, 3, 4, 5], "depot": true, "src": "images/roto/r-k-final.png" }, "roto/r-k-montante": { "taille": [959, 140], "decalage": [0, 0], "hauteurAvantRognage": 140, "raccord": false, "cellule": [137, 140], "images": 7, "pieds": [60, 139], "bustes": [76.9, 69.9, 76.9, 75.5, 75.3, 71.8, 101.3], "lames": [[30.8, 47.7, -2.8, 18.6], [36.8, 47.1, 32.1, -8.7], [42.5, 49.9, 79.1, 7.5], [40.4, 53.2, 96.2, 48.5], null, [37.5, 107.2, 33.3, 65.4], [51.4, 66.6, -4.5, 69]], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "src": "images/roto/r-k-montante.png" }, "roto/r-k-haute": { "taille": [1128, 152], "decalage": [0, 0], "hauteurAvantRognage": 152, "raccord": false, "cellule": [141, 152], "images": 8, "pieds": [84, 150], "bustes": [94.6, 95.4, 93.5, 87.5, 93.2, 93.5, 92.4, 87.6], "lames": [[45.9, 64.9, 16.6, 98.7], [45.6, 58, -10.2, 62.8], [48.2, 51.4, 14.7, 22.3], [56.4, 45.2, 51.6, -10.6], [62.2, 46.6, 91.4, 12.8], [62.1, 55.4, 117.9, 50.5], null, null], "indices": [0, 1, 2, 3, 4, 5, 6, 7], "src": "images/roto/r-k-haute.png" }, "roto/r-k-charge": { "taille": [948, 142], "decalage": [0, 0], "hauteurAvantRognage": 142, "raccord": false, "cellule": [79, 142], "images": 12, "pieds": [44, 140], "bustes": [40.9, 40.9, 41.5, 41, 40.9, 40.4, 40.9, 30.1, 40.9, 29.5, 40.9, 46.2], "lames": [[19.9, 54.3, 25.8, -1.3], [19.9, 54.3, 25.8, -1.3], [19.9, 50.3, 25.8, -5.4], [19.9, 54.3, 25.8, -1.3], [19.9, 54.3, 25.8, -1.3], [19.9, 54.3, 25.8, -1.3], [19.9, 54.3, 25.8, -1.3], null, [19.9, 54.3, 25.8, -1.3], [20.9, 56.3, 24.7, 0.4], [19.9, 54.3, 25.8, -1.3], [28.2, 32.1, 4.8, 37.7]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "src": "images/roto/r-k-charge.png" }, "roto/r-k-saute-coupe": { "taille": [1188, 139], "decalage": [0, 0], "hauteurAvantRognage": 139, "raccord": false, "cellule": [132, 139], "images": 9, "pieds": [75, 137], "bustes": [62.9, 71.4, 64.5, 71.5, 71, 85.2, 83.8, 85.5, 99.9], "lames": [[51.5, 53.6, 55.1, -2.2], [50.3, 51.8, 56.2, -3.9], [51.5, 53.6, 55.2, -2.3], [50.3, 51.8, 56.2, -3.9], [50.6, 51.3, 56, -4.4], [51.1, 38.2, 13.6, 79.9], [36, 87.7, 48.6, 33.1], [40.2, 87.9, 48.3, 32.5], [43.7, 36.9, -9.1, 55.3]], "indices": [0, 1, 2, 3, 4, 5, 6, 7, 8], "src": "images/roto/r-k-saute-coupe.png" }, "roto/r-k-balayage": { "taille": [966, 85], "decalage": [0, 0], "hauteurAvantRognage": 85, "raccord": false, "cellule": [161, 85], "images": 6, "pieds": [80, 83], "bustes": [86.2, 102.6, 85.9, 102.6, 119.3, 120.4], "lames": [null, null, null, null, null, [33, 12.8, 25.2, 14]], "indices": [0, 1, 2, 3, 4, 5], "depot": true, "src": "images/roto/r-k-balayage.png" }, "roto/r-k-dash-coupe": { "taille": [795, 114], "decalage": [0, 0], "hauteurAvantRognage": 114, "raccord": false, "cellule": [159, 114], "images": 5, "pieds": [50, 111], "bustes": [77.1, 64.7, 62.7, 62.7, 62.8], "lames": [[126.1, 24.6, 77.5, -3.3], [99.3, 49.6, 134.5, 6.1], [71.8, 97.3, 127.6, 93.1], [71.8, 97.3, 127.6, 93.1], [71.8, 97.8, 127.6, 93.1]], "indices": [0, 1, 2, 3, 4], "src": "images/roto/r-k-dash-coupe.png" }, "roto/r-k-fort": { "taille": [1043, 115], "decalage": [0, 0], "hauteurAvantRognage": 115, "raccord": false, "cellule": [149, 115], "images": 7, "pieds": [75, 113], "bustes": [121.3, 79, 85.4, 83.9, 82.2, 83.4, 98.8], "lames": [null, null, [64.8, 5.7, 9, 10.8], [52.3, 15.1, 24.2, 43.9], [37.2, 62.9, 49.7, 8.3], [41.1, 63.1, 49.1, 7.6], [44.1, 13.4, -8.8, 31.8]], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "src": "images/roto/r-k-fort.png" }, "roto/r-k-estoc": { "taille": [1057, 97], "decalage": [0, 0], "hauteurAvantRognage": 97, "raccord": false, "cellule": [151, 97], "images": 7, "pieds": [47, 95], "bustes": [54.1, 57.9, 65, 64.8, 78.5, 85.3, 68.1], "lames": [[13.8, 6.4, 5.9, 8.3], [29.1, 16.6, 18, 16.6], null, [88, 15.9, 77.9, 8.6], [129.1, 42.3, 137.8, 42.3], null, null], "indices": [0, 1, 2, 3, 4, 5, 6], "depot": true, "src": "images/roto/r-k-estoc.png" } };

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
  await Promise.all(Object.entries(ART).map(async ([cle, d]) => {
    const img = await chargerImage(d.src);
    if (!img) return;
    const nom = cle.split("/")[1];
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
    S[nom] = { img: c, px, cw, ch, n, ancres, hauts, lames: d.lames || null, regarde: d.regarde || "droite", depot: !!d.depot, blanc: null, souillures: [] };
  }));
}
function poserCase(g, img, s, k, versGauche, dx, dy, y0 = 0, h = s.ch) {
  if (!versGauche) {
    g.drawImage(img, k * s.cw, y0, s.cw, h, dx, dy + y0, s.cw, h);
    return;
  }
  g.save();
  g.translate(dx + s.cw, dy);
  g.scale(-1, 1);
  g.drawImage(img, k * s.cw, y0, s.cw, h, 0, y0, s.cw, h);
  g.restore();
}
function silhouetteBlanche(s) {
  const c = toile(s.img.width, s.img.height), g = c.getContext("2d");
  g.drawImage(s.img, 0, 0);
  g.globalCompositeOperation = "source-in";
  g.fillStyle = "#f2f1ec";
  g.fillRect(0, 0, c.width, c.height);
  return { img: c };
}
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
  const seuil = niveau / NIVEAUX * 0.62;
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
  if (o.blanc) src = s.blanc || (s.blanc = silhouetteBlanche(s));
  else if (o.souillure > 0.02) {
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
  const cle = niveau + couleur;
  if (trames[cle]) return trames[cle];
  const c = toile(4, 4), g = c.getContext("2d");
  g.fillStyle = couleur;
  for (let i = 0; i < 16; i++) if (BAYER[i] < niveau) g.fillRect(i % 4, i >> 2, 1, 1);
  return trames[cle] = c;
}
var tampon = toile(400, 260);
var gt = tampon.getContext("2d");
function dessinerFondu(nom, k, x, y, dir, reste, o = {}) {
  const s = S[nom];
  if (!s || reste <= 0) return;
  const niveau = Math.max(1, Math.min(15, Math.round(reste * 16)));
  gt.clearRect(0, 0, tampon.width, tampon.height);
  gt.globalCompositeOperation = "source-over";
  const [ax, ay] = s.ancres[k], versGauche = dir < 0 === (s.regarde === "droite");
  poserCase(gt, s.img, s, k, versGauche, 0, 0);
  gt.globalCompositeOperation = "destination-in";
  const dx = versGauche ? Math.round(x) - (s.cw - ax) : Math.round(x) - ax, dy = Math.round(y) - ay;
  gt.fillStyle = gt.createPattern(trame(niveau), "repeat");
  gt.save();
  gt.translate(-(dx % 4 + 4) % 4, -(dy % 4 + 4) % 4);
  gt.fillRect(0, 0, tampon.width + 4, tampon.height + 4);
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
    ctx.fillStyle = ctx.createPattern(trame(Math.max(2, Math.round(10 * age)), "#f2f1ec"), "repeat");
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
    if (file.length) setTimeout(suite, 16);
  };
  setTimeout(suite, 500);
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
    if (S["r-k-fort"]) S["r-parade"] = extrait("r-k-fort", 0, 2);
    else if (S["r-k-charge"]) S["r-parade"] = extrait("r-k-charge", 0, 2);
    if (S["r-k-chute"]) {
      S["r-touche"] = extrait("r-k-chute", 0, 3);
      S["r-mort"] = S["r-k-chute"];
    }
  }
}

// src/js/decor.js
var DEVANT = SOL + 6;
J.vent = 0;
function dessinerFond(cam) {
  const s = S.scene;
  if (s) ctx.drawImage(s.img, Math.round(-cam), -DECOR_HAUT);
  else {
    ctx.fillStyle = "#2a2a28";
    ctx.fillRect(0, 0, J.W, J.HAUT);
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
  const brume = toile(W * 2, 60), gb = brume.getContext("2d"), d = gb.createImageData(W * 2, 60);
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
  gb.putImageData(d, 0, 0);
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
  ctx2.fillStyle = "#f2f1ec";
  for (const f of A.flocons) if (f.z === z) {
    ctx2.globalAlpha = f.a;
    const x = Math.round(f.x - cam * [0.1, 0.3, 0.8][z]), y = Math.round(f.y);
    if (f.g === 3) {
      ctx2.fillRect(x, y + 1, 3, 1);
      ctx2.fillRect(x + 1, y, 1, 3);
      ctx2.globalAlpha = f.a * 0.5;
      ctx2.fillRect(x, y, 3, 3);
    } else ctx2.fillRect(x, y, f.g, f.g);
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
  ctx2.fillStyle = "#000";
  ctx2.globalAlpha = 0.18;
  for (let i = 0; i < 260; i++) ctx2.fillRect(Math.random() * A.W | 0, Math.random() * A.H | 0, 1, 1);
  ctx2.fillStyle = "#fff";
  ctx2.globalAlpha = 0.07;
  for (let i = 0; i < 120; i++) ctx2.fillRect(Math.random() * A.W | 0, Math.random() * A.H | 0, 1, 1);
  ctx2.globalAlpha = 1;
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
  J.morceaux.length = 0;
  J.jets.length = 0;
}
function gerbe(x, y, dir, n = 40, force = 1, haut = 0.6) {
  for (let i = 0; i < n; i++) {
    const v = rand(60, 320) * force, a = rand(-haut, 0.35);
    J.gouttes.push({
      x,
      y,
      vx: Math.cos(a) * v * dir + rand(-30, 30),
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
function trancher(nom, k, x, dir, ligne, pente, elan) {
  const s = S[nom];
  if (!s) return [];
  const versGauche = dir < 0 === (s.regarde === "droite");
  const [ax0, ay] = s.ancres[k];
  const ax = versGauche ? s.cw - ax0 : ax0;
  const h = s.hauts[k], yCoupe = ay - h * ligne;
  const morceau = (dessus) => {
    const c = toile(s.cw, s.ch), g = c.getContext("2d");
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
  if (J.morceaux.length > 60) J.morceaux.splice(0, 2);
  return [haut, bas];
}
function gisant(nom, k, x, dir) {
  const s = S[nom];
  if (!s) return;
  const versGauche = dir < 0 === (s.regarde === "droite");
  const c = toile(s.cw, s.ch);
  poserCase(c.getContext("2d"), s.img, s, k, versGauche, 0, 0);
  const [ax0, ay] = s.ancres[k];
  J.morceaux.push({ img: c, x, y: SOL, ox: versGauche ? s.cw - ax0 : ax0, oy: ay, pivot: [0, 0], rot: 0, vx: 0, vy: 0, vr: 0, t: 0, pose: true, dessus: false });
  if (J.morceaux.length > 60) J.morceaux.splice(0, 1);
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
      H.souillure = Math.min(0.3, H.souillure + 12e-4);
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
  for (let i = J.morceaux.length - 1; i >= 0; i--) if (J.morceaux[i].t > RESTE + DISPARITION) J.morceaux.splice(i, 1);
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
    ctx.save();
    if (reste < 1) ctx.globalAlpha = reste;
    ctx.translate(Math.round(m.x - cam), Math.round(m.y));
    if (m.rot) ctx.rotate(m.rot);
    ctx.drawImage(m.img, -m.ox, -m.oy);
    ctx.restore();
  }
}
function dessinerGouttes(cam) {
  for (const g of J.gouttes) {
    ctx.fillStyle = g.c;
    ctx.fillRect(Math.round(g.x - cam), Math.round(g.y), g.g, g.g);
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
function dessinerShuriken(p, cam) {
  const x = Math.round(p.x - cam), y = Math.round(p.y), tour = Math.floor(p.t * 24) % 2;
  ctx.fillStyle = "#111";
  if (tour) {
    ctx.fillRect(x - 4, y, 9, 1);
    ctx.fillRect(x, y - 4, 1, 9);
    ctx.fillRect(x - 1, y - 1, 3, 3);
  } else {
    for (let i = -3; i <= 3; i++) {
      ctx.fillRect(x + i, y + i, 1, 1);
      ctx.fillRect(x + i, y - i, 1, 1);
    }
    ctx.fillRect(x - 1, y - 1, 3, 3);
  }
  ctx.fillStyle = "#d8d8d2";
  ctx.fillRect(x, y, 1, 1);
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
var repli = { 3: 0, 4: 2, 5: 0, 6: 2, 7: 1, 8: 1, 9: 2, 10: 4 };
var coupDispo = (n) => S[COMBO[n]] ? n : repli[n] ?? 0;
function lancerCoup(H, n, E) {
  n = coupDispo(n);
  if (!H.enchaine) {
    H.legers = 0;
    H.lourds = 0;
  }
  if (CHAINES.sabre.includes(n)) H.legers++;
  else H.lourds++;
  if (E.L && !E.R) H.dir = -1;
  else if (E.R && !E.L) H.dir = 1;
  H.combo = n;
  H.touches.clear();
  H.relache = false;
  changer(H, "coup", COMBO[n]);
  sfx(ANIMS[COMBO[n]].tranche ? "lourd" : "lame");
}
function coupSuivant(H, bouton) {
  if (bouton === "sabre") return H.legers >= CHAINES.sabre.length || H.lourds ? -1 : CHAINES.sabre[H.legers];
  if (H.lourds >= 2) return -1;
  const c = CHAINES.fort, n = c[Math.min(c.length - 1, H.legers + H.lourds)];
  return coupDispo(n) === H.combo ? c[(c.indexOf(n) + 1) % c.length] : n;
}
function choisirCoup(H, E, touche) {
  if (touche === "sabre") return E.bas ? 5 : 0;
  return E.bas ? 8 : H.court ? 7 : 10;
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
  const prendre = () => {
    H.tampon = null;
  };
  if (A.has("down")) H.paradeDepuis = 0;
  if ((E.sabre && E.fort || veut("fureur")) && H.fureur >= 1 && !["fureur", "mort", "touche"].includes(H.etat)) {
    prendre();
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
        prendre();
        fureur(H, E);
        break;
      }
      for (const t of ["sabre", "fort"]) if (veut(t)) {
        prendre();
        H.enchaine = 0;
        lancerCoup(H, choisirCoup(H, E, t), E);
        break;
      }
      if (H.etat === "coup") break;
      if (veut("up")) {
        prendre();
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
        prendre();
        lancerCoup(H, 1, E);
        break;
      }
      if (veut("fort") && f > 0.3) {
        prendre();
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
      H.vx = f > a2.frappe[0] * 0.7 && f < a2.frappe[1] ? H.dir * a2.pas / (duree(H.anim) * (a2.frappe[1] - a2.frappe[0] * 0.7)) : 0;
      if (f > a2.frappe[1]) {
        if (f > a2.suite) {
          const bouton = ["sabre", "fort"].find((b) => veut(b));
          if (bouton) {
            const n2 = E.bas ? choisirCoup(H, E, bouton) : coupSuivant(H, bouton);
            if (n2 >= 0) {
              prendre();
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
          prendre();
          sauter(H, E);
          break;
        }
        if (veut("fureur") && H.fureur >= 1) {
          prendre();
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
        if (a2.retour && S[a2.retour[0]]) retour(H, a2.retour);
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
        prendre();
        H.touches.clear();
        changer(H, "coup-air", "r-k-pied-saute");
        sfx("lame");
      } else if ((veut("sabre") || veut("fort")) && S["r-k-saute-coupe"]) {
        prendre();
        H.touches.clear();
        changer(H, "plonge", "r-k-saute-coupe");
        H.fantomesN = -1;
        sfx("lourd");
      } else if (veut("sabre") || veut("fort")) {
        prendre();
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
    case "retour": {
      H.vx *= 0.5;
      const d = (E.R ? 1 : 0) - (E.L ? 1 : 0), presse = veut("sabre") || veut("fort") || veut("up");
      if (H.t >= RETOUR * H.retourImages.length || H.t >= RETOUR && (d || presse)) {
        H.combo = 0;
        H.enchaine = 0;
        changer(H, "garde", "r-garde");
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
        prendre();
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
  H.pv -= 1;
  H.invul = 1.1;
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
    sfx("glas", 0.3);
    H.vx = dirCoup * 60;
    H.y = 0;
  } else if (S["r-k-chute"] && (H.y > 0 || source.type === "lancier" || H.pv <= 2)) {
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
var ANIM = { sabreur: { marche: "marche", attaque: "attaque" }, lancier: { marche: "marche", attaque: "attaque" }, ninja: { marche: "course", attaque: "lancer" } };
var PREFIXE = { sabreur: "sa", lancier: "la", ninja: "ni" };
var nomAnim = (e, g) => `r-${PREFIXE[e.type]}-${ANIM[e.type][g] || g}`;
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
}
function changer2(e, etat, g) {
  const avant2 = e.anim, kAvant = e.k;
  if (avant2 && g && nomAnim(e, g) !== avant2 && etat !== "frappe") e.fondu = { anim: avant2, k: kAvant, dir: e.dir, t: 0 };
  e.etat = etat;
  e.t = 0;
  if (g) e.anim = nomAnim(e, g);
  if ((etat === "garde" || etat === "approche") && avant2 && avant2 !== e.anim) {
    const k = plusProche(avant2, kAvant, e.anim);
    e.t = etat === "garde" ? k / 7 : k / (e.cfg.ipsMarche * vitesseJeu());
  }
}
var vivant = (e) => e.etat !== "mort";
var vitesseJeu = () => 1 + Math.min(0.5, J.chrono / 300);
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
    e.eclair = Math.max(0, e.eclair - dt);
    if (e.fondu && (e.fondu.t += dt) > 0.12) e.fondu = null;
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
        if (e.etat === "bond") changer2(e, "garde", "garde");
      }
    }
    switch (e.etat) {
      case "approche":
      case "garde": {
        e.feinte = e.feinte ?? rand(0, 6.28);
        const porteeReelle = cfg.portee + cfg.bond * cfg.frappe * 0.7 - 4;
        let voulu = Math.min(cfg.distance, porteeReelle - 12) + e.rang * 58 + (e.rang > 0 ? Math.sin(J.temps * 1.3 + e.feinte) * 14 : 0);
        if (e.type === "ninja") {
          for (const o of J.ennemis) if (o.type !== "ninja" && o.etat !== "mort" && Math.sign(o.x - H.x) === Math.sign(e.x - H.x)) voulu = Math.max(voulu, Math.abs(o.x - H.x) + 60);
        }
        const bouche = e.type !== "ninja" && J.ennemis.some((o) => o !== e && o.type !== "ninja" && o.etat !== "mort" && Math.sign(o.x - H.x) === Math.sign(e.x - H.x) && Math.abs(o.x - H.x) < Math.abs(e.x - H.x) && Math.abs(e.x - H.x) - Math.abs(o.x - H.x) < 46);
        e.recharge -= dt;
        if (e.type === "ninja" && dist < 120 && e.y === 0 && H.pv > 0) {
          fuir(e);
          break;
        }
        const stable = e.t > 0.3;
        if (dist > voulu + 10 && bouche) {
          e.vx = 0;
          if (e.etat !== "garde" && stable) changer2(e, "garde", "garde");
        } else if (dist > voulu + 10) {
          const fuit = H.vx * Math.sign(H.x - e.x) > 40;
          e.vx = e.dir * cfg.vitesse * v * (dist > 220 || fuit ? 1.7 : 1);
          if (e.etat !== "approche" && stable) changer2(e, "approche", "marche");
        } else if (dist < voulu - 14) {
          e.vx = -e.dir * cfg.vitesse * 0.6;
          if (e.etat !== "approche" && stable) changer2(e, "approche", "marche");
        } else if (stable || e.etat === "garde") {
          e.vx = 0;
          if (e.etat !== "garde") changer2(e, "garde", "garde");
        }
        if (e.etat === "garde") e.vx = 0;
        const aPortee = e.type === "ninja" ? dist < 330 && e.x > 10 && e.x < ARENE - 10 : dist < porteeReelle;
        const libre = e.type === "ninja" ? J.ennemis.filter((o) => o.type === "ninja" && o.jeton).length < 1 : attaquants < J.jetons;
        const ouverte = e.type !== "ninja" && ouverture(H);
        if (aPortee && (e.recharge <= 0 || ouverte) && libre && (e.rang === 0 || e.type === "ninja") && H.pv > 0 && H.etat !== "fureur" && !(J.lent > 0)) {
          e.jeton = true;
          attaquants++;
          e.vx = 0;
          changer2(e, "armer", "attaque");
          e.touche = false;
          e.tempo = ouverte ? 0.6 : Math.random() < 0.3 ? 1.6 : 1;
          e.relance = !ouverte && e.type === "sabreur" && Math.random() < 0.3;
        }
        break;
      }
      case "armer": {
        e.vx = 0;
        if (e.t >= cfg.armer * (e.tempo || 1) / v) {
          changer2(e, "frappe");
          if (e.type === "ninja") lancer(e);
          else sfx("lame");
        }
        break;
      }
      case "frappe": {
        e.vx = e.dir * cfg.bond;
        if (e.type !== "ninja" && !e.touche) {
          const devant = (H.x - e.x) * e.dir;
          if (devant > -10 && devant < cfg.portee && H.y < cfg.sautable) {
            e.touche = true;
            const r = blesserHeroine(e, e.dir);
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
        if (e.t >= cfg.frappe) changer2(e, "repos");
        break;
      }
      case "repos": {
        e.vx *= 1 - 8 * dt;
        if (e.relance && e.t >= cfg.repos * 0.45 / v && Math.abs(H.x - e.x) < porteeReelleDe(e) && H.pv > 0) {
          e.relance = false;
          e.tempo = 0.7;
          changer2(e, "armer", "attaque");
          e.touche = false;
          break;
        }
        if (e.t >= cfg.repos / v) {
          e.jeton = false;
          e.relance = false;
          e.recharge = rand(0.8, 2.2) / v;
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
        if (e.t > 0.35) changer2(e, "garde", "garde");
        break;
      }
      case "bond":
        break;
      case "mort": {
        e.vx *= 1 - 5 * dt;
        if (e.t * 10 >= nbImages(e.anim) + 3) {
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
    const n = nbImages(e.anim), f = e.cfg;
    const a = Math.max(1, Math.round(n * 0.4)), b = Math.max(a + 1, Math.round(n * 0.7));
    if (e.etat === "armer") e.k = Math.min(a - 1, Math.floor(e.t * Math.max(8, a / (f.armer / v))));
    else if (e.etat === "frappe") e.k = Math.min(b - 1, a + Math.floor(e.t * 18));
    else if (e.etat === "repos") {
      const k = b + Math.floor(e.t * 12);
      if (k < n && e.anim === nomAnim(e, "attaque")) e.k = k;
      else {
        if (e.anim !== nomAnim(e, "garde")) {
          e.fondu = { anim: e.anim, k: e.k, dir: e.dir, t: 0 };
          e.anim = nomAnim(e, "garde");
          e.tg = plusProche(e.fondu.anim, e.fondu.k, e.anim) / 7;
        }
        e.tg += dt;
        e.k = Math.floor(e.tg * 7) % nbImages(e.anim);
      }
    } else if (e.etat === "brise" || e.etat === "bloque") e.k = Math.min(n - 1, 1);
    else if (e.etat === "mort") e.k = Math.min(n - 1, Math.floor(e.t * 10));
    else if (e.etat === "bond") e.k = Math.min(n - 1, Math.floor(e.t * 12));
    else if (e.etat === "approche") {
      const k = Math.floor(e.t * f.ipsMarche * v) % n;
      e.k = Math.sign(e.vx) === -e.dir ? n - 1 - k : k;
    } else e.k = Math.floor(e.t * 7) % n;
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
  e.vy = -460;
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
  if (e.type === "sabreur" && (e.etat === "garde" || e.etat === "approche") && e.dir === -H.dir && !coup.tranche && Math.random() < e.cfg.bloque + Math.min(0.25, J.chrono / 600)) {
    changer2(e, "bloque", "garde");
    e.vx = H.dir * 140;
    etincelles(e.x - H.dir * 16, SOL - 70, 16);
    sfx("fer");
    J.gel = 0.07;
    H.x -= H.dir * 10;
    return;
  }
  const sens = coup.coupe || "lateral";
  tuer(e, sens === "vertical" ? "fend" : sens === "estoc" ? "transperce" : sens === "pied" ? "coupe" : Math.random() < 0.4 ? "decapite" : "tranche", H.dir);
  J.gel = coup.tranche ? 0.11 : 0.06;
  if (coup.tranche) J.secousse = Math.max(J.secousse, 0.14);
}
function tuer(e, maniere, dirH) {
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
  J.gel = Math.max(J.gel, 0.1);
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
    if (!(repos ? dessinerRespire(e.anim, e.x - cam, SOL - e.y, e.dir, J.temps + e.id * 0.7) : dessiner(e.anim, e.k, e.x - cam, SOL - e.y, e.dir, { blanc }))) {
      J.ctx.fillStyle = "#111";
      J.ctx.fillRect(Math.round(e.x - cam - 12), Math.round(SOL - e.y - 110), 24, 110);
    }
    if (e.fondu && !blanc) dessinerFondu(e.fondu.anim, e.fondu.k, e.x - cam, SOL - e.y, e.fondu.dir, 1 - e.fondu.t / 0.12);
    if (e.etat === "armer") {
      const f = e.t / (e.cfg.armer * (e.tempo || 1) / vitesseJeu());
      if (f > 0.55) eclat(e.x - cam + e.dir * (e.type === "lancier" ? 40 : 26), SOL - e.y - hauteur(e.anim, e.k) * 0.72, (f - 0.55) / 0.45);
    }
  }
  for (const p of J.projectiles) dessinerShuriken(p, cam);
}

// src/js/directeur.js
function nouveauDirecteur() {
  J.chrono = 0;
  J.prochain = 1.2;
  J.vague = 45;
  J.jetons = 1;
  J.respire = 0;
}
function majDirecteur(dt) {
  if (J.majDirecteurOff) return;
  const t = J.chrono += dt;
  J.jetons = t < 50 ? 1 : t < 150 ? 2 : 3;
  const vivants = J.ennemis.filter((e) => e.etat !== "mort").length;
  const plafond = Math.min(10, 2 + Math.floor(t / 22));
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
  J.prochain = Math.max(0.8, 3 - t / 70) * rand(0.7, 1.3);
  const g = J.ennemis.filter((e) => e.x < J.H.x).length, d = J.ennemis.length - g;
  const vide = g === 0 !== (d === 0);
  apparaitre(choisir(t), vide ? g === 0 ? -1 : 1 : Math.random() < 0.7 ? g <= d ? -1 : 1 : Math.random() < 0.5 ? -1 : 1);
}
function choisir(t) {
  const n = (type) => J.ennemis.filter((e) => e.type === type).length;
  const r = Math.random();
  if (t > 40 && r < 0.2 && n("ninja") < 2) return "ninja";
  if (t > 20 && r < 0.45 && n("lancier") < 3) return "lancier";
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
  const cle = s + "|" + couleur + "|" + k + "|" + style;
  let c = cacheTexte.get(cle);
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
  cacheTexte.set(cle, c);
  return c;
}
function texte(s, x, y, couleur = OS, k = 1, style = "ombre", aligne = "gauche") {
  const c = rendreTexte(s, couleur, k, style);
  const lx = aligne === "centre" ? x - Math.floor(c.width / 2) : aligne === "droite" ? x - c.width : x;
  ctx.drawImage(c, Math.round(lx), Math.round(y - 2 * k));
}

// src/js/interface.js
var portrait2 = null;
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
  texte(String(J.tues), J.W - 14, 12, OS, 3, "ombre", "droite");
  const m = Math.floor(J.chrono / 60), s = Math.floor(J.chrono % 60);
  texte(`${m}:${String(s).padStart(2, "0")}`, J.W - 14, 38, BRUME, 1, "ombre", "droite");
  if (J.serie >= 3 && J.serieT > 0) texte(`${J.serie} D'UN TRAIT`, J.W - 14, 52, SANG[4], 1, "ombre", "droite");
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
function ecranTitre() {
  voile(0.35);
  const L = S.logo;
  if (L) ctx.drawImage(L.img, Math.round(J.W / 2 - L.w / 2), Math.max(6, 132 - L.h));
  else {
    texte("LADY SNOWBLOOD", J.W / 2, 70, OS, 5, "ombre", "centre");
    ctx.fillStyle = SANG[3];
    ctx.fillRect(J.W / 2 - 150, 116, 300, 2);
  }
  texte("LA PLAINE ENNEIGÉE", J.W / 2, 146, BRUME, 1, "ombre", "centre");
  if (Math.floor(J.temps * 1.6) % 2 === 0) texte("APPUYER SUR X", J.W / 2, 178, OS, 2, "ombre", "centre");
  texte("X LÉGER  C FORT  ↓ PARADE  ↑ SAUT  X+C FUREUR", J.W / 2, 336, BRUME, 1, "ombre", "centre");
  if (record) texte(`RECORD : ${record}`, J.W / 2, 206, BRUME, 1, "ombre", "centre");
  if (erreur) texte(("ERREUR " + erreur).toUpperCase().slice(0, 100), 6, J.HAUT - 10, "#8a8a86", 1, "ombre");
}
var PROLOGUE = ["SON MARI EST MORT.", "LE CLAN EST VENU POUR ELLE.", "ELLE EN EMPORTERA QUELQUES-UNS AVEC ELLE."];
function prologue(t) {
  PROLOGUE.forEach((l, i) => {
    const a = Math.max(0, Math.min(1, (t - i * 1.1) * 2, (5.2 - t) * 1.5));
    if (a <= 0) return;
    ctx.globalAlpha = a;
    texte(l, J.W / 2, 96 + i * 20, i === 2 ? SANG[4] : OS, 2, "ombre", "centre");
    ctx.globalAlpha = 1;
  });
}
function ecranFin(t, nouveau) {
  voile(Math.min(0.55, t * 0.2));
  if (t < 1.2) return;
  texte(`ELLE EN A EMPORTÉ ${J.tues}`, J.W / 2, 90, OS, 3, "ombre", "centre");
  texte("AVEC ELLE.", J.W / 2, 124, SANG[4], 2, "ombre", "centre");
  const m = Math.floor(J.chrono / 60), s = Math.floor(J.chrono % 60);
  texte(`TENU ${m}:${String(s).padStart(2, "0")}    PARADES PARFAITES ${J.parfaites}    PLUS LONGUE SÉRIE ${J.meilleureSerie}`, J.W / 2, 164, BRUME, 1, "ombre", "centre");
  texte(nouveau ? "NOUVEAU RECORD" : `RECORD : ${lireRecord()}`, J.W / 2, 184, nouveau ? OS : BRUME, 1, "ombre", "centre");
  if (t > 2.2 && Math.floor(t * 1.6) % 2 === 0) texte("X POUR RECOMMENCER", J.W / 2, 230, OS, 2, "ombre", "centre");
}
function ecranPause() {
  voile(0.5);
  texte("PAUSE", J.W / 2, 160, OS, 3, "ombre", "centre");
}

// src/js/main.js
var VITESSE = 1.25;
J.ctx = ctx;
J.temps = 0;
J.gel = 0;
J.lent = 0;
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
    image(tms);
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
function image(tms) {
  const debut = performance.now();
  const reel = Math.min(0.05, (tms - avant) / 1e3 || 0);
  avant = tms;
  J.temps += reel;
  const A = J.appuis;
  const E = { L: tenu("left"), R: tenu("right"), U: tenu("up"), parade: tenu("down"), bas: tenu("down"), sabre: tenu("sabre"), fort: tenu("fort"), appuis: A };
  if (J.etat === "titre" && (A.has("sabre") || A.has("fort"))) {
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
    if (J.H && J.H.etat === "garde" && J.H.pv > 0 && (J.souffleT = (J.souffleT ?? 2) - reel) <= 0) {
      souffler(AMB, J.H.x - J.cam + J.H.dir * 14, SOL - J.H.y - 104, J.H.dir);
      J.souffleT = 2.2 + Math.random();
    }
    if (dt > 0) {
      if (J.etat === "prologue") {
        majHeroine(dt, { ...E, appuis: /* @__PURE__ */ new Set() });
        if (J.etatT > 4.2) {
          J.etat = "jeu";
          J.etatT = 0;
        }
      } else if (J.etat === "jeu" || J.etat === "fin") {
        majHeroine(dt, J.etat === "jeu" ? E : { appuis: /* @__PURE__ */ new Set() });
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
  A.clear();
  if (J.H) J.cam += (clamp(J.H.x - J.W / 2, 0, ARENE - J.W) - J.cam) * Math.min(1, reel * 5);
  dessiner2();
  if (ESSAI) {
    (J.mesures ||= []).push(performance.now() - debut);
    if (J.mesures.length > 600) J.mesures.shift();
  }
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
    if (J.etat === "fin") ecranFin(J.etatT, J.nouveauRecord);
  }
  if (J.etat === "jeu" && enPause()) ecranPause();
  if (!S["r-garde"]) texte("IMAGES ABSENTES : LANCER  python3 outils/rotoscoper.py monter garde ga", J.W / 2, 20, SANG[4], 1, "ombre", "centre");
}
window.__lady = () => ({ etat: J.etat, x: J.H && Math.round(J.H.x), pv: J.H?.pv, h: J.H?.etat, anim: J.H?.anim, k: J.H?.k, fureur: J.H?.fureur, tues: J.tues, ennemis: J.ennemis.map((e) => `${e.type}:${e.etat}:${Math.round(e.x)}`), chrono: J.chrono });
if (ESSAI) window.__essai = {
  J,
  S,
  apparaitre,
  tuer,
  jouer: nouvellePartie,
  memoire,
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
    image(avant + s * 1e3);
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
    J.H.pv = 999;
    J.H.x = ARENE / 2;
    J.cam = (ARENE - J.W) / 2;
  },
  blesser(dir = 1) {
    blesserHeroine({ x: J.H.x + dir * 40, type: "sabreur" }, -dir);
  },
  etat: () => ({
    etat: J.H.etat,
    anim: J.H.anim,
    k: J.H.k,
    x: J.H.x,
    y: J.H.y,
    cam: J.cam,
    dir: J.H.dir,
    ennemi: J.ennemis[0] ? { type: J.ennemis[0].type, etat: J.ennemis[0].etat, anim: J.ennemis[0].anim, k: J.ennemis[0].k, x: J.ennemis[0].x, y: J.ennemis[0].y, dir: J.ennemis[0].dir } : null
  })
};
disposer();
var AMB = creerAmbiance(J.W, J.HAUT, SOL);
nouvelleHeroine();
await chargerSprites();
assemblerHeroine();
preparerSouillures(["r-garde", "r-course", "r-marche", "r-coup-leger", "r-estoc", "r-coup-fort", "r-k-combo2", "r-k-final"], [3]);
requestAnimationFrame(boucle);
export {
  noterErreur
};
//# sourceMappingURL=jeu.js.map

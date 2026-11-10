/* =========================================================
   ASADO RAPEL — Kia Morning grafito (SVG vista lateral)
   window.kiaSVG(id) devuelve el SVG como texto; "id" evita
   que los degradados choquen si hay más de un auto en la página.
   ========================================================= */
(() => {
  "use strict";

  // rayos de las llantas (5 rayos)
  const spokes = (cx, cy) => Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * Math.PI / 180;
    return `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * 10).toFixed(1)}" y2="${(cy + Math.sin(a) * 10).toFixed(1)}" />`;
  }).join("");

  const wheel = (id, cx, cy) => `
    <g class="kia__wheel">
      <circle cx="${cx}" cy="${cy}" r="17" fill="#141414" />
      <circle cx="${cx}" cy="${cy}" r="15.5" fill="none" stroke="#2a2a2a" stroke-width="1.5" />
      <circle cx="${cx}" cy="${cy}" r="11" fill="url(#${id}-rim)" />
      <g class="kia__spokes">${spokes(cx, cy)}</g>
      <circle cx="${cx}" cy="${cy}" r="3.2" fill="#3a3f45" />
    </g>`;

  window.kiaSVG = (id = "kia") => `
<svg class="kia" viewBox="0 0 240 112" role="img" aria-label="Kia Morning grafito">
  <defs>
    <linearGradient id="${id}-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9097a0" />
      <stop offset=".38" stop-color="#6b7279" />
      <stop offset=".7" stop-color="#53585f" />
      <stop offset="1" stop-color="#3a3e44" />
    </linearGradient>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#34424e" />
      <stop offset=".55" stop-color="#18222b" />
      <stop offset="1" stop-color="#0c1218" />
    </linearGradient>
    <radialGradient id="${id}-rim">
      <stop offset="0" stop-color="#eef0f2" />
      <stop offset=".7" stop-color="#a3aab1" />
      <stop offset="1" stop-color="#5d636a" />
    </radialGradient>
    <linearGradient id="${id}-beam" x1="0" x2="1">
      <stop offset="0" stop-color="rgba(255,240,200,.5)" />
      <stop offset="1" stop-color="rgba(255,240,200,0)" />
    </linearGradient>
  </defs>

  <ellipse cx="120" cy="104" rx="104" ry="5.5" fill="rgba(0,0,0,.45)" />
  <polygon class="kia__beam" points="226,64 330,48 330,92" fill="url(#${id}-beam)" />
  <g class="kia__puffs">
    <circle class="kia__puff" cx="14" cy="90" r="5" />
    <circle class="kia__puff" cx="14" cy="90" r="5" />
    <circle class="kia__puff" cx="14" cy="90" r="5" />
  </g>

  <!-- fondo oscuro de los tapabarros -->
  <circle cx="52" cy="88" r="20" fill="#16181b" />
  <circle cx="184" cy="88" r="20" fill="#16181b" />

  <g class="kia__body">
    <!-- antena -->
    <line x1="44" y1="24" x2="38" y2="13" stroke="#2a2d31" stroke-width="2" stroke-linecap="round" />
    <!-- carrocería: hatchback chico, techo alto, capó corto -->
    <path fill="url(#${id}-body)" stroke="#2a2d31" stroke-width="1.5" stroke-linejoin="round"
      d="M24 88 L19 80 Q15 72 19 62 L31 34 Q35 25 46 24 L128 22 Q146 21 158 32 L178 51
         Q210 53 221 60 Q229 66 228 78 L225 88 L205 88 A21 21 0 0 0 163 88 L73 88 A21 21 0 0 0 31 88 Z" />
    <!-- vidrios -->
    <path fill="url(#${id}-glass)" d="M38 52 L46 32 Q49 28 56 28 L127 27 Q141 27 150 35 L168 52 Z" />
    <rect x="60" y="28" width="6" height="25" fill="#2b2f34" />
    <rect x="104" y="27" width="7" height="26" fill="#2b2f34" />
    <path fill="rgba(255,255,255,.14)" d="M120 29 L134 29 L151 46 L141 46 Z" />
    <path fill="rgba(255,255,255,.08)" d="M70 29 L80 29 L72 50 L64 50 Z" />
    <!-- línea de cintura y línea de carácter -->
    <line x1="36" y1="53" x2="172" y2="53" stroke="#2a2d31" stroke-width="2" />
    <path d="M24 67 Q120 62 223 64" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.5" />
    <!-- brillo del techo -->
    <path d="M48 25 L126 23.5" stroke="rgba(255,255,255,.35)" stroke-width="2" stroke-linecap="round" />
    <!-- puertas (5 puertas) -->
    <g fill="none" stroke="rgba(0,0,0,.42)" stroke-width="1.3">
      <path d="M108 53 L106 86" />
      <path d="M65 53 L67 76" />
      <path d="M167 53 Q167 70 162 82" />
    </g>
    <!-- manillas -->
    <rect x="88" y="58" width="12" height="3" rx="1.5" fill="#cfd4d8" />
    <rect x="144" y="58" width="12" height="3" rx="1.5" fill="#cfd4d8" />
    <!-- espejo -->
    <path d="M160 47 L172 45 Q177 46 175 52 L162 53 Z" fill="url(#${id}-body)" stroke="#2a2d31" stroke-width="1.2" />
    <!-- focos -->
    <path class="kia__light" d="M204 56 Q218 57 225 64 L214 66 Q206 62 204 56 Z" fill="#eaf6ff" />
    <path class="kia__tail" d="M19 62 L27 44 L31 45 L25 66 Z" fill="#d52b1e" />
    <!-- parachoques / zócalo / parrilla -->
    <path d="M73 83 L163 83 L163 88 L73 88 Z" fill="#2a2d31" />
    <path d="M205 80 L226 80 L225 88 L205 88 Z" fill="#2a2d31" />
    <path d="M18 78 L31 78 L31 88 L24 88 Z" fill="#2a2d31" />
    <path d="M219 70 L228 70 L227.5 77 L218 77 Z" fill="#1b1e21" />
    <!-- patente -->
    <rect x="17" y="68" width="5" height="9" rx="1" fill="#f2f2f2" />
  </g>

  ${wheel(id, 52, 86)}
  ${wheel(id, 184, 86)}
</svg>`;
})();

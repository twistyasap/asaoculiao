/* =========================================================
   ASADO RAPEL — efectos compartidos (brasas, confetti, toast, storage)
   Expone window.FX para index.html y confirmar.html
   ========================================================= */
(() => {
  "use strict";

  const isMobile = matchMedia("(max-width: 700px), (hover: none)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem("asadoRapel:" + key); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("asadoRapel:" + key, JSON.stringify(value)); } catch { /* sin storage */ }
    }
  };

  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* Brasas que suben por toda la pantalla.
     Optimización: el brillo de cada brasa se dibuja UNA vez en un sprite
     y después solo se copia (drawImage), en vez de crear un degradado por partícula por frame. */
  function initEmbers(canvasId = "embers") {
    const canvas = document.getElementById(canvasId);
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const SPRITE = 32;
    const sprites = [18, 28, 38].map(hue => {
      const c = document.createElement("canvas");
      c.width = c.height = SPRITE;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
      grad.addColorStop(0, `hsla(${hue}, 100%, 75%, 1)`);
      grad.addColorStop(.25, `hsla(${hue}, 100%, 60%, .8)`);
      grad.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, SPRITE, SPRITE);
      return c;
    });

    let w = 0, h = 0;
    const particles = [];
    const spawn = (anyY) => ({
      x: Math.random() * w,
      y: anyY ? Math.random() * h : h + Math.random() * 60,
      size: (Math.random() * 2.6 + .6) * 8,
      vy: Math.random() * 1.2 + .4, vx: (Math.random() - .5) * .6,
      life: 1, decay: Math.random() * .004 + .002,
      sprite: sprites[(Math.random() * sprites.length) | 0],
      wobble: Math.random() * Math.PI * 2
    });

    const resize = () => {
      w = canvas.width = innerWidth;   // resolución 1x a propósito: son brasas difusas
      h = canvas.height = innerHeight;
    };
    resize();
    let resizeT;
    addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(resize, 150); });

    const count = isMobile ? 32 : Math.min(80, Math.floor(innerWidth / 18));
    for (let i = 0; i < count; i++) particles.push(spawn(true));

    let last = performance.now();
    (function loop(now) {
      // dt normalizado a 60fps: misma velocidad en pantallas de 120Hz o si baja el framerate
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobble += .05 * dt;
        p.x += (p.vx + Math.sin(p.wobble) * .4) * dt;
        p.y -= p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0 || p.y < -20) { particles[i] = spawn(false); continue; }
        ctx.globalAlpha = p.life;
        ctx.drawImage(p.sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })(last);
  }

  /* Confetti de choris, fuego y chelas (emojis pre-renderizados en sprites) */
  const confetti = (() => {
    let canvas, ctx, pieces = [], running = false;
    const emojis = ["🔥", "🌭", "🥩", "🍺", "🚗", "🎉", "🌽"];
    const BASE = 40;
    const cache = {};
    const MAX = isMobile ? 90 : 180;

    const sprite = e => {
      if (cache[e]) return cache[e];
      const c = document.createElement("canvas");
      c.width = c.height = BASE + 8;
      const g = c.getContext("2d");
      g.font = `${BASE}px serif`;
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(e, c.width / 2, c.height / 2 + 2);
      return (cache[e] = c);
    };

    const ensure = () => {
      if (canvas) return true;
      canvas = document.getElementById("confetti");
      if (!canvas) return false;
      ctx = canvas.getContext("2d");
      const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
      resize();
      addEventListener("resize", resize);
      return true;
    };

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.vy += .25; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.setTransform(Math.cos(p.rot) * p.s, Math.sin(p.rot) * p.s, -Math.sin(p.rot) * p.s, Math.cos(p.rot) * p.s, p.x, p.y);
        ctx.drawImage(p.img, -p.img.width / 2, -p.img.height / 2);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      pieces = pieces.filter(p => p.y < canvas.height + 60);
      if (pieces.length) requestAnimationFrame(frame);
      else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }

    return (x = innerWidth / 2, y = innerHeight / 2, amount = 60) => {
      if (!ensure() || reducedMotion) return;
      amount = Math.min(amount, MAX - pieces.length, isMobile ? Math.ceil(amount * .6) : amount);
      for (let i = 0; i < amount; i++) {
        pieces.push({
          x, y,
          vx: (Math.random() - .5) * 16, vy: Math.random() * -16 - 4,
          rot: Math.random() * 6, vr: (Math.random() - .5) * .3,
          s: (18 + Math.random() * 18) / BASE,
          img: sprite(emojis[(Math.random() * emojis.length) | 0])
        });
      }
      if (!running && pieces.length) { running = true; requestAnimationFrame(frame); }
    };
  })();

  window.FX = { store, toast, initEmbers, confetti, isMobile, reducedMotion };
})();

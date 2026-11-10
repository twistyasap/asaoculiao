/* =========================================================
   ASADO RAPEL — lógica y animaciones
   ========================================================= */
(() => {
  "use strict";

  /* ---------- DATOS ---------- */
  const EVENT_DATE = new Date("2026-11-28T09:30:00-03:00");

  const CREW = [
    { name: "GABO",       avatar: "🧑‍✈️", role: "Chofer del Kia Morning",     car: "Auto 1", skill: "Maneja con una mano y la otra en el chori.", stats: { parrilla: 6, carrete: 8, puntualidad: 9 } },
    { name: "10GO",       avatar: "😎",   role: "Copiloto · pasa los cambios", car: "Auto 1", skill: "Gabo maneja, 10GO pasa los cambios. Dupla inseparable.", stats: { parrilla: 5, carrete: 10, puntualidad: 4 } },
    { name: "MOYA",       avatar: "🧠",   role: "Organizador / tesorero", car: "Auto 1", skill: "Hizo esta web. Cobra las lucas sin piedad.",   stats: { parrilla: 7, carrete: 8, puntualidad: 8 } },
    { name: "FRANQUITO",  avatar: "🔥",   role: "Maestro parrillero",    car: "Auto 1", skill: "Prende el fuego con una hoja de diario y fe.",  stats: { parrilla: 10, carrete: 7, puntualidad: 6 } },
    { name: "LORO",       avatar: "🦜",   role: "Encargado del pebre",   car: "Auto 2", skill: "No para de hablar. Pero el pebre le queda top.", stats: { parrilla: 6, carrete: 9, puntualidad: 5 } },
    { name: "MARTO",      avatar: "💪",   role: "Jefe del hielo",        car: "Auto 2", skill: "Carga 3 bolsas de hielo y la cooler a la vez.", stats: { parrilla: 5, carrete: 8, puntualidad: 7 } },
    { name: "CHICO DENI", avatar: "🤙",   role: "Animador / fotógrafo",  car: "Auto 2", skill: "Saca las fotos que nadie quiere que existan.",  stats: { parrilla: 4, carrete: 10, puntualidad: 5 } },
    { name: "EL 8VO",     avatar: "🥷",   role: "Confirmado misterioso", car: "¿?",     skill: "Dijo que va. Nadie sabe en qué auto.",          stats: { parrilla: 5, carrete: 7, puntualidad: 3 } }
  ];

  const WANTED = [
    { id: "gaspi", name: "GASPI",      avatar: "🕵️", info: "Visto por última vez diciendo “ya, después te confirmo”.", reward: "Recompensa: 1 choripán", rot: "-3deg" },
    { id: "eche",  name: "ECHEVERRÍA", avatar: "👤", info: "Leyó el grupo. Dos tickets azules. Cero respuesta.",          reward: "Recompensa: 1 terremoto", rot: "2deg" }
  ];

  const SHOPPING = [
    { text: "Carbón (2 sacos)", qty: "2" },
    { text: "Choripanes", qty: "40" },
    { text: "Lomo vetado / punta ganso", qty: "4 kg" },
    { text: "Marraqueta", qty: "30" },
    { text: "Tomate, cebolla, cilantro (pebre)", qty: "1 bolsa" },
    { text: "Choclos", qty: "10" },
    { text: "Hielo", qty: "4 bolsas" },
    { text: "Bebidas", qty: "6" },
    { text: "Cervezas (para los que no manejan)", qty: "2 cajas" },
    { text: "Platos, vasos y servilletas", qty: "1 pack" },
    { text: "Encendedor + diario", qty: "✔" },
    { text: "Bloqueador (el sol del campo pega)", qty: "1" }
  ];

  const COSTS = [
    { key: "carne", label: "🥩 Carne", value: 60000 },
    { key: "choris", label: "🌭 Choris + pan", value: 25000 },
    { key: "carbon", label: "⚫ Carbón", value: 12000 },
    { key: "bebida", label: "🍺 Bebestibles", value: 45000 },
    { key: "verdura", label: "🥗 Pebre + choclos", value: 10000 },
    { key: "bencina", label: "⛽ Bencina (2 autos)", value: 30000 },
    { key: "peaje", label: "🛣️ Peajes (camino viejo)", value: 0 },
    { key: "hielo", label: "🧊 Hielo + varios", value: 8000 }
  ];

  const TIMELINE = [
    { time: "09:30", icon: "📍", title: "Juntada en Duoc UC Antonio Varas 666", desc: "El que llega tarde paga el hielo." },
    { time: "10:00", icon: "🚗", title: "Salida por el Camino Viejo a Melipilla", desc: "Sin autopista ni peaje. La Nave de Gabo adelante, El Incógnito atrás (si aparece)." },
    { time: "10:45", icon: "🥖", title: "Parada en el camino", desc: "Pan amasado, empanadas de horno y hielo." },
    { time: "11:30", icon: "🏡", title: "Llegada al Campito Querido", desc: "Instalarse, abrir la cooler, reconocer el terreno." },
    { time: "13:00", icon: "🔥", title: "Se prende el fuego", desc: "Franquito al mando. Nadie toca la parrilla." },
    { time: "14:00", icon: "🌭", title: "Choripanes de entrada", desc: "Con harto pebre del Loro." },
    { time: "15:30", icon: "🥩", title: "La carne", desc: "El momento sagrado. Silencio." },
    { time: "17:00", icon: "🏐", title: "Pichanga / siesta bajo el parrón", desc: "Elige tu propia aventura." },
    { time: "19:30", icon: "🌅", title: "Atardecer en el campito", desc: "Foto grupal obligatoria (Chico Deni)." },
    { time: "21:00", icon: "🏠", title: "Vuelta a Santiago", desc: "Choferes sobrios. Sin excepciones." }
  ];

  /* ---------- UTILIDADES ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const clp = n => "$" + Math.round(n).toLocaleString("es-CL");

  const { store, toast, initEmbers, confetti } = window.FX;

  /* ---------- COUNTDOWN ---------- */
  function initCountdown() {
    const els = { d: $("#cd-days"), h: $("#cd-hours"), m: $("#cd-mins"), s: $("#cd-secs") };
    const set = (el, val) => {
      const v = String(val).padStart(2, "0");
      if (el.textContent !== v) {
        el.textContent = v;
        el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
      }
    };
    const update = () => {
      let diff = Math.max(0, EVENT_DATE - Date.now());
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5);  diff -= h * 36e5;
      const m = Math.floor(diff / 6e4);   diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      set(els.d, d); set(els.h, h); set(els.m, m); set(els.s, s);
      if (EVENT_DATE - Date.now() <= 0) $(".hero__date").textContent = "🔥 ¡¡ES HOY, SE PRENDE EL FUEGO!! 🔥";
    };
    update();
    setInterval(update, 1000);
  }

  /* ---------- REVEAL + CONTADORES ---------- */
  function animateCount(el) {
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1500;
    (function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }

  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        $$("[data-count]", e.target).forEach(animateCount);
        if (e.target.matches("[data-count]")) animateCount(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: .15 });
    $$(".reveal").forEach(el => io.observe(el));
  }

  /* ---------- AUTO EN LA RUTA (SVG) ---------- */
  function initRouteCar() {
    const path = $("#road");
    const car = $("#route-car");
    if (!path || !car) return;
    // Kia Morning en miniatura (svg anidado, centrado sobre el camino)
    car.innerHTML = window.kiaSVG("kia-route")
      .replace('<svg class="kia"', '<svg class="kia" x="-50" y="-38" width="100" height="47" overflow="visible"');
    // precalcula los puntos una vez (getPointAtLength en cada frame es caro)
    const len = path.getTotalLength();
    const STEPS = 400;
    const pts = Array.from({ length: STEPS + 1 }, (_, i) => path.getPointAtLength((i / STEPS) * len));
    const box = path.closest(".route");
    let t = 0, raf = null, last = 0;

    function drive(now) {
      const dt = last ? Math.min(3, (now - last) / 16.67) : 1;
      last = now;
      t = (t + .0016 * dt) % 1;
      const i = Math.floor(t * STEPS);
      const p = pts[i], p2 = pts[Math.min(STEPS, i + 1)];
      const angle = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI;
      // el Kia mira a la derecha, igual que el sentido de la ruta
      car.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
      raf = requestAnimationFrame(drive);
    }
    // solo anima cuando está en pantalla
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) { last = 0; raf = requestAnimationFrame(drive); }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
    }).observe(box);
  }

  /* ---------- PAUSA DE ANIMACIONES FUERA DE PANTALLA ---------- */
  function initOffscreenPause() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle("is-off", !e.isIntersecting));
    }, { rootMargin: "150px 0px" });
    $$(".hero, .ticker, .section").forEach(el => io.observe(el));
  }

  /* ---------- AUTO INCÓGNITO ---------- */
  function initMysteryCar() {
    const card = $("#mystery-card");
    const btn = $("#btn-lend");
    const reset = $("#btn-lend-reset");
    const owner = $("#mystery-owner");
    const badge = $("#mystery-badge");
    const driverSeat = $('.seats[data-car="2"] .seat--driver');
    const statCars = $("#stat-cars");
    const statBar = $("#stat-cars-bar");
    const statCard = statCars.closest(".stat");
    const alertBox = $(".alert");
    const alertText = alertBox.querySelector("p");
    const originalAlert = alertText.innerHTML;

    function render(name, celebrate) {
      if (name) {
        card.classList.add("found");
        owner.textContent = `“La Nave de ${name}”`;
        badge.textContent = "¡APARECIÓ!";
        badge.className = "badge badge--ok";
        driverSeat.innerHTML = `${name} <em>🧑‍✈️</em>`;
        driverSeat.classList.remove("seat--empty");
        driverSeat.classList.add("seat--filled");
        statCars.dataset.count = 2;
        statCars.textContent = 2;
        statBar.style.setProperty("--w", "100%");
        statCard.classList.add("ok");
        alertBox.classList.add("solved");
        alertText.innerHTML = `<b>PROBLEMA RESUELTO:</b> ${name} presta el auto. Todos al campito. 🙌`;
        btn.hidden = true; reset.hidden = false;
        if (celebrate) {
          const r = btn.getBoundingClientRect();
          confetti(r.left + r.width / 2, r.top, 90);
          toast(`🔥 ¡${name} salvó el asado! Leyenda.`);
        }
      } else {
        card.classList.remove("found");
        owner.textContent = "“El Incógnito”";
        badge.textContent = "SE BUSCA";
        badge.className = "badge badge--danger";
        driverSeat.innerHTML = "¿¿CHOFER??";
        driverSeat.classList.add("seat--empty");
        driverSeat.classList.remove("seat--filled");
        statCars.dataset.count = 1;
        statCars.textContent = 1;
        statBar.style.setProperty("--w", "50%");
        statCard.classList.remove("ok");
        alertBox.classList.remove("solved");
        alertText.innerHTML = originalAlert;
        btn.hidden = false; reset.hidden = true;
      }
    }

    btn.addEventListener("click", () => {
      const name = (prompt("¿Quién es el héroe que presta el auto?") || "").trim().toUpperCase().slice(0, 18);
      if (!name) { toast("Ya po, ¿quién? 😤"); return; }
      store.set("lender", name);
      render(name, true);
    });
    reset.addEventListener("click", () => {
      store.set("lender", null);
      render(null);
      toast("Volvimos a 1 auto... 😬");
    });

    render(store.get("lender", null), false);
  }

  /* ---------- CREW ---------- */
  function initCrew() {
    const grid = $("#crew-grid");
    grid.innerHTML = CREW.map((m, i) => `
      <div class="member reveal" style="transition-delay:${i * 70}ms" tabindex="0">
        <div class="member__inner">
          <div class="member__face">
            <div class="member__avatar" style="animation-delay:${i * -.3}s">${m.avatar}</div>
            <div class="member__name">${m.name}</div>
            <div class="member__role">${m.role}</div>
            <span class="member__car">${m.car}</span>
          </div>
          <div class="member__face member__face--back">
            <h4>${m.name}</h4>
            <p>${m.skill}</p>
            <div class="member__stats">
              ${Object.entries(m.stats).map(([k, v]) => `
                <label>${k}<meter min="0" max="10" value="${v}"></meter></label>`).join("")}
            </div>
          </div>
        </div>
      </div>`).join("");

    $$(".member", grid).forEach(card => {
      card.addEventListener("click", () => card.classList.toggle("flipped"));
      card.addEventListener("keydown", e => { if (e.key === "Enter") card.classList.toggle("flipped"); });
    });

    // Se busca
    const wanted = $("#wanted-grid");
    const confirmed = store.get("confirmed", {});
    wanted.innerHTML = WANTED.map(w => `
      <div class="poster reveal" data-id="${w.id}" style="--rot:${w.rot}">
        <h4>SE BUSCA</h4>
        <div class="poster__photo">${w.avatar}</div>
        <div class="poster__name">${w.name}</div>
        <p class="poster__info">${w.info}</p>
        <p class="poster__reward">${w.reward}</p>
        <button class="btn btn--fire">CONFIRMÓ ✅</button>
      </div>`).join("");

    const baseConfirmed = 8;
    const updateCounts = () => {
      const n = Object.values(confirmed).filter(Boolean).length;
      const c = $("#stat-confirmed"), p = $("#stat-pending");
      c.textContent = c.dataset.count = baseConfirmed + n;
      p.textContent = p.dataset.count = WANTED.length - n;
      c.closest(".stat").querySelector(".stat__bar i").style.setProperty("--w", `${((baseConfirmed + n) / 10) * 100}%`);
      p.closest(".stat").querySelector(".stat__bar i").style.setProperty("--w", `${((WANTED.length - n) / 10) * 100}%`);
      setPeople(baseConfirmed + n, false);
    };

    $$(".poster", wanted).forEach(poster => {
      const id = poster.dataset.id;
      const btn = $("button", poster);
      const apply = () => {
        poster.classList.toggle("confirmed", !!confirmed[id]);
        $("h4", poster).textContent = confirmed[id] ? "¡APARECIÓ!" : "SE BUSCA";
        btn.textContent = confirmed[id] ? "Se bajó ❌" : "CONFIRMÓ ✅";
      };
      btn.addEventListener("click", () => {
        confirmed[id] = !confirmed[id];
        store.set("confirmed", confirmed);
        apply();
        updateCounts();
        if (confirmed[id]) {
          const r = btn.getBoundingClientRect();
          confetti(r.left + r.width / 2, r.top, 50);
          toast(`🙌 ${WANTED.find(w => w.id === id).name} dio señales de vida`);
        } else {
          toast("Se bajó... clásico 🙄");
        }
      });
      apply();
    });

    // estado inicial sin pisar la animación de conteo
    const n = Object.values(confirmed).filter(Boolean).length;
    $("#stat-confirmed").dataset.count = baseConfirmed + n;
    $("#stat-pending").dataset.count = WANTED.length - n;
    initCrew.update = updateCounts;
  }

  /* ---------- PARRILLA ---------- */
  function initGrill() {
    const bbq = $("#bbq");
    const meats = $$(".meat", bbq);
    const phrases = ["¡Tsssss! 🔥", "¡Vuelta y vuelta!", "Ese chori está listo 🌭", "¡No la pinches que se seca!", "Aplausos pal asador 👏"];
    bbq.addEventListener("click", e => {
      const target = e.target.closest(".meat") || meats[Math.floor(Math.random() * meats.length)];
      target.classList.remove("flip"); void target.offsetWidth; target.classList.add("flip");
      toast(phrases[Math.floor(Math.random() * phrases.length)]);
    });
    // vueltas automáticas
    setInterval(() => {
      if (bbq.closest(".is-off") || document.hidden) return; // no trabaja si no se ve
      const m = meats[Math.floor(Math.random() * meats.length)];
      m.classList.remove("flip"); void m.offsetWidth; m.classList.add("flip");
    }, 2800);
  }

  function initShopping() {
    const list = $("#shop-list");
    const done = store.get("shop", {});
    list.innerHTML = SHOPPING.map((s, i) => `
      <li data-i="${i}" class="${done[i] ? "done" : ""}">
        <span class="check"></span>
        <span class="shop__text">${s.text}</span>
        <span class="shop__qty">${s.qty}</span>
      </li>`).join("");

    const update = () => {
      const total = SHOPPING.length;
      const n = Object.values(done).filter(Boolean).length;
      const pct = Math.round((n / total) * 100);
      $("#shop-bar").style.width = pct + "%";
      $("#shop-pct").textContent = pct + "%";
      return pct;
    };

    list.addEventListener("click", e => {
      const li = e.target.closest("li");
      if (!li) return;
      const i = li.dataset.i;
      done[i] = !done[i];
      li.classList.toggle("done", done[i]);
      store.set("shop", done);
      if (update() === 100 && done[i]) {
        confetti(innerWidth / 2, innerHeight / 2, 120);
        toast("🛒 ¡Todo comprado! A prender el fuego 🔥");
      }
    });
    update();
  }

  /* ---------- LUCAS ---------- */
  let people = 8;
  let recalc = () => {};
  function setPeople(n, notify = true) {
    people = Math.max(1, Math.min(20, n));
    $("#ppl-count").textContent = people;
    recalc(notify);
  }

  function initMoney() {
    const saved = store.get("costs", {});
    const rows = $("#money-rows");
    rows.innerHTML = COSTS.map(c => `
      <label class="money__row">
        <span>${c.label}</span>
        <input type="number" min="0" step="1000" data-key="${c.key}" value="${saved[c.key] ?? c.value}">
      </label>`).join("");

    const inputs = $$("input", rows);
    let lastEach = 0;

    recalc = (rain = true) => {
      const values = {};
      const total = inputs.reduce((acc, inp) => {
        const v = Math.max(0, +inp.value || 0);
        values[inp.dataset.key] = v;
        return acc + v;
      }, 0);
      store.set("costs", values);
      const each = total / people;
      $("#money-total").textContent = clp(total);
      const eachEl = $("#money-each");
      eachEl.textContent = clp(each);
      if (each !== lastEach) {
        eachEl.classList.remove("bump"); void eachEl.offsetWidth; eachEl.classList.add("bump");
        if (rain) coinRain();
      }
      lastEach = each;
    };

    inputs.forEach(inp => inp.addEventListener("input", () => recalc(false)));
    $("#ppl-minus").addEventListener("click", () => setPeople(people - 1));
    $("#ppl-plus").addEventListener("click", () => setPeople(people + 1));
    recalc(false);
  }

  function coinRain() {
    const box = $("#coins");
    for (let i = 0; i < 12; i++) {
      const c = document.createElement("span");
      c.className = "coin";
      c.textContent = Math.random() > .5 ? "💰" : "🪙";
      c.style.left = Math.random() * 100 + "%";
      c.style.animationDelay = Math.random() * .4 + "s";
      box.appendChild(c);
      setTimeout(() => c.remove(), 2000);
    }
  }

  /* ---------- ITINERARIO ---------- */
  function initTimeline() {
    const ol = $("#timeline");
    ol.innerHTML = TIMELINE.map((t, i) => `
      <li class="reveal" data-icon="${t.icon}" style="transition-delay:${i * 60}ms">
        <time>${t.time}</time><strong>${t.title}</strong>
        <p>${t.desc}</p>
      </li>`).join("");

    // marca el paso actual si es el día del asado
    const now = new Date();
    if (now.toDateString() === EVENT_DATE.toDateString()) {
      const mins = now.getHours() * 60 + now.getMinutes();
      let idx = -1;
      TIMELINE.forEach((t, i) => {
        const [h, m] = t.time.split(":").map(Number);
        if (h * 60 + m <= mins) idx = i;
      });
      if (idx >= 0) ol.children[idx].classList.add("now");
    }
  }

  /* ---------- RULETA ---------- */
  function initRoulette() {
    const canvas = $("#wheel");
    const ctx = canvas.getContext("2d");
    const names = CREW.map(c => c.name);
    const colors = ["#ff5e1a", "#d7263d", "#ffb627", "#3fae49", "#27c4d9", "#a83279", "#ff8c42", "#6a4c93"];
    const size = canvas.width, r = size / 2;
    const slice = (Math.PI * 2) / names.length;
    let rotation = 0, spinning = false;

    function draw() {
      ctx.clearRect(0, 0, size, size);
      names.forEach((n, i) => {
        const start = i * slice - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(r, r);
        ctx.arc(r, r, r - 4, start, start + slice);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = "#120d0b"; ctx.lineWidth = 3; ctx.stroke();

        ctx.save();
        ctx.translate(r, r);
        ctx.rotate(start + slice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#120d0b";
        ctx.font = "20px 'Permanent Marker', cursive";
        ctx.fillText(n, r - 16, 7);
        ctx.restore();
      });
      ctx.beginPath(); ctx.arc(r, r, 26, 0, Math.PI * 2); ctx.fillStyle = "#120d0b"; ctx.fill();
      ctx.font = "26px serif"; ctx.textAlign = "center"; ctx.fillText("🔥", r, r + 9);
    }
    draw();
    if (document.fonts) document.fonts.ready.then(draw); // redibuja con la fuente marker

    $("#btn-spin").addEventListener("click", () => {
      if (spinning) return;
      spinning = true;
      const result = $("#roulette-result");
      result.classList.remove("show");
      result.innerHTML = "&nbsp;";
      rotation += 360 * (5 + Math.floor(Math.random() * 3)) + Math.random() * 360;
      canvas.style.transform = `rotate(${rotation}deg)`;
      setTimeout(() => {
        const deg = ((rotation % 360) + 360) % 360;
        const idx = Math.floor(((360 - deg) % 360) / (360 / names.length));
        result.textContent = `${names[idx]} → ${$("#roulette-mode").value}`;
        result.classList.add("show");
        const rect = canvas.getBoundingClientRect();
        confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);
        spinning = false;
      }, 4600);
    });
  }

  /* ---------- QR DE CONFIRMACIÓN ---------- */
  function initQR() {
    const box = $("#qr-code");
    const input = $("#qr-url");
    if (!box || typeof QRCode === "undefined") return;

    // URL por defecto: confirmar.html junto a esta página
    const local = new URL("confirmar.html", location.href).href;
    input.value = store.get("qrUrl", "") || local;
    if (location.protocol === "file:") $("#qr-warn").hidden = false;

    const render = () => {
      box.innerHTML = "";
      new QRCode(box, {
        text: input.value.trim() || local,
        width: 220, height: 220,
        colorDark: "#120d0b", colorLight: "#fff1dc",
        correctLevel: QRCode.CorrectLevel.M
      });
      $("#qr-link").href = input.value.trim() || local;
      box.classList.remove("qr-pop"); void box.offsetWidth; box.classList.add("qr-pop");
    };

    $("#qr-update").addEventListener("click", () => {
      store.set("qrUrl", input.value.trim());
      render();
      toast("QR actualizado 📲");
    });
    render();
  }

  /* ---------- PARALLAX DEL HERO ---------- */
  function initParallax() {
    const title = $(".hero__title");
    const hero = $(".hero");
    $(".fire-text").addEventListener("click", e => confetti(e.clientX, e.clientY, 40));
    if (FX.isMobile || FX.reducedMotion) return; // en el celu no hay mouse: nos ahorramos el trabajo

    // un solo cálculo por frame aunque el mouse dispare 200 eventos por segundo
    let mx = 0, my = 0, queued = false;
    addEventListener("mousemove", e => {
      if (hero.classList.contains("is-off")) return;
      mx = e.clientX; my = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const x = (mx / innerWidth - .5) * 20;
        const y = (my / innerHeight - .5) * 20;
        title.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    }, { passive: true });
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initOffscreenPause();
    const kiaGabo = $("#kia-gabo");
    if (kiaGabo && window.kiaSVG) kiaGabo.innerHTML = window.kiaSVG("kia-gabo");
    initEmbers();
    initCountdown();
    initCrew();
    initMysteryCar();
    initShopping();
    initGrill();
    initMoney();
    initTimeline();
    initRoulette();
    initQR();
    initParallax();
    initRouteCar();
    initReveal();
    initCrew.update && initCrew.update();
  });
})();

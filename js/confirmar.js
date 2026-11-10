/* =========================================================
   ASADO RAPEL — lógica de confirmación
   ========================================================= */
(() => {
  "use strict";
  const { store, toast, initEmbers, confetti } = window.FX;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const NAMES = [
    { n: "GASPI", wanted: true }, { n: "ECHEVERRÍA", wanted: true },
    { n: "FRANQUITO" }, { n: "10GO" }, { n: "GABO" }, { n: "MOYA" },
    { n: "LORO" }, { n: "CHICO DENI" }, { n: "MARTO" }
  ];
  const BRING = ["🥩 Carne", "🌭 Choris", "🍺 Chelas", "🧊 Hielo", "⚫ Carbón", "🥗 Pebre", "🍞 Pan", "🎵 Parlante", "🏐 Pelota", "😎 Puro carisma"];
  const NO_PHRASES = ["¡No se puede po!", "Atrápame si puedes 😜", "Nopo, vai igual", "El botón no quiere", "Mejor aprieta el otro 🔥", "¿En serio? 🤨"];
  const STEP_PROGRESS = { 1: 8, 2: 38, 3: 68, 4: 100, sad: 38 };

  const state = { name: "", going: null, car: null, bring: new Set() };

  /* ---------- navegación entre pasos ---------- */
  function goTo(step) {
    const current = $(".step.active");
    const next = $(`.step[data-step="${step}"]`);
    const pct = STEP_PROGRESS[step];
    $("#fuse-fill").style.width = pct + "%";
    $("#fuse-spark").style.left = pct + "%";
    $$(".who").forEach(el => (el.textContent = state.name));
    if (current === next) return;
    if (current) {
      current.classList.remove("active");
      current.classList.add("leaving");
      setTimeout(() => current.classList.remove("leaving"), 350);
    }
    setTimeout(() => next.classList.add("active"), current ? 300 : 0);
  }

  /* ---------- paso 1: nombre ---------- */
  function initNames() {
    const box = $("#name-chips");
    const other = $("#name-other");
    const btn = $("#btn-step1");
    box.innerHTML = NAMES.map((x, i) =>
      `<button class="chip ${x.wanted ? "chip--wanted" : ""}" style="animation-delay:${i * 60}ms" data-name="${x.n}">${x.n}</button>`
    ).join("");

    box.addEventListener("click", e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      $$(".chip", box).forEach(c => c.classList.remove("on"));
      chip.classList.add("on");
      other.value = "";
      state.name = chip.dataset.name;
      btn.disabled = false;
      if (chip.classList.contains("chip--wanted")) {
        toast(`¡${state.name} APARECIÓ! 😱`);
        const r = chip.getBoundingClientRect();
        confetti(r.left + r.width / 2, r.top, 30);
      }
    });

    other.addEventListener("input", () => {
      $$(".chip", box).forEach(c => c.classList.remove("on"));
      state.name = other.value.trim().toUpperCase();
      btn.disabled = !state.name;
    });

    btn.addEventListener("click", () => state.name && goTo(2));
  }

  /* ---------- paso 2: sí / no (el no se arranca) ---------- */
  function initYesNo() {
    const yes = $("#btn-yes");
    const no = $("#btn-no");
    const hint = $("#no-hint");
    let dodges = 0;

    const dodge = () => {
      dodges++;
      if (dodges > 6) return; // después de 6 intentos lo dejamos apretar
      const area = $("#yesno").getBoundingClientRect();
      const maxX = Math.max(40, area.width / 2 - 80);
      const x = (Math.random() * 2 - 1) * maxX;
      const y = (Math.random() * 2 - 1) * 70;
      no.style.transform = `translate(${x}px, ${y}px) rotate(${(Math.random() - .5) * 40}deg)`;
      hint.textContent = NO_PHRASES[Math.floor(Math.random() * NO_PHRASES.length)];
      yes.style.transform = `scale(${1 + dodges * .06})`;
    };
    no.addEventListener("mouseenter", dodge);
    no.addEventListener("touchstart", e => { if (dodges <= 6) { e.preventDefault(); dodge(); } }, { passive: false });

    yes.addEventListener("click", () => {
      state.going = true;
      const r = yes.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + r.height / 2, 70);
      toast("¡ESOOOO! 🔥🔥🔥");
      setTimeout(() => goTo(3), 500);
    });
    no.addEventListener("click", () => {
      if (dodges <= 6) return dodge();
      state.going = false;
      $("#btn-wsp-no").href = wspLink(`😢 ${state.name} no puede ir al asado en Rapel. Guárdenme un chori igual.`);
      goTo("sad");
    });
    $("#btn-regret").addEventListener("click", () => {
      state.going = true;
      confetti(innerWidth / 2, innerHeight / 2, 80);
      toast("¡Así me gusta! 💪");
      goTo(3);
    });
  }

  /* ---------- paso 3: auto + qué lleva ---------- */
  function initDetails() {
    const finish = $("#btn-finish");
    const check = () => { finish.disabled = !state.car; };

    $$(".car-opt").forEach(opt => opt.addEventListener("click", () => {
      $$(".car-opt").forEach(o => o.classList.remove("on"));
      opt.classList.add("on");
      state.car = opt.dataset.car;
      if (state.car === "si") {
        const r = opt.getBoundingClientRect();
        confetti(r.left + r.width / 2, r.top, 80);
        toast("🚨 ¡TENEMOS SEGUNDO AUTO! 🚨");
      }
      check();
    }));

    const box = $("#bring-chips");
    box.innerHTML = BRING.map((b, i) => `<button class="chip" style="animation-delay:${i * 50}ms">${b}</button>`).join("");
    box.addEventListener("click", e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      chip.classList.toggle("on");
      chip.classList.contains("on") ? state.bring.add(chip.textContent) : state.bring.delete(chip.textContent);
    });

    finish.addEventListener("click", () => {
      if (!state.car) {
        $(".car-pick").classList.add("shake");
        setTimeout(() => $(".car-pick").classList.remove("shake"), 500);
        return;
      }
      buildTicket();
      goTo(4);
    });
  }

  /* ---------- paso 4: ticket ---------- */
  function wspLink(text) {
    return "https://wa.me/?text=" + encodeURIComponent(text);
  }

  function buildTicket() {
    const bring = [...state.bring];
    const num = String(Math.floor(Math.random() * 900) + 100);
    const carText = state.car === "si" ? "🚙 ¡PRESTA AUTO!" : "Copiloto";
    $("#t-name").textContent = state.name;
    $("#t-num").textContent = num;
    $("#t-car").textContent = carText;
    $("#t-bring").textContent = bring.length ? bring.join(", ") : "Su presencia";

    const stamp = $("#t-stamp");
    stamp.textContent = state.car === "si" ? "HÉROE 🚙" : "CONFIRMADO";
    stamp.classList.toggle("hero", state.car === "si");
    stamp.classList.remove("hit");
    const ticket = $("#ticket");
    ticket.style.animation = "none"; void ticket.offsetWidth; ticket.style.animation = "";
    void stamp.offsetWidth;
    stamp.classList.add("hit");

    // explosión cuando cae el timbre
    setTimeout(() => {
      confetti(innerWidth / 2, innerHeight / 2, 140);
      if (navigator.vibrate) navigator.vibrate([60, 40, 120]);
    }, 1550);

    const lines = [
      `🔥 *ASADO RAPEL* 🔥`,
      `✅ ${state.name} CONFIRMA ASISTENCIA (pase N° ${num})`,
      state.car === "si" ? "🚙 ¡Y PRESTA AUTO! Problema resuelto." : "🧍 Va de copiloto.",
      `🎒 Lleva: ${bring.length ? bring.join(", ") : "su presencia"}`,
      `📍 Sáb 28/11 · 09:30 Duoc UC Antonio Varas 666`
    ];
    $("#btn-wsp").href = wspLink(lines.join("\n"));

    const list = store.get("rsvps", []);
    list.push({ name: state.name, car: state.car, bring, at: Date.now() });
    store.set("rsvps", list);
  }

  function reset() {
    state.name = ""; state.going = null; state.car = null; state.bring.clear();
    $$(".chip.on, .car-opt.on").forEach(c => c.classList.remove("on"));
    $("#name-other").value = "";
    $("#btn-step1").disabled = true;
    $("#btn-finish").disabled = true;
    goTo(1);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initEmbers();
    initNames();
    initYesNo();
    initDetails();
    $("#btn-restart").addEventListener("click", reset);
    goTo(1);
  });
})();

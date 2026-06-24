/* SafeLocal AI — site interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  /* =========================================================
     CONFIG — paste your Google Apps Script Web App URL here
     (see GOOGLE-SHEET-SETUP.md). Leads go to a Google Sheet
     on porshianboti@gmail.com.
     ========================================================= */
  var LEAD_ENDPOINT = ""; // e.g. "https://script.google.com/macros/s/AKfy.../exec"

  /* Resolve the /assets/ base from this script's own src so injected images
     work at any URL depth (/en/, /he/legal-ai/, /vs/chatgpt/, …). */
  var ASSET_BASE = (function () {
    var s = document.querySelector('script[src*="assets/js/main.js"]');
    return s ? s.getAttribute("src").replace(/js\/main\.js.*$/, "") : "../assets/";
  })();

  /* ---- Language switch dropdown ---- */
  var lang = document.getElementById("lang");
  var langBtn = document.getElementById("langBtn");
  if (lang && langBtn) {
    langBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = lang.classList.toggle("open");
      langBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!lang.contains(e.target)) { lang.classList.remove("open"); langBtn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- Mobile nav toggle ---- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq__item.open").forEach(function (other) {
        if (other !== item) { other.classList.remove("open"); other.querySelector(".faq__a").style.maxHeight = null; }
      });
      if (isOpen) { item.classList.remove("open"); a.style.maxHeight = null; }
      else { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---- Dynamic year ---- */
  var year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = year; });

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.style.boxShadow = window.scrollY > 8 ? "0 4px 14px rgba(3,17,34,0.06)" : "none"; };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* =========================================================
     Lead-capture popover
     ========================================================= */
  var isHe = (document.documentElement.lang || "en").toLowerCase().indexOf("he") === 0;
  var T = isHe ? {
    title: "נחזור אליכם",
    sub: "השאירו פרטים והצוות שלנו יחזור אליכם בהקדם.",
    name: "שם מלא", namePh: "השם שלכם",
    email: "אימייל", emailPh: "you@company.com",
    phone: "טלפון", phonePh: "050-000-0000",
    submit: "שליחה", sending: "שולח…",
    okTitle: "תודה!", okText: "קיבלנו את הפרטים — נחזור אליכם בקרוב.",
    errName: "נא להזין שם.", errEmail: "נא להזין אימייל תקין.", errPhone: "נא להזין מספר טלפון.",
    errSend: "אופס, השליחה נכשלה. נסו שוב או כתבו לנו ל-sales@safelocal.ai.",
    close: "סגירה"
  } : {
    title: "We'll get back to you",
    sub: "Leave your details and our team will reach out shortly.",
    name: "Full name", namePh: "Your name",
    email: "Email", emailPh: "you@company.com",
    phone: "Phone", phonePh: "+1 555 123 4567",
    submit: "Done", sending: "Sending…",
    okTitle: "Thank you!", okText: "We've got your details — we'll be in touch soon.",
    errName: "Please enter your name.", errEmail: "Please enter a valid email.", errPhone: "Please enter your phone number.",
    errSend: "Sorry, that didn't send. Please try again or email sales@safelocal.ai.",
    close: "Close"
  };

  // Backdrop
  var backdrop = document.createElement("div");
  backdrop.className = "lead-backdrop";
  document.body.appendChild(backdrop);

  // Popover
  var pop = document.createElement("div");
  pop.className = "lead-pop";
  pop.setAttribute("role", "dialog");
  pop.setAttribute("aria-modal", "true");
  pop.innerHTML =
    '<span class="lead-pop__arrow"></span>' +
    '<button type="button" class="lead-pop__close" aria-label="' + T.close + '">&times;</button>' +
    '<div class="lead-pop__form">' +
      '<h3 class="lead-pop__title">' + T.title + '</h3>' +
      '<p class="lead-pop__sub">' + T.sub + '</p>' +
      '<p class="lead-pop__err"></p>' +
      '<div class="lead-field"><label>' + T.name + '</label><input type="text" name="name" autocomplete="name" placeholder="' + T.namePh + '" /></div>' +
      '<div class="lead-field"><label>' + T.email + '</label><input type="email" name="email" autocomplete="email" placeholder="' + T.emailPh + '" /></div>' +
      '<div class="lead-field"><label>' + T.phone + '</label><input type="tel" name="phone" autocomplete="tel" placeholder="' + T.phonePh + '" /></div>' +
      '<button type="button" class="lead-pop__submit"><img src="' + ASSET_BASE + 'img/shield-white.svg" alt="" /><span>' + T.submit + '</span></button>' +
    '</div>' +
    '<div class="lead-pop__success" style="display:none">' +
      '<div class="ico"><img src="' + ASSET_BASE + 'img/shield-node.svg" alt="" /></div>' +
      '<h4>' + T.okTitle + '</h4><p>' + T.okText + '</p>' +
    '</div>';
  document.body.appendChild(pop);

  var arrow   = pop.querySelector(".lead-pop__arrow");
  var formBox = pop.querySelector(".lead-pop__form");
  var okBox   = pop.querySelector(".lead-pop__success");
  var errBox  = pop.querySelector(".lead-pop__err");
  var inName  = pop.querySelector('input[name="name"]');
  var inEmail = pop.querySelector('input[name="email"]');
  var inPhone = pop.querySelector('input[name="phone"]');
  var submit  = pop.querySelector(".lead-pop__submit");

  var currentTrigger = null;

  function positionPop() {
    if (!currentTrigger) return;
    var r = currentTrigger.getBoundingClientRect();
    var popW = pop.offsetWidth;
    var vw = document.documentElement.clientWidth;
    var center = r.left + r.width / 2 + window.scrollX;
    var left = center - popW / 2;
    left = Math.max(window.scrollX + 16, Math.min(left, window.scrollX + vw - popW - 16));
    pop.style.left = left + "px";
    pop.style.top = (r.bottom + window.scrollY + 10) + "px";
    var aLeft = center - left;
    arrow.style.left = Math.max(16, Math.min(aLeft - 7, popW - 30)) + "px";
  }

  function openPop(trigger) {
    currentTrigger = trigger;
    // reset to form view
    okBox.style.display = "none";
    formBox.style.display = "";
    errBox.classList.remove("show");
    [inName, inEmail, inPhone].forEach(function (i) { i.value = ""; i.classList.remove("invalid"); });
    submit.disabled = false;
    submit.querySelector("span").textContent = T.submit;
    backdrop.classList.add("open");
    pop.classList.add("open");
    positionPop();
    setTimeout(function () { inName.focus(); }, 60);
  }

  function closePop() {
    pop.classList.remove("open");
    backdrop.classList.remove("open");
    currentTrigger = null;
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function digits(v) { return (v || "").replace(/[^0-9]/g, ""); }

  function showErr(msg, field) {
    errBox.textContent = msg; errBox.classList.add("show");
    [inName, inEmail, inPhone].forEach(function (i) { i.classList.remove("invalid"); });
    if (field) { field.classList.add("invalid"); field.focus(); }
  }

  function handleSubmit() {
    var name = inName.value.trim(), email = inEmail.value.trim(), phone = inPhone.value.trim();
    if (name.length < 2) return showErr(T.errName, inName);
    if (!validEmail(email)) return showErr(T.errEmail, inEmail);
    if (digits(phone).length < 7) return showErr(T.errPhone, inPhone);
    errBox.classList.remove("show");

    submit.disabled = true;
    submit.querySelector("span").textContent = T.sending;

    var payload = new URLSearchParams({
      name: name, email: email, phone: phone,
      lang: isHe ? "he" : "en",
      source: (currentTrigger && currentTrigger.textContent.trim()) || "",
      page: location.href
    });

    var done = function () {
      formBox.style.display = "none";
      okBox.style.display = "";
      positionPop();
    };

    if (LEAD_ENDPOINT) {
      fetch(LEAD_ENDPOINT, { method: "POST", mode: "no-cors", body: payload })
        .then(done)
        .catch(function () {
          submit.disabled = false;
          submit.querySelector("span").textContent = T.submit;
          showErr(T.errSend);
        });
    } else {
      // Endpoint not configured yet — show success so the flow is testable.
      console.warn("[SafeLocal] LEAD_ENDPOINT is empty. Lead captured but NOT sent:", Object.fromEntries(payload));
      done();
    }
  }

  // Wire every demo / quote / sales CTA: any link to #signup, or [data-lead]
  document.querySelectorAll('a[href="#signup"], [data-lead]').forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentTrigger === el && pop.classList.contains("open")) { closePop(); return; }
      openPop(el);
    });
  });

  submit.addEventListener("click", handleSubmit);
  pop.querySelector(".lead-pop__close").addEventListener("click", closePop);
  backdrop.addEventListener("click", closePop);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
  pop.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); handleSubmit(); } });
  window.addEventListener("resize", function () { if (pop.classList.contains("open")) positionPop(); });
  window.addEventListener("scroll", function () { if (pop.classList.contains("open")) positionPop(); }, { passive: true });
})();

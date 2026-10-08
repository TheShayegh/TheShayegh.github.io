(function () {
  "use strict";
  var root = document.documentElement;

  // theme toggle (auto -> follows OS until the visitor picks one)
  var btn = document.querySelector(".theme");
  function isDark() {
    var t = root.dataset.theme;
    return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  }
  if (btn) btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("cv-theme", next); } catch (e) {}
  });

  // nav border once scrolled
  var nav = document.querySelector(".nav");
  function onScroll() { if (nav) nav.classList.toggle("stuck", window.scrollY > 140); }
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // scroll-spy
  var links = {};
  document.querySelectorAll(".nav nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  var secs = Array.prototype.filter.call(document.querySelectorAll("section.block"), function (s) { return links[s.id]; });
  if ("IntersectionObserver" in window && secs.length) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle("on", k === e.target.id); });
        var on = links[e.target.id];
        if (on && on.scrollIntoView && on.parentNode.scrollWidth > on.parentNode.clientWidth)
          on.parentNode.scrollTo({ left: on.offsetLeft - 40, behavior: "smooth" });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { spy.observe(s); });
  }

  // live filter for lists (e.g. publications)
  document.querySelectorAll("input[data-filter]").forEach(function (inp) {
    var targets = document.querySelectorAll(inp.dataset.filter);
    inp.addEventListener("input", function () {
      var terms = inp.value.toLowerCase().split(/\s+/).filter(Boolean);
      targets.forEach(function (el) {
        var hay = el.textContent.toLowerCase();
        el.hidden = !terms.every(function (t) { return hay.indexOf(t) >= 0; });
        if (!el.hidden) el.classList.add("in");
      });
    });
  });
})();

(function () {
  "use strict";
  var root = document.documentElement;

  // links and email drop-down (narrow screens)
  var more = document.querySelector(".more"), menu = document.querySelector(".menu");
  function setMenu(open) {
    if (!more || !menu) return;
    menu.classList.toggle("open", open);
    more.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (more && menu) {
    more.addEventListener("click", function (e) { e.stopPropagation(); setMenu(!menu.classList.contains("open")); });
    menu.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("click", function () { setMenu(false); });
    addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

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
  var secs = Array.prototype.filter.call(document.querySelectorAll("section.block, section.hero"), function (s) { return links[s.id]; });
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

  // print with everything open
  addEventListener("beforeprint", function () {
    document.querySelectorAll("details").forEach(function (d) { d.open = true; });
  });

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

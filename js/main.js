/* Women of Power — interactions */
(function () {
  "use strict";

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll(".stat-num[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var dur = 1600, start = null;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Testimonial carousel ---------- */
  var track = document.getElementById("carouselTrack");
  var slides = track.children.length;
  var dotsWrap = document.getElementById("carouselDots");
  var idx = 0, timer = null;

  for (var i = 0; i < slides; i++) {
    (function (n) {
      var d = document.createElement("button");
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Show story " + (n + 1));
      d.addEventListener("click", function () { goTo(n); restart(); });
      dotsWrap.appendChild(d);
    })(i);
  }
  var dots = dotsWrap.children;

  function goTo(n) {
    idx = (n + slides) % slides;
    track.style.transform = "translateX(-" + idx * 100 + "%)";
    for (var j = 0; j < dots.length; j++) {
      dots[j].classList.toggle("active", j === idx);
      dots[j].setAttribute("aria-selected", j === idx ? "true" : "false");
    }
  }
  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { goTo(idx + 1); }, 6500);
  }
  document.getElementById("prevSlide").addEventListener("click", function () { goTo(idx - 1); restart(); });
  document.getElementById("nextSlide").addEventListener("click", function () { goTo(idx + 1); restart(); });
  document.getElementById("carousel").addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
  document.getElementById("carousel").addEventListener("mouseleave", restart);
  goTo(0);
  restart();

  /* ---------- Parallax on Memphis sunrise banner ---------- */
  var parallaxVideo = document.querySelector(".parallax-video");
  var parallaxSection = document.querySelector(".parallax");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (parallaxVideo && parallaxSection && !reduceMotion) {
    window.addEventListener("scroll", function () {
      var r = parallaxSection.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var progress = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        parallaxVideo.style.transform = "translateY(" + ((progress - 0.5) * 90).toFixed(1) + "px)";
      }
    }, { passive: true });
  }

  /* ---------- Contact form (opens visitor's email app) ---------- */
  // OWNER: to receive messages directly, replace the address below with the
  // organization's email, e.g. "hello@womenofpowertn.org".
  var CONTACT_EMAIL = "";
  var contactForm = document.getElementById("contactForm");
  var contactNote = document.getElementById("contactNote");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("cName").value.trim();
    var phone = document.getElementById("cPhone").value.trim();
    var email = document.getElementById("cEmail").value.trim();
    var msg = document.getElementById("cMsg").value.trim();
    if (!name || !email || !msg) {
      contactNote.textContent = "Please fill in your name, email, and message.";
      return;
    }
    if (!CONTACT_EMAIL) {
      contactNote.textContent = "Thanks, " + name.split(" ")[0] + "! Please call us directly at (800) 587-0911 so we can help right away.";
      return;
    }
    var subject = encodeURIComponent("Website message from " + name);
    var body = encodeURIComponent("Name: " + name + "\nPhone: " + phone + "\nEmail: " + email + "\n\n" + msg);
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    contactNote.textContent = "Opening your email app — just hit send!";
  });

  /* ---------- Event notify signup ---------- */
  var notifyForm = document.getElementById("notifyForm");
  var notifyNote = document.getElementById("notifyNote");
  notifyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("notifyEmail").value.trim();
    if (!email) return;
    if (!CONTACT_EMAIL) {
      notifyNote.textContent = "You're on the list! For now, call (800) 587-0911 to stay in the loop on events.";
      return;
    }
    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent("Notify me about Women of Power events") +
      "&body=" + encodeURIComponent("Please add me to the events list: " + email);
    notifyNote.textContent = "Opening your email app — just hit send to subscribe!";
  });
})();

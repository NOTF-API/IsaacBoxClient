(function () {
  "use strict";

  var topbar = document.querySelector(".topbar");
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("site-nav");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");
  var lastFocused = null;
  var previousOverflow = "";

  function onScroll() {
    if (!topbar) return;
    topbar.classList.toggle("scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "打开菜单");
    menuBtn.textContent = "MENU";
  }

  function toggleMenu() {
    if (!nav || !menuBtn) return;
    var isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
    menuBtn.textContent = isOpen ? "CLOSE" : "MENU";
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", toggleMenu);

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  function openLightbox(figure) {
    if (!lightbox || !lightboxImg || !lightboxClose) return;

    var image = figure.querySelector("img");
    if (!image) return;

    lastFocused = document.activeElement;
    previousOverflow = document.body.style.overflow;

    lightboxImg.src = image.currentSrc || image.src;
    lightboxImg.alt = image.alt;
    lightboxCaption.textContent = image.alt || "";

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();

    document.addEventListener("keydown", onLightboxKeydown);
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("open");
    lightboxImg.src = "";
    lightboxImg.alt = "";
    lightboxCaption.textContent = "";
    document.body.style.overflow = previousOverflow;
    document.removeEventListener("keydown", onLightboxKeydown);

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  function onLightboxKeydown(event) {
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      lightboxClose.focus();
    }
  }

  document.querySelectorAll(".shot").forEach(function (figure) {
    figure.addEventListener("click", function () {
      openLightbox(figure);
    });

    figure.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(figure);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.left = "-1000px";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, area.value.length);

    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(area);
    return copied;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(text);
        }
      );
    }

    return Promise.resolve(fallbackCopy(text));
  }

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy") || "";
      var original = button.textContent;
      var timer = button._copyTimer;

      if (timer) window.clearTimeout(timer);

      copyText(text).then(function (copied) {
        button.textContent = copied ? "已复制" : "复制失败";
        button.classList.toggle("copied", copied);

        button._copyTimer = window.setTimeout(function () {
          button.textContent = original;
          button.classList.remove("copied");
        }, 1600);
      });
    });
  });

  var revealItems = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }
})();

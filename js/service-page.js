/* Service Page — Interactive JS */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Detail Tabs (ESG section) ── */
  document.querySelectorAll('.dtab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.getAttribute('data-target');
      var container = this.closest('.detail-tabs');

      container.querySelectorAll('.dtab').forEach(function (b) { b.classList.remove('active'); });
      container.querySelectorAll('.dtab-panel').forEach(function (p) { p.classList.remove('active'); });

      this.classList.add('active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Custom Accordion (EMS section) ── */
  document.querySelectorAll('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = this.getAttribute('data-target');
      var body = document.getElementById(targetId);
      var isOpen = this.classList.contains('active');

      /* Close all in same accordion */
      var accordion = this.closest('.accordion-custom');
      accordion.querySelectorAll('.acc-btn').forEach(function (b) { b.classList.remove('active'); });
      accordion.querySelectorAll('.acc-body').forEach(function (b) { b.classList.remove('open'); });

      if (!isOpen) {
        this.classList.add('active');
        if (body) body.classList.add('open');
      }
    });
  });

  /* ── Sticky Tab Bar: highlight active section ── */
  var sections = document.querySelectorAll('section[id]');
  var tabLinks = document.querySelectorAll('.svc-tab');
  var tabBar   = document.getElementById('svcTabBar');

  function onScroll() {
    var scrollY = window.pageYOffset;
    var active  = null;

    sections.forEach(function (sec) {
      var top = sec.offsetTop - 140;
      if (scrollY >= top) active = sec.getAttribute('id');
    });

    tabLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + active) {
        link.classList.add('active');

        /* Scroll the tab into view inside the tab bar */
        if (tabBar) {
          var linkRect = link.getBoundingClientRect();
          var barRect  = tabBar.getBoundingClientRect();
          if (linkRect.left < barRect.left || linkRect.right > barRect.right) {
            link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Smooth Scroll for tab links ── */
  tabLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var offset = target.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* ═══════════════════════════════════════════
     ESG PARALLAX BACKGROUND SCROLL
  ═══════════════════════════════════════════ */
  var parallaxBg   = document.getElementById('esgParallaxBg');
  var parallaxHero = document.getElementById('esg');

  function updateParallax() {
    if (!parallaxBg || !parallaxHero) return;
    var rect   = parallaxHero.getBoundingClientRect();
    var visible = rect.bottom > 0 && rect.top < window.innerHeight;
    if (!visible) return;
    var progress = (window.pageYOffset - parallaxHero.offsetTop + window.innerHeight) /
                   (parallaxHero.offsetHeight + window.innerHeight);
    var shift = (progress - 0.5) * 160;
    parallaxBg.style.transform = 'translateY(' + shift + 'px)';
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  /* ═══════════════════════════════════════════
     ESG 3D CAROUSEL
  ═══════════════════════════════════════════ */
  var cards      = Array.from(document.querySelectorAll('.esg-crd'));
  var dots       = Array.from(document.querySelectorAll('.esg-dot'));
  var btnPrev    = document.getElementById('esgPrev');
  var btnNext    = document.getElementById('esgNext');
  var total      = cards.length;
  var current    = 0;
  var autoTimer  = null;

  function getState(cardIndex, activeIndex) {
    var diff = ((cardIndex - activeIndex) % total + total) % total;
    if (diff === 0) return 'state-active';
    if (diff === 1) return 'state-next';
    if (diff === total - 1) return 'state-prev';
    return 'state-hidden';
  }

  function applyCarousel(newIndex) {
    current = ((newIndex % total) + total) % total;
    cards.forEach(function (card, i) {
      card.className = card.className.replace(/\bstate-\S+/g, '').trim();
      card.classList.add(getState(i, current));
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () { applyCarousel(current + 1); }, 4000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (cards.length) {
    applyCarousel(0);
    startAuto();

    if (btnPrev) btnPrev.addEventListener('click', function () {
      stopAuto(); applyCarousel(current - 1); startAuto();
    });
    if (btnNext) btnNext.addEventListener('click', function () {
      stopAuto(); applyCarousel(current + 1); startAuto();
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAuto(); applyCarousel(i); startAuto();
      });
    });

    /* Click side cards to navigate */
    cards.forEach(function (card, i) {
      card.addEventListener('click', function () {
        if (i !== current) { stopAuto(); applyCarousel(i); startAuto(); }
      });
    });

    /* Touch swipe */
    var touchStartX = 0;
    var stage = document.getElementById('esgCarouselStage');
    if (stage) {
      stage.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      stage.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          stopAuto();
          applyCarousel(dx < 0 ? current + 1 : current - 1);
          startAuto();
        }
      }, { passive: true });
    }
  }

});

  /* ══════════════════════════════════════════
     WHAT WE DO — COVERFLOW CAROUSEL
  ══════════════════════════════════════════ */
  (function () {
    var carousel = document.getElementById('wwdCarousel');
    if (!carousel) return;

    var slides   = Array.from(carousel.querySelectorAll('.wwd-slide'));
    var total    = slides.length;
    var current  = 0;

    /*
     * Position table indexed by |offset| from center.
     * Positive offset  → right side  (tx positive, ry negative = angled left face)
     * Negative offset  → left side   (tx negative, ry positive)
     * Offset ±3 with 6 slides = directly behind center — hide it.
     */
    var STEP = [
      // abs  tx     tz     ry     scale   opacity  z
      [  0,    0,     0,     0,    1.00,   1.00,   10 ],  // center
      [  1,  340,  -100,   -42,   0.80,   0.92,    8 ],  // ±1
      [  2,  600,  -220,   -58,   0.60,   0.65,    5 ],  // ±2
      [  3,  800,  -350,   -70,   0.40,   0.00,    1 ],  // ±3 hidden (behind)
    ];

    function getPos(offset) {
      var abs = Math.abs(offset);
      var row = STEP[Math.min(abs, STEP.length - 1)];
      var sign = offset >= 0 ? 1 : -1;
      return {
        tx:      sign * row[1],
        tz:      row[2],
        ry:      sign * row[3],   // positive offset → ry negative (right card faces left)
        scale:   row[4],
        opacity: row[5],
        z:       row[6]
      };
    }

    function applyLayout() {
      slides.forEach(function (slide, i) {
        var offset = i - current;
        // Shortest wrap-around path
        if (offset >  total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        var p = getPos(offset);
        slide.style.transform = [
          'translateX(' + p.tx  + 'px)',
          'translateZ(' + p.tz  + 'px)',
          'rotateY('    + (-p.ry) + 'deg)',   // negate: +1 card faces inward
          'scale('      + p.scale + ')'
        ].join(' ');
        slide.style.opacity = p.opacity;
        slide.style.zIndex  = p.z;
        slide.classList.toggle('is-active', offset === 0);
        // Disable pointer events on hidden slide
        slide.style.pointerEvents = (Math.abs(offset) >= 3) ? 'none' : 'auto';
      });

      // Active dot
      document.querySelectorAll('.wwd-dot').forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
      });
    }

    function goTo(n) {
      current = ((n % total) + total) % total;
      applyLayout();
    }

    // Build dots
    var dotsWrap = document.getElementById('wwdDots');
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'wwd-dot' + (i === 0 ? ' is-active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(d);
    });

    // Nav buttons
    document.getElementById('wwdPrev').addEventListener('click', function () { goTo(current - 1); });
    document.getElementById('wwdNext').addEventListener('click', function () { goTo(current + 1); });

    // Click on side slides to bring them to center
    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function () { if (i !== current) goTo(i); });
    });

    // Touch swipe
    var swipeStart = 0;
    carousel.addEventListener('touchstart', function (e) { swipeStart = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - swipeStart;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });

    // Auto-play
    var autoTimer = setInterval(function () { goTo(current + 1); }, 4000);
    carousel.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    carousel.addEventListener('mouseleave', function () {
      autoTimer = setInterval(function () { goTo(current + 1); }, 4000);
    });

    applyLayout();
  }());

  /* ═══════════════════════════════════════════
     PROCUREMENT ARC CAROUSEL — How It Supports
  ═══════════════════════════════════════════ */
  (function () {
    var stage    = document.getElementById('procArcStage');
    var dotsWrap = document.getElementById('procArcDots');
    if (!stage) return;

    var items = [
      { title: 'Strengthens Brand Reputation', icon: 'fa-award',      color: '#1B4332', desc: 'Builds trust with stakeholders, reduces risk of scandals and non-compliance penalties.' },
      { title: 'Enhances Risk Management',      icon: 'fa-shield-alt', color: '#2D6A4F', desc: 'Identifies problematic suppliers; ensures compliance with ISO 20400, GRI, BRSR, UN SDGs.' },
      { title: 'Promotes Innovation',           icon: 'fa-lightbulb',  color: '#40916C', desc: 'Develops eco-friendly, high-performance products and drives brand differentiation.' },
      { title: 'Optimizes Cost & Efficiency',   icon: 'fa-chart-line', color: '#52B788', desc: 'Reduces long-term operational costs through energy-efficient sourcing and circular economy practices.' },
      { title: 'Future-Proofs Sustainability',  icon: 'fa-leaf',       color: '#74C69D', desc: 'Aligns procurement with climate goals and evolving ESG reporting requirements.' },
      { title: 'Builds Stakeholder Trust',      icon: 'fa-handshake',  color: '#95D5B2', desc: 'Demonstrates accountability and transparent ESG reporting to investors, customers, and regulators.' }
    ];

    var N        = items.length;
    var activeIdx = 0, autoTimer;
    var CARD_W   = 160, CARD_H = 220;
    var ARC_R    = 270, STEP_DEG = 26, PIVOT_Y = 520;
    var cards = [], dots = [];

    /* Build cards */
    items.forEach(function (item, i) {
      var card = document.createElement('div');
      card.className = 'proc-arc-card';
      card.innerHTML =
        '<div class="proc-arc-num">' + (i + 1) + '</div>' +
        '<div class="proc-arc-title">' + item.title + '</div>' +
        '<div class="proc-arc-desc">' + item.desc + '</div>';
      stage.appendChild(card);
      cards.push(card);
      (function (idx) {
        card.addEventListener('click', function () { setActive(idx); stopAuto(); });
      }(i));
    });

    /* Build dots */
    items.forEach(function (item, i) {
      var d = document.createElement('button');
      d.className = 'proc-arc-dot';
      d.setAttribute('aria-label', item.title);
      (function (idx) {
        d.addEventListener('click', function () { setActive(idx); stopAuto(); });
      }(i));
      dotsWrap.appendChild(d);
      dots.push(d);
    });

    function applyLayout() {
      var stageW = stage.offsetWidth || 460;
      var cx = stageW / 2;
      cards.forEach(function (card, i) {
        var offset = i - activeIdx;
        if (offset >  N / 2) offset -= N;
        if (offset < -N / 2) offset += N;
        var angleRad = offset * STEP_DEG * Math.PI / 180;
        var x   = cx + ARC_R * Math.sin(angleRad) - CARD_W / 2;
        var y   = PIVOT_Y - ARC_R * Math.cos(angleRad) - CARD_H;
        var abs = Math.abs(offset);
        var scale   = Math.max(0.55, 1 - abs * 0.15);
        var opacity = abs >= 3 ? 0 : Math.max(0.3, 1 - abs * 0.28);
        card.style.width        = CARD_W + 'px';
        card.style.left         = x + 'px';
        card.style.top          = y + 'px';
        card.style.transform    = 'scale(' + scale + ')';
        card.style.opacity      = abs >= 3 ? '0' : opacity;
        card.style.pointerEvents = abs >= 3 ? 'none' : 'auto';
        card.style.zIndex       = 10 - abs;
        card.classList.toggle('is-active', offset === 0);
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === activeIdx); });
    }

    function setActive(idx) {
      activeIdx = ((idx % N) + N) % N;
      applyLayout();
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () { setActive(activeIdx + 1); }, 2800);
    }
    function stopAuto() { clearInterval(autoTimer); }

    stage.addEventListener('mouseenter', stopAuto);
    stage.addEventListener('mouseleave', startAuto);

    applyLayout();
    startAuto();
    window.addEventListener('resize', applyLayout);
  }());

  /* ═══════════════════════════════════════════
     GREEN INVESTMENT — ARC CAROUSEL
  ═══════════════════════════════════════════ */
  (function () {
    var stage    = document.getElementById('giArcStage');
    var dotsWrap = document.getElementById('giArcDots');
    if (!stage) return;

    var items = [
      { title: 'Renewable Energy',            icon: 'fa-solar-panel',      color: '#1B4332', desc: 'Financing solar, wind, hydro, and bioenergy projects to reduce emissions and transition to clean energy sources.' },
      { title: 'Sustainable Infrastructure',  icon: 'fa-city',             color: '#2D6A4F', desc: 'Funding energy-efficient materials, smart grids, and green building certifications for tomorrow\'s infrastructure.' },
      { title: 'Green Bonds & ESG Loans',     icon: 'fa-hand-holding-usd', color: '#40916C', desc: 'Raising funds for environmental projects with sustainability-linked incentives and green financing structures.' },
      { title: 'Carbon Markets & Offsetting', icon: 'fa-exchange-alt',     color: '#52B788', desc: 'Investing in carbon credit projects and monetizing emission reductions through trading and offset programs.' },
      { title: 'Circular Economy',            icon: 'fa-sync-alt',         color: '#74C69D', desc: 'Supporting recycling, resource-efficient production, and eco-friendly product development for a circular future.' }
    ];

    var N = items.length, activeIdx = 0, autoTimer;
    var CARD_W = 190, CARD_H = 270;
    var ARC_R = 200, STEP_DEG = 36, PIVOT_Y = 570;
    var cards = [], dots = [];

    items.forEach(function (item, i) {
      var card = document.createElement('div');
      card.className = 'gi-arc-card';
      card.style.backgroundImage = 'url(../../img/services/pages/greenInvestment/' + (i + 1) + '.jpg)';
      card.innerHTML =
        '<div class="gi-arc-overlay"></div>' +
        '<div class="gi-arc-tag">' + item.title + '</div>' +
        '<div class="gi-arc-content">' +
          '<div class="gi-arc-title">' + item.title + '</div>' +
          '<div class="gi-arc-desc">' + item.desc + '</div>' +
        '</div>';
      stage.appendChild(card);
      cards.push(card);
      (function (idx) { card.addEventListener('click', function () { setActive(idx); stopAuto(); }); }(i));
    });

    items.forEach(function (item, i) {
      var d = document.createElement('button');
      d.className = 'gi-arc-dot';
      d.setAttribute('aria-label', item.title);
      (function (idx) { d.addEventListener('click', function () { setActive(idx); stopAuto(); }); }(i));
      dotsWrap.appendChild(d);
      dots.push(d);
    });

    function applyLayout() {
      var stageW = stage.offsetWidth || 800;
      var cx = stageW / 2;
      cards.forEach(function (card, i) {
        var offset = i - activeIdx;
        if (offset >  N / 2) offset -= N;
        if (offset < -N / 2) offset += N;
        var angleRad = offset * STEP_DEG * Math.PI / 180;
        var x   = cx + ARC_R * Math.sin(angleRad) - CARD_W / 2;
        var y   = PIVOT_Y - ARC_R * Math.cos(angleRad) - CARD_H;
        var abs = Math.abs(offset);
        var scale   = Math.max(0.55, 1 - abs * 0.15);
        var opacity = abs >= 3 ? 0 : Math.max(0.3, 1 - abs * 0.28);
        card.style.width         = CARD_W + 'px';
        card.style.left          = x + 'px';
        card.style.top           = y + 'px';
        card.style.transform     = 'scale(' + scale + ')';
        card.style.opacity       = abs >= 3 ? '0' : opacity;
        card.style.pointerEvents = abs >= 3 ? 'none' : 'auto';
        card.style.zIndex        = 10 - abs;
        card.classList.toggle('is-active', offset === 0);
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === activeIdx); });
    }

    function setActive(idx) { activeIdx = ((idx % N) + N) % N; applyLayout(); }
    function startAuto() { stopAuto(); autoTimer = setInterval(function () { setActive(activeIdx + 1); }, 2800); }
    function stopAuto()  { clearInterval(autoTimer); }

    stage.addEventListener('mouseenter', stopAuto);
    stage.addEventListener('mouseleave', startAuto);
    window.addEventListener('resize', applyLayout);
    applyLayout();
    startAuto();
  }());

  /* ═══════════════════════════════════════════
     GREEN INVESTMENT — FULL-WHEEL FAN (always 5 visible in semicircle)
  ═══════════════════════════════════════════ */
  (function () {
    var svg      = document.getElementById('giFanSVG');
    var group    = document.getElementById('giFanSegs');
    var dotsWrap = document.getElementById('giFanDots');
    var popup    = document.getElementById('giPopup');
    var popClose = document.getElementById('giPopupClose');
    var popIcon  = document.getElementById('giPopupIcon');
    var popIconW = document.getElementById('giPopupIconWrap');
    var popTitle = document.getElementById('giPopupTitle');
    var popText  = document.getElementById('giPopupText');
    if (!svg || !group) return;

    var IMG_BASE = '../../img/services/pages/greeninvestment/greeninvestment0';
    var NS       = 'http://www.w3.org/2000/svg';

    var items = [
      { title: 'Renewable Energy',            icon: 'fa-solar-panel',      color: '#1B4332', desc: 'Financing solar, wind, hydro, and bioenergy projects to reduce emissions and transition to clean energy sources.' },
      { title: 'Sustainable Infrastructure',  icon: 'fa-city',             color: '#2D6A4F', desc: 'Funding energy-efficient materials, smart grids, and green building certifications for tomorrow\'s infrastructure.' },
      { title: 'Green Bonds & ESG Loans',     icon: 'fa-hand-holding-usd', color: '#40916C', desc: 'Raising funds for environmental projects with sustainability-linked incentives and green financing structures.' },
      { title: 'Carbon Markets & Offsetting', icon: 'fa-exchange-alt',     color: '#52B788', desc: 'Investing in carbon credit projects and monetizing emission reductions through trading and offset programs.' },
      { title: 'Circular Economy',            icon: 'fa-sync-alt',         color: '#74C69D', desc: 'Supporting recycling, resource-efficient production, and eco-friendly product development for a circular future.' }
    ];

    var cx = 320, cy = 335, R = 290, r = 86;
    var N     = items.length;   /* 5 unique items */
    var TOTAL = N * 2;          /* 10 slots — full 360° wheel */
    var SLOT  = 360 / TOTAL;    /* 36° per slot */
    var GAP   = 2.0;
    var segs  = [], activeIdx = 0, autoTimer, rafId;

    function f(n) { return n.toFixed(2); }
    function rad(d) { return d * Math.PI / 180; }

    /* Build 10 wedge slots: items 0-4 placed at 180°-360° (upper/visible half),
       copies 0-4 placed at 0°-180° (lower half, hidden behind mask).
       As the wheel rotates, copies smoothly replace their originals. */
    for (var s = 0; s < TOTAL; s++) {
      var itemIdx = s % N;
      var item    = items[itemIdx];

      var a1   = rad(180 + s * SLOT + GAP);
      var a2   = rad(180 + (s + 1) * SLOT - GAP);
      var midA = rad(180 + (s + 0.5) * SLOT);

      var ox1 = cx + R * Math.cos(a1), oy1 = cy + R * Math.sin(a1);
      var ox2 = cx + R * Math.cos(a2), oy2 = cy + R * Math.sin(a2);
      var ix1 = cx + r * Math.cos(a2), iy1 = cy + r * Math.sin(a2);
      var ix2 = cx + r * Math.cos(a1), iy2 = cy + r * Math.sin(a1);

      var d = ['M', f(ox1), f(oy1),
               'A', R, R, 0, 0, 1, f(ox2), f(oy2),
               'L', f(ix1), f(iy1),
               'A', r, r, 0, 0, 0, f(ix2), f(iy2), 'Z'].join(' ');

      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'gi-seg');
      g.dataset.item = itemIdx;

      /* clip path */
      var clipId = 'giClip' + s;
      var defs   = document.createElementNS(NS, 'defs');
      var cp     = document.createElementNS(NS, 'clipPath');
      cp.setAttribute('id', clipId);
      var cpPath = document.createElementNS(NS, 'path');
      cpPath.setAttribute('d', d);
      cp.appendChild(cpPath);
      defs.appendChild(cp);
      g.appendChild(defs);

      /* photo */
      var imgEl = document.createElementNS(NS, 'image');
      imgEl.setAttribute('href', IMG_BASE + (itemIdx + 1) + '.jpg');
      imgEl.setAttribute('x', '0'); imgEl.setAttribute('y', '0');
      imgEl.setAttribute('width', '640'); imgEl.setAttribute('height', '340');
      imgEl.setAttribute('clip-path', 'url(#' + clipId + ')');
      imgEl.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      g.appendChild(imgEl);

      /* dim overlay */
      var overlay = document.createElementNS(NS, 'path');
      overlay.setAttribute('d', d);
      overlay.setAttribute('class', 'gi-seg-overlay');
      overlay.setAttribute('fill', 'rgba(0,0,0,0.32)');
      overlay.setAttribute('stroke', '#ffffff');
      overlay.setAttribute('stroke-width', '4');
      g.appendChild(overlay);

      /* number badge */
      var numR = R * 0.68;
      var nlx  = cx + numR * Math.cos(midA);
      var nly  = cy + numR * Math.sin(midA);
      var circ = document.createElementNS(NS, 'circle');
      circ.setAttribute('cx', f(nlx)); circ.setAttribute('cy', f(nly));
      circ.setAttribute('r', '18');
      circ.setAttribute('fill', 'rgba(255,255,255,0.22)');
      circ.setAttribute('pointer-events', 'none');
      g.appendChild(circ);

      var nt = document.createElementNS(NS, 'text');
      nt.setAttribute('x', f(nlx)); nt.setAttribute('y', f(nly));
      nt.setAttribute('text-anchor', 'middle');
      nt.setAttribute('dominant-baseline', 'central');
      nt.setAttribute('fill', '#ffffff');
      nt.setAttribute('font-size', '16');
      nt.setAttribute('font-weight', '700');
      nt.setAttribute('font-family', 'Jost,sans-serif');
      nt.setAttribute('pointer-events', 'none');
      nt.textContent = itemIdx + 1;
      g.appendChild(nt);

      group.appendChild(g);
      segs.push(g);

      (function (idx) {
        g.addEventListener('click', function () { pauseRotation(); openPopup(idx); });
      }(itemIdx));
    }

    /* Build dots */
    items.forEach(function (item, i) {
      var d = document.createElement('button');
      d.className = 'gifd-dot';
      d.setAttribute('aria-label', item.title);
      d.addEventListener('click', function () { setActive(i); });
      dotsWrap.appendChild(d);
    });
    var dots = Array.from(dotsWrap.querySelectorAll('.gifd-dot'));

    function setActive(idx) {
      activeIdx = idx;
      segs.forEach(function (g) {
        g.classList.toggle('gi-seg--active', parseInt(g.dataset.item) === idx);
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
    }

    /* Continuous circular rotation */
    var rotAngle = 0, rotPaused = false;
    var ROT_SPEED = 0.18;

    function animateRotation() {
      if (!rotPaused) {
        rotAngle = (rotAngle + ROT_SPEED) % 360;
        group.setAttribute('transform',
          'rotate(' + rotAngle.toFixed(3) + ',' + cx + ',' + cy + ')');

        /* active dot: find which slot is nearest the top (270° SVG) across all 10 */
        var top = 270, best = 0, bestDist = Infinity;
        for (var i = 0; i < TOTAL; i++) {
          var mid  = (180 + (i + 0.5) * SLOT + rotAngle) % 360;
          var dist = Math.abs(mid - top);
          if (dist > 180) dist = 360 - dist;
          if (dist < bestDist) { bestDist = dist; best = i % N; }
        }
        if (best !== activeIdx) setActive(best);
      }
      rafId = requestAnimationFrame(animateRotation);
    }

    function pauseRotation() {
      rotPaused = true;
      setTimeout(function () { rotPaused = false; }, 4000);
    }

    svg.addEventListener('mouseenter', function () { rotPaused = true; });
    svg.addEventListener('mouseleave', function () {
      if (!popup.classList.contains('is-open')) rotPaused = false;
    });

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () { setActive((activeIdx + 1) % N); }, 2500);
    }
    function stopAuto() { clearInterval(autoTimer); }

    function openPopup(idx) {
      var item = items[idx];
      setActive(idx);
      popIcon.className         = 'fas ' + item.icon;
      popIconW.style.background = item.color;
      popTitle.textContent      = item.title;
      popText.textContent       = item.desc;
      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
      stopAuto();
    }
    function closePopup() {
      popup.classList.remove('is-open');
      popup.setAttribute('aria-hidden', 'true');
      rotPaused = false;
      startAuto();
    }
    if (popClose) popClose.addEventListener('click', closePopup);
    if (popup)    popup.addEventListener('click', function (e) { if (e.target === popup) closePopup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup(); });

    setActive(0);
    startAuto();
    animateRotation();
  }());

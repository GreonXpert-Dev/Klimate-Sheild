(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm');
        } else {
            $('.sticky-top').removeClass('shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 4500,
        smartSpeed: 700,
        loop: true,
        center: true,
        dots: false,
        nav: false,
        stagePadding: 120,
        margin: 8,
        responsive: {
            0:    { items: 1, stagePadding: 30 },
            768:  { items: 1, stagePadding: 60 },
            1100: { items: 2, stagePadding: 120 },
            1400: { items: 3, stagePadding: 120 }
        }
    });


    // ── Service Stacked Card Carousel ──────────────────────────────────────────
    (function () {
        var stack   = document.getElementById('svcStack');
        if (!stack) return;

        var cards   = Array.from(stack.querySelectorAll('.svc-card'));
        var dotsEl  = document.getElementById('svcDots');
        var btnPrev = document.getElementById('svcPrev');
        var btnNext = document.getElementById('svcNext');
        var total   = cards.length;
        var current = 0;
        var VISIBLE = 5;
        var busy    = false;
        var autoTimer = null;

        // Drag state
        var dragStartX = null, isDragging = false;
        var targetDx = 0, currentDx = 0, rafId = null;

        // Build dots
        if (dotsEl) {
            cards.forEach(function (_, i) {
                var d = document.createElement('button');
                d.className = 'svc-dot' + (i === 0 ? ' active' : '');
                d.addEventListener('click', function () { goTo(i); });
                dotsEl.appendChild(d);
            });
        }

        function updateDots() {
            if (!dotsEl) return;
            dotsEl.querySelectorAll('.svc-dot').forEach(function (d, i) {
                d.classList.toggle('active', i === current);
            });
        }

        function applyPositions() {
            cards.forEach(function (card, i) {
                var offset = (i - current + total) % total;
                card.setAttribute('data-pos', offset < VISIBLE ? String(offset) : 'hidden');
                if (!card.classList.contains('is-dragging')) card.style.transform = '';
            });
        }

        function next() {
            if (busy) return;
            busy = true;
            var front = cards[current];
            front.style.transform = '';
            front.classList.add('svc-exit-left');
            setTimeout(function () {
                front.classList.remove('svc-exit-left');
                current = (current + 1) % total;
                applyPositions();
                updateDots();
                busy = false;
            }, 820);
        }

        function prev() { goTo((current - 1 + total) % total); }

        function goTo(idx) {
            if (idx === current || busy) return;
            var steps = (idx - current + total) % total;
            var i = 0;
            (function step() {
                if (i >= steps) return;
                i++; busy = true;
                var front = cards[current];
                front.style.transform = '';
                front.classList.add('svc-exit-left');
                setTimeout(function () {
                    front.classList.remove('svc-exit-left');
                    current = (current + 1) % total;
                    applyPositions(); updateDots();
                    busy = false; step();
                }, 820);
            })();
        }

        applyPositions();
        updateDots();

        // Buttons
        if (btnNext) btnNext.addEventListener('click', function () { stopAuto(); next(); startAuto(); });
        if (btnPrev) btnPrev.addEventListener('click', function () { stopAuto(); prev(); startAuto(); });

        // Auto-play
        function startAuto() { autoTimer = setInterval(next, 5000); }
        function stopAuto()  { clearInterval(autoTimer); }
        startAuto();
        stack.addEventListener('mouseenter', stopAuto);
        stack.addEventListener('mouseleave', function () {
            if (isDragging) releaseDrag(0);
            startAuto();
        });

        // Smooth lerp drag
        function lerp(a, b, t) { return a + (b - a) * t; }
        function getFront() { return cards[current]; }

        function animateDrag() {
            if (dragStartX === null) return;
            currentDx = lerp(currentDx, targetDx, 0.18);
            var front = getFront();
            var rot = currentDx * 0.03;
            front.style.transform = 'translate(' + currentDx + 'px,' + (Math.abs(currentDx) * 0.025) + 'px) rotate(' + rot + 'deg)';
            var behind = cards[(current + 1) % total];
            if (behind) {
                var p = Math.min(Math.abs(currentDx) / 200, 1);
                var tx = -120 * (1 - p), ty = -18 * (1 - p), sc = 0.97 + 0.03 * p;
                behind.style.transform = 'translate(' + tx + 'px,' + ty + 'px) rotate(' + (-6 * (1 - p)) + 'deg) scale(' + sc + ')';
            }
            rafId = requestAnimationFrame(animateDrag);
        }

        function startDrag(x) {
            dragStartX = x; isDragging = false;
            targetDx = 0; currentDx = 0;
            getFront().classList.add('is-dragging');
            stopAuto();
            rafId = requestAnimationFrame(animateDrag);
        }

        function moveDrag(x) {
            if (dragStartX === null) return;
            targetDx = x - dragStartX;
            if (Math.abs(targetDx) > 5) isDragging = true;
        }

        function releaseDrag(x) {
            if (dragStartX === null) return;
            cancelAnimationFrame(rafId);
            var dx = dragStartX - x;
            var front = getFront();
            front.classList.remove('is-dragging');
            front.style.transform = '';
            var behind = cards[(current + 1) % total];
            if (behind) behind.style.transform = '';
            if (isDragging && Math.abs(dx) > 55) {
                dx < 0 ? next() : prev(); // drag right = next
            }
            dragStartX = null; isDragging = false;
            targetDx = 0; currentDx = 0;
            startAuto();
        }

        stack.addEventListener('mousedown',  function (e) { startDrag(e.clientX); });
        window.addEventListener('mousemove', function (e) { moveDrag(e.clientX); });
        window.addEventListener('mouseup',   function (e) { releaseDrag(e.clientX); });
        stack.addEventListener('touchstart', function (e) { startDrag(e.touches[0].clientX); }, { passive: true });
        stack.addEventListener('touchmove',  function (e) { moveDrag(e.touches[0].clientX); },  { passive: true });
        stack.addEventListener('touchend',   function (e) { releaseDrag(e.changedTouches[0].clientX); }, { passive: true });
    })();

})(jQuery);


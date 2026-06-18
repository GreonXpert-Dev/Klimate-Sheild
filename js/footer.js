(function () {
    var inServices = window.location.pathname.indexOf('/services/') !== -1;
    var base = inServices ? '../../' : '';

    fetch(base + 'footer.html')
        .then(function (res) { return res.text(); })
        .then(function (html) {
            var el = document.getElementById('footer-placeholder');
            if (!el) return;
            el.innerHTML = html;
            el.querySelectorAll('.footer-svc, .footer-root').forEach(function (a) {
                a.href = base + a.getAttribute('data-href');
            });
        });
})();

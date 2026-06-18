(function () {
    /* ── resolve base path so links work from any depth ── */
    var depth = window.location.pathname.split('/').filter(Boolean).length;
    /* pages at root (index.html, service.html …) → depth 1 on a server, but
       opened as file:// they may vary. Simplest approach: detect "services/" in path */
    var inServicesFolder = window.location.pathname.indexOf('/services/') !== -1;
    var base = inServicesFolder ? '../../' : '';

    var current = window.location.pathname.split('/').pop() || 'index.html';
    if (current && current.indexOf('.') === -1) current += '.html';

    var servicePages = [
        { href: 'services/esg/esg.html',                         label: 'ESG' },
        { href: 'services/carbon/carbon.html',                   label: 'Carbon' },
        { href: 'services/renewable/renewable.html',             label: 'Renewable' },
        { href: 'services/ems/ems.html',                         label: 'EMS' },
        { href: 'services/procurement/procurement.html',         label: 'Procurement' },
        { href: 'services/green-investment/green-investment.html', label: 'Green Investment' },
        { href: 'services/buildings/buildings.html',             label: 'Buildings' },
        { href: 'services/surveys/surveys.html',                 label: 'Surveys' },
    ];

    var serviceDropdownItems = servicePages.map(function (s) {
        return '<a class="dropdown-item" href="' + base + s.href + '">' + s.label + '</a>';
    }).join('');

    var simpleLinks = [
        { href: 'index.html',   label: 'Home' },
        { href: 'about.html',   label: 'About' },
        { href: 'project.html', label: 'Projects' },
        { href: 'contact.html', label: 'Contact' },
    ];

    var isServicesActive = inServicesFolder || current === 'service.html';

    var simpleNavItems = simpleLinks.map(function (link) {
        var isActive = current === link.href ? ' active' : '';
        return '<a href="' + base + link.href + '" class="nav-item nav-link' + isActive + '">' + link.label + '</a>';
    }).join('');

    /* Services dropdown — clicking "Services" goes to service.html (overview),
       dropdown items go to individual pages */
    var servicesDropdown =
        '<div class="nav-item dropdown">' +
            '<a href="' + base + 'service.html" class="nav-link dropdown-toggle' + (isServicesActive ? ' active' : '') + '" data-bs-toggle="dropdown">' +
                'Services' +
            '</a>' +
            '<div class="dropdown-menu border-0 m-0">' +
                serviceDropdownItems +
            '</div>' +
        '</div>';

    /* Assemble: Home | About | Services▼ | Projects | Contact */
    var allNavItems =
        '<a href="' + base + 'index.html" class="nav-item nav-link' + (current === 'index.html' ? ' active' : '') + '">Home</a>' +
        '<a href="' + base + 'about.html" class="nav-item nav-link' + (current === 'about.html' ? ' active' : '') + '">About</a>' +
        servicesDropdown +
        '<a href="' + base + 'project.html" class="nav-item nav-link' + (current === 'project.html' ? ' active' : '') + '">Projects</a>' +
        '<a href="' + base + 'contact.html" class="nav-item nav-link' + (current === 'contact.html' ? ' active' : '') + '">Contact</a>';

    var html =
        '<!-- Navbar Start -->' +
        '<nav class="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0" style="z-index:1030;">' +
            '<a href="' + base + 'index.html" class="navbar-brand d-flex align-items-center px-4 px-lg-5">' +
                '<img src="' + base + 'img/logo.svg" alt="Logo" style="height:44px; margin-right:10px;">' +
                '<h1 class="m-0" style="font-size:1.35rem; font-weight:700; color:#085041;">Klimate Shield</h1>' +
            '</a>' +
            '<button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">' +
                '<span class="navbar-toggler-icon"></span>' +
            '</button>' +
            '<div class="collapse navbar-collapse" id="navbarCollapse">' +
                '<div class="navbar-nav ms-auto p-4 p-lg-0 pe-lg-5">' +
                    allNavItems +
                '</div>' +
            '</div>' +
        '</nav>' +
        '<!-- Navbar End -->';

    var placeholder = document.getElementById('navbar-placeholder');
    if (placeholder) {
        placeholder.outerHTML = html;
    }
})();

export const initNavigation = () => {
    const links = [...document.querySelectorAll('[data-nav-link]')];

    const normalizePath = (path) => {
        return path.replace(/\/+$/, '') || '/';
    };

    const currentPath = normalizePath(window.location.pathname);

    const matches = links.filter((link) => {
        const linkPath = normalizePath(new URL(link.href).pathname);

        if (linkPath === '/') {
            return currentPath === '/';
        }

        return (
            currentPath === linkPath ||
            currentPath.startsWith(`${linkPath}/`)
        );
    });

    const activeLink = matches.sort((first, second) => {
        return second.pathname.length - first.pathname.length;
    })[0];

    links.forEach((link) => {
        link.removeAttribute('aria-current');
    });

    if (!activeLink) {
        return;
    }

    activeLink.setAttribute('aria-current', 'page');

    const track = activeLink.closest('.navigation-track');

    if (track && track.scrollWidth > track.clientWidth) {
        const left =
            activeLink.offsetLeft -
            track.offsetLeft -
            (track.clientWidth - activeLink.offsetWidth) / 2;

        track.scrollTo({
            left: Math.max(0, left),
            behavior: 'instant'
        });
    }
};

export const setHeaderLiveGame = (isActive, gameUrl = '/games/live') => {
    const button = document.getElementById('headerLiveGame');
    if (!button) return;

    if (isActive === true) {
        button.setAttribute('href', gameUrl);
        button.hidden = false;
        return;
    }

    if (button.contains(document.activeElement)) {
        document.querySelector('.diamond-header .brand')?.focus({ preventScroll: true });
    }

    button.hidden = true;
};
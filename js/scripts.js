/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav && typeof bootstrap !== 'undefined') {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    if (typeof SimpleLightbox !== 'undefined') {
        new SimpleLightbox({
            elements: '#portfolio a.portfolio-box'
        });
    }

    // Dot-controlled skills carousel with auto advance.
    const skillCarousels = document.querySelectorAll('[data-auto-scroll="true"]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    skillCarousels.forEach(carousel => {
        const row = carousel.querySelector('.skills-track');
        const dotsContainer = carousel.querySelector('.skills-dots');
        const items = row ? Array.from(row.children) : [];

        if (!row || !dotsContainer || items.length === 0) {
            return;
        }

        let dots = [];
        let currentIndex = 0;
        let paused = false;
        let pauseTimeout = null;
        let autoScrollInterval = null;

        const getVisibleItems = () => {
            const itemWidth = items[0].getBoundingClientRect().width;

            if (itemWidth === 0) {
                return 1;
            }

            return Math.max(1, Math.round(row.clientWidth / itemWidth));
        };

        const getMaxIndex = () => Math.max(0, items.length - getVisibleItems());

        const getItemScrollLeft = index => {
            const firstItemLeft = items[0].offsetLeft;

            return items[index].offsetLeft - firstItemLeft;
        };

        const setActiveDot = () => {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
                dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
            });
        };

        const goToIndex = index => {
            currentIndex = Math.min(Math.max(index, 0), getMaxIndex());
            row.scrollTo({
                left: getItemScrollLeft(currentIndex),
                behavior: reduceMotion.matches ? 'auto' : 'smooth',
            });
            setActiveDot();
        };

        const buildDots = () => {
            const dotCount = getMaxIndex() + 1;
            dotsContainer.innerHTML = '';
            dots = [];

            for (let index = 0; index < dotCount; index++) {
                const dot = document.createElement('button');
                dot.className = 'skills-dot';
                dot.type = 'button';
                dot.setAttribute('aria-label', `Show skills ${index + 1}`);
                dot.addEventListener('click', () => {
                    pauseBriefly();
                    goToIndex(index);
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }

            dotsContainer.hidden = dotCount <= 1;
            goToIndex(Math.min(currentIndex, getMaxIndex()));
        };

        const pauseBriefly = () => {
            paused = true;
            window.clearTimeout(pauseTimeout);
            pauseTimeout = window.setTimeout(() => {
                paused = false;
            }, 2500);
        };

        const startAutoScroll = () => {
            window.clearInterval(autoScrollInterval);

            if (reduceMotion.matches) {
                return;
            }

            autoScrollInterval = window.setInterval(() => {
                if (paused || getMaxIndex() === 0) {
                    return;
                }

                goToIndex(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
            }, 3000);
        };

        row.addEventListener('focusin', () => {
            paused = true;
        });
        row.addEventListener('focusout', () => {
            paused = false;
        });
        row.addEventListener('wheel', pauseBriefly, { passive: true });
        row.addEventListener('touchstart', pauseBriefly, { passive: true });
        window.addEventListener('resize', buildDots);

        buildDots();
        startAutoScroll();
    });

});

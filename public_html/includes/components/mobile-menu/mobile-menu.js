const menuButton = document.querySelector('#mobile-menu-button');
const menuContents = document.querySelector('#mobile-menu-contents');
let menuHidden = true;

menuContents.addEventListener('animationend', (event) => {
    const animationName = event.animationName;

    switch (animationName) {
        case 'hide-mobile-menu':
            event.target.classList.add('hidden');
            event.target.classList.remove('hide-mobile-menu');
            break;
        
        case 'show-mobile-menu':
            event.target.classList.add('shown');
            event.target.classList.remove('show-mobile-menu');
            break;

        default:
            event.stopPropagation();
            break;
    }
});

function toggleMobileMenu() {
    if (menuContents.classList.contains('show-mobile-menu')
        || menuContents.classList.contains('hide-mobile-menu')) {
        setTimeout(toggleMobileMenu, 20);
        return;
    }

    if (menuHidden) {
        menuContents.classList.remove('hidden');
        menuContents.classList.add('show-mobile-menu');
    }
    else {
        menuContents.classList.remove('show-mobile-menu');
        menuContents.classList.add('hide-mobile-menu');
    }

    menuHidden = !menuHidden;
}
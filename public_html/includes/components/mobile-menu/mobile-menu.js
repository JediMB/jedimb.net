const html = document.querySelector(':root');
const body = document.querySelector('body');
const mobileMenu = document.querySelector('#mobile-menu');
const menuButton = mobileMenu.querySelector('#mobile-menu-button');
const menuContents = mobileMenu.querySelector('#mobile-menu-contents');
const menuItems = Array.from(menuContents.querySelectorAll('a[href]'));

html.addEventListener('click', (e) => {
    if (menuContents.classList.contains('shown') === false)
        return;

    closeMobileMenu();
});
menuContents.addEventListener('click', (e) => e.stopPropagation());

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

const KEYCODE_TAB = 9;
function menuFocusTrap(e) {
    if ( !(e.key === 'Tab' || e.keyCode === KEYCODE_TAB))
        return;

    const checkIndex = e.shiftKey ? 0 : menuItems.length-1;
    const targetIndex = e.shiftKey ? menuItems.length-1 : 0;

    if (document.activeElement === menuItems[checkIndex]) {
        menuItems[targetIndex].focus();
        e.preventDefault();
    }
}

function toggleMobileMenu(e) {
    if (menuContents.classList.contains('hidden'))
        openMobileMenu();
    else if (menuContents.classList.contains('shown'))
        closeMobileMenu();

    e.stopPropagation();
}

function openMobileMenu() {
    menuContents.classList.remove('hidden');
    menuContents.classList.add('show-mobile-menu');
    body.classList.add('fixed');
    body.classList.add('pointer-events-none');
    body.addEventListener('keydown', menuFocusTrap);
}

function closeMobileMenu() {
    menuContents.classList.remove('show-mobile-menu');
    menuContents.classList.add('hide-mobile-menu');
    body.classList.remove('fixed');
    body.classList.remove('pointer-events-none');
    body.removeEventListener('keydown', menuFocusTrap);
}
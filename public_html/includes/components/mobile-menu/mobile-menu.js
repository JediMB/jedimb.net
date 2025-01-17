const html = document.querySelector(':root');
const body = document.querySelector('body');
const mobileMenu = document.querySelector('#mobile-menu');
const menuButton = mobileMenu.querySelector('#mobile-menu-button');
const animatedSvgParts = Array.from(menuButton.querySelectorAll('svg *[style]'));
const menuButtonFrame = menuButton.querySelector('#svg-rect-frame');
const menuContents = mobileMenu.querySelector('#mobile-menu-contents');
const menuItems = Array.from(menuContents.querySelectorAll('a[href]'));

window.addEventListener('resize', () =>
    menuContents.classList.contains('shown') && closeMobileMenu()
);

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

    if (document.activeElement === menuItems[checkIndex]
        || document.activeElement === menuButton
    ) {
        menuItems[targetIndex].focus();
        e.preventDefault();
        return;
    }
}

let hoverAnimation = false;
let activated = false;
menuButtonFrame.addEventListener('mouseover', () => buttonMouseOver());
menuButtonFrame.addEventListener('focus', () => buttonMouseOver());
menuButtonFrame.addEventListener('mouseout', () => buttonMouseOut());
menuButtonFrame.addEventListener('blur', () => buttonMouseOut());

function buttonMouseOver() {
    if (hoverAnimation)
        return;

    hoverAnimation = true;

    if (menuButton.classList.contains('reverting'));
        animatedSvgParts.forEach(part => 
            part.style.cssText = part.style.cssText.replace('third', 'first'));
    
    menuButton.classList.add('animating');
    menuButton.classList.remove('reverting');
    menuButton.addEventListener('animationend', () => {
        if (activated) {
            animatedSvgParts.forEach(part => 
                part.style.cssText = part.style.cssText.replace('first', 'second'));
            menuButton.classList.add('active');
            menuButton.classList.remove('animating');
        }

        hoverAnimation = false;
    }, {once: true});
}

function buttonMouseOut() {
    if (activated)
        return;

    menuButton.classList.remove('animating');
    hoverAnimation = false;
}

function openMobileMenu(e) {
    if (menuContents.classList.contains('hidden')) {
        e.stopPropagation();
        
        if (hoverAnimation) {
            activated = true;
        }
        else if (menuButton.classList.contains('animating')) {
            animatedSvgParts.forEach(part => 
                part.style.cssText = part.style.cssText.replace('first', 'second'));
            menuButton.classList.add('active');
            menuButton.classList.remove('animating');
        }
        else {
            activated = true;
            buttonMouseOver();
        }

        menuContents.classList.remove('hidden');
        menuContents.classList.add('show-mobile-menu');
        body.classList.add('fixed');
        body.classList.add('pointer-events-none');
        body.addEventListener('keydown', menuFocusTrap);

        html.addEventListener('click', () => 
            closeMobileMenu(), {once: true}
        );
    }
}

function closeMobileMenu() {
    if (menuContents.classList.contains('shown')) {
        activated = false;
        animatedSvgParts.forEach(part => 
            part.style.cssText = part.style.cssText.replace('second', 'third'));
        menuButton.classList.add('reverting');
        menuButton.classList.remove('active');
        menuContents.classList.remove('shown');
        menuContents.classList.add('hide-mobile-menu');
        body.classList.remove('fixed');
        body.classList.remove('pointer-events-none');
        body.removeEventListener('keydown', menuFocusTrap);
    }
}
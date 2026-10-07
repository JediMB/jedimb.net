const menuButtons = Array.from(document.querySelectorAll('[id^="menu-button-"]'));
const subMenus = Array.from(document.querySelectorAll('[id^="submenu-"]'));
let activeSubmenuId = -1;

subMenus.forEach(submenu => {
    submenu.addEventListener('animationend', (event) => {
        const animationName = event.animationName;

        switch (animationName) {
            case 'hide-menu':
                event.target.classList.add('hidden');
                event.target.classList.remove('hide-menu');
                showSubMenu();
                break;

            case 'show-menu':
                event.target.classList.remove('show-menu');
                break;

            default:
                event.stopPropagation();
                break;
        }

    });
});

function toggleSubMenu(id, btn) {
    if (isNaN(id)) return;

    activeSubmenuId = id === activeSubmenuId
        ? -1
        : id;

    menuButtons.forEach(menuBtn => menuBtn.classList.remove('selected'));
    
    if (activeSubmenuId >= 0)
        btn.classList.add('selected')

    const submenusToClose = subMenus.filter(
        submenu => submenu.id !== `submenu-${activeSubmenuId}`
        && submenu.classList.contains('hidden') == false
        && submenu.classList.contains('hide-menu') == false
    );

    if (submenusToClose.length > 0) {
        submenusToClose.forEach(submenu => submenu.classList.add('hide-menu'));
        return;
    }

    showSubMenu();
    
}

function showSubMenu() {
    if (activeSubmenuId < 0) return;

    const submenuToOpen = subMenus.find(submenu => submenu.id === `submenu-${activeSubmenuId}`);
    submenuToOpen?.classList.add('show-menu');
    submenuToOpen?.classList.remove('hidden');
}
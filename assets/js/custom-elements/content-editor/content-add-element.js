export default class ContentAddElement extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open'});
        
        const button = document.createElement('button');
        button.type = 'button';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 -960 960 960');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('width', '2em');
        svg.setAttribute('height', '2em');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z');

        svg.appendChild(path);
        button.appendChild(svg);
        shadow.appendChild(button);

        button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('addcontent', { bubbles: true, detail: this }));
        });

        const css = new CSSStyleSheet();
        css.replaceSync(`
            button {
                display: inline flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
        `);
        shadow.adoptedStyleSheets.push(css);
    }

    connectedMoveCallback() {}

    disconnectedCallback() {}
}

customElements.define('content-add', ContentAddElement);
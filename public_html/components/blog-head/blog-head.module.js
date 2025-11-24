export { blogHead as default };

class BlogHead {
    constructor() {
        const component = document.querySelector('blog-head-component');
        const addButton = component.querySelector('[btn-add]');

        const textEditor = component.querySelector('text-editor-component');
        textEditor.addEventListener('change', (event) => console.log(event.detail));
    }
}
const blogHead = new BlogHead();
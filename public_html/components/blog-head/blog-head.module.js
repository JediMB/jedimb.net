export { blogHead as default };

class BlogHead {
    constructor() {
        const component = document.querySelector('blog-head-component');
        const addButton = component.querySelector('[btn-add]');
    }
}
const blogHead = new BlogHead();
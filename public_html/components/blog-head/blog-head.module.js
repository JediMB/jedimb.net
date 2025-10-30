export { blogHead as default };

class BlogHead {
    constructor() {
        const component = document.querySelector('blog-head-component');
        const addButton = component.querySelector('[btn-add]');
        const textBox = component.querySelector('text-box');
        const htmlOutput = component.querySelector('html-output');

        textBox.addEventListener('input', () => {
            htmlOutput.textContent = textBox.innerHTML
                .replace('</div>', '</div>\r\n')
                .replace('</p>', '</p>\r\n');
        });
        
        component.querySelector('[btn-bold]').addEventListener('click', () => {
            const selection = window.getSelection();
            const isInBox = textBox.contains(selection.anchorNode);

            console.log(selection);
            
            if (!isInBox)
                return;

            if (selection.anchorNode !== selection.focusNode)
                return;

            if (selection.anchorNode.nodeType === Node.ELEMENT_NODE) {
                if (selection.anchorNode.tagName === 'B') {
                    const element = selection.anchorNode;
                    const textNode = document.createTextNode(element.textContent);
                    element.parentNode.replaceChild(textNode, element);
                    selection.selectAllChildren(textNode);
                    return;
                }

                const element = document.createElement('b');
                selection.anchorNode.appendChild(element);
                const range = document.createRange();
                range.setStart(element, 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);

                htmlOutput.textContent = textBox.innerHTML
                    .replace('</div>', '</div>\r\n')
                    .replace('</p>', '</p>\r\n');
                return;
            }

            if (selection.anchorNode.nodeType !== Node.TEXT_NODE)
                return;

            const textNode = selection.anchorNode;
            let selectionStart = selection.anchorOffset;
            let selectionEnd = selection.focusOffset;
            if (selectionStart > selectionEnd)
                [selectionStart, selectionEnd] = [selectionEnd, selectionStart];

            if (selection.anchorNode.parentElement.tagName === 'B') {
                const contents = document.createTextNode(selection.anchorNode.data);
                selection.anchorNode.parentElement.parentNode.replaceChild(contents, selection.anchorNode.parentElement);

                htmlOutput.textContent = textBox.innerHTML
                    .replace('</div>', '</div>\r\n')
                    .replace('</p>', '</p>\r\n');
                return;
            }

            const element = document.createElement('b');
            const range = document.createRange();
            range.setStart(textNode, selectionStart);
            range.setEnd(textNode, selectionEnd);
            range.surroundContents(element);
            selection.removeAllRanges();
            selection.selectAllChildren(element);
            console.log(window.getSelection());

            htmlOutput.textContent = textBox.innerHTML
                .replace('</div>', '</div>\r\n')
                .replace('</p>', '</p>\r\n');
        });

    }
}
const blogHead = new BlogHead();
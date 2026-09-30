import __dirname  from 'node:constants'
import fs from 'node:fs';
import { exit } from 'node:process';

class WatchJS {
    static PROJECT_DIR = Object.freeze(fs.realpathSync(`${__dirname}/..`));
    static SOURCE_DIR = Object.freeze(`${this.PROJECT_DIR}/assets/js`);
    static INPUT_FILE = Object.freeze(`${this.SOURCE_DIR}/input.js`);
    static OUTPUT_FILE = Object.freeze(`${this.PROJECT_DIR}/output.js`);

    static REGEX_IMPORT = /(?:^|\s)import\s+.+\s+from\s+["'`]([^"'`]+)["'`]\s*[;\n]/g;
    static REGEX_EXPORT = /^(\s*export\s+(?:default\s+|(?:\*(?:\s+as\s+[\w\d]+)?|{[^}]*})(?:\s+from\s+["'`]([^"'`]*)["'`])?;?)?)/g;

    #filesRead = new Set();

    constructor() {
        let output = this.#readFile(WatchJS.INPUT_FILE);

        console.log('Updating output file...');
        fs.writeFileSync(WatchJS.OUTPUT_FILE, output);
        console.log('Updated!');
    }

    /**
     * @param {string} filePath
     * @returns {string}
     */
    #readFile(filePath) {
        const realPath = fs.realpathSync(filePath);
        const directory = realPath.substring(0, realPath.lastIndexOf('/'));
        
        if (!fs.existsSync(realPath)) {
            console.error(`Input file ('${realPath}') does not exist.`);
            exit(1);
        }

        if (this.#filesRead.has(realPath))
            return '';

        this.#filesRead.add(realPath);
        
        let fileData = fs.readFileSync(realPath, { encoding: 'utf-8' });

        fileData = fileData.replace(WatchJS.REGEX_EXPORT, '');

        const matches = fileData.matchAll(WatchJS.REGEX_IMPORT);

        for (const match of matches) {
            const importPath = match[1].startsWith('/')
                ? `${WatchJS.SOURCE_DIR}${match[1]}`
                : `${directory}/${match[1]}`;
            const importData = this.#readFile(importPath);
            const importComment = `\n\n/* IMPORT: ${match[1]} */\n\n`;

            fileData = fileData.replace(match[0], importComment + importData);
        }

        return fileData;
    }
}
const watchCSS = new WatchJS();
import fs from 'node:fs';
import { exit } from 'node:process';

class WatchJS {
    static PROJECT_DIR = Object.freeze(fs.realpathSync(`${import.meta.dirname}/..`));
    static ASSET_DIR = Object.freeze(`${this.PROJECT_DIR}/assets`);
    static INPUT_FILE = Object.freeze(`${this.ASSET_DIR}/js/input.js`);
    static OUTPUT_FILE = Object.freeze(`${this.PROJECT_DIR}/www/public/js/script.js`);

    static REGEX_IMPORT = /import\s+.+\s+from\s+["'`]([^"'`]+)["'`]\s*[;\n]/g;
    static REGEX_EXPORT_1 = /\bexport\s+(?:default\s+)?((?:function|class|let|var|const)\s+)/g;
    static REGEX_EXPORT_2 = /\bexport\s+(?:default\s+.+|{.*})\s*[\n;]/g;

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
        
        fileData = fileData
            .replaceAll(WatchJS.REGEX_EXPORT_1, '$1')
            .replaceAll(WatchJS.REGEX_EXPORT_2, '');
        
        const matches = fileData.matchAll(WatchJS.REGEX_IMPORT);

        for (const match of matches) {
            const importPath = match[1].startsWith('/')
                ? `${WatchJS.ASSET_DIR}${match[1]}`
                : `${directory}/${match[1]}`;
            try {
                const importData = this.#readFile(importPath);
                const importComment = `\n\n/* IMPORT: ${match[1]} */\n\n`;

                fileData = fileData.replace(match[0], importComment + importData);
            }
            catch(e) {
                console.warn(`WARNING: Couldn't read file (${importPath})`);
            }
        }

        return fileData;
    }
}
const watchCSS = new WatchJS();
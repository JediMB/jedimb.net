import __dirname  from 'node:constants'
import fs from 'node:fs';
import { exit } from 'node:process';

class WatchCSS {
    static PROJECT_DIR = Object.freeze(fs.realpathSync(`${__dirname}/..`));
    static SOURCE_DIR = Object.freeze(`${WatchCSS.PROJECT_DIR}/assets/css`);
    static INPUT_FILE = Object.freeze(`${WatchCSS.SOURCE_DIR}/input.css`);
    static OUTPUT_FILE = Object.freeze(`${this.PROJECT_DIR}/output.css`);

    static REGEX_IMPORT = /@import\s*(?:url\(\s*)?[\"\'\`]([^"'`]+)[\"\'\`][^;]*;/g;

    #filesRead = new Set();

    constructor() {
        let output = this.#readFile(WatchCSS.INPUT_FILE);

        console.log('Updating output file...');
        fs.writeFileSync(WatchCSS.OUTPUT_FILE, output);
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
        const matches = fileData.matchAll(WatchCSS.REGEX_IMPORT);

        for (const match of matches) {
            const importPath = `${directory}/${match[1]}`;
            const importData = this.#readFile(importPath);
            const importComment = `\n\n/* IMPORT: ${match[1]} */\n\n`;

            fileData = fileData.replace(match[0], importComment + importData);
        }

        return fileData;
    }
}
const watchCSS = new WatchCSS();
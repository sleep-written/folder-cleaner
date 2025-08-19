import type { ProgramParamsObject, ConsoleObject } from './interfaces/index.js';

import { Paint } from './paint.js';
import { Byte } from '@utils/byte/index.js';

import chalk from 'chalk';

export class Display {
    #paint = new Paint();
    #programParams: ProgramParamsObject;
    #consoleObject: ConsoleObject;

    constructor(programParams: ProgramParamsObject, consoleObject?: ConsoleObject) {
        this.#programParams = programParams;
        this.#consoleObject = consoleObject ?? console;
    }

    showCurrentValues(): void {
        const extensions = this.#programParams.extensions;
        const targetDir = this.#programParams.targetDir;
        const sizeLimit = this.#programParams.sizeLimit.toString({
            decimals: 2,
            units: [ Byte.tera, Byte.giga, Byte.mega, Byte.kilo ]
        });

        this.#consoleObject.log(chalk.grey(`--extensions:`), this.#paint.primitive(extensions));
        this.#consoleObject.log(chalk.grey(`--size-limit:`), this.#paint.primitive(sizeLimit));
        this.#consoleObject.log(chalk.grey(`--target-dir:`), this.#paint.primitive(targetDir));
    }
}
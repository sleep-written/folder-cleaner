import { homedir } from 'node:os';
import chalk from "chalk";

import { Argv } from '../argv/index.ts';
import { Byte } from '@utils/byte/index.ts';

export interface ArgvObject {
    main: string[];
    flags: Record<string, string[]>;
}

export class ProgramParams {
    #argv: ArgvObject;

    #extensions?: string[] | null;
    get extensions(): string[] | null {
        if (typeof this.#extensions === 'undefined') {
            this.#extensions = this.#getFlagsValues(
                '--extensions',
                '--exts',
                '--ext',
            )
                ?.map(x => x.split(/[^a-z0-9]+/g))
                ?.flat() ?? null;
        }
        
        return this.#extensions;
    }

    #sizeLimit?: Byte;
    get sizeLimit(): Byte {
        if (!(this.#sizeLimit instanceof Byte)) {
            const text = this.#getFlagsValues(
                '--size-limit',
                '--limit'
            )?.[0];

            if (typeof text !== 'string') {
                throw new Error(`The parameter ${chalk.underline('"Size Limit"')} is required`);
            }
            
            this.#sizeLimit = Byte.parse(text);
        }

        return this.#sizeLimit;
    }

    #execute?: boolean | null;
    get execute(): boolean | null {
        if (typeof this.#execute !== 'boolean') {
            const keys = Object.keys(this.#argv.flags);
            this.#execute = [ '--execute', '--exec' ].some(x => 
                keys.includes(x)
            );
        }

        return this.#execute;
    }

    #targetDir?: string;
    get targetDir(): string {
        if (typeof this.#targetDir !== 'string') {
            const text = this.#getFlagsValues(
                '--target-dir',
                '--target'
            )?.[0];

            if (typeof text !== 'string') {
                throw new Error(`The parameter ${chalk.underline('"Target Folder"')} is required`);
            }
            
            const homeRegex = /^~(?=(\\|\/))/;
            this.#targetDir = homeRegex.test(text)
            ?   text.replace(homeRegex, homedir())
            :   text;
        }

        return this.#targetDir;
    }

    constructor(argv?: ArgvObject) {
        this.#argv = argv ?? new Argv();
    }

    #getFlagsValues(name: string, ...more: string[]): string[] | null {
        const names = [ name, ...more ];
        const result = Object
            .entries(this.#argv.flags)
            .filter(([ k ]) => names.includes(k))
            .map(([ _, v ]) => v)
            .flat();

        return result.length > 0
        ?   result
        :   null;
    }
}
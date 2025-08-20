import { Byte } from '@utils/byte/index.js';
import { Argv } from '../argv/index.js';
import { homedir } from 'os';

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

    #sizeLimit?: Byte | null;
    get sizeLimit(): Byte | null {
        if (!(this.#sizeLimit instanceof Byte)) {
            const text = this.#getFlagsValues(
                '--size-limit',
                '--limit'
            )?.[0];

            this.#sizeLimit = typeof text === 'string'
            ?   Byte.parse(text)
            :   null;
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

    #targetDir?: string | null;
    get targetDir(): string | null {
        if (typeof this.#targetDir !== 'string') {
            const text = this.#getFlagsValues(
                '--target-dir',
                '--target'
            )?.[0];

            if (typeof text === 'string') {
                const homeRegex = /^~(?=(\\|\/))/;
                this.#targetDir = homeRegex.test(text)
                ?   text.replace(homeRegex, homedir())
                :   text;
            } else {
                this.#targetDir = null;
            }
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
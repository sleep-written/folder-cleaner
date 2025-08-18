import { Byte } from '@utils/byte/index.js';
import { Argv } from './argv.js';

export interface ArgvObject {
    main: string[];
    flags: Record<string, string[]>;
}

export class ArgvParser {
    #argv: ArgvObject;

    #extensions?: string[] | null;
    get extensions(): string[] | null {
        if (typeof this.#extensions === 'undefined') {
            this.#extensions = this.#argv.flags['--extensions']
                ?.map(x => x.split(/[^a-z0-9]+/g))
                ?.flat() ?? null;
        }
        
        return this.#extensions;
    }

    #limit?: Byte;
    get limit(): Byte {
        if (!(this.#limit instanceof Byte)) {
            const text = this.#argv.flags['--limit']?.[0];
            if (typeof text !== 'string') {
                throw new Error('The flag "--limit" is required');
            } else {
                this.#limit = Byte.parse(text);
            }
        }

        return this.#limit;
    }

    constructor(argv?: ArgvObject) {
        this.#argv = argv ?? new Argv();
    }
}
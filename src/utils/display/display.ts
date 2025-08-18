import type { Byte } from '@utils/byte/index.js'

export interface ArgvParserObject {
    limit: Byte;
    extensions: string[] | null;
}

export class Display {
    #argvParser: ArgvParserObject;

    constructor(argvParser: ArgvParserObject) {
        this.#argvParser = argvParser;
    }
}
import type { FileFromFolderInjector, FileInjector, RmFunction, Stats } from './interfaces/index.js';

import { readdir, rm, stat } from 'fs/promises';
import { resolve } from 'path';
import { Byte } from '@utils/byte/index.js';

export class File {
    static async fromFolder(path: string, recursive?: boolean, inject?: FileFromFolderInjector): Promise<File[]> {
        const readdirFn = inject?.readdir ?? readdir;
        const statFn = inject?.stat ?? stat;
        const dir = await readdirFn(path, { recursive, withFileTypes: true });
        const r = dir
            .filter(x => x.isFile())
            .map(async x => {
                const path = resolve(x.parentPath, x.name);
                const stats = await statFn(path, { bigint: true });
                return new File(path, stats, inject);
            });

        return Promise.all(r);
    }

    #rmFn: RmFunction;

    #path: string;
    get path(): string {
        return this.#path;
    }

    #size: Byte;
    get size(): Byte {
        return this.#size;
    }

    #birthDate: Date;
    get birthDate(): Date {
        return this.#birthDate;
    }

    constructor(path: string, stats: Stats, injector?: FileInjector) {
        this.#rmFn = injector?.rm ?? rm;

        this.#path = path;
        this.#size = new Byte(stats.size);
        this.#birthDate = stats.birthtime;
    }

    async kill(force?: boolean): Promise<void> {
        return this.#rmFn(this.#path, { force });
    }
}
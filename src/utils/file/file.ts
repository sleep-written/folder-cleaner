import type { FileFromFolderOptions, FileFromFolderInjector, FileInjector, RmFunction, Stats } from './interfaces/index.js';

import { readdir, rm, stat } from 'fs/promises';
import { extname, resolve } from 'path';
import { homedir } from 'os';

import { Byte } from '@utils/byte/index.js';

export class File {
    static async fromFolder(
        path: string,
        options?: FileFromFolderOptions,
        inject?: FileFromFolderInjector
    ): Promise<File[]> {
        if (/^~(?=(\\|\/))/.test(path)) {
            path = path.replace(/^~(?=(\\|\/))/, homedir());
        }

        const readdirFunction = inject?.readdir ?? readdir;
        const statFunction = inject?.stat ?? stat;
        const dirents = await readdirFunction(path, {
            recursive: true,
            withFileTypes: true
        });

        const extensions = options?.extensions
            ?.map(x => x.toLowerCase())
            ?.map(x => !x.startsWith('.')
                ?   '.' + x
                :   x
            );



        const files: File[] = [];
        for (const dirent of dirents) {
            // Skip this file
            const extension = extname(dirent.name).toLowerCase();
            if (extensions && !extensions.includes(extension)) {
                continue;
            }

            const path = resolve(dirent.parentPath, dirent.name);
            const stats = await statFunction(path, { bigint: true });
            const file = new File(path, stats, { rm: inject?.rm });

            // Execute a custom function every item
            if (options?.every) {
                await options.every(file);
            }

            files.push(file);
        }

        return files;
    }

    #rmFunction: RmFunction;

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
        this.#rmFunction = injector?.rm ?? rm;

        this.#path = path;
        this.#size = new Byte(stats.size);
        this.#birthDate = stats.birthtime;
    }

    async kill(force?: boolean): Promise<void> {
        return this.#rmFunction(this.#path, { force });
    }
}

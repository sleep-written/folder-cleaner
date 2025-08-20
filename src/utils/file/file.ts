import type { FileFromFolderOptions, FileFromFolderInjector, FileInjector, RmFunction, Stats } from './interfaces/index.js';

import { readdir, rm, stat } from 'fs/promises';
import { basename, extname, resolve } from 'path';
import { homedir } from 'os';

import { Byte } from '@utils/byte/index.js';

export class File {
    static async fromFolder(
        path: string,
        options?: FileFromFolderOptions,
        inject?: FileFromFolderInjector
    ): Promise<File[]> {
        const homeRegex = /^~(?=(\\|\/))/;
        if (homeRegex.test(path)) {
            path = path.replace(homeRegex, homedir());
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

        const statFolder = await statFunction(path);
        if (!statFolder.isDirectory()) {
            throw new Error(`The path "${path}" must be a directory`);
        }

        const files: File[] = [];
        for (const dirent of dirents.filter(x => x.isFile())) {
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

    get filename(): string {
        return basename(this.#path);
    }

    get extension(): string {
        return extname(this.#path);
    }

    #size: Byte;
    get size(): Byte {
        return this.#size;
    }

    #atime: Date;
    get atime(): Date {
        return this.#atime;
    }

    #mtime: Date;
    get mtime(): Date {
        return this.#mtime;
    }

    #ctime: Date;
    get ctime(): Date {
        return this.#ctime;
    }

    #birthDate: Date;
    get birthDate(): Date {
        return this.#birthDate;
    }

    constructor(path: string, stats: Stats, injector?: FileInjector) {
        this.#rmFunction = injector?.rm ?? rm;

        this.#path = path;
        this.#size = new Byte(stats.size);
        this.#atime = stats.atime;
        this.#mtime = stats.mtime;
        this.#ctime = stats.ctime;
        this.#birthDate = stats.birthtime;
    }

    async kill(force?: boolean): Promise<void> {
        return this.#rmFunction(this.#path, { force: !!force });
    }
}

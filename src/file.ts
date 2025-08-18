import type { RmOptions } from 'fs';

import { readdir, rm, stat } from 'fs/promises';
import { resolve } from 'path';
import { Byte } from './byte.js';

export interface ReaddirOptions {
    recursive?: boolean;
    withFileTypes: true;
}

export interface StatOptions {
    bigint?: boolean;
}

export interface Dirent {
    parentPath: string;
    isFile(): boolean;
    name: string;
}

export interface Stats {
    size: number | bigint;
    // atimeMs: number | bigint;
    // mtimeMs: number | bigint;
    // ctimeMs: number | bigint;
    // birthtimeMs: number | bigint;
    // atime: Date;
    // mtime: Date;
    // ctime: Date;
    birthtime: Date;
}

export type ReaddirFn = (path: string, options: ReaddirOptions) => Promise<Dirent[]>;
export type StatFn = (path: string, options: StatOptions) => Promise<Stats>;
export type RmFn = (path: string, options?: RmOptions) => Promise<void>;

export interface FileInjector {
    rm?: RmFn;
}

export interface FileFromFolderInjector extends FileInjector {
    readdir?: ReaddirFn;
    stat?: StatFn;
}

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

    #rmFn: RmFn;

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
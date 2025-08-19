import type { ReaddirFunction } from './readdir.function.js';
import type { FileInjector } from './file.injector.js';
import type { StatFunction } from './stat.function.js';
import type { Dirent } from './dirent.js';
import type { File } from '../file.js';

export interface FileFromFolderInjector extends FileInjector {
    readdir?: ReaddirFunction;
    stat?: StatFunction;

    filter?: (dirent: Dirent) => boolean | Promise<void>;
    every?: (file: File) => void | Promise<void>;
}

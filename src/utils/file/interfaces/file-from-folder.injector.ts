import type { ReaddirFunction } from './readdir.function.js';
import type { FileInjector } from './file.injector.js';
import type { StatFunction } from './stat.function.js';

export interface FileFromFolderInjector extends FileInjector {
    readdir?: ReaddirFunction;
    stat?: StatFunction;
}

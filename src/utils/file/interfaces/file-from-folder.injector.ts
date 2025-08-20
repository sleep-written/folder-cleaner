import type { ReaddirFunction } from './readdir.function.ts';
import type { FileInjector } from './file.injector.ts';
import type { StatFunction } from './stat.function.ts';

export interface FileFromFolderInjector extends FileInjector {
    readdir?: ReaddirFunction;
    stat?: StatFunction;
}

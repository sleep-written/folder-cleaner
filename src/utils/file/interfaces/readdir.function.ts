import type { Dirent } from './dirent.ts';
import type { ReaddirOptions } from './readdir.options.ts';

export type ReaddirFunction = (path: string, options: ReaddirOptions) => Promise<Dirent[]>;
import type { Dirent } from './dirent.js';
import type { ReaddirOptions } from './readdir.options.js';

export type ReaddirFunction = (path: string, options: ReaddirOptions) => Promise<Dirent[]>;
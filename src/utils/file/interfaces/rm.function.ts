import type { RmOptions } from 'fs';

export type RmFunction = (path: string, options?: RmOptions) => Promise<void>;

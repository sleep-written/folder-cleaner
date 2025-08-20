import type { RmOptions } from 'node:fs';

export type RmFunction = (path: string, options?: RmOptions) => Promise<void>;

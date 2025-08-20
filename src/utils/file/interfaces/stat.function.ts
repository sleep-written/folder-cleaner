import type { StatOptions } from './stat.options.ts';
import type { Stats } from './stats.ts';

export type StatFunction = (path: string, options?: StatOptions) => Promise<Stats>;

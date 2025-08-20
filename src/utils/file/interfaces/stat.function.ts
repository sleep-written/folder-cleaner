import type { StatOptions } from './stat.options.js';
import type { Stats } from './stats.js';

export type StatFunction = (path: string, options?: StatOptions) => Promise<Stats>;

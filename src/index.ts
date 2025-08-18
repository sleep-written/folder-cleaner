import { ArgvParser } from '@utils/argv-parser/index.js';
import { Byte } from '@utils/byte/index.js';


const parser = new ArgvParser();
const limit = parser.limit;
const exts = parser.extensions;

console.log('limit:', limit.toString({ unit: Byte.mebi, decimals: 2 }));
console.log('exts: ', exts);